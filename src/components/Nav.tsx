import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';
import { trapFocus, useScrollLock } from '../hooks/useScrollLock';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';
import { EASE_ARCH, EASE_OUT } from './Reveal';
import s from './Nav.module.css';

export const NAV_LINKS = [
  { id: 'empreendimentos', label: 'Empreendimentos' },
  { id: 'essencia', label: 'Nossa essência' },
  { id: 'processo', label: 'Processo' },
  { id: 'contato', label: 'Contato' },
] as const;
const IDS = NAV_LINKS.map((l) => l.id);

interface Props {
  overImage: boolean;
  ready: boolean;
}

export function Nav({ overImage, ready }: Props) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(IDS, isHome && ready);
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 48));
  useEffect(() => setScrolled(window.scrollY > 48), [pathname]);
  useScrollLock(open);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        menuBtn.current?.focus();
      }
      trapFocus(e, menuRef.current?.parentElement ?? null);
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => menuRef.current?.querySelector<HTMLElement>('a')?.focus(), 350);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const light = overImage && !scrolled && !open;
  const onToggleTheme = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className={s.root}>
      <motion.header
        className={s.header}
        data-light={light || undefined}
        data-scrolled={scrolled || undefined}
        data-open={open || undefined}
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <div className={s.bar}>
          <Link to="/" className={s.brand} aria-label="ATRIUM, página inicial">
            <Logo className={s.logo} />
          </Link>

          <nav aria-label="Principal" className={s.nav}>
            <ul className={s.links}>
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <Link
                    to={{ pathname: '/', hash: `#${l.id}` }}
                    className={s.link}
                    aria-current={active === l.id ? 'true' : undefined}
                  >
                    {l.label}
                    {active === l.id && (
                      <motion.span layoutId="nav-active" className={s.indicator} transition={{ duration: 0.6, ease: EASE_ARCH }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={s.actions}>
            <button
              type="button"
              className={s.iconBtn}
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{ display: 'grid' }}
                >
                  {theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
                </motion.span>
              </AnimatePresence>
            </button>
            <Link to={{ pathname: '/', hash: '#empreendimentos' }} className={s.cta}>
              Conheça nossos projetos
            </Link>
            <button
              ref={menuBtn}
              type="button"
              className={s.menuBtn}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className={s.menuLabel}>{open ? 'Fechar' : 'Menu'}</span>
              <span className={s.burger} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className={s.overlay}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: reduce ? 0 : 0.75, ease: EASE_ARCH }}
          >
            <nav aria-label="Menu móvel" className={s.overlayNav}>
              <ol>
                {NAV_LINKS.map((l, i) => (
                  <li key={l.id} className="line-mask">
                    <motion.span
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%', transition: { duration: 0.3 } }}
                      transition={{ delay: reduce ? 0 : 0.25 + i * 0.07, duration: 0.8, ease: EASE_OUT }}
                    >
                      <Link
                        to={{ pathname: '/', hash: `#${l.id}` }}
                        onClick={() => setOpen(false)}
                        aria-current={active === l.id ? 'true' : undefined}
                      >
                        <span className={`numeral ${s.overlayNum}`}>0{i + 1}</span>
                        {l.label}
                      </Link>
                    </motion.span>
                  </li>
                ))}
              </ol>
            </nav>
            <motion.div
              className={s.overlayFoot}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <Link to={{ pathname: '/', hash: '#empreendimentos' }} className="btn" onClick={() => setOpen(false)}>
                Conheça nossos projetos
              </Link>
              <p className="meta">ATRIUM é uma marca conceitual criada para demonstração.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
