import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken, setTokenCookie } from '@/lib/auth';
import { validate, loginSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { password } = validate(loginSchema, body);

    const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!match) {
      return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
    }

    const token = await signToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(setTokenCookie(token));
    return response;
  } catch (err) {
    if (err.status === 400) {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
