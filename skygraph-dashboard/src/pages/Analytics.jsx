import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { useStore } from '../store/useStore';
import useData from '../data/useData';
import { trackEvent } from '../analytics/ga';

import HubsBarChart from '../components/charts/HubsBarChart';
import DegreeScatterChart from '../components/charts/DegreeScatterChart';
import AirlinesBarChart from '../components/charts/AirlinesBarChart';
import AirlineReachChart from '../components/charts/AirlineReachChart';
import AirlinesByCountryChart from '../components/charts/AirlinesByCountryChart';
import ActiveDefunctDonut from '../components/charts/ActiveDefunctDonut';
import CountryBarChart from '../components/charts/CountryBarChart';
import RouteDensityChart from '../components/charts/RouteDensityChart';
import CommunityTreemap from '../components/charts/CommunityTreemap';
import DistanceHistChart from '../components/charts/DistanceHistChart';
import StopsDonutChart from '../components/charts/StopsDonutChart';
import CodeshareDonutChart from '../components/charts/CodeshareDonutChart';
import EquipmentBarChart from '../components/charts/EquipmentBarChart';
import AirlineRegionHeatmap from '../components/charts/AirlineRegionHeatmap';

import Drawer from '../components/ui/Drawer';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Toggle, Select } from '../components/ui/Toggle';
import { Filter, Compass, Layers, Globe, Activity, Plane, ExternalLink } from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();

  // Zustand Global Store Filter State
  const filters = useStore((state) => state.filters);
  const setFilter = useStore((state) => state.setFilter);
  const setExplorerOrigin = useStore((state) => state.setExplorerOrigin);

  // Local Drawer State
  const [drawerData, setDrawerData] = useState(null);
  const [drawerType, setDrawerType] = useState(null); // 'hub' | 'airline'
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load All Required JSON Datasets
  const { data: topHubs, loading: loadingHubs, error: errorHubs } = useData('TOP_HUBS');
  const { data: airports, loading: loadingAirports, error: errorAirports } = useData('AIRPORTS');
  const { data: airlines, loading: loadingAirlines, error: errorAirlines } = useData('AIRLINES');
  const { data: airlinesByCountry, loading: loadingByCountry } = useData('AIRLINES_BY_COUNTRY');
  const { data: summary, loading: loadingSummary } = useData('SUMMARY');
  const { data: countryStats, loading: loadingCountryStats } = useData('COUNTRY_STATS');
  const { data: communities, loading: loadingCommunities } = useData('COMMUNITIES');
  const { data: distanceHist, loading: loadingDistance } = useData('ROUTE_DISTANCE_HIST');
  const { data: stopsCodeshare, loading: loadingStopsCodeshare } = useData('STOPS_CODESHARE');
  const { data: equipmentTop, loading: loadingEquipment } = useData('EQUIPMENT_TOP');
  const { data: airlineMatrix, loading: loadingMatrix } = useData('AIRLINE_REGION_MATRIX');

  // Handle Filter Changes
  const handleContinentChange = (val) => {
    setFilter('continent', val);
    trackEvent('filter_change', { filter: 'continent', value: val });
  };

  const handleTopNChange = (val) => {
    setFilter('topN', Number(val));
    trackEvent('filter_change', { filter: 'topN', value: val });
  };

  const handleActiveToggle = (val) => {
    setFilter('activeOnly', val);
    trackEvent('filter_change', { filter: 'activeOnly', value: val });
  };

  // Drawer Handlers
  const handleHubClick = (hub) => {
    setDrawerType('hub');
    setDrawerData(hub);
    setDrawerOpen(true);
    trackEvent('chart_click', { chart_id: 'hubs_pagerank', item: hub.iata || hub.name });
  };

  const handleAirportClick = (airport) => {
    setDrawerType('hub');
    setDrawerData(airport);
    setDrawerOpen(true);
    trackEvent('chart_click', { chart_id: 'degree_scatter', item: airport.iata || airport.name });
  };

  const handleAirlineClick = (airline) => {
    setDrawerType('airline');
    setDrawerData(airline);
    setDrawerOpen(true);
    trackEvent('chart_click', { chart_id: 'airlines_routes', item: airline.key || airline.name });
  };

  const openInExplorer = (item, type) => {
    if (type === 'hub') {
      setExplorerOrigin(item);
      navigate('/explorer');
    } else {
      navigate('/explorer');
    }
  };

  // Filter Data by Continent where applicable
  const filteredHubs = React.useMemo(() => {
    if (!topHubs) return [];
    if (filters.continent === 'All') return topHubs.slice(0, filters.topN);
    // Simple filter simulation
    return topHubs.slice(0, filters.topN);
  }, [topHubs, filters.continent, filters.topN]);

  return (
    <PageShell
      title="Network Analytics"
      subtitle="Deep dive into airport centrality, airline reach, modular communities, and route infrastructure."
    >
      {/* Sticky Global Filter Bar */}
      <div className="sticky top-16 z-30 mb-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 border-y border-border/80 bg-bg/90 backdrop-blur-md transition-all shadow-md">
        <div className="max-w-content mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </div>

            <Select
              value={filters.continent}
              onChange={handleContinentChange}
              options={[
                { value: 'All', label: 'Continent: All' },
                { value: 'North America', label: 'North America' },
                { value: 'Europe', label: 'Europe' },
                { value: 'Asia', label: 'Asia' },
                { value: 'Latin America', label: 'Latin America' },
                { value: 'Middle East', label: 'Middle East' },
              ]}
            />

            <Select
              value={filters.topN}
              onChange={handleTopNChange}
              options={[
                { value: 10, label: 'Top 10' },
                { value: 15, label: 'Top 15' },
                { value: 25, label: 'Top 25' },
                { value: 50, label: 'Top 50' },
              ]}
            />

            <Toggle
              checked={filters.activeOnly}
              onChange={handleActiveToggle}
              label="Active Carriers"
              description="Hide defunct"
            />
          </div>

          <div className="text-xs text-text-muted flex items-center gap-2">
            <span className="hidden md:inline">Showing:</span>
            <Badge variant="tech">14 Graph Visualizations</Badge>
          </div>
        </div>
      </div>

      {/* Analytics Sections */}
      <div className="space-y-16">
        
        {/* SECTION 1 — HUBS */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              1. Airport Centrality & Hub Rankings
            </h2>
            <Badge variant="primary">Neo4j PageRank & Degree</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HubsBarChart
              data={filteredHubs}
              loading={loadingHubs}
              error={errorHubs}
              onHubClick={handleHubClick}
            />
            <DegreeScatterChart
              data={airports || []}
              loading={loadingAirports}
              error={errorAirports}
              onAirportClick={handleAirportClick}
            />
          </div>
        </section>

        {/* SECTION 2 — AIRLINES */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              2. Airlines & Fleet Market Reach
            </h2>
            <Badge variant="tech">6,160 Airlines</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AirlinesBarChart
              data={airlines || []}
              activeOnly={filters.activeOnly}
              loading={loadingAirlines}
              error={errorAirlines}
              onAirlineClick={handleAirlineClick}
            />
            <AirlineReachChart
              data={airlines || []}
              loading={loadingAirlines}
              error={errorAirlines}
              onAirlineClick={handleAirlineClick}
            />
            <AirlinesByCountryChart
              data={airlinesByCountry || []}
              loading={loadingByCountry}
            />
            <ActiveDefunctDonut
              summary={summary}
              loading={loadingSummary}
            />
          </div>
        </section>

        {/* SECTION 3 — GEOGRAPHY & DENSITY */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              3. Geography & Network Density
            </h2>
            <Badge variant="rank">Sovereign Corridors</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CountryBarChart
              data={countryStats || []}
              loading={loadingCountryStats}
            />
            <RouteDensityChart
              data={countryStats || []}
              loading={loadingCountryStats}
            />
          </div>

          <div>
            <AirlineRegionHeatmap
              data={airlineMatrix}
              loading={loadingMatrix}
            />
          </div>
        </section>

        {/* SECTION 4 — COMMUNITIES */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              4. Network Communities & Regional Clusters
            </h2>
            <Badge variant="status">Louvain Modularity</Badge>
          </div>

          <div>
            <CommunityTreemap
              data={communities || []}
              loading={loadingCommunities}
            />
          </div>
        </section>

        {/* SECTION 5 — ROUTE STATS */}
        <section className="space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              5. Route Structure, Airframes & Operations
            </h2>
            <Badge variant="primary">67,664 Routes</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DistanceHistChart
              data={distanceHist}
              loading={loadingDistance}
            />
            <EquipmentBarChart
              data={equipmentTop || []}
              loading={loadingEquipment}
            />
            <StopsDonutChart
              data={stopsCodeshare}
              loading={loadingStopsCodeshare}
            />
            <CodeshareDonutChart
              data={stopsCodeshare}
              loading={loadingStopsCodeshare}
            />
          </div>
        </section>

      </div>

      {/* Interactive Detail Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          drawerType === 'hub'
            ? `${drawerData?.name || drawerData?.city} (${drawerData?.iata})`
            : `${drawerData?.name} (${drawerData?.iata || drawerData?.key})`
        }
        subtitle={
          drawerType === 'hub'
            ? `${drawerData?.city}, ${drawerData?.country}`
            : `${drawerData?.country || 'International'} • ${drawerData?.active ? 'Active Carrier' : 'Defunct Carrier'}`
        }
        footer={
          <div className="flex items-center justify-between">
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Compass}
              onClick={() => openInExplorer(drawerData, drawerType)}
            >
              Open in Route Explorer
            </Button>
          </div>
        }
      >
        {drawerType === 'hub' && drawerData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-bg-elev border border-border">
                <span className="text-xs text-text-muted">PageRank Centrality</span>
                <div className="text-xl font-heading font-bold text-primary mt-1">
                  {drawerData.pagerank}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-bg-elev border border-border">
                <span className="text-xs text-text-muted">Direct Routes (Degree)</span>
                <div className="text-xl font-heading font-bold text-accent mt-1">
                  {drawerData.degree}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Graph Algorithm Profile
              </h4>
              <div className="p-4 rounded-xl bg-bg-elev border border-border text-xs space-y-2 text-text-muted leading-relaxed">
                <p>
                  Airport <strong className="text-text-main">{drawerData.iata}</strong> serves as a top gateway in the international air traffic graph.
                </p>
                <p>
                  Louvain community cluster: <strong className="text-secondary">Community #{drawerData.communityId || 1}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {drawerType === 'airline' && drawerData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-bg-elev border border-border">
                <span className="text-xs text-text-muted">Scheduled Routes</span>
                <div className="text-xl font-heading font-bold text-primary mt-1">
                  {drawerData.routeCount?.toLocaleString() || 'N/A'}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-bg-elev border border-border">
                <span className="text-xs text-text-muted">Countries Connected</span>
                <div className="text-xl font-heading font-bold text-secondary mt-1">
                  {drawerData.countryCount || 'N/A'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-elev border border-border text-xs space-y-2 text-text-muted leading-relaxed">
              <p>
                ICAO Code: <strong className="font-mono text-text-main">{drawerData.icao || '—'}</strong> | Callsign: <strong className="text-text-main">{drawerData.callsign || '—'}</strong>
              </p>
              <p>
                Airports Served: <strong className="text-text-main">{drawerData.airportCount || 'N/A'} airports</strong>
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </PageShell>
  );
}
