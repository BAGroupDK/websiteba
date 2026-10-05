# BA Group – baaps.dk

Corporate website for BA Group. Repo: `BAGroupDK/websiteba` (public).

## Decisions (settled – do not reopen)

- **Astro, fully static.** No login, no backend, no forms, no cookies, no tracking, no third-party requests. Therefore no cookie banner. Contact is `mailto:`/`tel:` links only.
- **Hosting: GitHub Pages**, deployed by GitHub Actions with the official `actions/deploy-pages`. No secrets anywhere.
- **The repo is public (GitHub Free).** Only approved content may be committed: never drafts, never unconfirmed client (bygherre) names, never photos without documented rights. No LICENSE file; "© BA Group. All rights reserved." in README and footer.
- **`main` is protected by a ruleset:** work in a branch → PR → squash merge. The `build` check (`.github/workflows/ci.yml`) is meant to be a required status check.
- **Git identity is the GitHub noreply address** (set globally). Never commit with any other e-mail; never override `user.email` in this repo.
- **Language:** code, comments, commit messages and docs in English. All visible site text in Danish (`lang="da"`). An English version may come later – keep strings in components/content, not scattered in logic.
- **DanDomain is domain + DNS only** (DNSSEC on, no ALIAS/ANAME). The bundled web hotel/WordPress is not used. DNS changes only after the site is deployed:
  - `baaps.dk` A → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
  - `baaps.dk` AAAA → 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
  - `www` CNAME → `bagroupdk.github.io`
  - GitHub Pages domain verification TXT record
  - CAA: only `letsencrypt.org`
  - Delete the web hotel's old A records
- **Mail:** none yet. Later `info@baaps.dk` forwarding to another mail domain, so DanDomain's MX records must be kept. SPF/DMARC to be tightened later (the domain itself sends no mail).

## Brand

- Source brand package lives in `~/Documents/BAGroup/brand` – **outside the repo on purpose. Never commit the brand manual** (`Brandguide BA.pdf`) or the zip.
- Only what the site uses is copied in: logos (SVG) in `src/assets/brand/`, favicons and share image in `public/`.
- Colours are design tokens in `src/styles/tokens.css`. Use the tokens, never raw hex values in components.
- Red (`--color-accent`) is an accent: logo, buttons, links, the red line. **Never red text on black** (3.6:1 – fails WCAG AA for normal text).
- Logo: primary on light backgrounds, negative on black, white on red/photos. Never redraw, recolour, rotate or stretch it. Clear space = ¼ of logo height; min 24 px high on screen.
- Font: Montserrat (SIL OFL 1.1 – redistribution allowed), self-hosted via the `@fontsource-variable/montserrat` npm package. No requests to Google Fonts. Headings ExtraBold (800), subheadings SemiBold (600), body Regular (400), ≥16 px, line-height ~1.5.

## Content

- Pages: `/` (forside), `/virksomheder/`, `/projekter/` + `/projekter/<slug>/`, `/om-os/`, `/kontakt/`, `/privatlivspolitik/`, `404`.
- Group facts (address, CVR, phone, e-mail, key figures, timeline, management, values): `src/data/site.ts`.
- Companies: content collection `src/content/companies/*.md`.
- Projects: content collection – one folder per project: `src/content/projects/<slug>/index.md` + its photos. Every photo needs `alt` and `credit` (credit documents that we hold the rights).
- `client` (bygherre) is optional – leave it out until the name is cleared for publication.
- Placeholders are marked with the text `Pladsholder` so they are easy to find: `grep -rn Pladsholder src`. Everything must be replaced before DNS points at the site.

## Technical rules

- CSP is a `<meta>` tag in `src/layouts/Base.astro` (GitHub Pages cannot set headers). Keep it strict: no inline scripts or styles, no `style=""` attributes, no external origins. `build.inlineStylesheets: 'never'` and `assetsInlineLimit: 0` exist for this reason.
- Internal links must go through `url()` from `src/lib/url.ts` so the site works both at `bagroupdk.github.io/websiteba/` and at `baaps.dk/`. `SITE` and `BASE` are injected at build time by the deploy workflow from `actions/configure-pages`.
- Accessibility target: WCAG 2.2 AA. Skip link, visible focus, semantic landmarks, `aria-current`, alt text, `prefers-reduced-motion`.
- Keep JavaScript to a minimum. The site must work without JS (the project filter is progressive enhancement).
- Motion lives in `src/styles/motion.css` (+ `src/scripts/motion.ts` for count-up and the card→project photo morph). Rules: everything behind `prefers-reduced-motion: no-preference`; scroll-driven animations inside `@supports (animation-timeline: view())`; animate only `transform`/`opacity`/`translate`; never animate the logo; the red line is the motion signature. Use the motion tokens in `tokens.css`.
- CSS is minified with esbuild, not Lightning CSS: Lightning CSS folds `animation-timeline` into the `animation` shorthand, which browsers reject.
- Actions are pinned to full commit SHAs (with a version comment); Dependabot keeps them current.

## Commands

```bash
npm ci            # install exact lockfile versions
npm run dev       # local dev server
npm run check     # astro check (types + content schemas)
npm run build     # static build to dist/
npm run preview   # serve dist/
```

Node version: see `.nvmrc`.
