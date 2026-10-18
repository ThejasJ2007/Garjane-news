import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { Language } from './translations';

export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
  language?: Language;
}

export type EmailFailureCategory =
  | 'SMTP_CONFIG_MISSING'
  | 'SMTP_CONNECTION_FAILED'
  | 'SMTP_AUTH_FAILED'
  | 'SMTP_SENDER_REJECTED'
  | 'SMTP_SUBMISSION_ACCEPTED'
  | 'UNKNOWN_ERROR';

export interface EmailResult {
  success: boolean;
  category: EmailFailureCategory;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export interface SmtpDiagnostic {
  configured: boolean;
  variables: {
    SMTP_HOST: boolean;
    SMTP_PORT: boolean;
    SMTP_USER: boolean;
    SMTP_PASSWORD: boolean;
    EMAIL_FROM: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
  };
  missingRequiredVariables: string[];
  hostConfigured: boolean;
  senderDomain?: string;
  port: number;
  secure: boolean;
  connectionStatus: 'NOT_CONFIGURED' | 'CONNECTED' | 'AUTH_FAILED' | 'CONNECTION_FAILED' | 'SENDER_REJECTED' | 'ERROR';
  diagnosticMessage: string;
  errorCode?: string;
}

/**
 * Safely masks an email address for logging without leaking personal identity.
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  const visible = local.length <= 2 ? `${local[0]}*` : `${local[0]}***${local[local.length - 1]}`;
  return `${visible}@${domain}`;
}

/**
 * Returns names of missing required SMTP environment variables.
 */
export function getMissingSmtpVariables(): string[] {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST?.trim()) missing.push('SMTP_HOST');
  if (!process.env.SMTP_PORT?.trim()) missing.push('SMTP_PORT');
  if (!process.env.SMTP_USER?.trim()) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASSWORD?.trim()) missing.push('SMTP_PASSWORD');
  return missing;
}

/**
 * Checks whether SMTP credentials are fully configured in the environment.
 */
export function isEmailConfigured(): boolean {
  return getMissingSmtpVariables().length === 0;
}

/**
 * Categorizes nodemailer errors safely for production diagnostics.
 */
function categorizeSmtpError(err: any): EmailFailureCategory {
  if (!err) return 'UNKNOWN_ERROR';
  const code = (err.code || '').toUpperCase();
  const responseCode = Number(err.responseCode);
  const msg = (err.message || '').toLowerCase();

  if (
    code === 'EAUTH' ||
    responseCode === 535 ||
    msg.includes('auth') ||
    msg.includes('username and password not accepted') ||
    msg.includes('badcredentials') ||
    msg.includes('invalid login')
  ) {
    return 'SMTP_AUTH_FAILED';
  }

  if (
    code === 'EENVELOPE' ||
    responseCode === 550 ||
    responseCode === 553 ||
    responseCode === 554 ||
    msg.includes('sender') ||
    msg.includes('unverified') ||
    msg.includes('not authorized')
  ) {
    return 'SMTP_SENDER_REJECTED';
  }

  if (
    code === 'ETIMEDOUT' ||
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ESOCKET' ||
    code === 'ECONNRESET' ||
    msg.includes('timeout') ||
    msg.includes('connect')
  ) {
    return 'SMTP_CONNECTION_FAILED';
  }

  return 'UNKNOWN_ERROR';
}

/**
 * Sanitizes error messages to prevent accidental exposure of tokens or passwords.
 */
function sanitizeErrorMessage(msg: string): string {
  return msg
    .replace(/password[:=]\s*\S+/gi, 'password:[REDACTED]')
    .replace(/pass[:=]\s*\S+/gi, 'pass:[REDACTED]')
    .replace(/bearer\s+\S+/gi, 'bearer [REDACTED]')
    .replace(/token=[a-zA-Z0-9._-]+/gi, 'token=[REDACTED]');
}

/**
 * Creates and returns a Nodemailer transporter instance if SMTP is configured.
 */
