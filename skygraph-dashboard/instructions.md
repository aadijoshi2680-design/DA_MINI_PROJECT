# instructions.md — How to build the SkyGraph Dashboard (for Antigravity AI)

Put these 4 files in the project root and keep them there: `instructions.md`, `flow.md`, `architecture.md`, `design.md`.

**How to use this file**
1. Paste **Section 1 (Master prompt)** into Antigravity first.
2. Then paste the **Phase prompts in Section 3**, one at a time, in order. Run and check each phase before starting the next.
3. If something breaks, use the **Fix prompts in Section 5**.

---

## 1. Master prompt (paste this first)

```
You are a senior front-end engineer building "SkyGraph", a 3-page analytics dashboard
for a university mini-project: "Airline Network Analysis using Neo4j (OpenFlights data)".

Before writing any code, read these files in the project root, in this order:
1. instructions.md  (rules + phases)
2. flow.md          (pages, charts, user flow, GA events, build order)
3. architecture.md  (data contract, tech stack, folder structure, graph engine)
4. design.md        (colors, typography, components, motion, accessibility)

Then reply with: (a) a 10-line summary of what you will build, (b) any ambiguity you found,
(c) the list of files you will create in phase 1. Do NOT write code until I say "go".

Non-negotiable rules are in instructions.md section 2.
```

---

## 2. Rules Antigravity must follow

**Project**
- Build exactly the 3 pages: **Home `/`**, **Analytics `/analytics`**, **Route Explorer `/explorer`**. Navbar has exactly these 3 items. No extra pages.
- Stack is fixed: React 18 + Vite, react-router-dom v6, Tailwind CSS, ECharts (`echarts-for-react`), react-leaflet + CARTO dark tiles, Zustand, Framer Motion, lucide-react, Google Analytics 4. Do not swap libraries without asking.
- Use **JavaScript** (not TypeScript) unless told otherwise. Functional components and hooks only.
- Follow the folder structure in `architecture.md` section 6 exactly.

**Data**
- The dashboard reads **only static JSON files** from `public/data/`. Never connect the browser to Neo4j. Never put passwords, URIs or API keys in front-end code.
- Every JSON file shape is defined in `architecture.md` section 4. Do not invent fields. If a field is missing, say so.
- **Never hard-code numbers** (KPIs, rankings, insights). Every number on screen must come from the JSON files. Mock data is allowed only in `public/data-mock/` and must be clearly labelled "mock".
- All field names and file paths live in `src/config/schema.js`. Components import from there, never use raw string keys.
- **airlines.csv is verified**: columns `Name, IATA, ICAO, Callsign, Country, Active`; there is **no Airline ID**; IATA codes are not unique; only 1,254 of 6,160 airlines are active. Always use `airlineKey`, default to active airlines, and follow `architecture.md` section 2.1. Airports/routes headers are **assumed** until confirmed: keep that logic isolated in `schema.js` and the data-prep script.

**Design**
- Use only the tokens in `design.md` (CSS variables + `src/config/theme.js`). No hard-coded hex values or font sizes inside components.
- Dark theme is the default. Every chart uses the shared ECharts theme (transparent background, muted grid, palette from design.md).
- Every chart card: title, insight subtitle, "i" tooltip, loading skeleton, empty state, error state.
- Accessibility: keyboard navigation, focus rings, `aria-label` on charts, `prefers-reduced-motion` respected, text contrast >= 4.5:1.

**Quality**
- Components under ~200 lines. One chart = one file. No duplicated chart options: share helpers.
- Lazy-load heavy parts (`edges.json`, the map, Analytics charts) with `React.lazy` / dynamic import.
- No console errors or warnings. `npm run build` must pass.
- Do not add features I did not ask for. If something is unclear, ask before guessing.
- After each phase: list the files you created or changed, how to run it, and a checklist of what I should verify.

---

## 3. Phase prompts (paste one at a time, in order)

### Phase 0 — Confirm understanding
```
Read instructions.md, flow.md, architecture.md and design.md. Give me the 10-line summary,
the ambiguities and the phase-1 file list as described in the master prompt. No code yet.
```

