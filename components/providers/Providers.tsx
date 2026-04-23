'use client';

import { ReactNode } from 'react';
import TransitionLayer from '@/components/TransitionLayer';
import { LocationProvider } from './LocationProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <TransitionLayer>{children}</TransitionLayer>
    </LocationProvider>
  );
}