export function getEmailTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseInt(process.env.SMTP_PORT?.trim() || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Safely inspects SMTP configuration and verifies live connection without leaking secrets.
 */
export async function getSmtpDiagnosticStatus(): Promise<SmtpDiagnostic> {
  const host = process.env.SMTP_HOST?.trim();
  const portStr = process.env.SMTP_PORT?.trim();
  const port = parseInt(portStr || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.EMAIL_FROM?.trim() || 'Garjane News <noreply@garjanenews.com>';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  const missing = getMissingSmtpVariables();
  const configured = missing.length === 0;
  const senderDomain = from.includes('@') ? from.split('@')[1].replace(/>.*/, '').trim() : undefined;

  const base: SmtpDiagnostic = {
    configured,
    variables: {
      SMTP_HOST: Boolean(host),
      SMTP_PORT: Boolean(portStr),
      SMTP_USER: Boolean(user),
      SMTP_PASSWORD: Boolean(pass),
      EMAIL_FROM: Boolean(from),
      NEXT_PUBLIC_APP_URL: Boolean(appUrl),
    },
    missingRequiredVariables: missing,
    hostConfigured: Boolean(host),
    senderDomain,
    port,
    secure: port === 465,
    connectionStatus: configured ? 'ERROR' : 'NOT_CONFIGURED',
    diagnosticMessage: configured
      ? 'SMTP variables configured; verification ready.'
      : `SMTP configuration incomplete. Missing variables: ${missing.join(', ')}`,
  };

  if (!configured) {
    return base;
  }

  try {
    const transporter = getEmailTransporter();
    if (!transporter) {
      return {
        ...base,
        connectionStatus: 'NOT_CONFIGURED',
        diagnosticMessage: 'Transporter creation failed due to missing credentials.',
      };
    }

    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP verification timed out after 8000ms')), 8000)
      ),
    ]);

    return {
      ...base,
      connectionStatus: 'CONNECTED',
      diagnosticMessage: 'SMTP transport successfully connected and authenticated with mail server.',
    };
  } catch (err: any) {
    const category = categorizeSmtpError(err);
    const safeMsg = sanitizeErrorMessage(err?.message || 'Verification failed');
    return {
      ...base,
      connectionStatus:
        category === 'SMTP_AUTH_FAILED'
          ? 'AUTH_FAILED'
          : category === 'SMTP_CONNECTION_FAILED'
          ? 'CONNECTION_FAILED'
          : category === 'SMTP_SENDER_REJECTED'
          ? 'SENDER_REJECTED'
          : 'ERROR',
      errorCode: err?.code || 'UNKNOWN',
      diagnosticMessage: `SMTP verification failed (${category}): ${safeMsg}`,
    };
  }
}

