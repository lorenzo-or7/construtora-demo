import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, type Project } from '../data/projects';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { Img } from './Img';
import { FadeIn, RevealImage, RevealLines } from './Reveal';
import s from './Developments.module.css';

interface Geometry {
  distance: number;
  vw: number;
  offsets: number[];
}

export function Developments() {
  const isDesktop = useIsDesktop();
  return (
    <section id="empreendimentos" className={s.section} aria-labelledby="dev-title">
      {isDesktop ? <HorizontalTrack /> : <VerticalList />}
    </section>
  );
}

function Intro() {
  return (
    <div className={s.intro}>
      <RevealLines id="dev-title" className={s.title} lines={['Empreendimentos', 'selecionados']} />
      <FadeIn delay={0.15}>
        <p className={s.introText}>
          Três projetos conceituais, três formas de habitar. Cada um nasce de um lugar e de uma pergunta diferente.
        </p>
      </FadeIn>
    </div>
  );
}

/* ---------- Desktop: percurso horizontal vinculado à rolagem vertical (sem sequestrar o scroll) ---------- */

function HorizontalTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const [geo, setGeo] = useState<Geometry>({ distance: 0, vw: 1, offsets: [] });
  const [current, setCurrent] = useState(0);
  const reduce = useReducedMotion();
  // O trilho é deslocado por transform, então o lazy loading nativo não enxerga os painéis: carrega quando a seção se aproxima.
  const near = useInView(sectionRef, { once: true, margin: '150% 0px 150% 0px' });

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const vw = window.innerWidth;
      setGeo({
        vw,
        distance: Math.max(0, track.scrollWidth - vw),
        offsets: panelRefs.current.map((p) => p?.offsetLeft ?? 0),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (p) => -p * geo.distance);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const center = p * geo.distance + geo.vw / 2;
    let idx = 0;
    geo.offsets.forEach((o, i) => {
      if (center >= o - geo.vw * 0.1) idx = i;
    });
    setCurrent(idx);
  });

  /** Ao navegar por teclado, alinha a rolagem vertical ao painel que recebeu foco. */
  const focusPanel = (i: number) => {
    const section = sectionRef.current;
    const o = geo.offsets[i];
    if (!section || o === undefined) return;
    const target = Math.min(Math.max(o - geo.vw * 0.08, 0), geo.distance);
    const top = section.getBoundingClientRect().top + window.scrollY + target;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div ref={sectionRef} className={s.pin} style={{ height: `calc(${geo.distance}px + 100vh)` }}>
      <div className={s.sticky}>
        <motion.div ref={trackRef} className={s.track} style={{ x }}>
          <Intro />
          {projects.map((p, i) => (
            <Panel
              key={p.slug}
              project={p}
              progress={scrollYProgress}
              geo={geo}
              index={i}
              panelRef={(el) => {
                panelRefs.current[i] = el;
              }}
              onFocus={() => focusPanel(i)}
              eager={near}
            />
          ))}
          <div className={s.endSpacer} aria-hidden="true" />
        </motion.div>

        <div className={`container ${s.progress}`} aria-hidden="true">
          <span className={`numeral ${s.counter}`}>
            {projects[current]?.index ?? '01'} <span>/ 0{projects.length}</span>
          </span>
          <span className={s.bar}>
            <motion.span style={{ scaleX: bar }} />
          </span>
          <span className={s.hint}>Continue rolando para percorrer os projetos</span>
        </div>
      </div>
    </div>
  );
}

interface PanelProps {
  project: Project;
  progress: MotionValue<number>;
  geo: Geometry;
  index: number;
  panelRef: (el: HTMLElement | null) => void;
  onFocus: () => void;
  eager: boolean;
}

function Panel({ project: p, progress, geo, panelRef, onFocus, eager }: PanelProps & { index: number }) {
  const reduce = useReducedMotion();
  const offset = geo.offsets[projects.indexOf(p)] ?? 0;
  const d = Math.max(geo.distance, 1);
  // Faixa de progresso em que o painel entra pela direita até assentar.
  const start = Math.max((offset - geo.vw) / d, 0);
  const end = Math.max((offset - geo.vw * 0.3) / d, start + 0.001);
  const after = Math.min(end + (geo.vw * 0.9) / d, 1.5);

  const clip = useTransform(progress, [start, end], ['inset(0% 0% 0% 38%)', 'inset(0% 0% 0% 0%)']);
  const scale = useTransform(progress, [start, end, after], [1.3, 1.06, 1]);
  const imgX = useTransform(progress, [start, after], ['-6%', '4%']);
  const textX = useTransform(progress, [start, end], [90, 0]);
  const textO = useTransform(progress, [start, end], [0, 1]);
  const env = p.environments.find((e) => e.key === 'interiores') ?? p.environments[1];

  return (
    <article ref={panelRef} className={s.panel} onFocusCapture={onFocus} aria-labelledby={`dev-${p.slug}`}>
      <Link to={`/empreendimentos/${p.slug}`} className={s.media} tabIndex={-1} aria-hidden="true">
        <motion.div className={s.mediaClip} style={reduce ? undefined : { clipPath: clip }}>
          <motion.div className={s.mediaImg} style={reduce ? undefined : { scale, x: imgX }}>
            <Img name={p.cover} alt="" sizes="60vw" loading={eager ? 'eager' : 'lazy'} />
          </motion.div>
        </motion.div>
        {env && (
          <span className={s.preview}>
            <Img name={env.image} alt="" sizes="20vw" loading={eager ? 'eager' : 'lazy'} />
          </span>
        )}
      </Link>

      <motion.div className={s.info} style={reduce ? undefined : { x: textX, opacity: textO }}>
        <span className={`numeral ${s.index}`}>{p.index}</span>
        <h3 id={`dev-${p.slug}`} className={s.name}>
          {p.name}
        </h3>
        <p className={s.concept}>{p.concept}</p>
        <dl className={s.meta}>
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
        </dl>
        <Link to={`/empreendimentos/${p.slug}`} className="btn">
          Ver {p.name}
          <ArrowUpRight aria-hidden />
        </Link>
      </motion.div>
    </article>
  );
}

/* ---------- Mobile e tablet: sequência vertical editorial ---------- */

function VerticalList() {
  return (
    <div className="container">
      <Intro />
      <div className={s.list}>
        {projects.map((p) => (
          <article key={p.slug} className={s.item} aria-labelledby={`dev-m-${p.slug}`}>
            <Link to={`/empreendimentos/${p.slug}`} tabIndex={-1} aria-hidden="true" className={s.itemMedia}>
              <RevealImage name={p.cover} alt="" className={s.itemImage} sizes="(min-width: 768px) 90vw, 100vw" from="bottom" parallax={6} />
              <span className={`numeral ${s.itemIndex}`}>{p.index}</span>
            </Link>
            <div className={s.itemInfo}>
              <h3 id={`dev-m-${p.slug}`} className={s.name}>
                {p.name}
              </h3>
              <p className={s.itemCategory}>
                {p.category}, {p.status.toLowerCase()}
              </p>
              <p className={s.concept}>{p.concept}</p>
              <p className={s.itemLocation}>Localização fictícia: {p.location}</p>
              <Link to={`/empreendimentos/${p.slug}`} className="btn">
                Ver {p.name}
                <ArrowUpRight aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
