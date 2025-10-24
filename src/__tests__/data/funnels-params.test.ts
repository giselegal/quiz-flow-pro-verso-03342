import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { funnelDataService } from '@/services/canonical/data/FunnelDataService';

describe('DataService.listFunnels parameter forwarding', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('forwards filters and pagination to FunnelDataService', async () => {
    const filters = { search: 'quiz', category: 'marketing', isPublished: true } as any;
    const pagination = { limit: 25, offset: 50, sortBy: 'createdAt', sortOrder: 'asc' } as any;
    const spy = vi.spyOn(funnelDataService, 'listFunnels').mockResolvedValue({ success: true, data: [] });
    const res = await dataService.listFunnels(filters, pagination);
    expect(spy).toHaveBeenCalledWith(filters, pagination);
    expect(res.success).toBe(true);
  });
});
