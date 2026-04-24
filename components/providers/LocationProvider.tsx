'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Coordinates } from '@/lib/geo';
import { LocationId } from '@/data/locations';

type TeleportOrigin = {
  x: number;
  y: number;
};

type EntrySource = 'default' | 'qr';

type LocationContextValue = {
  selectedLocation: LocationId | null;
  setSelectedLocation: (location: LocationId) => void;
  isTeleporting: boolean;
  setIsTeleporting: (state: boolean) => void;
  teleportOrigin: TeleportOrigin;
  setTeleportOrigin: (origin: TeleportOrigin) => void;
  guestCoordinates: Coordinates | null;
  setGuestCoordinates: (coordinates: Coordinates | null) => void;
  entrySource: EntrySource;
  setEntrySource: (source: EntrySource) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationId | null>(null);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportOrigin, setTeleportOrigin] = useState<TeleportOrigin>({ x: 0, y: 0 });
  const [guestCoordinates, setGuestCoordinates] = useState<Coordinates | null>(null);
  const [entrySource, setEntrySource] = useState<EntrySource>('default');

  const value = useMemo(
    () => ({
      selectedLocation,
      setSelectedLocation,
      isTeleporting,
      setIsTeleporting,
      teleportOrigin,
      setTeleportOrigin,
      guestCoordinates,
      setGuestCoordinates,
      entrySource,
      setEntrySource
    }),
    [selectedLocation, isTeleporting, teleportOrigin, guestCoordinates, entrySource]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }

  return context;
}
