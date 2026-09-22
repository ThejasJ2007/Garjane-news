'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryHeaderProps {
  name: string;
  nameKn?: string | null;
  description?: string | null;
  descriptionKn?: string | null;
}

export function CategoryHeader({
  name,
  nameKn,
  description,
  descriptionKn,
}: CategoryHeaderProps) {
  const { language } = useLanguage();
  const displayName = language === 'kn' ? (nameKn || name) : (name || nameKn);
  const displayDescription = language === 'kn' ? (descriptionKn || description) : (description || descriptionKn);

  return (
    <header className="max-w-3xl">
      <h1 className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
        {displayName}
      </h1>
      {displayDescription && (
        <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted">
          {displayDescription}
        </p>
      )}
    </header>
  );
}

interface BreadcrumbItem {
  id: string;
  slug: string;
  name: string;
  nameKn?: string | null;
}

export function CategoryBreadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  const { language } = useLanguage();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-body-sm text-garjane-text-muted flex-wrap">
        <li>
          <Link href="/" className="hover:text-garjane-primary transition-colors">
            {language === 'kn' ? 'ಮುಖಪುಟ' : 'Home'}
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => {
          const crumbName = language === 'kn' ? (crumb.nameKn || crumb.name) : (crumb.name || crumb.nameKn);
          const isLast = index === breadcrumbs.length - 1;
          return (
            <li key={crumb.id} className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              {isLast ? (
                <span className="text-garjane-text-primary dark:text-garjane-text-inverse font-medium">
                  {crumbName}
                </span>
              ) : (
                <Link href={`/category/${crumb.slug}`} className="hover:text-garjane-primary transition-colors">
                  {crumbName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
