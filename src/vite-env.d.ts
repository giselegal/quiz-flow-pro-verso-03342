/// <reference types="vite/client" />

declare global {
  interface Window {
    fixBlurryIntroQuizImages?: (
      rootElement?: HTMLElement | null,
      opts?: { selector?: string; onFixed?: (img: HTMLImageElement) => void }
    ) => HTMLImageElement[];
    QUIZ_PERF?: {
      startTime: number;
      markerTimings: Record<string, number>;
      mark: (name: string) => void;
    };
  }
}

export {};
