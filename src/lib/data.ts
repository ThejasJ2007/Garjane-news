import { prisma } from './prisma';
import {
  ArticleWithRelations,
  ArticleWithRelationsMinimal,
  CategoryWithChildren,
  LocationWithChildren,
  HomePageData,
  CategoryPageData,
  LocationPageData,
  ArticlePageData,
  SearchPageData,
  VideoPageData,
  PaginationParams,
  PaginatedResponse,
  VideoWithRelations,
  Category,
} from '@/types';
import { cache } from 'react';

const CACHE_TIME = 60; // seconds

export const getBreakingNews = cache(async () => {
  return prisma.breakingNews.findMany({
    where: {
      isActive: true,
      startsAt: { lte: new Date() },
      OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
    },
    orderBy: [{ level: 'desc' }, { displayOrder: 'asc' }],
    include: {
      article: {
        include: {
          category: true,
          author: { select: { id: true, name: true } },
        },
      },
    },
    take: 5,
  });
});

export const getFeaturedArticle = cache(async (): Promise<ArticleWithRelationsMinimal | null> => {
  return prisma.article.findFirst({
    where: {
      status: 'PUBLISHED',
      isFeatured: true,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      location: true,
      tags: { include: { tag: true } },
      media: true,
      galleries: { include: { images: true } },
      liveUpdates: { orderBy: { timestamp: 'asc' } },
    },
  }) as Promise<ArticleWithRelationsMinimal | null>;
});

export const getEditorPicks = cache(async (limit = 4): Promise<ArticleWithRelationsMinimal[]> => {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isEditorPick: true,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      location: true,
      tags: { include: { tag: true } },
      media: true,
      liveUpdates: { orderBy: { timestamp: 'asc' } },
    },
  }) as Promise<ArticleWithRelationsMinimal[]>;
});

export const getLatestArticles = cache(async (limit = 10, offset = 0): Promise<ArticleWithRelationsMinimal[]> => {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: 'desc' },
    skip: offset,
    take: limit,
    include: {
      category: true,
      author: { select: { id: true, name: true, avatar: true } },
      reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      location: true,
      tags: { include: { tag: true } },
      media: true,
      liveUpdates: { orderBy: { timestamp: 'asc' } },
    },
  }) as Promise<ArticleWithRelationsMinimal[]>;
});

export const getTickerNews = cache(async (limit = 20) => {
  return prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      breakingLevel: { in: ['BREAKING', 'URGENT'] },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      slug: true,
      headline: true,
      headlineKn: true,
      breakingLevel: true,
      category: { select: { id: true, name: true, nameKn: true, slug: true, color: true } },
      publishedAt: true,
    },
  });
});

export const getCategories = cache(async (): Promise<CategoryWithChildren[]> => {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: 'asc' },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
          _count: { select: { articles: { where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } } } } },
        },
      },
      _count: { select: { articles: { where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } } } } },
    },
  });
  return categories as CategoryWithChildren[];
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      parent: true,
      children: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
    },
  });
});

export const getCategoryBreadcrumbs = cache(async (categoryId: string) => {
  const breadcrumbs: Category[] = [];
  let current = await prisma.category.findUnique({ where: { id: categoryId } });
  while (current) {
    breadcrumbs.unshift(current);
    if (current.parentId) {
      current = await prisma.category.findUnique({ where: { id: current.parentId } });
    } else {
      current = null;
    }
  }
  return breadcrumbs;
});

export const getArticlesByCategory = cache(async (
  categoryId: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { categoryId },
          { category: { parentId: categoryId } },
        ],
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        location: true,
        tags: { include: { tag: true } },
        media: true,
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
    prisma.article.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { categoryId },
          { category: { parentId: categoryId } },
        ],
      },
    }),
  ]);

  return {
    data: articles as ArticleWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getLocations = cache(async (): Promise<LocationWithChildren[]> => {
  const locations = await prisma.location.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: 'asc' },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
          },
          _count: { select: { articles: { where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } } } } },
        },
      },
      _count: { select: { articles: { where: { status: 'PUBLISHED', publishedAt: { lte: new Date() } } } } },
    },
  });
  return locations as LocationWithChildren[];
});

