'use cache';

import { cacheLife } from 'next/cache';

export async function getEventBySlug(slug: string) {
  cacheLife('hours'); // ~1-hour cache

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/events/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.event ?? null;
}
