'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MapPin, Tag, Flame, Star, Zap, Radio, ChevronRight } from 'lucide-react';
import { formatRelativeTimeKn, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { ArticleWithRelations } from '@/types';

interface RelatedArticlesProps {
  articles: ArticleWithRelations[];
  title?: string;
  titleKn?: string;
  language?: 'kn' | 'en';
  variant?: 'grid' | 'list' | 'sidebar';
  limit?: number;
  showAuthor?: boolean;
  showStats?: boolean;
  showCategory?: boolean;
  showLocation?: boolean;
  className?: string;
}

export function RelatedArticles({
  articles,
  title = 'Related Articles',
  titleKn = 'ಸಂಬಂಧಿತ ಲೇಖನಗಳು',
  language = 'kn',
  variant = 'grid',
  limit = 6,
  showAuthor = true,
  showStats = false,
  showCategory = true,
  showLocation = false,
  className,
}: RelatedArticlesProps) {
  const displayTitle = language === 'kn' ? titleKn : title;
  const limitedArticles = articles.slice(0, limit);

  if (limitedArticles.length === 0) {
    return null;
  }

  const isBreaking = (article: ArticleWithRelations) =>
    article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = (article: ArticleWithRelations) => article.isLive;
  const isFeatured = (article: ArticleWithRelations) => article.isFeatured;
  const isEditorPick = (article: ArticleWithRelations) => article.isEditorPick;

  // Grid Variant
  if (variant === 'grid') {
    return (
      <section className={cn('space-y-6', className)} aria-labelledby="related-articles-heading">
        <header className="flex items-center justify-between">
          <h2 id="related-articles-heading" className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
            {displayTitle}
          </h2>
          <Link
            href="/latest"
            className="text-body-sm font-medium text-garjane-primary hover:text-garjane-primary-dark dark:hover:text-garjane-primary-light transition-colors flex items-center gap-1"
          >
            {language === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ' : 'View All'}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {limitedArticles.map((article, index) => (
            <ArticleCardGridItem
              key={article.id}
              article={article}
              index={index}
              language={language}
              showAuthor={showAuthor}
              showStats={showStats}
              showCategory={showCategory}
              showLocation={showLocation}
            />
          ))}
        </div>
      </section>
    );
  }

  // List Variant
  if (variant === 'list') {
    return (
      <section className={cn('space-y-4', className)} aria-labelledby="related-articles-heading">
        <h2 id="related-articles-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
          {displayTitle}
        </h2>
        <div className="space-y-4" role="list">
          {limitedArticles.map((article) => (
            <ArticleCardListItem
              key={article.id}
              article={article}
              language={language}
              showAuthor={showAuthor}
              showStats={showStats}
              showCategory={showCategory}
              showLocation={showLocation}
            />
          ))}
        </div>
      </section>
    );
  }

  // Sidebar Variant
  return (
    <section className={cn('space-y-4', className)} aria-labelledby="related-articles-heading">
      <h2 id="related-articles-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
        {displayTitle}
      </h2>
      <div className="space-y-3" role="list">
        {limitedArticles.map((article, index) => (
          <ArticleCardSidebarItem
            key={article.id}
            article={article}
            rank={index + 1}
            language={language}
          />
        ))}
      </div>
    </section>
  );
}

