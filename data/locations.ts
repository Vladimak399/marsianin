export const locations = [
  { id: 'o12', label: 'o12' },
  { id: 'k10', label: 'k10' },
  { id: 'p7', label: 'п7' }
] as const;

export type LocationId = (typeof locations)[number]['id'];

export const getLocationLabel = (locationId: LocationId) =>
  locations.find((location) => location.id === locationId)?.label ?? locationId;
