import { Metadata } from 'next';
import { getGalleries } from '@/lib/data';
import { PhotoGalleryCard } from '@/components/gallery/PhotoGallery';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import { EmptyState } from '@/components/ui/EmptyState';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ಫೋಟೋ ಗ್ಯಾಲರಿ | Photo Galleries - Garjane News',
  description: 'Explore exclusive high-resolution photo galleries covering Nelamangala events, culture, infrastructure, and rural life in Karnataka.',
};

export default async function GalleryListPage() {
  const galleriesRes = await getGalleries({ page: 1, limit: 20 });
  const galleries = galleriesRes.data;

  return (
    <div className="w-full py-10 lg:py-14">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Page Header */}
        <GalleryHero />

        {/* Gallery Grid */}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery, index) => (
              <PhotoGalleryCard
                key={gallery.id}
                gallery={gallery}
                variant="default"
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            variant="gallery"
            title="ಯಾವುದೇ ಗ್ಯಾಲರಿಗಳು ಲಭ್ಯವಿಲ್ಲ"
            description="ಹೊಸ ಫೋಟೋ ಗ್ಯಾಲರಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟವಾಗುತ್ತವೆ."
            secondaryDescription="No photo galleries found at the moment."
            className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark"
          />
        )}
      </div>
    </div>
  );
}
