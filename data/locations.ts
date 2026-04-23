export const locations = [
  {
    id: 'o12',
    label: 'o12',
    lat: 54.7107,
    lng: 20.4526,
    address: 'калининград, ул октябрьская 12'
  },
  {
    id: 'k10',
    label: 'k10',
    lat: 54.7086,
    lng: 20.449,
    address: 'калининград, ул костромская 10'
  },
  {
    id: 'p7',
    label: 'п7',
    lat: 54.7115,
    lng: 20.4502,
    address: 'калининград, ул пролетарская 7'
  }
] as const;

export type LocationId = (typeof locations)[number]['id'];

export const getLocationLabel = (locationId: LocationId) =>
  locations.find((location) => location.id === locationId)?.label ?? locationId;

export const getLocationAddress = (locationId: LocationId) =>
  locations.find((location) => location.id === locationId)?.address ?? 'адрес уточняется';
