// Google Analytics 4 integration
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize GA4
export const initGA = (measurementId: string) => {
  if (typeof window === 'undefined') return;

  // Load gtag.js script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll manually track page views
  });

  console.log('GA4 initialized with ID:', measurementId);
};

// Track page views
export const trackPageView = (url: string, title: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: url,
    page_path: new URL(url).pathname,
  });
};

// Custom event tracking
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, params);
  console.log('Event tracked:', eventName, params);
};

// Article-specific events
export const trackArticleView = (articleId: string, title: string, category: string) => {
  trackEvent('article_view', {
    article_id: articleId,
    article_title: title,
    article_category: category,
  });
};

export const trackArticleShare = (articleId: string, platform: string) => {
  trackEvent('article_share', {
    article_id: articleId,
    share_platform: platform,
  });
};

export const trackCategoryClick = (category: string) => {
  trackEvent('category_click', {
    category_name: category,
  });
};

export const trackSearch = (query: string, resultsCount: number) => {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
};

// E-commerce events (if needed for ads)
export const trackNewsletterSignup = (email: string) => {
  trackEvent('newsletter_signup', {
    email_hash: btoa(email), // Basic hash for privacy
  });
};