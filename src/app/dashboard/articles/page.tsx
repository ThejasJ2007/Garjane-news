import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import React from 'react';
import { Plus, ChevronLeft, ChevronRight, Edit, Eye, FileText, Calendar } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardStats } from '@/actions/articles';
import { Button } from '@/components/ui/Button';
import { formatRelativeTimeKn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { ArticleSortSelect } from '@/components/articles/ArticleSortSelect';
import { ArticleStatusFilter } from '@/components/dashboard/ArticleStatusFilter';
import { Label } from '@/components/ui/Label';
import { prisma } from '@/lib/prisma';
import type { ArticleWithRelations } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ಲೇಖನಗಳು | Articles - Garjane News Dashboard',
};

interface DashboardArticlesPageProps {
  searchParams: Promise<{ page?: string; sort?: string; status?: string }>;
}

export default async function DashboardArticlesPage({ searchParams }: DashboardArticlesPageProps) {
  const user = await getCurrentUser();

  if (!user || !['ADMIN', 'EDITOR', 'REPORTER'].includes(user.role)) {
    redirect('/login');
  }

  const { page: pageParam = '1', sort = 'publishedAt', status } = await searchParams;
  const page = parseInt(pageParam, 10) || 1;
  const limit = 10;

  const where = user.role === 'REPORTER' ? { authorId: user.id } : {};

  if (status && status !== 'ALL') {
    Object.assign(where, { status });
  }

  try {
    const [articlesData, stats] = await Promise.all([
      prisma.article.findMany({
        where: {
          ...where,
          status: (status && status !== 'ALL' ? status : undefined) as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED' | undefined,
        },
        orderBy: { [sort]: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true, nameKn: true, color: true, slug: true } },
          author: { select: { id: true, name: true, avatar: true } },
          reporter: { include: { user: { select: { id: true, name: true, avatar: true } } } },
          location: true,
          tags: { include: { tag: true } },
          media: { where: { type: 'IMAGE' }, take: 1 },
        },
      }),
      getDashboardStats(),
    ]);

    const totalArticles = await prisma.article.count({ where: { ...where, status: (status && status !== 'ALL' ? status : undefined) as 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'ARCHIVED' | undefined } });
    const totalPages = Math.ceil(totalArticles / limit);

    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-1">
                ಲೇಖನ व्यवಹಾರ / Articles Management
              </h1>
              <p className="text-body text-garjane-text-muted">
                ಎಲ್ಲಾ ಲೇಖನಗಳನ್ನು ನಿರೀಕ್ಷಿಸಿ, ಸಂಪಾದಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ
              </p>
            </div>
            <Link href="/dashboard/articles/new">
              <Button className="flex items-center gap-2 shadow-lg shadow-garjane-primary/20">
                <Plus className="w-5 h-5" />
                ಹೊಸ ಲೇಖನ / New Article
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Articles" titleKn="ಒಟ್ಟು ಲೇಖನಗಳು" value={stats.totalArticles} icon={FileText} />
              <StatCard title="Published" titleKn="ಪ್ರಕಟಿತ" value={stats.publishedArticles} icon={Eye} color="emerald" />
              <StatCard title="Drafts" titleKn="ಕರಡೆಗಳು" value={stats.draftArticles} icon={FileText} color="amber" />
              <StatCard title="Total Views" titleKn="ಒಟ್ಟು ವೀಕ್ಷಣೆಗಳು" value={stats.totalViews} icon={Eye} color="blue" />
            </div>
          )}

          {/* Filters & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex flex-wrap items-center gap-3">
              <Label htmlFor="status-filter">Status:</Label>
              <ArticleStatusFilter currentStatus={status || 'ALL'} />
            </div>
            <div className="flex-1" />
            <ArticleSortSelect currentSort={sort} />
          </div>

          {/* Articles Table/List */}
          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark overflow-hidden">
            {articlesData.length > 0 ? (
              <div className="divide-y divide-garjane-border-light dark:divide-garjane-border-dark">
                {articlesData.map((article) => (
                  <ArticleRow
                    key={article.id}
                    article={article as ArticleWithRelations}
                    userRole={user.role}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText className="w-12 h-12 mx-auto mb-3 text-garjane-text-muted opacity-40" />
                <p className="text-body font-medium">ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ</p>
                <p className="text-body-sm text-garjane-text-muted mt-1">No articles found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-6 flex items-center justify-center gap-2" aria-label="Pagination">
              {page > 1 && (
                <Link
                  href={`/dashboard/articles?page=${page - 1}&sort=${sort}${status ? `&status=${status}` : ''}`}
                  className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" /> Prev
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
                .map((p, index, arr) => (
                  <React.Fragment key={p}>
                    {index > 0 && p !== arr[index - 1] + 1 && (
                      <span className="px-2 text-garjane-text-muted" aria-hidden="true">…</span>
                    )}
                    {p === page ? (
                      <span className="px-4 py-2 bg-garjane-primary text-garjane-primary-foreground rounded-lg font-medium" aria-current="page">
                        {p}
                      </span>
                    ) : (
                      <Link
                        href={`/dashboard/articles?page=${p}&sort=${sort}${status ? `&status=${status}` : ''}`}
                        className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
                      >
                        {p}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              {page < totalPages && (
                <Link
                  href={`/dashboard/articles?page=${page + 1}&sort=${sort}${status ? `&status=${status}` : ''}`}
                  className="px-4 py-2 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-body-sm font-medium hover:border-garjane-primary"
                >
                  Next <ChevronRight className="w-4 h-4 inline ml-1" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading dashboard articles:', error);
    return (
      <div className="w-full py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <p className="text-body text-red-500">Failed to load articles. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }
}

function StatCard({ title, titleKn, value, icon: Icon, color = 'primary' }: { title: string; titleKn: string; value: number; icon: React.ComponentType<{ className?: string }>; color?: 'primary' | 'emerald' | 'amber' | 'blue' }) {
  const colors: Record<'primary' | 'emerald' | 'amber' | 'blue', string> = {
    primary: 'bg-garjane-primary/10 text-garjane-primary',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };

  return (
    <div className="p-5 rounded-2xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-garjane-text-muted mb-1">{titleKn}</p>
          <p className="text-caption text-garjane-text-muted/70">{title}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="mt-4 text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function ArticleRow({ article, userRole }: { article: ArticleWithRelations; userRole: string }) {
  const canEdit = userRole === 'ADMIN' || userRole === 'EDITOR' || (userRole === 'REPORTER' && (article.authorId === article.author?.id || article.reporterId === article.reporter?.user?.id));
  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    DRAFT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    SCHEDULED: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    ARCHIVED: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
  };

  return (
    <div className="p-4 hover:bg-garjane-background-light/30 dark:hover:bg-garjane-background-dark/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Thumbnail */}
        {article.featuredImage && (
          <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-garjane-border-light dark:bg-garjane-border-dark">
            <Image src={article.featuredImage} alt="" fill className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-body text-garjane-text-primary dark:text-garjane-text-inverse line-clamp-1 pr-4">
              {article.headlineKn || article.headline}
            </h3>
            <Badge variant="default" size="sm" className={statusColors[article.status] || ''}>
              {article.status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-caption text-garjane-text-muted">
            {article.category && (
              <Badge variant="primary" size="sm" className="text-caption" style={{ backgroundColor: article.category.color + '20', color: article.category.color }}>
                {article.category.nameKn || article.category.name}
              </Badge>
            )}
            {article.author && (
              <span className="flex items-center gap-1">
                <span>{article.author.name}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatRelativeTimeKn(article.publishedAt || article.createdAt)}
            </span>
            {article.breakingLevel !== 'NORMAL' && (
              <Badge variant={article.breakingLevel === 'BREAKING' ? 'breaking' : 'default'} size="sm" dot className="text-caption">
                {article.breakingLevel}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Link
            href={`/article/${article.slug}`}
            className="p-2 rounded-lg text-garjane-text-muted hover:text-garjane-primary hover:bg-garjane-primary/10 transition-colors"
            target="_blank"
            aria-label="View article"
          >
            <Eye className="w-4 h-4" />
          </Link>
          {canEdit && (
            <Link
              href={`/dashboard/articles/${article.id}/edit`}
              className="p-2 rounded-lg text-garjane-text-muted hover:text-garjane-primary hover:bg-garjane-primary/10 transition-colors"
              aria-label="Edit article"
            >
              <Edit className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}