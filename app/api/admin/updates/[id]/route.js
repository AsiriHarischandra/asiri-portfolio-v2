import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Update from '@/models/Update';
import { validate, updateSchema } from '@/lib/validation';

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const data = validate(updateSchema.partial(), body);
    const update = await Update.findByIdAndUpdate(id, data, { new: true });
    if (!update) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/');
    return NextResponse.json(update);
  } catch (err) {
    if (err.status === 400) return NextResponse.json({ error: err.message, details: err.details }, { status: 400 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  await Update.findByIdAndDelete(id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
