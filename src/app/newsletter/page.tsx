'use client';

import { useState, useTransition } from 'react';
import { Mail, CheckCircle2, BellRing, Sparkles, AlertCircle } from 'lucide-react';
import { subscribeNewsletterAction, unsubscribeNewsletterAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';

export default function NewsletterPage({
  searchParams,
}: {
  searchParams?: { token?: string; action?: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  async function handleSubscribe(formData: FormData) {
    setStatus(null);
    startTransition(async () => {
      const res = await subscribeNewsletterAction(formData);
      setStatus(res);
    });
  }

  async function handleUnsubscribe(token: string) {
    setStatus(null);
    startTransition(async () => {
      const res = await unsubscribeNewsletterAction(token);
      setStatus(res);
    });
  }

  return (
    <div className="w-full py-12 lg:py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-garjane-primary/10 text-garjane-primary text-caption font-semibold mb-4">
            <Sparkles className="w-4 h-4" /> ದಿನದ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು ನೇರವಾಗಿ ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್‌ಗೆ
          </div>
          <h1 className="text-headline-2 lg:text-headline-1 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse mb-4">
            ಗರ್ಜನೆ ನ್ಯೂಸ್ ನ್ಯೂಸ್‌ಲೆಟರ್ / Daily Newsletter
          </h1>
          <p className="text-body-lg text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
            ನೆಲಮಂಗಲದ ತಾಜಾ ವಿದ್ಯಮಾನಗಳು, ಕರ್ನಾಟಕದ ರಾಜಕೀಯ ಮತ್ತು ಪ್ರಮುಖ ವಿಶ್ಲೇಷಣೆಗಳ ಬೆಳಗಿನ ಸಂಕ್ಷಿಪ್ತ ವರದಿ
          </p>
        </div>

        {/* Unsubscribe banner if token provided in URL */}
        {searchParams?.token && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-center">
            <h3 className="text-headline-4 font-semibold text-amber-900 dark:text-amber-200 mb-2">
              ಚಂದಾದಾರಿಕೆ ರದ್ದುಗೊಳಿಸಬೇಕೇ? / Unsubscribe?
            </h3>
            <p className="text-body-sm text-amber-700 dark:text-amber-300 mb-4">
              ದಿನನಿತ್ಯದ ಇಮೇಲ್ ನ್ಯೂಸ್‌ಲೆಟರ್ ಚಂದಾದಾರಿಕೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ.
            </p>
            <Button
              variant="outline"
              onClick={() => handleUnsubscribe(searchParams.token!)}
              disabled={isPending}
            >
              ಚಂದಾದಾರಿಕೆ ರದ್ದು ಮಾಡಿ / Unsubscribe
            </Button>
          </div>
        )}

        {/* Status Alert */}
        {status?.message && (
          <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200 text-body flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            <span>{status.message}</span>
          </div>
        )}

        {status?.error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200 text-body flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <span>{status.error}</span>
          </div>
        )}

        {/* Main Subscription Card */}
        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-3xl border border-garjane-border-light dark:border-garjane-border-dark p-8 lg:p-12 shadow-card-elevated">
          <form action={handleSubscribe} className="space-y-6 max-w-xl mx-auto">
            <div>
              <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="email">
                ಇಮೇಲ್ ವಿಳಾಸ / Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-garjane-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
                />
              </div>
            </div>

            <div>
              <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="name">
                ನಿಮ್ಮ ಹೆಸರು / Your Name (ಐಚ್ಛಿಕ / Optional)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು"
                className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
              />
            </div>

            <div>
              <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="language">
                ನ್ಯೂಸ್‌ಲೆಟರ್ ಭಾಷೆ / Newsletter Edition
              </label>
              <select
                id="language"
                name="language"
                defaultValue="kn"
                className="w-full px-4 py-3 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
              >
                <option value="kn">ಕನ್ನಡ ಆವೃತ್ತಿ (Kannada Morning Briefing)</option>
                <option value="en">English Edition (State & Regional News)</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full py-3.5 text-body-lg font-semibold shadow-lg shadow-garjane-primary/20"
              disabled={isPending}
            >
              {isPending ? 'ನೋಂದಾಯಿಸಲಾಗುತ್ತಿದೆ... / Subscribing...' : 'ಉಚಿತ ಚಂದಾದಾರರಾಗಿ / Subscribe Free'}
            </Button>

            <p className="text-caption text-center text-garjane-text-muted">
              ನಾವು ನಿಮ್ಮ ಗೌಪ್ಯತೆಯನ್ನು ಗೌರವಿಸುತ್ತೇವೆ. ಯಾವುದೇ ಸ್ಪ್ಯಾಮ್ ಇರುವುದಿಲ್ಲ. ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ರದ್ದುಗೊಳಿಸಬಹುದು.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
