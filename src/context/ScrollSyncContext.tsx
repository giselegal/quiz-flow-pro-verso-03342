import React, { createContext, useContext, useRef, useCallback, useState } from 'react';

interface ScrollSyncContextType {
  canvasScrollRef: React.RefObject<HTMLDivElement>;
  componentsScrollRef: React.RefObject<HTMLDivElement>;
  propertiesScrollRef: React.RefObject<HTMLDivElement>;
  syncScroll: (source: 'canvas' | 'components' | 'properties', scrollTop: number) => void;
  isScrolling: boolean;
}

const ScrollSyncContext = createContext<ScrollSyncContextType | undefined>(undefined);

export const useScrollSync = () => {
  const context = useContext(ScrollSyncContext);
  if (!context) {
    throw new Error('useScrollSync must be used within a ScrollSyncProvider');
  }
  return context;
};

interface ScrollSyncProviderProps {
  children: React.ReactNode;
}

export const ScrollSyncProvider: React.FC<ScrollSyncProviderProps> = ({ children }) => {
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const componentsScrollRef = useRef<HTMLDivElement>(null);
  const propertiesScrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const isSyncingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const syncScroll = useCallback(
    (source: 'canvas' | 'components' | 'properties', scrollTop: number) => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      setIsScrolling(true);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const getElement = (s: 'canvas' | 'components' | 'properties'): HTMLDivElement | null => {
          switch (s) {
            case 'canvas':
              return canvasScrollRef.current;
            case 'components':
              return componentsScrollRef.current;
            case 'properties':
              return propertiesScrollRef.current;
            default:
              return null;
          }
        };

        const sourceEl = getElement(source);
        if (!sourceEl) {
          isSyncingRef.current = false;
          setIsScrolling(false);
          return;
        }

        const sourceMaxScroll = Math.max(0, sourceEl.scrollHeight - sourceEl.clientHeight);
        const ratio = sourceMaxScroll > 0 ? scrollTop / sourceMaxScroll : 0;

        const applyProportional = (target: 'canvas' | 'components' | 'properties') => {
          if (target === source) return;
          const el = getElement(target);
          if (!el) return;
          const max = Math.max(0, el.scrollHeight - el.clientHeight);
          const next = Math.max(0, Math.min(max, ratio * max));
          if (Math.abs(el.scrollTop - next) > 1) {
            el.scrollTop = next;
          }
        };

        applyProportional('canvas');
        applyProportional('components');
        applyProportional('properties');

        isSyncingRef.current = false;
        setIsScrolling(false);
      });
    },
    []
  );

  const value = {
    canvasScrollRef,
    componentsScrollRef,
    propertiesScrollRef,
    syncScroll,
    isScrolling,
  };

  return <ScrollSyncContext.Provider value={value}>{children}</ScrollSyncContext.Provider>;
};
