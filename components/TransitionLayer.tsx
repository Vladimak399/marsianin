'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import TeleportOverlay from '@/components/TeleportOverlay';
import { useLocation } from '@/components/providers/LocationProvider';
import { nodeTransition } from '@/lib/animations';

export default function TransitionLayer({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isTeleporting, setIsTeleporting, selectedLocation, teleportOrigin } = useLocation();

  useEffect(() => {
    if (!isTeleporting) return;

    const timer = window.setTimeout(() => {
      setIsTeleporting(false);
    }, 140);

    return () => window.clearTimeout(timer);
  }, [pathname, isTeleporting, setIsTeleporting]);

  useEffect(() => {
    document.body.style.overflow = isTeleporting ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTeleporting]);

  return (
    <LayoutGroup id="system-flow">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={pathname} variants={nodeTransition} initial="initial" animate="animate" exit="exit" layout>
          {children}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {isTeleporting ? (
          <TeleportOverlay key="teleport-overlay" origin={teleportOrigin} locationLabel={selectedLocation?.toUpperCase()} />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}
