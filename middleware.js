import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // Skip login and logout routes — they need to be accessible
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  // Check token
  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin', request.url));
  }
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/admin/:path*',
  ],
};
