'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
  showLabels?: boolean;
}

type ThemeValue = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function resolveTheme(theme: ThemeValue): ResolvedTheme {
  if (theme !== 'system') return theme;
  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
}

/**
 * Applies the theme to <html> straight away.
 *
 * next-themes only writes the theme to the document when the stored preference
 * actually changes value. If the document is out of sync with that preference
 * (the inline theme script did not run, a cached document was restored, ...),
 * picking the option that is already selected is a no-op and the page keeps the
 * old theme until it is reloaded by hand. Writing the theme here keeps the
 * document in sync with the selection immediately, with no manual intervention.
 */
function applyTheme(theme: ThemeValue): ResolvedTheme {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  // Suppress transitions while the theme swaps, mirroring `disableTransitionOnChange`.
  const transitionGuard = document.createElement('style');
  transitionGuard.appendChild(
    document.createTextNode(
      '*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
    )
  );
  document.head.appendChild(transitionGuard);

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.setAttribute('data-theme', resolved);
  root.style.colorScheme = resolved;

  window.getComputedStyle(document.body);
  setTimeout(() => {
    transitionGuard.remove();
  }, 1);

  return resolved;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { language, t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
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

  const currentTheme: ThemeValue = (theme as ThemeValue) || 'system';

  // Keep the document in sync with the active preference, so the page always
  // renders the selected theme without needing a reload.
  useEffect(() => {
    if (!mounted) return;
    applyTheme(currentTheme);
  }, [mounted, currentTheme]);

  const themeOptions = [
    {
      value: 'light',
      label: t.theme.light,
      secondaryLabel: 'Light',
      icon: Sun,
    },
    {
      value: 'dark',
      label: t.theme.dark,
      secondaryLabel: 'Dark',
      icon: Moon,
    },
    {
      value: 'system',
      label: t.theme.system,
      secondaryLabel: 'System',
      icon: Laptop,
    },
  ] as const;

  const currentOption = themeOptions.find((opt) => opt.value === currentTheme) || themeOptions[0];
  const CurrentIcon = currentOption.icon;

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold opacity-60',
          'bg-white dark:bg-garjane-background-cardDark border-garjane-border-light dark:border-garjane-border-dark',
          className
        )}
      >
        <Sun className="w-3.5 h-3.5 text-garjane-text-muted" />
        <span className="text-garjane-text-secondary dark:text-slate-300">{t.theme.light}</span>
        <ChevronDown className="w-3.5 h-3.5 text-garjane-text-muted" />
      </div>
    );
  }

  const handleSelect = (val: ThemeValue) => {
    // Apply the theme to the document right away so the switch is instant and
    // works even when the preference itself does not change value.
    applyTheme(val);
    setTheme(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.theme.selectTheme}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all duration-200 border shadow-sm',
          'focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:outline-none',
          'bg-white dark:bg-garjane-background-cardDark text-garjane-text-primary dark:text-garjane-text-inverse border-garjane-border-light dark:border-garjane-border-dark hover:border-garjane-primary/40'
        )}
      >
        <CurrentIcon className="w-3.5 h-3.5 text-garjane-primary dark:text-garjane-primary-light" aria-hidden="true" />
        <span>{currentOption.label}</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-garjane-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={t.theme.selectTheme}
          className={cn(
            'absolute right-0 mt-1.5 w-36 rounded-xl p-1.5 shadow-card-elevated border z-50 animate-slide-down',
            'bg-white dark:bg-garjane-background-cardDark border-garjane-border-light dark:border-garjane-border-dark'
          )}
        >
          {themeOptions.map((opt) => {
            const isSelected = currentTheme === opt.value;
            const Icon = opt.icon;

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors mt-0.5 first:mt-0',
                  isSelected
                    ? 'bg-garjane-primary/10 text-garjane-primary dark:text-garjane-primary-light font-bold'
                    : 'text-garjane-text-primary dark:text-garjane-text-inverse hover:bg-garjane-primary/5 dark:hover:bg-white/5'
                )}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-garjane-text-muted" aria-hidden="true" />
                  <span>{opt.label}</span>
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-garjane-primary dark:text-garjane-primary-light" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
