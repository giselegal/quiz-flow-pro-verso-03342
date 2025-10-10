import { useEffect, useCallback, useRef } from 'react';
import { useScrollSync } from '@/contexts';

interface UseSyncedScrollOptions {
  source: 'canvas' | 'components' | 'properties';
  enabled?: boolean;
}

export const useSyncedScroll = ({ source, enabled = true }: UseSyncedScrollOptions) => {
  const { canvasScrollRef, componentsScrollRef, propertiesScrollRef, syncScroll, isScrolling } =
    useScrollSync();

  const getScrollRef = () => {
    switch (source) {
      case 'canvas':
        return canvasScrollRef;
      case 'components':
        return componentsScrollRef;
      case 'properties':
        return propertiesScrollRef;
      default:
        return canvasScrollRef;
    }
  };

  const handleScroll = useCallback(
    (event: Event) => {
      const g: any = typeof window !== 'undefined' ? (window as any) : {};
      if (!enabled || isScrolling || g.__DISABLE_SCROLL_SYNC === true) return;

      const target = event.target as HTMLDivElement;
      // Guardar o último scrollTop e agendar via RAF para suavizar
      lastScrollTop.current = target.scrollTop;

      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        syncScroll(source, lastScrollTop.current);
      });
    },
    [enabled, isScrolling, source, syncScroll]
  );

  const scrollRef = getScrollRef();
  const rafId = useRef<number | null>(null);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const element = scrollRef.current;
    const g: any = typeof window !== 'undefined' ? (window as any) : {};
    if (!element || !enabled || g.__DISABLE_SCROLL_SYNC === true) return;

    element.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      element.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [handleScroll, enabled, scrollRef]);

  return {
    scrollRef,
    isScrolling,
  };
};
