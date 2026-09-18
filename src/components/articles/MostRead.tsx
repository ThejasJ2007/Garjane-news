'use client';

import Link from 'next/link';
import { Trophy, TrendingUp, Clock, Eye, ArrowRight } from 'lucide-react';
import { formatRelativeTimeKn, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { ArticleWithRelations, ArticleWithRelationsMinimal } from '@/types';

interface MostReadItemProps {
  article: ArticleWithRelations | ArticleWithRelationsMinimal;
  rank: number;
  language?: 'kn' | 'en';
}

function MostReadItem({ article, rank, language = 'kn' }: MostReadItemProps) {
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
      className="group flex items-start gap-4 p-3 rounded-xl hover:bg-garjane-background-light dark:hover:bg-garjane-background-dark transition-colors"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
        <span className={cn(rankStyles[rank as keyof typeof rankStyles] || rankStyles.default)}>
          {rank}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
          {displayHeadline}
        </h4>
        <div className="mt-1.5 flex items-center gap-3 text-caption text-garjane-text-muted">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {article.viewCount.toLocaleString()}
          </span>
          {article.category && (
            <Badge variant="primary" size="sm" className="text-caption">
              {language === 'kn' ? (article.category.nameKn || article.category.name) : article.category.name}
            </Badge>
          )}
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-garjane-text-muted group-hover:text-garjane-primary transition-colors flex-shrink-0" />
    </Link>
  );
}

interface MostReadProps {
  articles: (ArticleWithRelations | ArticleWithRelationsMinimal)[];
  title?: string;
  titleKn?: string;
  subtitle?: string;
  subtitleKn?: string;
  language?: 'kn' | 'en';
  className?: string;
  limit?: number;
}

export function MostRead({
  articles,
  title = 'Most Read',
  titleKn = 'ಹೆಚ್ಚು ಓದಲಾಗಿದೆ',
  subtitle,
  subtitleKn,
  language = 'kn',
  className,
  limit = 10,
}: MostReadProps) {
  const displayTitle = language === 'kn' ? titleKn : title;
  const displaySubtitle = language === 'kn' && subtitleKn ? subtitleKn : subtitle;

  if (articles.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Trophy className="w-12 h-12 text-garjane-text-muted mx-auto mb-4" />
        <p className="text-garjane-text-muted text-body">No articles to display.</p>
      </div>
    );
  }

  const limitedArticles = articles.slice(0, limit);

  return (
    <section className={cn('card p-6', className)} aria-labelledby="most-read-heading">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-6 h-6 text-garjane-accent" />
          <h2 id="most-read-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
            {displayTitle}
          </h2>
        </div>
        {displaySubtitle && (
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
            {displaySubtitle}
          </p>
        )}
      </header>

      <div className="space-y-1" role="list">
        {limitedArticles.map((article, index) => (
          <MostReadItem key={article.id} article={article} rank={index + 1} language={language} />
        ))}
      </div>
    </section>
  );
}

interface TrendingTopic {
  topic: string;
  topicKn?: string;
  count: number;
  category?: { slug: string; name: string; nameKn?: string | null };
}

interface TrendingNowProps {
  topics: TrendingTopic[];
  title?: string;
  titleKn?: string;
  language?: 'kn' | 'en';
  className?: string;
}

export function TrendingNow({
  topics,
  title = 'Trending Now',
  titleKn = 'ಪ್ರಚಲಿತ ಇನ್ನ',
  language = 'kn',
  className,
}: TrendingNowProps) {
  const displayTitle = language === 'kn' ? titleKn : title;

  if (topics.length === 0) {
    return (
      <div className="card p-8 text-center">
        <TrendingUp className="w-12 h-12 text-garjane-text-muted mx-auto mb-4" />
        <p className="text-garjane-text-muted text-body">No trending topics.</p>
      </div>
    );
  }

  return (
    <section className={cn('card p-6', className)} aria-labelledby="trending-heading">
      <header className="mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-garjane-accent" />
          <h2 id="trending-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
            {displayTitle}
          </h2>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide" role="list">
        {topics.map((topic, index) => {
          const displayTopic = language === 'kn' && topic.topicKn ? topic.topicKn : topic.topic;
          return (
            <Link
              key={topic.topic}
              href={topic.category ? `/category/${topic.category.slug}` : `/search?q=${encodeURIComponent(topic.topic)}`}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all duration-200',
                index === 0
                  ? 'bg-garjane-primary text-garjane-primary-foreground shadow-card'
                  : 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-secondary dark:text-garjane-text-muted hover:bg-garjane-primary/10 dark:hover:bg-garjane-primary/20 hover:text-garjane-primary dark:hover:text-garjane-primary-light'
              )}
              role="listitem"
            >
              <span className="text-garjane-accent">#</span>
              {displayTopic}
              <span className={cn(
                'text-caption px-2 py-0.5 rounded-full',
                index === 0 ? 'bg-garjane-primary-foreground/20' : 'bg-garjane-background-light dark:bg-garjane-background-dark'
              )}>
                {topic.count}+
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

interface BreakingNowProps {
  articles: (ArticleWithRelations | ArticleWithRelationsMinimal)[];
  title?: string;
  titleKn?: string;
  language?: 'kn' | 'en';
  className?: string;
  limit?: number;
}

export function BreakingNow({
  articles,
  title = 'Breaking News',
  titleKn = 'ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್',
  language = 'kn',
  className,
  limit = 5,
}: BreakingNowProps) {
  const displayTitle = language === 'kn' ? titleKn : title;
  const breakingArticles = articles.filter(
    (a) => a.breakingLevel === 'BREAKING' || a.breakingLevel === 'URGENT'
  ).slice(0, limit);

  if (breakingArticles.length === 0) {
    return null;
  }

  return (
    <section className={cn('card p-6 border-l-4 border-garjane-breaking-text bg-garjane-breaking-bg/50 dark:bg-garjane-breaking-bgDark/50', className)} aria-labelledby="breaking-heading">
      <header className="mb-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-pulse absolute top-0 left-0 h-full w-full rounded-full bg-red-500" />
            <span className="relative block h-full w-full rounded-full bg-red-500" />
          </span>
          <Badge variant="breaking" size="sm">
            {displayTitle}
          </Badge>
        </span>
      </header>

      <div className="space-y-3" role="list">
        {breakingArticles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-garjane-background-cardDark/50 transition-colors"
            role="listitem"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-garjane-breaking-text text-white text-caption font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
                {language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-caption text-garjane-text-muted">
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
        ))}
      </div>
    </section>
  );
}