'use cache';

import { cacheLife } from 'next/cache';
import { getBaseUrl } from './getBaseUrl';

export async function getEvents() {
  cacheLife('hours'); // cache for ~1 hour

  const baseUrl = getBaseUrl();
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
