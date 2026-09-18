'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, MapPin, Tag, Share2, Facebook, Twitter, MessageSquare, Mail, Copy, Bookmark, Flame, Radio, Star, Zap, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Image as ImageIcon, Video as VideoIcon, MapPin as MapPinIcon, Layers, X, Instagram } from 'lucide-react';
import { formatRelativeTimeKn, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card, CardContent } from '@/components/ui/Card';
import type { ArticleWithRelations, Advertisement } from '@/types';

interface ArticleDetailProps {
  article: ArticleWithRelations;
  relatedArticles?: ArticleWithRelations[];
  previousArticle?: ArticleWithRelations | null;
  nextArticle?: ArticleWithRelations | null;
  advertisements?: {
    top?: Advertisement[];
    middle?: Advertisement[];
    bottom?: Advertisement[];
  };
}

interface LiveUpdateItem {
  id: string;
  content: string;
  contentKn?: string | null;
  timestamp: Date;
}

function renderArticleContent(content: string, language: 'kn' | 'en') {
  // Simple content rendering - in production, you might want to use a markdown parser or sanitize HTML
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  return (
    <div className="article-content prose prose-lg prose-headings:text-garjane-text-primary dark:prose-headings:text-garjane-text-inverse prose-a:text-garjane-primary dark:prose-a:text-garjane-primary-light prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-card prose-strong:text-garjane-text-primary dark:prose-strong:text-garjane-text-inverse max-w-none">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function AdvertisementPlaceholder({ ad }: { ad: Advertisement }) {
  if (ad.imageUrl) {
    return (
      <a
        href={ad.targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        aria-label="Advertisement"
      >
        <Image
          src={ad.imageUrl}
          alt="Advertisement"
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, 728px"
        />
      </a>
    );
  }
  return (
    <div className="ad-placeholder rounded-xl">
      <span>Advertisement</span>
    </div>
  );
}

function ShareButtons({ article, language }: { article: ArticleWithRelations; language: 'kn' | 'en' }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const title = language === 'kn' ? (article.headlineKn || article.headline) : article.headline;

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(url);
    const shareTitle = encodeURIComponent(title);

    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${shareTitle}&body=${shareUrl}`;
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Share article">
      <span className="text-caption text-garjane-text-muted mr-2">{language === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ:' : 'Share:'}</span>
      <Button variant="ghost" size="sm" onClick={() => handleShare('facebook')} className="share-button" aria-label="Share on Facebook">
        <Facebook className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleShare('twitter')} className="share-button" aria-label="Share on Twitter">
        <Twitter className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleShare('whatsapp')} className="share-button" aria-label="Share on WhatsApp">
        <MessageSquare className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleShare('email')} className="share-button" aria-label="Share via Email">
        <Mail className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleShare('copy')} className="share-button" aria-label={copied ? (language === 'kn' ? 'ಕಾಪಿ ಮಾಡಲಾಗಿದೆ' : 'Copied') : (language === 'kn' ? 'ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ' : 'Copy Link')}>
        {copied ? <Copy className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
      </Button>
    </div>
  );
}

function AuthorBio({ article, language }: { article: ArticleWithRelations; language: 'kn' | 'en' }) {
  if (!article.author) return null;

  return (
    <Card className="bg-garjane-background-light/50 dark:bg-garjane-background-dark/50">
      <CardContent className="flex items-start gap-4">
        <Avatar src={article.author.avatar} name={article.author.name} size="lg" />
        <div className="flex-1">
          <Link href={`/author/${article.author.id}`} className="font-semibold text-body text-garjane-text-primary dark:text-garjane-text-inverse hover:text-garjane-primary transition-colors">
            {article.author.name}
          </Link>
          <p className="mt-1 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
            {language === 'kn' ? 'ಗರ್ಜನೆ ನ್ಯೂಸ್ ರಿಪೋರ್ಟರ್' : 'Garjane News Reporter'}
          </p>
          <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-3">
            {language === 'kn' && article.author.bioKn ? article.author.bioKn : article.author.bio || (language === 'kn' ? 'ಅನುಭವಿ ವೃತ್ತಿಪತ್ರಕಾರ' : 'Experienced journalist covering local news.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TagsList({ article, language }: { article: ArticleWithRelations; language: 'kn' | 'en' }) {
  if (article.tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
      {article.tags.map(({ tag }) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="tag-chip"
          role="listitem"
        >
          <Tag className="w-3 h-3" aria-hidden="true" />
          {language === 'kn' ? (tag.nameKn || tag.name) : tag.name}
        </Link>
      ))}
    </div>
  );
}

function LiveUpdates({ updates, language }: { updates: LiveUpdateItem[]; language: 'kn' | 'en' }) {
  if (updates.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="live-updates-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Radio className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
        </div>
        <h2 id="live-updates-heading" className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
          {language === 'kn' ? 'ಜೀವಂತ ತाजಾ खबर' : 'Live Updates'}
        </h2>
      </div>
      <div className="space-y-4 border-l-2 border-garjane-primary/30 pl-6 ml-5">
        {updates.map((update, index) => (
          <div key={update.id} className="relative pb-6 last:pb-0">
            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-garjane-primary border-2 border-white dark:border-garjane-background-dark" />
            <time className="text-caption text-garjane-text-muted block mb-1">
              {formatRelativeTimeKn(update.timestamp)}
            </time>
            <p className="text-body text-garjane-text-primary dark:text-garjane-text-inverse">
              {language === 'kn' && update.contentKn ? update.contentKn : update.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ galleries, language }: { galleries: ArticleWithRelations['galleries']; language: 'kn' | 'en' }) {
  if (!galleries || galleries.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-6">
        {language === 'kn' ? 'ಚಿತ್ರ ವೀಕ್ಷಣ ಶ್ರೇಣಿ' : 'Photo Gallery'}
      </h2>
      {galleries.map((gallery) => (
        <div key={gallery.id} className="mb-8">
          {(gallery.titleKn || gallery.title) && (
            <h3 className="text-headline-4 font-heading font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
              {language === 'kn' ? (gallery.titleKn || gallery.title) : gallery.title}
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.images
              ?.sort((a, b) => a.displayOrder - b.displayOrder)
              .map((image) => (
                <figure key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-xl group">
                  <Image
                    src={image.url}
                    alt={image.alt || image.caption || image.captionKn || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-body-sm">
                    {language === 'kn' ? (image.captionKn || image.caption || '') : (image.caption || image.captionKn || '')}
                  </figcaption>
                </figure>
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function MediaSection({ article, language }: { article: ArticleWithRelations; language: 'kn' | 'en' }) {
  const images = article.media.filter(m => m.type === 'IMAGE');
  const videos = article.media.filter(m => m.type === 'VIDEO');

  if (images.length === 0 && videos.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="media-heading">
      <h2 id="media-heading" className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-6">
        {language === 'kn' ? 'ಬազմಾಧ್ಯಮ' : 'Media'}
      </h2>
      {images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-headline-4 font-heading font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            {language === 'kn' ? 'ಚಿತ್ರಗಳು' : 'Images'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((media) => (
              <figure key={media.id} className="relative aspect-[16/9] overflow-hidden rounded-xl group">
                <Image
                  src={media.url}
                  alt={media.alt || media.caption || media.captionKn || ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {(media.caption || media.captionKn) && (
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-body-sm">
                    {language === 'kn' ? (media.captionKn || media.caption || '') : (media.caption || media.captionKn || '')}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      )}
      {videos.length > 0 && (
        <div>
          <h3 className="text-headline-4 font-heading font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-4 flex items-center gap-2">
            <VideoIcon className="w-5 h-5" />
            {language === 'kn' ? 'ವಿಡಿಯೋಗಳು' : 'Videos'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((media) => (
              <div key={media.id} className="relative aspect-video rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark group">
                {media.thumbnailUrl && (
                  <Image
                    src={media.thumbnailUrl}
                    alt={media.caption || media.captionKn || ''}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-garjane-primary/90 flex items-center justify-center backdrop-blur-sm">
                    <VideoIcon className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                {(media.caption || media.captionKn) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-body-sm">
                    {language === 'kn' ? (media.captionKn || media.caption || '') : (media.caption || media.captionKn || '')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PreviousNextNavigation({ previousArticle, nextArticle, language }: {
  previousArticle?: ArticleWithRelations | null;
  nextArticle?: ArticleWithRelations | null;
  language: 'kn' | 'en';
}) {
  if (!previousArticle && !nextArticle) return null;

  return (
    <nav className="mt-12 pt-8 border-t border-garjane-border-light dark:border-garjane-border-dark" aria-label="Article navigation">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {previousArticle && (
          <Link
            href={`/article/${previousArticle.slug}`}
            className="group flex items-start gap-4 p-4 rounded-xl bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10 transition-colors"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-garjane-primary/10 flex items-center justify-center text-garjane-primary group-hover:bg-garjane-primary group-hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-caption text-garjane-text-muted block mb-1">
                {language === 'kn' ? 'ಹಿಂದಿನ ಲೇಖನ' : 'Previous Article'}
              </span>
              <h3 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
                {language === 'kn' ? (previousArticle.headlineKn || previousArticle.headline) : previousArticle.headline}
              </h3>
            </div>
          </Link>
        )}
        {nextArticle && (
          <Link
            href={`/article/${nextArticle.slug}`}
            className="group flex items-start gap-4 p-4 rounded-xl bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10 transition-colors md:justify-end"
          >
            <div className="flex-1 min-w-0 text-right">
              <span className="text-caption text-garjane-text-muted block mb-1">
                {language === 'kn' ? 'அடுத்த ಲೇಖನ' : 'Next Article'}
              </span>
              <h3 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
                {language === 'kn' ? (nextArticle.headlineKn || nextArticle.headline) : nextArticle.headline}
              </h3>
            </div>
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-garjane-primary/10 flex items-center justify-center text-garjane-primary group-hover:bg-garjane-primary group-hover:text-white transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export function ArticleDetail({
  article,
  relatedArticles = [],
  previousArticle,
  nextArticle,
  advertisements = {}
}: ArticleDetailProps) {
  const [language, setLanguage] = useState<'kn' | 'en'>('kn');
  const [fontSize, setFontSize] = useState(1);
  const [showShareSheet, setShowShareSheet] = useState(false);

  const isBreaking = article.breakingLevel === 'BREAKING' || article.breakingLevel === 'URGENT';
  const isLive = article.isLive;
  const isFeatured = article.isFeatured;
  const isEditorPick = article.isEditorPick;

  const displayHeadline = language === 'kn' ? (article.headlineKn || article.headline) : article.headline;
  const displaySummary = language === 'kn' ? (article.summaryKn || article.summary) : article.summary;
  const displayContent = language === 'kn' ? (article.contentKn || article.content) : article.content;
  const displayExcerpt = language === 'kn' ? (article.excerptKn || article.excerpt) : article.excerpt;

  return (
    <article className="space-y-8" role="article">
      {/* Top Advertisement */}
      {advertisements.top && advertisements.top.length > 0 && (
        <div className="relative aspect-[728/90] max-w-[728px] mx-auto rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
          {advertisements.top.map((ad, index) => (
            <AdvertisementPlaceholder key={ad.id} ad={ad} />
          ))}
          <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
        </div>
      )}

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
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
                  {language === 'kn' ? 'ಸಂಪಾದಕದ ಚಯನ' : 'Editor\'s Pick'}
                </Badge>
              )}
            </div>
          )}
        </div>

        <h1 className={`font-heading font-bold leading-tight ${fontSize >= 1.2 ? 'text-headline-1' : 'text-headline-2'}`}>
          {displayHeadline}
        </h1>

        {displayExcerpt && (
          <p className={`text-garjane-text-secondary dark:text-garjane-text-secondary leading-relaxed ${fontSize >= 1.2 ? 'text-body-lg' : 'text-body'}`}>
            {displayExcerpt}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-body-sm text-garjane-text-muted">
          {article.author && (
            <Link href={`/author/${article.author.id}`} className="flex items-center gap-2 hover:text-garjane-primary transition-colors">
              <Avatar src={article.author.avatar} name={article.author.name} size="xs" />
              <span className="font-medium">{article.author.name}</span>
            </Link>
          )}
          {article.reporter && (
            <span className="flex items-center gap-1.5 text-garjane-accent">
              <Badge variant="secondary" size="sm">
                {language === 'kn' ? 'ವರ್ತಮಾನದಾರ:' : 'Reporter:'} {article.reporter.user.name}
              </Badge>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <time dateTime={article.publishedAt?.toISOString() || article.createdAt.toISOString()}>
              {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
            </time>
          </span>
          {article.updatedAt !== article.createdAt && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <time dateTime={article.updatedAt.toISOString()}>
                {language === 'kn' ? 'ಪರಿಷ್ಕೃತ:' : 'Updated:'} {formatRelativeTimeKn(article.updatedAt)}
              </time>
            </span>
          )}
          {article.readTime > 0 && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readTime} {language === 'kn' ? 'ನಿಮಿಷ ಓದುವಿಕೆ' : 'min read'}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {article.viewCount.toLocaleString()} {language === 'kn' ? 'ಬಳಕೆದಾರರು' : 'views'}
          </span>
        </div>

        {/* Language & Font Size Controls */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-garjane-border-light dark:border-garjane-border-dark">
          <div className="flex items-center gap-2" role="group" aria-label="Language selection">
            <span className="text-caption text-garjane-text-muted">{language === 'kn' ? 'ಭಾಷೆ:' : 'Language:'}</span>
            <Button
              variant={language === 'kn' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('kn')}
              className="text-caption"
            >
              ಕನ್ನಡ
            </Button>
            <Button
              variant={language === 'en' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('en')}
              className="text-caption"
            >
              English
            </Button>
          </div>
          <div className="flex items-center gap-2" role="group" aria-label="Font size">
            <span className="text-caption text-garjane-text-muted">{language === 'kn' ? 'ಆಕಾರ:' : 'Size:'}</span>
            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.max(0.8, fontSize - 0.2))} aria-label="Decrease font size">
              <span className="text-xs">A-</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setFontSize(1)} aria-label="Reset font size">
              <span className="text-xs">A</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setFontSize(Math.min(1.5, fontSize + 0.2))} aria-label="Increase font size">
              <span className="text-xs">A+</span>
            </Button>
          </div>
          <div className="flex-1" />
          <ShareButtons article={article} language={language} />
          <Button variant="ghost" size="sm" className="share-button" aria-label={language === 'kn' ? 'ಬುಕ್‌ಮಾರ್ಕ್' : 'Bookmark'}>
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={article.featuredImage}
            alt={article.featuredImageAlt || displayHeadline}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
            quality={90}
          />
          {(article.featuredImageCaption || article.featuredImageAlt) && (
            <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-body-sm">
              {language === 'kn' ? (article.featuredImageCaption || article.featuredImageAlt || '') : (article.featuredImageCaption || article.featuredImageAlt || '')}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8" style={{ fontSize: `${fontSize}rem` }}>
          {displaySummary && (
            <div className="prose prose-lg prose-headings:text-garjane-text-primary dark:prose-headings:text-garjane-text-inverse max-w-none bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 rounded-xl p-6 border-l-4 border-garjane-primary">
              <p className={`font-medium leading-relaxed ${fontSize >= 1.2 ? 'text-body-lg' : 'text-body'}`}>
                {displaySummary}
              </p>
            </div>
          )}

          <div className="article-content" style={{ fontSize: `${fontSize}rem` }}>
            {renderArticleContent(displayContent, language)}
          </div>

          {/* Middle Advertisement */}
          {advertisements.middle && advertisements.middle.length > 0 && (
            <div className="relative aspect-[4/1] max-w-full rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
              {advertisements.middle.map((ad, index) => (
                <AdvertisementPlaceholder key={ad.id} ad={ad} />
              ))}
              <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
            </div>
          )}

          {/* Media Section */}
          <MediaSection article={article} language={language} />

          {/* Gallery Section */}
          <GallerySection galleries={article.galleries} language={language} />

          {/* Live Updates */}
          <LiveUpdates updates={article.liveUpdates as LiveUpdateItem[]} language={language} />

          {/* Tags */}
          <TagsList article={article} language={language} />

          {/* Author Bio */}
          <AuthorBio article={article} language={language} />

          {/* Bottom Advertisement */}
          {advertisements.bottom && advertisements.bottom.length > 0 && (
            <div className="relative aspect-[728/90] max-w-[728px] mx-auto rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
              {advertisements.bottom.map((ad, index) => (
                <AdvertisementPlaceholder key={ad.id} ad={ad} />
              ))}
              <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
            </div>
          )}

          {/* Share Section at Bottom */}
          <div className="pt-8 border-t border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ShareButtons article={article} language={language} />
              <div className="flex items-center gap-2">
                <span className="text-caption text-garjane-text-muted">{language === 'kn' ? 'ಅ Highway:' : 'Follow:'}</span>
                <Button variant="ghost" size="sm" className="share-button" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="share-button" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="share-button" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6" role="complementary" aria-label="Article sidebar">
          {/* Previous/Next Navigation */}
          <PreviousNextNavigation
            previousArticle={previousArticle}
            nextArticle={nextArticle}
            language={language}
          />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
                {language === 'kn' ? 'ಸಂಬಂಧಿತ ಲೇಖನಗಳು' : 'Related Articles'}
              </h2>
              <div className="space-y-4">
                {relatedArticles.slice(0, 5).map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.slug}`}
                    className="group flex gap-3 p-2 rounded-lg hover:bg-garjane-background-light/50 dark:hover:bg-garjane-background-dark/50 transition-colors"
                  >
                    {relatedArticle.featuredImage && (
                      <Image
                        src={relatedArticle.featuredImage}
                        alt={relatedArticle.featuredImageAlt || (language === 'kn' ? (relatedArticle.headlineKn || relatedArticle.headline) : relatedArticle.headline)}
                        width={80}
                        height={60}
                        className="w-20 h-15 object-cover rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
                        {language === 'kn' ? (relatedArticle.headlineKn || relatedArticle.headline) : relatedArticle.headline}
                      </h4>
                      <div className="mt-1 flex items-center gap-2 text-caption text-garjane-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTimeKn(relatedArticle.publishedAt || relatedArticle.createdAt)}
                        </span>
                        {relatedArticle.category && (
                          <Badge variant="primary" size="sm" className="text-caption">
                            {language === 'kn' ? (relatedArticle.category.nameKn || relatedArticle.category.name) : relatedArticle.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}