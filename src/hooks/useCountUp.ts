'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  target: number;
  /** Animation duration in ms. Default 1100. */
  duration?: number;
  /** Decimal places for the displayed value. Default 0. */
  decimals?: number;
  /** Don't start the animation until the element scrolls into view. */
  ref?: React.RefObject<HTMLElement | null>;
}

/**
 * Animates a number from 0 to `target` with an ease-out cubic curve. Honors
 * `prefers-reduced-motion`. When a ref is provided, the animation only fires
 * after that element scrolls into view (one-shot per page load).
 */
export function useCountUp({
  target,
  duration = 1100,
  decimals = 0,
  ref,
}: UseCountUpOptions): number {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    const animate = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setValue(parseFloat((target * eased).toFixed(decimals)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!ref?.current) {
      animate();
      return;
    }

    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          animate();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration, decimals, ref]);

  return value;
}
