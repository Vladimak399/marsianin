import { LocationId, locations } from '@/data/locations';

export type Phase = 'map' | 'lock' | 'docking' | 'wash' | 'open';
export type Coordinates = { lat: number; lng: number };
export type LocationPoint = {
  id: LocationId;
  code: string;
  title: string;
  lat: number;
  lng: number;
  visual: { x: number; y: number };
};
export type NearestLocation = LocationPoint & { distance: number };

const LOCATION_META: Record<LocationId, Pick<LocationPoint, 'code' | 'title' | 'visual'>> = {
  o12: { code: 'о12', title: 'октябрьская, 12', visual: { x: 7, y: 34 } },
  k10: { code: 'к10', title: 'костромская, 10', visual: { x: 7, y: 54 } },
  p7: { code: 'п7', title: 'пролетарская, 7', visual: { x: 7, y: 74 } }
};

export const LOCATIONS: LocationPoint[] = locations.map((location) => ({
  id: location.id,
  code: LOCATION_META[location.id].code,
  title: LOCATION_META[location.id].title,
  lat: location.lat,
  lng: location.lng,
  visual: LOCATION_META[location.id].visual
}));

export const LOCATION_DETAILS = Object.fromEntries(locations.map((location) => [location.id, location])) as Record<
  LocationId,
  (typeof locations)[number]
>;

const toRad = (value: number) => (value * Math.PI) / 180;

function getDistanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radius = 6371;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const value =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function getNearestLocation(coords: Coordinates | null): NearestLocation | null {
  if (!coords) return null;

  let nearest: NearestLocation | null = null;
  let minDistance = Infinity;

  for (const point of LOCATIONS) {
    const distance = getDistanceKm(coords.lat, coords.lng, point.lat, point.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...point, distance };
    }
  }

  return nearest;
}
