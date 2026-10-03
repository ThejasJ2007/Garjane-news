'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Mail,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export function ShareButtons({
  title,
  url: propUrl,
  description,
  className,
  compact = false,
}: ShareButtonsProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(propUrl || '');

  useEffect(() => {
    if (!propUrl && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanNativeShare(true);
    }
  }, [propUrl]);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: currentUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    }
  };

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(currentUrl);
    const shareTitle = encodeURIComponent(title);

    let shareLink = '';
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${shareTitle}&body=${encodeURIComponent((description ? description + '\n\n' : '') + currentUrl)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard write failure fallback
        }
        return;
    }
    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer,width=600,height=450');
    }
  };

  const shareText = language === 'kn' ? 'ಹಂಚಿಕೊಳ್ಳಿ' : 'Share';
  const copiedText = language === 'kn' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'Copied!';
  const copyLinkText = language === 'kn' ? 'ಲಿಂಕ್ ನಕಲಿಸಿ' : 'Copy link';

  return (
    <div
      className={cn('flex items-center gap-1.5 flex-wrap', className)}
      role="group"
      aria-label={t?.common?.share || shareText}
    >
      <span className="text-caption font-medium text-garjane-text-muted mr-1.5 flex items-center gap-1">
        <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{t?.common?.share || shareText}</span>
      </span>

      {canNativeShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="h-8 px-2.5 text-caption gap-1 sm:hidden rounded-lg"
          aria-label="Native share menu"
        >
          <Share2 className="w-4 h-4" />
          <span>{shareText}</span>
        </Button>
      )}

      {/* WhatsApp */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="w-8 h-8 p-0 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        aria-label="Share on WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
        </svg>
      </Button>

      {/* Telegram */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('telegram')}
        className="w-8 h-8 p-0 rounded-lg text-sky-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40"
        aria-label="Share on Telegram"
        title="Telegram"
      >
        <Send className="w-4 h-4" />
      </Button>

      {/* Facebook */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="w-8 h-8 p-0 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <Facebook className="w-4 h-4" />
      </Button>

      {/* Twitter / X */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="w-8 h-8 p-0 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        aria-label="Share on X (Twitter)"
        title="X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </Button>

      {/* Email */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('email')}
        className="w-8 h-8 p-0 rounded-lg text-garjane-text-secondary hover:text-garjane-primary hover:bg-garjane-background-light dark:hover:bg-garjane-background-dark"
        aria-label="Share via Email"
        title="Email"
      >
        <Mail className="w-4 h-4" />
      </Button>

      {/* Copy Link */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('copy')}
        className={cn(
          'h-8 px-2 rounded-lg text-caption gap-1 transition-all',
          copied
            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-medium'
            : 'text-garjane-text-muted hover:text-garjane-text-primary'
        )}
        aria-label={copied ? copiedText : copyLinkText}
        title={copied ? copiedText : copyLinkText}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-xs">{copiedText}</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {!compact && <span className="text-xs">{copyLinkText}</span>}
          </>
        )}
      </Button>
    </div>
  );
}
