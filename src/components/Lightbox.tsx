import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { trapFocus, useScrollLock } from '../hooks/useScrollLock';
import { Img, type ImageKey } from './Img';
import { EASE_ARCH, EASE_OUT } from './Reveal';
import s from './Lightbox.module.css';

export interface LightboxItem {
  image: ImageKey;
  alt: string;
  caption: string;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  label: string;
}

/** Galeria fullscreen acessível: teclado (setas, Home/End, Esc), gestos de arraste, contador e foco preso. */
export default function Lightbox({ items, index, onClose, onIndexChange, label }: Props) {
  const open = index !== null;
  const [dir, setDir] = useState(0);
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  useScrollLock(open);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDir(delta);
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.clearTimeout(t);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Home') { setDir(-1); onIndexChange(0); }
      else if (e.key === 'End') { setDir(1); onIndexChange(items.length - 1); }
      trapFocus(e, dialogRef.current);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, go, onClose, onIndexChange, items.length]);

  // Pré-carrega as vizinhas para transições sem espera.
  useEffect(() => {
    if (index === null) return;
    [index + 1, index - 1].forEach((i) => {
      const it = items[(i + items.length) % items.length];
      if (it) new Image().src = `${import.meta.env.BASE_URL}images/${it.image}-1600.webp`;
    });
  }, [index, items]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const item = index !== null ? items[index] : undefined;

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          ref={dialogRef}
          className={s.root}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4 }}
        >
          <div className={s.top}>
            <p className={`numeral ${s.counter}`} aria-live="polite">
              <span className="sr-only">Imagem </span>
              {String(index! + 1).padStart(2, '0')}
              <span className={s.total}> / {String(items.length).padStart(2, '0')}</span>
            </p>
            <button ref={closeRef} type="button" className={s.iconBtn} onClick={onClose} aria-label="Fechar galeria">
              <X aria-hidden />
            </button>
          </div>

          <div className={s.stage}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.figure
                key={index}
                className={s.figure}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d >= 0 ? '12%' : '-12%', opacity: 0, clipPath: d >= 0 ? 'inset(0 0 0 30%)' : 'inset(0 30% 0 0)' }),
                  center: { x: '0%', opacity: 1, clipPath: 'inset(0 0% 0 0%)' },
                  exit: (d: number) => ({ x: d >= 0 ? '-8%' : '8%', opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0 : 0.8, ease: EASE_ARCH }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={onDragEnd}
              >
                <Img name={item.image} alt={item.alt} sizes="100vw" className={s.img} draggable={false} />
                <motion.figcaption
                  className={s.caption}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.35, duration: 0.5, ease: EASE_OUT }}
                >
                  {item.caption}
                </motion.figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className={s.controls}>
            <button type="button" className={s.navBtn} onClick={() => go(-1)} aria-label="Imagem anterior">
              <ChevronLeft aria-hidden />
            </button>
            <div className={s.dots} aria-hidden="true">
              {items.map((_, i) => (
                <span key={i} data-active={i === index || undefined} />
              ))}
            </div>
            <button type="button" className={s.navBtn} onClick={() => go(1)} aria-label="Próxima imagem">
              <ChevronRight aria-hidden />
            </button>
          </div>
          <p className="sr-only">Use as setas do teclado para navegar e Esc para fechar.</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
