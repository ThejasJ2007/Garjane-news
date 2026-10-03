'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker for PWA functionality.
 * next-pwa generates public/sw.js and public/workbox-*.js on production build.
 * Because the Next.js App Router does not execute Pages Router entrypoint scripts,
 * explicit client-side service worker registration is performed here.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    const registerSW = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          // Listen for new service worker installation
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New update available; activates when tabs are closed
                  console.info('Garjane News: New version available on next visit.');
                } else {
                  // Content is cached for offline use
                  console.info('Garjane News: Content cached for offline use.');
                }
              }
            });
          });
        })
        .catch((error) => {
          // Fail gracefully in non-HTTPS / unsupported contexts
          console.debug('Service worker registration failed:', error);
        });
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW, { once: true });
    }
  }, []);

  return null;
}
