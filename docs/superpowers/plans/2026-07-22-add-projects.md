# Add 7 New Project Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 new project cards to the "Selected work" section of `src/work.tsx`, bringing the total from 3 to 10, using a mix of live-iframe and static-screenshot visuals depending on each site's framing policy.

**Architecture:** `src/work.tsx` holds a single `PROJECTS: Project[]` array rendered by `<Work>`/`<WorkCard>`. We extend the `Project` type with two new `viz` variants (`'site'` for live iframe, `'shot'` for static screenshot) and an optional `image` field, refactor `ProjectViz` to take the full project object instead of just `kind`, then append 7 new entries. No new files, no data-fetching layer — everything stays hardcoded, matching the existing pattern.

**Tech Stack:** Next.js 16, React 19, TypeScript. No test framework in this repo — verification is `next lint`, `next build` (type-checks via `tsc`), and a manual visual check via `next dev`.

## Global Constraints

- All 7 new entries use `year: '2025'`.
- Screenshots already captured and saved at `public/projects/appnado.png`, `public/projects/jellouisse.png`, `public/projects/rentivo.png` (1440×900 PNG, no further action needed to create them).
- `viz: 'shot'` is used only for appnado, jellouisse, rentivo (confirmed `X-Frame-Options: DENY`). All other new entries use `viz: 'site'`.
- Existing `records`/`chat`/`graph` visuals and copy for the original 3 projects are unchanged in content — only their internal wiring shifts from `kind` to `p.kind`-equivalent (reading off the full project object).
- No new dependencies, no CMS, no automated tests added.

---

### Task 1: Extend `Project` type and refactor `ProjectViz` to support `site` and `shot` visuals

**Files:**
- Modify: `src/work.tsx:17-27` (type), `src/work.tsx:123-125` (call site), `src/work.tsx:140-208` (`ProjectViz` function)

**Interfaces:**
- Produces: `Project` type now has `viz: 'records' | 'chat' | 'graph' | 'site' | 'shot'` and `image?: string`.
- Produces: `ProjectViz({ p }: { p: Project })` — replaces old `ProjectViz({ kind }: { kind: Project['viz'] })`. Later tasks (Task 2) only add data, not code, so they consume this signature implicitly via the unchanged `<ProjectViz kind={p.viz} />` call site being updated here.

- [ ] **Step 1: Update the `Project` type**

In `src/work.tsx`, replace:

```typescript
type Project = {
  id: string;
  num: string;
  year: string;
  kind: string;
  title: string;
  blurb: string;
  stack: string[];
  viz: 'records' | 'chat' | 'graph';
  url?: string;
};
```

with:

```typescript
type Project = {
  id: string;
  num: string;
  year: string;
  kind: string;
  title: string;
  blurb: string;
  stack: string[];
  viz: 'records' | 'chat' | 'graph' | 'site' | 'shot';
  url?: string;
  image?: string;
};
```

- [ ] **Step 2: Update the `WorkCard` call site to pass the whole project**

Find in `src/work.tsx`:

```typescript
      <div className="w-viz">
        <ProjectViz kind={p.viz} />
      </div>
```

Replace with:

```typescript
      <div className="w-viz">
        <ProjectViz p={p} />
      </div>
```

- [ ] **Step 3: Refactor `ProjectViz` to accept the project and add `site`/`shot` branches**

