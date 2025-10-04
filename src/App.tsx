import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/router';
import { SessionProvider } from '@/context/SessionProvider';
import { initSentry } from '@/lib/sentry';
import { initGA, trackPageView } from '@/lib/analytics';

const queryClient = new QueryClient();

initSentry();

const App = () => {
  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

      if (measurementId) {
        initGA(measurementId);
        trackPageView(window.location.href, document.title);
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
  }, []);

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
