import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { HeroStory } from '@/components/articles/HeroStory';
import { SectionHeader, CategoryNav } from '@/components/layout/SectionHeader';
import { ArticleGrid, ArticleList } from '@/components/articles/ArticleCard';
import { VideoGrid } from '@/components/video/VideoCard';
import { PhotoGalleryGrid } from '@/components/gallery/PhotoGallery';
import { MostRead, TrendingNow, BreakingNow } from '@/components/articles/MostRead';
import { Newsletter } from '@/components/layout/Newsletter';
import { getFeaturedArticle, getEditorPicks, getLatestArticles, getCategories, getBreakingNews, getVideos, getAdvertisements } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Garjane News - Your Local News, Your Voice',
  description: 'Garjane News brings you the latest breaking news, local updates, and in-depth coverage from Nelamangala, Karnataka and beyond. Available in Kannada and English.',
  keywords: ['news', 'Karnataka', 'Nelamangala', 'breaking news', 'local news', 'Kannada news'],
  openGraph: {
    title: 'Garjane News - Your Local News, Your Voice',
    description: 'Latest breaking news and local updates from Karnataka',
    type: 'website',
    locale: 'kn_IN',
  },
};

export default async function HomePage() {
  const [
    featuredArticle,
    editorPicks,
    latestArticles,
    categories,
    breakingNews,
    videos,
    topBannerAds,
    sidebarAds,
    inFeedAds,
  ] = await Promise.all([
    getFeaturedArticle(),
    getEditorPicks(4),
    getLatestArticles(10),
    getCategories(),
    getBreakingNews(),
    getVideos({ page: 1, limit: 8 }),
    getAdvertisements('top-banner'),
    getAdvertisements('sidebar'),
    getAdvertisements('in-feed'),
  ]);

  const breakingNowArticles = editorPicks.filter(a => a.breakingLevel === 'BREAKING' || a.breakingLevel === 'URGENT');

  const mainCategories = categories.filter(c =>
    ['nelamangala', 'karnataka', 'bengaluru', 'politics', 'crime', 'sports', 'business', 'entertainment'].includes(c.slug)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Garjane News',
            alternateName: 'ಗರ್ಜನೆ ನ್ಯೂಸ್',
            url: 'https://garjanenews.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://garjanenews.com/search?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      <div className="min-h-screen flex flex-col">
        <Header breakingNews={breakingNews} user={null} />

        <main id="main-content" className="flex-1 pt-16 lg:pt-14" role="main">
          {/* Top Banner Ad */}
          {topBannerAds.length > 0 && (
            <div className="container mx-auto px-4 pb-4" role="complementary" aria-label="Advertisement">
              <div className="relative aspect-[728/90] max-w-[728px] mx-auto rounded-lg overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark">
                {topBannerAds[0].imageUrl && (
                  <a href={topBannerAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                    <img src={topBannerAds[0].imageUrl} alt="Advertisement" className="w-full h-full object-cover" />
                  </a>
                )}
                <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
              </div>
            </div>
          )}

          {/* Breaking News Ticker */}
          {breakingNews.length > 0 && (
            <BreakingTicker items={breakingNews} language="kn" />
          )}

          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-8 space-y-10">
                {/* Hero Story */}
                {featuredArticle && (
                  <section aria-labelledby="hero-heading">
                    <HeroStory article={featuredArticle} language="kn" priority />
                  </section>
                )}

                {/* Editor's Picks */}
                {editorPicks.length > 0 && (
                  <section aria-labelledby="editor-picks-heading">
                    <SectionHeader
                      title="Editor's Picks"
                      titleKn="ಸಂಪಾದಕದ ಚಯನ"
                      href="/editor-picks"
                      language="kn"
                    />
                    <ArticleGrid articles={editorPicks} variant="default" showLocation showStats />
                  </section>
                )}

                {/* Breaking Now */}
                {breakingNowArticles.length > 0 && (
                  <section aria-labelledby="breaking-heading">
                    <BreakingNow articles={breakingNowArticles} language="kn" limit={5} />
                  </section>
                )}

                {/* Latest News */}
                <section aria-labelledby="latest-heading">
                  <SectionHeader
                    title="Latest News"
                    titleKn="ತಾಜಾ ಸುದ್ದಿಗಳು"
                    href="/latest"
                    description="Stay updated with the latest happenings"
                    descriptionKn="ತಾಜಾ ಘಟನೆಗಳೊಂದಿಗೆ ಅಪ್‌ಡೇಟ್ ಆಗಿ رہಿ"
                    language="kn"
                  />
                  <ArticleGrid articles={latestArticles} variant="default" showLocation showStats />
                </section>

                {/* In-feed Ad */}
                {inFeedAds.length > 0 && (
                  <div className="relative aspect-[4/1] max-w-full rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                    {inFeedAds[0].imageUrl && (
                      <a href={inFeedAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                        <img src={inFeedAds[0].imageUrl} alt="Advertisement" className="w-full h-full object-cover" />
                      </a>
                    )}
                    <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
                  </div>
                )}

                {/* Category Sections */}
                {mainCategories.slice(0, 6).map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    language="kn"
                  />
                ))}

                {/* Videos Section */}
                {videos.data.length > 0 && (
                  <section aria-labelledby="videos-heading">
                    <SectionHeader
                      title="Videos"
                      titleKn="ವিডಿಯோಗಳು"
                      href="/videos"
                      language="kn"
                    />
                    <VideoGrid videos={videos.data} variant="default" language="kn" />
                  </section>
                )}

                {/* Photo Galleries - placeholder */}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8" role="complementary" aria-label="Sidebar">
                {/* Sidebar Ad */}
                {sidebarAds.length > 0 && (
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                    {sidebarAds[0].imageUrl && (
                      <a href={sidebarAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                        <img src={sidebarAds[0].imageUrl} alt="Advertisement" className="w-full h-full object-cover" />
                      </a>
                    )}
                    <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
                  </div>
                )}

                {/* Most Read */}
                <MostRead
                  articles={latestArticles}
                  title="Most Read"
                  titleKn="ಹೆಚ್ಚು ಓದಲಾಗಿದೆ"
                  language="kn"
                  limit={10}
                />

                {/* Trending Now */}
                <TrendingNow
                  topics={[
                    { topic: '#Nelamangala', topicKn: '#ನೆಲಮಂಗಲ', count: 1240, category: { slug: 'nelamangala', name: 'Nelamangala', nameKn: 'ನೆಲಮಂಗಲ' } },
                    { topic: '#Bengaluru', topicKn: '#ಬೆಂಗಳೂರು', count: 3421, category: { slug: 'bengaluru', name: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು' } },
                    { topic: '#Karnataka', topicKn: '#ಕರ್ನಾಟಕ', count: 5672, category: { slug: 'karnataka', name: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' } },
                    { topic: '#BreakingNews', topicKn: '#ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್', count: 892 },
                    { topic: '#GarjaneNews', topicKn: '#ಗರ್ಜನೆ ನ್ಯೂಸ್', count: 445 },
                    { topic: '#Politics', topicKn: '#ರಾಜಕೀಯ', count: 2103, category: { slug: 'politics', name: 'Politics', nameKn: 'ರಾಜಕೀಯ' } },
                    { topic: '#Traffic', topicKn: '#ಟ್ರ್ಯাফಿಕ್', count: 1567 },
                    { topic: '#Weather', topicKn: '#ಹವಾಮಾನ', count: 987 },
                  ]}
                  language="kn"
                />

                {/* Newsletter Inline */}
                <Newsletter variant="inline" language="kn" />
              </aside>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="container mx-auto px-4 py-8 lg:py-16">
            <Newsletter language="kn" />
          </div>
        </main>

        <Footer siteSettings={null} />
      </div>
    </>
  );
}

function CategorySection({ category, language }: { category: any; language: 'kn' | 'en' }) {
  // In a real implementation, this would fetch articles for the category
  // For now, we'll just show the category header with a link
  const displayName = language === 'kn' && category.nameKn ? category.nameKn : category.name;

  return (
    <section aria-labelledby={`category-${category.slug}-heading`} className="border-t border-garjane-border-light dark:border-garjane-border-dark pt-8">
      <SectionHeader
        title={displayName}
        titleKn={category.nameKn}
        href={`/category/${category.slug}`}
        language={language}
      />
      <div className="grid gap-4 md:gap-6">
        {/* Placeholder for category articles - would fetch from API */}
        <div className="text-center py-8 text-garjane-text-muted">
          <p className="text-body-sm">Category articles would load here</p>
        </div>
      </div>
    </section>
  );
}