import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { resultDataService } from '@/services/canonical/data/ResultDataService';

describe('DataService → ResultDataService delegation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delegates saveQuizResult', async () => {
    const fake = {
      id: 'r1', sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 10, maxScore: 100, percentage: 10, answers: [], completedAt: new Date(),
    };
    const spy = vi.spyOn(resultDataService, 'saveQuizResult').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.saveQuizResult({ sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 10, maxScore: 100, answers: [] });
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.id).toBe('r1');
  });

  it('delegates getQuizResult', async () => {
    const fake = { id: 'r2', sessionId: 's2', funnelId: 'f1', userId: 'u1', score: 20, maxScore: 100, percentage: 20, answers: [], completedAt: new Date() } as any;
    const spy = vi.spyOn(resultDataService, 'getQuizResult').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.getQuizResult('r2');
    expect(spy).toHaveBeenCalledWith('r2');
    expect(res.success).toBe(true);
    if (res.success && res.data) expect(res.data.id).toBe('r2');
  });

  it('delegates listQuizResults', async () => {
    const fake = [{ id: 'r3', sessionId: 's3', funnelId: 'f1', userId: 'u1', score: 30, maxScore: 100, percentage: 30, answers: [], completedAt: new Date() } as any];
    const spy = vi.spyOn(resultDataService, 'listQuizResults').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.listQuizResults({ funnelId: 'f1' });
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(1);
  });

  it('delegates deleteQuizResult', async () => {
    const spy = vi.spyOn(resultDataService, 'deleteQuizResult').mockResolvedValue({ success: true, data: undefined });
    const res = await dataService.deleteQuizResult('r4');
    expect(spy).toHaveBeenCalledWith('r4');
    expect(res.success).toBe(true);
  });
});
