import React from 'react';
import PageShell from '../components/layout/PageShell';
import { Search, Compass, MapPin, ArrowRightLeft, Route } from 'lucide-react';

export default function RouteExplorer() {
  return (
    <PageShell
      title="Route Explorer"
      subtitle="Find shortest flight connections, compare alternative paths, and analyze individual airport and airline networks."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Control Panel (380px on desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border bg-bg-elev p-5 shadow-card space-y-5">
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-bg-elev-2 border border-border text-xs font-medium">
              <button className="flex-1 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                Find Route
              </button>
              <button className="flex-1 py-2 rounded-lg text-text-muted hover:text-text-main transition-colors">
                Airport
              </button>
              <button className="flex-1 py-2 rounded-lg text-text-muted hover:text-text-main transition-colors">
                Airline
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Origin Airport</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-primary absolute left-3 top-3.5" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Search by city, airport or IATA (e.g. BOM)"
                    className="w-full bg-bg-elev-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-text-main focus:outline-none focus:border-primary cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div className="flex justify-center -my-1">
                <button 
                  disabled
                  className="p-1.5 rounded-full bg-bg-elev-2 border border-border text-text-muted cursor-not-allowed"
                  title="Swap origin and destination"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-xs text-text-muted font-medium mb-1 block">Destination Airport</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-accent absolute left-3 top-3.5" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Search destination (e.g. JFK)"
                    className="w-full bg-bg-elev-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-xs text-text-main focus:outline-none focus:border-primary cursor-not-allowed opacity-80"
                  />
                </div>
              </div>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#070B14] font-semibold text-xs tracking-wide uppercase opacity-70 cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Route className="w-4 h-4" />
              <span>Compute Shortest Path</span>
            </button>

            <div className="p-3 rounded-xl bg-bg-elev-2/50 border border-border/60 text-xs text-text-muted">
              Client-side BFS (hops) and Dijkstra (km) graph search engine will be implemented in Phase 7.
            </div>
          </div>
        </div>

        {/* Right Map Canvas (Remaining space, min 560px height) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-2xl border border-border bg-bg-elev shadow-card overflow-hidden min-h-[560px] flex flex-col justify-between p-6 relative">
            <div className="flex items-center justify-between border-b border-border/60 pb-3 z-10">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" />
                <span className="font-heading text-sm font-semibold text-text-main">Global Route Canvas</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/25 font-mono">
                Leaflet + CARTO Dark Tiles
              </span>
            </div>

            <div className="my-auto text-center space-y-3 z-10 max-w-sm mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary shadow-glow">
                <Route className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-medium text-text-main text-base">Interactive Leaflet Map Canvas</h3>
              <p className="text-xs text-text-muted">
                Will render amber animated great-circle path arcs, numbered airport node pins, and flying plane markers.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted border-t border-border/60 pt-3 z-10">
              <span>Great-circle helper: <code className="text-primary font-mono text-[11px]">src/map/greatCircle.js</code></span>
              <span>Phase 1 Scaffolding</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
