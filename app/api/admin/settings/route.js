import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Settings from '@/models/Settings';
import { validate, settingsSchema } from '@/lib/validation';

// Force dynamic: without this, Next statically optimizes the GET-only view of
// this route in production, which makes PUT return 405 Method Not Allowed.
export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  return NextResponse.json(settings);
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const data = validate(settingsSchema.partial(), body);

    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, data);
    await settings.save();

    revalidatePath('/');
    return NextResponse.json(settings);
  } catch (err) {
    if (err.status === 400) return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
