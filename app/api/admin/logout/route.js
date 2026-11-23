import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(clearTokenCookie());
  return response;
}
