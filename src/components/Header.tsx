import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import { profile } from '../data/portfolio';
import './Header.css';

const links = [
  { id: 'profile', label: 'Profile' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

// A stiff, lightly damped spring: fast to settle, no wobble.
const spring = { type: 'spring', stiffness: 560, damping: 40, mass: 0.7 } as const;

/** Below this scroll offset the header always shows in full. */
const TOP_ZONE = 120;
/** Ignore scroll jitter smaller than this many pixels. */
const DELTA = 4;

// useLayoutEffect warns during Astro's server render, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [active, setActive] = useState(links[0].id);
  const [spacer, setSpacer] = useState<number | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Scroll down → compact pill. Scroll up (or near the top) → full header.
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const diff = y - (scrollY.getPrevious() ?? 0);
    setElevated(y > 8);
    if (y < TOP_ZONE) setCompact(false);
    else if (diff > DELTA) setCompact(true);
    else if (diff < -DELTA) setCompact(false);
  });
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40 });

  // The header is position:fixed, so reserve its full height in the page flow.
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (!compact && headerRef.current) setSpacer(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [compact]);

  // Track which section is on screen.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // On narrow screens the nav scrolls sideways; keep the active link in view.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>(`[href="#${active}"]`);
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2, behavior: 'smooth' });
  }, [active, compact]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <div className="header-spacer" style={spacer ? { height: spacer } : undefined} />

      <header ref={headerRef} className="site-header">
        <motion.div
          layout
          className="bar"
          data-compact={compact}
          data-elevated={elevated}
          style={{ borderRadius: 32 }}
        >
          <motion.a layout href="#profile" className="logo" aria-label={`${profile.firstName} ${profile.lastName} — back to top`}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={compact ? 'S' : 's'}
                className="logo-initial"
                initial={{ y: compact ? 14 : -14, opacity: 0, rotate: compact ? 12 : -12 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: compact ? -14 : 14, opacity: 0 }}
              >
                {compact ? 'S' : 's'}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="logo-rest"
              initial={false}
              animate={{ width: compact ? 0 : 'auto', opacity: compact ? 0 : 1 }}
            >
              hekhar
            </motion.span>
            <span className="logo-dot">.</span>
          </motion.a>

          <motion.nav layout ref={navRef} className="nav" aria-label="Sections">
            {links.map(({ id, label }) => (
              <motion.a
                layout
                key={id}
                href={`#${id}`}
                className="nav-link"
                data-active={active === id}
                aria-current={active === id ? 'true' : undefined}
                whileTap={{ scale: 0.94 }}
              >
                {active === id && <motion.span layoutId="nav-active" className="nav-active" />}
                <span className="nav-label">{label}</span>
              </motion.a>
            ))}
          </motion.nav>

          <motion.div layout className="actions">
            <motion.button
              layout
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle colour theme"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span layout className="moon" aria-hidden="true" />
              <motion.span
                className="toggle-label"
                initial={false}
                animate={{ width: compact ? 0 : 'auto', opacity: compact ? 0 : 1 }}
              >
                {/* Both labels render; CSS shows the one for the current theme. */}
                <span className="to-light">Light mode</span>
                <span className="to-dark">Dark mode</span>
              </motion.span>
            </motion.button>
            <motion.a layout href={profile.cv} className="cv" download whileTap={{ scale: 0.94 }}>
              CV ↓
            </motion.a>
          </motion.div>

          <motion.span layout className="progress-track" aria-hidden="true">
            <motion.span className="progress-fill" style={{ scaleX: progress }} />
          </motion.span>
        </motion.div>
      </header>
    </MotionConfig>
  );
}
