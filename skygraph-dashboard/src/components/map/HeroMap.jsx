import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline } from 'react-leaflet';
import { getGreatCircleArc } from '../../map/greatCircle';

const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const CARTO_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a>';

/**
 * Non-interactive ambient hero map for the Home landing page
 * Specs from design.md section 6.1:
 * - Airports as small cyan dots (sized by PageRank)
 * - Top 10 hubs pulsating softly
 * - Faint cyan great-circle arcs for top sampled routes
 * - Non-interactive (no scroll/drag/zoom)
 */
export default function HeroMap({ airports = [], edges = [], loading = false }) {
  // Center of world view
  const center = [24, 15];
  const zoom = 2;

  // Identify top 10 hubs by PageRank
  const top10HubIatas = useMemo(() => {
    return new Set(
      [...airports]
        .sort((a, b) => (b.pagerank || 0) - (a.pagerank || 0))
        .slice(0, 10)
        .map((a) => a.iata)
    );
  }, [airports]);

  // Compute curved great-circle arcs for top routes (sample up to 300)
  const routeArcs = useMemo(() => {
    if (!airports.length || !edges.length) return [];

    const airportMap = new Map();
    airports.forEach((a, idx) => airportMap.set(idx, a));

    const sampledEdges = edges.slice(0, 300);
    const arcs = [];

    sampledEdges.forEach(([srcIdx, dstIdx]) => {
      const src = airportMap.get(srcIdx);
      const dst = airportMap.get(dstIdx);

      if (src && dst && src.lat && src.lon && dst.lat && dst.lon) {
        const points = getGreatCircleArc(src.lat, src.lon, dst.lat, dst.lon, 20);
        arcs.push(points);
      }
    });

    return arcs;
  }, [airports, edges]);

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden border border-border bg-bg-elev shadow-card">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-bg-elev-2/50 text-text-muted text-xs">
          <div className="flex flex-col items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
            <span>Rendering global network topology...</span>
          </div>
        </div>
      ) : (
        <>
          <MapContainer
            center={center}
            zoom={zoom}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            attributionControl={false}
            className="w-full h-full bg-[#070B14]"
          >
            <TileLayer url={CARTO_DARK_TILES} attribution={CARTO_ATTRIBUTION} />

            {/* Faint Great-Circle Arcs */}
            {routeArcs.map((arc, i) => (
              <Polyline
                key={i}
                positions={arc}
                pathOptions={{
                  color: '#22D3EE',
                  weight: 0.8,
                  opacity: 0.22,
                  dashArray: '3, 6',
                }}
              />
            ))}

            {/* Airport Circle Markers */}
            {airports.map((airport, idx) => {
              if (!airport.lat || !airport.lon) return null;
              const isTop10 = top10HubIatas.has(airport.iata);
              const rankRadius = isTop10 ? 6 : Math.max(2, Math.min(4.5, (airport.pagerank || 0) * 800));

              return (
                <React.Fragment key={airport.id || idx}>
                  {/* Pulsing glow ring for top 10 hubs */}
                  {isTop10 && (
                    <CircleMarker
                      center={[airport.lat, airport.lon]}
                      radius={rankRadius + 6}
                      pathOptions={{
                        color: '#F59E0B',
                        fillColor: '#F59E0B',
                        fillOpacity: 0.18,
                        weight: 1,
                        opacity: 0.6,
                        className: 'animate-pulse',
                      }}
                    />
                  )}
                  {/* Airport Node */}
                  <CircleMarker
                    center={[airport.lat, airport.lon]}
                    radius={rankRadius}
                    pathOptions={{
                      color: isTop10 ? '#F59E0B' : '#22D3EE',
                      fillColor: isTop10 ? '#F59E0B' : '#22D3EE',
                      fillOpacity: isTop10 ? 0.95 : 0.7,
                      weight: isTop10 ? 2 : 1,
                    }}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Vignette & Ambient Gradient Overlays */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-elev via-transparent to-transparent opacity-80"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg-elev/40 via-transparent to-bg-elev/40"
            aria-hidden="true"
          />

          {/* Floating Map Legend Pill */}
          <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-3 px-3 py-1.5 rounded-xl bg-bg-elev/90 border border-border/80 backdrop-blur-md text-[11px] text-text-muted shadow-lg">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="text-text-main font-medium">Top 10 Central Hubs</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Airports (PageRank)</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
