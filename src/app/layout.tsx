import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Kannada, Lexend } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteSettings, getMenuItems, getBreakingNews } from '@/lib/data';

export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  variable: '--font-noto-sans-kannada',
  display: 'swap',
  preload: true,
});

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0D0D14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Garjane News - Your Local News, Your Voice',
    template: '%s | Garjane News',
  },
  description: 'Garjane News brings you the latest breaking news, local updates, and in-depth coverage from Karnataka and beyond. Available in Kannada and English.',
  keywords: ['news', 'Karnataka', 'breaking news', 'local news', 'Kannada news', 'Indian news'],
  authors: [{ name: 'Garjane News' }],
  creator: 'Garjane News',
  publisher: 'Garjane News',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'kn_IN',
    url: '/',
    siteName: 'Garjane News',
    title: 'Garjane News - Your Local News, Your Voice',
    description: 'Latest breaking news and local updates from Karnataka',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Garjane News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Garjane News',
    description: 'Your Local News, Your Voice',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

async function getLayoutData() {
  try {
    const [siteSettings, menuItems, breakingNews] = await Promise.all([
      getSiteSettings(),
      getMenuItems(),
      getBreakingNews(),
    ]);
    return { siteSettings, menuItems, breakingNews };
  } catch {
    // Return fallback data when database is not available (e.g., during build)
    return { siteSettings: null, menuItems: [], breakingNews: [] };
  }
}

import { getCurrentUser } from '@/lib/auth';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, { siteSettings, menuItems, breakingNews }] = await Promise.all([
    getCurrentUser().catch(() => null),
    getLayoutData(),
  ]);
  const htmlLang = siteSettings?.defaultLanguage || 'kn';

  return (
    <html lang={htmlLang} className={`${inter.variable} ${notoSansKannada.variable} ${lexend.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-garjane-background-light dark:bg-garjane-background-dark text-garjane-text-primary dark:text-garjane-text-inverse min-h-screen flex flex-col">
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-garjane-primary text-garjane-primary-foreground rounded-lg">
            Skip to main content
          </a>
          <Header breakingNews={breakingNews} user={user} menuItems={menuItems} />
          <main id="main-content" className="flex-1 pt-16 lg:pt-14" role="main">
            {children}
          </main>
          <Footer siteSettings={siteSettings} />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'NewsMediaOrganization',
              name: siteSettings?.siteName || 'Garjane News',
              alternateName: siteSettings?.siteNameKn || 'ಗರ್ಜನೆ ನ್ಯೂಸ್',
              url: process.env.NEXT_PUBLIC_APP_URL,
              logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              sameAs: siteSettings?.socialLinks ? Object.values(siteSettings.socialLinks as Record<string, string>).filter(Boolean) : [],
              description: siteSettings?.description || 'Your Local News, Your Voice',
            }),
          }}
        />
      </body>
    </html>
  );
}