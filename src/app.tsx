'use client';

/* App composition + global hotkeys + theme. */

import { Fragment, useEffect, useState } from 'react';
import {
  AskPortfolio,
  CommandPalette,
  CustomCursor,
  Header,
  ScrollRail,
} from './chrome';
import { Hero } from './hero';
import { About, Marquee, TechStack, Timeline } from './sections';
import { Contact, GitHubSection, Terminal, Work } from './work';

export default function App() {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setCmdkOpen((o) => !o);
      } else if ((e.metaKey || e.ctrlKey) && k === '/') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-ask'));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Fragment>
      <CustomCursor />
      <Header
        onOpenCmdk={() => setCmdkOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <ScrollRail />

      <main>
        <Hero />
        <Marquee />
        <About />
        <TechStack />
        <Timeline />
        <Work />
        <Terminal />
        <GitHubSection />
        <Contact />
      </main>

      <div className="grain" aria-hidden="true" />
      <CommandPalette open={cmdkOpen} onClose={() => setCmdkOpen(false)} />
      <AskPortfolio />
    </Fragment>
  );
}
