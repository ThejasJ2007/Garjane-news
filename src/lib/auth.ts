import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { UserSession } from '@/types';

const DEV_JWT_PLACEHOLDERS = [
  'dev-jwt-secret-key-min-32-characters-garjane',
  'your-super-secret-jwt-key-min-32-chars',
];

const DEV_SESSION_PLACEHOLDERS = [
  'dev-session-password-min-32-characters-garjane',
  'your-session-password-min-32-chars',
];

export function getJwtSecret(): Uint8Array {
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

export function getSessionPassword(): string {
  const password = process.env.SESSION_PASSWORD?.trim();
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    if (!password || password.length < 32 || DEV_SESSION_PLACEHOLDERS.includes(password)) {
      throw new Error(
        'FATAL: In production, SESSION_PASSWORD must be configured with a secure string of at least 32 characters and cannot use a development placeholder.'
      );
    }
    return password;
  }

  return password || 'dev-session-password-min-32-characters-garjane';
}

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
    .sign(getJwtSecret());

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
    const { payload } = await jwtVerify(token, getJwtSecret());
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
  const b = (bcrypt as any).default || bcrypt;
  return b.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  const b = (bcrypt as any).default || bcrypt;
  return b.hash(password, 12);
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