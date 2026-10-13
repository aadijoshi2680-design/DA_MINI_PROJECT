// Script to generate high-fidelity mock JSON data for SkyGraph
// Run with: node generate_mock_data.mjs

import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/data-mock');
fs.mkdirSync(OUT_DIR, { recursive: true });

// 1. summary.json
const summary = {
  airports: 7658,
  airlines: 6160,
  activeAirlines: 1254,
  routes: 67664,
  countries: 237,
  avgDegree: 17.66,
  directShare: 96.8,
  codeshareShare: 14.5,
  droppedRoutes: 412,
};
fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));

// 2. top_hubs.json (Top 50 global hubs by PageRank)
const topHubs = [
  { iata: 'ATL', name: 'Hartsfield Jackson Atlanta Intl', city: 'Atlanta', country: 'United States', pagerank: 0.00842, degree: 915 },
  { iata: 'PEK', name: 'Beijing Capital Intl', city: 'Beijing', country: 'China', pagerank: 0.00789, degree: 824 },
  { iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom', pagerank: 0.00765, degree: 710 },
  { iata: 'ORD', name: 'Chicago O\'Hare Intl', city: 'Chicago', country: 'United States', pagerank: 0.00741, degree: 852 },
  { iata: 'HND', name: 'Tokyo Haneda Intl', city: 'Tokyo', country: 'Japan', pagerank: 0.00712, degree: 640 },
  { iata: 'CDG', name: 'Charles de Gaulle Intl', city: 'Paris', country: 'France', pagerank: 0.00695, degree: 688 },
  { iata: 'DFW', name: 'Dallas Fort Worth Intl', city: 'Dallas', country: 'United States', pagerank: 0.00681, degree: 780 },
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', pagerank: 0.00674, degree: 704 },
  { iata: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'United Arab Emirates', pagerank: 0.00652, degree: 620 },
  { iata: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', pagerank: 0.00639, degree: 648 },
  { iata: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'Hong Kong', pagerank: 0.00615, degree: 590 },
  { iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', pagerank: 0.00598, degree: 560 },
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', pagerank: 0.00589, degree: 610 },
  { iata: 'CAN', name: 'Guangzhou Baiyun Intl', city: 'Guangzhou', country: 'China', pagerank: 0.00574, degree: 580 },
  { iata: 'JFK', name: 'John F Kennedy Intl', city: 'New York', country: 'United States', pagerank: 0.00561, degree: 540 },
  { iata: 'DEN', name: 'Denver Intl', city: 'Denver', country: 'United States', pagerank: 0.00548, degree: 690 },
  { iata: 'ICN', name: 'Incheon Intl', city: 'Seoul', country: 'South Korea', pagerank: 0.00532, degree: 520 },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', country: 'India', pagerank: 0.00518, degree: 480 },
  { iata: 'DEL', name: 'Indira Gandhi Intl', city: 'Delhi', country: 'India', pagerank: 0.00507, degree: 512 },
  { iata: 'MAD', name: 'Adolfo Suárez Madrid Barajas', city: 'Madrid', country: 'Spain', pagerank: 0.00495, degree: 490 },
  { iata: 'BCN', name: 'Josep Tarradellas Barcelona-El Prat', city: 'Barcelona', country: 'Spain', pagerank: 0.00482, degree: 440 },
  { iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'United States', pagerank: 0.00474, degree: 610 },
  { iata: 'PVG', name: 'Shanghai Pudong Intl', city: 'Shanghai', country: 'China', pagerank: 0.00465, degree: 520 },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', pagerank: 0.00451, degree: 460 },
  { iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', pagerank: 0.00438, degree: 380 },
  { iata: 'YYZ', name: 'Toronto Pearson Intl', city: 'Toronto', country: 'Canada', pagerank: 0.00427, degree: 410 },
  { iata: 'LGW', name: 'London Gatwick', city: 'London', country: 'United Kingdom', pagerank: 0.00416, degree: 390 },
  { iata: 'FCO', name: 'Leonardo da Vinci Rome Fiumicino', city: 'Rome', country: 'Italy', pagerank: 0.00405, degree: 370 },
  { iata: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', country: 'Malaysia', pagerank: 0.00396, degree: 395 },
  { iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', pagerank: 0.00388, degree: 430 },
  { iata: 'MEX', name: 'Mexico City Intl Benito Juárez', city: 'Mexico City', country: 'Mexico', pagerank: 0.00375, degree: 360 },
  { iata: 'GRU', name: 'São Paulo/Guarulhos Intl', city: 'São Paulo', country: 'Brazil', pagerank: 0.00366, degree: 350 },
  { iata: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', pagerank: 0.00355, degree: 340 },
  { iata: 'VIE', name: 'Vienna Intl', city: 'Vienna', country: 'Austria', pagerank: 0.00344, degree: 330 },
  { iata: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark', pagerank: 0.00332, degree: 320 },
  { iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'Norway', pagerank: 0.00321, degree: 300 },
  { iata: 'DOH', name: 'Hamad Intl', city: 'Doha', country: 'Qatar', pagerank: 0.00315, degree: 370 },
  { iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'United States', pagerank: 0.00308, degree: 450 },
  { iata: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'United States', pagerank: 0.00299, degree: 420 },
  { iata: 'BOS', name: 'Boston Logan Intl', city: 'Boston', country: 'United States', pagerank: 0.00291, degree: 380 },
  { iata: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', country: 'United States', pagerank: 0.00284, degree: 400 },
  { iata: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', country: 'United States', pagerank: 0.00278, degree: 390 },
  { iata: 'CLT', name: 'Charlotte Douglas Intl', city: 'Charlotte', country: 'United States', pagerank: 0.00272, degree: 460 },
  { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'United States', pagerank: 0.00265, degree: 440 },
  { iata: 'PHX', name: 'Phoenix Sky Harbor Intl', city: 'Phoenix', country: 'United States', pagerank: 0.00258, degree: 380 },
  { iata: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', pagerank: 0.00251, degree: 290 },
  { iata: 'JNB', name: 'O. R. Tambo Intl', city: 'Johannesburg', country: 'South Africa', pagerank: 0.00245, degree: 270 },
  { iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'Sweden', pagerank: 0.00238, degree: 280 },
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', pagerank: 0.00232, degree: 310 },
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', pagerank: 0.00226, degree: 290 },
];
fs.writeFileSync(path.join(OUT_DIR, 'top_hubs.json'), JSON.stringify(topHubs, null, 2));

// 3. airports.json (Detailed coordinates and community IDs for ~80 global hubs)
const airportCoords = {
  ATL: [33.6407, -84.4277, 1], PEK: [40.0799, 116.6031, 2], LHR: [51.4700, -0.4543, 3],
  ORD: [41.9742, -87.9073, 1], HND: [35.5494, 139.7798, 2], CDG: [49.0097, 2.5479, 3],
  DFW: [32.8998, -97.0403, 1], FRA: [50.0379, 8.5622, 3], DXB: [25.2532, 55.3657, 4],
  AMS: [52.3105, 4.7683, 3], HKG: [22.3080, 113.9185, 2], SIN: [1.3644, 103.9915, 5],
  IST: [41.2753, 28.7519, 4], CAN: [23.3924, 113.2988, 2], JFK: [40.6413, -73.7781, 1],
  DEN: [39.8561, -104.6737, 1], ICN: [37.4602, 126.4407, 2], BOM: [19.0896, 72.8656, 6],
  DEL: [28.5562, 77.1000, 6], MAD: [40.4839, -3.5680, 3], BCN: [41.2974, 2.0833, 3],
  LAX: [33.9416, -118.4085, 1], PVG: [31.1443, 121.8083, 2], MUC: [48.3537, 11.7750, 3],
  SYD: [-33.9399, 151.1753, 7], YYZ: [43.6777, -79.6248, 1], LGW: [51.1537, -0.1821, 3],
  FCO: [41.7999, 12.2462, 3], KUL: [2.7456, 101.7099, 5], BKK: [13.6900, 100.7501, 5],
  MEX: [19.4361, -99.0719, 8], GRU: [-23.4356, -46.4731, 8], ZRH: [47.4582, 8.5555, 3],
  VIE: [48.1103, 16.5697, 3], CPH: [55.6180, 12.6508, 3], OSL: [60.1975, 11.1004, 3],
  DOH: [25.2731, 51.6081, 4], SFO: [37.6213, -122.3790, 1], MIA: [25.7959, -80.2870, 1],
  BOS: [42.3656, -71.0096, 1], EWR: [40.6895, -74.1745, 1], SEA: [47.4502, -122.3088, 1],
  CLT: [35.2144, -80.9473, 1], IAH: [29.9902, -95.3368, 1], PHX: [33.4342, -112.0080, 1],
  MEL: [-37.6690, 144.8410, 7], JNB: [-26.1367, 28.2411, 9], ARN: [59.6498, 17.9238, 3],
  DUB: [53.4264, -6.2499, 3], BRU: [50.9010, 4.4856, 3],
};

const airports = topHubs.map((hub, idx) => {
  const coords = airportCoords[hub.iata] || [0, 0, 1];
  return {
    id: idx + 1,
    name: hub.name,
    city: hub.city,
    country: hub.country,
    iata: hub.iata,
    lat: coords[0],
    lon: coords[1],
    pagerank: hub.pagerank,
    degree: hub.degree,
    communityId: coords[2],
  };
});
fs.writeFileSync(path.join(OUT_DIR, 'airports.json'), JSON.stringify(airports, null, 2));

// 4. airlines.json
const airlines = [
  { key: 'AAL', name: 'American Airlines', iata: 'AA', icao: 'AAL', country: 'United States', active: true, routeCount: 2354, countryCount: 54, airportCount: 350 },
  { key: 'DAL', name: 'Delta Air Lines', iata: 'DL', icao: 'DAL', country: 'United States', active: true, routeCount: 1980, countryCount: 57, airportCount: 325 },
  { key: 'UAL', name: 'United Airlines', iata: 'UA', icao: 'UAL', country: 'United States', active: true, routeCount: 1720, countryCount: 60, airportCount: 310 },
  { key: 'RYR', name: 'Ryanair', iata: 'FR', icao: 'RYR', country: 'Ireland', active: true, routeCount: 2484, countryCount: 37, airportCount: 225 },
  { key: 'THY', name: 'Turkish Airlines', iata: 'TK', icao: 'THY', country: 'Turkey', active: true, routeCount: 1350, countryCount: 120, airportCount: 315 },
  { key: 'CSN', name: 'China Southern Airlines', iata: 'CZ', icao: 'CSN', country: 'China', active: true, routeCount: 1450, countryCount: 40, airportCount: 210 },
  { key: 'DLH', name: 'Lufthansa', iata: 'LH', icao: 'DLH', country: 'Germany', active: true, routeCount: 1200, countryCount: 82, airportCount: 220 },
  { key: 'UAE', name: 'Emirates', iata: 'EK', icao: 'UAE', country: 'United Arab Emirates', active: true, routeCount: 890, countryCount: 85, airportCount: 160 },
  { key: 'AFR', name: 'Air France', iata: 'AF', icao: 'AFR', country: 'France', active: true, routeCount: 940, countryCount: 78, airportCount: 190 },
  { key: 'BAW', name: 'British Airways', iata: 'BA', icao: 'BAW', country: 'United Kingdom', active: true, routeCount: 880, countryCount: 75, airportCount: 185 },
  { key: 'QFA', name: 'Qantas', iata: 'QF', icao: 'QFA', country: 'Australia', active: true, routeCount: 540, countryCount: 25, airportCount: 95 },
  { key: 'SIA', name: 'Singapore Airlines', iata: 'SQ', icao: 'SIA', country: 'Singapore', active: true, routeCount: 480, countryCount: 36, airportCount: 75 },
  { key: 'AIC', name: 'Air India', iata: 'AI', icao: 'AIC', country: 'India', active: true, routeCount: 420, countryCount: 30, airportCount: 90 },
  { key: 'KLM', name: 'KLM Royal Dutch Airlines', iata: 'KL', icao: 'KLM', country: 'Netherlands', active: true, routeCount: 620, countryCount: 68, airportCount: 145 },
  { key: 'IBE', name: 'Iberia', iata: 'IB', icao: 'IBE', country: 'Spain', active: true, routeCount: 510, countryCount: 45, airportCount: 110 },
  // Defunct carriers (sample for active vs defunct stats)
  { key: 'PAA', name: 'Pan American World Airways', iata: 'PA', icao: 'PAA', country: 'United States', active: false, routeCount: null, countryCount: null, airportCount: null },
  { key: 'TWA', name: 'Trans World Airlines', iata: 'TW', icao: 'TWA', country: 'United States', active: false, routeCount: null, countryCount: null, airportCount: null },
  { key: 'SWR-OLD', name: 'Swissair', iata: 'SR', icao: 'SWR', country: 'Switzerland', active: false, routeCount: null, countryCount: null, airportCount: null },
  { key: 'BOA', name: 'British Overseas Airways', iata: 'BA', icao: 'BOA', country: 'United Kingdom', active: false, routeCount: null, countryCount: null, airportCount: null },
];
fs.writeFileSync(path.join(OUT_DIR, 'airlines.json'), JSON.stringify(airlines, null, 2));

// 5. airlines_by_country.json (Matches real counts in architecture.md section 2.1)
const airlinesByCountry = [
  { country: 'United States', active: 156, defunct: 940 },
  { country: 'Russia', active: 80, defunct: 280 },
  { country: 'United Kingdom', active: 45, defunct: 460 },
  { country: 'Germany', active: 38, defunct: 210 },
  { country: 'Canada', active: 37, defunct: 290 },
  { country: 'Australia', active: 27, defunct: 180 },
  { country: 'Spain', active: 24, defunct: 120 },
  { country: 'China', active: 23, defunct: 65 },
  { country: 'France', active: 22, defunct: 195 },
  { country: 'India', active: 20, defunct: 75 },
  { country: 'Italy', active: 18, defunct: 140 },
  { country: 'Japan', active: 17, defunct: 60 },
  { country: 'South Africa', active: 16, defunct: 85 },
  { country: 'Brazil', active: 15, defunct: 110 },
  { country: 'Mexico', active: 14, defunct: 95 },
  { country: 'Indonesia', active: 14, defunct: 68 },
  { country: 'Turkey', active: 12, defunct: 45 },
  { country: 'Switzerland', active: 11, defunct: 55 },
  { country: 'Netherlands', active: 10, defunct: 52 },
  { country: 'Sweden', active: 10, defunct: 70 },
];
fs.writeFileSync(path.join(OUT_DIR, 'airlines_by_country.json'), JSON.stringify(airlinesByCountry, null, 2));

// 6. country_stats.json (Top countries by routes)
const countryStats = [
  { country: 'United States', code: 'USA', continent: 'North America', airports: 1512, routesOut: 13240, routesIn: 13180 },
  { country: 'China', code: 'CHN', continent: 'Asia', airports: 242, routesOut: 8120, routesIn: 8090 },
  { country: 'United Kingdom', code: 'GBR', continent: 'Europe', airports: 164, routesOut: 4850, routesIn: 4820 },
  { country: 'Spain', code: 'ESP', continent: 'Europe', airports: 48, routesOut: 3920, routesIn: 3900 },
  { country: 'Germany', code: 'DEU', continent: 'Europe', airports: 98, routesOut: 3810, routesIn: 3800 },
  { country: 'France', code: 'FRA', continent: 'Europe', airports: 132, routesOut: 3450, routesIn: 3430 },
  { country: 'Italy', code: 'ITA', continent: 'Europe', airports: 88, routesOut: 2980, routesIn: 2970 },
  { country: 'India', code: 'IND', continent: 'Asia', airports: 124, routesOut: 2750, routesIn: 2740 },
  { country: 'Russia', code: 'RUS', continent: 'Europe', airports: 260, routesOut: 2680, routesIn: 2650 },
  { country: 'Canada', code: 'CAN', continent: 'North America', airports: 430, routesOut: 2540, routesIn: 2520 },
  { country: 'Australia', code: 'AUS', continent: 'Oceania', airports: 260, routesOut: 2190, routesIn: 2180 },
  { country: 'Japan', code: 'JPN', continent: 'Asia', airports: 95, routesOut: 2100, routesIn: 2090 },
  { country: 'Turkey', code: 'TUR', continent: 'Europe', airports: 54, routesOut: 2040, routesIn: 2030 },
  { country: 'United Arab Emirates', code: 'ARE', continent: 'Middle East', airports: 12, routesOut: 1890, routesIn: 1880 },
  { country: 'Brazil', code: 'BRA', continent: 'South America', airports: 210, routesOut: 1780, routesIn: 1770 },
];
fs.writeFileSync(path.join(OUT_DIR, 'country_stats.json'), JSON.stringify(countryStats, null, 2));

// 7. communities.json (Louvain communities)
const communities = [
  { id: 1, size: 2150, topAirport: 'ATL', topCountries: ['United States', 'Canada', 'Mexico'], label: 'North America Cluster' },
  { id: 3, size: 1840, topAirport: 'LHR', topCountries: ['United Kingdom', 'Germany', 'Spain', 'France'], label: 'Western European Network' },
  { id: 2, size: 1420, topAirport: 'PEK', topCountries: ['China', 'Japan', 'South Korea'], label: 'East Asia Hubs' },
  { id: 4, size: 680, topAirport: 'DXB', topCountries: ['United Arab Emirates', 'Qatar', 'Saudi Arabia', 'Turkey'], label: 'Middle East & Gulf Nexus' },
  { id: 5, size: 590, topAirport: 'SIN', topCountries: ['Singapore', 'Thailand', 'Malaysia', 'Indonesia'], label: 'Southeast Asia Corridor' },
  { id: 6, size: 410, topAirport: 'DEL', topCountries: ['India', 'Pakistan', 'Sri Lanka', 'Bangladesh'], label: 'South Asia Network' },
  { id: 8, size: 380, topAirport: 'GRU', topCountries: ['Brazil', 'Argentina', 'Colombia', 'Chile'], label: 'Latin America Cluster' },
  { id: 7, size: 290, topAirport: 'SYD', topCountries: ['Australia', 'New Zealand', 'Fiji'], label: 'Oceania & Pacific' },
  { id: 9, size: 240, topAirport: 'JNB', topCountries: ['South Africa', 'Kenya', 'Ethiopia', 'Nigeria'], label: 'Sub-Saharan Africa' },
];
fs.writeFileSync(path.join(OUT_DIR, 'communities.json'), JSON.stringify(communities, null, 2));

// 8. route_distance_hist.json
const distanceHist = {
  bins: ['0-500 km', '500-1000 km', '1000-2000 km', '2000-3000 km', '3000-5000 km', '5000-8000 km', '8000+ km'],
  counts: [11200, 18400, 19600, 8900, 5400, 2800, 1364],
};
fs.writeFileSync(path.join(OUT_DIR, 'route_distance_hist.json'), JSON.stringify(distanceHist, null, 2));

// 9. stops_codeshare.json
const stopsCodeshare = {
  stops: { '0': 65500, '1': 2100, '2+': 64 },
  codeshare: { 'Y': 9812, 'N': 57852 },
};
fs.writeFileSync(path.join(OUT_DIR, 'stops_codeshare.json'), JSON.stringify(stopsCodeshare, null, 2));

// 10. equipment_top.json
const equipmentTop = [
  { code: '320', name: 'Airbus A320', count: 9812 },
  { code: '738', name: 'Boeing 737-800', count: 8640 },
  { code: '73H', name: 'Boeing 737-800 Winglets', count: 4210 },
  { code: '319', name: 'Airbus A319', count: 3920 },
  { code: '321', name: 'Airbus A321', count: 3240 },
  { code: '77W', name: 'Boeing 777-300ER', count: 2650 },
  { code: '737', name: 'Boeing 737', count: 2310 },
  { code: 'AT7', name: 'ATR 72', count: 2120 },
  { code: '788', name: 'Boeing 787-8', count: 1840 },
  { code: '789', name: 'Boeing 787-9', count: 1730 },
  { code: 'CR9', name: 'Bombardier CRJ-900', count: 1540 },
  { code: '333', name: 'Airbus A330-300', count: 1420 },
  { code: 'E75', name: 'Embraer 175', count: 1310 },
  { code: '332', name: 'Airbus A330-200', count: 1205 },
  { code: '763', name: 'Boeing 767-300', count: 1110 },
];
fs.writeFileSync(path.join(OUT_DIR, 'equipment_top.json'), JSON.stringify(equipmentTop, null, 2));

// 11. airline_region_matrix.json
const airlineRegionMatrix = {
  airlines: ['American Airlines', 'Delta Air Lines', 'United Airlines', 'Ryanair', 'Lufthansa', 'Emirates', 'Turkish Airlines', 'British Airways'],
  regions: ['North America', 'Europe', 'Asia', 'Middle East', 'Latin America', 'Africa', 'Oceania'],
  values: [
    [1850, 240, 95, 20, 140, 5, 4],
    [1540, 220, 110, 25, 80, 5, 0],
    [1320, 210, 125, 20, 40, 5, 0],
    [0, 2484, 0, 0, 0, 0, 0],
    [32, 890, 160, 68, 25, 25, 0],
    [45, 210, 310, 180, 20, 120, 5],
    [30, 640, 320, 160, 20, 180, 0],
    [65, 520, 140, 85, 30, 40, 0],
  ],
};
fs.writeFileSync(path.join(OUT_DIR, 'airline_region_matrix.json'), JSON.stringify(airlineRegionMatrix, null, 2));

// 12. edges.json (Compact indices: [srcIdx, dstIdx, airlineIdx] into airports and airlines)
// Create a rich connected mesh between the top 50 airports
const edges = [];
for (let i = 0; i < airports.length; i++) {
  // Connect to next 4 closest or major airports
  for (let j = 1; j <= 5; j++) {
    const targetIdx = (i + j) % airports.length;
    const airlineIdx = (i + j) % Math.min(airlines.length, 10);
    edges.push([i, targetIdx, airlineIdx]);
  }
}
// Add explicit intercontinental connections (e.g. BOM <-> DXB <-> LHR <-> JFK)
const findIdx = (iata) => airports.findIndex((a) => a.iata === iata);
const connect = (c1, c2, airKey = 0) => {
  const i1 = findIdx(c1);
  const i2 = findIdx(c2);
  if (i1 >= 0 && i2 >= 0) {
    edges.push([i1, i2, airKey]);
    edges.push([i2, i1, airKey]);
  }
};
connect('BOM', 'DXB', 7); // Emirates
connect('DXB', 'LHR', 7);
connect('LHR', 'JFK', 9); // BAW
connect('BOM', 'DEL', 12); // Air India
connect('DEL', 'LHR', 9);
connect('JFK', 'LAX', 0); // AA
connect('JFK', 'ORD', 0);
connect('ATL', 'ORD', 1); // Delta
connect('PEK', 'HND', 5);
connect('SIN', 'HKG', 11);
connect('CDG', 'FRA', 6);
connect('DXB', 'SIN', 7);
connect('LHR', 'SIN', 9);

fs.writeFileSync(path.join(OUT_DIR, 'edges.json'), JSON.stringify(edges));

// 13. meta.json
const meta = {
  generatedAt: new Date().toISOString(),
  source: 'OpenFlights via Kaggle',
  version: '1.0.0-mock',
  activeAirlinesCount: 1254,
  totalAirportsCount: 7658,
  totalRoutesCount: 67664,
  isMock: true,
};
fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

console.log('Successfully generated all 13 mock JSON datasets in public/data-mock/!');
