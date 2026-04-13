/**
 * Birth location → lat/lon.
 *
 * For the prototype we use a curated list of major cities.
 * Production will integrate a geocoding API.
 */

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const CITIES: GeoLocation[] = [
  { name: 'Copenhagen', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen' },
  { name: 'Stockholm', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm' },
  { name: 'Oslo', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo' },
  { name: 'Helsinki', latitude: 60.1699, longitude: 24.9384, timezone: 'Europe/Helsinki' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin' },
  { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam' },
  { name: 'Rome', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome' },
  { name: 'Madrid', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid' },
  { name: 'Lisbon', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon' },
  { name: 'Athens', latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens' },
  { name: 'Istanbul', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
  { name: 'Moscow', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow' },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles' },
  { name: 'Chicago', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago' },
  { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
  { name: 'Toronto', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  { name: 'Mexico City', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City' },
  { name: 'São Paulo', latitude: -23.5505, longitude: -46.6333, timezone: 'America/Sao_Paulo' },
  { name: 'Buenos Aires', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'Beijing', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai' },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Cairo', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Nairobi', latitude: -1.2921, longitude: 36.8219, timezone: 'Africa/Nairobi' },
  { name: 'Lagos', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos' },
];

export function searchCities(query: string): GeoLocation[] {
  const lower = query.toLowerCase();
  return CITIES.filter(c => c.name.toLowerCase().includes(lower));
}

export function getAllCities(): GeoLocation[] {
  return [...CITIES].sort((a, b) => a.name.localeCompare(b.name));
}

export function getCityByName(name: string): GeoLocation | undefined {
  return CITIES.find(c => c.name.toLowerCase() === name.toLowerCase());
}
