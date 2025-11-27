/**
 * 🧪 Tests for FunnelConversionTracker and FunnelVisualization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useFunnelMetrics,
  recordFunnelComplete,
  type FunnelMetric,
} from '../FunnelConversionTracker';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('FunnelConversionTracker', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useFunnelMetrics hook', () => {
    it('should return empty metrics initially', () => {
      const { result } = renderHook(() => useFunnelMetrics());

      expect(result.current.metrics).toEqual([]);
    });

    it('should return 0 conversion rate when no metrics', () => {
      const { result } = renderHook(() => useFunnelMetrics());

      const rate = result.current.getConversionRate('test-funnel');
      expect(rate).toBe(0);
    });

    it('should return empty drop off data when no metrics', () => {
      const { result } = renderHook(() => useFunnelMetrics());

      const dropOffs = result.current.getDropOffByStep('test-funnel');
      expect(dropOffs).toEqual({});
    });

    it('should return empty average time data when no metrics', () => {
      const { result } = renderHook(() => useFunnelMetrics());

      const avgTimes = result.current.getAverageTimeByStep('test-funnel');
      expect(avgTimes).toEqual({});
    });

    it('should clear metrics correctly', () => {
      // Setup with some metrics
      const testMetrics: FunnelMetric[] = [
        {
          type: 'step_enter',
          stepId: 'step-01',
          stepIndex: 1,
          totalSteps: 21,
          timeSpent: 0,
          timestamp: new Date(),
          sessionId: 'test-session',
          funnelId: 'test-funnel',
        },
      ];
      localStorageMock.setItem('funnel_conversion_metrics', JSON.stringify(testMetrics));

      const { result } = renderHook(() => useFunnelMetrics());

      act(() => {
        result.current.clearMetrics();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('funnel_conversion_metrics');
    });

    it('should filter metrics by funnel ID', () => {
      const testMetrics: FunnelMetric[] = [
        {
          type: 'step_enter',
          stepId: 'step-01',
          stepIndex: 1,
          totalSteps: 21,
          timeSpent: 0,
          timestamp: new Date(),
          sessionId: 'test-session',
          funnelId: 'funnel-a',
        },
        {
          type: 'step_enter',
          stepId: 'step-01',
          stepIndex: 1,
          totalSteps: 21,
          timeSpent: 0,
          timestamp: new Date(),
          sessionId: 'test-session',
          funnelId: 'funnel-b',
        },
      ];
      localStorageMock.setItem('funnel_conversion_metrics', JSON.stringify(testMetrics));

      const { result } = renderHook(() => useFunnelMetrics());

      const funnelAMetrics = result.current.getMetricsByFunnel('funnel-a');
      expect(funnelAMetrics).toHaveLength(1);
      expect(funnelAMetrics[0].funnelId).toBe('funnel-a');
    });
  });

  describe('recordFunnelComplete', () => {
    it('should add a funnel_complete metric to storage', () => {
      recordFunnelComplete('test-funnel', 21, { source: 'test' });

      expect(localStorageMock.setItem).toHaveBeenCalled();
      const savedData = localStorageMock.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].type).toBe('funnel_complete');
      expect(parsed[0].funnelId).toBe('test-funnel');
      expect(parsed[0].totalSteps).toBe(21);
      expect(parsed[0].metadata.source).toBe('test');
    });
  });
});

describe('Funnel Metrics Calculation', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  it('should calculate conversion rate correctly', () => {
    const metrics: FunnelMetric[] = [
      // 10 users start
      ...Array.from({ length: 10 }, (_, i) => ({
        type: 'step_enter' as const,
        stepId: 'step-01',
        stepIndex: 1,
        totalSteps: 21,
        timeSpent: 0,
        timestamp: new Date(),
        sessionId: `session-${i}`,
        funnelId: 'test-funnel',
      })),
      // 3 users complete
      ...Array.from({ length: 3 }, (_, i) => ({
        type: 'funnel_complete' as const,
        stepId: 'step-21',
        stepIndex: 21,
        totalSteps: 21,
        timeSpent: 0,
        timestamp: new Date(),
        sessionId: `session-${i}`,
        funnelId: 'test-funnel',
      })),
    ];

    localStorageMock.setItem('funnel_conversion_metrics', JSON.stringify(metrics));

    const { result } = renderHook(() => useFunnelMetrics());
    const rate = result.current.getConversionRate('test-funnel');

    expect(rate).toBe(30); // 3/10 = 30%
  });

  it('should calculate drop off by step', () => {
    const metrics: FunnelMetric[] = [
      // Step 1: 10 entries, 8 completions
      ...Array.from({ length: 10 }, (_, i) => ({
        type: 'step_enter' as const,
        stepId: 'step-01',
        stepIndex: 1,
        totalSteps: 21,
        timeSpent: 0,
        timestamp: new Date(),
        sessionId: `session-${i}`,
        funnelId: 'test-funnel',
      })),
      ...Array.from({ length: 8 }, (_, i) => ({
        type: 'step_complete' as const,
        stepId: 'step-01',
        stepIndex: 1,
        totalSteps: 21,
        timeSpent: 30,
        timestamp: new Date(),
        sessionId: `session-${i}`,
        funnelId: 'test-funnel',
      })),
    ];

    localStorageMock.setItem('funnel_conversion_metrics', JSON.stringify(metrics));

    const { result } = renderHook(() => useFunnelMetrics());
    const dropOffs = result.current.getDropOffByStep('test-funnel');

    expect(dropOffs['step-01']).toBe(20); // 2/10 = 20% drop off
  });

  it('should calculate average time by step', () => {
    const metrics: FunnelMetric[] = [
      {
        type: 'step_complete',
        stepId: 'step-01',
        stepIndex: 1,
        totalSteps: 21,
        timeSpent: 30,
        timestamp: new Date(),
        sessionId: 'session-1',
        funnelId: 'test-funnel',
      },
      {
        type: 'step_complete',
        stepId: 'step-01',
        stepIndex: 1,
        totalSteps: 21,
        timeSpent: 60,
        timestamp: new Date(),
        sessionId: 'session-2',
        funnelId: 'test-funnel',
      },
    ];

    localStorageMock.setItem('funnel_conversion_metrics', JSON.stringify(metrics));

    const { result } = renderHook(() => useFunnelMetrics());
    const avgTimes = result.current.getAverageTimeByStep('test-funnel');

    expect(avgTimes['step-01']).toBe(45); // (30 + 60) / 2 = 45 seconds
  });
});
