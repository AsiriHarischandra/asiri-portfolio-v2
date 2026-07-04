import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Update from '@/models/Update';
import { validate, updateSchema } from '@/lib/validation';

export async function GET() {
  await dbConnect();
  const updates = await Update.find().sort({ createdAt: -1 });
  return NextResponse.json(updates);
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const data = validate(updateSchema, body);
    const update = await Update.create(data);
    revalidatePath('/');
    return NextResponse.json(update, { status: 201 });
  } catch (err) {
    if (err.status === 400) return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
