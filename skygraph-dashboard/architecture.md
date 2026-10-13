# architecture.md — SkyGraph Dashboard: Technical Architecture

> **For Antigravity:** read `instructions.md` first. This file defines the data contract (JSON files), tech stack, folder structure and the graph engine. Follow the folder structure in section 6 exactly. Section 2.1 is verified against the real airlines.csv; section 2.2 is assumed until the other CSVs are checked.

> Scope: the **dashboard** part of the project (front end, data layer, analytics, deployment).
> Upstream (already handled by teammates): Python cleaning + Neo4j graph + graph algorithms.

---

## 1. Architecture at a glance

```
+------------------+     +-------------------+     +----------------------+
|  Kaggle CSVs     | --> | Python (Pandas)   | --> | Neo4j property graph |
|  airlines        |     | clean + validate  |     | Airport / Airline /  |
|  airports        |     +-------------------+     | ROUTE relationships  |
|  routes          |                               +----------+-----------+
+------------------+                                          |
                                         Cypher + GDS (PageRank, Louvain, shortest path)
                                                              |
                                                              v
                                              +-------------------------------+
                                              | export_for_dashboard.py       |
                                              | writes JSON to /public/data   |
                                              +---------------+---------------+
                                                              |
                                                              v
+------------------------------ React SPA (Vite) -------------------------------+
|  Navbar | Home | Analytics | Route Explorer | Footer                           |
|  Data layer (fetch JSON + cache)  |  Graph engine (client-side BFS/Dijkstra)   |
|  Charts (ECharts)  |  Map (Leaflet)  |  State (Zustand)  |  GA4 (gtag)         |
+--------------------------------------+-----------------------------------------+
                                       |
                              Static hosting (Vercel / Netlify / GitHub Pages)
```

---

## 2. Dataset (verified source) and expected schema

Source: Kaggle *Airlines, Airport, and Flight Routes* — **7,658 airports, ~6,100 airlines, 67,664 routes** (from OpenFlights).

### 2.1 airlines.csv — VERIFIED against the real file (6,161 rows)

Columns (exact, in order): `Name, IATA, ICAO, Callsign, Country, Active`

> There is **no `Airline ID` column** in this version of the dataset. Do not assume one.

Verified facts:
| Fact | Value |
|------|-------|
| Rows | 6,161 |
| `Active = Y` | 1,254 (about 20%); `N` = 4,906; plus 1 stray lowercase `n` (normalise to `N`) |
| Missing IATA | 4,627 rows (most defunct/small carriers have none) |
| Missing ICAO | 274 rows |
| Missing Country | 17 rows |
| Distinct country strings | 278 overall, 195 among active airlines |
| Duplicate IATA codes | 414 overall; **20 duplicates even among active airlines** |
| Duplicate ICAO codes among active | 8 |
| Active airlines with neither IATA nor ICAO | 1 (the junk row `Private flight`) |
| Top countries (active) | United States 156, Russia 80, United Kingdom 45, Germany 38, Canada 37, Australia 27 |

Quirks the pipeline and dashboard must handle:
- Missing codes appear as an **empty string, `-`, `N/A` or `\N`** — treat all of them as null.
- Row 0 `Private flight` (IATA `-`, ICAO `N/A`) is junk. Drop it.
- A few rows have **shifted columns** (e.g. `Aerojet de Costa Rica`, `Bellview Airlines`: the callsign/country text landed in the wrong column). Rows with an invalid Country or a Country that is not a real country name should be flagged and excluded from country charts.
- `Active` is `Y`/`N`. Default dashboard view = **active airlines only** (1,254), with a toggle to include defunct ones. Quote both numbers on Home ("1,254 active · 6,160 historical").
- **IATA codes are NOT unique** (old airlines reuse codes). So the dashboard must never use `IATA` alone as an airline ID. Use a generated `airlineKey`:
  `airlineKey = ICAO if valid else IATA if valid else slug(Name)`, and keep `Name` and `Country` alongside to disambiguate. When linking routes -> airlines, prefer an **active** airline over a defunct one that shares the same IATA code.
- Airline "logos" are initials badges built from IATA (or ICAO if IATA is null).

### 2.2 airports.csv and routes.csv — NOT YET VERIFIED

Not seen yet. The standard OpenFlights headers are assumed below. **Confirm the real headers on day 1** (send both files or their first 5 rows) and update `src/config/schema.js` if they differ.

**airports.csv (assumed)**
`Airport ID, Name, City, Country, IATA, ICAO, Latitude, Longitude, Altitude, Timezone, DST, Tz database time zone, Type, Source`

**routes.csv (assumed)**
`Airline, Airline ID, Source airport, Source airport ID, Destination airport, Destination airport ID, Codeshare, Stops, Equipment`

Because `airlines.csv` has no ID, the route -> airline link must be done through the **airline code in routes.csv** (the `Airline` column holds an IATA 2-letter or ICAO 3-letter code). If routes.csv has an `Airline ID` column, it will NOT match anything in airlines.csv; ignore it.

