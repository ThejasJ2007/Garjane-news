'use client';

import { useRouter } from 'next/navigation';

interface ArticleStatusFilterProps {
  currentStatus?: string;
}

export function ArticleStatusFilter({ currentStatus = 'ALL' }: ArticleStatusFilterProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    if (e.target.value === 'ALL') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', e.target.value);
    }
    url.searchParams.set('page', '1');
    router.push(url.pathname + url.search);
  };

  return (
    <select
      id="status-filter"
      value={currentStatus}
      onChange={handleChange}
      className="px-3 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-body-sm focus:outline-none focus:ring-2 focus:ring-garjane-primary/20"
    >
      <option value="ALL">All</option>
      <option value="PUBLISHED">Published</option>
      <option value="DRAFT">Draft</option>
      <option value="SCHEDULED">Scheduled</option>
      <option value="ARCHIVED">Archived</option>
    </select>
  );
}
