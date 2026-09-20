import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { UserSession } from '@/types';

const jwtSecretValue =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production'
    ? ''
    : 'dev-jwt-secret-key-min-32-characters-garjane');

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET environment variable is not set in production.');
}

const JWT_SECRET = new TextEncoder().encode(
  jwtSecretValue || 'dev-jwt-secret-key-min-32-characters-garjane'
);
const SESSION_PASSWORD =
  process.env.SESSION_PASSWORD ||
  (process.env.NODE_ENV === 'production'
    ? ''
    : 'dev-session-password-min-32-characters-garjane');

export async function createSession(user: {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: 'ADMIN' | 'EDITOR' | 'REPORTER' | 'VIEWER';
}): Promise<string> {
  const token = await new SignJWT({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    },
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        isActive: true,
        bio: true,
        location: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    // Database unavailable - fall back to the verified session claims
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      avatar: session.user.avatar ?? null,
      role: session.user.role,
      isActive: true,
      bio: null,
      location: null,
    };
  }
}

export async function requireAuth(): Promise<UserSession['user']> {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Authentication required');
  }
  return session.user;
}

export async function requireRole(...roles: UserSession['user']['role'][]): Promise<UserSession['user']> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  };
}