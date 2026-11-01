import { NextRequest, NextResponse } from 'next/server';

// Payment needs a session; signup/login are for guests only.
const NEEDS_LOGIN = ['/payment', '/thank-you'];
const GUEST_ONLY = ['/signup', '/login'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const loggedIn = !!req.cookies.get('hk_session')?.value;

  if (NEEDS_LOGIN.some((p) => pathname.startsWith(p)) && !loggedIn) {
    return NextResponse.redirect(new URL('/signup', req.url));
  }
  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && loggedIn) {
    return NextResponse.redirect(new URL('/payment', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/payment/:path*', '/thank-you', '/signup', '/login'],
};
