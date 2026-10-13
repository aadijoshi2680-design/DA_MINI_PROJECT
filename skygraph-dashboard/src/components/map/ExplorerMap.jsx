import React, { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { getGreatCircleArc } from '../../map/greatCircle';

const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

/**
 * Helper to smoothly pan / fit bounds when route or airport changes
 */
function MapBoundsUpdater({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      try {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6, animate: true });
      } catch (err) {
        // Fallback
      }
    }
  }, [bounds, map]);
  return null;
}

export default function ExplorerMap({
  airports = [],
  airlines = [],
  activePath = null, // array of airport objects: [origin, ...transits, dest]
  alternatives = [], // array of alternative path objects
  profileAirport = null,
  profileAirline = null,
  airportOutgoingRoutes = [],
  airlineRoutes = [],
}) {
  const [planeProgress, setPlaneProgress] = useState(0);

  // Compute primary path arc waypoints
  const primaryArcPoints = useMemo(() => {
    if (!activePath || activePath.length < 2) return [];
    const points = [];
    for (let i = 0; i < activePath.length - 1; i++) {
      const p1 = activePath[i];
      const p2 = activePath[i + 1];
      if (p1?.lat && p1?.lon && p2?.lat && p2?.lon) {
        const seg = getGreatCircleArc(p1.lat, p1.lon, p2.lat, p2.lon, 25);
        points.push(...seg);
      }
    }
    return points;
  }, [activePath]);

  // Compute alternatives arc waypoints
  const alternativeArcs = useMemo(() => {
    if (!alternatives || !alternatives.length || !airports.length) return [];
    return alternatives.map((alt) => {
      const arc = [];
      const pathIndices = alt.path || [];
      for (let i = 0; i < pathIndices.length - 1; i++) {
        const p1 = airports[pathIndices[i]];
        const p2 = airports[pathIndices[i + 1]];
        if (p1?.lat && p1?.lon && p2?.lat && p2?.lon) {
          arc.push(...getGreatCircleArc(p1.lat, p1.lon, p2.lat, p2.lon, 15));
        }
      }
      return arc;
    });
  }, [alternatives, airports]);

  // Compute profile outgoing fan arcs
  const profileFanArcs = useMemo(() => {
    if (!profileAirport || !airportOutgoingRoutes.length) return [];
    return airportOutgoingRoutes.map((target) => {
      if (!profileAirport.lat || !profileAirport.lon || !target.lat || !target.lon) return [];
      return getGreatCircleArc(profileAirport.lat, profileAirport.lon, target.lat, target.lon, 15);
    });
  }, [profileAirport, airportOutgoingRoutes]);

  // Compute airline routes
  const airlineFanArcs = useMemo(() => {
    if (!profileAirline || !airlineRoutes.length) return [];
    return airlineRoutes.slice(0, 80).map((r) => {
      if (!r.src?.lat || !r.src?.lon || !r.dst?.lat || !r.dst?.lon) return [];
      return getGreatCircleArc(r.src.lat, r.src.lon, r.dst.lat, r.dst.lon, 12);
    });
  }, [profileAirline, airlineRoutes]);

  // Auto-fit bounds calculation
  const mapBounds = useMemo(() => {
    if (activePath && activePath.length >= 2) {
      return activePath.map((a) => [a.lat, a.lon]);
    }
    if (profileAirport && profileAirport.lat && profileAirport.lon) {
      return [
        [profileAirport.lat - 15, profileAirport.lon - 20],
        [profileAirport.lat + 15, profileAirport.lon + 20],
      ];
    }
    return [
      [10, -30],
      [55, 60],
    ];
  }, [activePath, profileAirport]);

  // Animated plane travel once along the active path
  useEffect(() => {
    if (!primaryArcPoints.length) return;
    setPlaneProgress(0);

    let frame = 0;
    const totalFrames = 120; // ~2 seconds at 60fps per motion spec
    const interval = setInterval(() => {
      frame++;
      setPlaneProgress(Math.min(1, frame / totalFrames));
      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [primaryArcPoints]);

  const planeCoords = useMemo(() => {
    if (!primaryArcPoints.length) return null;
    const idx = Math.min(
      primaryArcPoints.length - 1,
      Math.floor(planeProgress * (primaryArcPoints.length - 1))
    );
    return primaryArcPoints[idx];
  }, [primaryArcPoints, planeProgress]);

  return (
    <div className="relative w-full h-[460px] sm:h-[540px] lg:h-full min-h-[480px] rounded-2xl overflow-hidden border border-border bg-bg-elev shadow-card">
      <MapContainer
        center={[28, 20]}
        zoom={2}
        className="w-full h-full bg-[#070B14]"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url={CARTO_DARK_TILES} />
        <MapBoundsUpdater bounds={mapBounds} />

        {/* Airport Profile Fan Arcs */}
        {profileFanArcs.map((arc, i) => (
          <Polyline
            key={`fan-${i}`}
            positions={arc}
            pathOptions={{
              color: '#22D3EE',
              weight: 1.2,
              opacity: 0.45,
            }}
          />
        ))}

        {/* Airline Fan Arcs */}
        {airlineFanArcs.map((arc, i) => (
          <Polyline
            key={`air-${i}`}
            positions={arc}
            pathOptions={{
              color: '#8B5CF6',
              weight: 1,
              opacity: 0.35,
            }}
          />
        ))}

        {/* Alternative Routes (Muted Violet) */}
        {alternativeArcs.map((arc, i) => (
          <Polyline
            key={`alt-${i}`}
            positions={arc}
            pathOptions={{
              color: '#8B5CF6',
              weight: 2,
              opacity: 0.45,
              dashArray: '6, 8',
            }}
          />
        ))}

        {/* Selected Primary Route Path (Glowing Amber with Dash Animation) */}
        {primaryArcPoints.length > 0 && (
          <>
            <Polyline
              positions={primaryArcPoints}
              pathOptions={{
                color: '#F59E0B',
                weight: 3.5,
                opacity: 0.95,
                dashArray: '10, 10',
                className: 'route-animated-path',
              }}
            />
            {/* Soft Outer Glow Polyline */}
            <Polyline
              positions={primaryArcPoints}
              pathOptions={{
                color: '#F59E0B',
                weight: 8,
                opacity: 0.25,
              }}
            />
          </>
        )}

        {/* Traveling Plane Marker */}
        {planeCoords && (
          <CircleMarker
            center={planeCoords}
            radius={6}
            pathOptions={{
              color: '#FFF',
              fillColor: '#F59E0B',
              fillOpacity: 1,
              weight: 2,
              className: 'shadow-glow',
            }}
          >
            <Tooltip permanent={false} direction="top">
              ✈ Active Flight
            </Tooltip>
          </CircleMarker>
        )}

        {/* Path Airport Node Pins */}
        {activePath &&
          activePath.map((airport, idx) => {
            const isOrigin = idx === 0;
            const isDest = idx === activePath.length - 1;
            const isTransfer = !isOrigin && !isDest;

            return (
              <CircleMarker
                key={airport.iata || idx}
                center={[airport.lat, airport.lon]}
                radius={isOrigin || isDest ? 8 : 6}
                pathOptions={{
                  color: isOrigin ? '#34D399' : isDest ? '#F59E0B' : '#22D3EE',
                  fillColor: '#0E1525',
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <Tooltip permanent={true} direction="top" className="custom-map-tooltip">
                  <div className="font-mono font-bold text-xs">
                    {idx + 1}. {airport.iata}
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}

        {/* Profile Selected Airport Node */}
        {profileAirport && (
          <CircleMarker
            center={[profileAirport.lat, profileAirport.lon]}
            radius={9}
            pathOptions={{
              color: '#22D3EE',
              fillColor: '#22D3EE',
              fillOpacity: 0.8,
              weight: 3,
            }}
          >
            <Tooltip permanent={true} direction="top">
              {profileAirport.name} ({profileAirport.iata})
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Floating Canvas Legend */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5 p-3 rounded-xl bg-bg-elev/90 border border-border/80 backdrop-blur-md text-[11px] text-text-muted shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="text-text-main font-medium">Primary Selected Path</span>
        </div>
        {alternativeArcs.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span>Alternative Redundant Paths</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Origin • Transfer • Destination</span>
        </div>
      </div>
    </div>
  );
}
