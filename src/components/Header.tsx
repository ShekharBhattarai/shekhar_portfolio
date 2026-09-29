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
/** At or below this width the nav collapses into the hamburger menu (matches Header.css). */
const MOBILE_QUERY = '(max-width: 600px)';

// useLayoutEffect warns during Astro's server render, so fall back to useEffect there.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [active, setActive] = useState(links[0].id);
  const [spacer, setSpacer] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll down → compact pill. Scroll up (or near the top) → full header.
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const diff = y - (scrollY.getPrevious() ?? 0);
    setElevated(y > 8);
    if (y < TOP_ZONE || menuOpen) setCompact(false);
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

  // Mobile menu: close on Escape (returning focus to the button) or when the screen widens.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = () => !mq.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-backdrop"
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <header ref={headerRef} className="site-header">
        <motion.div
          layout
          className="bar"
          data-compact={compact}
          data-elevated={elevated}
          data-open={menuOpen}
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
            <motion.button
              layout
              ref={menuButtonRef}
              type="button"
              className="menu-button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              whileTap={{ scale: 0.9 }}
            >
              {/* Three lines that fold into an X. */}
              <motion.span className="menu-line" initial={false} animate={menuOpen ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }} />
              <motion.span className="menu-line" initial={false} animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0.2 : 1 }} />
              <motion.span className="menu-line" initial={false} animate={menuOpen ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }} />
            </motion.button>
          </motion.div>

          <motion.span layout className="progress-track" aria-hidden="true">
            <motion.span className="progress-fill" style={{ scaleX: progress }} />
          </motion.span>
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-menu"
              className="mobile-menu"
              aria-label="Sections"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            >
              <ul className="mobile-links">
                {links.map(({ id, label }, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0, transition: { ...spring, delay: 0.04 + i * 0.035 } }}
                  >
                    <a
                      href={`#${id}`}
                      className="mobile-link"
                      data-active={active === id}
                      aria-current={active === id ? 'true' : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mobile-index">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mobile-label">{label}</span>
                      <span className="mobile-arrow" aria-hidden="true">→</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.a
                href={profile.cv}
                className="mobile-cv"
                download
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { ...spring, delay: 0.04 + links.length * 0.035 } }}
              >
                Download CV ↓
              </motion.a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </MotionConfig>
  );
}
