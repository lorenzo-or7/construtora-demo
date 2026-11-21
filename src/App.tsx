import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Symbol } from './components/Logo';
import { Nav } from './components/Nav';
import { EASE_ARCH } from './components/Reveal';
import Home from './pages/Home';
import s from './App.module.css';

const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const InfoPage = lazy(() => import('./pages/InfoPage'));

/** Rola até a âncora da URL, aguardando a seção existir (rotas e componentes carregados sob demanda). */
function useHashScroll() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const reduce = useReducedMotion();

  useEffect(() => {
    const samePage = prevPath.current === location.pathname;
    prevPath.current = location.pathname;
    if (!location.hash) {
      if (!samePage) window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(location.hash.slice(1));
    let tries = 0;
    let timer = 0;
    let settle = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: samePage && !reduce ? 'smooth' : 'auto', block: 'start' });
        // Seções com altura calculada (percurso horizontal) podem mudar após a medição: reajusta uma vez.
        if (!samePage) settle = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 350);
        return;
      }
      if (tries++ < 60) timer = window.setTimeout(attempt, 50);
    };
    attempt();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(settle);
    };
  }, [location.key, location.hash, location.pathname, reduce]);
}

function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > window.innerHeight * 1.5));
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className={s.toTop}
          aria-label="Voltar ao topo"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            document.querySelector<HTMLElement>('a[aria-label^="ATRIUM"]')?.focus({ preventScroll: true });
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
        >
          <ArrowUp aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const curtain = {
  initial: { scaleY: 1, originY: 0 },
  enter: { scaleY: 0, originY: 0, transition: { duration: 0.85, ease: EASE_ARCH, delay: 0.05 } },
  exit: { scaleY: 1, originY: 1, transition: { duration: 0.6, ease: EASE_ARCH } },
};

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [homeReady, setHomeReady] = useState(false);
  const [skipIntro] = useState(() => !!window.location.hash);
  const onReady = useCallback(() => setHomeReady(true), []);
  const reduce = useReducedMotion();
  useHashScroll();

  const overImage = isHome || location.pathname.startsWith('/empreendimentos/');
  const ready = isHome ? homeReady : true;

  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Nav overImage={overImage} ready={ready} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={location.pathname} initial="initial" animate="enter" exit="exit">
          {!reduce && (
            <motion.div className={s.curtain} variants={curtain} aria-hidden="true">
              <Symbol className={s.curtainSymbol} />
            </motion.div>
          )}
          <main id="conteudo" tabIndex={-1} className={s.main}>
            <Suspense fallback={<div className={s.loading} role="status">Carregando</div>}>
              <Routes location={location}>
                <Route path="/" element={<Home onReady={onReady} skipIntro={skipIntro} />} />
                <Route path="/empreendimentos/:slug" element={<ProjectPage />} />
                <Route path="/privacidade" element={<InfoPage kind="privacidade" />} />
                <Route path="/creditos" element={<InfoPage kind="creditos" />} />
                <Route path="*" element={<InfoPage kind="404" />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </motion.div>
      </AnimatePresence>
      <BackToTop />
    </MotionConfig>
  );
}
