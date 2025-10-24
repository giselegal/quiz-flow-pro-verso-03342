import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { sessionDataService } from '@/services/canonical/data/SessionDataService';
import { participantDataService } from '@/services/canonical/data/ParticipantDataService';
import { resultDataService } from '@/services/canonical/data/ResultDataService';

/**
 * E2E flow (mocked via spies):
 * - Create session → Create participant → Save result
 * - Ensures DataService wiring composes correctly across subservices.
 */

describe('Canonical E2E flow (mocked)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates session, participant, and saves result', async () => {
    const session = { id: 's1', funnelId: 'f1', userId: 'u1', status: 'started', currentStep: 0, totalSteps: 21, score: 0, maxScore: 100, startedAt: new Date(), lastActivity: new Date() } as any;
    const participant = { id: 'p1', sessionId: 's1', createdAt: new Date() } as any;
    const result = { id: 'r1', sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 10, maxScore: 100, percentage: 10, answers: [], completedAt: new Date() } as any;

    const sSpy = vi.spyOn(sessionDataService, 'createSession').mockResolvedValue({ success: true, data: session });
    const pSpy = vi.spyOn(participantDataService, 'createParticipant').mockResolvedValue({ success: true, data: participant });
    const rSpy = vi.spyOn(resultDataService, 'saveQuizResult').mockResolvedValue({ success: true, data: result });

    const sRes = await dataService.sessions.create({ funnelId: 'f1', quizUserId: 'u1' });
    expect(sSpy).toHaveBeenCalled();
    expect(sRes.success).toBe(true);

    const pRes = await dataService.participants.create({ sessionId: 's1' });
    expect(pSpy).toHaveBeenCalledWith({ sessionId: 's1' });
    expect(pRes.success).toBe(true);

    const rRes = await dataService.results.create({ sessionId: 's1', funnelId: 'f1', userId: 'u1', score: 10, maxScore: 100, answers: [] });
    expect(rSpy).toHaveBeenCalled();
    expect(rRes.success).toBe(true);
  });
});
