import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { getContactSubmissions } from '@/actions/contact';
import { Button } from '@/components/ui/Button';
import { ContactListClient } from './ContactListClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ಸಂದೇಶಗಳು ಮತ್ತು ಸುಳಿವುಗಳು | Contacts & Tips - Garjane News',
};

export default async function ContactsDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (!['ADMIN', 'EDITOR'].includes(user.role)) {
    redirect('/dashboard');
  }

  const { submissions, total } = await getContactSubmissions({ page: 1, limit: 50 });

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="mb-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-caption font-medium text-garjane-text-muted hover:text-garjane-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ / Back to Dashboard
              </Link>
            </div>
            <h1 className="text-headline-3 lg:text-headline-2 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-garjane-primary" />
              ಸಂಪರ್ಕ ಸಂದೇಶಗಳು ಮತ್ತು ಸುಳಿವುಗಳು / Contacts & News Tips
            </h1>
            <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted mt-1">
              ಸಾರ್ವಜನಿಕರು ಮತ್ತು ಓದುಗರು ಸಲ್ಲಿಸಿದ ಸುದ್ದಿ ಸುಳಿವುಗಳು ಮತ್ತು ಸಂದೇಶಗಳ ನಿರ್ವಹಣೆ (ಒಟ್ಟು: {total})
            </p>
          </div>
        </div>

        {/* Client Submissions List */}
        <ContactListClient
          initialSubmissions={submissions}
          total={total}
          userRole={user.role}
        />
      </div>
    </div>
  );
}