Replace the full function signature and body start (keep the existing `records`/`chat`/`graph` branches' JSX exactly as-is, just re-parameterize):

```typescript
function ProjectViz({ p }: { p: Project }) {
  const kind = p.viz;
  if (kind === 'records') {
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
        <iframe
          src="https://www.youtube.com/embed/UkUzTKExxM8"
          title="Barangay Management System Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </div>
    );
  }
  if (kind === 'chat') {
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
        <img
          src="/guy.png"
          alt="AI Portfolio Platform"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }
  if (kind === 'site') {
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden', pointerEvents: 'none' }}>
        <iframe
          src={p.url}
          title={p.title}
          loading="lazy"
          style={{ width: '125%', height: '125%', border: 0, transform: 'scale(0.8)', transformOrigin: 'top left' }}
        />
      </div>
    );
  }
  if (kind === 'shot') {
    return (
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
        <img
          src={p.image}
          alt={p.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
        />
      </div>
    );
  }
  return (
```

(The final `return (` continues directly into the existing unmodified `graph` JSX — the `Fragment>...</Fragment>` block already in the file — so nothing after that line changes.)

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors. (The `site` branch renders an iframe scaled up 125%/scaled down 0.8 to crop browser chrome/whitespace and hide scrollbars — `pointerEvents: 'none'` keeps the embedded site from capturing hover/click meant for the card.)

- [ ] **Step 5: Commit**

```bash
git add src/work.tsx
git commit -m "Add site/shot viz variants to project cards"
```

---

### Task 2: Add the 7 new project entries and make the section counter dynamic

**Files:**
- Modify: `src/work.tsx:29-64` (`PROJECTS` array), `src/work.tsx:230-235` (section counter text)

**Interfaces:**
- Consumes: `Project` type and `ProjectViz`/`WorkCard` from Task 1 — no signature changes needed, only new array entries conforming to the existing `Project` shape.

- [ ] **Step 1: Append the 7 new entries to `PROJECTS`**

In `src/work.tsx`, find the closing of the `PROJECTS` array:

```typescript
  {
    id: 'p-3',
    num: '03',
    year: '2024',
    kind: 'AUTOMATION · FINTECH',
    title: 'Trading Automation System',
    blurb:
      'Real-time automated trading bot wired to broker APIs with a predictive strategy module. Backtested, paper-traded, and shipped to a live account.',
    stack: ['C#', '.NET', 'REST APIs', 'WebSockets'],
    viz: 'graph',
  },
];
```

Replace the closing `];` with these 7 entries followed by `];`:

```typescript
  {
    id: 'p-3',
    num: '03',
    year: '2024',
    kind: 'AUTOMATION · FINTECH',
    title: 'Trading Automation System',
    blurb:
      'Real-time automated trading bot wired to broker APIs with a predictive strategy module. Backtested, paper-traded, and shipped to a live account.',
    stack: ['C#', '.NET', 'REST APIs', 'WebSockets'],
    viz: 'graph',
  },
  {
    id: 'p-4',
    num: '04',
    year: '2025',
    kind: 'WEB · GOVTECH/SME SAAS',
    title: 'Appnado — IT Solutions Platform',
    blurb:
      'Company platform for Appnado IT Solutions, digitizing barangay records, warehouse inventory, and retail POS for Philippine LGUs and SMEs — role-based access, offline support, and audit-ready reporting.',
    stack: ['Next.js', 'React', 'REST APIs', 'Multi-tenant'],
    viz: 'shot',
    image: '/projects/appnado.png',
    url: 'https://appnado.netlify.app/',
  },
  {
    id: 'p-5',
    num: '05',
    year: '2025',
    kind: 'WEB · PORTFOLIO',
    title: 'Nurse Portfolio — Catherine Tayco',
    blurb:
      'A clean, credibility-first portfolio site for a registered nurse — credentials, experience, and contact details in one shareable page.',
    stack: ['Next.js', 'React', 'Responsive'],
    viz: 'site',
    url: 'https://catherinetayco.netlify.app/',
  },
  {
    id: 'p-6',
    num: '06',
    year: '2025',
    kind: 'WEB · FITNESS/LOCAL BIZ',
    title: 'LIFT. Naga',
    blurb:
      'Marketing site for a multi-discipline fitness facility in Naga City — nine training disciplines, ten coaches, membership tiers, and a meal-prep program, all in one bookable page.',
    stack: ['Next.js', 'React', 'Responsive'],
    viz: 'site',
    url: 'https://liftgymnaga.netlify.app/',
  },
  {
    id: 'p-7',
    num: '07',
    year: '2025',
    kind: 'WEB · PORTFOLIO/BOOKING',
    title: 'Isse Capucao — Model & Creator Portfolio',
    blurb:
      'Portfolio and booking platform for a freelance model and content creator — galleries, measurements, SMM service offerings, and direct booking channels.',
    stack: ['Next.js', 'React', 'Responsive'],
    viz: 'shot',
    image: '/projects/jellouisse.png',
    url: 'https://jellouisse.netlify.app/',
  },
  {
    id: 'p-8',
    num: '08',
    year: '2025',
    kind: 'WEB · HEALTHCARE',
    title: 'Torres General & Laparoscopic Surgery',
    blurb:
      'Medical practice site for a laparoscopic surgeon in Naga City — services, credentials, hospital partnerships, and online appointment booking via UCMS.',
    stack: ['Next.js', 'React', 'Booking integration'],
    viz: 'site',
    url: 'https://torreslaparoscopy.netlify.app/',
  },
  {
    id: 'p-9',
    num: '09',
    year: '2025',
    kind: 'WEB · MARKETPLACE',
    title: 'Rentivo — Peer-to-Peer Gear Rental',
    blurb:
      'Marketplace for renting cameras, phones, and lenses from local owners — location-based search, creator bundles, host dashboard, and instant booking.',
    stack: ['Next.js', 'React', 'Marketplace/Booking'],
    viz: 'shot',
    image: '/projects/rentivo.png',
    url: 'https://rentivo.netlify.app/',
  },
  {
    id: 'p-10',
    num: '10',
    year: '2025',
    kind: 'WEB · E-GOVERNANCE',
    title: 'AppNindo — Municipal E-Governance Platform',
    blurb:
      'Citizen request portal and admin dashboard for the Municipality of Pamplona, Camarines Sur — department-level SLA tracking, barangay records sync, and real-time processing dashboards for ~52,000 residents.',
    stack: ['Next.js', 'React', 'Admin dashboard', 'REST APIs'],
    viz: 'site',
    url: 'https://appnindo.netlify.app/',
  },
];
```

- [ ] **Step 2: Make the section counter dynamic**

Find in `src/work.tsx`:

```typescript
          {PROJECTS.length} OF 12 SHOWN
```

Replace with:

```typescript
          {PROJECTS.length} OF {PROJECTS.length} SHOWN
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: build succeeds (confirms no broken JSX, valid Next.js image usage via plain `<img>` tags which this file already uses elsewhere, so no `next/image` domain-allowlist issues).

- [ ] **Step 5: Manual visual check**

Run: `npm run dev`, open `http://localhost:3000#work` in a browser (or use the `run` skill), and confirm:
- 10 cards render in the Selected Work section.
- The 3 `shot` cards (Appnado, Isse Capucao, Rentivo) show the static screenshots.
- The 4 `site` cards (Catherine Tayco, LIFT Naga, Torres Laparoscopy, AppNindo) show a live embedded iframe of the real site, cropped/scaled without visible scrollbars, and are not interactive (hover/click still targets the card, not the embedded page).
- The counter reads "10 OF 10 SHOWN".
- Clicking any new card opens its `url` in a new tab (existing `WorkCard` link-wrapping behavior, unchanged).

- [ ] **Step 6: Commit**

```bash
git add src/work.tsx
git commit -m "Add 7 new project cards to Selected Work section"
```
