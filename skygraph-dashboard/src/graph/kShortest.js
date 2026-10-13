import { dijkstraShortestDistance, bfsFewestHops } from './shortestPath';

/**
 * Computes up to k alternative paths by blocking intermediate nodes
 * from previously discovered paths to illustrate network redundancy.
 * 
 * @param {Map<number, Array<{ to: number, airlineIdx: number, distanceKm: number }>>} adj 
 * @param {number} startIdx 
 * @param {number} targetIdx 
 * @param {Object} primaryResult Primary shortest path result
 * @param {number} maxAlternatives Maximum alternative routes to find (default 3)
 * @returns {Array<Object>} Array of alternative path objects
 */
export function findAlternativePaths(adj, startIdx, targetIdx, primaryResult, maxAlternatives = 3) {
  if (!primaryResult || !primaryResult.path || primaryResult.path.length <= 2) {
    return [];
  }

  const alternatives = [];
  const seenPathKeys = new Set();
  
  const makeKey = (path) => path.join('->');
  seenPathKeys.add(makeKey(primaryResult.path));

  // Extract intermediate nodes of the primary path
  const intermediateNodes = primaryResult.path.slice(1, -1);

  for (const blockNode of intermediateNodes) {
    if (alternatives.length >= maxAlternatives) break;

    const blocked = new Set([blockNode]);
    
    // Try Dijkstra first for alternative distance path, fallback to BFS
    let alt = dijkstraShortestDistance(adj, startIdx, targetIdx, blocked);
    if (!alt) {
      alt = bfsFewestHops(adj, startIdx, targetIdx, blocked);
    }

    if (alt && alt.path && alt.path.length > 0) {
      const key = makeKey(alt.path);
      if (!seenPathKeys.has(key)) {
        seenPathKeys.add(key);
        alternatives.push({
          ...alt,
          blockedNode: blockNode,
        });
      }
    }
  }

  return alternatives;
}
