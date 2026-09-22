import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Hash } from 'lucide-react';
import { getTagBySlug, getArticlesByTag } from '@/lib/data';
import { ArticleGrid } from '@/components/articles/ArticleCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const revalidate = 60;

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) {
    return {
      title: 'ಟ್ಯಾಗ್ ಕಂಡುಬಂದಿಲ್ಲ | Tag Not Found - Garjane News',
    };
  }

  const tagName = tag.nameKn ? `${tag.nameKn} (${tag.name})` : tag.name;
  return {
    title: `${tagName} | ಟ್ಯಾಗ್ ಸುದ್ದಿಗಳು - Garjane News`,
    description: `Explore latest news, coverage, and reports tagged with #${tag.name} on Garjane News.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const articlesRes = await getArticlesByTag(slug, { page: 1, limit: 12 });
  const articles = articlesRes.data;
  const displayName = tag.nameKn ? `${tag.nameKn} (${tag.name})` : tag.name;

  return (
    <div className="w-full py-10 lg:py-14">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-sm text-garjane-text-muted hover:text-garjane-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ / Back to Home
          </Link>
        </div>

        {/* Tag Header Card */}
        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card p-6 lg:p-10 mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" size="md" className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-garjane-primary" />
              <span>ಟ್ಯಾಗ್ / Topic</span>
            </Badge>
            <span className="text-caption text-garjane-text-muted">
              {articlesRes.pagination.total} ಲೇಖನಗಳು / Articles
            </span>
          </div>

          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-3">
            #{displayName}
          </h1>

          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted max-w-3xl">
            ಈ ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಸಮಗ್ರ ವರದಿಗಳು, ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು ಹಾಗೂ ವಿಶ್ಲೇಷಣೆಗಳು.
          </p>
        </div>

        {/* Articles List */}
        <div>
          {articles.length > 0 ? (
            <ArticleGrid articles={articles} variant="default" showLocation showStats />
          ) : (
            <EmptyState
              variant="articles"
              title="ಈ ಟ್ಯಾಗ್‌ನಲ್ಲಿ ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
              description="ಈ ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಹೊಸ ಲೇಖನಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತವೆ."
              secondaryDescription="No articles found under this tag."
              className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark"
            />
          )}
        </div>
      </div>
    </div>
  );
}
