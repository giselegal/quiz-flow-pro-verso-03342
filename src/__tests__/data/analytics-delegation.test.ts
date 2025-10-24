import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { analyticsDataService } from '@/services/canonical/data/AnalyticsDataService';

describe('DataService → AnalyticsDataService delegation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delegates getDashboardMetrics', async () => {
    const fake = { activeUsersNow: 1, totalSessions: 10, conversionRate: 20, totalRevenue: 100, averageSessionDuration: 30, bounceRate: 40 };
    const spy = vi.spyOn(analyticsDataService, 'getDashboardMetrics').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.analytics.getDashboardMetrics();
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.totalSessions).toBe(10);
  });
});
