import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Index from "./pages/Index";
import AuditReport from "./pages/AuditReport";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { initSentry } from "./lib/sentry";
import { initGA, trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();

// Initialize monitoring and analytics
initSentry();
if (import.meta.env.MODE === 'production') {
  // Replace with your actual GA4 Measurement ID
  initGA('G-XXXXXXXXXX');
}

const App = () => {
  useEffect(() => {
    // Track page views on route change
    if (import.meta.env.MODE === 'production') {
      trackPageView(window.location.href, document.title);
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.log('SW registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/audit" element={<AuditReport />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
