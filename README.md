# websiteba

Website for BA Group – [baaps.dk](https://baaps.dk).

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

- Group facts (address, CVR, phone, key figures, timeline, management, values): `src/data/site.ts`
- Companies: `src/content/companies/<id>.md`
- Projects: `src/content/projects/<slug>/index.md` + photos in the same folder. Every photo needs `alt` and `credit`.

Only approved content goes in this repository – it is public. Placeholders are marked `Pladsholder` (`grep -rn Pladsholder src`).

## Workflow

`main` is protected: create a branch, open a pull request, wait for the `build` check, squash merge. See `CLAUDE.md` for decisions and conventions.

---

© BA Group. All rights reserved.
