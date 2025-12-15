'use cache';

import { cacheLife } from 'next/cache';
import { getBaseUrl } from './getBaseUrl';

export async function getEventBySlug(slug: string) {
  cacheLife('hours'); // ~1-hour cache

  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/events/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.event ?? null;
}
