import { describe, it, expect } from 'vitest';
import { haversineDistanceKm, getGreatCircleArc } from '../../map/greatCircle';
import { bfsFewestHops, dijkstraShortestDistance } from '../shortestPath';
import { findAlternativePaths } from '../kShortest';

describe('Graph Engine & Haversine Geodesy Tests', () => {
  describe('Haversine Distance', () => {
    it('computes 0 km for identical coordinates', () => {
      expect(haversineDistanceKm(51.47, -0.454, 51.47, -0.454)).toBe(0);
    });

    it('accurately computes London (LHR) to Paris (CDG) distance (~348 km)', () => {
      // LHR: 51.4700, -0.4543 | CDG: 49.0097, 2.5479
      const dist = haversineDistanceKm(51.47, -0.4543, 49.0097, 2.5479);
      expect(dist).toBeGreaterThanOrEqual(340);
      expect(dist).toBeLessThanOrEqual(360);
    });

    it('accurately computes Mumbai (BOM) to Dubai (DXB) distance (~1930 km)', () => {
      // BOM: 19.0896, 72.8656 | DXB: 25.2532, 55.3657
      const dist = haversineDistanceKm(19.0896, 72.8656, 25.2532, 55.3657);
      expect(dist).toBeGreaterThanOrEqual(1900);
      expect(dist).toBeLessThanOrEqual(1960);
    });

    it('generates waypoints along great-circle arc', () => {
      const arc = getGreatCircleArc(19.0896, 72.8656, 25.2532, 55.3657, 10);
      expect(arc.length).toBe(11);
      expect(arc[0][0]).toBeCloseTo(19.0896, 2);
      expect(arc[10][0]).toBeCloseTo(25.2532, 2);
    });
  });

  describe('Shortest Path Algorithms on Small Graph', () => {
    // Construct small test adjacency graph:
    // 0: A, 1: B, 2: C, 3: D, 4: E
    // A -> B (weight 100), B -> D (weight 100) => A->B->D = 200 km (2 hops)
    // A -> C (weight 40),  C -> D (weight 40)  => A->C->D = 80 km (2 hops)
    // A -> E (weight 10),  E -> B (weight 10)  => A->E->B->D = 120 km (3 hops)
    const testAdj = new Map([
      [0, [
        { to: 1, airlineIdx: 1, distanceKm: 100 },
        { to: 2, airlineIdx: 2, distanceKm: 40 },
        { to: 4, airlineIdx: 3, distanceKm: 10 },
      ]],
      [1, [
        { to: 3, airlineIdx: 1, distanceKm: 100 },
      ]],
      [2, [
        { to: 3, airlineIdx: 2, distanceKm: 40 },
      ]],
      [3, []],
      [4, [
        { to: 1, airlineIdx: 3, distanceKm: 10 },
      ]],
    ]);

    it('BFS finds the path with fewest hops', () => {
      const res = bfsFewestHops(testAdj, 0, 3);
      expect(res).not.toBeNull();
      expect(res.hops).toBe(2);
      expect(res.path[0]).toBe(0);
      expect(res.path[res.path.length - 1]).toBe(3);
    });

    it('Dijkstra selects minimum total distance in km (A -> C -> D = 80 km)', () => {
      const res = dijkstraShortestDistance(testAdj, 0, 3);
      expect(res).not.toBeNull();
      expect(res.path).toEqual([0, 2, 3]);
      expect(res.totalKm).toBe(80);
      expect(res.hops).toBe(2);
    });

    it('Dijkstra avoids blocked intermediate nodes for redundancy', () => {
      // Block node 2 (C), should find next best route (A -> E -> B -> D = 120 km)
      const res = dijkstraShortestDistance(testAdj, 0, 3, new Set([2]));
      expect(res).not.toBeNull();
      expect(res.path).toEqual([0, 4, 1, 3]);
      expect(res.totalKm).toBe(120);
    });

    it('returns null when target node is unreachable', () => {
      const disconnectedAdj = new Map([
        [0, [{ to: 1, airlineIdx: 0, distanceKm: 100 }]],
        [1, []],
        [2, []],
      ]);
      expect(bfsFewestHops(disconnectedAdj, 0, 2)).toBeNull();
      expect(dijkstraShortestDistance(disconnectedAdj, 0, 2)).toBeNull();
    });

    it('finds alternative paths when primary path is blocked', () => {
      const primary = dijkstraShortestDistance(testAdj, 0, 3);
      const alternatives = findAlternativePaths(testAdj, 0, 3, primary, 2);

      expect(alternatives.length).toBeGreaterThanOrEqual(1);
      // Alternative should not use node 2
      expect(alternatives[0].path).not.toEqual(primary.path);
    });
  });
});
