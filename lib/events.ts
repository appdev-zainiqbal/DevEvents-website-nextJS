'use cache';

import { cacheLife } from 'next/cache';

export async function getEvents() {
  cacheLife('hours'); // cache for ~1 hour

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/events`, {
    next: { revalidate: 3600 }, // server revalidate after 1 hour
  });

  if (!res.ok) {
    console.error('Failed to fetch events');
    return [];
  }

  const data = await res.json();
  return data?.events ?? [];
}
