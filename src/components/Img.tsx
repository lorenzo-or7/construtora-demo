import { forwardRef, useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
import meta from '../data/image-meta.json';

export type ImageKey = keyof typeof meta;

const WIDTHS = [800, 1600] as const;

export const imageSrc = (key: ImageKey, w: (typeof WIDTHS)[number] = 1600) => `${import.meta.env.BASE_URL}images/${key}-${w}.webp`;
export const imageMeta = (key: ImageKey) => meta[key];

interface ImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  name: ImageKey;
  alt: string;
  sizes?: string;
  priority?: boolean;
  /** Imagem alternativa (direção de arte) para telas até 767px */
  mobile?: ImageKey;
}

/** Imagem responsiva com srcset, dimensões intrínsecas (evita CLS) e cor dominante como placeholder. */
export const Img = forwardRef<HTMLImageElement, ImgProps>(function Img(
  { name, alt, sizes = '100vw', priority = false, mobile, style, className, onLoad, ...rest },
  ref,
) {
  const m = meta[name];
  const [loaded, setLoaded] = useState(false);
  const srcSet = WIDTHS.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ');
  const s: CSSProperties = {
    backgroundColor: m.color,
    transition: 'opacity .8s cubic-bezier(.22,1,.36,1)',
    opacity: loaded ? 1 : 0.001,
    ...style,
  };
  const img = (
    <img
      ref={ref}
      src={imageSrc(name)}
      srcSet={srcSet}
      sizes={sizes}
      width={m.w}
      height={m.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
      className={className}
      style={s}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={() => setLoaded(true)}
      {...rest}
    />
  );
  if (!mobile) return img;
  const mm = meta[mobile];
  return (
    <picture style={{ display: 'contents' }}>
      <source
        media="(max-width: 767px)"
        srcSet={WIDTHS.map((w) => `${imageSrc(mobile, w)} ${w}w`).join(', ')}
        sizes="100vw"
        width={mm.w}
        height={mm.h}
      />
      {img}
    </picture>
  );
});
