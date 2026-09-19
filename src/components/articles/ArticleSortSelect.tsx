'use client';

import { useRouter } from 'next/navigation';

interface ArticleSortSelectProps {
  currentSort?: string;
}

export function ArticleSortSelect({ currentSort = 'publishedAt' }: ArticleSortSelectProps) {
  const router = useRouter();

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
          Sort by:
        </label>
        <select
          id="sort-select"
          value={currentSort}
          onChange={handleChange}
          className="input w-auto text-body-sm"
        >
          <option value="publishedAt">Latest First</option>
          <option value="viewCount">Most Viewed</option>
          <option value="readTime">Shortest Read</option>
        </select>
      </div>
    </div>
  );
}
