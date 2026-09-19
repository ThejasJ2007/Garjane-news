import { NextResponse } from 'next/server';
import { isDatabaseConnected } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isConnected = await isDatabaseConnected();

  if (!isConnected) {
    return NextResponse.json(
      {
        status: 'degraded',
        app: 'Garjane News',
        environment: process.env.NODE_ENV || 'development',
        database: 'unavailable (fallback mode)',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      status: 'healthy',
      app: 'Garjane News',
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
