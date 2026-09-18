import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreakingTicker } from '@/components/layout/BreakingTicker';
import { SectionHeader, CategoryNav } from '@/components/layout/SectionHeader';
import { ArticleGrid, ArticleList } from '@/components/articles/ArticleCard';
import { MostRead, TrendingNow } from '@/components/articles/MostRead';
import { Newsletter } from '@/components/layout/Newsletter';
import { getLocationBySlug, getArticlesByLocation, getBreakingNews, getAdvertisements } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface LocationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params, searchParams }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page = '1', sort = 'publishedAt' } = await searchParams;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return { title: 'Location Not Found' };
  }

  return {
    title: location.nameKn || location.name,
    description: `Latest news from ${location.name}`,
    keywords: ['news', location.name, location.nameKn, 'Karnataka', 'Kannada'],
    openGraph: {
      title: location.nameKn || location.name,
      description: `Latest news from ${location.name}`,
      type: 'website',
      locale: 'kn_IN',
    },
  };
}

export default async function LocationPage({ params, searchParams }: LocationPageProps) {
  const { slug } = await params;
  const { page: pageParam = '1', sort = 'publishedAt' } = await searchParams;
  const page = parseInt(pageParam, 10) || 1;

  const [location, articlesData, breakingNews, sidebarAds] = await Promise.all([
    getLocationBySlug(slug),
    getArticlesByLocation(slug, { page, limit: 12, sortBy: sort, sortOrder: 'desc' }),
    getBreakingNews(),
    getAdvertisements('sidebar'),
  ]);

  if (!location) {
    notFound();
  }

  const displayName = location.nameKn || location.name;

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header breakingNews={breakingNews} user={null} />
        <main id="main-content" className="flex-1 pt-16 lg:pt-14" role="main">
          {/* Location Header */}
          <div className="bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 border-b border-garjane-border-light dark:border-garjane-border-dark">
            <div className="container mx-auto px-4 py-8 lg:py-12">
              <header className="max-w-3xl">
                <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
                  {displayName}
                </h1>
                <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
                  Latest news and updates from {displayName}
                </p>
              </header>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8 space-y-10">
                {/* Sub-location Navigation */}
                {location.children && location.children.length > 0 && (
                  <CategoryNav
                    categories={location.children}
                    activeCategory={location.slug}
                    language="kn"
                  />
                )}

                {/* Articles */}
                <SectionHeader
                  title="Latest Articles"
                  titleKn="ತಾಜಾ ಲೇಖನಗಳು"
                  language="kn"
                />

                {articlesData.data.length > 0 ? (
                  <>
                    {/* Sort Options */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <label htmlFor="sort-select" className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
                          Sort by:
                        </label>
                        <select
                          id="sort-select"
                          defaultValue={sort}
                          onChange={(e) => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('sort', e.target.value);
                            url.searchParams.delete('page');
                            window.location.href = url.toString();
                          }}
                          className="input w-auto text-body-sm"
                        >
                          <option value="publishedAt">Latest First</option>
                          <option value="viewCount">Most Viewed</option>
                          <option value="readTime">Shortest Read</option>
                        </select>
                      </div>
                    </div>

                    {/* Article Grid */}
                    <ArticleGrid
                      articles={articlesData.data}
                      variant="default"
                      showCategory
                      showStats
                    />

                    {/* Pagination */}
                    {articlesData.pagination.totalPages > 1 && (
                      <nav className="mt-10" aria-label="Pagination">
                        <div className="pagination justify-center">
                          {page > 1 && (
                            <a
                              href={`/location/${slug}?page=${page - 1}&sort=${sort}`}
                              className="pagination-item"
                              aria-label="Previous page"
                            >
                              ← Prev
                            </a>
                          )}
                          {Array.from({ length: articlesData.pagination.totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === articlesData.pagination.totalPages || (p >= page - 2 && p <= page + 2))
                            .map((p, index, arr) => (
                              <React.Fragment key={p}>
                                {index > 0 && p !== arr[index - 1] + 1 && (
                                  <span className="pagination-ellipsis" aria-hidden="true">…</span>
                                )}
                                {p === page ? (
                                  <span className="pagination-item pagination-item-active" aria-current="page">
                                    {p}
                                  </span>
                                ) : (
                                  <a href={`/location/${slug}?page=${p}&sort=${sort}`} className="pagination-item">
                                    {p}
                                  </a>
                                )}
                              </React.Fragment>
                            ))}
                          {page < articlesData.pagination.totalPages && (
                            <a
                              href={`/location/${slug}?page=${page + 1}&sort=${sort}`}
                              className="pagination-item"
                              aria-label="Next page"
                            >
                              Next →
                            </a>
                          )}
                        </div>
                      </nav>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-garjane-text-muted text-body-lg mb-4">No articles found for this location.</p>
                    <p className="text-garjane-text-muted text-body-sm">Check back later for updates.</p>
                  </div>
                )}

                {/* In-feed Ad */}
                <div className="relative aspect-[4/1] max-w-full rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                  <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-8" role="complementary" aria-label="Sidebar">
                {/* Sidebar Ad */}
                {sidebarAds.length > 0 && (
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark" role="complementary" aria-label="Advertisement">
                    <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
                  </div>
                )}

                {/* Most Read */}
                <MostRead
                  articles={articlesData.data}
                  title="Most Read in this Location"
                  titleKn="ಈ ठिकಾಣದಲ್ಲಿ ಹೆಚ್ಚು ಓದಲಾಗಿದೆ"
                  language="kn"
                  limit={10}
                />

                {/* Trending Now */}
                <TrendingNow
                  topics={[
                    { topic: `#${displayName}`, topicKn: `#${displayName}`, count: Math.floor(Math.random() * 5000) + 1000 },
                    { topic: '#BreakingNews', topicKn: '#ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್', count: Math.floor(Math.random() * 3000) + 500 },
                    { topic: '#Karnataka', topicKn: '#ಕರ್ನಾಟಕ', count: Math.floor(Math.random() * 10000) + 5000 },
                  ]}
                  language="kn"
                />

                {/* Newsletter */}
                <Newsletter variant="inline" language="kn" />
              </aside>
            </div>
          </div>
        </main>
        <Footer siteSettings={null} />
      </div>
    </>
  );
}