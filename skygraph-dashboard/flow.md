# flow.md — SkyGraph Dashboard: User Flow & Data Flow

> Project: **Airline Network Analysis using Neo4j (OpenFlights data)**
> My part: **the interactive web dashboard** (front end + data layer + Google Analytics)
> Dataset: Kaggle – *Airlines, Airport, and Flight Routes* (elmoallistair)
> ~7,658 airports · 6,160 airlines in the file (**1,254 active**) · ~67,664 routes
>
> **For Antigravity:** read `instructions.md` first. It holds the rules and the step-by-step prompts. This file is the product spec (pages, charts, user flow). `architecture.md` = data + tech. `design.md` = visuals.

---

## 1. Purpose of the dashboard

Present the insights produced by the Python + Neo4j pipeline in an intuitive, visual way:

- Which airports are the **key hubs** (PageRank, degree)
- How **connected** the network is (shortest paths, stops, redundancy)
- Which **communities / regional clusters** exist
- How **far each airline reaches** (countries, airports, routes, codeshare)
- How visitors use the dashboard (Google Analytics)

---

## 2. Pages (3 navbar items)

| # | Nav label | Route | Goal |
|---|-----------|-------|------|
| 1 | **Home** | `/` | Landing page: headline KPIs, hero map, quick insights, project summary |
| 2 | **Analytics** | `/analytics` | All the charts: hubs, airlines, countries, communities, route stats |
| 3 | **Route Explorer** | `/explorer` | Interactive: pick two airports -> shortest path on the map; look up any airport or airline |

**Why Route Explorer as the third page:** the project objectives explicitly include *shortest path*, *connectivity patterns*, *route redundancy* and *airline reach*. Charts alone cannot show these. A hands-on page where the user queries the graph is the natural demo of why a graph database was chosen, and it is the page evaluators will remember.

A small **About / Project** section lives in the footer of Home (team, tech stack, dataset credit) so it does not need its own tab.

---

## 3. End-to-end data flow

```
Kaggle CSVs (airlines, airports, routes)
        |
        v
[1] Python + Pandas/NumPy  --> clean data (\N -> null, fix IDs, drop bad rows)
        |
        v
[2] Neo4j property graph   --> (:Airport)-[:ROUTE {airline, stops, codeshare}]->(:Airport)
        |                       (:Airline)-[:OPERATES]->(:Route) or ROUTE.airline property
        v
[3] Cypher + Graph algorithms (PageRank, Dijkstra/shortest path, Louvain, degree)
        |
        v
[4] Export script (Python)  --> /public/data/*.json  (pre-computed insights)
        |
        v
[5] React dashboard (static hosting)  --> reads JSON, renders charts + map
        |
        v
[6] Google Analytics 4 --> page views, clicks, searches, session stats
```

**Key decision:** the dashboard reads **pre-computed JSON** exported from Neo4j rather than connecting the browser straight to the database. This keeps the Neo4j password out of the front end, makes the site fast, and lets it be hosted free (Vercel / Netlify / GitHub Pages). See `architecture.md` for the optional live-API mode.

---

## 4. User flow

### 4.1 First visit (Home)
1. User lands on `/`.
2. KPI cards animate in: Airports, Airlines, Routes, Countries, Avg. connections per airport.
3. Hero map shows all airports as points, sized by PageRank; top hubs glow.
4. "Top 5 hubs" and "Top 5 airlines" quick lists appear.
5. Call-to-action buttons: **View Analytics ->** and **Try Route Explorer ->**.

### 4.2 Analytics
1. User opens `/analytics`.
2. Global filter bar (Region/Continent, Top N) at the top.
3. Sections scroll in order: **Hubs -> Airlines -> Geography -> Communities -> Route stats**.
4. Hover shows tooltips; clicking a bar/point on Hubs or Airlines opens a side drawer with details and a "View in Explorer" link.
5. Each chart has a small "i" tooltip explaining which graph algorithm / query produced it.

### 4.3 Route Explorer
1. User opens `/explorer`.
2. Picks **From** and **To** airports (autocomplete by name / city / IATA).
3. Clicks **Find route**. Dashboard computes the shortest path (fewest hops) and draws it on the map.
4. Result panel shows: path (e.g., BOM -> DXB -> JFK), number of stops, distance (km), airlines serving each leg.
5. Alternative routes (up to 3) listed to illustrate route redundancy.
6. Second tab in the page: **Airport profile** and **Airline profile** lookups (stats + routes drawn on the map).

### 4.4 Navigation
- Sticky top navbar on all pages; active tab highlighted.
- On mobile it collapses to a hamburger menu / bottom tab bar.
- Logo click -> Home.

---