// Grid Item Component
function ArticleCardGridItem({
  article,
  index,
  language,
  showAuthor,
  showStats,
  showCategory,
  showLocation,
}: {
  article: ArticleWithRelations;
  index: number;
  language: 'kn' | 'en';
  showAuthor: boolean;
  showStats: boolean;
  showCategory: boolean;
  showLocation: boolean;
}) {
  const isBreaking = article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = article.isLive;
  const isFeatured = article.isFeatured;
  const isEditorPick = article.isEditorPick;

  const imageUrl = article.featuredImage;
  const imageAlt = article.featuredImageAlt || article.headlineKn || article.headline;

  return (
    <article className={cn(
      'group relative bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-xl overflow-hidden transition-all duration-350 ease-out-expo hover:shadow-card-hover',
      isBreaking && 'border-l-4 border-garjane-breaking-text bg-garjane-breaking-bg/50 dark:bg-garjane-breaking-bgDark/50',
      isLive && 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10'
    )}>
      <Link
        href={`/article/${article.slug}`}
        className="block relative overflow-hidden aspect-[16/9]"
        aria-label={language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={index < 4}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {!imageUrl && (
          <div className="w-full h-full bg-garjane-border-light dark:bg-garjane-border-dark flex items-center justify-center">
            <span className="text-garjane-text-muted">No Image</span>
          </div>
        )}
        {(isBreaking || isLive || isFeatured || isEditorPick) && (
          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
            {isBreaking && (
              <Badge variant="breaking" size="sm" dot>
                <Flame className="w-3 h-3" />
                {article.breakingLevel}
              </Badge>
            )}
            {isLive && (
              <Badge variant="live" size="sm" dot>
                <Radio className="w-3 h-3" />
                {language === 'kn' ? 'ಜೀವಂತ' : 'Live'}
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="featured" size="sm" dot>
                <Star className="w-3 h-3" />
                {language === 'kn' ? 'ವಿಶೇಷ' : 'Featured'}
              </Badge>
            )}
            {isEditorPick && (
              <Badge variant="editor-pick" size="sm" dot>
                <Zap className="w-3 h-3" />
                {language === 'kn' ? 'ಸಂಪಾದಕ' : 'Editor'}
              </Badge>
            )}
          </div>
        )}
        {article.readTime > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-caption px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime} min
          </div>
        )}
      </Link>

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {showCategory && article.category && (
            <Link href={`/category/${article.category.slug}`} className="inline-block">
              <Badge variant="primary" size="sm">
                {language === 'kn' ? (article.category.nameKn || article.category.name) : article.category.name}
              </Badge>
            </Link>
          )}
          {showLocation && article.location && (
            <Link href={`/location/${article.location.slug}`} className="inline-block">
              <Badge variant="default" size="sm" dot>
                <MapPin className="w-2.5 h-2.5" />
                {language === 'kn' ? (article.location.nameKn || article.location.name) : article.location.name}
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
          <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors mb-2">
            {language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
          </h3>
        </Link>

        {(article.summaryKn || article.summary) && (
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-3 mb-3">
            {language === 'kn' ? (article.summaryKn || article.summary) : article.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
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
              <Badge variant="secondary" size="sm">
                {language === 'kn' ? 'ವರ್ತಮಾನದಾರ:' : 'Reporter:'} {article.reporter.user.name}
              </Badge>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// List Item Component
function ArticleCardListItem({
  article,
  language,
  showAuthor,
  showStats,
  showCategory,
  showLocation,
}: {
  article: ArticleWithRelations;
  language: 'kn' | 'en';
  showAuthor: boolean;
  showStats: boolean;
  showCategory: boolean;
  showLocation: boolean;
}) {
  const isBreaking = article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = article.isLive;

  const imageUrl = article.featuredImage;
  const imageAlt = article.featuredImageAlt || article.headlineKn || article.headline;

  return (
    <article
      className={cn(
        'group relative flex gap-4 p-3 rounded-xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark transition-all duration-300 hover:shadow-card-hover',
        isBreaking && 'border-l-4 border-garjane-breaking-text bg-garjane-breaking-bg/50 dark:bg-garjane-breaking-bgDark/50',
        isLive && 'border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/10'
      )}
      role="listitem"
    >
      <Link
        href={`/article/${article.slug}`}
        className="relative overflow-hidden rounded-lg flex-shrink-0 w-28 h-28 lg:w-32 lg:h-24"
        aria-label={language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-garjane-border-light dark:bg-garjane-border-dark flex items-center justify-center">
            <span className="text-garjane-text-muted text-caption">No Image</span>
          </div>
        )}
        {(isBreaking || isLive) && (
          <div className="absolute top-2 left-2">
            {isBreaking && (
              <Badge variant="breaking" size="sm" dot>
                <Flame className="w-2.5 h-2.5" />
                {article.breakingLevel}
              </Badge>
            )}
            {isLive && (
              <Badge variant="live" size="sm" dot>
                <Radio className="w-2.5 h-2.5" />
              </Badge>
            )}
          </div>
        )}
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {showCategory && article.category && (
              <Link href={`/category/${article.category.slug}`} className="inline-block">
                <Badge variant="primary" size="sm">
                  {language === 'kn' ? (article.category.nameKn || article.category.name) : article.category.name}
                </Badge>
              </Link>
            )}
            {showLocation && article.location && (
              <Link href={`/location/${article.location.slug}`} className="inline-block">
                <Badge variant="default" size="sm" dot>
                  <MapPin className="w-2.5 h-2.5" />
                  {language === 'kn' ? (article.location.nameKn || article.location.name) : article.location.name}
                </Badge>
              </Link>
            )}
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="font-semibold text-body text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
              {language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
            </h3>
          </Link>

          {(article.summaryKn || article.summary) && (
            <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-2">
              {language === 'kn' ? (article.summaryKn || article.summary) : article.summary}
            </p>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
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
        </div>
      </div>
    </article>
  );
}

// Sidebar Item Component (ranked list)
function ArticleCardSidebarItem({
  article,
  rank,
  language,
}: {
  article: ArticleWithRelations;
  rank: number;
  language: 'kn' | 'en';
}) {
  const displayHeadline = language === 'kn' && article.headlineKn ? article.headlineKn : article.headline;

  const rankStyles = {
    1: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
    2: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    3: 'bg-gradient-to-r from-amber-700 to-amber-900 text-white',
    default: 'bg-garjane-primary text-garjane-primary-foreground',
  };

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex items-start gap-3 p-2 rounded-lg hover:bg-garjane-background-light/50 dark:hover:bg-garjane-background-dark/50 transition-colors"
      role="listitem"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
        <span className={cn(rankStyles[rank as keyof typeof rankStyles] || rankStyles.default)}>
          {rank}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
          {displayHeadline}
        </h4>
        <div className="mt-1.5 flex items-center gap-2 text-caption text-garjane-text-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
          </span>
          {article.category && (
            <Badge variant="primary" size="sm" className="text-caption">
              {language === 'kn' ? (article.category.nameKn || article.category.name) : article.category.name}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

// Alternative: Related Articles Carousel for featured sections
interface RelatedArticlesCarouselProps {
  articles: ArticleWithRelations[];
  title?: string;
  titleKn?: string;
  language?: 'kn' | 'en';
  autoPlay?: boolean;
  className?: string;
}

export function RelatedArticlesCarousel({
  articles,
  title = 'You May Also Like',
  titleKn = 'ನೀವು ಇಷ್ಟಪಡಬಹುದಾದ',
  language = 'kn',
  autoPlay = false,
  className,
}: RelatedArticlesCarouselProps) {
  const displayTitle = language === 'kn' ? titleKn : title;

  if (articles.length === 0) return null;

  return (
    <section className={cn('space-y-6', className)} aria-labelledby="carousel-heading">
      <h2 id="carousel-heading" className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
        {displayTitle}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {articles.slice(0, 8).map((article, index) => (
          <ArticleCardGridItem
            key={article.id}
            article={article}
            index={index}
            language={language}
            showAuthor={true}
            showStats={true}
            showCategory={true}
            showLocation={false}
          />
        ))}
      </div>
    </section>
  );
}