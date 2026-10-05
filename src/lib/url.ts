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
