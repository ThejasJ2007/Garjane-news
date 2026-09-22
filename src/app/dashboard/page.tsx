import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  FileText,
  Eye,
  PlusCircle,
  TrendingUp,
  Clock,
  ExternalLink,
  Shield,
  Edit,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getDashboardStats, getRecentArticles } from '@/actions/articles';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelativeTimeKn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ಸಂಪಾದಕೀಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ | Dashboard - Garjane News',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const [stats, recentArticles] = await Promise.all([
    getDashboardStats().catch(() => null),
    getRecentArticles(10).catch(() => []),
  ]);

  const canPublish = ['ADMIN', 'EDITOR', 'REPORTER'].includes(user.role);

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 lg:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-headline-3 lg:text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
                ಸ್ವಾಗತ, {user.name}
              </h1>
              <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'EDITOR' ? 'primary' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted">
              Garjane News ಸಂಪಾದಕೀಯ ನಿರ್ವಹಣಾ ಫಲಕ
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {canPublish && (
              <Link href="/dashboard/articles/new">
                <Button className="flex items-center gap-2 shadow-md">
                  <PlusCircle className="w-4 h-4" /> ಹೊಸ ಲೇಖನ ರಚಿಸಿ / New Article
                </Button>
              </Link>
            )}
            <Link href="/dashboard/profile">
              <Button variant="outline">ಪ್ರೊಫೈಲ್ / Profile</Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-garjane-text-muted">
                <ExternalLink className="w-4 h-4" /> ವೀಕ್ಷಿಸಿ / View Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-caption font-medium text-garjane-text-muted">ಒಟ್ಟು ಲೇಖನಗಳು / Total</span>
              <FileText className="w-5 h-5 text-garjane-primary" />
            </div>
            <p className="text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
              {stats?.totalArticles ?? 0}
            </p>
          </div>

          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-caption font-medium text-emerald-600 dark:text-emerald-400">ಪ್ರಕಟಿತ / Published</span>
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-headline-2 font-heading font-bold text-emerald-600 dark:text-emerald-400">
              {stats?.publishedArticles ?? 0}
            </p>
          </div>

          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-caption font-medium text-amber-600 dark:text-amber-400">ಕರಡುಗಳು / Drafts</span>
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-headline-2 font-heading font-bold text-amber-600 dark:text-amber-400">
              {stats?.draftArticles ?? 0}
            </p>
          </div>

          <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark">
            <div className="flex items-center justify-between mb-3">
              <span className="text-caption font-medium text-blue-600 dark:text-blue-400">ಒಟ್ಟು ವೀಕ್ಷಣೆ / Reads</span>
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-headline-2 font-heading font-bold text-blue-600 dark:text-blue-400">
              {(stats?.totalViews ?? 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Articles Table */}
        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card overflow-hidden">
          <div className="p-6 border-b border-garjane-border-light dark:border-garjane-border-dark flex items-center justify-between">
            <h2 className="text-headline-4 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
              ಇತ್ತೀಚಿನ ಲೇಖನಗಳು / Recent Articles
            </h2>
            {canPublish && (
              <Link href="/dashboard/articles/new">
                <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" /> ಸೇರಿಸಿ
                </Button>
              </Link>
            )}
          </div>

          <div className="divide-y divide-garjane-border-light dark:divide-garjane-border-dark">
            {recentArticles.length > 0 ? (
              recentArticles.map((art) => (
                <div key={art.id} className="p-5 flex items-center justify-between gap-4 hover:bg-garjane-background-light/50 dark:hover:bg-garjane-background-dark/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-caption font-medium text-garjane-primary">
                        {art.category.nameKn || art.category.name}
                      </span>
                      <span className="text-garjane-text-muted">•</span>
                      <span className="text-caption text-garjane-text-muted">
                        {formatRelativeTimeKn(art.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-body font-semibold text-garjane-text-primary dark:text-garjane-text-inverse truncate">
                      {art.headlineKn || art.headline}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {canPublish && (
                      <Link href={`/dashboard/articles/${art.id}/edit`}>
                        <Button variant="outline" size="sm" className="text-caption flex items-center gap-1">
                          <Edit className="w-3.5 h-3.5" />
                          <span>ಸಂಪಾದಿಸಿ</span>
                        </Button>
                      </Link>
                    )}
                    <Link href={`/article/${art.slug}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-caption">
                        ವೀಕ್ಷಿಸಿ <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                variant="articles"
                language="kn"
                compact
                title="ಇನ್ನೂ ಯಾವುದೇ ಲೇಖನಗಳನ್ನು ಪ್ರಕಟಿಸಿಲ್ಲ."
                description="ಹೊಸ ಲೇಖನವನ್ನು ಪ್ರಕಟಿಸಲು ಮೇಲಿನ ಬಟನ್ ಒತ್ತಿ."
                secondaryDescription="No articles published yet."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