Further quirks to handle:
- Missing values stored as `\N` (-> `null`)
- Some routes reference airport or airline codes that do not exist in the other tables (drop or flag; report the count in `meta.json` as `droppedRoutes`)
- `Codeshare` is `"Y"` or empty
- `Stops` is almost always `0`
- Airports without IATA codes cannot be shown in the autocomplete (use ICAO fallback)

---

## 3. Graph model (Neo4j) — what the dashboard assumes

```
(:Airport {id, name, city, country, iata, icao, lat, lon, altitude, tz,
           pagerank, degree, inDegree, outDegree, communityId})

(:Airline {key, name, iata, icao, callsign, country, active})   // key = airlineKey (see section 2.1); there is no numeric ID in the CSV

(:Airport)-[:ROUTE {airlineKey, airlineName, codeshare, stops, equipment, distanceKm}]->(:Airport)
(:Airline)-[:OPERATES]->(:Airport)     // optional shortcut for airline reach
(:Airport)-[:LOCATED_IN]->(:Country {name, code, continent})
```

Pre-computed properties written by the algorithm step: `pagerank`, `communityId` (Louvain), `degree`.

---

## 4. Data contract — JSON files the dashboard consumes

Exported to `public/data/` by `scripts/export_for_dashboard.py` (Neo4j -> JSON). Keep each file small (<2 MB where possible; gzip on host).

| File | Shape (abridged) | Used by |
|------|------------------|---------|
| `summary.json` | `{airports, airlines, activeAirlines, routes, countries, avgDegree, directShare, codeshareShare, droppedRoutes}` | Home KPIs |
| `airports.json` | `[{id, name, city, country, iata, lat, lon, pagerank, degree, communityId}]` | Maps, search, scatter |
| `airlines.json` | `[{key, name, iata, icao, country, active, routeCount, countryCount, airportCount}]` (all 6,160 rows; charts default to `active:true`) | Airline charts, search |
| `airlines_by_country.json` | `[{country, active, defunct}]` (top 20 by active) | Airlines-by-country chart |
| `top_hubs.json` | `[{iata, name, city, country, pagerank, degree}]` (top 50) | Hubs bar chart, Home list |
| `country_stats.json` | `[{country, code, continent, airports, routesOut, routesIn}]` | Country bar + choropleth |
| `communities.json` | `[{id, size, topAirport, topCountries[], label}]` | Community chart |
| `route_distance_hist.json` | `{bins[], counts[]}` | Histogram |
| `stops_codeshare.json` | `{stops:{0,1,2+}, codeshare:{Y,N}}` | Donuts |
| `equipment_top.json` | `[{code, count}]` (top 15) | Equipment bar |
| `airline_region_matrix.json` | `{airlines[], regions[], values[][]}` | Heatmap |
| `edges.json` | `[[srcIdx, dstIdx, airlineIdx]]` compact, de-duplicated by (src,dst) with airline list | Explorer graph + Home arcs |
| `meta.json` | `{generatedAt, source, version}` | Footer "Data as of" |

**Size tip:** use integer indexes into `airports.json` instead of repeating strings in `edges.json`. ~37k unique airport pairs fits comfortably under 1 MB.

---

## 5. Front-end stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **React 18 + Vite** | In the project's stack (HTML/CSS/JS/React), fast dev server |
| Routing | `react-router-dom` v6 | 3 pages, SPA navigation |
| Styling | **Tailwind CSS** + CSS variables for theme | Fast, consistent, easy dark theme |
| Charts | **Apache ECharts** via `echarts-for-react` | Bar, scatter, heatmap, graph, treemap, donut — all in one lib, looks premium |
| Map | **react-leaflet** + CARTO dark tiles | Free, light; polylines for routes, circle markers for airports |
| State | **Zustand** | Tiny store for filters, selected airports, data cache |
| Animations | **Framer Motion** | Page transitions, KPI count-up, card reveals |
| Icons | `lucide-react` | Clean icon set |
| Analytics | **Google Analytics 4** (`gtag.js`) | Objective #6 |
| Lint/format | ESLint + Prettier | Consistency |

---

## 6. Project structure

```
skygraph-dashboard/
├─ public/
│  └─ data/                      # JSON exported from Neo4j
├─ scripts/
│  └─ export_for_dashboard.py    # Neo4j -> JSON (run manually when data changes)
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx                    # router + layout
│  ├─ config/
│  │  ├─ schema.js               # field names, constants
│  │  └─ theme.js                # chart colors, tokens
│  ├─ data/
│  │  ├─ loader.js               # fetch + cache JSON
│  │  └─ useData.js              # hook
│  ├─ graph/
│  │  ├─ buildGraph.js           # adjacency list from edges.json
│  │  ├─ shortestPath.js         # BFS (hops) + Dijkstra (km)
│  │  └─ kShortest.js            # up to 3 alternative paths
│  ├─ store/
│  └─ useStore.js                # Zustand
│  ├─ analytics/
│  │  └─ ga.js                   # init + trackEvent + trackPageView
│  ├─ components/
│  │  ├─ layout/ (Navbar, Footer, PageShell)
│  │  ├─ ui/ (KpiCard, ChartCard, Drawer, SearchSelect, Skeleton, Badge)
│  │  ├─ charts/ (HubsBar, DegreeScatter, AirlinesBar, ReachBar, CountryBar,
│  │  │           CommunityGraph, DistanceHist, DonutChart, EquipmentBar, Heatmap)
│  │  └─ map/ (WorldMap, RouteLayer, AirportMarkers)
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Analytics.jsx
│  │  └─ RouteExplorer.jsx
│  └─ styles/index.css
├─ .env.example                  # VITE_GA_ID=G-XXXXXXXXXX
├─ index.html
├─ package.json
└─ README.md
```

