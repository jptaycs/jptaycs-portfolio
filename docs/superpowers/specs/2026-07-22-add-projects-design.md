# Add 7 new project cards to Selected Work section

## Context

`src/work.tsx` currently renders 3 hardcoded projects in the `PROJECTS` array. The user has 8 additional live Netlify-hosted sites (one URL, `rentivo.netlify.app`, was submitted twice and is treated as one project). This adds 7 new project cards, bringing the total to 10.

## Data model change

Extend `Project['viz']` with two new variants:

- `'site'` — embeds the live URL in an iframe. Used for sites that don't block framing.
- `'shot'` — renders a static screenshot image. Used for sites that send `X-Frame-Options: DENY` (confirmed via `curl -I`): **appnado**, **jellouisse**, **rentivo**.

Add an optional `image?: string` field to `Project` for the `'shot'` case.

`ProjectViz` changes signature from `{ kind }: { kind: Project['viz'] }` to `{ p }: { p: Project }` so it can read `p.url` (for `'site'`) and `p.image` (for `'shot'`). Existing `'records'`, `'chat'`, `'graph'` branches are unchanged in behavior, just re-pointed to read off `p`.

Screenshots (1440×900, captured via headless browser) are saved to `public/projects/{appnado,jellouisse,rentivo}.png`.

## New project entries (num 04–10, year `'2025'`)

1. **Appnado — IT Solutions Platform** · `WEB · GOVTECH/SME SAAS` · viz: shot (`/projects/appnado.png`) · stack: Next.js, React, REST APIs, Multi-tenant · url: https://appnado.netlify.app/
   > Company platform for Appnado IT Solutions, digitizing barangay records, warehouse inventory, and retail POS for Philippine LGUs and SMEs — role-based access, offline support, and audit-ready reporting.

2. **Nurse Portfolio — Catherine Tayco** · `WEB · PORTFOLIO` · viz: site · stack: Next.js, React, Responsive · url: https://catherinetayco.netlify.app/
   > A clean, credibility-first portfolio site for a registered nurse — credentials, experience, and contact details in one shareable page.

3. **LIFT. Naga** · `WEB · FITNESS/LOCAL BIZ` · viz: site · stack: Next.js, React, Responsive · url: https://liftgymnaga.netlify.app/
   > Marketing site for a multi-discipline fitness facility in Naga City — nine training disciplines, ten coaches, membership tiers, and a meal-prep program, all in one bookable page.

4. **Isse Capucao — Model & Creator Portfolio** · `WEB · PORTFOLIO/BOOKING` · viz: shot (`/projects/jellouisse.png`) · stack: Next.js, React, Responsive · url: https://jellouisse.netlify.app/
   > Portfolio and booking platform for a freelance model and content creator — galleries, measurements, SMM service offerings, and direct booking channels.

5. **Torres General & Laparoscopic Surgery** · `WEB · HEALTHCARE` · viz: site · stack: Next.js, React, Booking integration · url: https://torreslaparoscopy.netlify.app/
   > Medical practice site for a laparoscopic surgeon in Naga City — services, credentials, hospital partnerships, and online appointment booking via UCMS.

6. **Rentivo — Peer-to-Peer Gear Rental** · `WEB · MARKETPLACE` · viz: shot (`/projects/rentivo.png`) · stack: Next.js, React, Marketplace/Booking · url: https://rentivo.netlify.app/
   > Marketplace for renting cameras, phones, and lenses from local owners — location-based search, creator bundles, host dashboard, and instant booking.

7. **AppNindo — Municipal E-Governance Platform** · `WEB · E-GOVERNANCE` · viz: site · stack: Next.js, React, Admin dashboard, REST APIs · url: https://appnindo.netlify.app/
   > Citizen request portal and admin dashboard for the Municipality of Pamplona, Camarines Sur — department-level SLA tracking, barangay records sync, and real-time processing dashboards for ~52,000 residents.

## Section header

`{PROJECTS.length} OF 12 SHOWN` (hardcoded, aspirational) becomes `{PROJECTS.length} OF {PROJECTS.length} SHOWN` (dynamic, accurate) since all projects in the array are now displayed.

## Out of scope

- No changes to `records`/`chat`/`graph` viz content for the existing 3 projects.
- No new automated tests — this is static content/markup; existing lint/build/typecheck is the verification bar.
- No CMS or data-fetching layer — data stays hardcoded in `PROJECTS`, matching current pattern.
