import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

// Ensure common globals expected by components
if (typeof window !== 'undefined') {
  (window as any).__DISABLE_AUTO_SCROLL = (window as any).__DISABLE_AUTO_SCROLL ?? false;
  (window as any).__DISABLE_SCROLL_SYNC = (window as any).__DISABLE_SCROLL_SYNC ?? false;
  (window as any).__quizCurrentStep = (window as any).__quizCurrentStep ?? 'step-1';
}

// Basic cleanup between tests
afterEach(() => {
  vi.clearAllMocks();
  try {
    vi.useRealTimers();
  } catch {}
});

export {};
