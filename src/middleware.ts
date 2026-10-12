import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const DEV_JWT_PLACEHOLDERS = [
  'dev-jwt-secret-key-min-32-characters-garjane',
  'your-super-secret-jwt-key-min-32-chars',
];

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!secret || secret.length < 32 || DEV_JWT_PLACEHOLDERS.includes(secret)) {
      throw new Error(
        'FATAL: In production, JWT_SECRET must be configured with a secure string of at least 32 characters and cannot use a development placeholder.'
      );
    }
    return new TextEncoder().encode(secret);
  }

  return new TextEncoder().encode(secret || 'dev-jwt-secret-key-min-32-characters-garjane');
}

const PROTECTED_PATHS = [
  '/dashboard',
  '/dashboard/articles/new',
  '/dashboard/articles/edit',
  '/dashboard/profile',
];

const ADMIN_EDITOR_PATHS = [
  '/dashboard/articles/new',
];

async function verifyToken(token: string) {
  try {
    const secretKey = getJwtSecret();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as { user: { id: string; email: string; name: string; avatar?: string | null; role: string } };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify JWT token
  const session = await verifyToken(sessionCookie);

  if (!session?.user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access for admin/editor only paths
  const isAdminEditorPath = ADMIN_EDITOR_PATHS.some(path => pathname.startsWith(path));
  const userRole = session.user.role;

  if (isAdminEditorPath && !['ADMIN', 'EDITOR', 'REPORTER'].includes(userRole)) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Add user info to headers for server components
  const response = NextResponse.next();
  response.headers.set('x-user-id', session.user.id);
  response.headers.set('x-user-role', session.user.role);
  response.headers.set('x-user-email', session.user.email);
  response.headers.set('x-user-name', session.user.name);

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};