import { NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/prisma';
import { getSmtpDiagnosticStatus } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET() {
  const [isConnected, smtpStatus] = await Promise.all([
    isDatabaseConnected(),
    getSmtpDiagnosticStatus().catch((err) => ({
      configured: false,
      variables: {
        SMTP_HOST: false,
        SMTP_PORT: false,
        SMTP_USER: false,
        SMTP_PASSWORD: false,
        EMAIL_FROM: false,
        NEXT_PUBLIC_APP_URL: false,
      },
      missingRequiredVariables: ['UNKNOWN'],
      hostConfigured: false,
      port: 587,
      secure: false,
      connectionStatus: 'ERROR' as const,
      diagnosticMessage: 'SMTP diagnostic error: ' + (err?.message || 'unknown'),
    })),
  ]);

  const overallStatus = !isConnected
    ? 'degraded'
    : !smtpStatus.configured
    ? 'healthy_email_not_configured'
    : smtpStatus.connectionStatus === 'CONNECTED'
    ? 'healthy'
    : 'healthy_email_warning';

  return NextResponse.json(
    {
      status: overallStatus,
      app: 'Garjane News',
      environment: process.env.NODE_ENV || 'development',
      database: isConnected ? 'connected' : 'unavailable (fallback mode)',
      email: smtpStatus,
      timestamp: new Date().toISOString(),
    },
    { status: isConnected ? 200 : 503 }
  );
}

