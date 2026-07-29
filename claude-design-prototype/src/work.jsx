/* Selected work (tilt cards) · GitHub activity · Terminal · Contact. */

// ============== WORK ==============

const PROJECTS = [
  {
    id: 'p-1',
    num: '01',
    year: '2024',
    kind: 'DESKTOP · GOVTECH',
    title: 'Barangay Management System',
    blurb: 'Offline-first desktop system for local government records — citizen registry, permits, and PDF certificate generation. Built for low-connectivity municipalities.',
    stack: ['Tauri', 'React', 'Go', 'MySQL', 'PDF-gen'],
    viz: 'records',
  },
  {
    id: 'p-2',
    num: '02',
    year: '2024',
    kind: 'WEB · AI-NATIVE',
    title: 'AI Portfolio Platform',
    blurb: 'Interactive portfolio engine with live AI chat, embedded terminal, and scroll-driven motion. Visitors can literally ask the site questions about the person it represents.',
    stack: ['Next.js', 'Framer Motion', 'Claude API', 'Edge'],
    viz: 'chat',
  },
  {
    id: 'p-3',
    num: '03',
    year: '2024',
    kind: 'AUTOMATION · FINTECH',
    title: 'Trading Automation System',
    blurb: 'Real-time automated trading bot wired to broker APIs with a predictive strategy module. Backtested, paper-traded, and shipped to a live account.',
    stack: ['C#', '.NET', 'REST APIs', 'WebSockets'],
    viz: 'graph',
  },
];

function WorkCard({ p }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rx = 0, ry = 0, tx = 0, ty = 0;
    let raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - r.left) / r.width;
      const my = (e.clientY - r.top) / r.height;
      tx = (mx - 0.5) * 8;
      ty = -(my - 0.5) * 8;
      el.style.setProperty('--mx', (mx * 100) + '%');
      el.style.setProperty('--my', (my * 100) + '%');
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      rx += (ty - rx) * 0.12;
      ry += (tx - ry) * 0.12;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      raf = requestAnimationFrame(tick);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <article id={p.id} ref={ref} className="work-card" data-cursor="VIEW">
      <div>
        <div className="w-meta">
          <span className="w-num">/{p.num}</span>
          <span>{p.year}</span>
          <span>{p.kind}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.blurb}</p>
        <div className="w-stack">
          {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
        </div>
      </div>
      <div className="w-viz">
        <ProjectViz kind={p.viz} />
      </div>
    </article>
  );
}

