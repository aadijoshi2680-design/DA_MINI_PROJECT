import React from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { ArrowRight, Compass, Activity, Globe, Plane, Award } from 'lucide-react';

export default function Home() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Powered by Neo4j graph analytics
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-text-main leading-tight">
              The world's skies, <br />
              <span className="text-gradient">as a graph.</span>
            </h1>

            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
              Explore 7,600+ airports, 1,250+ active airlines and 67,000+ routes — analysed with PageRank, Louvain communities, and graph shortest paths.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/analytics"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-primary to-secondary text-[#070B14] hover:opacity-95 transition-all shadow-glow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/explorer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-border bg-bg-elev hover:bg-bg-elev-2 text-text-main transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Try Route Explorer</span>
              </Link>
            </div>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-border bg-bg-elev p-6 shadow-card overflow-hidden min-h-[320px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs uppercase tracking-wider text-text-muted font-medium">Hero Network Visual</span>
                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono">Interactive Map in Phase 4</span>
              </div>
              <div className="my-8 text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-glow">
                  <Plane className="w-8 h-8 -rotate-45" />
                </div>
                <p className="text-sm text-text-muted max-w-xs mx-auto">
                  Global airport nodes sized by PageRank with pulsing hubs & faint great-circle arcs.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted border-t border-border/60 pt-3">
                <span>Phase 1 Scaffolding</span>
                <span>CARTO Dark Tiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Preview Strip */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Airports', value: '7,658', caption: 'Global nodes' },
            { label: 'Active Airlines', value: '1,254', caption: '6,160 historical' },
            { label: 'Routes', value: '67,664', caption: 'Direct connections' },
            { label: 'Countries', value: '237', caption: 'Sovereign reach' },
            { label: 'Avg Connections', value: '17.6', caption: 'Per hub airport' },
          ].map((kpi, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-bg-elev card-glow-top shadow-card">
              <div className="text-xs text-text-muted font-medium">{kpi.label}</div>
              <div className="text-2xl font-heading font-bold text-text-main mt-1 tabular-nums">{kpi.value}</div>
              <div className="text-[11px] text-text-muted mt-1">{kpi.caption}</div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
