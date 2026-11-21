import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Expand } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Img } from '../components/Img';
import { EASE_ARCH, EASE_OUT, FadeIn, RevealImage, RevealLines } from '../components/Reveal';
import { getProject, projects, type Project } from '../data/projects';
import s from './ProjectPage.module.css';

const Lightbox = lazy(() => import('../components/Lightbox'));

export default function ProjectPage() {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) document.title = `${project.name} | ATRIUM, protótipo conceitual`;
  }, [project]);

  if (!project) return <Navigate to="/404" replace />;
  return <ProjectView key={project.slug} p={project} />;
}

function ProjectView({ p }: { p: Project }) {
  const next = projects[(projects.indexOf(p) + 1) % projects.length]!;
  return (
    <article className={s.page} aria-labelledby="project-title">
      <ProjectHero p={p} />
      <Concept p={p} />
      <Environments p={p} />
      <Features p={p} />
      <Gallery p={p} />
      <Location p={p} />
      <section className={s.cta} aria-labelledby="project-cta">
        <div className={`container ${s.ctaInner}`}>
          <RevealLines id="project-cta" className={s.ctaTitle} lines={[`Quer conhecer`, `${p.name}?`]} />
          <FadeIn className={s.ctaSide}>
            <p>Deixe seu interesse registrado. O formulário já virá com este empreendimento selecionado.</p>
            <Link to={{ pathname: '/', search: `?empreendimento=${p.slug}`, hash: '#contato' }} className="btn btn--light">
              Falar sobre {p.name}
              <ArrowUpRight aria-hidden />
            </Link>
          </FadeIn>
        </div>
      </section>
      <NextProject p={next} />
    </article>
  );
}

