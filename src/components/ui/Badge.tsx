'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'breaking' | 'urgent' | 'live' | 'featured' | 'editor-pick' | 'video';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-secondary dark:text-slate-300 border border-garjane-border-light dark:border-garjane-border-dark',
      primary: 'bg-garjane-primary/10 dark:bg-garjane-primary/20 text-garjane-primary dark:text-garjane-primary-light border-garjane-primary/20 dark:border-garjane-primary/30',
      secondary: 'bg-garjane-secondary/10 dark:bg-garjane-secondary-light/30 text-garjane-secondary dark:text-slate-200 border-garjane-secondary/20 dark:border-garjane-secondary-light/40',
      success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
      warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
      breaking: 'bg-garjane-breaking-bg text-garjane-breaking-text dark:bg-garjane-breaking-bgDark dark:text-garjane-breaking-textDark border-garjane-breaking-text/30 animate-pulse-soft',
      urgent: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      live: 'bg-red-600 text-white animate-pulse',
      featured: 'bg-garjane-accent/10 text-garjane-accent dark:text-garjane-accent-light border-garjane-accent/20',
      'editor-pick': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-caption gap-1',
      md: 'px-2.5 py-1 text-overline gap-1.5',
      lg: 'px-3 py-1.5 text-body-sm gap-2',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full border transition-colors',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'live' && 'bg-white', variant === 'breaking' && 'bg-garjane-breaking-text')} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';