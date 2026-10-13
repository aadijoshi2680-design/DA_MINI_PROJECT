import React from 'react';
import { Database, GitBranch, Shield, ExternalLink } from 'lucide-react';
import { trackEvent } from '../../analytics/ga';
import useData from '../../data/useData';

export default function Footer() {
  const isMock = import.meta.env.VITE_USE_MOCK === 'true';
  const { data: meta } = useData('META');

  const handleOutbound = (url) => {
    trackEvent('outbound_click', { url });
  };

  const formattedDate = meta?.generatedAt
    ? new Date(meta.generatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Oct 2026';

  return (
    <footer className="w-full border-t border-border/80 bg-bg-elev/40 backdrop-blur-sm mt-auto py-10 transition-colors">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/50 text-sm">
          {/* Project Details */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-heading font-semibold text-text-main">SkyGraph Dashboard</span>
            <span className="hidden sm:inline text-text-muted">•</span>
            <span className="text-text-muted">
              Airline Network Analysis using Neo4j & OpenFlights Data
            </span>
          </div>

          {/* Tech Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-bg-elev-2 text-text-muted border border-border flex items-center gap-1">
              <Database className="w-3 h-3 text-primary" /> Neo4j GDS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-bg-elev-2 text-text-muted border border-border flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-secondary" /> Graph Algorithms
            </span>
            <span className="px-2 py-0.5 rounded-full bg-bg-elev-2 text-text-muted border border-border">
              React 18 + Vite
            </span>
            {isMock && (
              <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 font-medium animate-pulse">
                Mock Data Mode
              </span>
            )}
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted text-center sm:text-left">
          <div className="space-y-1">
            <p>
              Data Source:{' '}
              <a
                href="https://openflights.org/data.html"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOutbound('https://openflights.org/data.html')}
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                <span>OpenFlights (via Kaggle)</span>
                <ExternalLink className="w-3 h-3 inline" />
              </a>{' '}
              • 7,658 airports • 6,160 airlines (1,254 active) • ~67k routes • Data as of {formattedDate}
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5 text-primary/70" />
              <span>Privacy note: Google Analytics 4 runs with strict IP anonymization</span>
            </p>
          </div>
          <div>
            <p className="font-medium text-text-main/80">
              SkyGraph Team © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
