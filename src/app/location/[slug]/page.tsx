import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { SectionHeader, CategoryNav } from '@/components/layout/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleCard';
import { MostRead, TrendingNow } from '@/components/articles/MostRead';
import { Newsletter } from '@/components/layout/Newsletter';
import { ArticleSortSelect } from '@/components/articles/ArticleSortSelect';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryHeader } from '@/components/category/CategoryHeader';
import { getLocationBySlug, getArticlesByLocation, getAdvertisements } from '@/lib/data';

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

  const [location, articlesData, sidebarAds] = await Promise.all([
    getLocationBySlug(slug),
    getArticlesByLocation(slug, { page, limit: 12, sortBy: sort, sortOrder: 'desc' }),
    getAdvertisements('sidebar'),
  ]);

  if (!location) {
    notFound();
  }

  const displayName = location.nameKn || location.name;

  return (
    <div className="w-full">
      {/* Location Header */}
      <div className="bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 border-b border-garjane-border-light dark:border-garjane-border-dark">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <CategoryHeader
            name={location.name}
            nameKn={location.nameKn}
            description={`Latest news and updates from ${location.name}`}
            descriptionKn={`${location.nameKn || location.name} ಪ್ರದೇಶದ ತಾಜಾ ಸುದ್ದಿಗಳು ಮತ್ತು ಪ್ರಮುಖ ವಿದ್ಯಮಾನಗಳು`}
          />
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
              />
            )}

            {/* Articles */}
            <SectionHeader
              title="Latest Articles"
              titleKn="ತಾಜಾ ಲೇಖನಗಳು"
            />

            {articlesData.data.length > 0 ? (
              <>
                {/* Sort Options */}
                <ArticleSortSelect currentSort={sort} />

                {/* Article Grid */}
                <ArticleGrid
                  articles={articlesData.data}
                  variant="default"
                  showLocation
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
              <EmptyState
                variant="news"
                title="ಈ ಪ್ರದೇಶದಲ್ಲಿ ಯಾವುದೇ ಲೇಖನಗಳಿಲ್ಲ"
                description="ಹೊಸ ಲೇಖನಗಳು ಪ್ರಕಟವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ."
                secondaryDescription="No articles found for this location. Check back later for updates."
                className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark"
              />
            )}

            {/* In-feed Ad */}
            <div className="relative aspect-[4/1] max-w-full rounded-xl overflow-hidden bg-garjane-border-light dark:border-garjane-border-dark" role="complementary" aria-label="Advertisement">
              <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8" role="complementary" aria-label="Sidebar">
            {/* Sidebar Ad */}
            {sidebarAds.length > 0 && (
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-garjane-border-light dark:border-garjane-border-dark" role="complementary" aria-label="Advertisement">
                <span className="absolute top-1 right-1 text-xs bg-black/50 text-white px-1.5 py-0.5 rounded">Ad</span>
              </div>
            )}

            {/* Most Read */}
            <MostRead
              articles={articlesData.data}
              title="Most Read in this Location"
              titleKn="ಈ ಪ್ರದೇಶದಲ್ಲಿ ಹೆಚ್ಚು ಓದಲಾಗಿದೆ"
              limit={10}
            />

            {/* Trending Now */}
            <TrendingNow
              topics={[
                { topic: `#${displayName}`, topicKn: `#${displayName}`, count: Math.floor(Math.random() * 5000) + 1000 },
                { topic: '#BreakingNews', topicKn: '#ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್', count: Math.floor(Math.random() * 3000) + 500 },
                { topic: '#Karnataka', topicKn: '#ಕರ್ನಾಟಕ', count: Math.floor(Math.random() * 10000) + 5000 },
              ]}
            />

            {/* Newsletter */}
            <Newsletter variant="inline" />
          </aside>
        </div>
      </div>
    </div>
  );
}