function ProjectHero({ p }: { p: Project }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const words = p.name.split(' ');
  return (
    <header ref={ref} className={s.hero}>
      <motion.div
        className={s.heroFrame}
        initial={reduce ? false : { clipPath: 'inset(12% 8% 12% 8%)' }}
        animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        transition={{ duration: 1.3, ease: EASE_ARCH, delay: 0.15 }}
      >
        <motion.div className={s.heroMedia} style={{ y: reduce ? 0 : y }}>
          <motion.div style={{ height: '100%' }} initial={reduce ? false : { scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE_OUT, delay: 0.15 }}>
            <Img name={p.cover} alt={p.coverAlt} priority sizes="100vw" />
          </motion.div>
        </motion.div>
        <div className={s.heroScrim} aria-hidden="true" />
      </motion.div>

      <div className={`container ${s.heroContent}`}>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}>
          <Link to={{ pathname: '/', hash: '#empreendimentos' }} className={s.back}>
            <ArrowLeft aria-hidden />
            Todos os empreendimentos
          </Link>
        </motion.div>
        <div className={s.heroBottom}>
          <span className={`numeral ${s.heroIndex}`} aria-hidden="true">
            {p.index}
          </span>
          <h1 id="project-title" className={s.heroTitle} aria-label={p.name}>
            {words.map((w, i) => (
              <span key={w} className="line-mask" aria-hidden="true">
                <motion.span
                  initial={reduce ? false : { y: '108%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.75 + i * 0.1, duration: 1.1, ease: EASE_OUT }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.dl
            className={s.heroMeta}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8, ease: EASE_OUT }}
          >
            <div>
              <dt>Categoria</dt>
              <dd>{p.category}</dd>
            </div>
            <div>
              <dt>Localização fictícia</dt>
              <dd>{p.location}</dd>
            </div>
            <div>
              <dt>Status demonstrativo</dt>
              <dd>{p.status}</dd>
            </div>
          </motion.dl>
        </div>
      </div>
    </header>
  );
}

function Concept({ p }: { p: Project }) {
  return (
    <section className={s.concept} aria-labelledby="concept-title">
      <div className={`container ${s.conceptGrid}`}>
        <h2 id="concept-title" className={s.conceptLabel}>
          Conceito arquitetônico
        </h2>
        <RevealLines as="p" className={s.tagline} lines={[p.tagline]} />
        <div className={s.conceptText}>
          {p.conceptLong.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <p>{t}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Environments({ p }: { p: Project }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const env = p.environments[active]!;
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = p.environments.length;
    const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className={s.env} aria-labelledby="env-title">
      <div className="container">
        <div className={s.envHead}>
          <RevealLines id="env-title" className={s.h2} lines={['Explore os', 'ambientes']} />
          <div role="tablist" aria-label="Ambientes" className={s.envTabs}>
            {p.environments.map((e, i) => (
              <button
                key={e.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                type="button"
                id={`env-tab-${e.key}`}
                aria-selected={i === active}
                aria-controls="env-panel"
                tabIndex={i === active ? 0 : -1}
                className={s.envTab}
                onClick={() => setActive(i)}
                onKeyDown={(ev) => onKey(ev, i)}
              >
                {e.label}
                {i === active && <motion.span layoutId={`env-ind-${p.slug}`} className={s.envInd} transition={{ duration: 0.6, ease: EASE_ARCH }} />}
              </button>
            ))}
          </div>
        </div>

        <div className={s.envStage} role="tabpanel" id="env-panel" aria-labelledby={`env-tab-${env.key}`}>
          <div className={s.envMedia}>
            <AnimatePresence initial={false}>
              <motion.div
                key={env.key}
                className={s.envMediaItem}
                initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0.999, transition: { duration: 1 } }}
                transition={{ duration: reduce ? 0 : 1, ease: EASE_ARCH }}
              >
                <motion.div style={{ height: '100%' }} initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: reduce ? 0 : 1.5, ease: EASE_OUT }}>
                  <Img name={env.image} alt={`${env.label}: ${env.title}`} sizes="(min-width: 1024px) 65vw, 100vw" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className={s.envCopy} aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={env.key}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
              >
                <p className={s.envLabel}>{env.label}</p>
                <h3 className={s.envTitle}>{env.title}</h3>
                <p className={s.envText}>{env.text}</p>
              </motion.div>
            </AnimatePresence>
            <p className={`numeral ${s.envCount}`} aria-hidden="true">
              0{active + 1}
              <span> / 0{p.environments.length}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features({ p }: { p: Project }) {
  return (
    <section className={s.features} aria-labelledby="features-title">
      <div className={`container ${s.featuresGrid}`}>
        <div>
          <RevealLines id="features-title" className={s.h2} lines={['Características', 'do projeto']} />
          <p className={s.featuresNote}>Diretrizes conceituais. Não constituem memorial descritivo, metragens ou oferta comercial.</p>
        </div>
        <ul className={s.featureList}>
          {p.features.map((f, i) => (
            <FadeIn as="li" key={f.title} className={s.feature} delay={i * 0.06}>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Gallery({ p }: { p: Project }) {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  return (
    <section className={s.gallery} aria-labelledby="gallery-title">
      <div className="container">
        <div className={s.galleryHead}>
          <RevealLines id="gallery-title" className={s.h2} lines={['Galeria']} />
          <p className={s.galleryHint}>Selecione uma imagem para ver em tela cheia. Navegue com as setas do teclado ou arrastando.</p>
        </div>
        <ul className={s.galleryGrid}>
          {p.gallery.map((g, i) => (
            <li key={g.image} className={s.galleryItem}>
              <button
                type="button"
                className={s.galleryBtn}
                onClick={() => {
                  setMounted(true);
                  setIndex(i);
                }}
                aria-label={`Abrir ${g.caption} em tela cheia, imagem ${i + 1} de ${p.gallery.length}`}
              >
                <RevealImage name={g.image} alt={g.alt} className={s.galleryImg} sizes="(min-width: 768px) 45vw, 100vw" parallax={4} />
                <span className={s.galleryCaption}>
                  {g.caption}
                  <Expand aria-hidden />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {mounted && (
        <Suspense fallback={null}>
          <Lightbox items={p.gallery} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} label={`Galeria de ${p.name}`} />
        </Suspense>
      )}
    </section>
  );
}

function Location({ p }: { p: Project }) {
  const reduce = useReducedMotion();
  return (
    <section className={s.location} aria-labelledby="location-title">
      <div className={`container ${s.locationGrid}`}>
        <div className={s.locationCopy}>
          <RevealLines id="location-title" className={s.h2} lines={['Localização']} />
          <p className={s.locationName}>{p.location}</p>
          <p className={s.locationText}>{p.locationNote}</p>
          <p className={s.locationNote}>Endereço e mapa ilustrativos. O local não existe e não corresponde a um terreno real.</p>
        </div>
        <figure className={s.map}>
          <svg viewBox="0 0 600 420" role="img" aria-label="Mapa ilustrativo e abstrato do entorno, sem correspondência com local real">
            <rect width="600" height="420" className={s.mapBg} />
            <g className={s.mapBlocks}>
              {Array.from({ length: 6 }).map((_, r) =>
                Array.from({ length: 8 }).map((__, c) => (
                  <rect key={`${r}-${c}`} x={18 + c * 72} y={14 + r * 68} width={58} height={54} rx="2" />
                )),
              )}
            </g>
            <path d="M0 300 C 150 260, 260 330, 380 250 S 560 170, 600 190" className={s.mapRiver} />
            <motion.path
              d="M60 400 L60 220 L300 220 L300 150"
              className={s.mapRoute}
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: EASE_ARCH }}
            />
            <g transform="translate(300 150)">
              <motion.circle r="34" className={s.mapPulse} initial={{ scale: 0.4, opacity: 0.6 }} animate={reduce ? undefined : { scale: 1.4, opacity: 0 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
              <rect x="-11" y="-11" width="22" height="22" className={s.mapPin} transform="rotate(45)" />
            </g>
          </svg>
          <figcaption>Mapa ilustrativo</figcaption>
        </figure>
      </div>
    </section>
  );
}

function NextProject({ p }: { p: Project }) {
  return (
    <Link to={`/empreendimentos/${p.slug}`} className={s.next}>
      <span className={s.nextMedia} aria-hidden="true">
        <Img name={p.cover} alt="" sizes="100vw" />
      </span>
      <span className={`container ${s.nextInner}`}>
        <span className={s.nextLabel}>Próximo empreendimento</span>
        <span className={s.nextName}>
          {p.name}
          <ArrowUpRight aria-hidden />
        </span>
      </span>
    </Link>
  );
}
