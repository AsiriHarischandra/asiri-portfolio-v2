import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Message from '@/models/Message';

// Force dynamic so the admin always sees current messages, not a build-time list.
export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  const messages = await Message.find().sort({ createdAt: -1 });
  return NextResponse.json(messages);
}