### Phase 1 — Scaffold, theme, layout shell
```
go. Phase 1: scaffold the project.
- Vite + React 18 + Tailwind + react-router-dom, with the folder structure from architecture.md section 6.
- Tokens from design.md in src/styles/index.css (CSS variables) and src/config/theme.js
  (chart palette + shared ECharts theme).
- Fonts: Space Grotesk and Inter from Google Fonts.
- Components: Navbar (3 items, sticky, blurred, animated active underline, mobile hamburger sheet),
  Footer, PageShell (page transition), and 3 placeholder pages.
- Background glow gradients from design.md section 2.
- Create .env.example with VITE_GA_ID.
Show me how to run it. Stop after this phase.
```

### Phase 2 — Data layer, mock data and data-prep script
```
Phase 2: data layer.
1. src/config/schema.js: file paths and field names from architecture.md sections 2 and 4.
2. src/data/loader.js + useData.js + Zustand store: fetch each JSON once, cache it, expose loading/error
   states and a retry. Lazy-load edges.json and airports.json.
3. Generate realistic MOCK JSON for every file in architecture.md section 4 into public/data-mock/,
   with a switch (VITE_USE_MOCK=true) so the UI can be built before the real data exists.
   Mark mock data visibly in the footer ("Mock data").
4. Write scripts/prepare_airlines.py (Python, pandas) that reads airlines.csv and produces:
   airlines.json (all rows) and airlines_by_country.json, following architecture.md section 2.1:
   - treat '', '-', 'N/A', '\N' as null; normalise Active to Y/N (there is one lowercase 'n')
   - drop the junk row 'Private flight'
   - build airlineKey = ICAO if valid else IATA if valid else slug(Name)
   - flag rows whose Country is invalid or looks shifted
   - print a data-quality report (row counts, nulls, duplicate IATA codes)
   Do not fabricate routeCount/countryCount/airportCount; leave them null until routes are processed.
Stop after this phase.
```

### Phase 3 — Reusable UI kit
```
Phase 3: build the reusable UI kit from design.md section 7: Button, KpiCard (count-up on first view),
ChartCard (title, insight subtitle, info tooltip, skeleton, error + empty state),
SearchSelect (keyboard navigable autocomplete, max 8 rows, highlighted match), Drawer, Badge,
Tooltip, Skeleton, EmptyState, Toggle/Select. Make a hidden /__kit page that shows every component
so I can review them. Respect prefers-reduced-motion. Stop after this phase.
```

### Phase 4 — Home page
```
Phase 4: build the Home page exactly as in flow.md section 5.1 and design.md section 6.1:
hero (gradient H1, 2 CTAs), hero map (airports as dots sized by PageRank, top 10 hubs pulsing,
~300 top routes as faint arcs, non-interactive), 5 KPI cards, 3 quick-insight cards computed from the
JSON, Top 5 hubs and Top 5 airlines lists, "How it works" stepper, footer with team, tech badges,
dataset credit and "Data as of" from meta.json.
The airline KPI must show ACTIVE airlines with "historical" in the caption.
Fire GA events cta_click and kpi_click (stub trackEvent for now). Stop after this phase.
```

### Phase 5 — Analytics page, part A (hubs and airlines)
```
Phase 5: Analytics page structure + the first charts.
- Page title, sticky filter bar (Continent, Top N, Active-only toggle) wired to the store.
- Chart 1 Top hubs by PageRank (horizontal bar, top bar amber, gradient fill).
- Chart 2 Degree vs PageRank (bubble scatter, colour by community).
- Chart 3 Top airlines by routes.
- Chart 4 Airline reach (countries and airports).
- Chart 13 Airlines by country (active vs defunct stacked bar) and Chart 14 Active vs defunct donut.
Use the chart styling rules in design.md section 6.2. Clicking a bar opens the Drawer with stats and an
"Open in Route Explorer" link. Every chart gets an insight subtitle generated from the data, not typed in.
Stop after this phase.
```

