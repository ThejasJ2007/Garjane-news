import { prisma } from './prisma';
import {
  ArticleWithRelations,
  ArticleWithRelationsMinimal,
  CategoryWithChildren,
  LocationWithChildren,
  PaginationParams,
  PaginatedResponse,
  VideoWithRelations,
  Category,
  PhotoGallery,
  GalleryImage,
} from '@/types';
import { cache } from 'react';
import {
  fallbackSiteSettings,
  fallbackCategories,
  fallbackLocations,
  fallbackMenuItems,
  fallbackArticles,
  fallbackBreakingNews,
  fallbackVideos,
  fallbackAds,
  fallbackGalleries,
} from './mock-data';

export const getBreakingNews = cache(async () => {
  try {
    const data = await prisma.breakingNews.findMany({
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
    if (data && data.length > 0) return data;
  } catch {
    // Database offline or query error - use fallback
  }
  return fallbackBreakingNews;
});

export const getFeaturedArticle = cache(async (): Promise<ArticleWithRelationsMinimal | null> => {
  try {
    const article = await prisma.article.findFirst({
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
    });
    if (article) return article as ArticleWithRelationsMinimal;
  } catch {
    // Fallback
  }
  return (fallbackArticles.find((a) => a.isFeatured) || fallbackArticles[0]) as ArticleWithRelationsMinimal;
});

export const getEditorPicks = cache(async (limit = 4): Promise<ArticleWithRelationsMinimal[]> => {
  try {
    const articles = await prisma.article.findMany({
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
    });
    if (articles && articles.length > 0) return articles as ArticleWithRelationsMinimal[];
  } catch {
    // Fallback
  }
  return fallbackArticles.filter((a) => a.isEditorPick).slice(0, limit) as ArticleWithRelationsMinimal[];
});

export const getLatestArticles = cache(async (limit = 10, offset = 0): Promise<ArticleWithRelationsMinimal[]> => {
  try {
    const articles = await prisma.article.findMany({
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
    });
    if (articles && articles.length > 0) return articles as ArticleWithRelationsMinimal[];
  } catch {
    // Fallback
  }
  return fallbackArticles.slice(offset, offset + limit) as ArticleWithRelationsMinimal[];
});

export const getTickerNews = cache(async (limit = 20) => {
  try {
    const articles = await prisma.article.findMany({
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
    if (articles && articles.length > 0) return articles;
  } catch {
    // Fallback
  }
  return fallbackArticles.map((a) => ({
    id: a.id,
    slug: a.slug,
    headline: a.headline,
    headlineKn: a.headlineKn,
    breakingLevel: a.breakingLevel,
    category: {
      id: a.category.id,
      name: a.category.name,
      nameKn: a.category.nameKn,
      slug: a.category.slug,
      color: a.category.color,
    },
    publishedAt: a.publishedAt,
  }));
});

export const getCategories = cache(async (): Promise<CategoryWithChildren[]> => {
  try {
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
    if (categories && categories.length > 0) return categories as CategoryWithChildren[];
  } catch {
    // Fallback
  }
  return fallbackCategories;
});

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        parent: true,
        children: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
    if (category) return category;
  } catch {
    // Fallback
  }
  return fallbackCategories.find((c) => c.slug === slug) || null;
});

export const getCategoryBreadcrumbs = cache(async (categoryIdOrSlug: string) => {
  try {
    const breadcrumbs: Category[] = [];
    let current = await prisma.category.findFirst({
      where: { OR: [{ id: categoryIdOrSlug }, { slug: categoryIdOrSlug }] },
    });
    while (current) {
      breadcrumbs.unshift(current);
      if (current.parentId) {
        current = await prisma.category.findUnique({ where: { id: current.parentId } });
      } else {
        current = null;
      }
    }
    if (breadcrumbs.length > 0) return breadcrumbs;
  } catch {
    // Fallback
  }
  const cat = fallbackCategories.find((c) => c.slug === categoryIdOrSlug || c.id === categoryIdOrSlug);
  return cat ? [cat] : [];
});

export const getArticlesByCategory = cache(async (
  categoryOrSlug: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: 'PUBLISHED' as const,
      publishedAt: { lte: new Date() },
      OR: [
        { categoryId: categoryOrSlug },
        { category: { slug: categoryOrSlug } },
        { category: { parentId: categoryOrSlug } },
        { category: { parent: { slug: categoryOrSlug } } },
      ],
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

    if (total > 0) {
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
    }
  } catch {
    // Fallback
  }

  // Filter fallback articles
  const filtered = fallbackArticles.filter(
    (a) => a.categoryId === categoryOrSlug || a.category.slug === categoryOrSlug
  );
  const total = filtered.length > 0 ? filtered.length : fallbackArticles.length;
  const data = (filtered.length > 0 ? filtered : fallbackArticles).slice(skip, skip + limit);

  return {
    data,
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
  try {
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
    if (locations && locations.length > 0) return locations as LocationWithChildren[];
  } catch {
    // Fallback
  }
  return fallbackLocations;
});

export const getLocationBySlug = cache(async (slug: string) => {
  try {
    const location = await prisma.location.findUnique({
      where: { slug, isActive: true },
      include: {
        parent: true,
        children: { where: { isActive: true }, orderBy: { displayOrder: 'asc' } },
      },
    });
    if (location) return location;
  } catch {
    // Fallback
  }
  return fallbackLocations.find((l) => l.slug === slug) || null;
});

export const getArticlesByLocation = cache(async (
  locationOrSlug: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: 'PUBLISHED' as const,
      publishedAt: { lte: new Date() },
      OR: [
        { locationId: locationOrSlug },
        { location: { slug: locationOrSlug } },
        { location: { parentId: locationOrSlug } },
        { location: { parent: { slug: locationOrSlug } } },
      ],
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
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch {
    // Fallback
  }

  const filtered = fallbackArticles.filter(
    (a) => a.locationId === locationOrSlug || (a.location && a.location.slug === locationOrSlug)
  );
  const total = filtered.length;
  const data = filtered.slice(skip, skip + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getArticleBySlug = cache(async (slug: string): Promise<ArticleWithRelations | null> => {
  try {
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

    if (article) {
      if (article.status === 'PUBLISHED' && article.publishedAt && article.publishedAt <= new Date()) {
        prisma.article.update({
          where: { id: article.id },
          data: { viewCount: { increment: 1 } },
        }).catch(() => {});
      }
      return article as ArticleWithRelations;
    }
  } catch {
    // Fallback
  }

  return fallbackArticles.find((a) => a.slug === slug) || null;
});

export const getArticleById = cache(async (id: string): Promise<ArticleWithRelations | null> => {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
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

    if (article) {
      return article as ArticleWithRelations;
    }
  } catch {
    // Fallback
  }

  return fallbackArticles.find((a) => a.id === id) || null;
});

export const getRelatedArticles = cache(async (articleId: string, categoryId: string, limit = 5) => {
  try {
    const articles = await prisma.article.findMany({
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
    if (articles && articles.length > 0) return articles;
  } catch {
    // Fallback
  }

  return fallbackArticles.filter((a) => a.id !== articleId).slice(0, limit);
});

export const getPreviousNextArticle = cache(async (articleId: string, categoryId: string, publishedAt: Date) => {
  try {
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
  } catch {
    // Fallback
  }
  const other = fallbackArticles.find((a) => a.id !== articleId);
  return { previous: other || null, next: null };
});

export const searchArticles = cache(async (
  query: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;
  const searchTerms = query.trim().split(/\s+/).filter(Boolean);

  if (searchTerms.length === 0) {
    return {
      data: fallbackArticles.slice(0, limit),
      pagination: {
        page: 1,
        limit,
        total: fallbackArticles.length,
        totalPages: Math.ceil(fallbackArticles.length / limit),
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  try {
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
        totalPages: Math.ceil(total / limit) || 1,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  } catch {
    // Fallback
  }

  // Fallback in-memory search
  const lowerTerms = searchTerms.map((t) => t.toLowerCase());
  const matches = fallbackArticles.filter((art) => {
    const text = `${art.headline} ${art.headlineKn || ''} ${art.summary || ''} ${art.summaryKn || ''} ${art.category.name} ${art.category.nameKn}`.toLowerCase();
    return lowerTerms.some((t) => text.includes(t));
  });

  const results = matches;
  const total = results.length;

  return {
    data: results.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getSearchSuggestions = cache(async (query: string, limit = 10) => {
  const searchTerms = query.trim().split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return { articles: [], categories: [], locations: [], tags: [] };

  try {
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
  } catch {
    // Fallback
    return {
      articles: fallbackArticles.slice(0, 3).map((a) => ({ id: a.id, slug: a.slug, headline: a.headline, headlineKn: a.headlineKn, category: a.category })),
      categories: fallbackCategories.slice(0, 3).map((c) => ({ id: c.id, slug: c.slug, name: c.name, nameKn: c.nameKn })),
      locations: fallbackLocations.slice(0, 3).map((l) => ({ id: l.id, slug: l.slug, name: l.name, nameKn: l.nameKn })),
      tags: [],
    };
  }
});

export const getVideos = cache(async (params: PaginationParams = { page: 1, limit: 12 }): Promise<PaginatedResponse<VideoWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  try {
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

    if (total > 0) {
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
    }
  } catch {
    // Fallback
  }

  return {
    data: fallbackVideos.slice(skip, skip + limit),
    pagination: {
      page,
      limit,
      total: fallbackVideos.length,
      totalPages: Math.ceil(fallbackVideos.length / limit),
      hasNext: page < Math.ceil(fallbackVideos.length / limit),
      hasPrev: page > 1,
    },
  };
});

export const getVideoBySlug = cache(async (idOrSlug: string) => {
  try {
    const video = await prisma.video.findFirst({
      where: { OR: [{ id: idOrSlug }] },
      include: {
        category: true,
        location: true,
        reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });
    if (video) return video;
  } catch {
    // Fallback
  }

  return fallbackVideos.find((v) => v.id === idOrSlug) || null;
});

export const getAdvertisements = cache(async (position: string) => {
  try {
    const now = new Date();
    const ads = await prisma.advertisement.findMany({
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
    if (ads && ads.length > 0) return ads;
  } catch {
    // Fallback
  }

  return fallbackAds.filter((a) => a.position === position);
});

export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings) {
      return {
        ...settings,
        siteName: settings.siteName || 'Garjane News',
        siteNameKn: settings.siteNameKn || 'ಗರ್ಜನೆ ನ್ಯೂಸ್',
      };
    }
  } catch {
    // Fallback
  }
  return fallbackSiteSettings;
});

export const getMenuItems = cache(async () => {
  try {
    const items = await prisma.menuItem.findMany({
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
    if (items && items.length > 0) return items;
  } catch {
    // Fallback
  }
  return fallbackMenuItems;
});

export const getLiveUpdates = cache(async (articleId: string) => {
  try {
    return await prisma.liveUpdate.findMany({
      where: { articleId },
      orderBy: { timestamp: 'asc' },
    });
  } catch {
    return [];
  }
});

export const incrementAdImpression = async (adId: string) => {
  try {
    await prisma.advertisement.update({
      where: { id: adId },
      data: { impressions: { increment: 1 } },
    });
  } catch {
    // Ignore when offline
  }
};

export const incrementAdClick = async (adId: string) => {
  try {
    await prisma.advertisement.update({
      where: { id: adId },
      data: { clicks: { increment: 1 } },
    });
  } catch {
    // Ignore when offline
  }
};

export const getPopularTags = cache(async (limit = 20) => {
  try {
    const tags = await prisma.tag.findMany({
      take: limit,
      orderBy: { articles: { _count: 'desc' } },
      include: { _count: { select: { articles: true } } },
    });
    if (tags && tags.length > 0) return tags;
  } catch {
    // Fallback
  }

  return [
    { id: 't1', name: 'Nelamangala', nameKn: 'ನೆಲಮಂಗಲ', slug: 'nelamangala', color: '#DC2626', createdAt: new Date(), _count: { articles: 18 } },
    { id: 't2', name: 'Karnataka Politics', nameKn: 'ಕರ್ನಾಟಕ ರಾಜಕೀಯ', slug: 'karnataka-politics', color: '#7C3AED', createdAt: new Date(), _count: { articles: 14 } },
    { id: 't3', name: 'Highway Traffic', nameKn: 'ಹೆದ್ದಾರಿ ಸಂಚಾರ', slug: 'highway-traffic', color: '#2563EB', createdAt: new Date(), _count: { articles: 10 } },
    { id: 't4', name: 'APMC Rates', nameKn: 'ಎಪಿಎಂಸಿ ದರ', slug: 'apmc-rates', color: '#0D9488', createdAt: new Date(), _count: { articles: 8 } },
  ];
});

export const getArticlesByTag = cache(async (
  tagSlug: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: 'PUBLISHED' as const,
      publishedAt: { lte: new Date() },
      tags: { some: { tag: { slug: tagSlug } } },
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

    if (total > 0) {
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
    }
  } catch {
    // Fallback
  }

  const filtered = fallbackArticles.filter((a) =>
    a.tags?.some((t) => t.tag?.slug === tagSlug || t.tag?.name.toLowerCase() === tagSlug.toLowerCase())
  );
  const total = filtered.length;
  const data = filtered.slice(skip, skip + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getTagBySlug = cache(async (slug: string) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug },
    });
    if (tag) return tag;
  } catch {
    // Fallback
  }

  const popular = await getPopularTags();
  const match = popular.find((t) => t.slug === slug);
  if (match) return match;

  for (const art of fallbackArticles) {
    const found = art.tags?.find((t) => t.tag.slug === slug);
    if (found) return found.tag;
  }

  return null;
});

export const getGalleries = cache(async (
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<PhotoGallery & { images: GalleryImage[] }>> => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  try {
    const [galleries, total] = await Promise.all([
      prisma.photoGallery.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
        },
      }),
      prisma.photoGallery.count(),
    ]);

    if (total > 0) {
      return {
        data: galleries as (PhotoGallery & { images: GalleryImage[] })[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    }
  } catch {
    // Fallback
  }

  const total = fallbackGalleries.length;
  const data = fallbackGalleries.slice(skip, skip + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});

export const getGalleryById = cache(async (id: string): Promise<(PhotoGallery & { images: GalleryImage[] }) | null> => {
  try {
    const gallery = await prisma.photoGallery.findUnique({
      where: { id },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
      },
    });
    if (gallery) return gallery as (PhotoGallery & { images: GalleryImage[] });
  } catch {
    // Fallback
  }
  return fallbackGalleries.find((g) => g.id === id) || null;
});

export const getAuthorById = cache(async (authorId: string) => {
  try {
    const author = await prisma.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        name: true,
        avatar: true,
        role: true,
        bio: true,
        bioKn: true,
        location: true,
      },
    });
    if (author) return author;
  } catch {
    // Fallback
  }
  const match = fallbackArticles.find((a) => a.author.id === authorId)?.author;
  if (match) return match;
  return null;
});

export const getArticlesByAuthor = cache(async (
  authorId: string,
  params: PaginationParams = { page: 1, limit: 12 }
): Promise<PaginatedResponse<ArticleWithRelations>> => {
  const { page, limit, sortBy = 'publishedAt', sortOrder = 'desc' } = params;
  const skip = (page - 1) * limit;

  try {
    const where = {
      status: 'PUBLISHED' as const,
      publishedAt: { lte: new Date() },
      authorId,
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

    if (total > 0) {
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
    }
  } catch {
    // Fallback
  }

  const filtered = fallbackArticles.filter((a) => a.author.id === authorId);
  const total = filtered.length;
  const data = filtered.slice(skip, skip + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
});