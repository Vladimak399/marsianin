'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from '@/components/providers/LocationProvider';

const LAYER_Z_INDEX = {
  page: 0,
  retained: 110,
  overlay: 120
} as const;

const OVERLAY_GRID_STYLE = {
  backgroundImage:
    'linear-gradient(rgba(138, 118, 94, 0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(138, 118, 94, 0.14) 1px, transparent 1px)',
  backgroundSize: '24px 24px'
} as const;

export default function TransitionLayer({ children }: { children: ReactNode }) {
  const { isTeleporting } = useLocation();
  const [useReducedMotion, setUseReducedMotion] = useState(false);
  const [retainedChildren, setRetainedChildren] = useState<ReactNode>(children);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = (event?: MediaQueryListEvent) => {
      setUseReducedMotion(event?.matches ?? mediaQuery.matches);
    };

    updatePreference();

    mediaQuery.addEventListener('change', updatePreference);

    return () => {
      mediaQuery.removeEventListener('change', updatePreference);
    };
  }, []);

  useEffect(() => {
    if (!isTeleporting) {
      setRetainedChildren(children);
    }
  }, [children, isTeleporting]);

  const transitionClasses = useReducedMotion
    ? 'duration-75 ease-linear'
    : 'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]';

  return (
    <>
      <div className="relative min-h-[100dvh]" style={{ zIndex: LAYER_Z_INDEX.page }}>
        {!isTeleporting ? children : null}
      </div>

      {isTeleporting ? (
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: LAYER_Z_INDEX.retained }}
        >
          {retainedChildren}
        </div>
      ) : null}

      <div
        aria-hidden
        className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity transition-transform ${transitionClasses} ${
          isTeleporting ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-[1.01]'
        }`}
        style={{ zIndex: LAYER_Z_INDEX.overlay }}
      >
        <div className="absolute inset-0 bg-[#fbf7ef]/98" />
        <div className="absolute inset-0" style={OVERLAY_GRID_STYLE} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,160,82,0.24),transparent_56%),radial-gradient(circle_at_82%_68%,rgba(255,138,61,0.18),transparent_52%)]" />
      </div>
    </>
  );
}
