'use client';

/* Dive intro: the Hero's constellation, seen from far out. You connect it by
   drawing a circle, then scroll to fly forward through the network; the
   violet/cyan glows travel with you and land exactly where the Hero's own
   canvas paints them, so the hand-off has no seam. */

import { useEffect, useRef, useState } from 'react';

const GATE_KEY = 'jpt-intro-broken';
const SYNC_TICKS = [0, 25, 50, 75, 100];
// How much of a turn counts as "a circle" — hand-drawn loops rarely close.
const FULL_TURN = Math.PI * 2 * 0.85;

// Network: points in a box in front of the camera; the dive moves the camera
// forward by DEPTH * progress.
const NODES = 240;
const DEPTH = 5;
const SPREAD = 1.7;

// Text beats revealed as you dive: [start, end] of scroll progress.
const BEATS: { from: number; to: number; big: string; small: string }[] = [
  { from: 0.06, to: 0.32, big: "Hi, I'm JP.", small: 'AI engineer · full-stack developer' },
  { from: 0.34, to: 0.58, big: 'I build AI products that ship.', small: 'Agents · RAG · automation · web & mobile' },
  { from: 0.6, to: 0.84, big: 'Railway Media · NOBS BIZ · Toivelo', small: 'Three client teams, one command center' },
];

function beatOpacity(p: number, from: number, to: number) {
  const fade = 0.06;
  if (p < from || p > to) return 0;
  return Math.min(1, (p - from) / fade, (to - p) / fade);
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function cssColorToRgb(value: string): [number, number, number] {
  const hex = value.trim().replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
  }
  return [10, 10, 11];
}

