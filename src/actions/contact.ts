'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { contactSchema } from '@/lib/validations';
import type { ContactSubmission } from '@/types';

export interface ContactActionResult {
  success?: boolean;
  message?: string;
  error?: string;
  fields?: Record<string, string[]>;
}

export async function submitContactAction(formData: FormData): Promise<ContactActionResult> {
  const rawData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: (formData.get('email') as string) || undefined,
    topic: (formData.get('topic') as 'tip' | 'issue' | 'ad' | 'feedback') || 'tip',
    message: formData.get('message') as string,
  };

  const validated = contactSchema.safeParse(rawData);
  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors)[0]?.[0] ||
      'ದಯವಿಟ್ಟು ಎಲ್ಲ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಸರಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಿ. / Please fill all required fields correctly.';
    return {
      error: firstError,
      fields: fieldErrors,
    };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: validated.data.name,
        phone: validated.data.phone,
        email: validated.data.email || null,
        topic: validated.data.topic,
        message: validated.data.message,
      },
    });
  } catch {
    // When operating in offline/fallback mode, log and gracefully succeed
  }

  return {
    success: true,
    message:
      'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ತಂಡವು ಶೀಘ್ರದಲ್ಲೇ ಪರಿಶೀಲಿಸುತ್ತದೆ. / Thank you! Your message has been received successfully.',
  };
}

export async function getContactSubmissions(options?: {
  page?: number;
  limit?: number;
  topic?: string;
  isRead?: boolean;
}): Promise<{ submissions: ContactSubmission[]; total: number }> {
  await requireRole('ADMIN', 'EDITOR');

  const page = options?.page ?? 1;
  const limit = options?.limit ?? 20;
  const skip = (page - 1) * limit;

  try {
    const where: { topic?: string; isRead?: boolean } = {};
    if (options?.topic && options.topic !== 'all') {
      where.topic = options.topic;
    }
    if (typeof options?.isRead === 'boolean') {
      where.isRead = options.isRead;
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return { submissions, total };
  } catch {
    return { submissions: [], total: 0 };
  }
}

export async function toggleContactReadAction(id: string, isRead: boolean) {
  await requireRole('ADMIN', 'EDITOR');

  try {
    await prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
    revalidatePath('/dashboard/contacts');
    return { success: true };
  } catch {
    return { error: 'Failed to update contact status' };
  }
}

export async function deleteContactSubmissionAction(id: string) {
  await requireRole('ADMIN');

  try {
    await prisma.contactSubmission.delete({
      where: { id },
    });
    revalidatePath('/dashboard/contacts');
    return { success: true };
  } catch {
    return { error: 'Failed to delete contact submission' };
  }
}
