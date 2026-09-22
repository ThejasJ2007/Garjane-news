'use client';

import Link from 'next/link';
import { Search as SearchIcon, Flame } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchHeroProps {
  initialQuery?: string;
}

const trendingTopics = [
  { labelKn: '#ನೆಲಮಂಗಲ', labelEn: '#Nelamangala', query: 'ನೆಲಮಂಗಲ' },
  { labelKn: '#ಬೆಂಗಳೂರು', labelEn: '#Bengaluru', query: 'ಬೆಂಗಳೂರು' },
  { labelKn: '#ಕರ್ನಾಟಕ', labelEn: '#Karnataka', query: 'ಕರ್ನಾಟಕ' },
  { labelKn: '#ರಾಜಕೀಯ', labelEn: '#Politics', query: 'ರಾಜಕೀಯ' },
  { labelKn: '#ಹೆದ್ದಾರಿ', labelEn: '#Highway', query: 'ಹೆದ್ದಾರಿ' },
  { labelKn: '#ಎಪಿಎಂಸಿ', labelEn: '#APMC', query: 'ಎಪಿಎಂಸಿ' },
];

export function SearchHero({ initialQuery = '' }: SearchHeroProps) {
  const { language, t } = useLanguage();

  return (
    <div className="bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 border-b border-garjane-border-light dark:border-garjane-border-dark py-10 lg:py-14">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            {t.search.title}
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
            {t.search.subtitle}
          </p>
        </div>

        {/* Search Form */}
        <form action="/search" method="GET" className="relative shadow-card-elevated rounded-2xl overflow-hidden">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-garjane-text-muted" aria-hidden="true" />
          <input
            type="search"
            name="q"
            defaultValue={initialQuery}
            placeholder={t.search.placeholder}
            className="w-full pl-14 pr-32 py-4 text-body-lg bg-garjane-background-card dark:bg-garjane-background-cardDark text-garjane-text-primary dark:text-garjane-text-inverse border-0 focus:outline-none focus:ring-2 focus:ring-garjane-primary"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-garjane-primary text-garjane-primary-foreground font-medium rounded-xl hover:bg-garjane-primary-hover transition-colors text-body-sm shadow-md"
          >
            {t.search.searchBtn}
          </button>
        </form>

        {/* Popular Trending Pills */}
        <div className="mt-5 flex items-center gap-2 flex-wrap justify-center text-body-sm">
          <span className="text-garjane-text-muted flex items-center gap-1">
            <Flame className="w-4 h-4 text-garjane-primary" /> {t.search.popularTopics}:
          </span>
          {trendingTopics.map((topic) => (
            <Link
              key={topic.query}
              href={`/search?q=${encodeURIComponent(topic.query)}`}
              className="px-3 py-1 rounded-full bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary hover:border-garjane-primary transition-colors text-caption font-medium"
            >
              {language === 'kn' ? topic.labelKn : topic.labelEn}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSummary({ query, total }: { query: string; total: number }) {
  const { language } = useLanguage();

  return (
    <div className="mb-8 flex items-center justify-between flex-wrap gap-4 border-b border-garjane-border-light dark:border-garjane-border-dark pb-4">
      <div>
        <p className="text-body text-garjane-text-muted">
          {language === 'kn' ? (
            <>
              &ldquo;<span className="text-garjane-text-primary dark:text-garjane-text-inverse font-semibold">{query}</span>&rdquo; ಗಾಗಿ{' '}
              <span className="text-garjane-primary font-bold">{total}</span> ಲೇಖನಗಳು ಲಭ್ಯ
            </>
          ) : (
            <>
              <span className="text-garjane-primary font-bold">{total}</span> articles found for &ldquo;<span className="text-garjane-text-primary dark:text-garjane-text-inverse font-semibold">{query}</span>&rdquo;
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export function SearchPagination({
  query,
  currentPage,
  totalPages,
}: {
  query: string;
  currentPage: number;
  totalPages: number;
}) {
  const { language } = useLanguage();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
          className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
        >
          {language === 'kn' ? '← ಹಿಂದಿನ ಪುಟ' : '← Previous'}
        </Link>
      )}
      <span className="px-4 py-2 text-body-sm text-garjane-text-muted">
        {language === 'kn'
          ? `ಪುಟ ${currentPage} / ${totalPages}`
          : `Page ${currentPage} of ${totalPages}`}
      </span>
      {currentPage < totalPages && (
        <Link
          href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
          className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
        >
          {language === 'kn' ? 'ಮುಂದಿನ ಪುಟ →' : 'Next →'}
        </Link>
      )}
    </div>
  );
}
