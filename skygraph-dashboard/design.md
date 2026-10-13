# design.md — SkyGraph Dashboard: UI / UX Design System

> **For Antigravity:** read `instructions.md` first. This file is the single source of truth for colors, fonts, spacing, components and motion. Never hard-code a color or font size in a component; use the tokens below (CSS variables + `theme.js`).

> Goal: a **stunning, modern, data-rich** dashboard that feels like a premium aviation control room, while staying readable and fast.

---

## 1. Design concept

**"Night-flight control room."** A dark, deep-navy canvas with glowing cyan/violet network lines — like looking at the world's flight paths from above at night. Data is the hero; chrome is minimal.

Design principles:
1. **Data first** — big numbers, clear charts, little decoration.
2. **Glow = importance** — hubs, active selections and key numbers glow; everything else recedes.
3. **One idea per card** — each chart has a title, a subtitle that states the insight, and the chart.
4. **Smooth, not flashy** — subtle motion (count-ups, fade-ups), never blocking.
5. **Consistent** — same card, spacing, radius and colors everywhere.

---

## 2. Color system

### Dark theme (default)
| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#070B14` | App background |
| `--bg-elev` | `#0E1525` | Cards |
| `--bg-elev-2` | `#141D33` | Hover, inputs, drawers |
| `--border` | `#1F2A44` | Card borders, dividers |
| `--text` | `#E6EBF5` | Primary text |
| `--text-muted` | `#8A97B4` | Secondary text, axis labels |
| `--primary` | `#22D3EE` | Cyan: primary actions, route lines, hubs |
| `--secondary` | `#8B5CF6` | Violet: second series, communities |
| `--accent` | `#F59E0B` | Amber: highlights, selected path, top rank |
| `--success` | `#34D399` | Positive / direct flights |
| `--danger` | `#F87171` | Errors, no-route state |

### Chart palette (colorblind-friendly order)
`#22D3EE`, `#8B5CF6`, `#F59E0B`, `#34D399`, `#F472B6`, `#60A5FA`, `#FB923C`, `#A3E635`

### Gradients
- Hero title: `linear-gradient(90deg, #22D3EE, #8B5CF6)`
- KPI card top border glow: `linear-gradient(90deg, #22D3EE55, transparent)`
- Page background: radial glow at top-left `radial-gradient(60% 40% at 10% 0%, #22D3EE14, transparent)` and top-right `#8B5CF614`.

### Light theme (optional nice-to-have)
Toggle in navbar. `--bg #F6F8FC`, `--bg-elev #FFFFFF`, `--text #0B1220`, keep same primary/secondary but darken cyan to `#0891B2`.

---

## 3. Typography

| Role | Font | Size / weight |
|------|------|---------------|
| Headings, KPIs | **Space Grotesk** (or Sora) | H1 48/700, H2 32/600, H3 20/600, KPI 40/700 |
| Body, UI | **Inter** | 16/400 body, 14/500 labels, 12/400 captions |
| Numbers in tables | Inter with `font-variant-numeric: tabular-nums` | 14 |

Load via Google Fonts with `display=swap`. Line-height 1.5 body, 1.15 headings.

---

## 4. Layout & spacing

