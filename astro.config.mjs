// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE and BASE are injected by the deploy workflow from actions/configure-pages,
// so the same build works at bagroupdk.github.io/websiteba/ (before DNS) and
// at baaps.dk/ (after the custom domain is set). Locally they default to baaps.dk.
const site = process.env.SITE ?? 'https://baaps.dk';
const base = process.env.BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Keep every stylesheet external so the CSP needs no inline allowances.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // Never turn assets (fonts, images, scripts) into data: URIs.
      assetsInlineLimit: 0,
    },
  },
  security: {
    // Astro emits the CSP as a <meta http-equiv> tag (GitHub Pages cannot set
    // headers) and adds hashes for anything it inlines itself.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  integrations: [sitemap()],
});