---

## 7. Key modules

### 7.1 Data layer
- `loader.js` fetches JSON files once, stores them in Zustand, and exposes `useData('top_hubs')`.
- Every page shows a **skeleton** while loading and an **error card** with a retry on failure.
- Large files (`edges.json`, `airports.json`) load lazily, only when the Home map or Explorer mounts.

### 7.2 Client-side graph engine (Route Explorer)
- Build adjacency list `Map<airportIdx, [{to, airlineIdx, km}]>` from `edges.json`.
- **BFS** for fewest hops (instant on ~7k nodes / ~37k edges).
- **Dijkstra** weighted by haversine km for shortest distance.
- **Alternatives:** run BFS, then block one intermediate airport of the best path and rerun (up to 3 distinct paths) to show redundancy.
- Haversine computed from lat/lon on the fly.

### 7.3 Google Analytics
- `ga.js` loads gtag once using `VITE_GA_ID`.
- A `<RouteTracker />` component inside the router fires `page_view` on location change.
- `trackEvent(name, params)` wrapper used by components (see event list in `flow.md`).

### 7.4 State shape (Zustand)
```js
{
  data: { summary, airports, airlines, ... },
  filters: { continent: 'All', topN: 15, activeOnly: true },
  explorer: { from: null, to: null, result: null, alternatives: [] },
  ui: { drawer: { open: false, type: null, id: null } }
}
```

---

## 8. Optional "live mode" (only if the team wants real-time Neo4j)

```
React  --HTTPS-->  FastAPI (or Express)  --Bolt-->  Neo4j AuraDB / local Neo4j
```

---

## 9. Export script outline (Neo4j -> JSON)

```python
# scripts/export_for_dashboard.py
from neo4j import GraphDatabase
import json, os

URI, USER, PWD = os.getenv("NEO4J_URI"), os.getenv("NEO4J_USER"), os.getenv("NEO4J_PASSWORD")
driver = GraphDatabase.driver(URI, auth=(USER, PWD))

QUERIES = {
  "top_hubs": """
    MATCH (a:Airport) RETURN a.iata AS iata, a.name AS name, a.city AS city,
           a.country AS country, a.pagerank AS pagerank, a.degree AS degree
    ORDER BY a.pagerank DESC LIMIT 50""",
  "airlines": """
    MATCH (al:Airline)<-[:OPERATED_BY]-(r) ...""",   # adapt to the team's model
  # ... one query per file in section 4
}

def run(q):
    with driver.session() as s:
        return [dict(r) for r in s.run(q)]

for name, q in QUERIES.items():
    with open(f"public/data/{name}.json", "w", encoding="utf-8") as f:
        json.dump(run(q), f, ensure_ascii=False, separators=(",", ":"))
```

---

## 10. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | First contentful paint < 2 s on 4G; Home loads only `summary`, `top_hubs`, light map data first |
| Responsive | 360 px mobile up to 1920 px desktop |
| Accessibility | Color contrast AA, keyboard-navigable navbar and search, `aria-label` on charts, colorblind-safe palette |
| Security | No DB credentials in client; env vars via `.env`; dependencies audited |
| Browser support | Latest Chrome, Edge, Safari, Firefox |
| Maintainability | Components under ~200 lines, one chart per file, constants in config |
| Privacy | GA4 with IP anonymization (default in GA4); short note in footer |

---

## 11. Deployment

1. Push to GitHub.
2. Connect repo to **Vercel** (or Netlify): build `npm run build`, output `dist`.
3. Set env var `VITE_GA_ID`.
4. Data refresh: re-run export script -> commit new JSON -> auto redeploy.

---

## 12. Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Column names differ from assumed schema | Centralise in `schema.js`; verify CSV headers on day 1 |
| `edges.json` too large / slow | Index-based compact format, gzip, lazy load, de-duplicate pairs |
| Map clutter with thousands of routes | Draw only top-N routes on Home; draw selected path/airline only in Explorer |
| Graph team's model differs from mine | Agree on the data contract in section 4; I only depend on the JSON |
| Defunct airlines distort stats (only ~20% of airlines are active) | Default `activeOnly = true`, toggle in UI |
| Duplicate IATA codes (20 among active airlines) mislink routes | Use `airlineKey`, prefer active airline on a code clash, count ambiguous links in `meta.json` |
| airports.csv / routes.csv headers not yet seen | Day-1 check; schema isolated in `schema.js`; mock data keeps UI work unblocked |
| Time limit | Build order in `flow.md`; charts 1, 3, 4, 5, 6, 7 are the must-haves |
