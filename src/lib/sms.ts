// Login OTP via Fast2SMS. We generate the code; Fast2SMS only delivers it.
// .env.local: FAST2SMS_API_KEY (required in production), FAST2SMS_URL (optional override).
// Without a key in development the OTP is printed to the server console instead.

const DEFAULT_URL = 'https://www.fast2sms.com/dev/bulkV2';

export async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const key = process.env.FAST2SMS_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[dev] OTP for ${phone}: ${code}`);
      return true;
    }
    console.error('FAST2SMS_API_KEY is not set');
    return false;
  }

  try {
    const res = await fetch(process.env.FAST2SMS_URL || DEFAULT_URL, {
      method: 'POST',
      headers: { authorization: key, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ route: 'otp', variables_values: code, numbers: phone }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.return === false) {
      console.error('Fast2SMS send failed', res.status, data);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Fast2SMS send failed', err);
    return false;
  }
}
