export const locations = [
  { id: 'o12', label: 'O12' },
  { id: 'k10', label: 'K10' },
  { id: 'p7', label: 'P7' }
] as const;

export type LocationId = (typeof locations)[number]['id'];
