import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/router';
import { SessionProvider } from '@/context/SessionProvider';
import { initSentry } from '@/lib/sentry';
import { initGA } from '@/lib/analytics';

const queryClient = new QueryClient();

const isProduction = import.meta.env.MODE === 'production';
const sentryDsn = (import.meta.env.VITE_SENTRY_DSN as string | undefined)?.trim();

if (isProduction && sentryDsn) {
  initSentry(sentryDsn);
}

const App = () => {
  useEffect(() => {
    if (isProduction) {
      const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();

      if (measurementId) {
        initGA(measurementId);
      }

      if ('serviceWorker' in navigator) {
        const registerServiceWorker = async () => {
          try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('SW registered:', registration);
          } catch (error) {
            console.log('SW registration failed:', error);
          }
        };

        window.addEventListener('load', registerServiceWorker, { once: true });
        return () => window.removeEventListener('load', registerServiceWorker);
      }
    }
  }, [isProduction]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TooltipProvider>
            <Toaster />
            <RouterProvider router={router} />
          </TooltipProvider>
        </SessionProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
