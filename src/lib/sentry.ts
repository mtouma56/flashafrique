import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.MODE !== 'production') {
    console.log('Sentry disabled in development mode');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || '',
    environment: import.meta.env.MODE,
    
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
    // Adjust this value in production
    tracesSampleRate: 0.1,

    // Set sampling rate for profiling
    profilesSampleRate: 0.1,

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],

    // Session Replay sample rate
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Filter out known non-critical errors
    ignoreErrors: [
      // React Router errors
      'Non-Error promise rejection captured',
      // Browser extension errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Network errors
      'NetworkError',
      'Failed to fetch',
    ],

    beforeSend(event, hint) {
      // Filter out errors from browser extensions
      if (event.exception) {
        const error = hint.originalException;
        if (error && typeof error === 'object' && 'stack' in error) {
          const stack = String(error.stack);
          if (stack.includes('chrome-extension://') || stack.includes('moz-extension://')) {
            return null;
          }
        }
      }
      return event;
    },
  });

  console.log('Sentry initialized');
};

// Helper to manually capture errors
export const captureError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

// Helper to add user context
export const setUserContext = (user: { id: string; email?: string; role?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};