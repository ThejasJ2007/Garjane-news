'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface BreakingTickerProps {
  items: Array<{
    id: string;
    headline: string;
    headlineKn?: string | null;
    level: string;
    article?: { slug: string } | null;
  }>;
  language?: 'kn' | 'en';
}

export function BreakingTicker({ items, language = 'kn' }: BreakingTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(30);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.scrollWidth;
    const pixelsPerSecond = 50;
    const duration = Math.max(totalWidth / pixelsPerSecond, 15);
    setAnimationDuration(duration);
  }, []);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div
      ref={containerRef}
      className={cn(
        'bg-garjane-breaking-bgDark text-garjane-breaking-textDark px-4 py-1.5 overflow-hidden',
        'relative'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Breaking news"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <Badge variant="breaking" size="sm" className="flex-shrink-0 flex items-center gap-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-pulse absolute top-0 left-0 h-full w-full rounded-full bg-red-500" />
            <span className="relative block h-full w-full rounded-full bg-red-500" />
          </span>
          <span className="font-mono text-xs">BREAKING</span>
        </Badge>

        <div
          className="flex whitespace-nowrap gap-6"
          style={{
            animation: isPaused ? 'none' : `ticker ${animationDuration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {items.map((item) => (
            <span key={item.id} className="flex items-center gap-2 text-sm font-medium flex-shrink-0">
              {item.article ? (
                <a
                  href={`/article/${item.article.slug}`}
                  className="hover:underline text-garjane-breaking-textDark"
                >
                  {language === 'kn' ? (item.headlineKn || item.headline) : item.headline}
                </a>
              ) : (
                language === 'kn' ? (item.headlineKn || item.headline) : item.headline
              )}
              <span className="text-garjane-breaking-textDark/60">•</span>
            </span>
          ))}
          {items.map((item) => (
            <span key={`${item.id}-clone`} className="flex items-center gap-2 text-sm font-medium flex-shrink-0">
              {item.article ? (
                <a
                  href={`/article/${item.article.slug}`}
                  className="hover:underline text-garjane-breaking-textDark"
                >
                  {language === 'kn' ? (item.headlineKn || item.headline) : item.headline}
                </a>
              ) : (
                language === 'kn' ? (item.headlineKn || item.headline) : item.headline
              )}
              <span className="text-garjane-breaking-textDark/60">•</span>
            </span>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="flex-shrink-0 ml-2 p-1"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume ticker' : 'Pause ticker'}
          aria-pressed={isPaused}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </Button>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}