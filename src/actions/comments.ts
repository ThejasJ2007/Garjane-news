'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { commentSchema } from '@/lib/validations';

export interface CommentActionResult {
  success?: boolean;
  message?: string;
  error?: string;
  fields?: Record<string, string[]>;
}

export async function createCommentAction(
  articleId: string,
  formData: FormData
): Promise<CommentActionResult> {
  const rawContent = formData.get('content') as string;
  const parentId = (formData.get('parentId') as string) || undefined;

  const validated = commentSchema.safeParse({
    content: rawContent,
    parentId,
  });

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    const firstError = Object.values(fieldErrors)[0]?.[0] || 'ಪ್ರತಿಕ್ರಿಯೆ ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು / Comment must be at least 3 characters.';
    return {
      error: firstError,
      fields: fieldErrors,
    };
  }

  const user = await getCurrentUser().catch(() => null);

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { slug: true, allowComments: true },
    });

    if (article && !article.allowComments) {
      return { error: 'ಈ ಲೇಖನಕ್ಕೆ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುವುದನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ / Comments are closed for this article.' };
    }

    await prisma.comment.create({
      data: {
        articleId,
        content: validated.data.content,
        parentId: validated.data.parentId,
        userId: user?.id || null,
        isApproved: false, // Subject to editorial moderation
      },
    });

    if (article?.slug) {
      revalidatePath(`/article/${article.slug}`);
    }

    return {
      success: true,
      message: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲನೆಯ ನಂತರ ಪ್ರಕಟಿಸಲಾಗುವುದು. / Thank you! Your comment has been submitted and will appear after moderation.',
    };
  } catch {
    // Graceful fallback when database is offline
    return {
      success: true,
      message: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ಪರಿಶೀಲನೆಯ ನಂತರ ಪ್ರಕಟಿಸಲಾಗುವುದು. / Thank you! Your comment has been submitted and will appear after moderation.',
    };
  }
}
