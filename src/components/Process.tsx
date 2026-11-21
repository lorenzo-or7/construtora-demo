import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { Img, type ImageKey } from './Img';
import { EASE_ARCH, EASE_OUT, FadeIn, RevealImage, RevealLines } from './Reveal';
import s from './Process.module.css';

interface Step {
  n: string;
  name: string;
  title: string;
  text: string;
  image: ImageKey;
  alt: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    name: 'Visão',
    title: 'Ouvir antes de desenhar.',
    text: 'Tudo começa pelo lugar e pelas pessoas. Estudamos o terreno, o entorno, a luz e as expectativas de quem vai habitar antes do primeiro croqui.',
    image: 'proc-vision',
    alt: 'Lápis apoiado sobre desenho técnico com cotas',
  },
  {
    n: '02',
    name: 'Planejamento',
    title: 'Engenharia desde o primeiro traço.',
    text: 'Arquitetura, estrutura e instalações são compatibilizadas antes da obra. Cronograma e orçamento nascem do mesmo modelo, com decisões registradas.',
    image: 'proc-planning',
    alt: 'Pranchas de projeto arquitetônico com instrumentos de desenho',
  },
  {
    n: '03',
    name: 'Execução',
    title: 'Obra limpa, rastreável e precisa.',
    text: 'Cada etapa passa por controle de qualidade e é documentada. O cliente acompanha a evolução com relatórios periódicos e visitas guiadas.',
    image: 'proc-execution',
    alt: 'Estrutura metálica de edifício em construção com guindastes',
  },
  {
    n: '04',
    name: 'Entrega',
    title: 'O começo da permanência.',
    text: 'Vistoria detalhada, manual de uso e manutenção e acompanhamento depois das chaves. Um edifício bem entregue continua sendo cuidado.',
    image: 'proc-delivery',
    alt: 'Edifício branco de linhas curvas visto de baixo contra o céu claro',
  },
];

export function Process() {
  const isDesktop = useIsDesktop();
  return (
    <section id="processo" className={s.section} aria-labelledby="process-title">
      {isDesktop ? <PinnedTimeline /> : <VerticalTimeline />}
    </section>
  );
}

function Header() {
  return (
    <header className={s.header}>
      <RevealLines id="process-title" className={s.title} lines={['Cada detalhe', 'tem um propósito.']} />
      <FadeIn delay={0.1}>
        <p className={s.lede}>Quatro etapas, um mesmo cuidado. Do estudo do terreno à vida no edifício entregue.</p>
      </FadeIn>
    </header>
  );
}

function PinnedTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const fill = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))));
  });

  /** Clique/teclado: leva a rolagem ao trecho correspondente da etapa, mantendo scroll e estado em sincronia. */
  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + range * ((i + 0.5) / STEPS.length);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    setActive(i);
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % STEPS.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + STEPS.length) % STEPS.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = STEPS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    tabs.current[next]?.focus();
    goTo(next);
  };

  const step = STEPS[active]!;

  return (
    <div ref={ref} className={s.pin}>
      <div className={s.sticky}>
        <div className={`container ${s.stage}`}>
          <Header />

          <div className={s.panel} role="tabpanel" id="process-panel" aria-labelledby={`process-tab-${active}`}>
            <div className={s.media}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={step.image}
                  className={s.mediaItem}
                  initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0.999, transition: { duration: 0.9 } }}
                  transition={{ duration: reduce ? 0 : 0.95, ease: EASE_ARCH }}
                >
                  <motion.div
                    style={{ height: '100%' }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: reduce ? 0 : 1.4, ease: EASE_OUT }}
                  >
                    <Img name={step.image} alt={step.alt} sizes="40vw" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={s.copy}>
              <div className={`numeral ${s.bigNum}`} aria-hidden="true">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={step.n}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.7, ease: EASE_ARCH }}
                  >
                    {step.n}
                  </motion.span>
                </AnimatePresence>
              </div>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={step.n}
                  className={s.copyText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
                  aria-live="polite"
                >
                  <h3 className={s.stepTitle}>{step.title}</h3>
                  <p className={s.stepText}>{step.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className={s.timeline}>
            <div className={s.line} aria-hidden="true">
              <motion.span style={{ scaleX: fill }} />
            </div>
            <div role="tablist" aria-label="Etapas do processo" className={s.nodes}>
              {STEPS.map((st, i) => (
                <button
                  key={st.n}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  id={`process-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={active === i}
                  aria-controls="process-panel"
                  tabIndex={active === i ? 0 : -1}
                  className={s.node}
                  data-active={active === i || undefined}
                  data-done={i < active || undefined}
                  onClick={() => goTo(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className={s.dot} aria-hidden="true" />
                  <span className={`numeral ${s.nodeNum}`}>{st.n}</span>
                  <span className={s.nodeName}>{st.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerticalTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (p) => setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))));

  return (
    <div className={`container ${s.vertical}`}>
      <Header />
      <ol ref={ref} className={s.vList}>
        <li className={s.vLine} aria-hidden="true">
          <motion.span style={{ scaleY: scrollYProgress }} />
        </li>
        {STEPS.map((st, i) => (
          <li key={st.n} className={s.vItem} data-active={i <= active || undefined} aria-current={i === active ? 'step' : undefined}>
            <span className={s.vDot} aria-hidden="true" />
            <div className={s.vHead}>
              <span className={`numeral ${s.vNum}`}>{st.n}</span>
              <span className={s.vName}>{st.name}</span>
            </div>
            <h3 className={s.stepTitle}>{st.title}</h3>
            <p className={s.stepText}>{st.text}</p>
            <RevealImage name={st.image} alt={st.alt} className={s.vImage} sizes="90vw" parallax={5} />
          </li>
        ))}
      </ol>
    </div>
  );
}
