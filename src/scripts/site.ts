/**
 * The site's small enhancements. The pages work without them: every project, photo and text is in the markup.
 * - things glide in as they scroll into view, key figures count up
 * - the forside's featured projects become a carousel
 * - project photos open large in a lightbox
 * - the project filter and the contact form (which opens the visitor's mail program)
 */

const root = document.documentElement;
root.classList.add('js');
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

function make<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function button(cls: string, text: string, label: string): HTMLButtonElement {
  const b = make('button', cls, text);
  b.type = 'button';
  b.setAttribute('aria-label', label);
  return b;
}

// --- Reveal on scroll and count-up -----------------------------------------------------------------
const REVEAL = '.grid > *, .figures__item, .history__list li, .facts, .prose, .project-gallery > *, .company__inner, .history-timeline__content, .featured-carousel, .section-head, .people-group__title, .open';

function motion() {
  if (calm || !('IntersectionObserver' in window)) return;
  root.classList.add('js-motion');
  let heard = false;
  const seen = new IntersectionObserver((entries) => {
    heard = true;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target as HTMLElement;
      el.dataset.reveal = 'in';
      seen.unobserve(el);
      el.querySelectorAll<HTMLElement>('[data-to]').forEach(countUp);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  for (const c of document.querySelectorAll<HTMLElement>('.figures__item dd > [aria-hidden="true"], [data-count-up]')) {
    const to = norm(c.dataset.countUp || c.textContent || '');
    if (!/^\d+$/.test(to)) continue;
    c.dataset.to = to;
    const n = Number(to);
    c.textContent = String(n > 1900 ? n - 25 : 0);
  }
  for (const el of document.querySelectorAll<HTMLElement>(REVEAL)) {
    const i = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
    el.dataset.reveal = String(Math.min(i, 5));
    seen.observe(el);
  }
  // If the browser never reports what is on screen, show everything rather than leave it hidden.
  setTimeout(() => {
    if (heard) return;
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => { el.dataset.reveal = 'in'; });
    document.querySelectorAll<HTMLElement>('[data-to]').forEach((c) => { c.textContent = c.dataset.to!; delete c.dataset.to; });
  }, 3000);
}

function countUp(c: HTMLElement) {
  const to = Number(c.dataset.to), from = Number(c.textContent) || 0, t0 = Date.now(), ms = 1600;
  const timer = setInterval(() => {
    const k = Math.min(1, (Date.now() - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    c.textContent = String(Math.round(from + (to - from) * e));
    if (k === 1) { delete c.dataset.to; clearInterval(timer); }
  }, 30);
}

// --- Featured projects carousel ---------------------------------------------------------------------
function carousel() {
  for (const car of document.querySelectorAll<HTMLElement>('.featured-carousel')) {
    const slides = [...(car.querySelector('.featured-carousel__track')?.children || [])] as HTMLElement[];
    if (slides.length < 2) continue;
    car.dataset.live = '';
    let at = 0;
    let timer = 0;
    const nav = make('div', 'featured-carousel__nav');
    const prev = button('featured-carousel__arrow', '‹', 'Forrige projekt');
    const next = button('featured-carousel__arrow', '›', 'Næste projekt');
    const dots = make('div', 'featured-carousel__dots');
    const count = make('span', 'featured-carousel__count');
    const show = (i: number) => {
      at = (i + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === at;
        if (on) s.dataset.on = ''; else delete s.dataset.on;
        s.setAttribute('aria-hidden', String(!on));
        s.inert = !on;
      });
      dotBtns.forEach((d, k) => d.setAttribute('aria-current', k === at ? 'true' : 'false'));
      count.textContent = `${at + 1} / ${slides.length}`;
    };
    const restart = () => {
      clearInterval(timer);
      if (calm) return;
      timer = window.setInterval(() => {
        if (!car.matches(':hover, :focus-within') && document.visibilityState === 'visible') show(at + 1);
      }, 7000);
    };
    const dotBtns = slides.map((s, i) => {
      const d = button('featured-carousel__dot', '', `Vis ${norm(s.querySelector('h3')?.textContent || `projekt ${i + 1}`)}`);
      d.addEventListener('click', () => { show(i); restart(); });
      dots.append(d);
      return d;
    });
    prev.addEventListener('click', () => { show(at - 1); restart(); });
    next.addEventListener('click', () => { show(at + 1); restart(); });
    let x0: number | null = null;
    car.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    car.addEventListener('pointerup', (e) => {
      if (x0 == null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) { show(at + (dx < 0 ? 1 : -1)); restart(); }
    });
    nav.append(prev, dots, next, count);
    car.append(nav);
    show(0);
    restart();
  }
}

// --- Lightbox for project photos --------------------------------------------------------------------
function lightbox() {
  const pics = [...document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
    'main .project__cover > .media-fill, main .project-gallery .media-fill, main .media-figure img, main .media-figure video')];
  if (!pics.length) return;
  const box = make('div', 'lightbox');
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Billede');
  const stage = make('div', 'lightbox__stage');
  const prev = button('lightbox__nav lightbox__nav--prev', '‹', 'Forrige billede');
  const next = button('lightbox__nav lightbox__nav--next', '›', 'Næste billede');
  const close = button('lightbox__close', '✕', 'Luk');
  box.append(stage, prev, next, close);
  document.body.append(box);
  let at = 0;
  let opener: HTMLElement | null = null;
  const show = (i: number) => {
    at = (i + pics.length) % pics.length;
    const src = pics[at];
    const m = document.createElement(src.tagName === 'VIDEO' ? 'video' : 'img');
    m.src = src.getAttribute('src') || '';
    if (m instanceof HTMLVideoElement) { m.controls = true; m.autoplay = true; m.playsInline = true; }
    else m.alt = (src as HTMLImageElement).alt || '';
    stage.replaceChildren(m);
    prev.hidden = next.hidden = pics.length < 2;
  };
  const shut = () => { box.hidden = true; stage.replaceChildren(); opener?.focus(); };
  pics.forEach((p, i) => {
    const holder = (p.closest('.project__cover, .project__plate') || p) as HTMLElement;
    holder.addEventListener('click', () => { opener = holder; box.hidden = false; show(i); close.focus(); });
  });
  prev.addEventListener('click', () => show(at - 1));
  next.addEventListener('click', () => show(at + 1));
  close.addEventListener('click', shut);
  box.addEventListener('click', (e) => { if (e.target === box || e.target === stage) shut(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') shut();
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
}

// --- Project filter ------------------------------------------------------------------------------
function filter() {
  const box = document.querySelector<HTMLElement>('[data-filters]');
  const select = box?.querySelector<HTMLSelectElement>('[data-filter]');
  if (!box || !select) return;
  box.hidden = false;
  const status = document.querySelector<HTMLElement>('[data-status]');
  const empty = document.querySelector<HTMLElement>('[data-empty]');
  const run = () => {
    let n = 0;
    for (const card of document.querySelectorAll<HTMLElement>('[data-projects] > *')) {
      const ok = !select.value || (card.dataset.companies || '').split(' ').includes(select.value);
      card.hidden = !ok;
      if (ok) n++;
    }
    if (empty) empty.hidden = n > 0;
    if (status) status.textContent = `Viser ${n} ${n === 1 ? 'projekt' : 'projekter'}`;
  };
  select.addEventListener('change', run);
  run();
}

// --- Contact form: opens the visitor's mail program with the message filled in ----------------------
function contactForm() {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const error = form.querySelector<HTMLElement>('[data-form-error]');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const get = (name: string) => norm((form.elements.namedItem(name) as HTMLInputElement | null)?.value || '');
    const name = get('name'), message = (form.elements.namedItem('message') as HTMLTextAreaElement | null)?.value.trim() || '';
    if (!name || !message) { if (error) error.hidden = false; return; }
    if (error) error.hidden = true;
    const dept = get('dept');
    const lines = [message, '', `Navn: ${name}`];
    if (get('company')) lines.push(`Virksomhed: ${get('company')}`);
    if (get('phone')) lines.push(`Telefon: ${get('phone')}`);
    const subject = `Henvendelse${dept ? ` – ${dept}` : ''} fra ${name}`;
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}

// --- Hero video: still for people who ask for less motion -------------------------------------------
function heroVideo() {
  for (const v of document.querySelectorAll<HTMLVideoElement>('.hero__media > video')) {
    if (calm) { v.removeAttribute('autoplay'); v.pause(); }
  }
}

// --- Mobile menu: the header links fold behind a button on small screens ----------------------
function menu() {
  const header = document.querySelector<HTMLElement>('#site > .header');
  const nav = header?.querySelector<HTMLElement>('nav');
  if (!header || !nav) return;
  nav.id ||= 'hovedmenu';
  const toggle = make('button', 'menu-toggle');
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', nav.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.append(make('span', 'menu-toggle__label', 'Menu'), make('span', 'menu-toggle__bars'));
  toggle.querySelector('.menu-toggle__bars')!.setAttribute('aria-hidden', 'true');
  nav.before(toggle);
  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (open) nav.dataset.open = ''; else delete nav.dataset.open;
  };
  toggle.addEventListener('click', () => set(!('open' in nav.dataset)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && 'open' in nav.dataset) { set(false); toggle.focus(); } });
  document.addEventListener('click', (e) => { if (!header.contains(e.target as Node)) set(false); });
}

// --- BYVARO page: loops play only on screen, the status flow steps along, the contact button follows --
function byvaro() {
  const anims = [...document.querySelectorAll<HTMLElement>('[data-byv-anim="hero"], [data-byv-anim="flow"]')];
  const flow = document.querySelector<HTMLElement>('[data-byv-anim="flow"]');
  const sticky = document.querySelector<HTMLElement>('.byv-sticky');
  if (!('IntersectionObserver' in window)) return;
  const moving = root.classList.contains('js-motion');

  if (moving && anims.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) el.dataset.playing = ''; else delete el.dataset.playing;
      }
    }, { threshold: 0.2 });
    anims.forEach((a) => io.observe(a));
  }

  if (moving && flow) {
    const steps = [...flow.children] as HTMLElement[];
    flow.dataset.live = '';
    let n = 0;
    const paint = () => {
      flow.dataset.step = String(n);
      steps.forEach((li, i) => {
        if (i < n) li.dataset.on = ''; else delete li.dataset.on;
        if (i === n - 1) li.dataset.current = ''; else delete li.dataset.current;
      });
    };
    paint();
    setInterval(() => {
      if (!('playing' in flow.dataset) || document.visibilityState !== 'visible') return;
      n = n >= steps.length + 2 ? 0 : n + 1; // hold the full line for a moment, then start over
      paint();
    }, 900);
  }

  // The contact button hides while another way to get in touch is already on screen.
  if (sticky) {
    const watch = [...document.querySelectorAll<HTMLElement>('.byv-hero, .byv-end, #site > .footer')];
    const shown = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) shown.add(e.target); else shown.delete(e.target); }
      if (shown.size) sticky.dataset.hidden = ''; else delete sticky.dataset.hidden;
    });
    watch.forEach((w) => io.observe(w));
  }
}

menu();
heroVideo();
motion();
carousel();
lightbox();
filter();
contactForm();
byvaro();
