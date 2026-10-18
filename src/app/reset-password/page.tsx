'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { verifyResetTokenAction, resetPasswordAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { evaluatePassword, isPasswordAcceptable } from '@/lib/passwordStrength';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const { language, t } = useLanguage();

  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'invalid' | 'expired'>('valid');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const dictionary = language === 'kn' ? {
    title: t.auth.resetPasswordTitle,
    subtitle: t.auth.resetPasswordSubtitle,
    newPasswordLabel: t.auth.newPassword,
    confirmPasswordLabel: t.auth.confirmPassword,
    resetButton: t.auth.saveNewPassword,
    backToSignIn: t.auth.backToSignIn,
    showPassword: t.auth.showPassword,
    hidePassword: t.auth.hidePassword,
    lengthError: t.auth.passwordTooShort,
    weakPasswordError: "ಪಾಸ್‌ವರ್ಡ್ ದುರ್ಬಲವಾಗಿದೆ. ಕೇವಲ 'ಬಲವಾದ' ಅಥವಾ 'ಅತ್ಯಂತ ಬಲವಾದ' ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಮಾತ್ರ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.",
    matchError: t.auth.passwordsDoNotMatch,
    strength: {
      empty: "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
      veryWeak: "ಬಹಳ ದುರ್ಬಲ",
      weak: "ದುರ್ಬಲ",
      fair: "ಸಾಧಾರಣ",
      good: "ಉತ್ತಮ",
      strong: "ಬಲವಾದ",
      veryStrong: "ಅತ್ಯಂತ ಬಲವಾದ",
    },
    passwordStrength: {
      goodJob: "ಉತ್ತಮ ಕೆಲಸ! 👍",
      meterLabel: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ",
      iconLabel: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಸೂಚಕ",
      announcement: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಬದಲಾಗಿದೆ",
    },
  } : {
    title: "Set New Password",
    subtitle: "Please enter a new strong password for your account.",
    newPasswordLabel: "New Password",
    confirmPasswordLabel: "Confirm Password",
    resetButton: "Save New Password",
    backToSignIn: "Back to Sign In",
    showPassword: "Show password",
    hidePassword: "Hide password",
    lengthError: "Password must be at least 8 characters.",
    weakPasswordError: "Password is too weak. Only Strong or Very Strong passwords are accepted.",
    matchError: "Passwords do not match.",
    strength: {
      empty: "Enter a password",
      veryWeak: "Very Weak",
      weak: "Weak",
      fair: "Fair",
      good: "Good",
      strong: "Strong",
      veryStrong: "Very Strong",
    },
    passwordStrength: {
      goodJob: "Good Job !👍",
      meterLabel: "Password strength",
      iconLabel: "Password strength indicator",
      announcement: "Password strength changed to",
    },
  };

  const passwordStrength = useMemo(() => evaluatePassword(password), [password]);
  const isStrongEnough = isPasswordAcceptable(passwordStrength.level);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = !isLoading && password.length >= 8 && isStrongEnough && passwordsMatch;

  useEffect(() => {
    let isMounted = true;

    async function checkToken() {
      if (!token) {
        if (isMounted) {
          setTokenStatus('invalid');
          setIsVerifying(false);
        }
        return;
      }

      try {
        const res = await verifyResetTokenAction(token);
        if (!isMounted) return;

        if (res.valid) {
          setTokenStatus('valid');
          setUserEmail(res.email || null);
        } else {
          setTokenStatus(res.error === 'expired' ? 'expired' : 'invalid');
        }
      } catch {
        if (isMounted) {
          setTokenStatus('invalid');
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    }

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError(dictionary.lengthError);
      return;
    }

    if (!isStrongEnough) {
      setError(dictionary.weakPasswordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(dictionary.matchError);
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('token', token);
      formData.set('password', password);
      formData.set('confirmPassword', confirmPassword);

      const res = await resetPasswordAction(formData);

      if (res && res.error) {
        if (res.error === 'INVALID_OR_EXPIRED_TOKEN') {
          setTokenStatus('invalid');
          setError(t.auth.invalidLinkDesc);
        } else {
          setError(res.error);
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setIsLoading(false);
    } catch {
      setError(t.auth.connectionError);
      setIsLoading(false);
    }
  }

  // Loading / Verifying State
  if (isVerifying) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-garjane-primary/20 border-t-garjane-primary animate-spin mx-auto" />
          <p className="text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted">
            {language === 'kn'
              ? 'ಲಿಂಕ್ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...'
              : 'Verifying reset link...'}
          </p>
        </div>
      </div>
    );
  }

  // Invalid or Expired Token State
  if (tokenStatus !== 'valid') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 sm:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated text-center" role="alert">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-heading font-bold text-headline-3 text-garjane-text-primary dark:text-garjane-text-inverse">
              {t.auth.invalidLinkTitle}
            </h1>
            <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
              {t.auth.invalidLinkDesc}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-garjane-primary text-white hover:bg-garjane-primary-hover transition-colors shadow-sm min-h-[48px]"
            >
              <span>{t.auth.requestNewLink}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{dictionary.backToSignIn}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 sm:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated text-center animate-fade-in" role="status">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-heading font-bold text-headline-3 text-garjane-text-primary dark:text-garjane-text-inverse">
              {t.auth.passwordResetSuccessTitle}
            </h1>
            <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
              {t.auth.passwordResetSuccessDesc}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-garjane-primary text-white hover:bg-garjane-primary-hover transition-colors shadow-sm min-h-[48px]"
            >
              <span>{t.auth.signInWithNewPassword}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Reset Password Form State
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-garjane-background-card dark:bg-garjane-background-cardDark p-6 sm:p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated">
        {/* Brand Header */}
        <div className="text-center">
          <div className="relative h-14 aspect-[1.08/1] mx-auto mb-4">
            <Image
              src="/images/Garjane-news-logo.png?v=3"
              alt="Garjane News Logo"
              fill
              sizes="64px"
              className="object-cover"
              priority
            />
          </div>
          <h1 className="font-heading font-bold text-headline-3 text-garjane-text-primary dark:text-garjane-text-inverse">
            {dictionary.title}
          </h1>
          <p className="mt-2 text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted leading-relaxed">
            {dictionary.subtitle}
          </p>
          {userEmail && (
            <p className="mt-1 text-xs font-mono text-garjane-primary">
              {userEmail}
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-start gap-2.5"
            role="alert"
          >
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5"
              htmlFor="new-password"
            >
              {dictionary.newPasswordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="new-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-garjane-text-muted hover:text-garjane-text-primary min-w-[44px] justify-center"
                aria-label={showPassword ? dictionary.hidePassword : dictionary.showPassword}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <PasswordStrengthMeter
              password={password}
              labels={dictionary.strength}
              goodJobLabel={dictionary.passwordStrength.goodJob}
              meterLabel={dictionary.passwordStrength.meterLabel}
              iconLabel={dictionary.passwordStrength.iconLabel}
              announcement={dictionary.passwordStrength.announcement}
            />

            {password.length === 0 ? (
              <p className="mt-2 text-xs text-garjane-text-muted">
                {dictionary.lengthError}
              </p>
            ) : password.length < 8 ? (
              <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-medium">
                {dictionary.lengthError}
              </p>
            ) : !isStrongEnough ? (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                {dictionary.weakPasswordError}
              </p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5"
              htmlFor="confirm-password"
            >
              {dictionary.confirmPasswordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-garjane-text-muted hover:text-garjane-text-primary min-w-[44px] justify-center"
                aria-label={showConfirmPassword ? dictionary.hidePassword : dictionary.showPassword}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium">
                {dictionary.matchError}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-body font-medium flex items-center justify-center gap-2 min-h-[48px]"
            disabled={!canSubmit}
          >
            {isLoading ? (
              <span>{t.auth.savingNewPassword}</span>
            ) : (
              <>
                <span>{dictionary.resetButton}</span>
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
              <span>{dictionary.backToSignIn}</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-garjane-primary/20 border-t-garjane-primary animate-spin mx-auto" />
            <p className="text-body-sm text-garjane-text-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}