export const getLocationBySlug = cache(async (slug: string) => {
  return prisma.location.findUnique({
    where: { slug, isActive: true },
    include: {
      parent: true,
      children: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
    },
  });
});

export const getArticlesByLocation = cache(async (
  locationId: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { locationId },
          { location: { parentId: locationId } },
        ],
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        location: true,
        tags: { include: { tag: true } },
        media: true,
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
    prisma.article.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        OR: [
          { locationId },
          { location: { parentId: locationId } },
        ],
      },
    }),
  ]);

  return {
    data: articles as ArticleWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleWithRelations | null> => {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
      reporter: { include: { user: true } },
      location: true,
      tags: { include: { tag: true } },
      media: { orderBy: { displayOrder: 'asc' } },
      galleries: { include: { images: { orderBy: { displayOrder: 'asc' } } } },
      liveUpdates: { orderBy: { timestamp: 'asc' } },
      relatedArticles: {
        include: {
          relatedTo: {
            include: {
              category: true,
              author: { select: { id: true, name: true, avatar: true } },
              media: { where: { type: 'IMAGE' }, take: 1 },
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  });

  if (!article) return null;

  if (article.status === 'PUBLISHED' && article.publishedAt && article.publishedAt <= new Date()) {
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return article as ArticleWithRelations;
});

export const getRelatedArticles = cache(async (articleId: string, categoryId: string, limit = 5) => {
  return prisma.article.findMany({
    where: {
      id: { not: articleId },
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      categoryId,
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      category: true,
      author: true,
      reporter: { include: { user: true } },
      location: true,
      tags: { include: { tag: true } },
      media: { where: { type: 'IMAGE' }, take: 1 },
      galleries: { include: { images: true } },
      liveUpdates: { orderBy: { timestamp: 'asc' } },
    },
  });
});

export const getPreviousNextArticle = cache(async (articleId: string, categoryId: string, publishedAt: Date) => {
  const [previous, next] = await Promise.all([
    prisma.article.findFirst({
      where: {
        id: { not: articleId },
        status: 'PUBLISHED',
        publishedAt: { lt: publishedAt, lte: new Date() },
        categoryId,
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        category: true,
        author: true,
        reporter: { include: { user: true } },
        location: true,
        tags: { include: { tag: true } },
        media: { where: { type: 'IMAGE' }, take: 1 },
        galleries: { include: { images: true } },
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
    prisma.article.findFirst({
      where: {
        id: { not: articleId },
        status: 'PUBLISHED',
        publishedAt: { gt: publishedAt, lte: new Date() },
        categoryId,
      },
      orderBy: { publishedAt: 'asc' },
      include: {
        category: true,
        author: true,
        reporter: { include: { user: true } },
        location: true,
        tags: { include: { tag: true } },
        media: { where: { type: 'IMAGE' }, take: 1 },
        galleries: { include: { images: true } },
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
  ]);
  return { previous, next };
});

export const searchArticles = cache(async (
  query: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const searchTerms = query.trim().split(/\s+/).filter(Boolean);

  const where = {
    status: 'PUBLISHED' as const,
    publishedAt: { lte: new Date() },
    OR: searchTerms.flatMap((term) => [
      { headline: { contains: term, mode: 'insensitive' as const } },
      { headlineKn: { contains: term, mode: 'insensitive' as const } },
      { summary: { contains: term, mode: 'insensitive' as const } },
      { summaryKn: { contains: term, mode: 'insensitive' as const } },
      { content: { contains: term, mode: 'insensitive' as const } },
      { contentKn: { contains: term, mode: 'insensitive' as const } },
      { tags: { some: { tag: { name: { contains: term, mode: 'insensitive' as const } } } } },
    ]),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        location: true,
        tags: { include: { tag: true } },
        media: true,
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
    prisma.article.count({ where }),
  ]);

  return {
    data: articles as ArticleWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getSearchSuggestions = cache(async (query: string, limit = 10) => {
  const searchTerms = query.trim().split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return { articles: [], categories: [], locations: [], tags: [] };

  const where = {
    status: 'PUBLISHED' as const,
    publishedAt: { lte: new Date() },
    OR: searchTerms.flatMap((term) => [
      { headline: { contains: term, mode: 'insensitive' as const } },
      { headlineKn: { contains: term, mode: 'insensitive' as const } },
    ]),
  };

  const [articles, categories, locations, tags] = await Promise.all([
    prisma.article.findMany({
      where,
      take: limit,
      select: { id: true, slug: true, headline: true, headlineKn: true, category: { select: { slug: true, name: true, nameKn: true } } },
    }),
    prisma.category.findMany({
      where: { isActive: true, OR: searchTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' as const } })) },
      take: limit,
      select: { id: true, slug: true, name: true, nameKn: true },
    }),
    prisma.location.findMany({
      where: { isActive: true, OR: searchTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' as const } })) },
      take: limit,
      select: { id: true, slug: true, name: true, nameKn: true },
    }),
    prisma.tag.findMany({
      where: { OR: searchTerms.map((term) => ({ name: { contains: term, mode: 'insensitive' as const } })) },
      take: limit,
      select: { id: true, slug: true, name: true, nameKn: true },
    }),
  ]);

  return { articles, categories, locations, tags };
});

export const getVideos = cache(async (params: PaginationParams = { page: 1, limit: 12 }): Promise<PaginatedResponse<VideoWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const [videos, total] = await Promise.all([
    prisma.video.findMany({
      where: { isPublished: true, publishedAt: { lte: new Date() } },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        category: true,
        location: true,
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    }),
    prisma.video.count({ where: { isPublished: true, publishedAt: { lte: new Date() } } }),
  ]);

  return {
    data: videos as VideoWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getVideoBySlug = cache(async (id: string) => {
  return prisma.video.findUnique({
    where: { id },
    include: {
      category: true,
      location: true,
      reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
    },
  });
});

export const getAdvertisements = cache(async (position: string) => {
  const now = new Date();
  return prisma.advertisement.findMany({
    where: {
      position,
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    orderBy: { priority: 'desc' },
  });
});

export const getSiteSettings = cache(async () => {
  return prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
});

export const getMenuItems = cache(async () => {
  return prisma.menuItem.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { displayOrder: 'asc' },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        include: {
          children: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
        },
      },
    },
  });
});

export const getLiveUpdates = cache(async (articleId: string) => {
  return prisma.liveUpdate.findMany({
    where: { articleId },
    orderBy: { timestamp: 'asc' },
  });
});

export const incrementAdImpression = async (adId: string) => {
  await prisma.advertisement.update({
    where: { id: adId },
    data: { impressions: { increment: 1 } },
  });
};

export const incrementAdClick = async (adId: string) => {
  await prisma.advertisement.update({
    where: { id: adId },
    data: { clicks: { increment: 1 } },
  });
};

export const getPopularTags = cache(async (limit = 20) => {
  return prisma.tag.findMany({
    take: limit,
    orderBy: { articles: { _count: 'desc' } },
    include: { _count: { select: { articles: true } } },
  });
});

export const getArticlesByTag = cache(async (
  tagSlug: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        tags: { some: { tag: { slug: tagSlug } } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: {
        category: true,
        author: { select: { id: true, name: true, avatar: true } },
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
        location: true,
        tags: { include: { tag: true } },
        media: true,
        liveUpdates: { orderBy: { timestamp: 'asc' } },
      },
    }),
    prisma.article.count({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        tags: { some: { tag: { slug: tagSlug } } },
      },
    }),
  ]);

  return {
    data: articles as ArticleWithRelations[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});