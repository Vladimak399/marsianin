'use client';

import { ReactNode } from 'react';
import { LocationProvider } from './LocationProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <LocationProvider>{children}</LocationProvider>;
}
