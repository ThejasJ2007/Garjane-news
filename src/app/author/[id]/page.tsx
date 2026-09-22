import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, FileText } from 'lucide-react';
import { getAuthorById, getArticlesByAuthor } from '@/lib/data';
import { ArticleGrid } from '@/components/articles/ArticleCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export const revalidate = 60;

interface AuthorPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const author = await getAuthorById(params.id);
  if (!author) {
    return {
      title: 'ಲೇಖಕರು ಕಂಡುಬಂದಿಲ್ಲ | Author Not Found - Garjane News',
    };
  }

  return {
    title: `${author.name} | ಲೇಖಕರು - Garjane News`,
    description: author.bioKn || author.bio || `Read articles and news stories authored by ${author.name} on Garjane News.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = await getAuthorById(params.id);

  if (!author) {
    notFound();
  }

  const articlesRes = await getArticlesByAuthor(params.id, { page: 1, limit: 12 });
  const articles = articlesRes.data;

  return (
    <div className="w-full py-10 lg:py-14">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-body-sm text-garjane-text-muted hover:text-garjane-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ / Back to Home
          </Link>
        </div>

        {/* Author Profile Header */}
        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card p-6 lg:p-10 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar
              src={author.avatar}
              name={author.name}
              size="xl"
              className="border-4 border-garjane-primary/20 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-headline-3 lg:text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
                  {author.name}
                </h1>
                <Badge variant="primary" size="md">
                  {author.role === 'EDITOR' ? 'ಸಂಪಾದಕರು / Editor' : 'ವರದಿಗಾರರು / Reporter'}
                </Badge>
              </div>

              {(author.bioKn || author.bio) && (
                <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted mb-4 max-w-3xl leading-relaxed">
                  {author.bioKn || author.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-body-sm text-garjane-text-muted">
                {author.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-garjane-primary" />
                    <span>{author.location}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-garjane-primary" />
                  <span>{articlesRes.pagination.total} ಪ್ರಕಟಿತ ಲೇಖನಗಳು / Articles</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div>
          <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-4 mb-8">
            <h2 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
              ಪ್ರಕಟಿತ ವರದಿಗಳು / Published Articles
            </h2>
          </div>

          {articles.length > 0 ? (
            <ArticleGrid articles={articles} variant="default" showLocation showStats />
          ) : (
            <EmptyState
              variant="articles"
              language="kn"
              title="ಈ ಲೇಖಕರಿಂದ ಯಾವುದೇ ಲೇಖನಗಳು ಪ್ರಕಟವಾಗಿಲ್ಲ."
              description="ಈ ಲೇಖಕರ ಹೊಸ ವರದಿಗಳು ಪ್ರಕಟವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ."
              secondaryDescription="No articles found by this author."
              className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark"
            />
          )}
        </div>
      </div>
    </div>
  );
}
