'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'breaking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, fullWidth, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-250 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-garjane-primary text-garjane-primary-foreground hover:bg-garjane-primary-dark active:bg-garjane-primary-dark focus-visible:ring-garjane-primary',
      secondary: 'bg-garjane-secondary text-garjane-secondary-foreground hover:bg-garjane-secondary-dark active:bg-garjane-secondary-dark focus-visible:ring-garjane-secondary',
      outline: 'border-2 border-garjane-primary text-garjane-primary hover:bg-garjane-primary hover:text-garjane-primary-foreground focus-visible:ring-garjane-primary',
      ghost: 'text-garjane-text-primary hover:bg-garjane-background-cardDark dark:hover:bg-garjane-background-card focus-visible:ring-garjane-text-muted',
      destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
      breaking: 'bg-garjane-breaking-bgDark text-garjane-breaking-textDark hover:bg-garjane-breaking-bgDark/90 focus-visible:ring-garjane-breaking-textDark animate-pulse-soft',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-body-sm gap-2',
      lg: 'px-6 py-3 text-body gap-2',
      xl: 'px-8 py-4 text-body-lg gap-2.5',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], widthStyles, className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';