export function DiveIntro() {
  const [enabled, setEnabled] = useState(false);
  const [broken, setBroken] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const gaugeWrapRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const syncLabelRef = useRef<HTMLSpanElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  const brokenRef = useRef(false);
  const breakAt = useRef(-1);

  // Decide once on mount whether to show the intro and whether to gate it.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
    let alreadyBroken = false;
    try {
      alreadyBroken = sessionStorage.getItem(GATE_KEY) === '1';
    } catch {}
    if (alreadyBroken || window.location.hash || window.scrollY > 0) {
      brokenRef.current = true;
      setBroken(true);
    }
  }, []);

  // Lock scrolling and hide the site chrome until the network is connected.
  useEffect(() => {
    if (!enabled || broken) return;
    const root = document.documentElement;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    root.classList.add('intro-gated');
    return () => root.classList.remove('intro-gated');
  }, [enabled, broken]);

  useEffect(() => {
    if (!enabled) return;
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let w = 0, h = 0, dpr = 1;
    let heroH = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      heroH = document.getElementById('hero')?.offsetHeight || h;
    };
    resize();
    window.addEventListener('resize', resize);

    let bg = cssColorToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg'));

    const nodes = Array.from({ length: NODES }, () => ({
      x: (Math.random() * 2 - 1) * SPREAD,
      y: (Math.random() * 2 - 1) * SPREAD,
      z: 1 + Math.random() * (DEPTH + 1.5),
      r: Math.random() * 1.4 + 0.5,
      phase: Math.random() * Math.PI * 2,
      // screen-space scratch, filled every frame
      sx: 0,
      sy: 0,
      a: 0,
      lit: 0,
    }));

    // ---- gesture: sweep a full turn around the centre ring ----
    const ringRadius = () => Math.min(w, h) * 0.22;
    let sweep = 0;
    let lastAngle: number | null = null;
    let lastMove = 0;
    const points: { x: number; y: number; t: number }[] = [];
    const mouse = { x: 0, y: 0 };

    const connect = () => {
      if (brokenRef.current) return;
      brokenRef.current = true;
      breakAt.current = performance.now();
      try {
        sessionStorage.setItem(GATE_KEY, '1');
      } catch {}
      setBroken(true);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / w - 0.5;
      mouse.y = e.clientY / h - 0.5;
      if (brokenRef.current) return;
      const now = performance.now();
      points.push({ x: e.clientX, y: e.clientY, t: now });
      // A pause starts a fresh stroke rather than continuing from a stale angle.
      if (now - lastMove > 300) lastAngle = null;
      lastMove = now;
      const dx = e.clientX - w / 2;
      const dy = e.clientY - h / 2;
      const dist = Math.hypot(dx, dy);
      const R = ringRadius();
      if (dist < R * 0.45 || dist > R * 1.9) {
        lastAngle = null;
        return;
      }
      const a = Math.atan2(dy, dx);
      if (lastAngle !== null) {
        let d = a - lastAngle;
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        if (Math.abs(d) < 0.9) sweep += d;
      }
      lastAngle = a;
      if (Math.abs(sweep) >= FULL_TURN) connect();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!brokenRef.current && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        connect();
      }
    };
    const onSkip = () => connect();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('dive-skip', onSkip);

    // ---- scroll: dive progress drives the camera, gauge and text beats ----
    let progress = 0;
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      progress = clamp01(-r.top / total);
      const pct = Math.round(progress * 100);
      if (gaugeRef.current) gaugeRef.current.style.top = progress * 100 + '%';
      if (gaugeWrapRef.current) gaugeWrapRef.current.style.opacity = String(clamp01((0.97 - progress) / 0.08));
      if (syncLabelRef.current) syncLabelRef.current.textContent = String(pct).padStart(3, '0') + '%';
      BEATS.forEach((b, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const o = beatOpacity(progress, b.from, b.to);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
      });
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - progress * 16));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Only render while the section is on screen.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(section);

    const glow = (x: number, y: number, r: number, rgb: string, a: number) => {
      if (a <= 0.001 || r <= 0) return;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    };

    const start = performance.now();
    let frame = 0;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      frame++;
      if (frame % 30 === 0) bg = cssColorToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg'));
      const t = (now - start) / 1000;

      // Let an abandoned half-circle drain away.
      if (!brokenRef.current && now - lastMove > 600) sweep *= 0.96;
      const turn = Math.min(1, Math.abs(sweep) / FULL_TURN);
      if (arcRef.current) arcRef.current.style.strokeDashoffset = String(1 - turn);

      // Seconds since connecting; a finished gate from an earlier visit counts as long ago.
      const since = breakAt.current < 0 ? (brokenRef.current ? 99 : -1) : (now - breakAt.current) / 1000;
      const connected = since >= 0;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Background: a deep violet-black that settles on the site's --bg.
      const settle = smooth(0.55, 1, progress);
      ctx.fillStyle = `rgb(${Math.round(lerp(12, bg[0], settle))},${Math.round(lerp(8, bg[1], settle))},${Math.round(lerp(24, bg[2], settle))})`;
      ctx.fillRect(0, 0, w, h);

      // Glows: rich and centred at the top, then sliding to where the Hero
      // paints its own glows — one viewport below this one.
      const drift = Math.sin(t * 0.3) * 0.03;
      const vx = lerp(0.3 + drift, 0.25, settle) * w;
      const vy = lerp(0.42, 1, settle) * h + settle * heroH * 0.3;
      const cx = lerp(0.76 - drift, 0.85, settle) * w;
      const cy = lerp(0.62, 1, settle) * h + settle * heroH * 0.75;
      const charge = connected ? 1 : 0.55 + turn * 0.45;
      glow(vx, vy, lerp(0.8, 0.55, settle) * w, '124,58,237', lerp(0.5 * charge, 0.22, settle));
      glow(cx, cy, lerp(0.65, 0.5, settle) * w, '6,182,212', lerp(0.4 * charge, 0.18, settle));

      // Connect pulse: a ring sweeping out from the centre.
      const pulseR = connected ? since * Math.max(w, h) * 0.75 : -1;
      const pulseFade = connected ? Math.max(0, 1 - since / 2.2) : 0;
      if (pulseFade > 0) glow(w / 2, h / 2, Math.max(1, pulseR * 0.9), '150,120,255', 0.35 * pulseFade);

      // Project the network. The camera flies forward with scroll.
      const cam = DEPTH * smooth(0, 1, progress) * 0.95;
      const focal = h * 0.62;
      const fadeOut = 1 - smooth(0.85, 1, progress) * 0.6;
      for (const n of nodes) {
        const dz = n.z - cam;
        if (dz < 0.12) {
          n.a = 0;
          continue;
        }
        const s = focal / dz;
        const px = n.x + Math.sin(t * 0.4 + n.phase) * 0.02;
        const py = n.y + Math.cos(t * 0.35 + n.phase) * 0.02;
        n.sx = w / 2 + px * s - (mouse.x * 30) / dz;
        n.sy = h / 2 + py * s - (mouse.y * 30) / dz;
        n.a = smooth(0.12, 0.7, dz) * (1 - smooth(3.2, 5.5, dz)) * fadeOut;
        if (n.sx < -60 || n.sx > w + 60 || n.sy < -60 || n.sy > h + 60) n.a = 0;
        // Light nodes as the pulse ring passes, and near the drawing cursor.
        let lit = n.lit * 0.94;
        if (pulseFade > 0) {
          const d = Math.abs(Math.hypot(n.sx - w / 2, n.sy - h / 2) - pulseR);
          if (d < 70) lit = Math.max(lit, (1 - d / 70) * pulseFade);
        }
        n.lit = lit;
      }

      // Links between near nodes, like the Hero's constellation.
      ctx.lineWidth = 0.7;
      for (let i = 0; i < NODES; i++) {
        const a = nodes[i];
        if (a.a <= 0) continue;
        for (let j = i + 1; j < NODES; j++) {
          const b = nodes[j];
          if (b.a <= 0) continue;
          const dz = a.z - b.z;
          if (dz > 0.9 || dz < -0.9) continue;
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          const reach = 150 * 150;
          if (d2 > reach) continue;
          const k = (1 - d2 / reach) * Math.min(a.a, b.a);
          const lit = Math.max(a.lit, b.lit);
          const alpha = k * (0.22 + 0.6 * lit);
          ctx.strokeStyle = lit > 0.05
            ? `rgba(${Math.round(lerp(180, 90, lit))},${Math.round(lerp(180, 220, lit))},255,${alpha})`
            : `rgba(180,180,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        if (n.a <= 0) continue;
        const size = Math.min(4.5, (n.r * 1.4) / Math.max(0.35, n.z - cam));
        ctx.fillStyle = n.lit > 0.05
          ? `rgba(200,240,255,${Math.min(1, n.a * (0.85 + n.lit))})`
          : `rgba(220,220,255,${n.a * 0.85})`;
        ctx.beginPath();
        ctx.arc(n.sx, n.sy, size + n.lit * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // The drawing trail: a violet-to-cyan stroke that links to the nodes it passes.
      while (points.length && now - points[0].t > 700) points.shift();
      if (points.length > 1) {
        ctx.lineCap = 'round';
        for (let i = 1; i < points.length; i++) {
          const life = 1 - (now - points[i].t) / 700;
          const k = i / points.length;
          ctx.strokeStyle = `rgba(${Math.round(lerp(124, 6, k))},${Math.round(lerp(58, 182, k))},${Math.round(lerp(237, 212, k))},${life * 0.9})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(points[i - 1].x, points[i - 1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.stroke();
        }
        const head = points[points.length - 1];
        ctx.lineWidth = 0.8;
        for (const n of nodes) {
          if (n.a <= 0) continue;
          const d = Math.hypot(n.sx - head.x, n.sy - head.y);
          if (d > 140) continue;
          n.lit = Math.max(n.lit, (1 - d / 140) * 0.8);
          ctx.strokeStyle = `rgba(150,220,255,${(1 - d / 140) * 0.5 * n.a})`;
          ctx.beginPath();
          ctx.moveTo(head.x, head.y);
          ctx.lineTo(n.sx, n.sy);
          ctx.stroke();
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('dive-skip', onSkip);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <section ref={sectionRef} className={'dive' + (broken ? ' is-broken' : '')} aria-label="Intro">
      <div className="dive-sticky">
        <canvas ref={canvasRef} className="dive-canvas" aria-hidden="true" />

        <div className="dive-gate" aria-hidden={broken}>
          <svg className="dive-ring" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="dive-ring-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" className="track" />
            <circle ref={arcRef} cx="50" cy="50" r="46" className="arc" pathLength={1} />
            <circle cx="50" cy="4" r="1.6" className="start" />
          </svg>
          <div className="dive-prompt">
            <div>DRAW A CIRCLE</div>
            <div className="sub">to connect</div>
          </div>
          <button className="dive-skip" onClick={() => window.dispatchEvent(new Event('dive-skip'))}>
            or press Enter ↵
          </button>
        </div>

        <div ref={hintRef} className="dive-hint" aria-hidden={!broken}>
          <div className="dive-hint-icon mouse">
            <span className="wheel" />
          </div>
          <div className="dive-hint-icon finger">
            <span className="tip" />
          </div>
          <div className="label">
            <span className="desktop-only">Scroll down to dive in</span>
            <span className="touch-only">Swipe up to dive in</span>
          </div>
          <div className="chevrons">
            <span />
            <span />
            <span />
          </div>
        </div>

        {BEATS.map((b, i) => (
          <div key={b.big} ref={(el) => { beatRefs.current[i] = el; }} className="dive-beat">
            <div className="big">{b.big}</div>
            <div className="small">{b.small}</div>
          </div>
        ))}

        <div ref={gaugeWrapRef} className="dive-gauge" aria-hidden="true">
          <div className="ticks">
            {SYNC_TICKS.map((d) => (
              <span key={d}>{d}%</span>
            ))}
          </div>
          <div className="rail">
            <div ref={gaugeRef} className="needle">
              <span ref={syncLabelRef}>000%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
