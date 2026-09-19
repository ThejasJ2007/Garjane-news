'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MapPin, Tag, Flame, Star, Zap, Radio } from 'lucide-react';
import { formatRelativeTime, formatRelativeTimeKn, cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { ArticleWithRelations, ArticleWithRelationsMinimal } from '@/types';

interface ArticleCardProps {
  article: ArticleWithRelations | ArticleWithRelationsMinimal;
  variant: 'default' | 'featured' | 'compact' | 'horizontal' | 'breaking' | 'live';
  showCategory?: boolean;
  showLocation?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;
  priority?: boolean;
}

export function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showLocation = false,
  showAuthor = false,
  showStats = false,
  priority = false,
}: ArticleCardProps) {
  const isBreaking = article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = article.isLive;
  const isFeatured = article.isFeatured;
  const isEditorPick = article.isEditorPick;

  const imageUrl = article.featuredImage;
  const imageAlt = article.featuredImageAlt || article.headlineKn || article.headline;

  const variants = {
    default: 'grid grid-cols-1 md:grid-cols-12 gap-4',
    featured: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    compact: 'flex flex-col gap-3',
    horizontal: 'flex gap-4',
    breaking: 'grid grid-cols-1 md:grid-cols-12 gap-4 border-l-4 border-garjane-breaking-text',
    live: 'grid grid-cols-1 md:grid-cols-12 gap-4 border-l-4 border-red-500 animate-pulse-soft',
  };

  const contentClass = {
    default: 'md:col-span-8',
    featured: 'col-span-1',
    compact: '',
    horizontal: 'flex-1 min-w-0',
    breaking: 'md:col-span-8',
    live: 'md:col-span-8',
  };

  const imageClass = {
    default: 'md:col-span-4 aspect-[4/3]',
    featured: 'col-span-1 aspect-[16/9]',
    compact: 'aspect-[16/9] w-full',
    horizontal: 'w-32 h-32 lg:w-40 lg:h-40 flex-shrink-0 aspect-square',
    breaking: 'md:col-span-4 aspect-[4/3]',
    live: 'md:col-span-4 aspect-[4/3]',
  };

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="group">
        {imageUrl && (
          <div className={cn('relative overflow-hidden rounded-lg', imageClass.compact)}>
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {(isBreaking || isLive || isFeatured || isEditorPick) && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {isBreaking && <Badge variant="breaking" size="sm" dot><Flame className="w-2.5 h-2.5" /> Breaking</Badge>}
                {isLive && <Badge variant="live" size="sm" dot><Radio className="w-2.5 h-2.5" /> Live</Badge>}
                {isFeatured && <Badge variant="featured" size="sm" dot><Star className="w-2.5 h-2.5" /> Featured</Badge>}
                {isEditorPick && <Badge variant="editor-pick" size="sm" dot><Zap className="w-2.5 h-2.5" /> Editor&apos;s Pick</Badge>}
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {showCategory && article.category && (
            <Link href={`/category/${article.category.slug}`} className="inline-block mb-1">
              <Badge variant="primary" size="sm" className="text-caption">
                {article.category.nameKn || article.category.name}
              </Badge>
            </Link>
          )}
          <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
            {article.headlineKn || article.headline}
          </h3>
          {(article.summaryKn || article.summary) && (
            <p className="mt-1 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-2">
              {article.summaryKn || article.summary}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
            {showAuthor && article.author && (
              <span className="flex items-center gap-1">
                {article.author.avatar ? (
                  <Image src={article.author.avatar} alt="" width={16} height={16} className="w-4 h-4 rounded-full" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-garjane-primary/10 text-garjane-primary text-xs flex items-center justify-center">
                    {article.author.name.charAt(0)}
                  </span>
                )}
                {article.author.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
            </span>
            {showStats && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.viewCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <ArticleCardWrapper variant={variant} priority={priority}>
      {imageUrl && (
        <Link href={`/article/${article.slug}`} className="relative overflow-hidden rounded-lg" aria-label={article.headlineKn || article.headline}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes={variant === 'featured' ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 100vw, 33vw'}
          />
          {(isBreaking || isLive || isFeatured || isEditorPick) && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {isBreaking && <Badge variant="breaking" size="sm" dot><Flame className="w-3 h-3" /> {article.breakingLevel}</Badge>}
              {isLive && <Badge variant="live" size="sm" dot><Radio className="w-3 h-3" /> Live</Badge>}
              {isFeatured && <Badge variant="featured" size="sm" dot><Star className="w-3 h-3" /> Featured</Badge>}
              {isEditorPick && <Badge variant="editor-pick" size="sm" dot><Zap className="w-3 h-3" /> Editor&apos;s Pick</Badge>}
            </div>
          )}
          {article.readTime > 0 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-caption px-2 py-1 rounded flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min
            </div>
          )}
        </Link>
      )}

      <div className={cn('flex flex-col justify-between', contentClass[variant])}>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {showCategory && article.category && (
              <Link href={`/category/${article.category.slug}`} className="inline-block">
                <Badge variant="primary" size="sm">
                  {article.category.nameKn || article.category.name}
                </Badge>
              </Link>
            )}
            {showLocation && article.location && (
              <Link href={`/location/${article.location.slug}`} className="inline-block">
                <Badge variant="default" size="sm" dot>
                  <MapPin className="w-2.5 h-2.5" />
                  {article.location.nameKn || article.location.name}
                </Badge>
              </Link>
            )}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-garjane-text-muted" />
                <span className="text-caption text-garjane-text-muted">
                  {article.tags.slice(0, 2).map(t => t.tag.nameKn || t.tag.name).join(', ')}
                  {article.tags.length > 2 && ` +${article.tags.length - 2}`}
                </span>
              </div>
            )}
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className={cn(
              'font-heading font-semibold line-clamp-2 transition-colors group-hover:text-garjane-primary',
              variant === 'featured' ? 'text-headline-2' : 'text-headline-3'
            )}>
              {article.headlineKn || article.headline}
            </h3>
          </Link>

          {(article.summaryKn || article.summary) && (
            <p className={cn('mt-3 line-clamp-3 text-garjane-text-secondary dark:text-garjane-text-muted', variant === 'featured' ? 'text-body' : 'text-body-sm')}>
              {article.summaryKn || article.summary}
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
          {showAuthor && article.author && (
            <Link href={`/author/${article.author.id}`} className="flex items-center gap-1.5 hover:text-garjane-primary transition-colors">
              <Avatar src={article.author.avatar} name={article.author.name} size="xs" />
              <span>{article.author.name}</span>
            </Link>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
          </span>
          {showStats && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount.toLocaleString()}
            </span>
          )}
          {article.reporter && (
            <span className="flex items-center gap-1 text-garjane-accent">
              <Badge variant="secondary" size="sm">Reporter: {article.reporter.user.name}</Badge>
            </span>
          )}
        </div>
      </div>
    </ArticleCardWrapper>
  );
}

function ArticleCardWrapper({ children, variant = 'default', priority }: { children: React.ReactNode; variant: 'default' | 'featured' | 'compact' | 'horizontal' | 'breaking' | 'live'; priority?: boolean }) {
  const baseStyles = 'group relative bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-xl overflow-hidden transition-all duration-350 ease-out-expo hover:shadow-card-hover';

  const variantStyles: Record<'default' | 'featured' | 'compact' | 'horizontal' | 'breaking' | 'live', string> = {
    default: '',
    featured: 'lg:grid lg:grid-cols-2',
    compact: 'flex flex-row',
    horizontal: 'flex',
    breaking: 'border-l-4 border-garjane-breaking-text bg-garjane-breaking-bg/50 dark:bg-garjane-breaking-bgDark/50',
    live: 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10',
  };

  return (
    <article className={cn(baseStyles, variantStyles[variant])}>
      {children}
    </article>
  );
}

export function ArticleGrid({ articles, variant = 'default', ...props }: { articles: (ArticleWithRelations | ArticleWithRelationsMinimal)[]; variant?: ArticleCardProps['variant'] } & Omit<ArticleCardProps, 'article'>) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-garjane-text-muted text-body">No articles found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:gap-8">
      {articles.map((article, index) => (
        <ArticleCard key={article.id} article={article} variant={variant} priority={index < 4} {...props} />
      ))}
    </div>
  );
}

export function ArticleList({ articles, ...props }: { articles: (ArticleWithRelations | ArticleWithRelationsMinimal)[] } & Omit<ArticleCardProps, 'article' | 'variant'>) {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="compact" {...props} />
      ))}
    </div>
  );
}