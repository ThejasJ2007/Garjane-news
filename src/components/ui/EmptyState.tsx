import { cn } from '@/lib/utils';

/**
 * Custom SVG illustrations for empty states.
 * Each illustration is hand-drawn with the Garjane brand palette and
 * adapts to dark mode via Tailwind fill/stroke utilities.
 */

function NewsIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="35" y="25" width="110" height="80" rx="6" className="fill-garjane-background-card dark:fill-garjane-background-cardDark" />
      <rect x="35" y="25" width="110" height="80" rx="6" fill="none" strokeWidth="2.5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <rect x="45" y="35" width="38" height="24" rx="3" className="fill-garjane-primary" />
      <rect x="89" y="37" width="46" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="89" y="48" width="38" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="45" y="66" width="90" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="45" y="78" width="72" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="45" y="90" width="52" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="140" y="45" width="24" height="70" rx="4" className="fill-garjane-primary/90" transform="rotate(8 152 80)" />
      <rect x="147" y="52" width="14" height="5" rx="2.5" className="fill-white/70" transform="rotate(8 154 54)" />
      <rect x="148" y="63" width="10" height="5" rx="2.5" className="fill-white/50" transform="rotate(8 153 65)" />
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="30" y="30" width="95" height="75" rx="6" className="fill-garjane-background-card dark:fill-garjane-background-cardDark" />
      <rect x="30" y="30" width="95" height="75" rx="6" fill="none" strokeWidth="2.5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <rect x="42" y="42" width="50" height="7" rx="3.5" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="42" y="56" width="70" height="5" rx="2.5" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="42" y="67" width="60" height="5" rx="2.5" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="42" y="78" width="44" height="5" rx="2.5" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <circle cx="128" cy="72" r="26" className="fill-garjane-primary/10 stroke-garjane-primary" strokeWidth="6" />
      <line x1="146" y1="91" x2="166" y2="111" strokeWidth="8" strokeLinecap="round" className="stroke-garjane-primary" />
      <circle cx="119" cy="66" r="4" className="fill-garjane-primary/40" />
    </svg>
  );
}

function GalleryIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="40" y="25" width="90" height="75" rx="8" className="fill-garjane-background-card dark:fill-garjane-background-cardDark" />
      <rect x="40" y="25" width="90" height="75" rx="8" fill="none" strokeWidth="2.5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <rect x="50" y="35" width="70" height="40" rx="4" className="fill-garjane-primary/15" />
      <circle cx="65" cy="48" r="6" className="fill-garjane-accent" />
      <path d="M52 72 L70 55 L82 65 L95 52 L118 72 Z" className="fill-garjane-primary" />
      <rect x="50" y="82" width="60" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="50" y="92" width="40" height="5" rx="2.5" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="134" y="60" width="30" height="30" rx="6" className="fill-garjane-primary/80" transform="rotate(-8 149 75)" />
      <path d="M139 80 L148 70 L153 75 L158 69 L163 80 Z" className="fill-white/80" transform="rotate(-8 149 75)" />
    </svg>
  );
}

function VideoIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="45" y="35" width="90" height="62" rx="8" className="fill-garjane-background-card dark:fill-garjane-background-cardDark" />
      <rect x="45" y="35" width="90" height="62" rx="8" fill="none" strokeWidth="2.5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <path d="M45 43 a8 8 0 0 1 8-8 h18 l8 8 h56 a8 8 0 0 1 8 8 v0 h-98 z" className="fill-garjane-primary" />
      <rect x="52" y="52" width="76" height="34" rx="4" className="fill-garjane-secondary/10 dark:fill-white/10" />
      <path d="M82 60 L96 69 L82 78 Z" className="fill-garjane-primary" />
      <rect x="140" y="50" width="18" height="12" rx="3" className="fill-garjane-primary/70" />
      <rect x="140" y="68" width="18" height="12" rx="3" className="fill-garjane-primary/50" />
      <rect x="140" y="86" width="18" height="12" rx="3" className="fill-garjane-primary/30" />
    </svg>
  );
}

function ArticlesIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="55" y="30" width="90" height="75" rx="6" className="fill-garjane-border-light dark:fill-garjane-border-dark" transform="rotate(-4 100 67)" />
      <rect x="48" y="38" width="90" height="75" rx="6" className="fill-garjane-background-cardDark/60 dark:fill-garjane-background-cardDark" transform="rotate(3 93 75)" />
      <rect x="40" y="45" width="95" height="75" rx="6" className="fill-garjane-background-card dark:fill-garjane-background-cardDark" />
      <rect x="40" y="45" width="95" height="75" rx="6" fill="none" strokeWidth="2.5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <rect x="52" y="57" width="44" height="8" rx="4" className="fill-garjane-primary" />
      <rect x="52" y="72" width="70" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="52" y="84" width="58" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="52" y="96" width="40" height="6" rx="3" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <circle cx="133" cy="55" r="10" className="fill-garjane-accent" />
      <path d="M130 50.5 L139 55 L130 59.5 Z" className="fill-garjane-secondary" />
    </svg>
  );
}

