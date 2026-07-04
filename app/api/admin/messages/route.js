import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/models/Message';

export async function GET() {
  await dbConnect();
  const messages = await Message.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}
