'use client';

import { cn } from '@/lib/utils';

/**
 * Official Facebook App Icon
 * Official Facebook brand blue (#1877F2) with white 'f'.
 * No extra shadows, gradients, or decorative effects.
 */
export function FacebookIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M16.671 15.457l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.514V4.91s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047v8.385a12.09 12.09 0 003.75 0v-8.385h2.796z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Official X (formerly Twitter) Logo
 * Authentic mathematical double-struck 𝕏 glyph in official black (#000000) / dark-mode white (#FFFFFF).
 * No extra shadows, gradients, or decorative effects.
 */
export function XTwitterIcon({ className = 'w-[22px] h-[22px]' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className={cn('text-black dark:text-white', className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Official Instagram App Icon
 * Authentic official Instagram brand gradient with white camera glyph.
 * No extra shadows, borders, or decorative effects.
 */
export function InstagramIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="garjane-instagram-official-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6.5" fill="url(#garjane-instagram-official-gradient)" />
      <rect
        x="5.25"
        y="5.25"
        width="13.5"
        height="13.5"
        rx="3.75"
        stroke="#FFFFFF"
        strokeWidth="1.75"
        fill="none"
      />
      <circle cx="12" cy="12" r="3.25" stroke="#FFFFFF" strokeWidth="1.75" fill="none" />
      <circle cx="15.8" cy="8.2" r="0.95" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Official YouTube Play Button App Icon
 * Official YouTube brand red (#FF0000) with centered white play triangle.
 * No extra shadows, gradients, or decorative effects.
 */
export function YouTubeIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
  );
}

export interface SocialMediaIconsProps {
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  className?: string;
}

export function SocialMediaIcons({
  facebookUrl = 'https://www.facebook.com/profile.php?id=61563431741881',
  twitterUrl = 'https://twitter.com/garjanenews',
  instagramUrl = 'https://www.instagram.com/garjanenews_kannada/',
  youtubeUrl = 'https://www.youtube.com/@GarjaneNews1',
  className,
}: SocialMediaIconsProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
        aria-label="Facebook"
      >
        <FacebookIcon className="w-6 h-6" />
      </a>

      {/* X (formerly Twitter) */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-sm transition-opacity duration-200 hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
        aria-label="X (formerly Twitter)"
      >
        <XTwitterIcon className="w-[22px] h-[22px]" />
      </a>

      {/* Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-[6px] transition-opacity duration-200 hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-6 h-6" />
      </a>

      {/* YouTube */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-[6px] transition-opacity duration-200 hover:opacity-80 active:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-garjane-primary focus-visible:ring-offset-2"
        aria-label="YouTube"
      >
        <YouTubeIcon className="w-6 h-6" />
      </a>
    </div>
  );
}