### Phase 6 — Analytics page, part B (geography, communities, route stats)
```
Phase 6: the remaining charts from flow.md section 5.2: 5 Routes by country, 6 Global route density
(choropleth or heat map), 7 Network communities (force graph or treemap), 8 Distance histogram,
9 Stops donut, 10 Codeshare donut, 11 Equipment bar, 12 Airline x Region heatmap.
If any JSON file is missing, show the EmptyState instead of failing. Stop after this phase.
```

### Phase 7 — Route Explorer
```
Phase 7: Route Explorer, following flow.md section 5.3 and design.md section 6.3.
1. src/graph/buildGraph.js, shortestPath.js (BFS for hops, Dijkstra for km, haversine) and kShortest.js
   (up to 3 alternatives by blocking an intermediate airport) from edges.json.
2. Write unit tests (Vitest) for BFS, Dijkstra and haversine with a tiny hand-made graph.
3. UI: left panel with 3 tabs (Find route, Airport, Airline), From/To SearchSelect, Swap, Find route.
   Result card with hops, km and legs table (airline initials badge). Alternatives list.
4. Map: selected path in amber with animated dash flow and a plane marker travelling once;
   alternatives in muted violet. Airport tab draws outgoing routes; Airline tab draws all routes of the airline.
5. Friendly empty state when no path exists. Mobile: map on top, panel as bottom sheet.
6. GA events route_search and profile_view.
Stop after this phase.
```

### Phase 8 — Google Analytics 4
```
Phase 8: src/analytics/ga.js that loads gtag using VITE_GA_ID (do nothing if it is missing),
a <RouteTracker/> that fires page_view on every route change, and a trackEvent(name, params) wrapper.
Wire every event in flow.md section 6. Add a small privacy note in the footer.
Add a dev-only debug log so I can see the events in the console. Stop after this phase.
```

### Phase 9 — Polish, accessibility, performance
```
Phase 9: go through the checklists in design.md sections 10, 11, 13 and flow.md section 8.
Fix responsive issues at 375, 768, 1024 and 1440 px, add skeletons and empty states everywhere,
add aria-labels and a visually-hidden data table for each chart, check keyboard use and
reduced motion, and lazy-load heavy chunks. Run npm run build and report the bundle sizes.
Give me a table of every checklist item with pass or fail.
```

### Phase 10 — Real data, README, deploy
```
Phase 10: replace mock data with the real JSON in public/data/ (set VITE_USE_MOCK=false).
Write README.md: project summary, screenshots placeholders, setup, how to regenerate data
(scripts/prepare_airlines.py and scripts/export_for_dashboard.py), env vars, deploy steps for Vercel.
Verify nothing secret is in the bundle. Final check against the Definition of Done in flow.md section 8.
```

---

## 4. Review checklist (for me, after each phase)

- Runs with `npm run dev` and builds with `npm run build` with no console errors
- Only the 3 navbar pages exist
- No hard-coded numbers or colours in components
- Active airlines are the default everywhere airlines are counted
- Mock data is labelled as mock
- GA events show in the dev console

---

## 5. Fix prompts (use when something is wrong)

**Looks generic / not "stunning"**
```
Compare the current UI against design.md. List every deviation (colors, spacing, radius, glow,
typography, motion), then fix them all. Do not change functionality.
```

**A chart is wrong or ugly**
```
Chart <NAME> does not match design.md section 6.2 or flow.md section 5.2. Rebuild it using the shared
ECharts theme in theme.js. Keep the same props and data source. Show before/after as a list of changes.
```

**Wrong or missing numbers**
```
Audit the page for hard-coded numbers. Replace each with a value from the JSON files defined in
architecture.md section 4. List every place you changed.
```

**Data field mismatch**
```
The real CSV or JSON headers are: <PASTE HEADERS>. Update only src/config/schema.js and the data-prep
script. Do not touch components. Then tell me which charts are affected.
```

**Performance**
```
Profile load time. Lazy-load edges.json, airports.json, the map and the Analytics charts.
Report the bundle size before and after.
```

**Antigravity wandered off-spec**
```
Stop. Re-read instructions.md section 2. List which rules your last change broke, revert those parts,
and continue within the rules.
```
