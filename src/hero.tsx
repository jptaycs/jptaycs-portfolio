'use client';

/* Hero: particle constellation canvas + name reveal + cycling typing tagline. */

import { useEffect, useRef, useState } from 'react';
import {
  CountUp,
  SplitChars,
  usePrefersReducedMotion,
} from './utils';

function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0,
      H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: Math.random() * 1.6 + 0.4,
    }));
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);

    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const g1 = ctx.createRadialGradient(
        W * 0.25,
        H * 0.3,
        0,
        W * 0.25,
        H * 0.3,
        W * 0.55
      );
      g1.addColorStop(0, 'rgba(124,58,237,0.22)');
      g1.addColorStop(1, 'rgba(124,58,237,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);
      const g2 = ctx.createRadialGradient(
        W * 0.85,
        H * 0.75,
        0,
        W * 0.85,
        H * 0.75,
        W * 0.5
      );
      g2.addColorStop(0, 'rgba(6,182,212,0.18)');
      g2.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        const px = p.x * W,
          py = p.y * H;
        const dx = mouse.x - px,
          dy = mouse.y - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const f = 0.000004 * (1 - d2 / 22000);
          p.vx += dx * f;
          p.vy += dy * f;
        }
        p.vx *= 0.992;
        p.vy *= 0.992;
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = pts[i],
            b = pts[j];
          const ax = a.x * W,
            ay = a.y * H;
          const bx = b.x * W,
            by = b.y * H;
          const d2 = (ax - bx) * (ax - bx) + (ay - by) * (ay - by);
          if (d2 < 16000) {
            const alpha = (1 - d2 / 16000) * 0.22;
            ctx.strokeStyle = `rgba(180,180,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }
      for (const p of pts) {
        const px = p.x * W,
          py = p.y * H;
        ctx.fillStyle = 'rgba(220,220,255,0.85)';
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
    };
  }, [reduced]);
  return <canvas ref={ref} aria-hidden="true" />;
}

const ROLES = [
  'AI Engineer.',
  'Agent Builder.',
  'Full-Stack Developer.',
  'Founder.',
];

function TypingRoles() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'hold' | 'deleting'>('typing');
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setText(ROLES[idx]);
      return;
    }
    const target = ROLES[idx];
    let t: ReturnType<typeof setTimeout> | undefined;
    if (phase === 'typing') {
      if (text.length < target.length) {
        t = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          65
        );
      } else {
        t = setTimeout(() => setPhase('hold'), 1400);
      }
    } else if (phase === 'hold') {
      t = setTimeout(() => setPhase('deleting'), 0);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        t = setTimeout(
          () => setText(target.slice(0, text.length - 1)),
          30
        );
      } else {
        setIdx((i) => (i + 1) % ROLES.length);
        setPhase('typing');
      }
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [text, phase, idx, reduced]);

  return (
    <span className="sub">
      <span style={{ color: 'var(--dim)' }}>$</span>
      <span style={{ color: 'var(--muted)' }}>role&nbsp;=</span>
      <span className="roles">
        {text}
        <span className="caret" />
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section id="hero" className="hero">
      <HeroCanvas />
      <div className="hero-grid-overlay" />
      <div className="hero-inner">
        <div className="meta-row">
          <div className="col">
            <span>// PORTFOLIO_V3</span>
            <span style={{ color: 'var(--text)' }}>2026 — REV 0.3.1</span>
          </div>
          <div className="col" style={{ textAlign: 'center' }}>
            <span>NODE</span>
            <span style={{ color: 'var(--text)' }}>JPT-MNL-01</span>
          </div>
          <div className="col" style={{ textAlign: 'right' }}>
            <span>STATUS</span>
            <span style={{ color: '#22c55e' }}>● ONLINE</span>
          </div>
        </div>

        <div>
          <span className="hero-eyebrow">
            <span className="bar" />
            <span>§ 00 — Identity</span>
            <span style={{ color: 'var(--dim)' }}>· 14.123°N · 121.067°E</span>
          </span>
          <h1 className="hero-name" aria-label="JP Tayco">
            <SplitChars text="JP" delay={120} step={28} />
            <br />
            <SplitChars text="*Tayco.*" delay={300} step={28} />
          </h1>
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <TypingRoles />
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--muted)',
                fontSize: 14,
                maxWidth: 60 + 'ch',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: 'var(--amber)' }}>{'>'}</span> Building
              AI-powered systems and shipping real-world products — from
              concept to production. Currently founding{' '}
              <span style={{ color: 'var(--text)' }}>
                Appnado IT Solutions
              </span>
              .
            </div>
          </div>
        </div>

        <div className="hero-bottom">
          <div className="stat">
            <span className="v">
              <CountUp to={4} suffix="+" />
            </span>
            YEARS SHIPPING
          </div>
          <div className="stat">
            <span className="v">
              <CountUp to={24} />
            </span>
            PROJECTS DELIVERED
          </div>
          <div className="stat">
            <span className="v">
              <CountUp to={6} />
            </span>
            LANGUAGES IN ROTATION
          </div>
          <div className="stat">
            <span className="v" style={{ color: 'var(--amber)' }}>
              ∞
            </span>
            CURIOSITY / DAY
          </div>
        </div>
      </div>
      <div className="scroll-cue">SCROLL · §01</div>
    </section>
  );
}