function ProjectViz({ kind }) {
  if (kind === 'records') {
    return (
      <React.Fragment>
        <div className="viz-grid" />
        <div style={{ position: 'absolute', inset: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 6, padding: 8, display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }}>
              <span>RES-{String(2487 + i).padStart(4, '0')}</span>
              <span style={{ color: i % 2 === 0 ? '#22c55e' : 'var(--amber)' }}>● {i % 2 === 0 ? 'CERT' : 'PEND'}</span>
            </div>
          ))}
        </div>
        <div className="viz-label">RECORDS · PDF GEN · OFFLINE</div>
      </React.Fragment>
    );
  }
  if (kind === 'chat') {
    return (
      <React.Fragment>
        <div className="viz-blob" />
        <div style={{ position: 'absolute', inset: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
          <div style={{ alignSelf: 'flex-end', background: 'var(--grad)', color: '#fff', padding: '8px 12px', borderRadius: '12px 12px 4px 12px', fontFamily: 'var(--font-mono)', fontSize: 11, maxWidth: '80%' }}>
            who built this site?
          </div>
          <div style={{ background: 'var(--surface-3)', color: 'var(--text)', padding: '8px 12px', borderRadius: '12px 12px 12px 4px', fontFamily: 'var(--font-mono)', fontSize: 11, maxWidth: '90%' }}>
            i did — and i'm streaming this reply through Claude...<span style={{ display: 'inline-block', width: 6, height: 12, background: 'var(--cyan)', verticalAlign: 'middle', marginLeft: 4 }} />
          </div>
        </div>
        <div className="viz-label">LLM · STREAMING · EDGE</div>
      </React.Fragment>
    );
  }
  // graph
  return (
    <React.Fragment>
      <div className="viz-grid" />
      <svg viewBox="0 0 400 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(124,58,237,0.5)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </linearGradient>
        </defs>
        <path d="M0,140 L40,120 L80,135 L120,90 L160,105 L200,70 L240,85 L280,40 L320,55 L360,30 L400,45 L400,200 L0,200 Z" fill="url(#g1)" />
        <path d="M0,140 L40,120 L80,135 L120,90 L160,105 L200,70 L240,85 L280,40 L320,55 L360,30 L400,45" fill="none" stroke="#06B6D4" strokeWidth="1.5" />
        {[120, 200, 280, 360].map((x, i) => (
          <circle key={i} cx={x} cy={[90, 70, 40, 30][i]} r="3" fill="#FBBF24" />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--amber)' }}>+24.7%</div>
      <div className="viz-label">PnL · LIVE · 7D</div>
    </React.Fragment>
  );
}

function Work() {
  return (
    <section className="section" id="work">
      <div className="section-head" style={{ maxWidth: 1400, margin: '0 auto 64px' }}>
        <div>
          <div className="section-mark"><span className="num">§</span> 05 · WORK</div>
          <h2 className="section-title">Selected <span className="em">work.</span></h2>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--muted)', fontSize: 12, letterSpacing: '0.08em' }}>
          {PROJECTS.length} OF 12 SHOWN
        </div>
      </div>
      <div className="work-list">
        {PROJECTS.map((p) => <WorkCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

// ============== GITHUB ==============

function GHGraph() {
  // 53 weeks × 7 days
  const cells = useMemo(() => {
    const out = [];
    const rng = (n) => Math.sin(n * 12.9898) * 43758.5453 % 1;
    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const r = Math.abs(rng(w * 7 + d + 1));
        // bias toward higher near recent weeks
        const recencyBoost = w > 40 ? 0.3 : w > 28 ? 0.15 : 0;
        const lvl = Math.min(4, Math.floor((r + recencyBoost) * 5));
        out.push(lvl);
      }
    }
    return out;
  }, []);

  const [animatedCount, setAnimatedCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const total = cells.length;
    const step = () => {
      i += 24;
      setAnimatedCount(Math.min(total, i));
      if (i < total) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, cells.length]);

  return (
    <div className="gh-graph" ref={ref}>
      <div className="gh-h">
        <div className="name"><span className="at">@</span>jptaycs · contribution graph</div>
        <div className="live"><span className="dot" />LIVE · last 12 mo</div>
      </div>
      <div className="gh-cells">
        {cells.map((lvl, i) => (
          <div
            key={i}
            className={'gh-cell' + (i < animatedCount && lvl > 0 ? ' l' + lvl : '')}
            title={lvl + ' contributions'}
          />
        ))}
      </div>
      <div className="gh-legend">
        <span>LESS</span>
        <div className="legend-cells">
          <span style={{ background: 'var(--surface-2)' }} />
          <span style={{ background: 'rgba(124,58,237,0.25)' }} />
          <span style={{ background: 'rgba(124,58,237,0.5)' }} />
          <span style={{ background: 'rgba(124,58,237,0.75)' }} />
          <span style={{ background: 'var(--violet)' }} />
        </div>
        <span>MORE</span>
        <span style={{ marginLeft: 'auto', color: 'var(--text)' }}>
          <CountUp to={1247} /> contributions · last year
        </span>
      </div>
    </div>
  );
}

function Terminal() {
  const lines = [
    { p: '~ ', cmd: 'whoami' },
    { out: 'jp-tayco' },
    { out: 'ai-engineer · founder@appnado' },
    { sp: true },
    { p: '~ ', cmd: 'cat ./skills.json' },
    { out: '{' },
    { out: '  "ai":       ["openai", "claude", "langgraph", "rag"],', tone: 'key' },
    { out: '  "lang":     ["ts", "py", "go", "rust", "c#"],', tone: 'key' },
    { out: '  "stack":    ["next.js", "fastapi", "tauri"],', tone: 'key' },
    { out: '  "shipping": true' },
    { out: '}' },
    { sp: true },
    { p: '~ ', cmd: 'curl -s status.jpt' },
    { out: '200 OK · accepting clients · response ~6h', tone: 'ok' },
    { sp: true },
    { p: '~ ', cmd: 'echo $NEXT', cursor: true },
  ];
  const [shown, setShown] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { threshold: 0.3 });
  useEffect(() => {
    if (!inView) return;
    let t;
    const tick = () => {
      setShown((s) => {
        if (s >= lines.length) return s;
        t = setTimeout(tick, lines[s].cmd ? 240 : lines[s].sp ? 80 : 120);
        return s + 1;
      });
    };
    t = setTimeout(tick, 200);
    return () => clearTimeout(t);
  }, [inView]);

  return (
    <section className="section" id="terminal-section" style={{ paddingTop: 80 }}>
      <div className="section-head" style={{ maxWidth: 1400, margin: '0 auto 36px' }}>
        <div>
          <div className="section-mark"><span className="num">§</span> 06 · LIVE</div>
          <h2 className="section-title" style={{ maxWidth: '18ch' }}>Always something <span className="em">streaming.</span></h2>
        </div>
      </div>
      <div className="terminal" ref={ref}>
        <div className="term-bar">
          <span className="tdot r" /><span className="tdot y" /><span className="tdot g" />
          <span className="ttl">jpt@portfolio — zsh — 96×24</span>
        </div>
        <div className="term-body">
          {lines.slice(0, shown).map((l, i) => {
            if (l.sp) return <div key={i}>&nbsp;</div>;
            if (l.cmd) return (
              <div key={i}>
                <span className="prompt">{l.p}</span>
                <span className="user">$ </span>
                <span>{l.cmd}</span>
                {l.cursor && <span className="cursor-blink" />}
              </div>
            );
            return (
              <div key={i} className={l.tone === 'key' ? 'key' : l.tone === 'ok' ? 'ok' : ''}>{l.out}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GitHubSection() {
  return (
    <section className="section" id="github">
      <div className="section-head" style={{ maxWidth: 1400, margin: '0 auto 64px' }}>
        <div>
          <div className="section-mark"><span className="num">§</span> 07 · ACTIVITY</div>
          <h2 className="section-title">A quiet hum of <span className="em">commits.</span></h2>
        </div>
      </div>
      <div className="gh-grid">
        <GHGraph />
        <div className="gh-stats">
          <div className="gh-stat">
            <div className="stat-l">Public repos<br />maintained</div>
            <div className="stat-v grad"><CountUp to={37} /></div>
          </div>
          <div className="gh-stat">
            <div className="stat-l">Stars across<br />my projects</div>
            <div className="stat-v"><CountUp to={284} /></div>
          </div>
          <div className="gh-stat">
            <div className="stat-l">Followers<br />from the dev community</div>
            <div className="stat-v amber"><CountUp to={142} /></div>
          </div>
          <div className="gh-stat">
            <div className="stat-l">PRs shipped<br />this year</div>
            <div className="stat-v"><CountUp to={418} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============== CONTACT ==============

function Contact() {
  const [hover, setHover] = useState(false);
  const email = 'jptayco1109@gmail.com';
  const [copied, setCopied] = useState(false);
  const copy = (e) => {
    e.preventDefault();
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="contact" id="contact">
      <div className="ct-grad" />
      <div style={{ maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
        <div className="ct-eyebrow">§ 08 · LET'S WORK · ESTIMATED RESPONSE 6 HRS</div>
        <h2 style={{ fontSize: 'clamp(40px, 6vw, 90px)', letterSpacing: '-0.04em', fontWeight: 700, margin: '0 0 56px', maxWidth: '20ch', lineHeight: 0.96 }}>
          Got a hard problem, a vague idea, or a deadline that's already <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontStyle: 'italic', fontWeight: 500 }}>yesterday</span>?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a
            href={'mailto:' + email}
            className="ct-mail"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            data-cursor="WRITE"
          >
            {[...email].map((c, i) => (
              <span
                key={i}
                className="ml"
                style={{ transitionDelay: hover ? (i * 12) + 'ms' : '0ms' }}
              >{c}</span>
            ))}
          </a>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <button onClick={copy} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', padding: '8px 14px', border: '1px solid var(--line-strong)', borderRadius: 999, letterSpacing: '0.08em', textTransform: 'uppercase' }} data-cursor={copied ? 'COPIED' : 'COPY'}>
              {copied ? '✓ COPIED' : 'COPY EMAIL'}
            </button>
            <a href="https://github.com/jptaycs" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>GITHUB ↗</a>
            <a href="https://www.linkedin.com/in/jerome-patrick-tayco-442873264/" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>LINKEDIN ↗</a>
          </div>
        </div>

        <div className="ct-foot">
          <div className="col">
            <span className="head">DESIGNED & BUILT</span>
            <span style={{ color: 'var(--text)' }}>JP Tayco · 2026</span>
            <span>Philippines · UTC+8 · MNL</span>
          </div>
          <div className="col">
            <span className="head">SOCIAL</span>
            <a href="mailto:jptayco1109@gmail.com">jptayco1109@gmail.com</a>
            <a href="https://github.com/jptaycs" target="_blank">github.com/jptaycs</a>
            <a href="https://www.linkedin.com/in/jerome-patrick-tayco-442873264/" target="_blank">linkedin · jerome-patrick-r-tayco</a>
          </div>
          <div className="col" style={{ textAlign: 'right' }}>
            <span className="head">SITE</span>
            <span>v3.0.1 · built with React</span>
            <span>press ⌘K to navigate</span>
            <span style={{ color: '#22c55e' }}>● ALL SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Work, Terminal, GitHubSection, Contact });
