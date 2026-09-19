import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getCategories, getLocations } from '@/lib/data';
import { ArticleEditorForm } from '@/components/dashboard/ArticleEditorForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ಹೊಸ ಲೇಖನ ರಚಿಸಿ | Create Article - Garjane News',
};

export default async function NewArticlePage() {
  const user = await getCurrentUser();

  if (!user || !['ADMIN', 'EDITOR', 'REPORTER'].includes(user.role)) {
    redirect('/login');
  }

  const [categories, locations] = await Promise.all([
    getCategories(),
    getLocations(),
  ]);

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-body-sm text-garjane-text-muted hover:text-garjane-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮರಳಿ / Back to Dashboard
          </Link>
        </div>

        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated p-8 lg:p-10">
          <div className="border-b border-garjane-border-light dark:border-garjane-border-dark pb-6 mb-8">
            <h1 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-1">
              ಹೊಸ ಲೇಖನ ಪ್ರಕಟಣೆ / Create New Article
            </h1>
            <p className="text-body text-garjane-text-muted">
              ಕನ್ನಡ ಹಾಗೂ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಸಮಗ್ರ ಸುದ್ದಿ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ
            </p>
          </div>

          <ArticleEditorForm categories={categories} locations={locations} />
        </div>
      </div>
    </div>
  );
}
