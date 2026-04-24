'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { LocationId } from '@/data/locations';

type TeleportOrigin = {
  x: number;
  y: number;
};

type GuestCoordinates = {
  lat: number;
  lng: number;
};

type LocationContextValue = {
  selectedLocation: LocationId | null;
  setSelectedLocation: (location: LocationId) => void;
  isTeleporting: boolean;
  setIsTeleporting: (state: boolean) => void;
  teleportOrigin: TeleportOrigin;
  setTeleportOrigin: (origin: TeleportOrigin) => void;
  guestCoordinates: GuestCoordinates | null;
  setGuestCoordinates: (coordinates: GuestCoordinates | null) => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LocationId | null>(null);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportOrigin, setTeleportOrigin] = useState<TeleportOrigin>({ x: 0, y: 0 });
  const [guestCoordinates, setGuestCoordinates] = useState<GuestCoordinates | null>(null);

  const value = useMemo(
    () => ({
      selectedLocation,
      setSelectedLocation,
      isTeleporting,
      setIsTeleporting,
      teleportOrigin,
      setTeleportOrigin,
      guestCoordinates,
      setGuestCoordinates
    }),
    [selectedLocation, isTeleporting, teleportOrigin, guestCoordinates]
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
