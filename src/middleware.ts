import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_HEADER_NAME = 'x-auth-token';

const hasValidToken = (token: string | null) => {
  if (!token) {
    return false;
  }

  const normalized = token.trim();

  if (!normalized) {
    return false;
  }

  return normalized !== 'undefined' && normalized !== 'null';
};

const isStaticAsset = (pathname: string) => /\.(?:ico|png|jpg|jpeg|svg|gif|webp|avif|css|js|map|txt|woff2?|ttf|eot|otf)$/i.test(pathname);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    isStaticAsset(pathname) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.headers.get(AUTH_HEADER_NAME);
  const isAuthenticated = hasValidToken(token);

  if (pathname === '/' && isAuthenticated) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    dashboardUrl.search = '';
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname !== '/' && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
