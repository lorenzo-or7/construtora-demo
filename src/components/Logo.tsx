interface Props { className?: string; title?: string }

/** Símbolo: um pátio central (átrio) dentro de um quadrado, com dois pilares que descem até a base. */
export function Symbol({ className, title }: Props) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M2.8 2.8h26.4v26.4H2.8z" />
      <path d="M11.5 8h9v9h-9zM11.5 17v12.2M20.5 17v12.2" />
    </svg>
  );
}

/** Wordmark vetorial monolinear desenhado sobre grade de 20 unidades. */
export function Wordmark({ className, title }: Props) {
  return (
    <svg className={className} viewBox="-1 -1 108 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M0 20 7 0l7 20M3.2 13h7.6" />
      <path d="M22 0h14M29 0v20" />
      <path d="M44 20V0h7a5.5 5.5 0 0 1 0 11h-7M50.5 11l6 9" />
      <path d="M64 0v20" />
      <path d="M72 0v13a6 6 0 0 0 12 0V0" />
      <path d="M92 20V0l7 12 7-12v20" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.7em' }}>
      <Symbol className="logo-symbol" />
      <Wordmark className="logo-word" />
      <span className="sr-only">ATRIUM</span>
    </span>
  );
}
