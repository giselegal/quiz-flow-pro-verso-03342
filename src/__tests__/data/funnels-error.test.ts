import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { funnelDataService } from '@/services/canonical/data/FunnelDataService';
import { supabase } from '@/services/integrations/supabase/customClient';

describe('FunnelDataService error handling', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('returns error when getFunnel fails', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
    const eq = vi.fn().mockReturnValue({ single });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    vi.spyOn(supabase, 'from').mockImplementation(from as any);

    const res = await funnelDataService.getFunnel('f404');
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.message).toContain('Funnel not found');
  });

  it('returns error when deleteFunnel fails', async () => {
    const deleteFn = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: { message: 'db error' } }) });
    const from = vi.fn().mockReturnValue({ delete: deleteFn });
    vi.spyOn(supabase, 'from').mockImplementation(from as any);

    const res = await funnelDataService.deleteFunnel('f1');
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.message).toContain('Failed to delete funnel');
  });
});
