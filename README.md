# websiteba

Website for BA – [baaps.dk](https://baaps.dk).

Static site built with [Astro](https://astro.build), hosted on GitHub Pages and deployed by GitHub Actions on every merge to `main`. No cookies, no tracking, no backend.

## Development

```bash
npm ci
npm run dev      # http://localhost:4321
npm run check    # types + content schemas
npm run build    # static output in dist/
```

Node version: see `.nvmrc`.

## Content

The texts, pictures and page layout are written in the shared mockup and exported to `src/site/` (see `CLAUDE.md`). Media are in `public/media/`; every file and its credit is listed in `MEDIA.md`.

Only approved content goes in this repository – it is public.

## Workflow

`main` is protected: create a branch, open a pull request, wait for the `build` check, squash merge. See `CLAUDE.md` for decisions and conventions.

---

© BA. All rights reserved.
