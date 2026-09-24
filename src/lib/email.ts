import net from 'net';
import tls from 'tls';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendMailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  previewUrl?: string;
}

/**
 * Send an email via SMTP (Supports Gmail, Outlook, Amazon SES, SendGrid, or custom hospital SMTP)
 * Zero external dependencies — built using standard Node.js net/tls sockets.
 */
export async function sendMail({ to, subject, html, text }: SendMailOptions): Promise<SendMailResult> {
  const host = process.env.SMTP_HOST || '';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.SMTP_FROM || `"Al Insaf General Hospital" <${user || 'noreply@alinsafhospital.com'}>`;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  // Check if SMTP is configured with real credentials
  const isConfigured = host && user && pass && !user.includes('your_email') && !pass.includes('your_app_password');

  if (!isConfigured) {
    console.log('\n==================================================');
    console.log('📧 [EMAIL SIMULATION / DEV MODE - SMTP NOT CONFIGURED]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${from}`);
    console.log('--------------------------------------------------');
    console.log(text || html);
    console.log('==================================================\n');
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
    };
  }

  return new Promise<SendMailResult>((resolve) => {
    try {
      const socket = secure
        ? tls.connect({ host, port, servername: host }, onConnect)
        : net.connect({ host, port }, onConnect);

      let step = 0;
      let secureSocket: tls.TLSSocket | null = null;
      let activeSocket: net.Socket | tls.TLSSocket = socket;

      function onConnect() {
        // Connected, waiting for server 220 banner
      }

      function sendCommand(cmd: string) {
        activeSocket.write(cmd + '\r\n');
      }

      activeSocket.on('data', (data) => {
        const response = data.toString();
        const code = parseInt(response.slice(0, 3), 10);

        if (code >= 400 && step < 99) {
          activeSocket.end();
          resolve({ success: false, error: `SMTP Error (${code}): ${response.trim()}` });
          return;
        }

        switch (step) {
          case 0: // 220 Server Greeting
            step = 1;
            sendCommand(`EHLO ${host || 'localhost'}`);
            break;

          case 1: // 250 EHLO Response
            if (!secure && response.includes('STARTTLS')) {
              step = 2;
              sendCommand('STARTTLS');
            } else {
              step = 3;
              sendCommand('AUTH LOGIN');
            }
            break;

          case 2: // 220 STARTTLS Ready
            secureSocket = tls.connect({
              socket: socket,
              host: host,
              servername: host,
            });

            activeSocket = secureSocket;
            activeSocket.on('data', (tlsData) => {
              const tlsRes = tlsData.toString();
              const tlsCode = parseInt(tlsRes.slice(0, 3), 10);

              if (step === 2) {
                step = 1;
                sendCommand(`EHLO ${host || 'localhost'}`);
              }
            });

            step = 1;
            sendCommand(`EHLO ${host || 'localhost'}`);
            break;

          case 3: // 334 Username Challenge
            step = 4;
            sendCommand(Buffer.from(user).toString('base64'));
            break;

          case 4: // 334 Password Challenge
            step = 5;
            sendCommand(Buffer.from(pass).toString('base64'));
            break;

          case 5: // 235 Authentication Succeeded
            step = 6;
            // Extract email address from 'from' string
            const fromEmail = from.match(/<([^>]+)>/)?.[1] || from;
            sendCommand(`MAIL FROM:<${fromEmail}>`);
            break;

          case 6: // 250 Sender OK
            step = 7;
            sendCommand(`RCPT TO:<${to}>`);
            break;

          case 7: // 250 Recipient OK
            step = 8;
            sendCommand('DATA');
            break;

          case 8: // 354 Start mail input
            step = 9;
            const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2)}@alinsafhospital.com>`;
            const emailBody = [
              `From: ${from}`,
              `To: ${to}`,
              `Subject: ${subject}`,
              `Date: ${new Date().toUTCString()}`,
              `Message-ID: ${messageId}`,
              `MIME-Version: 1.0`,
              `Content-Type: text/html; charset=UTF-8`,
              '',
              html,
              '',
              '.',
            ].join('\r\n');

            sendCommand(emailBody);
            break;

          case 9: // 250 Message accepted
            step = 10;
            sendCommand('QUIT');
            activeSocket.end();
            resolve({ success: true, messageId: `sent-${Date.now()}` });
            break;

          default:
            break;
        }
      });

      activeSocket.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });

      activeSocket.setTimeout(15000, () => {
        activeSocket.destroy();
        resolve({ success: false, error: 'SMTP connection timed out after 15s' });
      });
    } catch (err: any) {
      resolve({ success: false, error: err.message });
    }
  });
}

/**
 * Generate Hospital Password Reset Email Template
 */
export function getPasswordResetHtmlTemplate(resetUrl: string, adminName: string): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Reset Your Password - Al Insaf General Hospital</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <!-- Header Banner -->
            <tr>
              <td style="background-color: #384349; padding: 32px 40px; text-align: center;">
                <div style="display: inline-block; background-color: #0b9e53; color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 14px; font-weight: bold; font-size: 24px; margin-bottom: 12px;">+</div>
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">AL INSAF GENERAL HOSPITAL</h1>
                <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Administrator Security Service</p>
              </td>
            </tr>

            <!-- Main Body -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Password Recovery Request</h2>
                <p style="color: #475569; font-size: 14px; line-height: 24px; margin-bottom: 24px;">
                  Hello <strong>${adminName}</strong>,<br><br>
                  We received a request to reset the administrator password for your account at <strong>Al Insaf General Hospital Management System</strong>.
                </p>

                <div style="text-align: center; margin: 32px 0;">
                  <a href="${resetUrl}" style="background-color: #0b9e53; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(11, 158, 83, 0.3);">
                    Reset Administrator Password
                  </a>
                </div>

                <p style="color: #64748b; font-size: 12px; line-height: 20px;">
                  If the button above does not work, copy and paste this secure URL directly into your browser:
                  <br>
                  <a href="${resetUrl}" style="color: #0b9e53; word-break: break-all;">${resetUrl}</a>
                </p>

                <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 12px; padding: 16px; margin-top: 24px;">
                  <p style="color: #92400e; font-size: 12px; margin: 0; font-weight: 600;">
                    ⚠️ Important Security Notice:
                  </p>
                  <p style="color: #b45309; font-size: 12px; margin: 4px 0 0 0;">
                    • This reset link is single-use and will expire in <strong>15 minutes</strong>.<br>
                    • If you did not request this password reset, please ignore this email or notify the hospital IT department immediately.
                  </p>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                  © ${new Date().getFullYear()} Al Insaf General Hospital Ltd. All rights reserved.
                  <br>
                  House: 08, Road: 02, Dhanmondi, Dhaka-1205, Bangladesh | Hotline: 09666 787800
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
