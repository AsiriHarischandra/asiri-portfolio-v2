import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/models/Message';
import { validate, contactSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rateLimit';
import { sendContactEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`contact:${ip}`, 3, 60 * 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many messages. Try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { honeypot, ...data } = validate(contactSchema, body);

    // If honeypot field was filled, silently succeed (bot trap)
    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    await dbConnect();
    await Message.create(data);

    try {
      await sendContactEmail(data);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
      // Message is saved to DB even if email fails — owner can see it in admin
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err.status === 400) {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    }
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
