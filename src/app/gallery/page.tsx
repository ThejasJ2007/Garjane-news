import { Metadata } from 'next';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { getGalleries } from '@/lib/data';
import { PhotoGalleryCard } from '@/components/gallery/PhotoGallery';

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
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-3">
            <Camera className="w-4 h-4" />
            <span>ಚಿತ್ರಾವಳಿ ಸಂಗ್ರಹ / Visual Stories</span>
          </div>
          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            ಫೋಟೋ ಗ್ಯಾಲರಿ / Photo Galleries
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
            ನೆಲಮಂಗಲ ಹಾಗೂ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಘಟನೆಗಳು, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಅಭಿವೃದ್ಧಿಯ ಅಪರೂಪದ ಚಿತ್ರ ಸಂಗ್ರಹ
          </p>
        </div>

        {/* Gallery Grid */}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gallery, index) => (
              <PhotoGalleryCard
                key={gallery.id}
                gallery={gallery}
                variant="default"
                priority={index < 3}
                language="kn"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark p-8">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-garjane-text-muted opacity-50" />
            <h3 className="text-headline-4 font-semibold mb-2">ಯಾವುದೇ ಗ್ಯಾಲರಿಗಳು ಲಭ್ಯವಿಲ್ಲ</h3>
            <p className="text-body-sm text-garjane-text-muted">No photo galleries found at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
