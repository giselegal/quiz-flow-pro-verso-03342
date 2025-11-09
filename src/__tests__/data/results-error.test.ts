import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resultDataService } from '@/services/canonical/data/ResultDataService';
import { supabase } from '@/services/integrations/supabase/customClient';

describe('ResultDataService error handling', () => {
  beforeEach(() => { vi.restoreAllMocks(); vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('returns error when saveQuizResult fails to insert', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: 'boom' } });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });
    vi.spyOn(supabase, 'from').mockImplementation(from as any);

    const res = await resultDataService.saveQuizResult({ sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 1, maxScore: 10, answers: [] });
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.message).toContain('Failed to create result');
  });
});
