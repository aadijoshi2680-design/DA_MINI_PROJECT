import React from 'react';
import PageShell from '../components/layout/PageShell';
import { BarChart3, Filter, Info } from 'lucide-react';

export default function Analytics() {
  return (
    <PageShell
      title="Network Analytics"
      subtitle="Explore centrality rankings, airline market reach, Louvain community clusters, and route distributions."
    >
      {/* Sticky Filter Bar Placeholder */}
      <div className="sticky top-16 z-30 mb-8 p-3 rounded-xl border border-border bg-bg-elev/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-medium text-text-main">Filters:</span>
          <span className="px-2.5 py-1 rounded-md bg-bg-elev-2 border border-border">Continent: All</span>
          <span className="px-2.5 py-1 rounded-md bg-bg-elev-2 border border-border">Top N: 15</span>
          <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">Active Airlines Only</span>
        </div>
        <div className="text-xs text-text-muted flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-primary" />
          <span>Interactive charts wire in Phase 5 & 6</span>
        </div>
      </div>

      {/* Sections Grid Preview */}
      <div className="space-y-10">
        {/* Section 1: Hubs */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-text-main flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            1. Airport Hubs (Centrality & Degree)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-bg-elev p-6 min-h-[300px] flex flex-col justify-between shadow-card">
              <div className="space-y-1">
                <h3 className="font-heading font-medium text-text-main">Chart 1: Top Hubs by PageRank</h3>
                <p className="text-xs text-text-muted">Horizontal bar with amber highlight for top rank</p>
              </div>
              <div className="py-12 text-center text-text-muted text-xs border border-dashed border-border/70 rounded-xl bg-bg-elev-2/40">
                ECharts PageRank bar chart mounts here in Phase 5
              </div>
              <div className="text-[11px] text-text-muted">Source: Neo4j PageRank algorithm</div>
            </div>

            <div className="rounded-2xl border border-border bg-bg-elev p-6 min-h-[300px] flex flex-col justify-between shadow-card">
              <div className="space-y-1">
                <h3 className="font-heading font-medium text-text-main">Chart 2: Degree vs PageRank</h3>
                <p className="text-xs text-text-muted">Bubble scatter colored by Louvain community</p>
              </div>
              <div className="py-12 text-center text-text-muted text-xs border border-dashed border-border/70 rounded-xl bg-bg-elev-2/40">
                ECharts scatter visualization mounts here in Phase 5
              </div>
              <div className="text-[11px] text-text-muted">Source: Neo4j Degree Centrality</div>
            </div>
          </div>
        </div>

        {/* Section 2: Airlines */}
        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-text-main flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            2. Airlines & Reach
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-bg-elev p-6 min-h-[300px] flex flex-col justify-between shadow-card">
              <div className="space-y-1">
                <h3 className="font-heading font-medium text-text-main">Chart 3: Top Airlines by Routes</h3>
                <p className="text-xs text-text-muted">Carriers ranked by route volume</p>
              </div>
              <div className="py-12 text-center text-text-muted text-xs border border-dashed border-border/70 rounded-xl bg-bg-elev-2/40">
                ECharts airline volume chart mounts here in Phase 5
              </div>
              <div className="text-[11px] text-text-muted">Defaulting to active carriers</div>
            </div>

            <div className="rounded-2xl border border-border bg-bg-elev p-6 min-h-[300px] flex flex-col justify-between shadow-card">
              <div className="space-y-1">
                <h3 className="font-heading font-medium text-text-main">Chart 4: Geographic Reach</h3>
                <p className="text-xs text-text-muted">Distinct sovereign countries and airports served</p>
              </div>
              <div className="py-12 text-center text-text-muted text-xs border border-dashed border-border/70 rounded-xl bg-bg-elev-2/40">
                ECharts geographic reach chart mounts here in Phase 5
              </div>
              <div className="text-[11px] text-text-muted">Source: Airline OPERATES relationships</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
