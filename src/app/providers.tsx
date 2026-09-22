'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="garjane_theme"
      >
        {children}
      </ThemeProvider>
    </LanguageProvider>
  );
}