/* App composition + global hotkeys + theme. */

function App() {
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onKey = (e) => {
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
    <React.Fragment>
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
    </React.Fragment>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
