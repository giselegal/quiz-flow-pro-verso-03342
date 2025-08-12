import { useEffect, useCallback } from "react";
import { useScrollSync } from "@/context/ScrollSyncContext";

interface UseSyncedScrollOptions {
  source: "canvas" | "components" | "properties";
  enabled?: boolean;
}

export const useSyncedScroll = ({ source, enabled = true }: UseSyncedScrollOptions) => {
  const { canvasScrollRef, componentsScrollRef, propertiesScrollRef, syncScroll, isScrolling } =
    useScrollSync();

  const getScrollRef = () => {
    switch (source) {
      case "canvas":
        return canvasScrollRef;
      case "components":
        return componentsScrollRef;
      case "properties":
        return propertiesScrollRef;
      default:
        return canvasScrollRef;
    }
  };

  const handleScroll = useCallback(
    (event: Event) => {
      if (!enabled || isScrolling) return;

      const target = event.target as HTMLDivElement;
      syncScroll(source, target.scrollTop);
    },
    [enabled, isScrolling, source, syncScroll]
  );

  const scrollRef = getScrollRef();

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !enabled) return;

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, enabled, scrollRef]);

  return {
    scrollRef,
    isScrolling,
  };
};
