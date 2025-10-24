import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { CanonicalServicesMonitor } from '@/services/canonical/monitoring';
import { funnelDataService } from '@/services/canonical/data/FunnelDataService';
import { resultDataService } from '@/services/canonical/data/ResultDataService';

describe('DataService usage monitoring', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('tracks usage for listFunnels()', async () => {
    const spyTrack = vi.spyOn(CanonicalServicesMonitor, 'trackUsage');
    vi.spyOn(funnelDataService, 'listFunnels').mockResolvedValue({ success: true, data: [] });
    await dataService.listFunnels({ search: 'X' }, { limit: 1 });
    expect(spyTrack).toHaveBeenCalledWith('DataService', 'listFunnels');
  });

  it('tracks usage for listQuizResults()', async () => {
    const spyTrack = vi.spyOn(CanonicalServicesMonitor, 'trackUsage');
    vi.spyOn(resultDataService, 'listQuizResults').mockResolvedValue({ success: true, data: [] });
    await dataService.listQuizResults({ funnelId: 'f1' });
    expect(spyTrack).toHaveBeenCalledWith('DataService', 'listQuizResults');
  });
});
