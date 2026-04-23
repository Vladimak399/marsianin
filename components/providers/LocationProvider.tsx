'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { LocationId } from '@/data/locations';

type TeleportOrigin = {
  x: number;
  y: number;
};

type LocationContextValue = {
  selectedLocation: LocationId | null;
  setSelectedLocation: (location: LocationId) => void;
  isTeleporting: boolean;
  setIsTeleporting: (state: boolean) => void;
  teleportOrigin: TeleportOrigin;
  setTeleportOrigin: (origin: TeleportOrigin) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationId | null>(null);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportOrigin, setTeleportOrigin] = useState<TeleportOrigin>({ x: 0, y: 0 });

  const value = useMemo(
    () => ({
      selectedLocation,
      setSelectedLocation,
      isTeleporting,
      setIsTeleporting,
      teleportOrigin,
      setTeleportOrigin
    }),
    [selectedLocation, isTeleporting, teleportOrigin]
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
