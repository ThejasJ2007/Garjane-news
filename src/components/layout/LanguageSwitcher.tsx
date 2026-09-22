'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export function LanguageSwitcher({ className, showIcon = true }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setIsOpen(false);
  };

  const currentLabel = language === 'kn' ? 'ಕನ್ನಡ' : 'English';

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      {/* Trigger Button matching Garjane reference style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={language === 'kn' ? 'ಭಾಷೆ ಬದಲಿಸಿ: ಪ್ರಸ್ತುತ ಕನ್ನಡ' : 'Change language: Currently English'}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all duration-200 border shadow-sm',
          'focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:outline-none',
          language === 'kn'
            ? 'bg-garjane-primary text-white border-garjane-primary hover:bg-garjane-primary-hover shadow-sm'
            : 'bg-white dark:bg-garjane-background-cardDark text-garjane-text-primary dark:text-garjane-text-inverse border-garjane-border-light dark:border-garjane-border-dark hover:border-garjane-primary/40'
        )}
      >
        {showIcon && (
          <Languages className={cn('w-3.5 h-3.5', language === 'kn' ? 'text-white' : 'text-garjane-primary')} aria-hidden="true" />
        )}
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200',
            language === 'kn' ? 'text-white/90' : 'text-garjane-text-muted',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Language options"
          className={cn(
            'absolute right-0 mt-1.5 w-36 rounded-xl p-1.5 shadow-card-elevated border z-50 animate-slide-down',
            'bg-white dark:bg-garjane-background-cardDark border-garjane-border-light dark:border-garjane-border-dark'
          )}
        >
          {/* Kannada Option */}
          <button
            type="button"
            role="option"
            aria-selected={language === 'kn'}
            onClick={() => selectLanguage('kn')}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
              language === 'kn'
                ? 'bg-garjane-primary/10 text-garjane-primary dark:text-garjane-primary-light font-bold'
                : 'text-garjane-text-primary dark:text-garjane-text-inverse hover:bg-garjane-primary/5 dark:hover:bg-white/5'
            )}
          >
            <span>ಕನ್ನಡ</span>
            {language === 'kn' && (
              <Check className="w-3.5 h-3.5 text-garjane-primary dark:text-garjane-primary-light" aria-hidden="true" />
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            role="option"
            aria-selected={language === 'en'}
            onClick={() => selectLanguage('en')}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors mt-0.5',
              language === 'en'
                ? 'bg-garjane-primary/10 text-garjane-primary dark:text-garjane-primary-light font-bold'
                : 'text-garjane-text-primary dark:text-garjane-text-inverse hover:bg-garjane-primary/5 dark:hover:bg-white/5'
            )}
          >
            <span>English</span>
            {language === 'en' && (
              <Check className="w-3.5 h-3.5 text-garjane-primary dark:text-garjane-primary-light" aria-hidden="true" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
