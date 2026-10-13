import React, { useState, useMemo, useEffect } from 'react';
import PageShell from '../components/layout/PageShell';
import ExplorerMap from '../components/map/ExplorerMap';
import SearchSelect from '../components/ui/SearchSelect';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { useStore } from '../store/useStore';
import useData from '../data/useData';
import { buildGraph } from '../graph/buildGraph';
import { bfsFewestHops, dijkstraShortestDistance } from '../graph/shortestPath';
import { findAlternativePaths } from '../graph/kShortest';
import { trackEvent } from '../analytics/ga';
import {
  Compass,
  ArrowRightLeft,
  Route,
  MapPin,
  Plane,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

export default function RouteExplorer() {
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'airport' | 'airline'
  const [metricMode, setMetricMode] = useState('dijkstra'); // 'dijkstra' (km) | 'bfs' (hops)
  const [searching, setSearching] = useState(false);
  const [selectedAlternativeIdx, setSelectedAlternativeIdx] = useState(-1);

  // Zustand Store
  const originAirport = useStore((state) => state.explorer.from);
  const destAirport = useStore((state) => state.explorer.to);
  const setOrigin = useStore((state) => state.setExplorerOrigin);
  const setDest = useStore((state) => state.setExplorerDestination);
  const swapAirports = useStore((state) => state.swapExplorerAirports);

  // Load Graph Data
  const { data: airports = [] } = useData('AIRPORTS');
  const { data: edges = [] } = useData('EDGES');
  const { data: airlines = [] } = useData('AIRLINES');

  // Build Adjacency Graph in Memory
  const graphAdj = useMemo(() => {
    if (!edges.length || !airports.length) return new Map();
    return buildGraph(edges, airports);
  }, [edges, airports]);

  // Airport index lookup map by IATA code
  const airportIndexMap = useMemo(() => {
    const map = new Map();
    airports.forEach((a, idx) => {
      if (a.iata) map.set(a.iata, idx);
      map.set(String(a.id), idx);
    });
    return map;
  }, [airports]);

  // Airline lookup map by index
  const getAirline = (idx) => {
    return airlines[idx] || { name: 'Direct Airline', iata: 'FL', key: 'flight' };
  };

  // Set default initial airports if not already chosen (e.g. BOM to JFK)
  useEffect(() => {
    if (!originAirport && airports.length >= 2) {
      const bom = airports.find((a) => a.iata === 'BOM') || airports[0];
      setOrigin(bom);
    }
    if (!destAirport && airports.length >= 2) {
      const jfk = airports.find((a) => a.iata === 'JFK') || airports[1];
      setDest(jfk);
    }
  }, [airports, originAirport, destAirport, setOrigin, setDest]);

  // Route calculation state
  const [routeResult, setRouteResult] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [noRouteFound, setNoRouteFound] = useState(false);

  // Airport Profile Search Tab State
  const [selectedProfileAirport, setSelectedProfileAirport] = useState(null);

  // Airline Profile Search Tab State
  const [selectedProfileAirline, setSelectedProfileAirline] = useState(null);

  // Run Route Search Calculation
  const handleFindRoute = () => {
    if (!originAirport || !destAirport || !graphAdj.size) return;

    setSearching(true);
    setNoRouteFound(false);
    setSelectedAlternativeIdx(-1);

    const startIdx = airportIndexMap.get(originAirport.iata) ?? 0;
    const targetIdx = airportIndexMap.get(destAirport.iata) ?? 1;

    setTimeout(() => {
      let result = null;
      if (metricMode === 'dijkstra') {
        result = dijkstraShortestDistance(graphAdj, startIdx, targetIdx);
      } else {
        result = bfsFewestHops(graphAdj, startIdx, targetIdx);
      }

      if (result) {
        setRouteResult(result);
        const alts = findAlternativePaths(graphAdj, startIdx, targetIdx, result, 3);
        setAlternativeRoutes(alts);

        trackEvent('route_search', {
          from: originAirport.iata,
          to: destAirport.iata,
          hops: result.hops,
          distanceKm: result.totalKm,
          mode: metricMode,
        });
      } else {
        setRouteResult(null);
        setAlternativeRoutes([]);
        setNoRouteFound(true);
      }
      setSearching(false);
    }, 200);
  };

  // Auto-calculate on initial load once graph is ready
  useEffect(() => {
    if (graphAdj.size && originAirport && destAirport && !routeResult && !noRouteFound) {
      handleFindRoute();
    }
  }, [graphAdj, originAirport, destAirport]);

  // Active path node objects for map rendering
  const activePathAirports = useMemo(() => {
    const activeRouteObj =
      selectedAlternativeIdx >= 0 ? alternativeRoutes[selectedAlternativeIdx] : routeResult;

    if (!activeRouteObj || !activeRouteObj.path) return null;
    return activeRouteObj.path.map((idx) => airports[idx] || { iata: `Node-${idx}` });
  }, [routeResult, alternativeRoutes, selectedAlternativeIdx, airports]);

  // Profile: outgoing destinations for selected airport
  const airportOutgoing = useMemo(() => {
    if (!selectedProfileAirport || !graphAdj.size) return [];
    const idx = airportIndexMap.get(selectedProfileAirport.iata);
    if (idx === undefined) return [];
    const edgesList = graphAdj.get(idx) || [];
    return edgesList.map((e) => airports[e.to]).filter(Boolean);
  }, [selectedProfileAirport, graphAdj, airports, airportIndexMap]);

  // Profile: routes for selected airline
  const airlineRoutes = useMemo(() => {
    if (!selectedProfileAirline || !edges.length) return [];
    const airIdx = airlines.findIndex((a) => a.key === selectedProfileAirline.key);
    if (airIdx < 0) return [];
    return edges
      .filter(([s, d, aIdx]) => aIdx === airIdx)
      .map(([s, d]) => ({
        src: airports[s],
        dst: airports[d],
      }))
      .filter((r) => r.src && r.dst);
  }, [selectedProfileAirline, edges, airlines, airports]);

  return (
    <PageShell
      title="Route Explorer"
      subtitle="Interactive client-side graph engine. Query shortest paths (fewest hops & Dijkstra km), explore network redundancy, and audit airport/airline profiles."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control Panel (380px on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-bg-elev p-5 shadow-card space-y-5">
            
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-bg-elev-2 border border-border text-xs font-semibold">
              <button
                onClick={() => setActiveTab('find')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'find'
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                Find Route
              </button>
              <button
                onClick={() => {
                  setActiveTab('airport');
                  if (!selectedProfileAirport && airports.length) {
                    setSelectedProfileAirport(airports[0]);
                  }
                  trackEvent('profile_view', { type: 'airport' });
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'airport'
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                Airport Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab('airline');
                  if (!selectedProfileAirline && airlines.length) {
                    setSelectedProfileAirline(airlines[0]);
                  }
                  trackEvent('profile_view', { type: 'airline' });
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeTab === 'airline'
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                Airline Profile
              </button>
            </div>

            {/* TAB 1: FIND ROUTE */}
            {activeTab === 'find' && (
              <div className="space-y-4">
                {/* Metric Selector Toggle */}
                <div className="flex items-center justify-between text-xs border-b border-border/70 pb-3">
                  <span className="text-text-muted font-medium">Optimization Metric:</span>
                  <div className="inline-flex items-center p-0.5 rounded-lg bg-bg-elev-2 border border-border text-[11px]">
                    <button
                      onClick={() => setMetricMode('dijkstra')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        metricMode === 'dijkstra'
                          ? 'bg-primary text-[#070B14] font-bold shadow-sm'
                          : 'text-text-muted hover:text-text-main'
                      }`}
                    >
                      Dijkstra (Distance km)
                    </button>
                    <button
                      onClick={() => setMetricMode('bfs')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        metricMode === 'bfs'
                          ? 'bg-primary text-[#070B14] font-bold shadow-sm'
                          : 'text-text-muted hover:text-text-main'
                      }`}
                    >
                      BFS (Fewest Hops)
                    </button>
                  </div>
                </div>

                {/* Origin Autocomplete */}
                <SearchSelect
                  label="From (Origin Airport)"
                  items={airports}
                  value={originAirport}
                  onChange={setOrigin}
                  itemKey="id"
                  itemLabel="name"
                  itemSublabel="city"
                  placeholder="Select origin airport (e.g. BOM)"
                  icon={MapPin}
                />

                {/* Swap Button */}
                <div className="flex justify-center -my-1">
                  <button
                    onClick={swapAirports}
                    className="p-2 rounded-full bg-bg-elev-2 hover:bg-bg-elev border border-border text-text-muted hover:text-primary transition-all hover:scale-105"
                    title="Swap Origin and Destination"
                    aria-label="Swap Origin and Destination"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination Autocomplete */}
                <SearchSelect
                  label="To (Destination Airport)"
                  items={airports}
                  value={destAirport}
                  onChange={setDest}
                  itemKey="id"
                  itemLabel="name"
                  itemSublabel="city"
                  placeholder="Select destination airport (e.g. JFK)"
                  icon={MapPin}
                />

                {/* Find Route Button */}
                <Button
                  variant="primary"
                  size="md"
                  icon={Route}
                  loading={searching}
                  onClick={handleFindRoute}
                  className="w-full"
                >
                  Compute Shortest Path
                </Button>

                {/* Result Card */}
                {routeResult && (
                  <div className="mt-4 p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-primary/20 pb-3">
                      <div>
                        <div className="text-xs text-text-muted">Computed Route</div>
                        <div className="font-heading font-bold text-base text-text-main flex items-center gap-1.5 mt-0.5">
                          <span>{originAirport?.iata}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-primary" />
                          <span>{destAirport?.iata}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-heading font-bold text-lg text-primary tabular-nums">
                          {routeResult.hops} {routeResult.hops === 1 ? 'leg' : 'hops'}
                        </span>
                        <span className="block text-[11px] text-text-muted tabular-nums">
                          {routeResult.totalKm.toLocaleString()} km
                        </span>
                      </div>
                    </div>

                    {/* Legs Table */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                        Leg Flight Sequence
                      </div>
                      <div className="space-y-1.5">
                        {routeResult.legs.map((leg, i) => {
                          const srcA = airports[leg.from] || { iata: '—', city: 'Origin' };
                          const dstA = airports[leg.to] || { iata: '—', city: 'Dest' };
                          const air = getAirline(leg.airlineIdx);

                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between p-2 rounded-lg bg-bg-elev border border-border text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-secondary/20 border border-secondary/30 flex items-center justify-center font-mono font-bold text-[10px] text-secondary">
                                  {air.iata || 'AA'}
                                </div>
                                <div>
                                  <div className="font-medium text-text-main font-mono">
                                    {srcA.iata} → {dstA.iata}
                                  </div>
                                  <div className="text-[10px] text-text-muted">
                                    {air.name}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[11px] text-text-muted tabular-nums font-mono">
                                {leg.km.toLocaleString()} km
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Redundant Alternatives List */}
                    {alternativeRoutes.length > 0 && (
                      <div className="pt-2 border-t border-primary/20 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-text-muted">
                          <span className="font-semibold text-text-main">
                            Alternative Redundant Paths ({alternativeRoutes.length}):
                          </span>
                          <span className="text-secondary text-[10px]">Click to highlight</span>
                        </div>
                        <div className="space-y-1.5">
                          {alternativeRoutes.map((alt, idx) => {
                            const isSelected = selectedAlternativeIdx === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedAlternativeIdx(isSelected ? -1 : idx)}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors border text-left ${
                                  isSelected
                                    ? 'bg-secondary/15 border-secondary text-text-main'
                                    : 'bg-bg-elev/80 border-border hover:border-secondary/40 text-text-muted'
                                }`}
                              >
                                <span className="font-mono truncate">
                                  {alt.path.map((p) => airports[p]?.iata || p).join(' → ')}
                                </span>
                                <span className="text-[11px] text-secondary shrink-0 ml-2 font-mono tabular-nums">
                                  {alt.hops} hops • {alt.totalKm.toLocaleString()} km
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State when no route exists */}
                {noRouteFound && (
                  <EmptyState
                    title="No connected flight route"
                    description={`There is no scheduled graph connection between ${originAirport?.iata} and ${destAirport?.iata} in this dataset.`}
                    actionLabel="Try Another Destination"
                    onAction={() => setDest(airports[Math.floor(Math.random() * airports.length)])}
                  />
                )}
              </div>
            )}

            {/* TAB 2: AIRPORT PROFILE */}
            {activeTab === 'airport' && (
              <div className="space-y-4">
                <SearchSelect
                  label="Select Airport to Profile"
                  items={airports}
                  value={selectedProfileAirport}
                  onChange={setSelectedProfileAirport}
                  itemKey="id"
                  itemLabel="name"
                  itemSublabel="city"
                />

                {selectedProfileAirport && (
                  <div className="space-y-4 p-4 rounded-xl bg-bg-elev border border-border">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <div className="font-heading font-bold text-base text-text-main">
                          {selectedProfileAirport.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {selectedProfileAirport.city}, {selectedProfileAirport.country}
                        </div>
                      </div>
                      <Badge variant="rank">{selectedProfileAirport.iata}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-bg-elev-2">
                        <span className="text-text-muted">PageRank Centrality</span>
                        <div className="text-sm font-bold text-primary mt-0.5">
                          {selectedProfileAirport.pagerank}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-bg-elev-2">
                        <span className="text-text-muted">Direct Outgoing Routes</span>
                        <div className="text-sm font-bold text-accent mt-0.5">
                          {selectedProfileAirport.degree} routes
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-text-muted uppercase">
                        Sample Direct Destinations ({airportOutgoing.length}):
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                        {airportOutgoing.map((dest, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded bg-bg-elev-2 text-xs"
                          >
                            <span className="font-medium text-text-main">{dest.city}</span>
                            <span className="font-mono text-primary text-[11px]">{dest.iata}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AIRLINE PROFILE */}
            {activeTab === 'airline' && (
              <div className="space-y-4">
                <SearchSelect
                  label="Select Carrier to Profile"
                  items={airlines}
                  value={selectedProfileAirline}
                  onChange={setSelectedProfileAirline}
                  itemKey="key"
                  itemLabel="name"
                  itemSublabel="country"
                  placeholder="Search carrier (e.g. Delta, Emirates)"
                />

                {selectedProfileAirline && (
                  <div className="space-y-4 p-4 rounded-xl bg-bg-elev border border-border">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <div className="font-heading font-bold text-base text-text-main">
                          {selectedProfileAirline.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {selectedProfileAirline.country || 'International'}
                        </div>
                      </div>
                      <Badge variant={selectedProfileAirline.active ? 'status' : 'danger'}>
                        {selectedProfileAirline.active ? 'Active Carrier' : 'Defunct Carrier'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-bg-elev-2">
                        <span className="text-text-muted">Network Routes</span>
                        <div className="text-sm font-bold text-primary mt-0.5">
                          {selectedProfileAirline.routeCount?.toLocaleString() || '1,200+'}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-bg-elev-2">
                        <span className="text-text-muted">Countries Reached</span>
                        <div className="text-sm font-bold text-secondary mt-0.5">
                          {selectedProfileAirline.countryCount || '50+'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[11px] font-semibold text-text-muted uppercase">
                        Active Route Corridors ({airlineRoutes.length}):
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                        {airlineRoutes.map((r, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded bg-bg-elev-2 text-xs font-mono"
                          >
                            <span>{r.src?.iata} → {r.dst?.iata}</span>
                            <span className="text-text-muted text-[10px]">{r.src?.city}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Map Canvas (Remaining space, min 560px height) */}
        <div className="lg:col-span-7 xl:col-span-8 min-h-[560px] h-[calc(100vh-12rem)]">
          <ExplorerMap
            airports={airports}
            airlines={airlines}
            activePath={activeTab === 'find' ? activePathAirports : null}
            alternatives={activeTab === 'find' ? alternativeRoutes : []}
            profileAirport={activeTab === 'airport' ? selectedProfileAirport : null}
            profileAirline={activeTab === 'airline' ? selectedProfileAirline : null}
            airportOutgoingRoutes={airportOutgoing}
            airlineRoutes={airlineRoutes}
          />
        </div>

      </div>
    </PageShell>
  );
}
