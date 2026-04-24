export const locations = [
  {
    id: 'o12',
    label: 'о12',
    nodeCode: 'O12',
    lat: 54.7008,
    lng: 20.5161,
    address: 'калининград, ул октябрьская 12',
    phone: '+7 (993) 731-36-96',
    phoneTel: '+79937313696'
  },
  {
    id: 'k10',
    label: 'к10',
    nodeCode: 'K10',
    lat: 54.7299,
    lng: 20.5523,
    address: 'калининград, ул костромская 10',
    phone: '+7 (995) 326-31-96',
    phoneTel: '+79953263196'
  },
  {
    id: 'p7',
    label: 'п7',
    nodeCode: 'P7',
    lat: 54.712506,
    lng: 20.512726,
    address: 'калининград, ул пролетарская 7',
    phone: '+7 (995) 303-69-64',
    phoneTel: '+79953036964'
  }
] as const;

export type LocationId = (typeof locations)[number]['id'];

export const getLocationById = (locationId: LocationId) => locations.find((location) => location.id === locationId);

export const getLocationLabel = (locationId: LocationId) =>
  getLocationById(locationId)?.label ?? locationId;

export const getLocationAddress = (locationId: LocationId) =>
  getLocationById(locationId)?.address ?? 'адрес уточняется';
