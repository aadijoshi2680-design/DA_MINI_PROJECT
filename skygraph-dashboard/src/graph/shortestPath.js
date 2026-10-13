/**
 * Graph shortest path algorithms: BFS (fewest hops) and Dijkstra (minimum distance km)
 */

/**
 * BFS algorithm for fewest intermediate flight stops / hops
 * 
 * @param {Map<number, Array<{ to: number, airlineIdx: number, distanceKm: number }>>} adj 
 * @param {number} startIdx 
 * @param {number} targetIdx 
 * @param {Set<number>} blockedNodes Optional intermediate nodes to forbid (for k-shortest)
 * @returns {{ path: number[], hops: number, totalKm: number, legs: Array<{ from: number, to: number, airlineIdx: number, km: number }> } | null}
 */
export function bfsFewestHops(adj, startIdx, targetIdx, blockedNodes = new Set()) {
  if (startIdx === targetIdx) {
    return { path: [startIdx], hops: 0, totalKm: 0, legs: [] };
  }

  const queue = [startIdx];
  const visited = new Set([startIdx]);
  const parent = new Map(); // child -> { prev, edge }

  while (queue.length > 0) {
    const curr = queue.shift();

    if (curr === targetIdx) {
      // Reconstruct path
      const path = [];
      const legs = [];
      let step = targetIdx;

      while (step !== startIdx) {
        path.unshift(step);
        const { prev, edge } = parent.get(step);
        legs.unshift({
          from: prev,
          to: step,
          airlineIdx: edge.airlineIdx,
          km: edge.distanceKm,
        });
        step = prev;
      }
      path.unshift(startIdx);

      const totalKm = legs.reduce((acc, l) => acc + l.km, 0);
      return {
        path,
        hops: legs.length,
        totalKm,
        legs,
      };
    }

    const neighbors = adj.get(curr) || [];
    for (const edge of neighbors) {
      const next = edge.to;
      if (!visited.has(next) && (!blockedNodes.has(next) || next === targetIdx)) {
        visited.add(next);
        parent.set(next, { prev: curr, edge });
        queue.push(next);
      }
    }
  }

  return null;
}

/**
 * Dijkstra's algorithm weighted by geographical distance in kilometers
 * 
 * @param {Map<number, Array<{ to: number, airlineIdx: number, distanceKm: number }>>} adj 
 * @param {number} startIdx 
 * @param {number} targetIdx 
 * @param {Set<number>} blockedNodes Optional intermediate nodes to forbid
 * @returns {{ path: number[], hops: number, totalKm: number, legs: Array<{ from: number, to: number, airlineIdx: number, km: number }> } | null}
 */
export function dijkstraShortestDistance(adj, startIdx, targetIdx, blockedNodes = new Set()) {
  if (startIdx === targetIdx) {
    return { path: [startIdx], hops: 0, totalKm: 0, legs: [] };
  }

  const dist = new Map();
  const parent = new Map();
  const visited = new Set();

  dist.set(startIdx, 0);

  // Simple min-distance unvisited selector (efficient for ~7k nodes)
  const unvisitedNodes = new Set([startIdx]);

  while (unvisitedNodes.size > 0) {
    // Find unvisited node with minimal dist
    let curr = null;
    let minDist = Infinity;

    for (const node of unvisitedNodes) {
      const d = dist.get(node) ?? Infinity;
      if (d < minDist) {
        minDist = d;
        curr = node;
      }
    }

    if (curr === null || minDist === Infinity) break;
    if (curr === targetIdx) break; // Found shortest path to target

    unvisitedNodes.delete(curr);
    visited.add(curr);

    const neighbors = adj.get(curr) || [];
    for (const edge of neighbors) {
      const next = edge.to;
      if (visited.has(next) || (blockedNodes.has(next) && next !== targetIdx)) {
        continue;
      }

      const weight = edge.distanceKm || 500;
      const nextDist = minDist + weight;
      const currentKnownDist = dist.get(next) ?? Infinity;

      if (nextDist < currentKnownDist) {
        dist.set(next, nextDist);
        parent.set(next, { prev: curr, edge });
        unvisitedNodes.add(next);
      }
    }
  }

  if (!parent.has(targetIdx)) {
    return null;
  }

  // Reconstruct path
  const path = [];
  const legs = [];
  let step = targetIdx;

  while (step !== startIdx) {
    path.unshift(step);
    const { prev, edge } = parent.get(step);
    legs.unshift({
      from: prev,
      to: step,
      airlineIdx: edge.airlineIdx,
      km: edge.distanceKm,
    });
    step = prev;
  }
  path.unshift(startIdx);

  const totalKm = legs.reduce((acc, l) => acc + l.km, 0);

  return {
    path,
    hops: legs.length,
    totalKm,
    legs,
  };
}
