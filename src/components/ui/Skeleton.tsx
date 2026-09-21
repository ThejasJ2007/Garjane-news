import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-garjane-border-light dark:bg-garjane-border-dark relative overflow-hidden';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-skeleton-wave',
    none: '',
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], animationClasses[animation], className)}
      style={style}
      {...props}
      aria-hidden="true"
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-skeleton-shimmer" />
      )}
    </div>
  );
}

export function SkeletonText({ lines = 3, className, ...props }: { lines?: number; className?: string } & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('space-y-2', className)} {...props} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: { className?: string } & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={cn('space-y-4 p-4 rounded-2xl bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark', className)} {...props} aria-hidden="true">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <SkeletonText lines={2} />
      <Skeleton variant="text" className="w-1/3" />
    </div>
  );
}