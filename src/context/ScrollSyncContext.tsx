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

  const syncScroll = useCallback(
    (source: 'canvas' | 'components' | 'properties', scrollTop: number) => {
      if (isScrolling) return;

      setIsScrolling(true);

      // Calcular proporção do scroll baseado na altura do canvas
      const canvasElement = canvasScrollRef.current;
      if (!canvasElement) {
        setIsScrolling(false);
        return;
      }

      const canvasScrollHeight = canvasElement.scrollHeight - canvasElement.clientHeight;
      const scrollRatio = canvasScrollHeight > 0 ? scrollTop / canvasScrollHeight : 0;

      // Sincronizar com as outras colunas
      if (source !== 'components' && componentsScrollRef.current) {
        const componentsMaxScroll =
          componentsScrollRef.current.scrollHeight - componentsScrollRef.current.clientHeight;
        const componentsTargetScroll = Math.max(
          0,
          Math.min(componentsMaxScroll, scrollRatio * componentsMaxScroll)
        );
        componentsScrollRef.current.scrollTop = componentsTargetScroll;
      }

      if (source !== 'properties' && propertiesScrollRef.current) {
        const propertiesMaxScroll =
          propertiesScrollRef.current.scrollHeight - propertiesScrollRef.current.clientHeight;
        const propertiesTargetScroll = Math.max(
          0,
          Math.min(propertiesMaxScroll, scrollRatio * propertiesMaxScroll)
        );
        propertiesScrollRef.current.scrollTop = propertiesTargetScroll;
      }

      if (source !== 'canvas' && canvasScrollRef.current) {
        canvasScrollRef.current.scrollTop = scrollTop;
      }

      // Reset flag após um pequeno delay
      setTimeout(() => setIsScrolling(false), 50);
    },
    [isScrolling]
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
