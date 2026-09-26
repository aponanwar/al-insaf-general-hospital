/**
 * Multi-Gateway SMS Service for Al Insaf General Hospital
 * Supported BD & Global Gateways:
 *  1. Greenweb BD (greenweb.com.bd) - Default/Most familiar in Bangladesh
 *  2. BulkSMS BD (bulksmsbd.com)
 *  3. Alpha SMS / Dianahost (sms.net.bd)
 *  4. SSL Wireless (sslwireless.com)
 *  5. Twilio (Global)
 *  6. Simulation Mode (Fallback when no API key is set)
 */

export interface SendSmsOptions {
  to: string;
  message: string;
  senderId?: string;
}

export interface SmsResult {
  success: boolean;
  provider: string;
  messageId?: string;
  response?: string;
  error?: string;
  simulated?: boolean;
}

export interface AppointmentSmsParams {
  phone: string;
  patientName: string;
  serialNumber: number;
  trackingId: string;
  doctorName: string;
  department?: string;
  appointmentDate: string;
  timeSlot: string;
  roomNumber?: string;
}

/**
 * Normalize Bangladeshi phone number to international / standard format
 * e.g. "01712-345678" -> "8801712345678" or "01712345678"
 */
export function normalizeBdPhone(phone: string, withCountryCode = true): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('880')) {
    return withCountryCode ? cleaned : cleaned.substring(2);
  }
  if (cleaned.startsWith('0')) {
    return withCountryCode ? '88' + cleaned : cleaned;
  }
  if (cleaned.length === 10) {
    return withCountryCode ? '880' + cleaned : '0' + cleaned;
  }
  return cleaned;
}

/**
 * Generate formatted SMS text for doctor appointment confirmation
 */
export function buildAppointmentSmsText(params: AppointmentSmsParams): string {
  const serialFormatted = String(params.serialNumber).padStart(2, '0');
  
  return `আল-ইনসাফ জেনারেল হাসপাতাল
সিরিয়াল কনফার্মেশন:
সিরিয়াল নং: #${serialFormatted}
ট্র্যাকিং: ${params.trackingId}
রোগী: ${params.patientName}
ডাক্তার: ${params.doctorName}
তারিখ: ${params.appointmentDate} (${params.timeSlot})
চেম্বার: ${params.roomNumber || '১ম তলা, ওপিডি'}
জরুরি প্রয়োজনে: 01303-359905, 01913-129020`;
}

/**
 * Universal SMS Sender supporting multiple gateway providers
 */
