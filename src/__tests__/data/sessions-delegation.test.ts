import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { sessionDataService } from '@/services/canonical/data/SessionDataService';

describe('DataService → SessionDataService delegation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delegates createSession', async () => {
    const fake = {
      id: 's1',
      funnelId: 'f1',
      userId: 'u1',
      status: 'started',
      currentStep: 0,
      totalSteps: 21,
      score: 0,
      maxScore: 100,
      startedAt: new Date(),
      lastActivity: new Date(),
    } as any;
    const spy = vi.spyOn(sessionDataService, 'createSession').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.createSession({ funnelId: 'f1', quizUserId: 'u1' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.id).toBe('s1');
  });

  it('delegates updateSession', async () => {
    const spy = vi.spyOn(sessionDataService, 'updateSession').mockResolvedValue({ success: true, data: undefined });
    const res = await dataService.updateSession('s1', { currentStep: 2 });
    expect(spy).toHaveBeenCalledWith('s1', { currentStep: 2 });
    expect(res.success).toBe(true);
  });

  it('delegates getSession', async () => {
    const fake = { id: 's2', funnelId: 'f1', userId: 'u1', status: 'started', currentStep: 0, totalSteps: 21, score: 0, maxScore: 100, startedAt: new Date(), lastActivity: new Date() } as any;
    const spy = vi.spyOn(sessionDataService, 'getSession').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.getSession('s2');
    expect(spy).toHaveBeenCalledWith('s2');
    expect(res.success).toBe(true);
    if (res.success && res.data) expect(res.data.id).toBe('s2');
  });
});
