import { Article, Category, Location, Tag, User, Reporter, Media, Video, Advertisement, BreakingNews, MenuItem, SiteSettings, PhotoGallery, LiveUpdate, Comment, NewsletterSubscriber } from '@prisma/client';

export type { Advertisement, PhotoGallery, Video, Category, Location, Article, Tag, User, BreakingNews, MenuItem, SiteSettings, Media, LiveUpdate, Comment, NewsletterSubscriber, Reporter };

export type VideoWithRelations = Video & {
  category?: Category | null;
  location?: Location | null;
  reporter?: (Reporter & { user: Pick<User, 'id' | 'name' | 'avatar'> }) | null;
};

export type ArticleWithRelations = Article & {
  category: Category;
  author: User;
  reporter?: (Reporter & { user: User }) | null;
  location?: Location | null;
  tags: (ArticleTag & { tag: Tag })[];
  media: Media[];
  galleries: (PhotoGallery & { images: GalleryImage[] })[];
  liveUpdates: LiveUpdate[];
  relatedArticles?: any[];
  relatedTo?: any[];
  breakingNews?: any[];
  comments?: any[];
  views?: any[];
  _count?: { views: number; comments: number };
};

export type ArticleWithRelationsMinimal = Article & {
  category: Category;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  reporter?: (Reporter & { user: Pick<User, 'id' | 'name' | 'avatar'> }) | null;
  location?: Location | null;
  tags: (ArticleTag & { tag: Tag })[];
  media: Media[];
  galleries?: (PhotoGallery & { images: GalleryImage[] })[];
  liveUpdates?: LiveUpdate[];
  _count?: { views: number; comments: number };
};

export type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
  _count?: { articles: number };
};

export type LocationWithChildren = Location & {
  children: LocationWithChildren[];
  _count?: { articles: number };
};

export type ArticleTag = {
  id: string;
  articleId: string;
  tagId: string;
  tag: Tag;
};

export type GalleryImage = {
  id: string;
  galleryId: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  captionKn?: string | null;
  width?: number | null;
  height?: number | null;
  displayOrder: number;
  createdAt: Date;
};

export type HomePageData = {
  breakingNews: BreakingNews[];
  featuredArticle: ArticleWithRelations | null;
  editorPicks: ArticleWithRelations[];
  latestArticles: ArticleWithRelations[];
  categories: CategoryWithChildren[];
  videos: Video[];
  advertisements: Advertisement[];
  tickerNews: ArticleWithRelations[];
};

export type CategoryPageData = {
  category: Category;
  articles: ArticleWithRelations[];
  subCategories: Category[];
  breadcrumbs: Category[];
  advertisements: Advertisement[];
};

export type LocationPageData = {
  location: Location;
  articles: ArticleWithRelations[];
  subLocations: Location[];
  breadcrumbs: Location[];
  advertisements: Advertisement[];
};

export type ArticlePageData = {
  article: ArticleWithRelations;
  relatedArticles: ArticleWithRelations[];
  previousArticle?: ArticleWithRelations | null;
  nextArticle?: ArticleWithRelations | null;
  advertisements: Advertisement[];
};

export type SearchPageData = {
  query: string;
  articles: ArticleWithRelations[];
  totalCount: number;
  categories: Category[];
  locations: Location[];
  tags: Tag[];
};

export type VideoPageData = {
  videos: Video[];
  categories: Category[];
  locations: Location[];
  advertisements: Advertisement[];
};

export type NavItem = {
  label: string;
  labelKn: string;
  href: string;
  children?: NavItem[];
  isExternal?: boolean;
  icon?: string;
};

export type Language = 'kn' | 'en';

export type Theme = 'light' | 'dark' | 'system';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: Record<string, unknown>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ArticleFormData {
  headline: string;
  headlineKn?: string;
  summary?: string;
  summaryKn?: string;
  content: string;
  contentKn?: string;
  excerpt?: string;
  excerptKn?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  featuredImageCaption?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  breakingLevel: 'NORMAL' | 'BREAKING' | 'URGENT';
  isFeatured: boolean;
  isEditorPick: boolean;
  isLive: boolean;
  allowComments: boolean;
  categoryId: string;
  locationId?: string;
  reporterId?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  scheduledAt?: string;
  tags?: string[];
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    role: 'ADMIN' | 'EDITOR' | 'REPORTER' | 'VIEWER';
  };
  expires: string;
}

declare global {
  namespace Express {
    interface Request {
      session?: UserSession;
    }
  }
}