import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { ProfileForms } from '@/components/dashboard/ProfileForms';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್ಸ್ | Profile Settings - Garjane News',
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="w-full py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-body-sm text-garjane-text-muted hover:text-garjane-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮರಳಿ / Back to Dashboard
          </Link>
        </div>

        <ProfileForms user={user} />
      </div>
    </div>
  );
}
