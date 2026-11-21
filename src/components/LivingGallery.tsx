import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, type PanInfo } from 'motion/react';
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react';
import { lazy, Suspense, useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Img, imageMeta } from './Img';
import type { LightboxItem } from './Lightbox';
import { EASE_ARCH, FadeIn, RevealLines } from './Reveal';
import s from './LivingGallery.module.css';

const Lightbox = lazy(() => import('./Lightbox'));

const ITEMS: LightboxItem[] = [
  { image: 'live-1', alt: 'Estar com lareira, poltrona escura e paredes em tons de areia', caption: 'Estar com lareira' },
  { image: 'live-2', alt: 'Sala clara com poltronas de couro caramelo e janelas para o jardim', caption: 'Sala de estar e leitura' },
  { image: 'live-3', alt: 'Suíte com cama baixa, painel texturizado e vista aberta', caption: 'Suíte com vista' },
  { image: 'live-4', alt: 'Estar com sofá branco, quadros em preto e branco e cortina leve', caption: 'Estar integrado' },
  { image: 'live-5', alt: 'Living com sofá cinza modular e grande janela para o gramado', caption: 'Living em luz natural' },
];

export function LivingGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const frames = useRef<(HTMLButtonElement | null)[]>([]);
  const x = useMotionValue(0);
  const [max, setMax] = useState(0);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [lbMounted, setLbMounted] = useState(false);
  const dragging = useRef(false);
  const reduce = useReducedMotion();
  // Quadros fora da área visível horizontal: carrega todos quando a galeria se aproxima.
  const near = useInView(viewport, { once: true, margin: '100% 0px 100% 0px' });

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current || !viewport.current) return;
      const m = Math.max(0, track.current.scrollWidth - viewport.current.clientWidth);
      setMax(m);
      setOffsets(frames.current.map((f) => Math.min(f?.offsetLeft ?? 0, m)));
      if (-x.get() > m) x.set(-m);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [x]);

  useMotionValueEvent(x, 'change', (v) => {
    if (!offsets.length) return;
    const pos = -v;
    let best = 0;
    offsets.forEach((o, i) => {
      if (Math.abs(o - pos) < Math.abs((offsets[best] ?? 0) - pos)) best = i;
    });
    if (pos >= max - 4) best = offsets.length - 1;
    setCurrent(best);
  });

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(ITEMS.length - 1, i));
      const target = -Math.min(offsets[clamped] ?? 0, max);
      animate(x, target, reduce ? { duration: 0 } : { duration: 0.9, ease: EASE_ARCH });
      setCurrent(clamped);
    },
    [offsets, max, x, reduce],
  );

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = -(x.get() + info.velocity.x * 0.25);
    let best = 0;
    offsets.forEach((o, i) => {
      if (Math.abs(o - projected) < Math.abs((offsets[best] ?? 0) - projected)) best = i;
    });
    if (projected >= max - 20) best = ITEMS.length - 1;
    goTo(best);
    window.setTimeout(() => (dragging.current = false), 60);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); frames.current[current + 1]?.focus({ preventScroll: true }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); frames.current[current - 1]?.focus({ preventScroll: true }); }
  };

  return (
    <section className={s.section} aria-labelledby="living-title">
      <div className={`container ${s.head}`}>
        <RevealLines id="living-title" className={s.title} lines={['Espaços feitos', 'para viver.']} />
        <FadeIn delay={0.1} className={s.headSide}>
          <p className={s.lede}>
            Ambientes de referência que traduzem a linguagem ATRIUM em luz, textura e proporção. Arraste, use as setas ou abra em tela cheia.
          </p>
        </FadeIn>
      </div>

      <div
        ref={viewport}
        className={s.viewport}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Galeria de ambientes"
        onKeyDown={onKey}
      >
        <motion.div
          ref={track}
          className={s.track}
          style={{ x }}
          drag={max > 0 ? 'x' : false}
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => (dragging.current = true)}
          onDragEnd={onDragEnd}
        >
          {ITEMS.map((it, i) => {
            const m = imageMeta(it.image);
            return (
              <motion.button
                key={it.image}
                ref={(el) => {
                  frames.current[i] = el;
                }}
                type="button"
                className={s.frame}
                style={{ aspectRatio: `${m.w} / ${m.h}` }}
                data-active={i === current || undefined}
                aria-label={`${it.caption}, imagem ${i + 1} de ${ITEMS.length}. Abrir em tela cheia`}
                onClick={() => {
                  if (dragging.current) return;
                  setLbMounted(true);
                  setLightbox(i);
                }}
                onFocus={(e) => {
                  // Só reposiciona com foco por teclado; com mouse, mover o trilho no mousedown cancelaria o clique.
                  if (e.currentTarget.matches(':focus-visible')) goTo(i);
                }}
                initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
                whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: EASE_ARCH, delay: Math.min(i, 3) * 0.1 }}
              >
                <Img name={it.image} alt="" sizes="(min-width: 768px) 50vw, 85vw" draggable={false} loading={near ? 'eager' : 'lazy'} />
                <span className={s.frameCaption}>
                  <span>{it.caption}</span>
                  <Expand aria-hidden />
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className={`container ${s.controls}`}>
        <p className={`numeral ${s.counter}`} aria-live="polite">
          {String(current + 1).padStart(2, '0')}
          <span> / {String(ITEMS.length).padStart(2, '0')}</span>
        </p>
        <div className={s.bars}>
          {ITEMS.map((it, i) => (
            <button
              key={it.image}
              type="button"
              className={s.barBtn}
              aria-label={`Ir para ${it.caption}`}
              aria-current={i === current || undefined}
              onClick={() => goTo(i)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className={s.arrows}>
          <button type="button" className={s.arrow} onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Ambiente anterior">
            <ArrowLeft aria-hidden />
          </button>
          <button
            type="button"
            className={s.arrow}
            onClick={() => goTo(current + 1)}
            disabled={current === ITEMS.length - 1}
            aria-label="Próximo ambiente"
          >
            <ArrowRight aria-hidden />
          </button>
        </div>
      </div>

      {lbMounted && (
        <Suspense fallback={null}>
          <Lightbox items={ITEMS} index={lightbox} onClose={() => setLightbox(null)} onIndexChange={setLightbox} label="Galeria de ambientes em tela cheia" />
        </Suspense>
      )}
    </section>
  );
}
