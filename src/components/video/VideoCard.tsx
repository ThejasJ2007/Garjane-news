'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Play, Eye, MapPin } from 'lucide-react';
import { formatRelativeTimeKn, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { VideoWithRelations } from '@/types';

interface VideoCardProps {
  video: VideoWithRelations;
  variant?: 'default' | 'featured' | 'compact';
  language?: 'kn' | 'en';
  priority?: boolean;
}

export function VideoCard({ video, variant = 'default', language = 'kn', priority = false }: VideoCardProps) {
  const displayTitle = language === 'kn' && video.titleKn ? video.titleKn : video.title;
  const displayDescription = language === 'kn' && video.descriptionKn ? video.descriptionKn : video.description;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (variant === 'compact') {
    return (
      <Link href={`/video/${video.id}`} className="group flex gap-3">
        <div className="relative w-24 h-18 flex-shrink-0 rounded-lg overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark">
          {video.thumbnailUrl && (
            <Image
              src={video.thumbnailUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-caption px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </span>
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-body-sm text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 group-hover:text-garjane-primary transition-colors">
            {displayTitle}
          </h4>
          <div className="mt-1 flex items-center gap-2 text-caption text-garjane-text-muted">
            {video.category && (
              <span className="flex items-center gap-0.5">
                <Badge variant="secondary" size="sm" className="text-caption">
                  {language === 'kn' ? (video.category!.nameKn || video.category!.name) : video.category!.name}
                </Badge>
              </span>
            )}
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {formatRelativeTimeKn(video.publishedAt || video.createdAt)}
            </span>
            {video.viewCount > 0 && (
              <span className="flex items-center gap-0.5">
                <Eye className="w-3 h-3" />
                {video.viewCount.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative card-hover overflow-hidden">
        <Link href={`/video/${video.id}`} className="relative aspect-video overflow-hidden" aria-label={displayTitle}>
          {video.thumbnailUrl && (
            <Image
              src={video.thumbnailUrl}
              alt={displayTitle}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="w-16 h-16 text-white filter drop-shadow-lg" />
          </div>
          <span className="absolute bottom-3 right-3 bg-black/80 text-white text-body-sm px-3 py-1 rounded-lg">
            {formatDuration(video.duration)}
          </span>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge variant="video" size="sm">
              <Play className="w-3 h-3 mr-1" />
              Video
            </Badge>
            {video.category && (
              <Badge variant="primary" size="sm">
                {language === 'kn' ? (video.category!.nameKn || video.category!.name) : video.category!.name}
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/video/${video.id}`}>
            <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 mb-2 group-hover:text-garjane-primary transition-colors">
              {displayTitle}
            </h3>
          </Link>

          {displayDescription && (
            <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-3 mb-4">
              {displayDescription}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
            {video.category && (
              <Link href={`/category/${video.category.slug}`} className="flex items-center gap-1 hover:text-garjane-primary transition-colors">
                <Badge variant="secondary" size="sm" className="text-caption">
                  {language === 'kn' ? (video.category!.nameKn || video.category!.name) : video.category!.name}
                </Badge>
              </Link>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTimeKn(video.publishedAt || video.createdAt)}
            </span>
            {video.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {video.viewCount.toLocaleString()}
              </span>
            )}
            {video.reporter && (
              <span className="flex items-center gap-1 text-garjane-accent">
                <Badge variant="secondary" size="sm">By {video.reporter.user.name}</Badge>
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group card-hover overflow-hidden">
      <Link href={`/video/${video.id}`} className="relative aspect-video overflow-hidden" aria-label={displayTitle}>
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt={displayTitle}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Play className="w-12 h-12 text-white filter drop-shadow-lg" />
        </div>
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-caption px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </span>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="video" size="sm">
            <Play className="w-2.5 h-2.5 mr-1" />
            Video
          </Badge>
          {video.category && (
            <Badge variant="primary" size="sm">
              {language === 'kn' ? (video.category!.nameKn || video.category!.name) : video.category!.name}
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/video/${video.id}`}>
          <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 mb-2 group-hover:text-garjane-primary transition-colors">
            {displayTitle}
          </h3>
        </Link>

        {displayDescription && (
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-2 mb-3">
            {displayDescription}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-caption text-garjane-text-muted">
          {video.category && (
            <Link href={`/category/${video.category.slug}`} className="flex items-center gap-1 hover:text-garjane-primary transition-colors">
              <Badge variant="secondary" size="sm" className="text-caption">
                {language === 'kn' ? (video.category!.nameKn || video.category!.name) : video.category!.name}
              </Badge>
            </Link>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatRelativeTimeKn(video.publishedAt || video.createdAt)}
          </span>
          {video.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {video.viewCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function VideoGrid({ videos, variant = 'default', ...props }: { videos: VideoWithRelations[]; variant?: VideoCardProps['variant'] } & Omit<VideoCardProps, 'video'>) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-garjane-text-muted text-body">No videos found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} variant={variant} priority={index < 4} {...props} />
      ))}
    </div>
  );
}

export function VideoList({ videos, ...props }: { videos: VideoWithRelations[] } & Omit<VideoCardProps, 'video' | 'variant'>) {
  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} variant="compact" {...props} />
      ))}
    </div>
  );
}