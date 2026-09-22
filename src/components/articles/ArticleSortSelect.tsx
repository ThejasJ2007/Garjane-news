'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleSortSelectProps {
  currentSort?: string;
}

export function ArticleSortSelect({ currentSort = 'publishedAt' }: ArticleSortSelectProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort', e.target.value);
    url.searchParams.delete('page');
    router.push(url.pathname + url.search);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <label htmlFor="sort-select" className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
          {t.sort.sortBy}
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleChange}
          className="input w-auto text-body-sm"
        >
          <option value="publishedAt">{t.sort.latestFirst}</option>
          <option value="viewCount">{t.sort.mostViewed}</option>
          <option value="readTime">{t.sort.shortestRead}</option>
        </select>
      </div>
    </div>
  );
}