function DashboardIllustration() {
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" role="img" aria-hidden="true">
      <ellipse cx="100" cy="140" rx="70" ry="8" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="60" y="30" width="16" height="90" rx="4" className="fill-garjane-border-light dark:fill-garjane-border-dark" />
      <rect x="84" y="30" width="16" height="60" rx="4" className="fill-garjane-primary/60" />
      <rect x="108" y="30" width="16" height="75" rx="4" className="fill-garjane-primary/80" />
      <rect x="132" y="30" width="16" height="45" rx="4" className="fill-garjane-accent" />
      <line x1="60" y1="120" x2="148" y2="120" strokeWidth="2.5" strokeLinecap="round" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <line x1="60" y1="75" x2="148" y2="75" strokeWidth="1.5" strokeDasharray="4 5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
      <line x1="60" y1="50" x2="148" y2="50" strokeWidth="1.5" strokeDasharray="4 5" className="stroke-garjane-border-light dark:stroke-garjane-border-dark" />
    </svg>
  );
}

const illustrations = {
  news: NewsIllustration,
  search: SearchIllustration,
  gallery: GalleryIllustration,
  video: VideoIllustration,
  articles: ArticlesIllustration,
  dashboard: DashboardIllustration,
};

export type EmptyStateVariant = keyof typeof illustrations;

type BilingualText = { kn: string; en: string };

const defaultTitles: Record<EmptyStateVariant, BilingualText> = {
  news: { kn: 'ಸುದ್ದಿಗಳಿಲ್ಲ', en: 'No news yet' },
  search: { kn: 'ಯಾವುದೇ ಫಲಿತಾಂಶ ಕಂಡುಬಂದಿಲ್ಲ', en: 'No results found' },
  gallery: { kn: 'ಫೋಟೋಗಳಿಲ್ಲ', en: 'No photos yet' },
  video: { kn: 'ವೀಡಿಯೊಗಳಿಲ್ಲ', en: 'No videos yet' },
  articles: { kn: 'ಲೇಖನಗಳಿಲ್ಲ', en: 'No articles yet' },
  dashboard: { kn: 'ಮಾಹಿತಿ ಇಲ್ಲ', en: 'Nothing to show' },
};

const defaultDescriptions: Record<EmptyStateVariant, BilingualText> = {
  news: { kn: 'ಹೊಸ ಸುದ್ದಿಗಳು ಪ್ರಕಟವಾದಾಗ ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.', en: 'New stories will appear here once published.' },
  search: { kn: 'ದಯವಿಟ್ಟು ಬೇರೆ ಪದಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ.', en: 'Please try different keywords.' },
  gallery: { kn: 'ಹೊಸ ಫೋಟೋ ಗ್ಯಾಲರಿಗಳು ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತವೆ.', en: 'New photo galleries will be added soon.' },
  video: { kn: 'ಹೊಸ ವೀಡಿಯೊಗಳು ಶೀಘ್ರದಲ್ಲೇ ಪ್ರಕಟವಾಗುತ್ತವೆ.', en: 'New videos will be published soon.' },
  articles: { kn: 'ಈ ಸ್ಥಳದಲ್ಲಿ ಯಾವುದೇ ಲೇಖನಗಳು ಲಭ್ಯವಿಲ್ಲ.', en: 'No articles are available here yet.' },
  dashboard: { kn: 'ಮಾಹಿತಿ ಲಭ್ಯವಾದಾಗ ಇಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ.', en: 'Data will be shown here when available.' },
};

export interface EmptyStateProps {
  /** Which illustration to show */
  variant?: EmptyStateVariant;
  /** UI language used for default bilingual title/description */
  language?: 'kn' | 'en';
  /** Override title (defaults provided per variant/language) */
  title?: string;
  /** Override description (defaults provided per variant/language) */
  description?: string;
  /** Optional secondary line in the other language */
  secondaryDescription?: string;
  /** Optional call-to-action rendered below the description */
  action?: React.ReactNode;
  /** Compact layout for sidebars and small containers */
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  variant = 'articles',
  language = 'kn',
  title,
  description,
  secondaryDescription,
  action,
  compact = false,
  className,
}: EmptyStateProps) {
  const Illustration = illustrations[variant];
  const resolvedTitle = title ?? defaultTitles[variant][language];
  const resolvedDescription = description ?? defaultDescriptions[variant][language];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center animate-fade-in',
        compact ? 'py-6 px-4' : 'py-12 px-4',
        className
      )}
      role="status"
    >
      <div className={cn('mx-auto', compact ? 'w-28 max-w-full' : 'w-48 max-w-full')}>
        <Illustration />
      </div>
      <h3
        className={cn(
          'font-heading font-semibold text-garjane-text-primary dark:text-garjane-text-inverse',
          compact ? 'text-body mt-3' : 'text-headline-4 mt-6'
        )}
      >
        {resolvedTitle}
      </h3>
      <p className={cn('text-garjane-text-muted mt-2 max-w-md', compact ? 'text-caption' : 'text-body-sm')}>
        {resolvedDescription}
      </p>
      {secondaryDescription && (
        <p className="text-garjane-text-muted/80 text-caption mt-1 max-w-md">{secondaryDescription}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