export async function sendSms({ to, message, senderId }: SendSmsOptions): Promise<SmsResult> {
  const provider = (process.env.SMS_GATEWAY_PROVIDER || 'greenweb').toLowerCase().trim();
  const apiKey =
    process.env.SMS_API_KEY ||
    process.env.GREENWEB_TOKEN ||
    process.env.BULKSMSBD_API_KEY ||
    process.env.ALPHASMS_API_KEY ||
    process.env.SSLWIRELESS_API_TOKEN ||
    '';

  const defaultSenderId =
    senderId ||
    process.env.SMS_SENDER_ID ||
    process.env.BULKSMSBD_SENDER_ID ||
    process.env.ALPHASMS_SENDER_ID ||
    process.env.SSLWIRELESS_SID ||
    '';

  // If no API Key is provided, operate gracefully in Dev/Simulation Mode
  if (!apiKey || apiKey.includes('your_') || apiKey === '') {
    console.log('\n======================================================');
    console.log(`📱 [SMS SIMULATION / DEV MODE - GATEWAY: ${provider.toUpperCase()}]`);
    console.log(`To: ${to} (Normalized: ${normalizeBdPhone(to)})`);
    console.log(`Sender ID: ${defaultSenderId || 'Default'}`);
    console.log('------------------------------------------------------');
    console.log(message);
    console.log('======================================================\n');

    return {
      success: true,
      provider: `${provider} (Simulated)`,
      messageId: `SIM-${Date.now()}`,
      simulated: true,
      response: 'SMS Simulated successfully. Add SMS_API_KEY to send real SMS.',
    };
  }

  const normalizedPhone = normalizeBdPhone(to, true); // e.g. 88017xxxxxxxx
  const localPhone = normalizeBdPhone(to, false);    // e.g. 017xxxxxxxx

  try {
    switch (provider) {
      // 1. GREENWEB BD (Most popular gateway in Bangladesh)
      case 'greenweb':
      case 'greenwebbd': {
        const url = 'https://api.greenweb.com.bd/api.php';
        const formData = new URLSearchParams();
        formData.append('token', apiKey);
        formData.append('to', normalizedPhone);
        formData.append('message', message);

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        const text = await response.text();

        // Greenweb returns JSON or status strings
        const isSuccess = response.ok && !text.toLowerCase().includes('error');
        return {
          success: isSuccess,
          provider: 'Greenweb BD',
          response: text,
          error: isSuccess ? undefined : text,
        };
      }

      // 2. BULKSMS BD (bulksmsbd.net)
      case 'bulksmsbd':
      case 'bulksms': {
        const url = 'http://bulksmsbd.net/api/smsapi';
        const formData = new URLSearchParams();
        formData.append('api_key', apiKey);
        formData.append('type', 'text');
        formData.append('number', normalizedPhone);
        formData.append('senderid', defaultSenderId || '8809612xxxxxx');
        formData.append('message', message);

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        const data = await response.text();
        const isSuccess = response.ok && (data.includes('success') || data.includes('200') || data.includes('response_code":202'));

        return {
          success: isSuccess,
          provider: 'BulkSMS BD',
          response: data,
          error: isSuccess ? undefined : data,
        };
      }

      // 3. ALPHA SMS / SMS.NET.BD (dianahost / alphasms)
      case 'alphasms':
      case 'smsnetbd': {
        const url = 'https://api.sms.net.bd/sendsms';
        const formData = new URLSearchParams();
        formData.append('api_key', apiKey);
        formData.append('msg', message);
        formData.append('to', normalizedPhone);
        if (defaultSenderId) formData.append('sender_id', defaultSenderId);

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        const isSuccess = response.ok && (data.error === 0 || data.status === 'success');

        return {
          success: isSuccess,
          provider: 'Alpha SMS',
          response: JSON.stringify(data),
          error: isSuccess ? undefined : data.msg || 'AlphaSMS error',
        };
      }

      // 4. SSL WIRELESS
      case 'sslwireless':
      case 'ssl': {
        const url = 'https://smsplus.sslwireless.com/api/v3/send-sms';
        const payload = {
          api_token: apiKey,
          sid: defaultSenderId || 'ALINSAF_NON_MASK',
          msisdn: normalizedPhone,
          sms: message,
          csms_id: `AIGH_${Date.now()}`,
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        const isSuccess = response.ok && (data.status === 'SUCCESS' || data.status_code === 200);

        return {
          success: isSuccess,
          provider: 'SSL Wireless',
          response: JSON.stringify(data),
          error: isSuccess ? undefined : data.error_message || 'SSL Wireless error',
        };
      }

      // 5. TWILIO
      case 'twilio': {
        const accountSid = process.env.TWILIO_ACCOUNT_SID || apiKey;
        const authToken = process.env.TWILIO_AUTH_TOKEN || '';
        const fromPhone = process.env.TWILIO_PHONE_NUMBER || defaultSenderId;

        const authString = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

        const formData = new URLSearchParams();
        formData.append('To', `+${normalizedPhone}`);
        formData.append('From', fromPhone);
        formData.append('Body', message);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });

        const data = await response.json();
        const isSuccess = response.ok && !data.error_code;

        return {
          success: isSuccess,
          provider: 'Twilio',
          messageId: data.sid,
          response: JSON.stringify(data),
          error: isSuccess ? undefined : data.message,
        };
      }

      // Fallback
      default: {
        return {
          success: false,
          provider,
          error: `Unsupported SMS provider: "${provider}". Use greenweb, bulksmsbd, alphasms, sslwireless, or twilio.`,
        };
      }
    }
  } catch (err: any) {
    console.error(`Error sending SMS via ${provider}:`, err);
    return {
      success: false,
      provider,
      error: err.message || 'Network error sending SMS',
    };
  }
}

/**
 * Helper to send appointment serial SMS
 */
export async function sendAppointmentSms(params: AppointmentSmsParams): Promise<SmsResult> {
  const message = buildAppointmentSmsText(params);
  return sendSms({
    to: params.phone,
    message,
  });
}