- 12-column grid, max content width **1280 px**, side padding 24 px (16 px on mobile).
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64.
- Card: radius **16 px**, padding 20–24 px, 1 px `--border`, subtle shadow `0 8px 30px rgba(0,0,0,.35)`.
- Section vertical gap: 32 px (48 px on desktop).
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`.

---

## 5. Navbar (3 items)

```
[ ✈ SkyGraph ]        Home    Analytics    Route Explorer        [ ☾/☀ ]  [GitHub]
```

- Sticky, 64 px tall, `backdrop-filter: blur(12px)` with `rgba(7,11,20,.7)` background and bottom border.
- Active item: cyan text + 2 px animated underline (Framer Motion `layoutId`).
- Hover: text brightens, underline fades in.
- Mobile (< 768 px): logo + hamburger; opens full-width sheet with the 3 links (large tap targets, 48 px).

---

## 6. Page designs

### 6.1 Home (landing)

```
+------------------------------------------------------------------+
| NAVBAR                                                           |
+------------------------------------------------------------------+
|  HERO (2 columns on desktop)                                     |
|  Left: small pill "Powered by Neo4j graph analytics"             |
|        H1 "The world's skies, as a graph."  (gradient text)      |
|        Sub: one-line description                                 |
|        [ View Analytics -> ]  [ Try Route Explorer ]             |
|  Right: Animated world map with glowing airports + faint arcs    |
+------------------------------------------------------------------+
|  KPI STRIP (5 cards): Airports | Airlines | Routes | Countries |  |
|                       Avg connections                            |
+------------------------------------------------------------------+
|  QUICK INSIGHTS (3 cards)                                        |
|  Top hub | Widest-reach airline | Largest community              |
+------------------------------------------------------------------+
|  TOP 5 HUBS (mini list with bars) | TOP 5 AIRLINES (mini list)   |
+------------------------------------------------------------------+
|  HOW IT WORKS: Clean -> Model -> Analyze -> Visualize (4 steps)  |
+------------------------------------------------------------------+
|  FOOTER: team, tech badges, dataset credit, "Data as of ..."     |
+------------------------------------------------------------------+
```

**Details**
- KPI card: icon in a tinted circle, label (muted), big number with **count-up** on first view, small delta/caption underneath (e.g., "across 230+ countries"). Hover lifts 4 px and intensifies the top glow.
- Hero map: dark map, airports as small cyan dots (size by PageRank), top 10 hubs pulse softly, ~300 top routes drawn as faint cyan arcs. Non-interactive on Home (no zoom) to keep it a clean visual.
- Quick insight cards: emoji/icon, one sentence with the key value in amber.
- "How it works": horizontal stepper with connecting line; vertical on mobile.

### 6.2 Analytics

```
+------------------------------------------------------------------+
| Page title "Network Analytics"  + subtitle                       |
| FILTER BAR (sticky under navbar): Continent ▾  Top N ▾  Active ☑ |
+------------------------------------------------------------------+
| SECTION 1 — HUBS                                                 |
|  [ Top hubs by PageRank (bar) ]  [ Degree vs PageRank (scatter) ]|
| SECTION 2 — AIRLINES                                             |
|  [ Top airlines by routes ]      [ Airline reach: countries ]    |
| SECTION 3 — GEOGRAPHY                                            |
|  [ Choropleth: routes per country (wide) ]                       |
|  [ Top countries bar ]           [ Airline x Region heatmap ]    |
| SECTION 4 — COMMUNITIES                                          |
|  [ Community force-graph / treemap (wide) ]                      |
| SECTION 5 — ROUTE STATS                                          |
|  [ Distance histogram ] [ Stops donut ] [ Codeshare ] [ Equipment]|
+------------------------------------------------------------------+
```

**Chart card anatomy**
- Header: title (H3), "i" icon with tooltip ("Computed with PageRank in Neo4j GDS"), optional download PNG icon.
- Subtitle in muted text with the **insight** (e.g., "Atlanta, Beijing and Chicago dominate connectivity").
- Chart area: min height 320 px (wide cards 420 px).
- Skeleton shimmer while loading.

**Chart styling rules (ECharts)**
- Transparent background, grid lines `#1F2A44` at 60% opacity, axis labels `--text-muted` 12 px.
- Bars: rounded top/right corners (radius 6), gradient fill cyan -> violet, hover brightens + shows tooltip.
- Top-ranked bar highlighted in amber.
- Tooltips: dark card with border, 8 px radius, value in bold.
- Entry animation 800 ms `cubicOut`.
- Scatter bubbles: size = degree, color = community, 70% opacity, glow on hover.
- Heatmap: sequential scale from `#0E1525` to `#22D3EE` to `#F59E0B`.
- Donuts: 70% inner radius, center label with the main percentage.
- Community graph: nodes colored by community, labels only for top nodes, treemap or layout with gentle interaction.

**Interactions**
- Click a bar (hub/airline) -> **right-side drawer** (width 420 px) with details: key stats, mini bar of top destinations, button "Open in Route Explorer".
- Filters update all charts with a quick fade (200 ms).

### 6.3 Route Explorer

```
+------------------------------------------------------------------+
| Page title "Route Explorer"  + subtitle                          |
+----------------------+-------------------------------------------+
| LEFT PANEL (380 px)  |  MAP (fills remaining area, min 560 px)   |
|  Tabs: Find route |   |   - dark map                              |
|        Airport |      |   - selected path in amber, animated      |
|        Airline        |   - nodes as numbered pins                |
|  From [autocomplete]  |   - faint network in background (opt.)    |
|  To   [autocomplete]  |                                           |
|  [⇅ Swap] [Find route]|                                           |
|  RESULT CARD:         |                                           |
|   BOM -> DXB -> JFK   |                                           |
|   2 hops · 12,450 km  |                                           |
|   legs table          |                                           |
|  ALTERNATIVES (3)     |                                           |
+----------------------+-------------------------------------------+
```

