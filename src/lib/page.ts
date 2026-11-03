import { url } from './url';

/**
 * The page HTML in src/site/ uses root-relative links and media (`/projekter/`, `/media/…`).
 * Give them the configured base, so the site works at bagroupdk.github.io/websiteba/ and at baaps.dk/.
 */
export function withBase(html: string): string {
  return html.replace(/\b(href|src|poster)="\/(?!\/)/g, (_, attr: string) => `${attr}="${url('/')}`);
}

/** The header with the current section marked (project pages belong to "Projekter"). */
export function header(html: string, path: string): string {
  const section = path.startsWith('/projekter/') ? '/projekter/' : path;
  const out = withBase(html);
  if (section === '/') return out;
  const href = `href="${url(section)}"`;
  return out.replace(new RegExp(`(<ul class="header__nav"[\\s\\S]*?<a ${href})`), '$1 aria-current="page"');
}

/** A meta description of at most ~155 characters, cut at a word. */
export function shorten(text: string, max = 155): string {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max - 1))} …`;
}