## 5. Page-by-page content

### 5.1 Home
| Block | Content |
|-------|---------|
| Hero | Title "SkyGraph — the world's airline network as a graph", one-line description, 2 CTAs |
| KPI strip | Total airports, **active airlines (1,254)** with "6,160 historical" as the caption, routes, countries covered, average degree |
| Hero map | Global airport points + faint route arcs (sampled top routes) |
| Quick insights | "Busiest hub: ...", "Airline with widest reach: ...", "Most connected country: ...", "Largest community: ..." |
| How it works | 4-step strip: Clean (Python) -> Model (Neo4j) -> Analyze (Graph algorithms) -> Visualize (this dashboard) |
| Footer | Team names, tech stack badges, dataset source link |

### 5.2 Analytics (charts)
| # | Chart | Type | Source metric |
|---|-------|------|---------------|
| 1 | Top 15 hub airports | Horizontal bar | PageRank score |
| 2 | Degree vs PageRank | Scatter / bubble | in-degree, out-degree, PageRank |
| 3 | Top 15 airlines by routes | Bar | route count per airline |
| 4 | Airline geographic reach | Bar / lollipop | distinct countries and airports served |
| 5 | Routes by country (top 15) | Bar | outgoing routes per country |
| 6 | Global route density | Choropleth or heatmap map | routes per country / airport density |
| 7 | Network communities | Treemap | Louvain community size + top airport per community |
| 8 | Route distance distribution | Histogram | haversine distance per route |
| 9 | Stops distribution | Donut | `stops` column (direct vs 1+ stop) |
| 10 | Codeshare share | Donut / KPI | codeshare = "Y" vs not |
| 11 | Aircraft equipment usage | Bar (top 10) | equipment codes from routes |
| 12 | Airline x Region matrix | Heatmap | routes per airline per continent (top airlines) |
| 13 | Airlines by country (active vs defunct) | Stacked horizontal bar (top 20) | `airlines_by_country.json`, built from airlines.csv. Real numbers: US 156 active, Russia 80, UK 45, Germany 38, Canada 37 |
| 14 | Active vs defunct airlines | Donut | 1,254 active vs 4,906 defunct (airlines.csv `Active`) |

> Charts 13 and 14 need only airlines.csv, so they can be built and tested immediately with real data. If time is short, build charts **1, 3, 4, 5, 6, 7** first. Those are the ones that look the best and map directly to the objectives.

### 5.3 Route Explorer
| Block | Content |
|-------|---------|
| Search panel | From, To, "Swap" button, "Find route" |
| Map | Leaflet map with highlighted path and animated plane marker |
| Result card | Hops, total distance, legs table |
| Alternatives | Up to 3 other paths (route redundancy) |
| Profile tabs | Airport profile, Airline profile |

---

## 6. Interaction & analytics events (Google Analytics 4)

| Event name | Fired when | Params |
|------------|-----------|--------|
| `page_view` | Every route change (SPA) | `page_path`, `page_title` |
| `kpi_click` | KPI card clicked | `kpi_name` |
| `chart_click` | Drawer opened from clicking a bar or chart point | `chart_id`, `item` |
| `filter_change` | Region / Top-N changed | `filter`, `value` |
| `route_search` | "Find route" pressed | `from`, `to`, `hops` |
| `profile_view` | Airport/airline profile opened | `type`, `id` |
| `cta_click` | Home CTAs | `target` |
| `outbound_click` | Dataset / GitHub link | `url` |

Goal: satisfy objective #6 (track visitor engagement and usage statistics) and have real screenshots for the project report.

---

## 7. Build order (suggested for Antigravity)

1. Scaffold React + Vite app, routing, navbar, theme, layout shell.
2. Add JSON data loader + sample/mock data so the UI can be built before the export is ready.
3. Build **Home** (KPIs + hero map).
4. Build **Analytics** charts one by one (start with top hubs and airlines).
5. Build **Route Explorer** (graph in memory + BFS/Dijkstra + map drawing).
6. Plug in the real JSON exported from Neo4j.
7. Add Google Analytics 4 + events.
8. Polish: loading skeletons, empty states, responsive, accessibility.
9. Deploy (Vercel/Netlify) and test on mobile.

---

## 8. Definition of done

- [ ] 3 pages reachable from the navbar, all responsive (mobile + desktop)
- [ ] Home shows real KPIs from the dataset
- [ ] At least 8 charts on Analytics, each with title, tooltip and short "insight" caption
- [ ] Route Explorer returns a correct shortest path for any two connected airports
- [ ] GA4 receives page views and custom events
- [ ] Deployed public URL, no secrets in the front-end bundle
- [ ] README with run instructions and data refresh steps
