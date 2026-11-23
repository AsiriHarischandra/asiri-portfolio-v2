import { NextResponse } from 'next/server';
import { dbConnect }   from '@/lib/db';
import Visitor         from '@/models/Visitor';

export const dynamic = 'force-dynamic';

// GET — read current count without incrementing (used by admin dashboard)
export async function GET() {
  await dbConnect();
  const doc = await Visitor.findById('global');
  return NextResponse.json({ count: doc?.count ?? 0 });
}

// POST — increment and return new count (called once per real page visit)
export async function POST() {
  await dbConnect();
  const doc = await Visitor.findByIdAndUpdate(
    'global',
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return NextResponse.json({ count: doc.count });
}
