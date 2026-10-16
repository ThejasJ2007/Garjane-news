import nodemailer from 'nodemailer';
import { Language } from './translations';

export interface SendPasswordResetEmailParams {
  to: string;
  name?: string;
  resetUrl: string;
  language?: Language;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

/**
 * Checks whether SMTP credentials are fully configured in the environment.
 */
export function isEmailConfigured(): boolean {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  return Boolean(host && user && pass);
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
  });
}

/**
 * Sends a password reset email using SMTP if configured.
 * When SMTP is not configured, logs the secure reset link for testing in development.
 */
export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  language = 'kn',
}: SendPasswordResetEmailParams): Promise<EmailResult> {
  const from = process.env.EMAIL_FROM?.trim() || 'Garjane News <noreply@garjanenews.com>';

  const subjectMap: Record<Language, string> = {
    kn: 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ - ಗರ್ಜನೆ ನ್ಯೂಸ್ / Password Reset Link - Garjane News',
    hi: 'पासवर्ड रीसेट लिंक - गर्जने न्यूज़ / Password Reset Link - Garjane News',
    en: 'Password Reset Request - Garjane News',
  };

  const subject = subjectMap[language] || subjectMap.kn;

  const greeting = name
    ? language === 'kn'
      ? `ನಮಸ್ಕಾರ ${name},`
      : language === 'hi'
      ? `नमस्ते ${name},`
      : `Hello ${name},`
    : language === 'kn'
    ? 'ನಮಸ್ಕಾರ,'
    : language === 'hi'
    ? 'नमस्ते,'
    : 'Hello,';

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
                    <div style="display: inline-block; width: 44px; height: 44px; background-color: #ffffff; border-radius: 12px; line-height: 44px; text-align: center; margin-bottom: 8px;">
                      <span style="color: #C01A2A; font-size: 24px; font-weight: bold;">ಗ</span>
                    </div>
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
    // If SMTP credentials are not configured, log for development/testing
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[EMAIL_SERVICE] (Development) Password reset link for ${to}:\n${resetUrl}`);
      return {
        success: true,
        simulated: true,
      };
    }

    console.warn(`[EMAIL_SERVICE] (Production Warning) SMTP credentials are not configured. Cannot dispatch email to ${to}.`);
    return {
      success: false,
      error: 'SMTP_NOT_CONFIGURED',
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('[EMAIL_SERVICE] Failed to send password reset email:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'FAILED_TO_SEND_EMAIL',
    };
  }
}
