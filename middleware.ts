import { NextRequest, NextResponse } from 'next/server';

export function middleware(req:NextRequest) {
  const token = req.cookies.get('accessToken');

  const { pathname } = req.nextUrl;

  if ( pathname === '/login') {
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login|api|_next|static|favicon.ico).*)',
  ],
};
