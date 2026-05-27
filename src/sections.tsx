'use client';

/* Marquee · About + model card · Tech bento · Timeline (horizontal pinned). */

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CountUp, useSpotlight } from './utils';

export function Marquee() {
  const items = [
    'AI ENGINEERING',
    'AGENT FRAMEWORKS',
    'RAG PIPELINES',
    'LLM TOOLING',
    'FULL-STACK',
    'EDGE FUNCTIONS',
    'TYPED SYSTEMS',
    'PROMPT CRAFT',
    'AUTOMATION',
    'PRODUCT VELOCITY',
  ];
  const row = (
    <Fragment>
      {items.map((it, i) => (
        <Fragment key={i}>
          <span className={i % 3 === 1 ? 'ghost' : ''}>{it}</span>
          <span className="star" />
        </Fragment>
      ))}
    </Fragment>
  );
  return (
    <div className="marquee" id="marquee">
      <div className="track">
        {row}
        {row}
      </div>
    </div>
  );
}

function ModelCard() {
  const ref = useRef<HTMLDivElement>(null);
  useSpotlight(ref);
  return (
    <div className="model-card" ref={ref}>
      <div className="mc-header">
        <span className="mc-title">JPT — model_card.yaml</span>
        <span className="mc-tag">v2026.5</span>
      </div>
      <div className="mc-row">
        <span className="k">parameters</span>
        <span className="v">≈ 21.4 yrs · trained</span>
        <span className="badge">STABLE</span>
      </div>
      <div className="mc-row">
        <span className="k">context_window</span>
        <span className="v">multi-stack, polyglot</span>
        <span className="badge">128k</span>
      </div>
      <div className="mc-row">
        <span className="k">primary_domain</span>
        <span className="v">AI + product engineering</span>
        <span className="badge">CORE</span>
      </div>
      <div className="mc-row">
        <span className="k">latency</span>
        <span className="v">async · ships fast</span>
        <span className="badge live">LIVE</span>
      </div>
      <div className="mc-row">
        <span className="k">temperature</span>
        <span className="v">0.7 — calibrated curiosity</span>
        <span className="badge">TUNED</span>
      </div>
      <div className="mc-row">
        <span className="k">deployments</span>
        <span className="v">
          <CountUp to={24} /> production
        </span>
        <span className="badge">PROD</span>
      </div>
      <div className="mc-row">
        <span className="k">fine_tuned_on</span>
        <span className="v">LLMs, agents, RAG, Tauri</span>
        <span className="badge">∇</span>
      </div>
      <div className="mc-row">
        <span className="k">availability</span>
        <span className="v">accepting client work</span>
        <span className="badge live">OPEN</span>
      </div>
      <div className="mc-footer">
        <span>sha: a1f7…c93b</span>
        <span>last_eval: today</span>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="section" id="about">
      <div
        className="section-head"
        style={{ maxWidth: 1400, margin: '0 auto 64px' }}
      >
        <div>
          <div className="section-mark">
            <span className="num">§</span> 02 · IDENTITY
          </div>
          <h2 className="section-title">
            A builder who treats <span className="em">models</span> like
            materials.
          </h2>
        </div>
      </div>
      <div className="about-grid">
        <div className="about-bio">
          <div className="portrait">
            <span className="face-mono">
              [ HEAD_SHOT · 4 / 5 ] — drop image here
            </span>
          </div>
          <p>
            Computer Science graduate from{' '}
            <span className="muted">Ateneo de Naga University</span> and
            founder of <strong>Appnado IT Solutions</strong>. I build
            AI-driven applications, full-stack systems, and automation tools.
          </p>
          <p>
            I work at the intersection of{' '}
            <strong>LLMs, agents, and product engineering</strong> — turning
            models into things people actually use.
          </p>
          <div className="signature">
            <span className="swatch" />
            <span>JP TAYCO · MNL · BUILDING_FOR_THE_WORLD</span>
          </div>
        </div>
        <ModelCard />
      </div>
    </section>
  );
}

// ============== TECH STACK BENTO ==============

type TileProps = {
  children: ReactNode;
  span?: number;
  row?: number;
  label: string;
  count?: number;
};

