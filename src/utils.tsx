'use client';

/* Shared utilities, hooks, and small helpers used across the portfolio. */

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react';

export function usePrefersReducedMotion() {
  const [pref, setPref] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPref(mq.matches);
    const h = (e: MediaQueryListEvent) => setPref(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return pref;
}

export function useInView(
  ref: RefObject<Element | null>,
  opts: IntersectionObserverInit = {}
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2, ...opts }
    );
    io.observe(ref.current);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return inView;
}

type CountUpProps = {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
};

export function CountUp({
  to,
  duration = 1600,
  suffix = '',
  prefix = '',
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="count-up">
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return p;
}

export function usePointer(ref: RefObject<HTMLElement | null>) {
  const [pt, setPt] = useState({ x: 0.5, y: 0.5 });
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      setPt({ x, y });
    };
    const onLeave = () => setPt({ x: 0.5, y: 0.5 });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref]);
  return pt;
}

export function useSpotlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', e.clientX - r.left + 'px');
      el.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [ref]);
}

type SplitCharsProps = {
  text: string;
  delay?: number;
  step?: number;
  className?: string;
};

export function SplitChars({
  text,
  delay = 0,
  step = 30,
  className = '',
}: SplitCharsProps) {
  const words = text.split(' ');
  let i = 0;
  return (
    <span className={className}>
      {words.map((w, wi) => {
        const isEm = w.startsWith('*') && w.endsWith('*');
        const clean = isEm ? w.slice(1, -1) : w;
        return (
          <Fragment key={wi}>
            <span className="word">
              {[...clean].map((ch) => {
                const idx = i++;
                return (
                  <span
                    key={idx}
                    className={'char' + (isEm ? ' em' : '')}
                    style={{ animationDelay: delay + idx * step + 'ms' }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 && (
              <span
                className="word"
                style={{ width: '0.3em', display: 'inline-block' }}
              >
                &nbsp;
              </span>
            )}
          </Fragment>
        );
      })}
    </span>
  );
}
