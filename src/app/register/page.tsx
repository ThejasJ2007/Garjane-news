'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { registerAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { evaluatePassword, isPasswordAcceptable } from '@/lib/passwordStrength';

export default function RegisterPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'kn' | 'en'>('kn');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dictionary = language === 'kn' ? {
    title: 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ',
    subtitle: 'Create your Garjane News Account',
    tagline: 'ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳು ಮತ್ತು ವಿಶೇಷ ಲೇಖನಗಳಿಗೆ ಚಂದಾದಾರರಾಗಿ',
    nameLabel: 'ಪೂರ್ಣ ಹೆಸರು / Full Name',
    namePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು / Your name',
    nameError: 'ಹೆಸರು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.',
    emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ / Email Address',
    emailError: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್ / Password (ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳು)',
    confirmPasswordLabel: 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ / Confirm Password',
    preferredLanguageLabel: 'ಆದ್ಯತೆಯ ಭಾಷೆ / Preferred News Language',
    submitButton: 'ಖಾತೆ ರಚಿಸಿ / Create Account',
    submittingButton: 'ರಚಿಸಲಾಗುತ್ತಿದೆ... / Registering...',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',
    signInLink: 'ಲಾಗಿನ್ ಆಗಿ / Sign In',
    showPassword: 'ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ',
    hidePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ',
    lengthError: 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 8 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.',
    weakPasswordError: "ಪಾಸ್‌ವರ್ಡ್ ದುರ್ಬಲವಾಗಿದೆ. ಕೇವಲ 'ಬಲವಾದ' ಅಥವಾ 'ಅತ್ಯಂತ ಬಲವಾದ' ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಮಾತ್ರ ಸ್ವೀಕರಿಸಲಾಗುತ್ತದೆ.",
    matchError: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.',
    connectionError: 'ಸಂಪರ್ಕ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
    strength: {
      empty: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
      veryWeak: 'ಬಹಳ ದುರ್ಬಲ',
      weak: 'ದುರ್ಬಲ',
      fair: 'ಸಾಧಾರಣ',
      good: 'ಉತ್ತಮ',
      strong: 'ಬಲವಾದ',
      veryStrong: 'ಅತ್ಯಂತ ಬಲವಾದ',
    },
    passwordStrength: {
      goodJob: 'ಉತ್ತಮ ಕೆಲಸ!',
      meterLabel: 'ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ',
      iconLabel: 'ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಸೂಚಕ',
      announcement: 'ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ ಬದಲಾಗಿದೆ',
    },
  } : {
    title: 'Create Account',
    subtitle: 'Create your Garjane News Account',
    tagline: 'Subscribe for local news and exclusive articles',
    nameLabel: 'Full Name',
    namePlaceholder: 'Your name',
    nameError: 'Name must be at least 2 characters.',
    emailLabel: 'Email Address',
    emailError: 'Please enter a valid email address.',
    passwordLabel: 'Password (min. 8 characters)',
    confirmPasswordLabel: 'Confirm Password',
    preferredLanguageLabel: 'Preferred News Language',
    submitButton: 'Create Account',
    submittingButton: 'Registering...',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign In',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    lengthError: 'Password must be at least 8 characters.',
    weakPasswordError: 'Password is too weak. Only Strong or Very Strong passwords are accepted.',
    matchError: 'Passwords do not match.',
    connectionError: 'Connection error occurred. Please try again.',
    strength: {
      empty: 'Enter a password',
      veryWeak: 'Very Weak',
      weak: 'Weak',
      fair: 'Fair',
      good: 'Good',
      strong: 'Strong',
      veryStrong: 'Very Strong',
    },
    passwordStrength: {
      goodJob: 'good job!',
      meterLabel: 'Password strength',
      iconLabel: 'Password strength indicator',
      announcement: 'Password strength changed to',
    },
  };

  const passwordStrength = useMemo(() => evaluatePassword(password), [password]);
  const isStrongEnough = isPasswordAcceptable(passwordStrength.level);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    !isLoading &&
    name.trim().length >= 2 &&
    isEmailValid &&
    password.length >= 8 &&
    isStrongEnough &&
    passwordsMatch;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError(dictionary.nameError);
      return;
    }

    if (!isEmailValid) {
      setError(dictionary.emailError);
      return;
    }

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
      formData.set('name', name.trim());
      formData.set('email', email.trim());
      formData.set('password', password);
      formData.set('confirmPassword', confirmPassword);
      formData.set('language', selectedLanguage);

      const res = await registerAction(formData);
      if (res && res.error) {
        setError(res.error);
        setIsLoading(false);
      }
    } catch (err: any) {
      if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.startsWith('NEXT_REDIRECT')) {
        return;
      }
      setError(dictionary.connectionError);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-garjane-background-card dark:bg-garjane-background-cardDark p-8 rounded-2xl border border-garjane-border-light dark:border-garjane-border-dark shadow-card-elevated">
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
            {language === 'kn' ? 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ' : dictionary.title}
          </h1>
          <p className="mt-1 text-headline-4 text-garjane-text-secondary dark:text-garjane-text-muted">
            {dictionary.subtitle}
          </p>
          <p className="mt-2 text-body-sm text-garjane-text-muted">
            {dictionary.tagline}
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-body-sm flex items-center gap-2" role="alert">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="name">
              {dictionary.nameLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <User className="w-5 h-5" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={dictionary.namePlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="email">
              {dictionary.emailLabel}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="password">
              {dictionary.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="password"
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
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="confirmPassword">
              {dictionary.confirmPasswordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-garjane-text-muted">
                <Lock className="w-5 h-5" />
              </div>
              <input
                id="confirmPassword"
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

          {/* Language Selection */}
          <div>
            <label className="block text-body-sm font-medium text-garjane-text-secondary dark:text-garjane-text-muted mb-1.5" htmlFor="language">
              {dictionary.preferredLanguageLabel}
            </label>
            <select
              id="language"
              name="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'kn' | 'en')}
              className="w-full px-4 py-2.5 rounded-xl border border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50 text-garjane-text-primary dark:text-garjane-text-inverse focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary text-body min-h-[48px]"
            >
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 text-body font-medium flex items-center justify-center gap-2 min-h-[48px]"
            disabled={!canSubmit}
          >
            {isLoading ? (
              <span>{dictionary.submittingButton}</span>
            ) : (
              <>
                <span>{dictionary.submitButton}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          {/* Login Link */}
          <div className="text-center pt-2 border-t border-garjane-border-light dark:border-garjane-border-dark">
            <p className="text-body-sm text-garjane-text-muted">
              {dictionary.alreadyHaveAccount}{' '}
              <Link href="/login" className="text-garjane-primary font-medium hover:underline">
                {dictionary.signInLink}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
