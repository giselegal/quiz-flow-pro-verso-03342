import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { resultDataService } from '@/services/canonical/data/ResultDataService';

describe('DataService.listQuizResults parameter forwarding', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('forwards filters to ResultDataService', async () => {
    const filters = { funnelId: 'f1', userId: 'u1', minScore: 50, limit: 10, offset: 20 };
    const spy = vi.spyOn(resultDataService, 'listQuizResults').mockResolvedValue({ success: true, data: [] });
    const res = await dataService.listQuizResults(filters);
    expect(spy).toHaveBeenCalledWith(filters);
    expect(res.success).toBe(true);
  });
});
