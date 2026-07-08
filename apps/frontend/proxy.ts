import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Check for the auth-token cookie
  const hasAuth = !!request.cookies.get('auth-token');

  const isLoginPage = pathname === '/login';
  const isAdminPage = pathname.startsWith('/admin');

  // Allow login page
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Protect admin routes - redirect to login if no auth
  if (isAdminPage && !hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
};
