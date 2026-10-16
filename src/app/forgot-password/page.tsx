'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ForgotPasswordPage() {
  const { language, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const email = (formData.get('email') as string)?.trim();
    if (!email || !email.includes('@')) {
      setError(t.auth.invalidEmail);
      setIsLoading(false);
      return;
    }

    try {
      formData.set('language', language);
      const res = await forgotPasswordAction(formData);

      if (res && res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      setSubmittedEmail(email);
      setIsSubmitted(true);
      setIsLoading(false);
    } catch {
      setError(t.auth.connectionError);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 sm:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-garjane-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-garjane-primary/20">
            <span className="text-garjane-primary-foreground font-heading font-bold text-3xl">ಗ</span>
          </div>
          <h1 className="font-heading font-bold text-headline-3 text-garjane-text-primary dark:text-garjane-text-inverse">
            {t.auth.forgotPasswordTitle}
          </h1>
          <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
            {t.auth.forgotPasswordSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-start gap-2.5"
            role="alert"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Success Confirmation State */}
        {isSubmitted ? (
          <div className="space-y-6 animate-fade-in" role="status">
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h2 className="font-heading font-bold text-headline-4 text-emerald-800 dark:text-emerald-300">
                {t.auth.resetLinkSentTitle}
              </h2>
              <p className="text-body-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                {t.auth.resetLinkSentDesc}
              </p>
              {submittedEmail && (
                <p className="text-xs font-mono font-medium text-emerald-900 dark:text-emerald-200 bg-white/60 dark:bg-black/20 py-1 px-2.5 rounded-md inline-block break-all">
                  {submittedEmail}
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-garjane-primary text-white hover:bg-garjane-primary-hover transition-colors shadow-sm min-h-[48px]"
              >
                <span>{t.auth.backToSignIn}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setError(null);
                }}
                className="w-full text-center py-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary transition-colors min-h-[44px]"
              >
                {language === 'kn'
                  ? 'ಮತ್ತೊಂದು ಇಮೇಲ್ ಪ್ರಯತ್ನಿಸಿ'
                  : language === 'hi'
                  ? 'दूसरा ईमेल आज़माएं'
                  : 'Try another email'}
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="language" value={language} />

            <div>
              <label
                className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5"
                htmlFor="email"
              >
                {t.auth.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-body font-medium flex items-center justify-center gap-2 min-h-[48px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>{t.auth.sendingResetLink}</span>
              ) : (
                <>
                  <span>{t.auth.sendResetLink}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            <div className="text-center pt-2 border-t border-garjane-border-light dark:border-garjane-border-dark">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-body-sm text-garjane-primary hover:text-garjane-primary-hover font-medium hover:underline py-2 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.auth.backToSignIn}</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
