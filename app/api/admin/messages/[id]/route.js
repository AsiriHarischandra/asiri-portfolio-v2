import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/models/Message';

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const msg = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
  if (!msg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(msg);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  await Message.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
