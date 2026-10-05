/**
 * Prefix an internal path with the configured base, so links work both at
 * bagroupdk.github.io/websiteba/ and at baaps.dk/.
 * `url('/projekter/')` → `/websiteba/projekter/` or `/projekter/`.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Absolute URL (for Open Graph, canonical, sitemap-like uses). */
export function absoluteUrl(path = '/'): string {
  return new URL(url(path), import.meta.env.SITE).href;
}
