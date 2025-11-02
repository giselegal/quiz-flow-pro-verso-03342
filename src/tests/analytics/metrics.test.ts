import { describe, it, expect } from 'vitest';
import { computeAverageSessionDuration, computeBounceRate } from '@/services/canonical/data/AnalyticsDataService';

describe('Analytics metrics helpers', () => {
  it('computeAverageSessionDuration: returns 0 for empty or invalid sessions', () => {
    expect(computeAverageSessionDuration([])).toBe(0);
    expect(computeAverageSessionDuration([{ started_at: null, ended_at: null }])).toBe(0);
  });

  it('computeAverageSessionDuration: computes mean duration in seconds', () => {
    const sessions = [
      { id: 's1', started_at: '2025-11-02T10:00:00.000Z', ended_at: '2025-11-02T10:05:00.000Z' }, // 300s
      { id: 's2', started_at: '2025-11-02T11:00:00.000Z', ended_at: '2025-11-02T11:03:20.000Z' }, // 200s
    ];
    expect(computeAverageSessionDuration(sessions)).toBeCloseTo(250, 5);
  });

  it('computeBounceRate: returns 0 for no sessions', () => {
    expect(computeBounceRate([], [])).toBe(0);
  });

  it('computeBounceRate: counts sessions with 0 or 1 event as bounce', () => {
    const sessions = [
      { id: 'a' },
      { id: 'b' },
      { id: 'c' },
      { id: 'd' },
    ];
    const analyticsToday = [
      { session_id: 'a' }, // 1 event (bounce)
      { session_id: 'b' },
      { session_id: 'b' }, // 2 events (not bounce)
      // 'c' has 0 events (bounce)
      { session_id: 'd' },
      { session_id: 'd' },
      { session_id: 'd' }, // 3 events (not bounce)
    ];
    const bounce = computeBounceRate(sessions, analyticsToday);
    // bounces: a, c => 2/4 = 0.5 => 50%
    expect(bounce).toBeCloseTo(50, 5);
  });
});
