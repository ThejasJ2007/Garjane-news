'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MapPin, Tag, Flame, Star, Zap, Radio } from 'lucide-react';
import { formatRelativeTimeKn, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import type { ArticleWithRelations, ArticleWithRelationsMinimal } from '@/types';

interface HeroStoryProps {
  article: ArticleWithRelations | ArticleWithRelationsMinimal;
  language?: 'kn' | 'en';
  priority?: boolean;
}

export function HeroStory({ article, language = 'kn', priority = true }: HeroStoryProps) {
  const isBreaking = article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = article.isLive;
  const isFeatured = article.isFeatured;
  const isEditorPick = article.isEditorPick;

  const imageUrl = article.featuredImage;
  const imageAlt = article.featuredImageAlt || article.headlineKn || article.headline;

  return (
    <article className="relative group hero-story card-elevated overflow-hidden">
      {imageUrl && (
        <Link href={`/article/${article.slug}`} className="hero-story-image" aria-label={language === 'kn' ? (article.headlineKn || article.headline) : article.headline}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            quality={90}
          />
        </Link>
      )}
      <div className="hero-story-overlay" aria-hidden="true" />
      <div className="hero-story-content">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {article.category && (
            <Link href={`/category/${article.category.slug}`} className="inline-block">
              <Badge variant="primary" size="md">
                {language === 'kn' ? (article.category.nameKn || article.category.name) : article.category.name}
              </Badge>
            </Link>
          )}
          {article.location && (
            <Link href={`/location/${article.location.slug}`} className="inline-block">
              <Badge variant="default" size="sm" dot>
                <MapPin className="w-3 h-3" />
                {language === 'kn' ? (article.location.nameKn || article.location.name) : article.location.name}
              </Badge>
            </Link>
          )}
          {(isBreaking || isLive || isFeatured || isEditorPick) && (
            <div className="flex items-center gap-1.5">
              {isBreaking && (
                <Badge variant="breaking" size="sm" dot>
                  <Flame className="w-3 h-3" />
                  {article.breakingLevel}
                </Badge>
              )}
              {isLive && (
                <Badge variant="live" size="sm" dot>
                  <Radio className="w-3 h-3" />
                  Live
                </Badge>
              )}
              {isFeatured && (
                <Badge variant="featured" size="sm" dot>
                  <Star className="w-3 h-3" />
                  Featured
                </Badge>
              )}
              {isEditorPick && (
                <Badge variant="editor-pick" size="sm" dot>
                  <Zap className="w-3 h-3" />
                  Editor&apos;s Pick
                </Badge>
              )}
            </div>
          )}
        </div>

        <Link href={`/article/${article.slug}`}>
          <h1 className="text-headline-1 text-garjane-text-inverse font-heading font-bold leading-tight mb-4 group-hover:text-garjane-accent transition-colors duration-300">
            {language === 'kn' ? (article.headlineKn || article.headline) : article.headline}
          </h1>
        </Link>

        {(article.summaryKn || article.summary) && (
          <p className="text-body-lg text-garjane-secondary-light/90 leading-relaxed mb-6 max-w-3xl">
            {language === 'kn' ? (article.summaryKn || article.summary) : article.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-body-sm text-garjane-secondary-light/70">
          {article.author && (
            <Link href={`/author/${article.author.id}`} className="flex items-center gap-2 hover:text-garjane-accent transition-colors">
              <Avatar src={article.author.avatar} name={article.author.name} size="sm" />
              <span className="font-medium">{article.author.name}</span>
            </Link>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
          </span>
          {article.readTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime} min read
            </span>
          )}
          {article.viewCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {article.viewCount.toLocaleString()} views
            </span>
          )}
          {article.reporter && (
            <span className="flex items-center gap-1.5 text-garjane-accent">
              <Badge variant="secondary" size="sm">Reporter: {article.reporter.user.name}</Badge>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}