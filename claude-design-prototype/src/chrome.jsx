/* Cursor, header, command palette, ask-portfolio bubble, scroll rail. */

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState(null);
  useEffect(() => {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    const onMove = (e) => { x = e.clientX; y = e.clientY; };
    window.addEventListener('pointermove', onMove);
    let raf;
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover detection on interactive elements
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      if (t) {
        setLabel(t.getAttribute('data-cursor') || 'hover');
      } else if (e.target.closest('a,button,input,.tile,.work-card,.tl-card,.cmdk-item,.ask-suggest button,.gh-cell')) {
        setLabel('__hover');
      } else {
        setLabel(null);
      }
    };
    window.addEventListener('pointerover', onOver);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  const ringClass = label === '__hover' ? 'cursor-ring is-hover' : label ? 'cursor-ring is-label' : 'cursor-ring';

  return (
    <React.Fragment>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={ringClass}>
        {label && label !== '__hover' ? label : null}
      </div>
    </React.Fragment>
  );
}

function Header({ onOpenCmdk, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="h-left">
        <span className="dot" />
        <span>JPT — AVAILABLE FOR WORK · MNL UTC+8</span>
      </div>
      <div className="h-right">
        <a href="#work">WORK</a>
        <a href="#stack">STACK</a>
        <a href="#timeline">PATH</a>
        <a href="#contact">CONTACT</a>
        <button className="kbd-cta" onClick={onOpenCmdk} data-cursor="OPEN">
          <span className="kbd">⌘</span><span className="kbd">K</span>
          <span style={{ marginLeft: 4 }}>SEARCH</span>
        </button>
        <button onClick={onToggleTheme} data-cursor={theme === 'dark' ? 'LIGHT' : 'DARK'} aria-label="Toggle theme">
          {theme === 'dark' ? '☾' : '☀'}
        </button>
      </div>
    </header>
  );
}

const SECTIONS = [
  { id: 'hero', label: 'Index' },
  { id: 'stack', label: 'Stack' },
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Path' },
  { id: 'work', label: 'Work' },
  { id: 'github', label: 'Live' },
  { id: 'contact', label: 'Contact' },
];

function ScrollRail() {
  const p = useScrollProgress();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.4;
      let cur = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) cur = i;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-rail">
      <div className="rail-num">{String(active + 1).padStart(2, '0')}</div>
      <div className="rail-track">
        <div className="rail-fill" style={{ height: (p * 100) + '%' }} />
      </div>
      <div className="rail-dots">
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={'#' + s.id} title={s.label}>
            <span className={'rail-dot' + (i === active ? ' active' : '')} />
          </a>
        ))}
      </div>
      <div className="rail-num">{String(SECTIONS.length).padStart(2, '0')}</div>
    </div>
  );
}

