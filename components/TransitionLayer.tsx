'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';

export default function TransitionLayer({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { isTeleporting, setIsTeleporting } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isTeleporting) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    if (pathname.startsWith('/menu/')) {
      const timeout = window.setTimeout(
        () => {
          setIsVisible(false);
          setIsTeleporting(false);
        },
        reduceMotion ? 90 : 320
      );

      return () => window.clearTimeout(timeout);
    }

    return;
  }, [isTeleporting, pathname, reduceMotion, setIsTeleporting]);

  return (
    <>
      {children}
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[300] overflow-hidden"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.992, y: 8 }}
            animate={reduceMotion ? { opacity: 0.9 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.004, y: -6 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[#f6f2ea]" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(237,106,50,.52) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,106,50,.52) 1px, transparent 1px)',
                backgroundSize: '88px 96px'
              }}
            />
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.1, y: 10 }}
              animate={{ opacity: 0.55, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: 'easeOut' }}
              style={{
                background:
                  'linear-gradient(126deg, rgba(237,106,50,0.06) 0%, rgba(237,106,50,0.24) 50%, rgba(237,106,50,0.08) 100%)'
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