**Details**
- Autocomplete: search by city, name or IATA; show "Mumbai — BOM — India" rows; keyboard navigable.
- Find route: button with loading micro-state; if no path -> friendly empty state ("These airports are not connected in this dataset").
- Result card: large hop count and distance; each leg row shows airline logo-initials badge, airline name, distance.
- Map: path drawn as a curved polyline (great-circle approximation), animated dash flow along the path; a small plane marker travels from origin to destination once.
- Alternatives: click to swap the highlighted path; non-selected alternatives drawn in muted violet.
- **Airport tab:** search an airport -> stats (PageRank rank, degree, #airlines, #countries reached) + its outgoing routes drawn as fan arcs.
- **Airline tab:** search an airline -> stats (routes, airports, countries, codeshare share) + all its routes drawn.
- Mobile: map on top (50 vh), panel as a bottom sheet below.

---

## 7. Component library (UI kit)

| Component | Spec |
|-----------|------|
| `Button` | Primary: cyan->violet gradient, dark text; Secondary: transparent with 1 px border; radius 12; 44 px height; hover glow; focus ring 2 px cyan |
| `KpiCard` | See Home; icon, label, count-up value, caption |
| `ChartCard` | Header + subtitle + chart + skeleton + error state |
| `SearchSelect` | Input with leading search icon, dropdown max 8 rows, highlighted match text |
| `Drawer` | Slides from right, overlay `rgba(0,0,0,.5)`, close on Esc/overlay click |
| `Badge` | Pill, 12 px text; variants: tech (grey), status (green), rank (amber) |
| `Tooltip` | 8 px radius, 150 ms delay, max width 240 |
| `Skeleton` | Shimmer gradient moving left->right |
| `EmptyState` | Icon, title, hint, optional action |
| `Toggle` / `Select` | Match input style; accessible labels |

---

## 8. Motion guidelines (Framer Motion)

| Element | Animation |
|---------|-----------|
| Page change | Fade + 12 px slide-up, 250 ms |
| KPI numbers | Count-up 1.2 s on first viewport entry |
| Cards on scroll | Staggered fade-up (60 ms stagger) |
| Navbar underline | Shared layout animation between tabs |
| Hero map hubs | Slow pulse (2.5 s loop) |
| Route path | Dash-offset flow + one-time plane travel (2 s) |
| Hover cards | translateY(-4px), 150 ms |
| Respect `prefers-reduced-motion` | Disable count-up, pulses and path animation |

---

## 9. Iconography & imagery

- Icons: `lucide-react` 20 px, stroke 1.75.
- Logo: simple paper-plane/ node-link mark in cyan + wordmark "SkyGraph" in Space Grotesk.
- No stock photos; visuals come from the map and charts. Optional subtle grid/dot pattern in hero background at 4% opacity.
- Airline "logos": use circular initials badge (IATA code) — avoids copyright/logo licensing issues.

---

## 10. Responsive behaviour

| Breakpoint | Behaviour |
|------------|-----------|
| < 640 | Single column; KPI cards 2-up; charts full width, min height 280; filter bar collapses to a "Filters" button opening a sheet; Explorer stacks (map, then panel) |
| 640–1023 | 2-column grid for charts; hero stacks (text above map) |
| >= 1024 | Full layouts as shown; Explorer split view |
| >= 1536 | Max width stays 1280, extra space as margins |

Charts re-render on resize; axis labels rotate/abbreviate on small screens; long airport names truncated with tooltip.

---

## 11. Accessibility checklist

- Contrast: body text >= 4.5:1 on all backgrounds.
- Don't rely on color alone: add labels/patterns for series; bar values shown on hover and in a visually-hidden table.
- Focus-visible rings on all interactive elements; skip-to-content link.
- Each chart card has `role="img"` + `aria-label` summarizing the insight.
- Full keyboard use for navbar, search and drawer (Esc to close).
- Touch targets >= 44 px.

---

## 12. Content & microcopy

- Tone: confident, simple, a bit "mission control."
- Hero H1: **"The world's skies, as a graph."**
- Hero sub: "Explore 7,600+ airports, 1,250+ active airlines and 67,000+ routes — analysed with Neo4j graph algorithms."
- Chart subtitles state the finding, not just the metric.
- Empty/error: "No route found between these airports in the dataset." / "Couldn't load data. Retry".
- Footer: "Data: OpenFlights via Kaggle · Built with Neo4j, Python, React".

---

## 13. Design deliverable checklist

- [ ] Tokens (colors, fonts, spacing) defined in `theme.js` and `index.css` variables
- [ ] Navbar, Footer, PageShell
- [ ] KpiCard, ChartCard, Drawer, SearchSelect, Skeleton, EmptyState
- [ ] Home, Analytics, Route Explorer match the layouts above
- [ ] Dark theme complete; light theme optional
- [ ] Mobile layouts verified at 375 px
- [ ] Reduced-motion and keyboard checks pass
- [ ] Screenshots of all 3 pages captured for the report
