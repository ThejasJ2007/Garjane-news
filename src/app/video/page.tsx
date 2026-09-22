import { Metadata } from 'next';
import { Clock, Eye } from 'lucide-react';
import { VideoGrid, VideoCard } from '@/components/video/VideoCard';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VideoHero, FeaturedVideoBadge } from '@/components/video/VideoHero';
import { getVideos } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ವೀಡಿಯೋ ಸುದ್ದಿಗಳು | Garjane News TV',
  description: 'ನೆಲಮಂಗಲ ಮತ್ತು ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ವೀಡಿಯೋ ವರದಿಗಳು ಮತ್ತು ನೇರ ಪ್ರಸಾರಗಳು',
};

export default async function VideoHubPage() {
  const videosData = await getVideos({ page: 1, limit: 12 });
  const videos = videosData.data;
  const featuredVideo = videos[0];
  const remainingVideos = videos.slice(1);

  return (
    <div className="w-full">
      {/* Video Hub Hero Header */}
      <VideoHero />

      <div className="container mx-auto px-4 py-10">
        {/* Featured Video Section */}
        {featuredVideo && (
          <section className="mb-14">
            <div className="grid lg:grid-cols-12 gap-8 items-center bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 lg:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
              <div className="lg:col-span-7">
                <VideoCard video={featuredVideo} variant="featured" priority />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <FeaturedVideoBadge />
                <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse leading-snug">
                  {featuredVideo.titleKn || featuredVideo.title}
                </h2>
                <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
                  {featuredVideo.descriptionKn || featuredVideo.description}
                </p>
                <div className="flex items-center gap-4 text-caption text-garjane-text-muted pt-2 border-t border-garjane-border-light dark:border-garjane-border-dark">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {Math.floor(featuredVideo.duration / 60)} min {featuredVideo.duration % 60} sec
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {featuredVideo.viewCount.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Videos Grid */}
        <section>
          <SectionHeader
            title="Latest Video Reports"
            titleKn="ಇತ್ತೀಚಿನ ವೀಡಿಯೋಗಳು"
          />
          <VideoGrid videos={remainingVideos.length > 0 ? remainingVideos : videos} variant="default" />
        </section>
      </div>
    </div>
  );
}
