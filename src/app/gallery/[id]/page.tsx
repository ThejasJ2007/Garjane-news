import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Camera, Calendar, FileText } from 'lucide-react';
import { getGalleryById, getArticleById } from '@/lib/data';
import { GalleryViewer } from '@/components/gallery/GalleryViewer';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTimeKn } from '@/lib/utils';

export const revalidate = 60;

interface GalleryDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  const gallery = await getGalleryById(params.id);
  if (!gallery) {
    return {
      title: 'ಗ್ಯಾಲರಿ ಕಂಡುಬಂದಿಲ್ಲ | Gallery Not Found - Garjane News',
    };
  }

  const title = gallery.titleKn ? `${gallery.titleKn} | ಚಿತ್ರಾವಳಿ - Garjane News` : `${gallery.title} | Photo Gallery - Garjane News`;
  const description = gallery.descriptionKn || gallery.description || 'Exclusive photo coverage on Garjane News.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: gallery.coverImage ? [{ url: gallery.coverImage }] : undefined,
    },
  };
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  const gallery = await getGalleryById(params.id);

  if (!gallery) {
    notFound();
  }

  const article = gallery.articleId ? await getArticleById(gallery.articleId) : null;
  const displayTitle = gallery.titleKn || gallery.title;
  const displayDescription = gallery.descriptionKn || gallery.description;

  return (
    <div className="w-full py-10 lg:py-14">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-body-sm text-garjane-text-muted hover:text-garjane-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> ಗ್ಯಾಲರಿಗಳ ಪಟ್ಟಿಗೆ ಮರಳಿ / Back to Galleries
          </Link>
        </div>

        {/* Gallery Header Card */}
        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card p-6 lg:p-10 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="primary" size="md" className="flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>{gallery.images.length} ಚಿತ್ರಗಳು / Photos</span>
            </Badge>
            <span className="text-caption text-garjane-text-muted flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatRelativeTimeKn(gallery.createdAt)}</span>
            </span>
          </div>

          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
            {displayTitle}
          </h1>

          {displayDescription && (
            <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed max-w-4xl">
              {displayDescription}
            </p>
          )}

          {article && (
            <div className="mt-6 pt-6 border-t border-garjane-border-light dark:border-garjane-border-dark flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 text-body-sm text-garjane-text-muted">
                <FileText className="w-4 h-4 text-garjane-primary" />
                <span>ಸಂಬಂಧಿತ ವರದಿ / Related Story:</span>
                <span className="font-semibold text-garjane-text-primary dark:text-garjane-text-inverse">
                  {article.headlineKn || article.headline}
                </span>
              </div>
              <Link
                href={`/article/${article.slug}`}
                className="text-body-sm font-semibold text-garjane-primary hover:underline"
              >
                ಸಂಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ / Read Story →
              </Link>
            </div>
          )}
        </div>

        {/* Interactive Image Grid with Lightbox */}
        <GalleryViewer gallery={gallery} language="kn" />
      </div>
    </div>
  );
}
