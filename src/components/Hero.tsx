import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDownRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Img } from './Img';
import { Symbol } from './Logo';
import { EASE_ARCH, EASE_OUT } from './Reveal';
import s from './Hero.module.css';

// A sequência completa roda só na primeira visita da sessão; ao voltar de outra página ela é abreviada.
let introPlayed = false;

interface Props {
  onReady: () => void;
  /** Pula a abertura completa (ex.: quando a página abre direto em uma âncora) */
  skip?: boolean;
}

export function Hero({ onReady, skip = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const full = !introPlayed && !reduce && !skip;
  const t0 = full ? 1.75 : 0.15; // momento em que a imagem termina de abrir

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      introPlayed = true;
      onReady();
    }, reduce ? 0 : (t0 - 0.2) * 1000);
    return () => window.clearTimeout(id);
  }, [onReady, reduce, t0]);

  const lines = ['Espaços que', 'atravessam o tempo.'];

  return (
    <section ref={ref} className={s.hero} aria-labelledby="hero-title">
      {full && (
        <motion.div
          className={s.intro}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
        >
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}>
            <Symbol className={s.introSymbol} />
          </motion.span>
        </motion.div>
      )}

      {/* 1-2: máscara geométrica que se expande como uma abertura arquitetônica */}
      <motion.div
        className={s.frame}
        initial={full ? { clipPath: 'inset(46% 49.6% 46% 49.6%)' } : reduce ? false : { clipPath: 'inset(4% 4% 4% 4%)' }}
        animate={{
          clipPath: full
            ? ['inset(46% 49.6% 46% 49.6%)', 'inset(14% 41% 14% 41%)', 'inset(0% 0% 0% 0%)']
            : 'inset(0% 0% 0% 0%)',
        }}
        transition={full ? { duration: 1.75, times: [0, 0.42, 1], ease: EASE_ARCH } : { duration: 0.9, ease: EASE_ARCH }}
      >
        <motion.div className={s.media} style={{ y: reduce ? 0 : mediaY }}>
          <motion.div
            className={s.mediaInner}
            initial={reduce ? false : { scale: full ? 1.35 : 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: full ? 2.4 : 1.2, ease: EASE_OUT }}
          >
            <Img
              name="hero"
              mobile="hero-mobile"
              alt="Edifício contemporâneo de concreto e venezianas de madeira sob luz natural"
              priority
              sizes="100vw"
              className={s.img}
            />
          </motion.div>
        </motion.div>
        <div className={s.scrim} aria-hidden="true" />
      </motion.div>

      <motion.div className={`container ${s.content}`} style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}>
        {/* 3: headline revelada por linhas */}
        <h1 id="hero-title" className={s.title} aria-label={lines.join(' ')}>
          {lines.map((l, i) => (
            <span key={l} className="line-mask" aria-hidden="true">
              <motion.span
                initial={reduce ? false : { y: '108%' }}
                animate={{ y: '0%' }}
                transition={{ delay: t0 - 0.25 + i * 0.12, duration: 1.15, ease: EASE_OUT }}
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className={s.aside}>
          {/* 4: subtítulo */}
          <motion.p
            className={s.lead}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: t0 + 0.25, duration: 1, ease: EASE_OUT }}
          >
            Projetamos experiências para viver. Construímos histórias para permanecer.
          </motion.p>
          {/* 5: CTAs em stagger */}
          <div className={s.ctas}>
            {[
              <Link key="a" to={{ pathname: '/', hash: '#empreendimentos' }} className="btn btn--light">
                Explorar empreendimentos
                <ArrowDownRight aria-hidden />
              </Link>,
              <Link key="b" to={{ pathname: '/', hash: '#essencia' }} className="btn btn--ghost btn--on-image">
                Nossa essência
              </Link>,
            ].map((el, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: t0 + 0.45 + i * 0.12, duration: 0.9, ease: EASE_OUT }}
              >
                {el}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 6: indicador de rolagem */}
      <motion.a
        href="#essencia"
        className={s.scroll}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('essencia')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: t0 + 0.8, duration: 0.8 }}
      >
        <span className={s.scrollTrack} aria-hidden="true">
          <span className={s.scrollThumb} />
        </span>
        <span>Role para descobrir</span>
      </motion.a>

      <motion.p
        className={s.note}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: t0 + 0.8, duration: 0.8 }}
      >
        Marca e empreendimentos conceituais
      </motion.p>
    </section>
  );
}
