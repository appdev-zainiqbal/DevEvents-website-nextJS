import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest', // Use Next.js rewrite proxy to avoid CORS issues
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30',
  // Handle blocked requests gracefully
  loaded: (posthog) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PostHog loaded');
    }
  },
 });
