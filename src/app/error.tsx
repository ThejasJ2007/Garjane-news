'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html lang="kn">
      <body className="min-h-screen bg-garjane-background-light dark:bg-garjane-background-dark flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-headline-3 font-heading font-bold text-garjane-text-primary dark:text-garjane-text-inverse">
              Somewent Wrong
            </h1>
            <p className="text-body text-garjane-text-secondary dark:text-garjane-text-muted">
              We encountered an unexpected error. Our team has been notified.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-garjane-background-card dark:bg-garjane-background-cardDark p-4 rounded-lg border border-garjane-border-light dark:border-garjane-border-dark text-xs text-garjane-text-muted">
              <summary className="font-medium cursor-pointer mb-2">Error Details (Development)</summary>
              <pre className="whitespace-pre-wrap font-mono">{error.message}</pre>
              {error.digest && <p className="mt-2">Digest: {error.digest}</p>}
            </details>
          )}
        </div>
      </body>
    </html>
  );
}