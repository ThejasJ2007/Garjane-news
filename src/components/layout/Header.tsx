'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown, Bell, User, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { logoutAction } from '@/actions/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';

interface MenuItem {
  id: string;
  label: string;
  labelKn: string;
  slug: string;
  href: string | null;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  isExternal: boolean;
  icon?: string | null;
  children?: MenuItem[];
}

interface HeaderProps {
  breakingNews?: Array<{
    id: string;
    headline: string;
    headlineKn?: string | null;
    level: string;
    article?: { slug: string } | null;
  }>;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    role: string;
  } | null;
  menuItems?: MenuItem[];
}

export function Header({ breakingNews = [], user, menuItems }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoLightboxOpen, setIsLogoLightboxOpen] = useState(false);
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const brandDisplayName =
    language === 'kn'
      ? 'ಗರ್ಜನೆ ನ್ಯೂಸ್'
      : (language as string) === 'hi'
        ? 'गर्जने न्यूज़'
        : 'Garjane News';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleSearchToggle = () => setIsSearchOpen(!isSearchOpen);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle escape key and body scroll lock for logo modal
  useEffect(() => {
    if (!isLogoLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLogoLightboxOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isLogoLightboxOpen]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      'bg-white dark:bg-garjane-background-cardDark border-b border-gray-100 dark:border-garjane-border-dark',
      isScrolled ? 'shadow-md bg-white/98 dark:bg-garjane-background-cardDark/98 backdrop-blur-sm' : 'shadow-sm'
    )}>
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-garjane-breaking-bgDark text-garjane-breaking-textDark px-4 py-1.5 overflow-hidden">
          <div className="flex items-center gap-2 animate-ticker whitespace-nowrap">
            <Badge variant="breaking" size="sm" className="flex-shrink-0">
              <span className="font-mono">◉</span> {t.common.breaking}
            </Badge>
            {breakingNews.map((news) => {
              const headline = language === 'en'
                ? (news.headline || news.headlineKn)
                : (news.headlineKn || news.headline);
              return (
                <span key={news.id} className="flex items-center gap-2 text-sm font-medium flex-shrink-0">
                  {news.article ? (
                    <Link href={`/article/${news.article.slug}`} className="hover:underline">
                      {headline}
                    </Link>
                  ) : (
                    headline
                  )}
                  <span className="text-garjane-breaking-textDark/60">•</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Header */}
      <nav className="relative" aria-label={language === 'kn' ? 'ಮುಖ್ಯ ಸಂಚರಣೆ' : 'Main navigation'}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[60px] sm:h-[64px] lg:h-[68px] gap-3 sm:gap-4">
            {/* Logo & Brand Presentation (matches reference image) */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 lg:gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsLogoLightboxOpen(true)}
                className="relative flex-shrink-0 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-garjane-primary/30 rounded-[10px] sm:rounded-[12px]"
                title="ಕ್ಲಿಕ್ ಮಾಡಿ: ಲಾಂಛನವನ್ನು ಪೂರ್ಣ ಗಾತ್ರದಲ್ಲಿ ವೀಕ್ಷಿಸಿ / Click to view full logo"
                aria-label="View full Garjane News logo"
              >
                <div className="relative flex items-center justify-center overflow-hidden rounded-[10px] sm:rounded-[12px] shadow-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] h-10 sm:h-11 lg:h-12 aspect-[1.08/1] bg-transparent">
                  <Image
                    src="/images/Garjane-news-logo.png"
                    alt={brandDisplayName}
                    fill
                    sizes="(max-width: 640px) 48px, (max-width: 1024px) 54px, 60px"
                    className="object-contain block p-0.5 rounded-[10px] sm:rounded-[12px]"
                    priority
                  />
                </div>
              </button>

              <Link
                href="/"
                className="flex items-center focus:outline-none group/brand flex-shrink-0"
                aria-label={brandDisplayName}
              >
                <span
                  className={cn(
                    'font-heading font-extrabold text-xl sm:text-2xl lg:text-[28px] xl:text-[31px] tracking-[-0.025em] text-[#060D27] dark:text-white leading-none whitespace-nowrap transition-colors group-hover/brand:text-garjane-primary',
                    language === 'kn' && 'font-kannada font-bold tracking-normal'
                  )}
                >
                  {brandDisplayName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems?.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </div>

            {/* Search, Language & Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSearchToggle}
                className="lg:hidden"
                aria-label={t.nav.search}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Language Switcher on Header */}
              <LanguageSwitcher className="hidden sm:inline-flex" />

              {/* Theme Switcher on Header */}
              <ThemeSwitcher className="hidden sm:inline-flex" />

              {user ? (
                <UserMenu user={user} />
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">{t.nav.signIn}</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">{t.nav.getStarted}</Button>
                  </Link>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleMenuToggle}
                className="lg:hidden"
                aria-label={isMenuOpen ? t.nav.close : t.nav.menu}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-garjane-background-card dark:bg-garjane-background-cardDark border-t border-garjane-border-light dark:border-garjane-border-dark animate-slide-down">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Language Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-garjane-border-light dark:border-garjane-border-dark">
                <span className="text-body-sm font-medium text-garjane-text-secondary dark:text-slate-300">
                  {t.article.language}
                </span>
                <LanguageSwitcher />
              </div>

              {/* Mobile Theme Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-garjane-border-light dark:border-garjane-border-dark">
                <span className="text-body-sm font-medium text-garjane-text-secondary dark:text-slate-300">
                  {t.theme.theme}
                </span>
                <ThemeSwitcher showLabels />
              </div>

              {menuItems?.map((item) => (
                <MobileNavItem key={item.id} item={item} setIsMenuOpen={handleMenuToggle} />
              ))}
              <div className="pt-4 border-t border-garjane-border-light dark:border-garjane-border-dark">
                <Button variant="outline" className="w-full" onClick={handleSearchToggle}>
                  <Search className="w-4 h-4 mr-2" /> {t.nav.search}
                </Button>
              </div>
              {!user && (
                <div className="flex flex-col gap-2">
                  <Link href="/login"><Button variant="outline" className="w-full">{t.nav.signIn}</Button></Link>
                  <Link href="/register"><Button className="w-full">{t.nav.getStarted}</Button></Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setIsSearchOpen(false)}>
            <div className="container mx-auto px-4 pt-20 pb-4" onClick={(e) => e.stopPropagation()}>
              <SearchForm onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}
      </nav>

      {/* Dedicated Logo Preview Modal */}
      {isLogoLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Garjane News Logo"
          onClick={() => setIsLogoLightboxOpen(false)}
        >
          {/* Close (X) button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLogoLightboxOpen(false);
            }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Full logo image only - no captions, descriptions, or subtitles */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/Garjane-news-logo.png"
              alt="Garjane News Logo"
              width={1888}
              height={2246}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              priority
            />
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ item }: { item: MenuItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguage();
  const hasChildren = item.children && item.children.length > 0;

  const displayLabel = language === 'en'
    ? (item.label || item.labelKn)
    : (item.labelKn || item.label);

  if (hasChildren) {
    return (
      <div className="relative group">
        <button
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 text-body-sm font-medium rounded-lg transition-colors',
            'text-garjane-text-secondary dark:text-slate-200',
            'hover:text-garjane-primary dark:hover:text-garjane-primary-light',
            'hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10'
          )}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.icon && <span className="w-4 h-4">{item.icon}</span>}
          <span>{displayLabel}</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-lg shadow-card-elevated border border-garjane-border-light dark:border-garjane-border-dark py-2 animate-slide-down z-50">
            {item.children!.map((child: any) => {
              const childLabel = language === 'en'
                ? (child.label || child.labelKn)
                : (child.labelKn || child.label);
              return (
                <Link
                  key={child.id}
                  href={child.href}
                  className="block px-4 py-2 text-body-sm text-garjane-text-secondary dark:text-slate-200 hover:text-garjane-primary dark:hover:text-garjane-primary-light hover:bg-garjane-primary/5"
                >
                  {childLabel}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'px-3 py-2 text-body-sm font-medium rounded-lg transition-colors',
        'text-garjane-text-secondary dark:text-slate-200',
        'hover:text-garjane-primary dark:hover:text-garjane-primary-light',
        'hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10',
        pathname === item.href && 'text-garjane-primary dark:text-garjane-primary-light bg-garjane-primary/5'
      )}
    >
      {displayLabel}
    </Link>
  );
}

function MobileNavItem({ item, setIsMenuOpen }: { item: MenuItem; setIsMenuOpen: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const hasChildren = item.children && item.children.length > 0;

  const displayLabel = language === 'en'
    ? (item.label || item.labelKn)
    : (item.labelKn || item.label);

  if (hasChildren) {
    return (
      <div>
        <button
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 text-body-sm font-medium rounded-lg transition-colors',
            'text-garjane-text-secondary dark:text-slate-200',
            'hover:text-garjane-primary dark:hover:text-garjane-primary-light',
            'hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10'
          )}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-2">
            {item.icon && <span className="w-4 h-4">{item.icon}</span>}
            {displayLabel}
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <div className="ml-4 mt-1 space-y-1 animate-slide-down">
            {item.children!.map((child: any) => {
              const childLabel = language === 'en'
                ? (child.label || child.labelKn)
                : (child.labelKn || child.label);
              return (
                <Link
                  key={child.id}
                  href={child.href || '#'}
                  className="block px-3 py-2 text-body-sm text-garjane-text-secondary dark:text-slate-200 hover:text-garjane-primary dark:hover:text-garjane-primary-light rounded-lg"
                  onClick={setIsMenuOpen}
                >
                  {childLabel}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'block px-3 py-2 text-body-sm font-medium rounded-lg transition-colors',
        'text-garjane-text-secondary dark:text-slate-200',
        'hover:text-garjane-primary dark:hover:text-garjane-primary-light',
        'hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10'
      )}
      onClick={setIsMenuOpen}
    >
      {displayLabel}
    </Link>
  );
}

function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-garjane-primary/5 dark:hover:bg-garjane-primary/10 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar src={user.avatar} name={user.name} size="sm" />
        <span className="hidden lg:block text-body-sm font-medium text-garjane-text-primary dark:text-garjane-text-inverse">
          {user.name}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-garjane-text-muted transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-garjane-background-card dark:bg-garjane-background-cardDark rounded-lg shadow-card-elevated border border-garjane-border-light dark:border-garjane-border-dark py-2 animate-slide-down z-50">
          <div className="px-4 py-2 border-b border-garjane-border-light dark:border-garjane-border-dark">
            <p className="text-body-sm font-medium text-garjane-text-primary dark:text-garjane-text-inverse">{user.name}</p>
            <p className="text-caption text-garjane-text-muted">{user.email}</p>
            <Badge variant={user.role === 'ADMIN' ? 'danger' : user.role === 'EDITOR' ? 'primary' : 'secondary'} size="sm" className="mt-1">
              {user.role}
            </Badge>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-body-sm text-garjane-text-secondary dark:text-slate-200 hover:text-garjane-primary dark:hover:text-garjane-primary-light hover:bg-garjane-primary/5" onClick={() => setIsOpen(false)}>
            <LayoutDashboard className="w-4 h-4" /> {t.nav.dashboard}
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-body-sm text-garjane-text-secondary dark:text-slate-200 hover:text-garjane-primary dark:hover:text-garjane-primary-light hover:bg-garjane-primary/5" onClick={() => setIsOpen(false)}>
            <User className="w-4 h-4" /> {t.nav.profile}
          </Link>
          <hr className="my-2 border-garjane-border-light dark:border-garjane-border-dark" />
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 w-full px-4 py-2 text-body-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-4 h-4" /> {t.nav.signOut}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function SearchForm({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();

  return (
    <form action="/search" className="relative" onSubmit={(e) => { onClose(); }}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-garjane-text-muted" aria-hidden="true" />
      <input
        type="search"
        name="q"
        placeholder={t.search.placeholder}
        className="w-full pl-12 pr-4 py-3 text-body bg-garjane-background-card dark:bg-garjane-background-cardDark border border-garjane-border-light dark:border-garjane-border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-garjane-primary/20 focus:border-garjane-primary"
        autoFocus
        autoComplete="off"
      />
    </form>
  );
}