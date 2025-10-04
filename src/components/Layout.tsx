import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RouteScrollToTop from '@/components/ScrollToTop';
import { ScrollToTop as ScrollToTopButton } from '@/components/ui/ScrollToTop';
import { trackPageView } from '@/lib/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      trackPageView(window.location.href, document.title);
    }
  }, [location]);

  return null;
};

const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background-light text-black dark:bg-background-dark dark:text-white">
      <AnalyticsTracker />
      <RouteScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
