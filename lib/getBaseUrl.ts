export function getBaseUrl() {
    // Server-side on Vercel
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return `https://${process.env.NEXT_PUBLIC_BASE_URL}`;
    }
  
    // Local dev
    return "http://localhost:3000";
  }
  