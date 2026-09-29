// Which elements animate in on scroll, and with which animation style.
// Shared by Layout.astro (hides them before first paint) and reveal.ts (animates them).
// Order matters: an element gets the first type whose selector matches it.

export const revealTypes = [
  // Hero name: words rise out of a mask.
  { type: 'title', selector: 'main h1' },
  // Section headings: letters cascade in.
  { type: 'heading', selector: 'main h2' },
  // Cards and big blocks: fade up with a slight scale.
  { type: 'block', selector: 'main :is(.card, .card-accent, .job, .marquee, .contact)' },
  // Card titles and names: fade up out of a soft blur.
  { type: 'subheading', selector: 'main :is(h3, .highlight-text, .company, .school, .course-title, .name)' },
  // Small uppercase / monospace labels: slide in from the left.
  { type: 'label', selector: 'main :is(.eyebrow, .status, .mono, .num)' },
  // Pills, tags, avatars and buttons: quick pop.
  { type: 'chip', selector: 'main :is(.chips > *, .contacts > *, .tiles > *, .links a, .avatar, .swatch, .icon, .bars)' },
  // Body copy: gentle rise.
  { type: 'text', selector: 'main :is(p, .job li, .where, .where-strong, .role, .course-where, .level, .location)' },
] as const;

export type RevealType = (typeof revealTypes)[number]['type'];

export const revealSelector = revealTypes.map((t) => t.selector).join(', ');
