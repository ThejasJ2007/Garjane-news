import { Metadata } from 'next';
import Link from 'next/link';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchHero, SearchResultsSummary, SearchPagination } from '@/components/search/SearchHero';
import { searchArticles, getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  return {
    title: query ? `ಹುಡುಕಾಟ ಫಲಿತಾಂಶ: "${query}" | Garjane News` : 'ಸುದ್ದಿ ಹುಡುಕಾಟ | Search Garjane News',
    description: `Search articles, breaking news, and local reports on Garjane News`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, page: pageParam = '1' } = await searchParams;
  const query = (q || '').trim();
  const page = parseInt(pageParam, 10) || 1;

  const [searchResults] = await Promise.all([
    query ? searchArticles(query, { page, limit: 12 }) : searchArticles('', { page, limit: 12 }),
    getCategories(),
  ]);

  return (
    <div className="w-full">
      {/* Search Header Banner */}
      <SearchHero initialQuery={query} />

      {/* Search Results Area */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {query ? (
            <SearchResultsSummary query={query} total={searchResults.pagination.total} />
          ) : (
            <div className="mb-8">
              <SectionHeader
                title="Recent & Trending Stories"
                titleKn="ಇತ್ತೀಚಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು"
              />
            </div>
          )}

          {searchResults.data.length > 0 ? (
            <>
              <ArticleGrid
                articles={searchResults.data}
                variant="default"
                showCategory
                showLocation
                showStats
              />

              {/* Pagination */}
              <SearchPagination
                query={query}
                currentPage={page}
                totalPages={searchResults.pagination.totalPages}
              />
            </>
          ) : (
            <EmptyState
              variant="search"
              title="ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ"
              description={`"${query}" ಸಂಬಂಧಿಸಿದಂತೆ ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.`}
              secondaryDescription="No results found. Try different keywords."
              className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark max-w-2xl mx-auto"
              action={
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-2.5 bg-garjane-primary text-garjane-primary-foreground font-medium rounded-xl hover:bg-garjane-primary-hover transition-colors text-body-sm"
                >
                  ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ / Back to Home
                </Link>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
