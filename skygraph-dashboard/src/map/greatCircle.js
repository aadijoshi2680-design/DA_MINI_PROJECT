/**
 * Great-circle spherical interpolation and distance utilities for Leaflet routes
 * Reusable helper used by Hero Map and Route Explorer
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Computes the great-circle Haversine distance between two coordinates in kilometers.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_KM * c);
}

/**
 * Generates an array of intermediate [lat, lon] waypoints along the great circle
 * between origin and destination for smooth curved arc rendering in Leaflet.
 * 
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @param {number} numPoints Number of intermediate sample points (default 40)
 * @returns {Array<[number, number]>} Array of [lat, lon] points
 */
export function getGreatCircleArc(lat1, lon1, lat2, lon2, numPoints = 40) {
  // If origin and destination are identical, return single point
  if (lat1 === lat2 && lon1 === lon2) {
    return [[lat1, lon1]];
  }

  const p1Lat = toRad(lat1);
  const p1Lon = toRad(lon1);
  const p2Lat = toRad(lat2);
  const p2Lon = toRad(lon2);

  // Angular distance d between points
  const d = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin((p1Lat - p2Lat) / 2), 2) +
      Math.cos(p1Lat) * Math.cos(p2Lat) * Math.pow(Math.sin((p1Lon - p2Lon) / 2), 2)
    )
  );

  // If points are antipodal or zero distance
  if (d === 0 || isNaN(d)) {
    return [[lat1, lon1], [lat2, lon2]];
  }

  const waypoints = [];
  const total = Math.max(10, numPoints);

  for (let i = 0; i <= total; i++) {
    const f = i / total;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(p1Lat) * Math.cos(p1Lon) + B * Math.cos(p2Lat) * Math.cos(p2Lon);
    const y = A * Math.cos(p1Lat) * Math.sin(p1Lon) + B * Math.cos(p2Lat) * Math.sin(p2Lon);
    const z = A * Math.sin(p1Lat) + B * Math.sin(p2Lat);

    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lon = toDeg(Math.atan2(y, x));

    waypoints.push([lat, lon]);
  }

  return waypoints;
}
