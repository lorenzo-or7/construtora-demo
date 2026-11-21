import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { FadeIn, RevealImage, RevealLines } from './Reveal';
import s from './Manifesto.module.css';

const STATS = [
  { value: 25, suffix: '+', label: 'anos de visão' },
  { value: 18, suffix: '', label: 'projetos concebidos' },
  { value: 420, suffix: '+', label: 'espaços transformados' },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const ctrl = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => setV(Math.round(n)) });
    return () => ctrl.stop();
  }, [inView, reduce, to]);
  return (
    <span ref={ref} aria-hidden="true">
      {v}
      {suffix}
    </span>
  );
}

export function Manifesto() {
  return (
    <section id="essencia" className={s.section} aria-labelledby="manifesto-title">
      <div className={`container ${s.grid}`}>
        <RevealLines id="manifesto-title" className={s.title} lines={['Construir é', 'transformar', 'o amanhã.']} />

        <div className={s.imageWrap}>
          <RevealImage
            name="manifesto"
            alt="Fachada em concreto bege com terraços horizontais sob céu nublado"
            className={s.image}
            sizes="(min-width: 1024px) 38vw, 90vw"
            from="bottom"
            parallax={10}
          />
          <p className={s.caption}>Estudo de luz sobre terraços escalonados</p>
        </div>

        <div className={s.text}>
          <FadeIn>
            <p className={s.lead}>
              Acreditamos que um edifício é a forma mais duradoura de conversa entre quem projeta e quem vive.
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className={s.body}>
              Por isso cada decisão começa pelo lugar: o sol que atravessa o lote, a rua que o cerca, o tempo que o material leva para
              envelhecer bem. Engenharia e incorporação trabalham juntas, do primeiro traço à entrega das chaves.
            </p>
          </FadeIn>
        </div>

        <dl className={s.stats}>
          {STATS.map((st, i) => (
            <FadeIn key={st.label} className={s.stat} delay={i * 0.1}>
              <dt className={s.statLabel}>{st.label}</dt>
              <dd className={`numeral ${s.statValue}`}>
                <span className="sr-only">
                  {st.value}
                  {st.suffix}
                </span>
                <Counter to={st.value} suffix={st.suffix} />
              </dd>
            </FadeIn>
          ))}
        </dl>
        <p className={s.disclaimer}>Indicadores fictícios, apenas para demonstração deste protótipo.</p>
      </div>
    </section>
  );
}
