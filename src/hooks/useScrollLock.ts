import { useEffect } from 'react';

/** Bloqueia a rolagem do documento sem deslocar o layout (compensa a barra de rolagem). */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { style } = document.documentElement;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prev = { overflow: style.overflow, paddingRight: document.body.style.paddingRight };
    style.overflow = 'hidden';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
    return () => {
      style.overflow = prev.overflow;
      document.body.style.paddingRight = prev.paddingRight;
    };
  }, [locked]);
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Mantém o foco do teclado dentro de um contêiner modal. */
export function trapFocus(e: KeyboardEvent, container: HTMLElement | null) {
  if (e.key !== 'Tab' || !container) return;
  const items = [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!items.length) return;
  const first = items[0]!;
  const last = items[items.length - 1]!;
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
