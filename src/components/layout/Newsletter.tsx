'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/contexts/LanguageContext';

interface NewsletterProps {
  title?: string;
  titleKn?: string;
  description?: string;
  descriptionKn?: string;
  buttonText?: string;
  buttonTextKn?: string;
  placeholder?: string;
  placeholderKn?: string;
  language?: 'kn' | 'en';
  className?: string;
  variant?: 'default' | 'inline' | 'footer';
}

export function Newsletter({
  title,
  titleKn,
  description,
  descriptionKn,
  buttonText,
  buttonTextKn,
  placeholder,
  placeholderKn,
  language,
  className,
  variant = 'default',
}: NewsletterProps) {
  const { language: globalLang, t } = useLanguage();
  const activeLang = language || globalLang;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const displayTitle = activeLang === 'kn' ? (titleKn || t.home.stayUpdated) : (title || t.home.stayUpdated);
  const displayDescription = activeLang === 'kn' ? (descriptionKn || t.home.newsletterDesc) : (description || t.home.newsletterDesc);
  const displayButtonText = activeLang === 'kn' ? (buttonTextKn || t.home.subscribe) : (buttonText || t.home.subscribe);
  const displayPlaceholder = activeLang === 'kn' ? (placeholderKn || t.home.emailPlaceholder) : (placeholder || t.home.emailPlaceholder);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage(t.home.invalidEmail);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, language: activeLang }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message || t.home.subscribedSuccess);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || (activeLang === 'kn' ? 'ಕ್ಷಮಿಸಿ, ದೋಷ ಸಂಭವಿಸಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Something went wrong. Please try again.'));
      }
    } catch {
      setStatus('error');
      setMessage(activeLang === 'kn' ? 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Network error. Please try again.');
    }
  };

  const baseStyles = 'bg-garjane-secondary text-garjane-secondary-foreground rounded-2xl overflow-hidden';

  const variants = {
    default: 'p-8 md:p-12',
    inline: 'p-6',
    footer: 'p-6 md:p-8',
  };

  if (variant === 'inline') {
    return (
      <section className={cn(baseStyles, variants.inline, className)} aria-labelledby="newsletter-heading">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              {displayPlaceholder}
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder={displayPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              disabled={status === 'loading' || status === 'success'}
            />
          </div>
          <Button type="submit" size="lg" className="whitespace-nowrap" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {displayButtonText}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
        {message && (
          <p className={cn('mt-3 text-sm', status === 'success' ? 'text-green-400' : 'text-red-400')} role="alert">
            {message}
          </p>
        )}
      </section>
    );
  }

  if (variant === 'footer') {
    return (
      <section className={cn(baseStyles, variants.footer, className)} aria-labelledby="newsletter-heading">
        <div className="max-w-xl">
          <h2 id="newsletter-heading" className="text-headline-4 font-heading font-bold mb-2">
            {displayTitle}
          </h2>
          <p className="text-garjane-secondary-light/70 text-body-sm mb-6">
            {displayDescription}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="newsletter-email-footer" className="sr-only">
                {displayPlaceholder}
              </label>
              <Input
                id="newsletter-email-footer"
                type="email"
                placeholder={displayPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <Button type="submit" size="lg" className="whitespace-nowrap" disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {displayButtonText}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          {message && (
            <p className={cn('mt-3 text-sm', status === 'success' ? 'text-green-400' : 'text-red-400')} role="alert">
              {message}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={cn(baseStyles, variants.default, className)} aria-labelledby="newsletter-heading">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-garjane-primary/10 text-garjane-primary text-body-sm font-medium mb-4">
            <Mail className="w-4 h-4" />
            <span>{language === 'kn' ? 'ನ್ಯೂಸ್‌ಲೆಟರ್' : 'Newsletter'}</span>
          </div>
          <h2 id="newsletter-heading" className="text-headline-2 font-heading font-bold mb-4">
            {displayTitle}
          </h2>
          <p className="text-garjane-secondary-light/70 text-body-lg leading-relaxed">
            {displayDescription}
          </p>
        </div>

        <div className="bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-xl p-6 md:p-8 border border-garjane-border-light dark:border-garjane-border-dark">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newsletter-email-main" className="sr-only">
                {displayPlaceholder}
              </label>
              <Input
                id="newsletter-email-main"
                type="email"
                placeholder={displayPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-body-lg"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>
            <Button type="submit" size="xl" className="w-full" disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {displayButtonText}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {message && (
            <div className={cn('mt-4 p-4 rounded-lg text-center', status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')} role="alert">
              <p className="text-body-sm">{message}</p>
            </div>
          )}

          <p className="mt-4 text-center text-caption text-garjane-secondary-light/50">
            {language === 'kn'
              ? 'ಹೆಚ್ಚಿಂದ ಸಮಯದಲ್ಲಿ ಒಮ್ಮೆ ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಸುದ್ದಿಗಳು. ಗೌಪ್ಯತೆ امن stronger mn.'
              : 'Weekly digest to your inbox. We respect your privacy.'}
          </p>
        </div>
      </div>
    </section>
  );
}