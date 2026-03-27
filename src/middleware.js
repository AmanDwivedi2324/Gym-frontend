// import { NextResponse } from 'next/navigation';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isAdminRoute = path.startsWith('/admin');

  // NextAuth uses NEXTAUTH_SECRET automatically, but passing it explicitly handles edge cases
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "gym_fallback_secret_xyz",
  });

  if (isAdminRoute) {
    if (!token) {
      // Not logged in -> Redirect to login
      const url = new URL('/login', req.url);
      url.searchParams.set('callbackUrl', encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    if (token.role !== 'admin') {
      // Logged in but not an admin -> Redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
