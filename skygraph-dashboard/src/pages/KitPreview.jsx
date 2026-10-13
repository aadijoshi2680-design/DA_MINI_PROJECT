import React, { useState } from 'react';
import PageShell from '../components/layout/PageShell';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import KpiCard from '../components/ui/KpiCard';
import ChartCard from '../components/ui/ChartCard';
import SearchSelect from '../components/ui/SearchSelect';
import Drawer from '../components/ui/Drawer';
import Tooltip from '../components/ui/Tooltip';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Toggle, Select } from '../components/ui/Toggle';
import { Plane, Activity, Compass, Users, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

const SAMPLE_AIRPORTS = [
  { id: 1, name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India', iata: 'BOM' },
  { id: 2, name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', iata: 'LHR' },
  { id: 3, name: 'John F Kennedy Intl Airport', city: 'New York', country: 'United States', iata: 'JFK' },
  { id: 4, name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', iata: 'DXB' },
  { id: 5, name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', iata: 'SIN' },
  { id: 6, name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', country: 'United States', iata: 'ATL' },
  { id: 7, name: 'Tokyo Haneda International', city: 'Tokyo', country: 'Japan', iata: 'HND' },
];

export default function KitPreview() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(SAMPLE_AIRPORTS[0]);
  const [toggleActive, setToggleActive] = useState(true);
  const [selectContinent, setSelectContinent] = useState('All');
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  return (
    <PageShell
      title="SkyGraph UI Kit (Design Tokens & Components)"
      subtitle="Comprehensive showcase of all reusable UI primitives specified in design.md section 7."
    >
      <div className="space-y-12 pb-16">
        
        {/* 1. Buttons */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">1. Buttons</h2>
            <p className="text-xs text-text-muted">Variants: primary (cyan-violet glow), secondary, ghost, danger</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={Plane}>Primary Button</Button>
            <Button variant="secondary" icon={Compass}>Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" loading>Loading...</Button>
            <Button variant="secondary" disabled>Disabled</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg" iconRight={ArrowRight}>Large</Button>
          </div>
        </section>

        {/* 2. Badges */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">2. Badges & Pills</h2>
            <p className="text-xs text-text-muted">Variants: tech (grey), status (green), rank (amber), primary (cyan), danger (rose)</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="tech">Neo4j GDS</Badge>
            <Badge variant="status">Active Airline (1,254)</Badge>
            <Badge variant="rank">Rank #1 Hub</Badge>
            <Badge variant="primary">PageRank 0.00842</Badge>
            <Badge variant="danger">Defunct Carrier</Badge>
            <Badge variant="tech" size="sm">Small Tag</Badge>
          </div>
        </section>

        {/* 3. KPI Cards */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">3. KPI Cards (Count-Up Motion)</h2>
            <p className="text-xs text-text-muted">Animated 1.2s count-up on entry, hover lift 4px, gradient top border</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Airports"
              value={7658}
              caption="Across 237 countries"
              icon={MapPin}
              variant="primary"
            />
            <KpiCard
              label="Active Airlines"
              value={1254}
              caption="6,160 historical records"
              icon={Plane}
              variant="secondary"
            />
            <KpiCard
              label="Global Routes"
              value={67664}
              caption="Direct graph edges"
              icon={Activity}
              variant="accent"
            />
            <KpiCard
              label="Avg Connections"
              value={17.6}
              caption="Degree centrality"
              icon={Users}
              variant="success"
            />
          </div>
        </section>

        {/* 4. SearchSelect Autocomplete */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">4. SearchSelect Autocomplete</h2>
            <p className="text-xs text-text-muted">Keyboard navigable (Up/Down/Enter/Esc), highlighted matches, max 8 rows</p>
          </div>
          <div className="max-w-md">
            <SearchSelect
              label="Select Departure Airport"
              items={SAMPLE_AIRPORTS}
              value={selectedAirport}
              onChange={setSelectedAirport}
              itemLabel="name"
              itemSublabel="city"
              itemKey="id"
              placeholder="Search Mumbai, London, JFK, etc."
            />
            {selectedAirport && (
              <div className="mt-3 p-3 rounded-xl bg-bg-elev-2 text-xs text-text-muted flex items-center justify-between">
                <span>Selected: <strong className="text-text-main">{selectedAirport.name}</strong> ({selectedAirport.iata})</span>
                <Badge variant="primary">{selectedAirport.country}</Badge>
              </div>
            )}
          </div>
        </section>

        {/* 5. Chart Cards */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">5. Chart Cards</h2>
            <p className="text-xs text-text-muted">Header with title, insight subtitle, info tooltip, skeletons, error and empty states</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Card */}
            <ChartCard
              title="Top Hubs by PageRank"
              subtitle="Atlanta, Beijing and London dominate global connectivity"
              info="Computed with Neo4j Graph Data Science PageRank algorithm."
              onDownload={() => alert('Download action triggered')}
            >
              <div className="py-12 text-center text-xs text-text-muted border border-dashed border-border rounded-xl">
                Normal Chart Container View
              </div>
            </ChartCard>

            {/* Skeleton Loading Card */}
            <ChartCard
              title="Degree vs PageRank"
              subtitle="Scatter bubble preview"
              loading={true}
            >
              <div />
            </ChartCard>

            {/* Error Card */}
            <ChartCard
              title="Louvain Communities"
              subtitle="Cluster modularity"
              error="Failed to load communities.json from endpoint."
              onRetry={() => alert('Retry handler invoked')}
            >
              <div />
            </ChartCard>
          </div>
        </section>

        {/* 6. Form Controls & Tooltips */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">6. Controls & Tooltips</h2>
            <p className="text-xs text-text-muted">Toggles, selects, tooltips with 150ms delay</p>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <Toggle
              checked={toggleActive}
              onChange={setToggleActive}
              label="Active Carriers Only"
              description="Filters out 4,906 defunct airlines"
            />

            <Select
              label="Continent Filter"
              value={selectContinent}
              onChange={setSelectContinent}
              options={[
                { value: 'All', label: 'All Continents' },
                { value: 'Europe', label: 'Europe' },
                { value: 'North America', label: 'North America' },
                { value: 'Asia', label: 'Asia' },
              ]}
            />

            <Tooltip content="Tooltip showing Neo4j metric info" position="top">
              <Button variant="secondary" size="sm">Hover for Tooltip</Button>
            </Tooltip>
          </div>
        </section>

        {/* 7. Drawer Trigger */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">7. Side Drawer Panel</h2>
            <p className="text-xs text-text-muted">420px slide-over sheet for airport and airline deep-dive metrics</p>
          </div>
          <div>
            <Button
              variant="primary"
              icon={ExternalLink}
              onClick={() => setDrawerOpen(true)}
            >
              Open Sample Details Drawer
            </Button>
          </div>
        </section>

        {/* 8. Skeletons */}
        <section className="space-y-4 rounded-card border border-border bg-bg-elev p-6 shadow-card">
          <div className="border-b border-border/80 pb-3">
            <h2 className="font-heading text-lg font-bold text-text-main">8. Skeletons (Shimmer)</h2>
          </div>
          <div className="space-y-3 max-w-sm">
            <Skeleton height="20px" width="70%" />
            <Skeleton height="14px" width="100%" />
            <Skeleton height="14px" width="85%" />
          </div>
        </section>

      </div>

      {/* Interactive Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Airport Profile: BOM"
        subtitle="Chhatrapati Shivaji Maharaj International Airport (Mumbai, India)"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" icon={Compass}>
              Open in Route Explorer
            </Button>
          </div>
        }
      >
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-bg-elev border border-border">
              <div className="text-xs text-text-muted">PageRank</div>
              <div className="text-lg font-heading font-bold text-primary">0.00518</div>
            </div>
            <div className="p-3 rounded-xl bg-bg-elev border border-border">
              <div className="text-xs text-text-muted">Direct Degree</div>
              <div className="text-lg font-heading font-bold text-secondary">480 routes</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Top Outgoing Destinations
            </h4>
            <div className="space-y-1.5">
              {[
                { city: 'Dubai (DXB)', routes: 14, airline: 'Emirates' },
                { city: 'London (LHR)', routes: 8, airline: 'British Airways' },
                { city: 'Delhi (DEL)', routes: 24, airline: 'Air India' },
                { city: 'Singapore (SIN)', routes: 7, airline: 'Singapore Airlines' },
              ].map((dest, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elev border border-border/70 text-xs">
                  <span className="font-medium text-text-main">{dest.city}</span>
                  <span className="text-text-muted">{dest.routes} daily flights</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </PageShell>
  );
}
