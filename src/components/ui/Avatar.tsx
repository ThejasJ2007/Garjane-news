import { forwardRef, HTMLAttributes } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-body-sm',
  lg: 'w-12 h-12 text-body',
  xl: 'w-16 h-16 text-body-lg',
  '2xl': 'w-24 h-24 text-headline-4',
};

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', shape = 'circle', ...props }, ref) => {
    const initials = name ? getInitials(name) : '?';

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold bg-garjane-primary/10 text-garjane-primary',
          'overflow-hidden border-2 border-garjane-border-light dark:border-garjane-border-dark',
          sizes[size],
          shapes[shape],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || name || 'Avatar'}
            fill
            className="object-cover"
            sizes="32px"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export const AvatarGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { max?: number }>(
  ({ className, max = 5, children, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const visibleChildren = childArray.slice(0, max);
    const remainingCount = childArray.length - max;

    return (
      <div ref={ref} className={cn('flex -space-x-2', className)} {...props}>
        {visibleChildren.map((child, index) => (
          <span key={index} className="relative z-[auto]">
            {child}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className={cn(
            'inline-flex items-center justify-center font-medium bg-garjane-background-light dark:bg-garjane-background-dark',
            'border-2 border-garjane-background-card dark:border-garjane-background-cardDark',
            'text-garjane-text-secondary dark:text-garjane-text-muted',
            sizes.md,
            shapes.circle
          )}>
            +{remainingCount}
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';