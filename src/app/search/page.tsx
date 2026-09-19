import { Metadata } from 'next';
import Link from 'next/link';
import { Search as SearchIcon, Filter, Clock, Flame } from 'lucide-react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ArticleGrid } from '@/components/articles/ArticleCard';
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
  const { q, page: pageParam = '1', category } = await searchParams;
  const query = (q || '').trim();
  const page = parseInt(pageParam, 10) || 1;

  const [searchResults, categories] = await Promise.all([
    query ? searchArticles(query, { page, limit: 12 }) : searchArticles('', { page, limit: 12 }),
    getCategories(),
  ]);

  const trendingTopics = [
    { label: '#ನೆಲಮಂಗಲ', query: 'ನೆಲಮಂಗಲ' },
    { label: '#ಬೆಂಗಳೂರು', query: 'ಬೆಂಗಳೂರು' },
    { label: '#ಕರ್ನಾಟಕ', query: 'ಕರ್ನಾಟಕ' },
    { label: '#ರಾಜಕೀಯ', query: 'ರಾಜಕೀಯ' },
    { label: '#ಹೆದ್ದಾರಿ', query: 'ಹೆದ್ದಾರಿ' },
    { label: '#ಎಪಿಎಂಸಿ', query: 'ಎಪಿಎಂಸಿ' },
  ];

  return (
    <div className="w-full">
      {/* Search Header Banner */}
      <div className="bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 border-b border-garjane-border-light dark:border-garjane-border-dark py-10 lg:py-14">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
              ಸುದ್ದಿ ಹುಡುಕಾಟ / Search News
            </h1>
            <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
              ನೆಲಮಂಗಲ, ಕರ್ನಾಟಕ ಹಾಗೂ ತಾಜಾ ವಿದ್ಯಮಾನಗಳ ವರದಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ
            </p>
          </div>

          {/* Search Form */}
          <form action="/search" method="GET" className="relative shadow-card-elevated rounded-2xl overflow-hidden">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-garjane-text-muted" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="ಲೇಖನಗಳು, ಸ್ಥಳಗಳು ಅಥವಾ ವಿಷಯಗಳನ್ನು ಹುಡುಕಿ..."
              className="w-full pl-14 pr-32 py-4 text-body-lg bg-garjane-background-card dark:bg-garjane-background-cardDark text-garjane-text-primary dark:text-garjane-text-inverse border-0 focus:outline-none focus:ring-2 focus:ring-garjane-primary"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-garjane-primary text-garjane-primary-foreground font-medium rounded-xl hover:bg-garjane-primary-hover transition-colors text-body-sm shadow-md"
            >
              ಹುಡುಕಿ / Search
            </button>
          </form>

          {/* Popular Trending Pills */}
          <div className="mt-5 flex items-center gap-2 flex-wrap justify-center text-body-sm">
            <span className="text-garjane-text-muted flex items-center gap-1">
              <Flame className="w-4 h-4 text-garjane-primary" /> ಜನಪ್ರಿಯ ವಿಷಯಗಳು:
            </span>
            {trendingTopics.map((topic) => (
              <Link
                key={topic.query}
                href={`/search?q=${encodeURIComponent(topic.query)}`}
                className="px-3 py-1 rounded-full bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary hover:border-garjane-primary transition-colors text-caption font-medium"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Area */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {query ? (
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4 border-b border-garjane-border-light dark:border-garjane-border-dark pb-4">
              <div>
                <p className="text-body text-garjane-text-muted">
                  &ldquo;<span className="text-garjane-text-primary dark:text-garjane-text-inverse font-semibold">{query}</span>&rdquo; ಗಾಗಿ{' '}
                  <span className="text-garjane-primary font-bold">{searchResults.pagination.total}</span> ಲೇಖನಗಳು ಲಭ್ಯ
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <SectionHeader
                title="Recent & Trending Stories"
                titleKn="ಇತ್ತೀಚಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು"
                language="kn"
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
              {searchResults.pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                      className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
                    >
                      ← ಹಿಂದಿನ ಪುಟ / Previous
                    </Link>
                  )}
                  <span className="px-4 py-2 text-body-sm text-garjane-text-muted">
                    ಪುಟ {page} / {searchResults.pagination.totalPages}
                  </span>
                  {page < searchResults.pagination.totalPages && (
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                      className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
                    >
                      ಮುಂದಿನ ಪುಟ / Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-garjane-primary/10 text-garjane-primary flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h2 className="text-headline-3 font-heading font-semibold text-garjane-text-primary dark:text-garjane-text-inverse mb-2">
                ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ
              </h2>
              <p className="text-body text-garjane-text-muted mb-6">
                &ldquo;{query}&rdquo; ಸಂಬಂಧಿಸಿದಂತೆ ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಬೇರೆ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-2.5 bg-garjane-primary text-garjane-primary-foreground font-medium rounded-xl hover:bg-garjane-primary-hover transition-colors text-body-sm"
              >
                ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ / Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
