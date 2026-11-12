import { useEffect, useRef, useState } from "react";

/** Tempo da animação de saída, igual a --dur-exit no CSS. */
export const EXIT_MS = 160;

/** Prefere reduzir movimento? Nesse caso as saídas são imediatas. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Mantém um elemento montado enquanto a animação de saída corre.
 * `mounted` diz se deve ser renderizado; `closing` activa a classe de saída.
 */
export function usePresence(open: boolean, ms = EXIT_MS) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      if (prefersReducedMotion()) {
        setMounted(false);
        return;
      }
      setClosing(true);
      timer.current = window.setTimeout(() => {
        setMounted(false);
        setClosing(false);
      }, ms);
    }
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return { mounted, closing };
}
