'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'breaking' | 'featured';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark shadow-card',
      elevated: 'bg-garjane-background-card dark:bg-garjane-background-cardDark shadow-card-elevated',
      breaking: 'bg-garjane-breaking-bg dark:bg-garjane-breaking-bgDark border border-garjane-breaking-text/30 dark:border-garjane-breaking-textDark/30 shadow-breaking',
      featured: 'bg-garjane-background-card dark:bg-garjane-background-cardDark border-2 border-garjane-accent/50 shadow-card-elevated',
    };

    const hoverStyles = hover
      ? 'transition-all duration-350 ease-out-expo hover:shadow-card-hover hover:-translate-y-1'
      : '';

    return (
      <div
        ref={ref}
        className={cn('rounded-xl overflow-hidden', variants[variant], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-b border-garjane-border-light dark:border-garjane-border-dark', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-headline-4 text-garjane-text-primary dark:text-garjane-text-inverse', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-body-sm text-garjane-text-secondary dark:text-garjane-text-muted mt-1', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4 border-t border-garjane-border-light dark:border-garjane-border-dark bg-garjane-background-light/50 dark:bg-garjane-background-dark/50', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';