// ========== COMMAND PALETTE ==========
const CMDK_ITEMS = [
  { group: 'Navigate', label: 'Go to Work', kbd: '⏎', action: () => { document.getElementById('work').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Navigate', label: 'Go to Stack', kbd: '⏎', action: () => { document.getElementById('stack').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Navigate', label: 'Go to Timeline', kbd: '⏎', action: () => { document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Navigate', label: 'Go to Contact', kbd: '⏎', action: () => { document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Quick Actions', label: 'Copy email — jptayco1109@gmail.com', kbd: '⌘C', action: () => { navigator.clipboard?.writeText('jptayco1109@gmail.com'); } },
  { group: 'Quick Actions', label: 'Download Resume (PDF)', kbd: '⌘D', action: () => { alert('Resume download — wire up to PDF asset.'); } },
  { group: 'Quick Actions', label: 'Open "Ask my portfolio" chat', kbd: '⌘/', action: () => { window.dispatchEvent(new CustomEvent('open-ask')); } },
  { group: 'Projects', label: 'View — Barangay Management System', kbd: 'GO', action: () => { document.getElementById('p-1').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Projects', label: 'View — AI Portfolio Platform', kbd: 'GO', action: () => { document.getElementById('p-2').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Projects', label: 'View — Trading Automation System', kbd: 'GO', action: () => { document.getElementById('p-3').scrollIntoView({ behavior: 'smooth' }); } },
  { group: 'Social', label: 'GitHub — @jptaycs', kbd: '↗', action: () => { window.open('https://github.com/jptaycs', '_blank'); } },
  { group: 'Social', label: 'LinkedIn — jerome-patrick-r-tayco', kbd: '↗', action: () => { window.open('https://linkedin.com/in/jerome-patrick-r-tayco-442873264', '_blank'); } },
];

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ(''); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CMDK_ITEMS;
    return CMDK_ITEMS.filter((i) => (i.label + ' ' + i.group).toLowerCase().includes(s));
  }, [q]);

  const grouped = useMemo(() => {
    const out = {};
    filtered.forEach((it) => { (out[it.group] ||= []).push(it); });
    return out;
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      if (e.key === 'Enter') {
        e.preventDefault();
        const it = filtered[active];
        if (it) { it.action(); onClose(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, active, onClose]);

  if (!open) return null;

  let runningIdx = 0;
  return (
    <div className="cmdk-back" onClick={onClose}>
      <div className="cmdk" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-search">
          <span className="ico">⌘</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            placeholder="Type a command, search projects, copy email…"
          />
          <span className="kbd">esc</span>
        </div>
        <div className="cmdk-list">
          {Object.entries(grouped).map(([g, items]) => (
            <div key={g}>
              <div className="cmdk-group">{g}</div>
              {items.map((it) => {
                const idx = runningIdx++;
                return (
                  <div
                    key={it.label}
                    className={'cmdk-item' + (idx === active ? ' active' : '')}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => { it.action(); onClose(); }}
                  >
                    <span className="ico">→</span>
                    <span>{it.label}</span>
                    <span className="kbd-r">{it.kbd}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cmdk-item" style={{ color: 'var(--muted)' }}>No results for "{q}"</div>
          )}
        </div>
        <div className="cmdk-foot">
          <span>↑↓ NAV</span>
          <span>⏎ SELECT</span>
          <span>ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}

// ========== ASK MY PORTFOLIO ==========
const ASK_SUGGESTIONS = [
  'What are you building right now?',
  'Tell me about your AI experience',
  'What stack do you prefer?',
  'How do I hire you?',
];

const ASK_CONTEXT = `You are answering as JP Tayco's portfolio assistant. Speak in first person as JP (full name Jerome Patrick Tayco, but he goes by JP).

About JP:
- AI Engineer & Software Developer based in the Philippines, building for the world.
- BS Computer Science, Ateneo de Naga University (2021-2025).
- Founder & AI/Full-Stack Engineer at Appnado IT Solutions (2024-present). Builds AI-powered products end-to-end.
- 2022-2024 freelance on Upwork — international clients, web apps, automation, C# trading bot.
- May-Jul 2024 software dev intern at ICTC, Ateneo de Naga.

Stack:
- AI/ML: OpenAI API, Claude API, LangChain, LangGraph, RAG, Pinecone/pgvector, agents, prompt eng, fine-tuning.
- Languages: TypeScript, Python, Go, Rust, C#, JS.
- Frameworks: Next.js, React, FastAPI, Node.js, Tauri, Astro, Tailwind.
- Cloud: Docker, AWS, Vercel, Supabase, Postgres, Redis, Edge Functions.

Selected work:
- Barangay Management System (2024, Tauri/React/Go/MySQL) — offline desktop system for local government records with PDF cert gen.
- AI Portfolio Platform (2024, Next.js/Framer Motion/Claude API) — interactive portfolio with live AI chat and terminal interface.
- Trading Automation System (2024, C#/.NET) — real-time automated trading bot with predictive strategy.

Contact: jptayco1109@gmail.com · github.com/jptaycs · linkedin.com/in/jerome-patrick-r-tayco-442873264

Keep replies short (2-4 sentences), conversational, and confident. No markdown bullets.`;

function AskPortfolio() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey — I'm JP's portfolio assistant. Ask me about projects, stack, or how to work together." }
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const msgsRef = useRef(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-ask', handler);
    return () => window.removeEventListener('open-ask', handler);
  }, []);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, streaming]);

  const send = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || streaming) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: userText }, { role: 'bot', text: '', streaming: true }]);
    setStreaming(true);
    try {
      const prompt = ASK_CONTEXT + '\n\nVisitor asks: ' + userText + '\n\nReply as JP:';
      const result = await window.claude.complete(prompt);
      // simulate token streaming
      const chunks = result.split(/(\s+)/);
      let acc = '';
      for (let i = 0; i < chunks.length; i++) {
        acc += chunks[i];
        await new Promise((r) => setTimeout(r, 18));
        setMessages((m) => {
          const next = m.slice();
          next[next.length - 1] = { role: 'bot', text: acc, streaming: i < chunks.length - 1 };
          return next;
        });
      }
    } catch (err) {
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = { role: 'bot', text: "Hmm, I couldn't reach the model. Try again in a sec, or email me at jptayco1109@gmail.com.", streaming: false };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="ask-bubble">
      {open && (
        <div className="ask-panel">
          <div className="ask-head">
            <div className="t">
              <span className="gem" />
              <span>Ask JP</span>
              <span className="sub">· streaming</span>
            </div>
            <button className="x" onClick={() => setOpen(false)}>CLOSE ✕</button>
          </div>
          <div className="ask-msgs" ref={msgsRef}>
            {messages.map((m, i) => (
              <div key={i} className={'ask-msg ' + m.role}>
                {m.text}
                {m.streaming && <span className="stream-cursor" />}
              </div>
            ))}
          </div>
          {messages.length <= 2 && (
            <div className="ask-suggest">
              {ASK_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
          <form className="ask-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={streaming ? 'Streaming…' : 'Ask anything…'}
              disabled={streaming}
            />
            <button type="submit" disabled={streaming || !input.trim()}>↑</button>
          </form>
        </div>
      )}
      <button className="ask-fab" onClick={() => setOpen((o) => !o)} data-cursor={open ? 'CLOSE' : 'CHAT'}>
        <span className="gem" />
        <span>{open ? 'Close chat' : 'Ask my portfolio'}</span>
      </button>
    </div>
  );
}

Object.assign(window, { CustomCursor, Header, ScrollRail, CommandPalette, AskPortfolio });
