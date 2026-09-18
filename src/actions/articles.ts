'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, requireRole } from '@/lib/auth';
import { articleSchema, articleSchema as articleValidationSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

export async function createArticleAction(formData: FormData) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const rawData = {
    headline: formData.get('headline') as string,
    headlineKn: formData.get('headlineKn') as string || undefined,
    summary: formData.get('summary') as string || undefined,
    summaryKn: formData.get('summaryKn') as string || undefined,
    content: formData.get('content') as string,
    contentKn: formData.get('contentKn') as string || undefined,
    excerpt: formData.get('excerpt') as string || undefined,
    excerptKn: formData.get('excerptKn') as string || undefined,
    featuredImage: formData.get('featuredImage') as string || undefined,
    featuredImageAlt: formData.get('featuredImageAlt') as string || undefined,
    featuredImageCaption: formData.get('featuredImageCaption') as string || undefined,
    status: formData.get('status') as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED',
    breakingLevel: formData.get('breakingLevel') as 'NORMAL' | 'BREAKING' | 'URGENT',
    isFeatured: formData.get('isFeatured') === 'true',
    isEditorPick: formData.get('isEditorPick') === 'true',
    isLive: formData.get('isLive') === 'true',
    allowComments: formData.get('allowComments') === 'true',
    categoryId: formData.get('categoryId') as string,
    locationId: formData.get('locationId') as string || undefined,
    reporterId: formData.get('reporterId') as string || undefined,
    seoTitle: formData.get('seoTitle') as string || undefined,
    seoDescription: formData.get('seoDescription') as string || undefined,
    seoKeywords: formData.getAll('seoKeywords') as string[],
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    tags: formData.getAll('tags') as string[],
  };

  const validated = articleSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  const baseSlug = slugify(data.headline);
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const readTime = Math.ceil(data.content.split(/\s+/).length / 200);

  const article = await prisma.article.create({
    data: {
      slug,
      headline: data.headline,
      headlineKn: data.headlineKn,
      summary: data.summary,
      summaryKn: data.summaryKn,
      content: data.content,
      contentKn: data.contentKn,
      excerpt: data.excerpt,
      excerptKn: data.excerptKn,
      featuredImage: data.featuredImage,
      featuredImageAlt: data.featuredImageAlt,
      featuredImageCaption: data.featuredImageCaption,
      status: data.status,
      breakingLevel: data.breakingLevel,
      isFeatured: data.isFeatured,
      isEditorPick: data.isEditorPick,
      isLive: data.isLive,
      allowComments: data.allowComments,
      categoryId: data.categoryId,
      locationId: data.locationId,
      reporterId: data.reporterId || (user.role === 'REPORTER' ? user.id : undefined),
      authorId: user.id,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      readTime,
      tags: data.tags ? {
        create: data.tags.map((tagId) => ({ tagId })),
      } : undefined,
    },
  });

  if (data.status === 'PUBLISHED' && (data.breakingLevel === 'BREAKING' || data.breakingLevel === 'URGENT')) {
    await prisma.breakingNews.create({
      data: {
        headline: data.headline,
        headlineKn: data.headlineKn,
        articleId: article.id,
        level: data.breakingLevel,
        isActive: true,
        startsAt: new Date(),
      },
    });
  }

  revalidatePath('/');
  revalidatePath('/dashboard/articles');
  redirect(`/dashboard/articles/${article.id}`);
}

