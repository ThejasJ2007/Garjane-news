import { Metadata } from 'next';
import Image from 'next/image';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { HeroStory } from '@/components/articles/HeroStory';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleCard';
import { VideoGrid } from '@/components/video/VideoCard';
import { MostRead, TrendingNow, BreakingNow } from '@/components/articles/MostRead';
import { Newsletter } from '@/components/layout/Newsletter';
import { PhotoGalleryCard } from '@/components/gallery/PhotoGallery';
import { getFeaturedArticle, getEditorPicks, getLatestArticles, getCategories, getBreakingNews, getVideos, getAdvertisements, getGalleries, getArticlesByCategory } from '@/lib/data';

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
    galleriesRes,
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
    getGalleries({ page: 1, limit: 4 }),
  ]);

  const breakingNowArticles = editorPicks.filter(a => a.breakingLevel === 'BREAKING' || a.breakingLevel === 'URGENT');

  const mainCategories = categories.filter(c =>
    ['nelamangala', 'karnataka', 'bengaluru', 'politics', 'crime', 'sports', 'business', 'entertainment'].includes(c.slug)
  );

  // Fetch articles for each main category
  const categoryArticles = await Promise.all(
    mainCategories.slice(0, 6).map(async (category) => {
      const result = await getArticlesByCategory(category.slug, { page: 1, limit: 4 });
      return { category, articles: result.data };
    })
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
      <div className="w-full">
        {/* Top Banner Ad */}
        {topBannerAds.length > 0 && (
          <div className="container mx-auto px-4 pb-4" role="complementary" aria-label="Advertisement">
            <div className="relative aspect-[728/90] max-w-[728px] mx-auto rounded-lg overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark">
              {topBannerAds[0].imageUrl && (
                <a href={topBannerAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                  <Image src={topBannerAds[0].imageUrl} alt="Advertisement" fill className="object-cover" />
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
                    titleKn="ಸಂಪಾದಕರ ಆಯ್ಕೆ"
                    href="/category/karnataka"
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
                  href="/category/nelamangala"
                  description="Stay updated with the latest happenings"
                  descriptionKn="ತಾಜಾ ಘಟನೆಗಳೊಂದಿಗೆ ಅಪ್‌ಡೇಟ್ ಆಗಿ ಇರಿ"
                  language="kn"
                />
                <ArticleGrid articles={latestArticles} variant="default" showLocation showStats />
              </section>

              {/* In-feed Ad */}
              {inFeedAds.length > 0 && (
                <div className="relative aspect-[4/1] max-w-full rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                  {inFeedAds[0].imageUrl && (
                    <a href={inFeedAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                      <Image src={inFeedAds[0].imageUrl} alt="Advertisement" fill className="object-cover" />
                    </a>
                  )}
                  <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
                </div>
              )}

              {/* Category Sections */}
              {categoryArticles.map(({ category, articles }) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  articles={articles}
                  language="kn"
                />
              ))}

              {/* Videos Section */}
              {videos.data.length > 0 && (
                <section aria-labelledby="videos-heading">
                  <SectionHeader
                    title="Videos"
                    titleKn="ವೀಡಿಯೋಗಳು"
                    href="/video"
                    language="kn"
                  />
                  <VideoGrid videos={videos.data} variant="default" language="kn" />
                </section>
              )}

              {/* Photo Galleries Section */}
              {galleriesRes.data.length > 0 && (
                <section aria-labelledby="galleries-heading" className="border-t border-garjane-border-light dark:border-garjane-border-dark pt-8">
                  <SectionHeader
                    title="Photo Galleries"
                    titleKn="ಚಿತ್ರಾವಳಿ"
                    href="/gallery"
                    language="kn"
                  />
                  <div className="grid sm:grid-cols-2 gap-6">
                    {galleriesRes.data.slice(0, 2).map((gallery) => (
                      <PhotoGalleryCard
                        key={gallery.id}
                        gallery={gallery}
                        variant="default"
                        language="kn"
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8" role="complementary" aria-label="Sidebar">
              {/* Sidebar Ad */}
              {sidebarAds.length > 0 && (
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                  {sidebarAds[0].imageUrl && (
                    <a href={sidebarAds[0].targetUrl || '#'} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label="Advertisement">
                      <Image src={sidebarAds[0].imageUrl} alt="Advertisement" fill className="object-cover" />
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
                  { topic: '#Traffic', topicKn: '#ಟ್ರ್ಯಾಫಿಕ್', count: 1567 },
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
      </div>
    </>
  );
}

function CategorySection({ category, articles, language }: { category: any; articles: any[]; language: 'kn' | 'en' }) {
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
        {articles.length > 0 ? (
          <ArticleGrid articles={articles} variant="default" showLocation showStats />
        ) : (
          <div className="text-center py-8 text-garjane-text-muted">
            <p className="text-body-sm">No articles in this category yet</p>
          </div>
        )}
      </div>
    </section>
  );
}