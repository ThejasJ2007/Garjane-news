'use client';

import Link from 'next/link';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface SectionHeaderProps {
  title: string;
  titleKn?: string;
  href?: string;
  description?: string;
  descriptionKn?: string;
  badge?: string;
  badgeVariant?: 'primary' | 'secondary' | 'featured' | 'editor-pick';
  showViewAll?: boolean;
  viewAllText?: string;
  viewAllTextKn?: string;
  action?: React.ReactNode;
  className?: string;
  language?: 'kn' | 'en';
}

export function SectionHeader({
  title,
  titleKn,
  href,
  description,
  descriptionKn,
  badge,
  badgeVariant = 'primary',
  showViewAll = true,
  viewAllText = 'View all',
  viewAllTextKn = 'ಎಲ್ಲವನ್ನು ನೋಡಿ',
  action,
  className,
  language = 'kn',
}: SectionHeaderProps) {
  const displayTitle = language === 'kn' && titleKn ? titleKn : title;
  const displayDescription = language === 'kn' && descriptionKn ? descriptionKn : description;
  const displayViewAll = language === 'kn' ? viewAllTextKn : viewAllText;

  return (
    <header className={cn('flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6', className)}>
      <div>
        <div className="flex items-baseline gap-3 mb-1">
          <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
            {displayTitle}
          </h2>
          {badge && (
            <Badge variant={badgeVariant} size="sm">
              {badge}
            </Badge>
          )}
        </div>
        {displayDescription && (
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
            {displayDescription}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 sm:ml-auto">
        {action}
        {showViewAll && href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-garjane-primary dark:text-garjane-primary-light hover:text-garjane-primary-dark dark:hover:text-garjane-primary transition-colors"
          >
            {displayViewAll}
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </header>
  );
}

interface CategoryNavProps {
  categories: Array<{
    id: string;
    name: string;
    nameKn?: string | null;
    slug: string;
    color?: string | null;
    _count?: { articles: number };
  }>;
  activeCategory?: string;
  language?: 'kn' | 'en';
  className?: string;
}

export function CategoryNav({
  categories,
  activeCategory,
  language = 'kn',
  className,
}: CategoryNavProps) {
  return (
    <nav className={cn('flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide', className)} aria-label="Category navigation">
      {categories.map((category) => {
        const isActive = activeCategory === category.slug;
        const displayName = language === 'kn' && category.nameKn ? category.nameKn : category.name;

        return (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-medium whitespace-nowrap transition-all duration-200',
              isActive
                ? 'bg-garjane-primary text-garjane-primary-foreground shadow-card'
                : 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-secondary dark:text-garjane-text-muted hover:bg-garjane-primary/10 dark:hover:bg-garjane-primary/20 hover:text-garjane-primary dark:hover:text-garjane-primary-light',
              category.color && !isActive && `border-l-4 border-[${category.color}] pl-3`
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {displayName}
            {category._count && (
              <span className={cn(
                'text-caption px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-garjane-primary-foreground/20 text-garjane-primary-foreground' : 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-muted'
              )}>
                {category._count.articles}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}