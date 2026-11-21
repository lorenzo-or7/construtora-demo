import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { Img, type ImageKey } from './Img';
import { EASE_ARCH, EASE_OUT, FadeIn, RevealLines } from './Reveal';
import s from './Materials.module.css';

interface Material {
  id: string;
  name: string;
  image: ImageKey;
  alt: string;
  headline: string;
  text: string;
  uses: string;
}

const MATERIALS: Material[] = [
  {
    id: 'concreto',
    name: 'Concreto arquitetônico',
    image: 'mat-concrete',
    alt: 'Superfície de concreto aparente com marcas de ancoragem das fôrmas',
    headline: 'A estrutura que não se esconde.',
    text: 'Moldado em fôrmas planejadas, o concreto aparente guarda as marcas de como foi feito. Paginação, ancoragens e juntas são desenhadas como parte da fachada.',
    uses: 'Empenas, pilares, lajes aparentes',
  },
  {
    id: 'pedra',
    name: 'Pedra natural',
    image: 'mat-stone',
    alt: 'Detalhe de superfície de pedra natural com textura irregular',
    headline: 'Superfícies que guardam o tempo.',
    text: 'Pedras de origem local, com acabamento escolhido para cada uso: rústico onde a mão toca, polido onde a luz reflete. Envelhecem sem perder a dignidade.',
    uses: 'Bases, pisos externos, muros de contenção',
  },
  {
    id: 'madeira',
    name: 'Madeira',
    image: 'mat-wood',
    alt: 'Veio de madeira clara em detalhe',
    headline: 'Calor ao toque, ritmo à fachada.',
    text: 'Madeira de manejo certificado em brises, forros e esquadrias. O desenho prevê ventilação, proteção e manutenção, para que ela dure tanto quanto o edifício.',
    uses: 'Brises, forros, portas e mobiliário fixo',
  },
  {
    id: 'vidro',
    name: 'Vidro e metal',
    image: 'mat-glass',
    alt: 'Estrutura metálica com fechamento em vidro vista de baixo',
    headline: 'Leveza que deixa a luz entrar.',
    text: 'Perfis esbeltos e vidros de alto desempenho permitem grandes vãos com controle térmico. O metal aparece fino e preciso, nunca decorativo.',
    uses: 'Esquadrias, coberturas, guarda-corpos',
  },
];

export function Materials() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const m = MATERIALS[active]!;

  const onKey = (e: KeyboardEvent, i: number) => {
    const map: Record<string, number> = {
      ArrowDown: (i + 1) % MATERIALS.length,
      ArrowRight: (i + 1) % MATERIALS.length,
      ArrowUp: (i - 1 + MATERIALS.length) % MATERIALS.length,
      ArrowLeft: (i - 1 + MATERIALS.length) % MATERIALS.length,
      Home: 0,
      End: MATERIALS.length - 1,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className={s.section} aria-labelledby="materials-title">
      <div className={`container ${s.grid}`}>
        <div className={s.side}>
          <RevealLines id="materials-title" className={s.title} lines={['A diferença vive', 'nos detalhes.']} />
          <FadeIn delay={0.1}>
            <p className={s.intro}>Escolha um material para ver como ele é usado em nossos projetos.</p>
          </FadeIn>

          <div role="tablist" aria-label="Materiais" aria-orientation="vertical" className={s.tabs}>
            {MATERIALS.map((mat, i) => (
              <button
                key={mat.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`mat-tab-${mat.id}`}
                aria-selected={active === i}
                aria-controls="mat-panel"
                tabIndex={active === i ? 0 : -1}
                className={s.tab}
                onClick={() => setActive(i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className={s.tabLine} aria-hidden="true" />
                {mat.name}
              </button>
            ))}
          </div>
        </div>

        <div className={s.stage} role="tabpanel" id="mat-panel" aria-labelledby={`mat-tab-${m.id}`}>
          <div className={s.media}>
            <AnimatePresence initial={false}>
              <motion.div
                key={m.id}
                className={s.mediaItem}
                initial={{ clipPath: 'inset(0% 0% 0% 100%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0.999, transition: { duration: 1 } }}
                transition={{ duration: reduce ? 0 : 1.05, ease: EASE_ARCH }}
              >
                <motion.div
                  style={{ height: '100%' }}
                  initial={{ scale: 1.25, x: '6%' }}
                  animate={{ scale: 1, x: '0%' }}
                  transition={{ duration: reduce ? 0 : 1.6, ease: EASE_OUT }}
                >
                  <Img name={m.image} alt={m.alt} sizes="(min-width: 1024px) 55vw, 100vw" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={s.copy} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={m.id} className={s.copyInner}>
                <h3 className={s.headline}>
                  <span className="line-mask">
                    <motion.span
                      initial={{ y: '105%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '-105%' }}
                      transition={{ duration: reduce ? 0 : 0.6, ease: EASE_ARCH }}
                    >
                      {m.headline}
                    </motion.span>
                  </span>
                </h3>
                <motion.div
                  className={s.details}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.2, duration: 0.6, ease: EASE_OUT } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <p className={s.text}>{m.text}</p>
                  <p className={s.uses}>
                    <span>Onde usamos</span>
                    {m.uses}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