export async function updateArticleAction(articleId: string, formData: FormData) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  if (user.role === 'REPORTER' && article.authorId !== user.id && article.reporterId !== user.id) {
    return { error: 'Not authorized to edit this article' };
  }

  const rawData = {
    headline: formData.get('headline') as string,
    headlineKn: formData.get('headlineKn') as string || undefined,
    summary: formData.get('summary') as string || undefined,
    summaryKn: formData.get('summaryKn') as string || undefined,
    content: formData.get('content') as string,
    contentKn: formData.get('contentKn') as string || undefined,
    excerpt: formData.get('excerpt') as string || undefined,
    excerptKn: formData.get('excerptKn') as string || undefined,
    featuredImage: formData.get('featuredImage') as string || undefined,
    featuredImageAlt: formData.get('featuredImageAlt') as string || undefined,
    featuredImageCaption: formData.get('featuredImageCaption') as string || undefined,
    status: formData.get('status') as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED',
    breakingLevel: formData.get('breakingLevel') as 'NORMAL' | 'BREAKING' | 'URGENT',
    isFeatured: formData.get('isFeatured') === 'true',
    isEditorPick: formData.get('isEditorPick') === 'true',
    isLive: formData.get('isLive') === 'true',
    allowComments: formData.get('allowComments') === 'true',
    categoryId: formData.get('categoryId') as string,
    locationId: formData.get('locationId') as string || undefined,
    reporterId: formData.get('reporterId') as string || undefined,
    seoTitle: formData.get('seoTitle') as string || undefined,
    seoDescription: formData.get('seoDescription') as string || undefined,
    seoKeywords: formData.getAll('seoKeywords') as string[],
    scheduledAt: formData.get('scheduledAt') as string || undefined,
    tags: formData.getAll('tags') as string[],
  };

  const validated = articleSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Invalid input', fields: validated.error.flatten().fieldErrors };
  }

  const data = validated.data;
  const wasPublished = article.status === 'PUBLISHED';
  const isPublished = data.status === 'PUBLISHED';

  let slug = article.slug;
  if (data.headline !== article.headline) {
    const baseSlug = slugify(data.headline);
    slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findFirst({ where: { slug, id: { not: articleId } } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const readTime = Math.ceil(data.content.split(/\s+/).length / 200);

  await prisma.article.update({
    where: { id: articleId },
    data: {
      slug,
      headline: data.headline,
      headlineKn: data.headlineKn,
      summary: data.summary,
      summaryKn: data.summaryKn,
      content: data.content,
      contentKn: data.contentKn,
      excerpt: data.excerpt,
      excerptKn: data.excerptKn,
      featuredImage: data.featuredImage,
      featuredImageAlt: data.featuredImageAlt,
      featuredImageCaption: data.featuredImageCaption,
      status: data.status,
      breakingLevel: data.breakingLevel,
      isFeatured: data.isFeatured,
      isEditorPick: data.isEditorPick,
      isLive: data.isLive,
      allowComments: data.allowComments,
      categoryId: data.categoryId,
      locationId: data.locationId,
      reporterId: data.reporterId,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      publishedAt: !wasPublished && isPublished ? new Date() : article.publishedAt,
      readTime,
      tags: data.tags ? {
        deleteMany: {},
        create: data.tags.map((tagId) => ({ tagId })),
      } : undefined,
    },
  });

  if (!wasPublished && isPublished && (data.breakingLevel === 'BREAKING' || data.breakingLevel === 'URGENT')) {
    await prisma.breakingNews.create({
      data: {
        headline: data.headline,
        headlineKn: data.headlineKn,
        articleId,
        level: data.breakingLevel,
        isActive: true,
        startsAt: new Date(),
      },
    });
  }

  revalidatePath('/');
  revalidatePath('/dashboard/articles');
  revalidatePath(`/article/${slug}`);
  redirect(`/dashboard/articles/${articleId}`);
}

export async function deleteArticleAction(articleId: string) {
  const user = await requireRole('ADMIN', 'EDITOR');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  await prisma.article.delete({ where: { id: articleId } });

  revalidatePath('/');
  revalidatePath('/dashboard/articles');
  return { success: true };
}

export async function publishArticleAction(articleId: string) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  if (user.role === 'REPORTER' && article.authorId !== user.id && article.reporterId !== user.id) {
    return { error: 'Not authorized' };
  }

  await prisma.article.update({
    where: { id: articleId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  if (article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT') {
    await prisma.breakingNews.create({
      data: {
        headline: article.headline,
        headlineKn: article.headlineKn,
        articleId,
        level: article.breakingLevel,
        isActive: true,
        startsAt: new Date(),
      },
    });
  }

  revalidatePath('/');
  revalidatePath('/dashboard/articles');
  revalidatePath(`/article/${article.slug}`);
  return { success: true };
}

export async function scheduleArticleAction(articleId: string, scheduledAt: string) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  await prisma.article.update({
    where: { id: articleId },
    data: {
      status: 'SCHEDULED',
      scheduledAt: new Date(scheduledAt),
    },
  });

  revalidatePath('/dashboard/articles');
  return { success: true };
}

export async function addLiveUpdateAction(articleId: string, formData: FormData) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  if (user.role === 'REPORTER' && article.authorId !== user.id && article.reporterId !== user.id) {
    return { error: 'Not authorized' };
  }

  const content = formData.get('content') as string;
  const contentKn = formData.get('contentKn') as string || undefined;
  const isBreaking = formData.get('isBreaking') === 'true';

  if (!content || content.trim().length < 10) {
    return { error: 'Live update content must be at least 10 characters' };
  }

  const count = await prisma.liveUpdate.count({ where: { articleId } });

  await prisma.liveUpdate.create({
    data: {
      articleId,
      content,
      contentKn,
      isBreaking,
      displayOrder: count,
    },
  });

  if (isBreaking) {
    await prisma.article.update({
      where: { id: articleId },
      data: { breakingLevel: 'BREAKING' },
    });

    await prisma.breakingNews.create({
      data: {
        headline: `Live: ${content.slice(0, 100)}`,
        articleId,
        level: 'BREAKING',
        isActive: true,
        startsAt: new Date(),
      },
    });
  }

  revalidatePath(`/article/${article.slug}`);
  revalidatePath('/dashboard/articles');
  return { success: true };
}

export async function addArticleMediaAction(articleId: string, formData: FormData) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  const type = formData.get('type') as 'IMAGE' | 'VIDEO' | 'AUDIO';
  const url = formData.get('url') as string;
  const alt = formData.get('alt') as string || undefined;
  const caption = formData.get('caption') as string || undefined;
  const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
  const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;
  const duration = formData.get('duration') ? parseInt(formData.get('duration') as string) : undefined;

  if (!url) {
    return { error: 'URL is required' };
  }

  const count = await prisma.media.count({ where: { articleId } });

  await prisma.media.create({
    data: {
      articleId,
      type,
      url,
      alt,
      caption,
      width,
      height,
      duration,
      displayOrder: count,
    },
  });

  revalidatePath(`/article/${article.slug}`);
  revalidatePath('/dashboard/articles');
  return { success: true };
}

export async function createPhotoGalleryAction(articleId: string, formData: FormData) {
  const user = await requireRole('ADMIN', 'EDITOR', 'REPORTER');

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    return { error: 'Article not found' };
  }

  const title = formData.get('title') as string;
  const titleKn = formData.get('titleKn') as string || undefined;
  const description = formData.get('description') as string || undefined;
  const descriptionKn = formData.get('descriptionKn') as string || undefined;
  const coverImage = formData.get('coverImage') as string;
  const images = formData.getAll('images') as string[];

  if (!title || !coverImage || images.length === 0) {
    return { error: 'Title, cover image, and at least one image are required' };
  }

  const gallery = await prisma.photoGallery.create({
    data: {
      articleId,
      title,
      titleKn,
      description,
      descriptionKn,
      coverImage,
      imageCount: images.length,
      images: {
        create: images.map((url, index) => ({
          url,
          displayOrder: index,
        })),
      },
    },
  });

  revalidatePath(`/article/${article.slug}`);
  revalidatePath('/dashboard/articles');
  return { success: true, gallery };
}

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) return null;

  const where = user.role === 'REPORTER' ? { authorId: user.id } : {};

  const [totalArticles, publishedArticles, draftArticles, totalViews] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.count({ where: { ...where, status: 'PUBLISHED' } }),
    prisma.article.count({ where: { ...where, status: 'DRAFT' } }),
    prisma.article.aggregate({ where, _sum: { viewCount: true } }),
  ]);

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    totalViews: totalViews._sum.viewCount || 0,
  };
}

export async function getRecentArticles(limit = 10) {
  const user = await getCurrentUser();
  if (!user) return [];

  const where = user.role === 'REPORTER' ? { authorId: user.id } : {};

  return prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      category: { select: { name: true, nameKn: true, color: true } },
      media: { where: { type: 'IMAGE' }, take: 1 },
    },
  });
}