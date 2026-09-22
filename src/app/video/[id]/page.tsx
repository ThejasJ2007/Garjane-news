import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Clock, Eye, Share2, ArrowLeft, Tv, User } from 'lucide-react';
import { getVideoBySlug, getVideos } from '@/lib/data';
import { VideoCard } from '@/components/video/VideoCard';
import { formatRelativeTimeKn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export const dynamic = 'force-dynamic';

interface VideoPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoBySlug(id);
  if (!video) return { title: 'Video Not Found' };

  return {
    title: `${video.titleKn || video.title} | Garjane News TV`,
    description: video.descriptionKn || video.description || 'Watch video reports on Garjane News',
  };
}

export default async function VideoDetailPage({ params }: VideoPageProps) {
  const { id } = await params;
  const [video, allVideos] = await Promise.all([
    getVideoBySlug(id),
    getVideos({ page: 1, limit: 6 }),
  ]);

  if (!video) {
    notFound();
  }

  const relatedVideos = allVideos.data.filter((v) => v.id !== video.id);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/video"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-garjane-text-secondary hover:text-garjane-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ಗರ್ಜನೆ ನ್ಯೂಸ್ ವೀಡಿಯೋಗಳು / Back to Videos
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Video Player & Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-card-elevated border border-garjane-border-light dark:border-garjane-border-dark">
              {video.videoUrl.includes('youtube') || video.videoUrl.includes('embed') ? (
                <iframe
                  src={video.videoUrl}
                  title={video.titleKn || video.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={video.videoUrl}
                  controls
                  poster={video.thumbnailUrl}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support HTML video.
                </video>
              )}
            </div>

            {/* Video Metadata */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {video.category && (
                  <Badge variant="primary">
                    {video.category.nameKn || video.category.name}
                  </Badge>
                )}
                {video.location && (
                  <Badge variant="secondary">
                    {video.location.nameKn || video.location.name}
                  </Badge>
                )}
              </div>

              <h1 className="text-headline-3 lg:text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse leading-tight">
                {video.titleKn || video.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4 py-3 border-y border-garjane-border-light dark:border-garjane-border-dark text-body-sm text-garjane-text-muted">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatRelativeTimeKn(video.publishedAt || video.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {video.viewCount.toLocaleString()} views
                  </span>
                </div>

                {video.reporter && (
                  <div className="flex items-center gap-2">
                    <span className="text-caption">ವರದಿಗಾರರು:</span>
                    <span className="font-medium text-garjane-text-primary dark:text-garjane-text-inverse">
                      {video.reporter.user.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="p-5 rounded-xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark text-body leading-relaxed text-garjane-text-secondary dark:text-garjane-text-muted">
                <p>{video.descriptionKn || video.description}</p>
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <h3 className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse flex items-center gap-2">
              <Tv className="w-5 h-5 text-garjane-primary" /> ಇನ್ನಷ್ಟು ವೀಡಿಯೋಗಳು / More Videos
            </h3>
            <div className="space-y-4">
              {relatedVideos.map((item) => (
                <VideoCard key={item.id} video={item} variant="compact" language="kn" />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