function Tile({ children, span, row, label, count }: TileProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSpotlight(ref);
  const cls = ['tile'];
  if (span) cls.push('span-' + span);
  if (row === 2) cls.push('row-2');
  return (
    <div ref={ref} className={cls.join(' ')}>
      <div className="tile-label">
        <span>{label}</span>
        {count != null && (
          <span className="count">{String(count).padStart(2, '0')}</span>
        )}
      </div>
      {children}
    </div>
  );
}

export function TechStack() {
  return (
    <section className="section" id="stack">
      <div
        className="section-head"
        style={{ maxWidth: 1400, margin: '0 auto 64px' }}
      >
        <div>
          <div className="section-mark">
            <span className="num">§</span> 03 · TOOLING
          </div>
          <h2 className="section-title">
            Stack that ships <span className="em">fast.</span>
          </h2>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--muted)',
            fontSize: 12,
            letterSpacing: '0.08em',
            maxWidth: '40ch',
            textAlign: 'right',
          }}
        >
          A bento of the tools I reach for daily. Hover any tile — the cursor
          pulls the glow.
        </div>
      </div>

      <div className="bento">
        <Tile span={6} row={2} label="// AI & ML" count={9}>
          <div className="tile-h">From prompt to production agent.</div>
          <div className="chip-row">
            <span className="chip">OpenAI API</span>
            <span className="chip">Claude API</span>
            <span className="chip">LangChain</span>
            <span className="chip">LangGraph</span>
            <span className="chip">RAG</span>
            <span className="chip">Pinecone</span>
            <span className="chip">pgvector</span>
            <span className="chip">Agents</span>
            <span className="chip">Fine-tuning</span>
          </div>
          <div
            style={{
              marginTop: 24,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Currently composing multi-agent systems with{' '}
            <span style={{ color: 'var(--cyan)' }}>LangGraph</span> + tool
            routers.
          </div>
        </Tile>

        <Tile span={6} label="// LANGUAGES" count={6}>
          <div className="tile-h">Polyglot, opinion-light.</div>
          <div className="chip-row">
            <span className="chip">TypeScript</span>
            <span className="chip">Python</span>
            <span className="chip">Go</span>
            <span className="chip">Rust</span>
            <span className="chip">C#</span>
            <span className="chip">JavaScript</span>
          </div>
        </Tile>

        <Tile span={3} label="// FRAMEWORKS" count={7}>
          <div className="tile-h">UI · API · Edge.</div>
          <div className="chip-row">
            <span className="chip">Next.js</span>
            <span className="chip">React</span>
            <span className="chip">FastAPI</span>
            <span className="chip">Node</span>
            <span className="chip">Tauri</span>
            <span className="chip">Astro</span>
            <span className="chip">Tailwind</span>
          </div>
        </Tile>

        <Tile span={3} label="// CLOUD" count={7}>
          <div className="tile-h">Boring infra, fast pipes.</div>
          <div className="chip-row">
            <span className="chip">Docker</span>
            <span className="chip">AWS</span>
            <span className="chip">Vercel</span>
            <span className="chip">Supabase</span>
            <span className="chip">Postgres</span>
            <span className="chip">Redis</span>
            <span className="chip">Edge Fn</span>
          </div>
        </Tile>

        <Tile span={4} label="// TOOLS" count={5}>
          <div className="tile-h">Daily drivers.</div>
          <div className="chip-row">
            <span className="chip">Git</span>
            <span className="chip">Linux</span>
            <span className="chip">n8n</span>
            <span className="chip">Playwright</span>
            <span className="chip">Cursor</span>
          </div>
        </Tile>

        <Tile span={8} label="// PHILOSOPHY">
          <div
            className="tile-h"
            style={{
              fontSize: 'clamp(22px, 2vw, 30px)',
              lineHeight: 1.2,
              fontWeight: 500,
              maxWidth: '34ch',
            }}
          >
            “Models are{' '}
            <span
              style={{
                background: 'var(--grad)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              materials
            </span>{' '}
            — the craft is in the surface around them.”
          </div>
          <div
            style={{
              marginTop: 20,
              display: 'flex',
              gap: 32,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            <div>
              <span style={{ color: 'var(--amber)' }}>↳</span> ship beats
              polish
            </div>
            <div>
              <span style={{ color: 'var(--amber)' }}>↳</span> measure, then
              optimize
            </div>
            <div>
              <span style={{ color: 'var(--amber)' }}>↳</span> taste =
              compression
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}

// ============== TIMELINE (HORIZONTAL PINNED) ==============

const TL = [
  {
    year: '2024 — PRESENT',
    title: 'Founder · AI / Full-Stack Engineer',
    org: 'Appnado IT Solutions',
    body: 'Building AI-powered products end-to-end. Managing client engagements, shipping to production, scaling from MVP to revenue.',
    tags: ['Founding', 'LLM Apps', 'Clients', 'Production'],
  },
  {
    year: '2022 — 2024',
    title: 'Freelance Software Developer',
    org: 'Upwork · International Clients',
    body: 'Web apps, automation tools, and a C# trading automation bot. Worked async with teams across timezones — learned to deliver under ambiguity.',
    tags: ['Web Apps', 'Automation', 'C#', 'Remote'],
  },
  {
    year: 'MAY — JUL 2024',
    title: 'Software Developer Intern',
    org: 'ICTC · Ateneo de Naga University',
    body: 'Embedded in a real dev team — UI/UX improvements, system optimization, and the kind of legacy-codebase battle scars only an internship can give you.',
    tags: ['UI/UX', 'Optimization', 'Team'],
  },
  {
    year: '2021 — 2025',
    title: 'BS Computer Science',
    org: 'Ateneo de Naga University',
    body: 'Four years of fundamentals, late-night side projects, and the slow realization that the curriculum is a starting point, not the destination.',
    tags: ['CS', 'Foundations'],
  },
  {
    year: '2019 — 2021',
    title: 'STEM Senior High',
    org: 'Ateneo de Naga University',
    body: 'First lines of code. First sleepless deploy. The Hello World era.',
    tags: ['Origin'],
  },
];

export function Timeline() {
  const wrapRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const strip = stripRef.current;
    if (!wrap || !strip) return;
    const onScroll = () => {
      const r = wrap.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, -r.top / total));
      setProgress(p);
      const stripW = strip.scrollWidth;
      const parent = strip.parentElement;
      if (!parent) return;
      const viewW = parent.clientWidth;
      const maxX = stripW - viewW;
      strip.style.transform = `translate3d(${-p * maxX}px, 0, 0)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="timeline" ref={wrapRef} className="timeline-wrap">
      <div className="timeline-sticky">
        <div className="tl-head">
          <div>
            <div className="section-mark">
              <span className="num">§</span> 04 · TRAJECTORY
            </div>
            <h2 style={{ margin: '14px 0 0' }}>
              Path so far —{' '}
              <span
                style={{
                  background: 'var(--grad)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}
              >
                scroll →
              </span>
            </h2>
          </div>
          <div className="tl-progress">
            <div style={{ marginBottom: 6 }}>
              {String(Math.round(progress * 100)).padStart(3, '0')}% ·{' '}
              {Math.min(TL.length, Math.floor(progress * TL.length) + 1)} /{' '}
              {TL.length}
            </div>
            <div
              style={{
                width: 160,
                height: 1,
                background: 'var(--line)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: progress * 100 + '%',
                  background:
                    'linear-gradient(90deg, var(--violet), var(--cyan))',
                }}
              />
            </div>
          </div>
        </div>
        <div className="timeline-track">
          <div className="timeline-strip" ref={stripRef}>
            {TL.map((t, i) => (
              <div className="tl-card" key={i}>
                <span className="tl-idx">
                  {String(i + 1).padStart(2, '0')} /{' '}
                  {String(TL.length).padStart(2, '0')}
                </span>
                <span className="tl-year">{t.year}</span>
                <h3>{t.title}</h3>
                <div className="tl-org">{t.org}</div>
                <div className="tl-body">{t.body}</div>
                <div className="tl-tags">
                  {t.tags.map((tg) => (
                    <span key={tg} className="tl-tag">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div
              className="tl-card"
              style={{
                background: 'transparent',
                border: '1px dashed var(--line-strong)',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--muted)',
                  fontSize: 11,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                NEXT CHAPTER
              </div>
              <h3 style={{ margin: '14px 0 8px', maxWidth: '14ch' }}>
                Maybe{' '}
                <span
                  style={{
                    background: 'var(--grad)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    fontStyle: 'italic',
                  }}
                >
                  with you
                </span>
                ?
              </h3>
              <a
                href="#contact"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'var(--cyan)',
                  textDecoration: 'none',
                }}
                data-cursor="WRITE"
              >
                say hi →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
