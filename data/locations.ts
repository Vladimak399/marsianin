export const LOCATION_DISPLAY: Record<string, string> = {
  o12: 'o12',
  k10: 'k10',
  p7: 'п7'
};

export const locations = [
  { id: 'o12', label: LOCATION_DISPLAY.o12 },
  { id: 'k10', label: LOCATION_DISPLAY.k10 },
  { id: 'p7', label: LOCATION_DISPLAY.p7 }
] as const;

export type LocationId = (typeof locations)[number]['id'];

export const getLocationLabel = (id: LocationId) => LOCATION_DISPLAY[id];
