/**
 * Small JavaScript-only motion enhancements. Everything else is CSS (src/styles/motion.css).
 * Without JavaScript, or with reduced motion, the page is simply static.
 */

const motionOK = matchMedia('(prefers-reduced-motion: no-preference)').matches;

/**
 * Key figures count up when they scroll into view. The real value is in the
 * markup (and in a screen-reader-only twin), so nothing depends on this.
 */
function countUp() {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  if (!motionOK || counters.length === 0 || !('IntersectionObserver' in window)) return;

  const format = new Intl.NumberFormat('da-DK');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const final = el.dataset.count!;
        // Split "1.200+" into prefix "", number 1200, suffix "+".
        const match = final.match(/^(\D*)([\d.]+)(.*)$/);
        if (!match) continue;
        const [, prefix, digits, suffix] = match;
        const target = Number(digits.replaceAll('.', ''));
        if (!Number.isFinite(target) || target === 0) continue;

        const duration = 1400;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = t < 1 ? `${prefix}${format.format(Math.round(target * eased))}${suffix}` : final;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.6 },
  );
  counters.forEach((el) => observer.observe(el));
}

/**
 * Cross-document view transition: when leaving a page for a project page,
 * give the matching card photo the same name as the project cover so the
 * browser morphs one into the other.
 */
function sharedProjectPhoto() {
  if (!motionOK || !('onpageswap' in window)) return;
  window.addEventListener('pageswap', (event) => {
    const { viewTransition, activation } = event as PageSwapEvent;
    if (!viewTransition || !activation?.entry?.url) return;
    const target = new URL(activation.entry.url).pathname;
    const link = [...document.querySelectorAll<HTMLAnchorElement>('.project-card a')].find(
      (a) => new URL(a.href).pathname === target,
    );
    const img = link?.closest('.project-card')?.querySelector('img');
    if (!img) return;
    img.style.viewTransitionName = 'project-photo';
    viewTransition.finished.finally(() => (img.style.viewTransitionName = ''));
  });
}

countUp();
sharedProjectPhoto();
