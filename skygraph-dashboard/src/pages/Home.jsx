import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import HeroMap from '../components/map/HeroMap';
import KpiCard from '../components/ui/KpiCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import useData from '../data/useData';
import { trackEvent } from '../analytics/ga';
import {
  ArrowRight,
  Compass,
  MapPin,
  Plane,
  Activity,
  Globe2,
  Share2,
  Database,
  Binary,
  Layers,
  Sparkles,
  BarChart2,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  // Load JSON datasets via data hook
  const { data: summary, loading: loadingSummary } = useData('SUMMARY');
  const { data: airports, loading: loadingAirports } = useData('AIRPORTS');
  const { data: edges, loading: loadingEdges } = useData('EDGES');
  const { data: topHubs, loading: loadingHubs } = useData('TOP_HUBS');
  const { data: airlines, loading: loadingAirlines } = useData('AIRLINES');
  const { data: communities, loading: loadingCommunities } = useData('COMMUNITIES');

  // Compute 3 Quick Insights dynamically from data
  const topHub = topHubs && topHubs.length > 0 ? topHubs[0] : null;

  const widestAirline = React.useMemo(() => {
    if (!airlines || !airlines.length) return null;
    return [...airlines]
      .filter((a) => a.active)
      .sort((a, b) => (b.countryCount || 0) - (a.countryCount || 0))[0] || airlines[0];
  }, [airlines]);

  const largestCommunity = React.useMemo(() => {
    if (!communities || !communities.length) return null;
    return [...communities].sort((a, b) => (b.size || 0) - (a.size || 0))[0];
  }, [communities]);

  // Top 5 Hubs & Top 5 Airlines for mini lists
  const top5Hubs = React.useMemo(() => (topHubs ? topHubs.slice(0, 5) : []), [topHubs]);
  const top5Airlines = React.useMemo(() => {
    if (!airlines) return [];
    return [...airlines]
      .filter((a) => a.active)
      .sort((a, b) => (b.routeCount || 0) - (a.routeCount || 0))
      .slice(0, 5);
  }, [airlines]);

  const handleCtaClick = (target) => {
    trackEvent('cta_click', { target });
  };

  const handleKpiClick = (kpiName) => {
    trackEvent('kpi_click', { kpi_name: kpiName });
  };

  return (
    <PageShell>
      {/* 1. Hero Section */}
      <section className="py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Powered by Neo4j graph analytics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-text-main leading-[1.1]">
              The world's skies, <br />
              <span className="text-gradient">as a graph.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
              Explore 7,600+ airports, 1,250+ active airlines and 67,000+ routes — analysed with Neo4j PageRank, Louvain modularity, and graph shortest path algorithms.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/analytics"
                onClick={() => handleCtaClick('analytics')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading font-semibold text-sm bg-gradient-to-r from-primary to-secondary text-[#070B14] hover:opacity-95 transition-all shadow-glow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explorer"
                onClick={() => handleCtaClick('route_explorer')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-heading font-semibold text-sm border border-border bg-bg-elev hover:bg-bg-elev-2 text-text-main transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Try Route Explorer</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Map */}
          <div className="lg:col-span-6">
            <HeroMap
              airports={airports || []}
              edges={edges || []}
              loading={loadingAirports || loadingEdges}
            />
          </div>
        </div>
      </section>

      {/* 2. KPI Strip (5 Cards) */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KpiCard
            label="Airports"
            value={summary?.airports || 7658}
            caption="across 237 countries"
            icon={MapPin}
            variant="primary"
            onClick={() => handleKpiClick('airports')}
          />
          <KpiCard
            label="Active Airlines"
            value={summary?.activeAirlines || 1254}
            caption="6,160 historical"
            icon={Plane}
            variant="secondary"
            onClick={() => handleKpiClick('active_airlines')}
          />
          <KpiCard
            label="Direct Routes"
            value={summary?.routes || 67664}
            caption="global scheduled legs"
            icon={Activity}
            variant="accent"
            onClick={() => handleKpiClick('routes')}
          />
          <KpiCard
            label="Countries"
            value={summary?.countries || 237}
            caption="sovereign territories"
            icon={Globe2}
            variant="success"
            onClick={() => handleKpiClick('countries')}
          />
          <KpiCard
            label="Avg Connections"
            value={summary?.avgDegree || 17.6}
            caption="per hub airport"
            icon={Share2}
            variant="primary"
            onClick={() => handleKpiClick('avg_degree')}
          />
        </div>
      </section>

      {/* 3. Quick Insights (3 Cards computed from JSON) */}
      <section className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Insight 1: Top Hub */}
          <div className="card-glow-top rounded-2xl border border-border bg-bg-elev p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="uppercase font-semibold tracking-wider flex items-center gap-1.5 text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Busiest Hub
              </span>
              <Badge variant="rank">Rank #1 PageRank</Badge>
            </div>
            {topHub ? (
              <p className="text-sm text-text-main leading-relaxed">
                <strong className="text-accent">{topHub.name} ({topHub.iata})</strong> dominates connectivity with{' '}
                <span className="text-text-main font-semibold tabular-nums">{topHub.degree} direct routes</span> and a PageRank of{' '}
                <span className="font-mono text-primary font-semibold">{topHub.pagerank}</span>.
              </p>
            ) : (
              <Skeleton height="40px" width="100%" />
            )}
          </div>

          {/* Insight 2: Widest Reach */}
          <div className="card-glow-top rounded-2xl border border-border bg-bg-elev p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="uppercase font-semibold tracking-wider flex items-center gap-1.5 text-secondary">
                <Globe2 className="w-3.5 h-3.5" /> Widest Reach Carrier
              </span>
              <Badge variant="status">Global Footprint</Badge>
            </div>
            {widestAirline ? (
              <p className="text-sm text-text-main leading-relaxed">
                <strong className="text-secondary">{widestAirline.name}</strong> connects to{' '}
                <span className="text-accent font-semibold tabular-nums">{widestAirline.countryCount || 120} sovereign nations</span> across{' '}
                <span className="text-text-main font-semibold tabular-nums">{widestAirline.airportCount || 315} airports</span>.
              </p>
            ) : (
              <Skeleton height="40px" width="100%" />
            )}
          </div>

          {/* Insight 3: Largest Community */}
          <div className="card-glow-top rounded-2xl border border-border bg-bg-elev p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="uppercase font-semibold tracking-wider flex items-center gap-1.5 text-accent">
                <Layers className="w-3.5 h-3.5" /> Largest Community
              </span>
              <Badge variant="tech">Louvain Modularity</Badge>
            </div>
            {largestCommunity ? (
              <p className="text-sm text-text-main leading-relaxed">
                The <strong className="text-accent">{largestCommunity.label}</strong> forms the largest regional cluster, grouping{' '}
                <span className="text-primary font-semibold tabular-nums">{largestCommunity.size.toLocaleString()} airports</span> around hub{' '}
                <span className="font-mono text-text-main font-semibold">{largestCommunity.topAirport}</span>.
              </p>
            ) : (
              <Skeleton height="40px" width="100%" />
            )}
          </div>
        </div>
      </section>

      {/* 4. Top 5 Hubs & Top 5 Airlines Mini Lists */}
      <section className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Hubs */}
          <div className="rounded-2xl border border-border bg-bg-elev p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-heading font-semibold text-lg text-text-main">
                  Top 5 Hub Airports
                </h3>
                <p className="text-xs text-text-muted">Ranked by Neo4j PageRank centrality score</p>
              </div>
              <Link
                to="/analytics"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span>All Hubs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {top5Hubs.map((hub, idx) => {
                const maxRank = top5Hubs[0]?.pagerank || 0.00842;
                const pct = Math.round(((hub.pagerank || 0) / maxRank) * 100);
                return (
                  <div key={hub.iata} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                          idx === 0 ? 'bg-accent/20 text-accent border border-accent/40' : 'bg-bg-elev-2 text-text-muted'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-medium text-text-main">{hub.city}</span>
                        <span className="font-mono text-primary text-[11px]">({hub.iata})</span>
                      </div>
                      <div className="text-text-muted tabular-nums text-[11px]">
                        {hub.degree} routes • <span className="font-mono text-text-main">{hub.pagerank}</span>
                      </div>
                    </div>
                    {/* Relative PageRank Bar */}
                    <div className="w-full h-1.5 bg-bg-elev-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          idx === 0 ? 'bg-gradient-to-r from-accent to-amber-300' : 'bg-gradient-to-r from-primary to-secondary'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 5 Airlines */}
          <div className="rounded-2xl border border-border bg-bg-elev p-6 shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="space-y-0.5">
                <h3 className="font-heading font-semibold text-lg text-text-main">
                  Top 5 Airlines by Routes
                </h3>
                <p className="text-xs text-text-muted">Active carriers with the highest route volume</p>
              </div>
              <Link
                to="/analytics"
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <span>All Airlines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {top5Airlines.map((airline, idx) => (
                <div
                  key={airline.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-bg-elev-2/50 border border-border/60 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Initials Badge */}
                    <div className="w-8 h-8 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center font-mono font-bold text-xs text-secondary">
                      {airline.iata || airline.key.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-xs sm:text-sm text-text-main">
                        {airline.name}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        {airline.country} • {airline.countryCount || 50}+ countries
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-heading font-bold text-primary tabular-nums">
                      {airline.routeCount ? airline.routeCount.toLocaleString() : '1,500+'}
                    </span>
                    <span className="block text-[10px] text-text-muted uppercase">routes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (4-Step Horizontal Stepper) */}
      <section className="py-12 border-t border-border/80">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="tech" className="mb-2">Methodology</Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-main">
            How SkyGraph Was Built
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2">
            From raw OpenFlights flight tables to interactive graph algorithms and front-end visualizations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Clean',
              tech: 'Python & Pandas',
              desc: 'Normalised nulls, repaired duplicate airline IATAs with unique keys, and validated 67k route links.',
              icon: Binary,
            },
            {
              step: '02',
              title: 'Model',
              tech: 'Neo4j Property Graph',
              desc: 'Structured airports as nodes and scheduled flights as directed ROUTE relationships with airline metadata.',
              icon: Database,
            },
            {
              step: '03',
              title: 'Analyze',
              tech: 'Graph Data Science',
              desc: 'Executed PageRank for hub influence, Louvain for community clusters, and Dijkstra for distance weights.',
              icon: Layers,
            },
            {
              step: '04',
              title: 'Visualize',
              tech: 'React 18 & ECharts',
              desc: 'Client-side SPA with reactive filters, animated path finding, and high-performance dark-room dashboard.',
              icon: BarChart2,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-border bg-bg-elev p-6 shadow-card space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                    Step {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-bg-elev-2 flex items-center justify-center text-text-muted">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-base text-text-main">
                    {item.title}
                  </h3>
                  <div className="text-xs font-semibold text-secondary">
                    {item.tech}
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
