# BA – baaps.dk

Corporate website for BA. Repo: `BAGroupDK/websiteba` (public).

## Decisions (settled – do not reopen)

- **Astro, fully static.** No login, no backend, no cookies, no tracking, no third-party requests. Therefore no cookie banner. Contact is `mailto:`/`tel:` links plus one contact form that only opens the visitor's own mail program (`src/scripts/site.ts`); nothing is sent or stored by the site, and the CSP keeps `form-action 'none'`.
- **Hosting: GitHub Pages**, deployed by GitHub Actions with the official `actions/deploy-pages`. No secrets anywhere.
- **The repo is public (GitHub Free).** Only approved content may be committed: never drafts, never unconfirmed client (bygherre) names, never photos without documented rights. No LICENSE file; "© BA. All rights reserved." in README, "© 2026 BA. Alle rettigheder forbeholdes." in the footer.
- **`main` is protected by a ruleset:** work in a branch → PR → squash merge. The `build` check (`.github/workflows/ci.yml`) is meant to be a required status check.
- **Git identity is the GitHub noreply address** (set globally). Never commit with any other e-mail; never override `user.email` in this repo.
- **Name: "BA"** everywhere on the site (decided 2026-11-03; replaces "BA Group"). The legal name "BA Group Holding ApS" is only used next to address and CVR. Departments are "BA Brolægning", "BA Mandskab", "BA Anlæg", "BA Beton", "BA Service", "BA Tømrer".
- **Language:** code, comments, commit messages and docs in English. All visible site text in Danish (`lang="da"`).
- **DanDomain is domain + DNS only** (DNSSEC on, no ALIAS/ANAME). The bundled web hotel/WordPress is not used. DNS changes only after the site is deployed:
  - `baaps.dk` A → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - `baaps.dk` AAAA → 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
  - `www` CNAME → `bagroupdk.github.io`
  - GitHub Pages domain verification TXT record
  - CAA: only `letsencrypt.org`
  - Delete the web hotel's old A records
- **Mail:** all contact goes to `info@ba-bro.dk` for now (decided 2026-11-03). DanDomain's MX records for baaps.dk must be kept.

## How content is made

- **The texts, pictures and page layout are written in the shared mockup** (a claude.ai artifact where Mikkel, Sune and Martin edit the pages directly). The mockup stores each page as HTML.
- `src/site/*.html` is that HTML, exported by `export_site.py` (kept outside the repo in `~/Documents/BAGroup/.mockup-src/`, with the mockup's sources). `src/site/pages.json` holds each page's path, title, description and theme. **Edit the mockup and re-export rather than hand-editing `src/site/`**, or the next export overwrites the change.
- The export turns mockup links into root-relative paths and uploaded files into `public/media/…`; `src/lib/page.ts` adds the base path at build time. One route file, `src/pages/[...path].astro`, renders every page.
- Routes: `/`, `/afdelinger/`, `/byvaro/`, `/projekter/` + `/projekter/<slug>/`, `/om-os/`, `/job/`, `/kontakt/`, `/privatlivspolitik/`, `404`.
- **Media:** `public/media/` (photos pre-compressed to ~1400–1600 px JPEG, the hero clip as a silent H.264 MP4). Every file and its credit is listed in `MEDIA.md` – add a line for each new file.

## Brand

- Source brand package lives in `~/Documents/BAGroup/brand` – **outside the repo on purpose. Never commit the brand manual** (`Brandguide BA.pdf`) or the zip.
- Logos (SVG) in `public/media/brand/`, favicons and share image in `public/`. Logo: primary on light backgrounds, negative on black and on the Byvaro blue, white on red/photos. Never redraw, recolour, rotate or stretch it.
- Colours are design tokens (`--ba-*`, `--color-*`) defined at the top of `src/styles/site.css`. Use the tokens, never raw hex values.
- Red (`--color-accent`) is an accent: logo, buttons, links, the red line. **Never red text on black** (3.6:1 – fails WCAG AA for normal text).
- Company names are set as text in Montserrat, never locked up with the logo.
- Paving texture (`--texture-paving`, `src/assets/patterns/bueforbandt.svg`) is applied automatically to `.section--inverse`. The pattern is **bueforbandt** (decided).
- Font: Montserrat (SIL OFL 1.1), self-hosted via `@fontsource-variable/montserrat`. No requests to Google Fonts.

## Technical rules

- CSP is a `<meta>` tag generated from `astro.config.mjs` (GitHub Pages cannot set headers). Keep it strict: no inline scripts or styles, no `style=""` attributes, no `data:` URIs, no external origins. The export refuses `style=""` and `data:` images. `build.inlineStylesheets: 'never'` and `assetsInlineLimit: 0` exist for this reason.
- Links and media in `src/site/` are root-relative; `withBase()` in `src/lib/page.ts` prefixes them, so the site works both at `bagroupdk.github.io/websiteba/` and at `baaps.dk/`. Hand-written links go through `url()` from `src/lib/url.ts`.
- Styles: `src/styles/site.css` (base styles exported from the mockup build) and `src/styles/extras.css` (picture slots, project pages, hero video, carousel, lightbox, reveal and hover motion).
- JavaScript: `src/scripts/site.ts` only – the mobile menu, reveal on scroll, count-up, the forside carousel, the lightbox, the project filter and the contact form.
- Responsive: check every page at 320, 375, 768 and 1024 px for horizontal overflow. Below 48rem the header links fold behind a "Menu" button; phone rules are at the end of `extras.css`. The site must work without JS: every project and photo is in the markup.
- Motion: everything behind `prefers-reduced-motion: no-preference`; animate only `transform`/`opacity`/`translate`/`scale`; never animate the logo. The hero video stays still for reduced motion. The in-app test browser is often hidden and renders no frames – use `scrollTo({behavior: "instant"})` and take a screenshot to force a frame.
- CSS is minified with esbuild, not Lightning CSS: Lightning CSS folds `animation-timeline` into the `animation` shorthand, which browsers reject.
- Accessibility target: WCAG 2.2 AA. Skip link, visible focus, semantic landmarks, `aria-current`, `prefers-reduced-motion`.
- Actions are pinned to full commit SHAs (with a version comment); Dependabot keeps them current.

## Commands

```bash
npm ci            # install exact lockfile versions
npm run dev       # local dev server
npm run check     # astro check
npm run build     # static build to dist/
npm run preview   # serve dist/
```

Node version: see `.nvmrc`.
