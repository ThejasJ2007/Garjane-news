import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  confirmPassword: z.string(),
  language: z.enum(['kn', 'en']).default('kn'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const articleSchema = z.object({
  headline: z.string().min(5, 'Headline must be at least 5 characters').max(200),
  headlineKn: z.string().max(200).optional(),
  summary: z.string().max(500).optional(),
  summaryKn: z.string().max(500).optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  contentKn: z.string().optional(),
  excerpt: z.string().max(300).optional(),
  excerptKn: z.string().max(300).optional(),
  featuredImage: z.string().url().optional().or(z.literal('')),
  featuredImageAlt: z.string().max(200).optional(),
  featuredImageCaption: z.string().max(300).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).default('DRAFT'),
  breakingLevel: z.enum(['NORMAL', 'BREAKING', 'URGENT']).default('NORMAL'),
  isFeatured: z.boolean().default(false),
  isEditorPick: z.boolean().default(false),
  isLive: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  categoryId: z.string().cuid('Invalid category'),
  locationId: z.string().cuid().optional(),
  reporterId: z.string().cuid().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  nameKn: z.string().min(2, 'Kannada name must be at least 2 characters').max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional(),
  descriptionKn: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').default('#C01A2A'),
  icon: z.string().optional(),
  parentId: z.string().cuid().optional(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const locationSchema = z.object({
  name: z.string().min(2).max(100),
  nameKn: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  type: z.enum(['state', 'district', 'taluk', 'locality']),
  parentId: z.string().cuid().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().min(0).default(0),
});

export const tagSchema = z.object({
  name: z.string().min(2).max(50),
  nameKn: z.string().max(50).optional(),
  slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6B7280'),
});

export const videoSchema = z.object({
  title: z.string().min(5).max(200),
  titleKn: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  descriptionKn: z.string().max(1000).optional(),
  videoUrl: z.string().url('Invalid video URL'),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').optional(),
  duration: z.number().int().positive('Duration must be positive'),
  categoryId: z.string().cuid().optional(),
  locationId: z.string().cuid().optional(),
  reporterId: z.string().cuid().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
});

export const advertisementSchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['banner', 'sidebar', 'in-feed', 'mobile', 'video-pre-roll']),
  imageUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  targetUrl: z.string().url().optional().or(z.literal('')),
  htmlCode: z.string().optional(),
  position: z.enum(['top-banner', 'sidebar', 'article-top', 'article-middle', 'article-bottom', 'in-feed', 'mobile-banner']),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
});

export const breakingNewsSchema = z.object({
  headline: z.string().min(5).max(200),
  headlineKn: z.string().max(200).optional(),
  articleId: z.string().cuid().optional(),
  level: z.enum(['BREAKING', 'URGENT']).default('BREAKING'),
  isActive: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().max(100).optional(),
  language: z.enum(['kn', 'en']).default('kn'),
});

export const commentSchema = z.object({
  content: z.string().min(3, 'Comment must be at least 3 characters').max(2000),
  parentId: z.string().cuid().optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(1000).optional(),
  location: z.string().max(200).optional(),
  phone: z.string().max(20).optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const searchSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  sortBy: z.enum(['publishedAt', 'viewCount', 'createdAt']).default('publishedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  category: z.string().cuid().optional(),
  location: z.string().cuid().optional(),
  tag: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ArticleInput = z.infer<typeof articleSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type LocationInput = z.infer<typeof locationSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type AdvertisementInput = z.infer<typeof advertisementSchema>;
export type BreakingNewsInput = z.infer<typeof breakingNewsSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;