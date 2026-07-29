'use client';

/* Cursor, header, command palette, ask-portfolio bubble, scroll rail. */

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { useScrollProgress } from './utils';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    let x = window.innerWidth / 2,
      y = window.innerHeight / 2;
    let rx = x,
      ry = y;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener('pointermove', onMove);
    let raf: number;
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const t = target?.closest('[data-cursor]');
      if (t) {
        setLabel(t.getAttribute('data-cursor') || 'hover');
      } else if (
        target?.closest(
          'a,button,input,.tile,.work-card,.tl-card,.cmdk-item,.ask-suggest button,.gh-cell'
        )
      ) {
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

  const ringClass =
    label === '__hover'
      ? 'cursor-ring is-hover'
      : label
      ? 'cursor-ring is-label'
      : 'cursor-ring';

  return (
    <Fragment>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={ringClass}>
        {label && label !== '__hover' ? label : null}
      </div>
    </Fragment>
  );
}

type HeaderProps = {
  onOpenCmdk: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function Header({ onOpenCmdk, theme, onToggleTheme }: HeaderProps) {
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
        <a href="/Updated-CV-Tayco.pdf" download="Updated-CV-Tayco.pdf" data-cursor="DOWNLOAD">
          CV ↓
        </a>
        <button className="kbd-cta" onClick={onOpenCmdk} data-cursor="OPEN">
          <span className="kbd">⌘</span>
          <span className="kbd">K</span>
          <span style={{ marginLeft: 4 }}>SEARCH</span>
        </button>
        <button
          onClick={onToggleTheme}
          data-cursor={theme === 'dark' ? 'LIGHT' : 'DARK'}
          aria-label="Toggle theme"
        >
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

export function ScrollRail() {
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
        <div className="rail-fill" style={{ height: p * 100 + '%' }} />
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

type CmdkItem = {
  group: string;
  label: string;
  kbd: string;
  action: () => void;
};

const CMDK_ITEMS: CmdkItem[] = [
  {
    group: 'Navigate',
    label: 'Go to Work',
    kbd: '⏎',
    action: () => {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Navigate',
    label: 'Go to Stack',
    kbd: '⏎',
    action: () => {
      document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Navigate',
    label: 'Go to Timeline',
    kbd: '⏎',
    action: () => {
      document
        .getElementById('timeline')
        ?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Navigate',
    label: 'Go to Contact',
    kbd: '⏎',
    action: () => {
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Quick Actions',
    label: 'Copy email — jptayco2002@gmail.com',
    kbd: '⌘C',
    action: () => {
      navigator.clipboard?.writeText('jptayco2002@gmail.com');
    },
  },
  {
    group: 'Quick Actions',
    label: 'Download Resume (PDF)',
    kbd: '⌘D',
    action: () => {
      const link = document.createElement('a');
      link.href = '/Updated-CV-Tayco.pdf';
      link.download = 'Updated-CV-Tayco.pdf';
      link.click();
    },
  },
  {
    group: 'Quick Actions',
    label: 'Open "Ask my portfolio" chat',
    kbd: '⌘/',
    action: () => {
      window.dispatchEvent(new CustomEvent('open-ask'));
    },
  },
  {
    group: 'Projects',
    label: 'View — Barangay Management System',
    kbd: 'GO',
    action: () => {
      document.getElementById('p-1')?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Projects',
    label: 'View — AI Portfolio Platform',
    kbd: 'GO',
    action: () => {
      document.getElementById('p-2')?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Projects',
    label: 'View — Trading Automation System',
    kbd: 'GO',
    action: () => {
      document.getElementById('p-3')?.scrollIntoView({ behavior: 'smooth' });
    },
  },
  {
    group: 'Social',
    label: 'GitHub — @jptaycs',
    kbd: '↗',
    action: () => {
      window.open('https://github.com/jptaycs', '_blank');
    },
  },
  {
    group: 'Social',
    label: 'LinkedIn — jerome-patrick-r-tayco',
    kbd: '↗',
    action: () => {
      window.open(
        'https://www.linkedin.com/in/jerome-patrick-tayco-442873264/',
        '_blank'
      );
    },
  },
];

type CommandPaletteProps = { open: boolean; onClose: () => void };

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return CMDK_ITEMS;
    return CMDK_ITEMS.filter((i) =>
      (i.label + ' ' + i.group).toLowerCase().includes(s)
    );
  }, [q]);

  const grouped = useMemo(() => {
    const out: Record<string, CmdkItem[]> = {};
    filtered.forEach((it) => {
      (out[it.group] ||= []).push(it);
    });
    return out;
  }, [filtered]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const it = filtered[active];
        if (it) {
          it.action();
          onClose();
        }
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
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
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
                    onClick={() => {
                      it.action();
                      onClose();
                    }}
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
            <div className="cmdk-item" style={{ color: 'var(--muted)' }}>
              No results for &quot;{q}&quot;
            </div>
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

type AskMessage = { role: 'bot' | 'user'; text: string; streaming?: boolean };

export function AskPortfolio() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AskMessage[]>([
    {
      role: 'bot',
      text: "Hey — I'm JP's portfolio assistant. Ask me about projects, stack, or how to work together.",
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-ask', handler);
    return () => window.removeEventListener('open-ask', handler);
  }, []);

  useEffect(() => {
    if (msgsRef.current)
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, streaming]);

  const send = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || streaming) return;
    setInput('');
    setMessages((m) => [
      ...m,
      { role: 'user', text: userText },
      { role: 'bot', text: '', streaming: true },
    ]);
    setStreaming(true);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      if (!res.ok) throw new Error('bad response');
      const data = (await res.json()) as { reply: string };
      const chunks = data.reply.split(/(\s+)/);
      let acc = '';
      for (let i = 0; i < chunks.length; i++) {
        acc += chunks[i];
        await new Promise((r) => setTimeout(r, 18));
        setMessages((m) => {
          const next = m.slice();
          next[next.length - 1] = {
            role: 'bot',
            text: acc,
            streaming: i < chunks.length - 1,
          };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = m.slice();
        next[next.length - 1] = {
          role: 'bot',
          text: "Hmm, I couldn't reach the model. Try again in a sec, or email me at jptayco2002@gmail.com.",
          streaming: false,
        };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send();
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
            <button className="x" onClick={() => setOpen(false)}>
              CLOSE ✕
            </button>
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
                <button key={s} onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
          <form className="ask-input" onSubmit={onSubmit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={streaming ? 'Streaming…' : 'Ask anything…'}
              disabled={streaming}
            />
            <button type="submit" disabled={streaming || !input.trim()}>
              ↑
            </button>
          </form>
        </div>
      )}
      <button
        className="ask-fab"
        onClick={() => setOpen((o) => !o)}
        data-cursor={open ? 'CLOSE' : 'CHAT'}
      >
        <span className="gem" />
        <span>{open ? 'Close chat' : 'Ask my portfolio'}</span>
      </button>
    </div>
  );
}
