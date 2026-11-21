import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_ARCH, EASE_OUT, RevealLines } from './Reveal';
import s from './Philosophy.module.css';

const draw = (delay = 0) => ({
  initial: { pathLength: 0 },
  whileInView: { pathLength: 1 },
  viewport: { once: true, margin: '0px 0px -15% 0px' },
  transition: { duration: 1.4, ease: EASE_ARCH, delay },
});

const GLYPHS: Record<string, ReactNode> = {
  precisao: (
    <>
      <motion.path d="M4 4h40v40H4z" {...draw()} />
      <motion.path d="M24 4v40M4 24h40" {...draw(0.3)} />
    </>
  ),
  transparencia: (
    <>
      <motion.path d="M4 4h28v28H4z" {...draw()} />
      <motion.path d="M16 16h28v28H16z" {...draw(0.25)} />
    </>
  ),
  permanencia: (
    <>
      <motion.path d="M2 44h44" {...draw()} />
      <motion.rect x="12" y="10" width="24" height="34" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE_ARCH, delay: 0.3 }} style={{ originY: 1 }} fill="currentColor" stroke="none" />
    </>
  ),
  inovacao: (
    <>
      <motion.path d="M4 4h40v40H4z" {...draw()} />
      <motion.path d="M24 6 42 24 24 42 6 24z" {...draw(0.3)} />
    </>
  ),
};

const PILLARS = [
  { id: 'precisao', name: 'Precisão', text: 'Medimos duas vezes, decidimos uma. Tolerâncias, prazos e custos são tratados como compromisso, não como estimativa.' },
  { id: 'transparencia', name: 'Transparência', text: 'Cada decisão de projeto e de obra é registrada e compartilhada. Quem investe sabe o que está sendo feito e por quê.' },
  { id: 'permanencia', name: 'Permanência', text: 'Escolhemos sistemas e materiais pelo modo como envelhecem. Um bom edifício deve ficar melhor com o tempo.' },
  { id: 'inovacao', name: 'Inovação', text: 'Novas técnicas entram quando resolvem um problema real: conforto, eficiência energética ou qualidade de execução.' },
];

export function Philosophy() {
  const reduce = useReducedMotion();
  return (
    <section className={s.section} aria-labelledby="philo-title">
      <div className="container">
        <div className={s.head}>
          <RevealLines id="philo-title" className={s.title} lines={['O que', 'nos sustenta.']} />
          <p className={s.note}>Pilares institucionais de uma marca conceitual.</p>
        </div>

        <ul className={s.list}>
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.id}
              className={s.row}
              style={{ ['--step' as string]: i }}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              <svg className={s.glyph} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                {GLYPHS[p.id]}
              </svg>
              <h3 className={s.name}>{p.name}</h3>
              <p className={s.text}>{p.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
