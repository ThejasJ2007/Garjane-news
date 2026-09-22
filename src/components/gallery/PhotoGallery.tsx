'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Expand, ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useLanguage } from '@/contexts/LanguageContext';
import type { PhotoGallery, GalleryImage } from '@/types';

interface PhotoGalleryCardProps {
  gallery: PhotoGallery & { images: GalleryImage[] };
  variant?: 'default' | 'featured' | 'compact';
  language?: 'kn' | 'en';
  priority?: boolean;
}

export function PhotoGalleryCard({
  gallery,
  variant = 'default',
  language: propLanguage,
  priority = false,
}: PhotoGalleryCardProps) {
  const { language: contextLang } = useLanguage();
  const activeLang = propLanguage || contextLang;

  const displayTitle = (activeLang === 'kn'
    ? (gallery.titleKn || gallery.title)
    : (gallery.title || gallery.titleKn)) || '';

  const displayDescription = activeLang === 'kn'
    ? (gallery.descriptionKn || gallery.description)
    : (gallery.description || gallery.descriptionKn);

  const photosLabel = activeLang === 'kn'
    ? `${gallery.imageCount} ಚಿತ್ರಗಳು`
    : `${gallery.imageCount} photos`;

  if (variant === 'compact') {
    return (
      <Link href={`/gallery/${gallery.id}`} className="group">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-garjane-border-light dark:bg-garjane-border-dark">
          {gallery.coverImage && (
            <Image
              src={gallery.coverImage}
              alt={displayTitle}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" size="sm" className="text-caption">
                  <Camera className="w-2.5 h-2.5" />
                  {photosLabel}
                </Badge>
              </div>
              <h4 className="font-semibold text-body-sm text-white line-clamp-1 group-hover:text-garjane-accent transition-colors">
                {displayTitle}
              </h4>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative card-hover overflow-hidden">
        <Link href={`/gallery/${gallery.id}`} className="relative aspect-[4/3] overflow-hidden" aria-label={displayTitle}>
          {gallery.coverImage && (
            <Image
              src={gallery.coverImage}
              alt={displayTitle}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Expand className="w-16 h-16 text-white filter drop-shadow-lg" />
          </div>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <Badge variant="secondary" size="sm" className="text-caption">
              <Camera className="w-3 h-3 mr-1" />
              {photosLabel}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            {gallery.images.slice(0, 3).map((img) => (
              <div
                key={img.id}
                className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/50 bg-garjane-border-light dark:bg-garjane-border-dark"
              >
                {img.url && (
                  <Image src={img.url} alt="" fill className="object-cover" />
                )}
              </div>
            ))}
            {gallery.imageCount > 3 && (
              <div className="w-10 h-10 rounded-lg bg-black/50 text-white text-caption flex items-center justify-center border-2 border-white/50">
                +{gallery.imageCount - 3}
              </div>
            )}
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/gallery/${gallery.id}`}>
            <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 mb-2 group-hover:text-garjane-primary transition-colors">
              {displayTitle}
            </h3>
          </Link>

          {displayDescription && (
            <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-3 mb-4">
              {displayDescription}
            </p>
          )}

          <div className="flex items-center gap-3 text-caption text-garjane-text-muted">
            <Badge variant="secondary" size="sm" className="text-caption">
              <Camera className="w-3 h-3 mr-1" />
              {photosLabel}
            </Badge>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group card-hover overflow-hidden">
      <Link href={`/gallery/${gallery.id}`} className="relative aspect-[4/3] overflow-hidden" aria-label={displayTitle}>
        {gallery.coverImage && (
          <Image
            src={gallery.coverImage}
            alt={displayTitle}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Expand className="w-12 h-12 text-white filter drop-shadow-lg" />
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge variant="secondary" size="sm" className="text-caption">
            <Camera className="w-2.5 h-2.5 mr-1" />
            {photosLabel}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {gallery.images.slice(0, 3).map((img) => (
            <div
              key={img.id}
              className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white/50 bg-garjane-border-light dark:bg-garjane-border-dark"
            >
              {img.url && (
                <Image src={img.url} alt="" fill className="object-cover" />
              )}
            </div>
          ))}
          {gallery.imageCount > 3 && (
            <div className="w-8 h-8 rounded-lg bg-black/50 text-white text-caption flex items-center justify-center border-2 border-white/50">
              +{gallery.imageCount - 3}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/gallery/${gallery.id}`}>
          <h3 className="font-heading font-semibold text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-2 mb-2 group-hover:text-garjane-primary transition-colors">
            {displayTitle}
          </h3>
        </Link>

        {displayDescription && (
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-2 mb-3">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center gap-2 text-caption text-garjane-text-muted">
          <Badge variant="secondary" size="sm" className="text-caption">
            <Camera className="w-3 h-3 mr-1" />
            {photosLabel}
          </Badge>
        </div>
      </div>
    </article>
  );
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  initialIndex?: number;
  galleryTitle?: string;
  language?: 'kn' | 'en';
}

export function Lightbox({ isOpen, onClose, images, initialIndex = 0, galleryTitle, language: propLanguage }: LightboxProps) {
  const { language: contextLang } = useLanguage();
  const activeLang = propLanguage || contextLang;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={galleryTitle}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      <button
        onClick={goToPrev}
        className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center">
        {currentImage && currentImage.url && (
          <div className="relative max-w-full max-h-[80vh]">
            <Image
              src={currentImage.url}
              alt={currentImage.caption || currentImage.alt || galleryTitle || `Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
            {(currentImage.caption || currentImage.captionKn) && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-body text-center">
                  {activeLang === 'kn' && currentImage.captionKn ? currentImage.captionKn : currentImage.caption}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:hidden">
          <button onClick={goToPrev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="px-4 text-body-sm text-white/80">
            {currentIndex + 1} / {images.length}
          </span>
          <button onClick={goToNext} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white" aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto pb-4 px-4 max-w-[90vw] hidden lg:flex" role="navigation" aria-label="Thumbnail navigation">
        {images.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all',
              index === currentIndex
                ? 'border-garjane-primary scale-110'
                : 'border-transparent hover:border-white/30'
            )}
            aria-label={`Go to image ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          >
            {img.url && (
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PhotoGalleryGrid({ galleries, variant = 'default', language: propLanguage, ...props }: { galleries: (PhotoGallery & { images: GalleryImage[] })[]; variant?: PhotoGalleryCardProps['variant'] } & Omit<PhotoGalleryCardProps, 'gallery'>) {
  const { language: contextLang } = useLanguage();
  const activeLang = propLanguage || contextLang;

  if (galleries.length === 0) {
    return (
      <EmptyState
        variant="gallery"
        language={activeLang}
        compact
        title={activeLang === 'kn' ? 'ಯಾವುದೇ ಫೋಟೋ ಗ್ಯಾಲರಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No photo galleries found'}
        description={activeLang === 'kn' ? 'ಹೊಸ ಫೋಟೋ ಗ್ಯಾಲರಿಗಳು ಪ್ರಕಟವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.' : 'New photo galleries will appear here once published.'}
      />
    );
  }

  return (
    <div className="grid gap-6">
      {galleries.map((gallery, index) => (
        <PhotoGalleryCard key={gallery.id} gallery={gallery} variant={variant} priority={index < 4} language={activeLang} {...props} />
      ))}
    </div>
  );
}