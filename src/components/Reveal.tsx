import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { useRef, type ElementType, type ReactNode } from 'react';

// Cache: motion.create precisa devolver o mesmo componente entre renders.
const motionCache = new Map<ElementType, ReturnType<typeof motion.create>>();
const getMotion = (tag: ElementType) => {
  let c = motionCache.get(tag);
  if (!c) { c = motion.create(tag as never); motionCache.set(tag, c); }
  return c as typeof motion.div;
};
import { Img, type ImageKey } from './Img';

export const EASE_ARCH = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const lineVariants: Variants = {
  hidden: { y: '105%' },
  show: (i: number) => ({ y: '0%', transition: { duration: 1.05, ease: EASE_OUT, delay: i * 0.09 } }),
};

interface RevealLinesProps {
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Anima quando entra na viewport (padrão) ou imediatamente com atraso */
  delay?: number;
  immediate?: boolean;
  id?: string;
}

/** Text Mask Reveal: cada linha sobe por trás de uma máscara. O texto completo fica acessível. */
export function RevealLines({ lines, as: Tag = 'h2', className, delay = 0, immediate = false, id }: RevealLinesProps) {
  const reduce = useReducedMotion();
  const MotionTag = getMotion(Tag);
  return (
    <MotionTag
      id={id}
      className={className}
      initial={reduce ? false : 'hidden'}
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } })}
    >
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <span className="line-mask" key={i} aria-hidden="true">
          <motion.span variants={lineVariants} custom={i + delay / 0.09}>
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

interface FadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: ElementType;
}

/** Entrada suave e contida, usada com parcimônia para blocos de texto secundário. */
export function FadeIn({ children, className, delay = 0, y = 24, as: Tag = 'div' }: FadeProps) {
  const reduce = useReducedMotion();
  const MotionTag = getMotion(Tag);
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay }}
    >
      {children}
    </MotionTag>
  );
}

interface RevealImageProps {
  name: ImageKey;
  alt: string;
  className?: string;
  sizes?: string;
  /** direção da abertura da máscara */
  from?: 'bottom' | 'left' | 'right' | 'top';
  parallax?: number;
  priority?: boolean;
}

const clipFrom = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

/** Architectural Image Reveal: máscara clip-path + escala + parallax vertical controlado. */
export function RevealImage({ name, alt, className, sizes, from = 'bottom', parallax = 8, priority }: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden', position: 'relative' }}
      initial={reduce ? false : { clipPath: clipFrom[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.4, ease: EASE_ARCH }}
    >
      <motion.div
        style={{ y: reduce ? 0 : y, position: 'absolute', inset: `-${parallax + 2}% 0` }}
        initial={reduce ? false : { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE_OUT }}
      >
        <Img name={name} alt={alt} sizes={sizes} priority={priority} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </motion.div>
    </motion.div>
  );
}