/**
 * Sends a password reset email using SMTP if configured.
 * Categorizes and logs diagnostics safely without leaking tokens, secrets, or passwords.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  language = 'kn',
}: SendPasswordResetEmailParams): Promise<EmailResult> {
  const from = process.env.EMAIL_FROM?.trim() || 'Garjane News <noreply@garjanenews.com>';
  const maskedTo = maskEmail(to);

  const subjectMap: Record<Language, string> = {
    kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ - ಗರ್ಜನೆ ನ್ಯೂಸ್ / Password Reset Link - Garjane News',
    en: 'Password Reset Request - Garjane News',
  };

  const subject = subjectMap[language] || subjectMap.kn;

  const greeting = name
    ? language === 'kn'
      ? `ನಮಸ್ಕಾರ ${name},`
      : `Hello ${name},`
    : language === 'kn'
    ? 'ನಮಸ್ಕಾರ,'
    : 'Hello,';

  const logoPath = path.join(process.cwd(), 'public', 'images', 'Garjane-news-logo.png');
  const hasLocalLogo = fs.existsSync(logoPath);
  const appBaseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://garjanenews.com').replace(/\/+$/, '');
  const logoSrc = hasLocalLogo ? 'cid:garjane-news-logo' : `${appBaseUrl}/images/Garjane-news-logo.png`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #C01A2A; padding: 24px 32px; text-align: center;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 12px auto;">
                      <tr>
                        <td align="center">
                          <img
                            src="${logoSrc}"
                            alt="Garjane News Logo"
                            width="64"
                            height="64"
                            style="display: block; width: 64px; height: 64px; max-width: 64px; border-radius: 14px; border: 0; outline: none; text-decoration: none;"
                          />
                        </td>
                      </tr>
                    </table>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.01em;">ಗರ್ಜನೆ ನ್ಯೂಸ್ &bull; Garjane News</h1>
                    <p style="margin: 4px 0 0 0; color: #fecdd3; font-size: 12px;">ನಿಮ್ಮ ಊರಿನ ಸುದ್ದಿ, ನಿಮ್ಮ ಧ್ವನಿ</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">${greeting}</p>
              
              <p style="margin: 0 0 12px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                ನಿಮ್ಮ ಗರ್ಜನೆ ನ್ಯೂಸ್ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ವಿನಂತಿ ಬಂದಿದೆ. ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #64748b;">
                We received a request to reset the password for your Garjane News account. Click the button below to set a new password:
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #C01A2A; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 2px 6px rgba(192, 26, 42, 0.35);">
                      ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ / Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Note -->
              <div style="background-color: #f1f5f9; border-left: 4px solid #C01A2A; padding: 12px 16px; border-radius: 6px; margin: 24px 0 16px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #475569;">
                  <strong>ಗಮನಿಸಿ / Note:</strong> ಈ ಲಿಂಕ್ 60 ನಿಮಿಷಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ ಮತ್ತು ಒಮ್ಮೆ ಮಾತ್ರ ಬಳಸಬಹುದು.<br>
                  This link is valid for <strong>60 minutes</strong> and can only be used once.
                </p>
              </div>

              <!-- Fallback Link -->
              <p style="margin: 20px 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                ಬಟನ್ ಕೆಲಸ ಮಾಡದಿದ್ದರೆ, ಕೆಳಗಿನ ಲಿಂಕ್ ಅನ್ನು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನಕಲಿಸಿ ತೆರೆಯಿರಿ:<br>
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px 0; word-break: break-all; font-size: 12px;">
                <a href="${resetUrl}" style="color: #C01A2A; text-decoration: underline;">${resetUrl}</a>
              </p>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

              <!-- Security Note -->
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                ನೀವು ಈ ವಿನಂತಿಯನ್ನು ಮಾಡಿಲ್ಲದಿದ್ದರೆ, ಈ ಇಮೇಲ್ ಅನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ. ನಿಮ್ಮ ಖಾತೆಯು ಸುರಕ್ಷಿತವಾಗಿರುತ್ತದೆ.<br>
                If you did not request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Garjane News (ಗರ್ಜನೆ ನ್ಯೂಸ್) &bull; Nelamangala, Bengaluru Rural, Karnataka
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
${greeting}

ನಿಮ್ಮ ಗರ್ಜನೆ ನ್ಯೂಸ್ ಖಾತೆಯ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಲು ವಿನಂತಿ ಬಂದಿದೆ.
We received a request to reset the password for your Garjane News account.

ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಲು ಕೆಳಗಿನ ಲಿಂಕ್ ಬಳಸಿ (Use the following link to reset your password):
${resetUrl}

ಗಮನಿಸಿ: ಈ ಲಿಂಕ್ 60 ನಿಮಿಷಗಳವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ ಮತ್ತು ಒಮ್ಮೆ ಮಾತ್ರ ಬಳಸಬಹುದು.
Note: This link is valid for 60 minutes and can only be used once.

ನೀವು ಈ ವಿನಂತಿಯನ್ನು ಮಾಡಿಲ್ಲದಿದ್ದರೆ, ಈ ಇಮೇಲ್ ಅನ್ನು ನಿರ್ಲಕ್ಷಿಸಿ.
If you did not request a password reset, please ignore this email.

--
Garjane News (ಗರ್ಜನೆ ನ್ಯೂಸ್)
  `.trim();

  const transporter = getEmailTransporter();

  if (!transporter) {
    const missing = getMissingSmtpVariables();
    console.warn(
      `[EMAIL_SERVICE] [DIAGNOSTIC] Operation: sendPasswordResetEmail | Status: SKIPPED | Category: SMTP_CONFIG_MISSING | Recipient: ${maskedTo} | Missing: ${missing.join(', ')}`
    );

    return {
      success: false,
      category: 'SMTP_CONFIG_MISSING',
      error: `SMTP credentials not configured. Missing variables: ${missing.join(', ')}`,
    };
  }

  try {
    const attachments = [];
    if (hasLocalLogo) {
      attachments.push({
        filename: 'Garjane-news-logo.png',
        path: logoPath,
        cid: 'garjane-news-logo',
      });
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    const acceptedCount = Array.isArray(info.accepted) ? info.accepted.length : 0;
    const rejectedCount = Array.isArray(info.rejected) ? info.rejected.length : 0;

    if (rejectedCount > 0 && acceptedCount === 0) {
      console.error(
        `[EMAIL_SERVICE] [DIAGNOSTIC] Operation: sendPasswordResetEmail | Status: REJECTED | Category: SMTP_SENDER_REJECTED | Recipient: ${maskedTo} | Response: ${info.response || 'Rejected'}`
      );
      return {
        success: false,
        category: 'SMTP_SENDER_REJECTED',
        messageId: info.messageId,
        error: 'Recipient was rejected by mail server',
      };
    }

    console.log(
      `[EMAIL_SERVICE] [DIAGNOSTIC] Operation: sendPasswordResetEmail | Status: ACCEPTED | Category: SMTP_SUBMISSION_ACCEPTED | Recipient: ${maskedTo} | MessageId: ${info.messageId || 'unknown'} | Response: ${info.response || 'OK'}`
    );

    return {
      success: true,
      category: 'SMTP_SUBMISSION_ACCEPTED',
      messageId: info.messageId,
    };
  } catch (err: any) {
    const category = categorizeSmtpError(err);
    const safeMsg = sanitizeErrorMessage(err?.message || 'Failed to dispatch email');

    console.error(
      `[EMAIL_SERVICE] [DIAGNOSTIC] Operation: sendPasswordResetEmail | Status: FAILED | Category: ${category} | Recipient: ${maskedTo} | Code: ${err?.code || 'UNKNOWN'} | Message: ${safeMsg}`
    );

    return {
      success: false,
      category,
      error: safeMsg,
    };
  }
}

