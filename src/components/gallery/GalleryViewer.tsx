'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Expand, Camera } from 'lucide-react';
import { Lightbox } from './PhotoGallery';
import { Badge } from '@/components/ui/Badge';
import type { PhotoGallery, GalleryImage } from '@/types';

interface GalleryViewerProps {
  gallery: PhotoGallery & { images: GalleryImage[] };
  language?: 'kn' | 'en';
}

export function GalleryViewer({ gallery, language = 'kn' }: GalleryViewerProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const displayTitle = language === 'kn' && gallery.titleKn ? gallery.titleKn : gallery.title;

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.images.map((image, index) => {
          const caption = language === 'kn' && image.captionKn ? image.captionKn : image.caption;
          return (
            <div
              key={image.id}
              onClick={() => handleOpenLightbox(index)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-card dark:bg-garjane-background-cardDark shadow-card hover:shadow-card-elevated transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark">
                {image.url && (
                  <Image
                    src={image.url}
                    alt={image.alt || caption || `${displayTitle} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm">
                    <Expand className="w-6 h-6" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" size="sm" className="text-caption bg-black/60 text-white backdrop-blur-sm">
                    <Camera className="w-3 h-3 mr-1" />
                    {index + 1} / {gallery.images.length}
                  </Badge>
                </div>
              </div>

              {caption && (
                <div className="p-4">
                  <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted line-clamp-2">
                    {caption}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={gallery.images}
        initialIndex={activeImageIndex}
        galleryTitle={displayTitle}
        language={language}
      />
    </div>
  );
}
