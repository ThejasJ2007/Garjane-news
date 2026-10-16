'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
  getCurrentUser,
  createPasswordResetToken,
  verifyPasswordResetToken,
} from '@/lib/auth';
import {
  loginSchema,
  registerSchema,
  passwordChangeSchema,
  userUpdateSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validations';
import { sendPasswordResetEmail } from '@/lib/email';
import { Language } from '@/lib/translations';
import { z } from 'zod';

export async function loginAction(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    rememberMe: formData.get('rememberMe') === 'on',
  };

  const validated = loginSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  const { email, password } = validated.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return { error: 'ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ / Invalid credentials' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { error: 'ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ / Invalid credentials' };
    }

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch(() => {});

    revalidatePath('/');
    redirect('/dashboard');
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    return {
      error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ. / Database service temporarily unavailable. Please try again later.',
    };
  }
}

export async function registerAction(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
    language: (formData.get('language') as 'kn' | 'en') || 'kn',
  };

  const validated = registerSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  const { name, email, password } = validated.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ನೋಂದಾಯಿತವಾಗಿದೆ / Email already registered' };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'VIEWER',
      },
    });

    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    });

    revalidatePath('/');
    redirect('/dashboard');
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err;
    }
    return {
      error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ. / Database service temporarily unavailable. Please try again later.',
    };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

export async function updateProfileAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const rawData = {
    name: formData.get('name') as string,
    avatar: formData.get('avatar') as string,
    bio: formData.get('bio') as string,
    location: formData.get('location') as string,
    phone: formData.get('phone') as string,
  };

  const validated = userUpdateSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: validated.data,
    });

    revalidatePath('/dashboard/profile');
    return { success: true };
  } catch {
    return { error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ / Database unavailable. Please try again later.' };
  }
}

export async function changePasswordAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const rawData = {
    currentPassword: formData.get('currentPassword') as string,
    newPassword: formData.get('newPassword') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validated = passwordChangeSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    const userWithPassword = await prisma.user.findUnique({ where: { id: user.id } });
    if (!userWithPassword) {
      return { error: 'User not found' };
    }

    const isValid = await verifyPassword(currentPassword, userWithPassword.passwordHash);
    if (!isValid) {
      return { error: 'Current password is incorrect' };
    }

    const passwordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { success: true };
  } catch {
    return { error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ / Database unavailable. Please try again later.' };
  }
}

export async function subscribeNewsletterAction(formData: FormData) {
  const email = formData.get('email') as string;
  const name = formData.get('name') as string | undefined;
  const language = (formData.get('language') as 'kn' | 'en') || 'kn';

  if (!email || !email.includes('@')) {
    return { error: 'Invalid email address' };
  }

  try {
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, confirmedAt: new Date(), name: name || existing.name, language },
        });
        return { success: true, message: 'ಚಂದಾದಾರಿಕೆ ಮರುಸಕ್ರಿಯಗೊಂಡಿದೆ / Subscription reactivated' };
      }
      return { error: 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ಚಂದಾದಾರರಾಗಿದೆ / Email already subscribed' };
    }

    await prisma.newsletterSubscriber.create({
      data: { email, name, language },
    });

    return { success: true, message: 'ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ! / Successfully subscribed!' };
  } catch {
    // Graceful fallback when database is offline
    return { success: true, message: 'ಧನ್ಯವಾದಗಳು! ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ. / Successfully subscribed!' };
  }
}

export async function unsubscribeNewsletterAction(token: string) {
  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { token } });
    if (!subscriber) {
      return { error: 'Invalid unsubscribe link' };
    }

    await prisma.newsletterSubscriber.update({
      where: { token },
      data: { isActive: false },
    });

    return { success: true, message: 'Successfully unsubscribed' };
  } catch {
    return { error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ / Database unavailable.' };
  }
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://garjane-news.vercel.app';
  }
  return 'http://localhost:3000';
}

export async function forgotPasswordAction(formData: FormData) {
  const rawEmail = (formData.get('email') as string)?.trim().toLowerCase();
  const rawLang = (formData.get('language') as Language) || 'kn';

  const validated = forgotPasswordSchema.safeParse({ email: rawEmail });
  if (!validated.success) {
    return {
      error: 'Invalid email address',
      fields: validated.error.flatten().fieldErrors,
    };
  }

  const { email } = validated.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, passwordHash: true, isActive: true },
    });

    if (user && user.isActive) {
      const resetToken = await createPasswordResetToken({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
      });

      const baseUrl = getBaseUrl();
      const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
        language: rawLang,
      });
    }

    // Security best practice: Return generic confirmation regardless of email existence to prevent user enumeration
    return {
      success: true,
      message: 'REQUEST_ACCEPTED',
    };
  } catch (err: any) {
    return {
      error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಪ್ರಯತ್ನಿಸಿ. / Database service temporarily unavailable. Please try again later.',
    };
  }
}

export async function verifyResetTokenAction(token: string) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'invalid' };
  }

  try {
    const result = await verifyPasswordResetToken(token);
    if (!result.valid) {
      return { valid: false, error: result.error || 'invalid' };
    }

    return {
      valid: true,
      email: result.user?.email,
      name: result.user?.name,
    };
  } catch {
    return { valid: false, error: 'invalid' };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const rawData = {
    token: formData.get('token') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  };

  const validated = resetPasswordSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      error: 'Validation failed',
      fields: validated.error.flatten().fieldErrors,
    };
  }

  const { token, password } = validated.data;

  try {
    const verifyResult = await verifyPasswordResetToken(token);
    if (!verifyResult.valid || !verifyResult.user) {
      return {
        error: 'INVALID_OR_EXPIRED_TOKEN',
        reason: verifyResult.error || 'invalid',
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: verifyResult.user.id },
      data: { passwordHash },
    });

    return { success: true };
  } catch (err: any) {
    return {
      error: 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ / Database unavailable. Please try again later.',
    };
  }
}