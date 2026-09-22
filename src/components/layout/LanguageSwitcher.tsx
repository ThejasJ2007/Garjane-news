'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageSwitcher({ className, showIcon = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label={language === 'kn' ? 'ಭಾಷೆ ಆಯ್ಕೆ' : 'Language selection'}
      className={cn(
        'inline-flex items-center p-0.5 rounded-lg border text-caption font-medium transition-colors',
        'bg-garjane-background-light dark:bg-garjane-background-dark/80',
        'border-garjane-border-light dark:border-garjane-border-dark shadow-sm',
        className
      )}
    >
      {showIcon && (
        <span className="pl-1.5 pr-0.5 text-garjane-text-muted" aria-hidden="true">
          <Languages className="w-3.5 h-3.5" />
        </span>
      )}
      <button
        type="button"
        onClick={() => setLanguage('kn')}
        aria-pressed={language === 'kn'}
        aria-label="ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
        className={cn(
          'px-2.5 py-1 rounded-md transition-all duration-200 text-xs font-semibold select-none',
          'focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:outline-none',
          language === 'kn'
            ? 'bg-garjane-primary text-white shadow-sm'
            : 'text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary dark:hover:text-garjane-primary-light hover:bg-garjane-primary/5'
        )}
      >
        ಕನ್ನಡ
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        aria-label="Select English language"
        className={cn(
          'px-2.5 py-1 rounded-md transition-all duration-200 text-xs font-semibold select-none',
          'focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:outline-none',
          language === 'en'
            ? 'bg-garjane-primary text-white shadow-sm'
            : 'text-garjane-text-secondary dark:text-garjane-text-muted hover:text-garjane-primary dark:hover:text-garjane-primary-light hover:bg-garjane-primary/5'
        )}
      >
        English
      </button>
    </div>
  );
}
