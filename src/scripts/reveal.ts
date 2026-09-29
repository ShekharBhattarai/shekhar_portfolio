// Scroll-triggered entrance animations for the static Astro sections.
// Uses framer-motion's DOM `animate` (no React needed), which runs on the
// browser's native animation engine where it can.
import { animate } from 'framer-motion/dom';
import { revealTypes, type RevealType } from './reveal-config';

const root = document.documentElement;

// Fast out, soft landing.
const easeOut = [0.16, 1, 0.3, 1] as const;
const easeBack = [0.34, 1.56, 0.64, 1] as const;

/** Delay before each type starts, so text follows the card it sits in. */
const baseDelay: Record<RevealType, number> = {
  title: 0,
  heading: 0,
  block: 0,
  label: 0.06,
  subheading: 0.1,
  text: 0.16,
  chip: 0.18,
};
/** Gap between consecutive elements of the same type entering together. */
const step: Record<RevealType, number> = {
  title: 0,
  heading: 0,
  block: 0.07,
  label: 0.03,
  subheading: 0.05,
  text: 0.035,
  chip: 0.025,
};
const MAX_STAGGER = 0.45;

// ---------- Text splitting ----------

/**
 * Wraps each word (or each character) of a heading in spans so they can be
 * animated individually. Screen readers still get the original text via aria-label.
 */
function split(el: HTMLElement, by: 'word' | 'char'): HTMLElement[] {
  // Line breaks count as spaces in the accessible name.
  const label = [...el.childNodes].map((n) => (n instanceof HTMLBRElement ? ' ' : n.textContent)).join('');
  el.setAttribute('aria-label', label.replace(/\s+/g, ' ').trim());
  const pieces: HTMLElement[] = [];

  const mask = (content: Node | string) => {
    const outer = document.createElement('span');
    outer.className = 'rv-mask';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.className = 'rv-piece';
    inner.style.opacity = '0';
    inner.append(content);
    outer.append(inner);
    pieces.push(inner);
    return outer;
  };

  const out = document.createDocumentFragment();
  for (const node of [...el.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      for (const part of (node.textContent ?? '').split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          out.append(' ');
        } else if (by === 'word') {
          out.append(mask(part));
        } else {
          // Keep letters of one word together so lines only break between words.
          const word = document.createElement('span');
          word.className = 'rv-word';
          for (const ch of part) word.append(mask(ch));
          out.append(word);
        }
      }
    } else if (node instanceof HTMLBRElement) {
      out.append(node);
    } else {
      // Inline elements like the lime "." animate as a single piece.
      out.append(mask(node));
    }
  }
  el.replaceChildren(out);
  return pieces;
}

// ---------- Animations per type ----------

function play(el: HTMLElement, type: RevealType, delay: number) {
  switch (type) {
    case 'title': {
      const words = split(el, 'word');
      el.style.opacity = '1';
      words.forEach((w, i) =>
        animate(
          w,
          { y: ['110%', '0%'], rotate: [7, 0], opacity: [0, 1] },
          { duration: 0.75, ease: easeOut, delay: delay + 0.1 + i * 0.08 },
        ),
      );
      break;
    }
    case 'heading': {
      const chars = split(el, 'char');
      el.style.opacity = '1';
      chars.forEach((c, i) =>
        animate(
          c,
          { y: ['100%', '0%'], opacity: [0, 1] },
          { duration: 0.5, ease: easeOut, delay: delay + Math.min(i * 0.022, 0.4) },
        ),
      );
      break;
    }
    case 'block':
      animate(el, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, { duration: 0.6, ease: easeOut, delay });
      break;
    case 'subheading':
      animate(
        el,
        { opacity: [0, 1], y: [14, 0], filter: ['blur(6px)', 'blur(0px)'] },
        { duration: 0.5, ease: easeOut, delay },
      );
      break;
    case 'label':
      animate(el, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.4, ease: easeOut, delay });
      break;
    case 'chip':
      animate(el, { opacity: [0, 1], scale: [0.82, 1], y: [6, 0] }, { duration: 0.38, ease: easeBack, delay });
      break;
    case 'text':
      animate(el, { opacity: [0, 1], y: [10, 0] }, { duration: 0.5, ease: easeOut, delay });
      break;
  }
}

// ---------- Wiring ----------

if (root.classList.contains('motion')) {
  const typeOf = new Map<Element, RevealType>();
  for (const { type, selector } of revealTypes) {
    for (const el of document.querySelectorAll(selector)) {
      if (!typeOf.has(el)) typeOf.set(el, type);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      // Everything that enters in the same frame is staggered in page order.
      const entering = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

      const count: Partial<Record<RevealType, number>> = {};
      for (const el of entering) {
        observer.unobserve(el);
        const type = typeOf.get(el)!;
        const n = (count[type] = (count[type] ?? -1) + 1);
        play(el, type, baseDelay[type] + Math.min(n * step[type], MAX_STAGGER));
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  typeOf.forEach((_, el) => observer.observe(el));
  root.dataset.revealReady = '';
}
