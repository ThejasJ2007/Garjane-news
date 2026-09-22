'use client';

import { useEffect } from 'react';

/**
 * Registers the next-pwa service worker.
 * next-pwa's `register: true` only injects into the Pages Router main bundle,
 * which never executes under the App Router, so registration is done here.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Registration failures (e.g. insecure context) should not break the app
      });
    }
  }, []);

  return null;
}
