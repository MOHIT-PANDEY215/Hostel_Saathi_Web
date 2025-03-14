import { NextRequest, NextResponse } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;
  console.log('kkkkk', token)
  const { pathname } = req.nextUrl;

  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login|api|_next|static|favicon.ico).*)',
  ],
};
