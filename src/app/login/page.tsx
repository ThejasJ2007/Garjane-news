'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginAction(formData);
      if (res && res.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      setError('ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. / Connection error occurred.');
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-garjane-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-garjane-primary/20">
            <span className="text-garjane-primary-foreground font-heading font-bold text-3xl">ಗ</span>
          </div>
          <h1 className="font-heading font-bold text-headline-3 text-garjane-text-primary dark:text-garjane-text-inverse">
            ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ
          </h1>
          <p className="mt-1 text-headline-4 text-garjane-text-secondary dark:text-garjane-text-muted">
            Sign In to Garjane News
          </p>
          <p className="mt-2 text-body-sm text-garjane-text-muted">
            ವರದಿಗಾರರು, ಸಂಪಾದಕರು ಮತ್ತು ಚಂದಾದಾರರ ಆಡಳಿತ ತಾಣ
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-center gap-2" role="alert">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form action={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="email">
              ಇಮೇಲ್ ವಿಳಾಸ / Email Address
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
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted" htmlFor="password">
                ಪಾಸ್‌ವರ್ಡ್ / Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-garjane-text-muted hover:text-garjane-text-primary"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-body-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                className="rounded border-garjane-border-light dark:border-garjane-border-dark text-garjane-primary focus:ring-garjane-primary/20"
              />
              <span className="text-garjane-text-secondary dark:text-garjane-text-muted">ನನ್ನನ್ನು ನೆನಪಿಡಿ (Remember me)</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-body font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ... / Signing In...' : (
              <>
                <span>ಲಾಗಿನ್ / Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <div className="text-center pt-2 border-t border-garjane-border-light dark:border-garjane-border-dark">
            <p className="text-body-sm text-garjane-text-muted">
              ಹೊಸ ಬಳಕೆದಾರರೇ?{' '}
              <Link href="/register" className="text-garjane-primary font-medium hover:underline">
                ಖಾತೆ ತೆರೆಯಿರಿ / Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
