/**
 * SkyGraph Data Schema & Path Registry
 * Source of truth: architecture.md sections 2 & 4
 * All components and data loaders must import paths and field keys from here.
 */

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const DATA_BASE_DIR = USE_MOCK ? '/data-mock' : '/data';

/**
 * Static JSON file endpoint registry
 */
export const DATA_FILES = {
  SUMMARY: `${DATA_BASE_DIR}/summary.json`,
  AIRPORTS: `${DATA_BASE_DIR}/airports.json`,
  AIRLINES: `${DATA_BASE_DIR}/airlines.json`,
  AIRLINES_BY_COUNTRY: `${DATA_BASE_DIR}/airlines_by_country.json`,
  TOP_HUBS: `${DATA_BASE_DIR}/top_hubs.json`,
  COUNTRY_STATS: `${DATA_BASE_DIR}/country_stats.json`,
  COMMUNITIES: `${DATA_BASE_DIR}/communities.json`,
  ROUTE_DISTANCE_HIST: `${DATA_BASE_DIR}/route_distance_hist.json`,
  STOPS_CODESHARE: `${DATA_BASE_DIR}/stops_codeshare.json`,
  EQUIPMENT_TOP: `${DATA_BASE_DIR}/equipment_top.json`,
  AIRLINE_REGION_MATRIX: `${DATA_BASE_DIR}/airline_region_matrix.json`,
  EDGES: `${DATA_BASE_DIR}/edges.json`,
  META: `${DATA_BASE_DIR}/meta.json`,
};

/**
 * Standard entity field name constants to avoid raw string keys across components
 */
export const AIRPORT_FIELDS = {
  ID: 'id',
  NAME: 'name',
  CITY: 'city',
  COUNTRY: 'country',
  IATA: 'iata',
  LATITUDE: 'lat',
  LONGITUDE: 'lon',
  PAGERANK: 'pagerank',
  DEGREE: 'degree',
  COMMUNITY_ID: 'communityId',
};

export const AIRLINE_FIELDS = {
  KEY: 'key', // Primary composite key: ICAO -> IATA -> slug(Name)
  NAME: 'name',
  IATA: 'iata',
  ICAO: 'icao',
  CALLSIGN: 'callsign',
  COUNTRY: 'country',
  ACTIVE: 'active',
  ROUTE_COUNT: 'routeCount',
  COUNTRY_COUNT: 'countryCount',
  AIRPORT_COUNT: 'airportCount',
};

export const SUMMARY_FIELDS = {
  AIRPORTS: 'airports',
  AIRLINES: 'airlines',
  ACTIVE_AIRLINES: 'activeAirlines',
  ROUTES: 'routes',
  COUNTRIES: 'countries',
  AVG_DEGREE: 'avgDegree',
  DIRECT_SHARE: 'directShare',
  CODESHARE_SHARE: 'codeshareShare',
  DROPPED_ROUTES: 'droppedRoutes',
};

export const ROUTE_EDGE_INDICES = {
  SOURCE_AIRPORT_IDX: 0,
  TARGET_AIRPORT_IDX: 1,
  AIRLINE_IDX: 2,
};

/**
 * Assumed raw CSV header contracts (isolated here per instructions)
 */
export const RAW_CSV_HEADERS = {
  AIRLINES: ['Name', 'IATA', 'ICAO', 'Callsign', 'Country', 'Active'],
  // Assumed until confirmed with dataset files:
  AIRPORTS_ASSUMED: [
    'Airport ID', 'Name', 'City', 'Country', 'IATA', 'ICAO',
    'Latitude', 'Longitude', 'Altitude', 'Timezone', 'DST',
    'Tz database time zone', 'Type', 'Source',
  ],
  ROUTES_ASSUMED: [
    'Airline', 'Airline ID', 'Source airport', 'Source airport ID',
    'Destination airport', 'Destination airport ID', 'Codeshare',
    'Stops', 'Equipment',
  ],
};

/**
 * Generates a clean URL slug for airline names when codes are absent
 */
export function slugify(str) {
  if (!str) return 'unknown';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Builds standard unique airlineKey adhering to architecture.md section 2.1
 */
export function buildAirlineKey(icao, iata, name) {
  const cleanIcao = icao && icao !== '-' && icao !== 'N/A' && icao !== '\\N' ? icao.trim().toUpperCase() : null;
  const cleanIata = iata && iata !== '-' && iata !== 'N/A' && iata !== '\\N' ? iata.trim().toUpperCase() : null;
  
  if (cleanIcao && cleanIcao.length === 3) return cleanIcao;
  if (cleanIata && cleanIata.length === 2) return cleanIata;
  return slugify(name);
}
