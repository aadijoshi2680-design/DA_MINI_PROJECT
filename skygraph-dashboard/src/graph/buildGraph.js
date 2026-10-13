import { haversineDistanceKm } from '../map/greatCircle';

/**
 * Builds an adjacency list graph representation from compact edges and airports
 * 
 * @param {Array<[number, number, number]>} edges Array of [srcIdx, dstIdx, airlineIdx]
 * @param {Array<Object>} airports Array of airport objects with lat, lon
 * @returns {Map<number, Array<{ to: number, airlineIdx: number, distanceKm: number }>>}
 */
export function buildGraph(edges = [], airports = []) {
  const adj = new Map();

  for (let i = 0; i < airports.length; i++) {
    adj.set(i, []);
  }

  for (let i = 0; i < edges.length; i++) {
    const [srcIdx, dstIdx, airlineIdx] = edges[i];

    if (srcIdx === undefined || dstIdx === undefined) continue;

    const src = airports[srcIdx];
    const dst = airports[dstIdx];

    let distanceKm = 500; // sensible fallback
    if (src && dst && typeof src.lat === 'number' && typeof dst.lat === 'number') {
      distanceKm = haversineDistanceKm(src.lat, src.lon, dst.lat, dst.lon);
    }

    if (!adj.has(srcIdx)) adj.set(srcIdx, []);
    adj.get(srcIdx).push({
      to: dstIdx,
      airlineIdx: airlineIdx ?? 0,
      distanceKm: Math.max(50, distanceKm),
    });
  }

  return adj;
}
