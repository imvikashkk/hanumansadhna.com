import { NextRequest, NextResponse } from 'next/server';
import { GENDERS, MAX_AGE, MIN_AGE, PHONE_RE, SANKALP_QUESTIONS } from '@/data/signup';
import { setSessionCookie, signToken } from '@/lib/auth';
import { query } from '@/lib/db';
import { migrate } from '@/lib/migrate';

interface UserRow { id: number; phone: string; is_paid: boolean }

// Signup needs no OTP — it only opens a session for an unpaid number. A number that
// has already paid must log in with OTP, so nobody can take over a paid account.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = String(body.phone ?? '').trim();
    const name = typeof body.name === 'string' ? body.name.trim().replace(/\s+/g, ' ') : '';
    const city = typeof body.city === 'string' ? body.city.trim().replace(/\s+/g, ' ') : '';
    const age = Number(body.age);
    const gender = String(body.gender ?? '');
    const answers = (body.sankalp ?? {}) as Record<string, unknown>;

    if (!PHONE_RE.test(phone)) return bad('कृपया सही 10 अंकों का मोबाइल नंबर डालें');
    if (!name || name.length > 100) return bad('कृपया अपना नाम डालें');
    if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) return bad(`उम्र ${MIN_AGE} से ${MAX_AGE} के बीच होनी चाहिए`);
    if (!GENDERS.some((g) => g.id === gender)) return bad('कृपया लिंग चुनें');
    if (!city || city.length > 100) return bad('कृपया अपना शहर डालें');
    if (!SANKALP_QUESTIONS.every((q) => answers[q.id] === true)) return bad('साधक बनने के लिए सभी संकल्प स्वीकार करें');

    const sankalp = Object.fromEntries(SANKALP_QUESTIONS.map((q) => [q.id, true]));

    await migrate();
    const existing = await query<UserRow>(`SELECT id, phone, is_paid FROM users WHERE phone=$1`, [phone]);
    if (existing[0]?.is_paid) {
      return NextResponse.json(
        { error: 'यह नंबर पहले से साधक परिवार में जुड़ा है — कृपया Login करें', login: true },
        { status: 409 }
      );
    }

    const users = existing.length
      ? await query<UserRow>(
          `UPDATE users SET name=$1, age=$2, gender=$3, city=$4, sankalp=$5 WHERE id=$6 RETURNING id, phone, is_paid`,
          [name, age, gender, city, sankalp, existing[0].id]
        )
      : await query<UserRow>(
          `INSERT INTO users (phone, name, age, gender, city, sankalp, signup_source)
           VALUES ($1, $2, $3, $4, $5, $6, 'hanumansadhak.com') RETURNING id, phone, is_paid`,
          [phone, name, age, gender, city, sankalp]
        );

    const user = users[0];
    await setSessionCookie(signToken({ userId: user.id, phone: user.phone }));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'कुछ गड़बड़ हो गई, कृपया फिर कोशिश करें' }, { status: 500 });
  }
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
