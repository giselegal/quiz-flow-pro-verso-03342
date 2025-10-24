import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dataService } from '@/services/canonical/DataService';
import { participantDataService } from '@/services/canonical/data/ParticipantDataService';

describe('DataService → ParticipantDataService delegation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('delegates createParticipant', async () => {
    const fake = {
      id: 'p1',
      sessionId: 's1',
      email: 'a@b.com',
      name: 'A',
      ipAddress: '127.0.0.1',
      userAgent: 'test',
      createdAt: new Date(),
    };
    const spy = vi.spyOn(participantDataService, 'createParticipant').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.createParticipant({ email: 'a@b.com' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.id).toBe('p1');
  });

  it('delegates getParticipantBySession', async () => {
    const fake = {
      id: 'p2',
      sessionId: 's2',
      createdAt: new Date(),
    } as any;
    const spy = vi.spyOn(participantDataService, 'getParticipantBySession').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.getParticipantBySession('s2');
    expect(spy).toHaveBeenCalledWith('s2');
    expect(res.success).toBe(true);
    if (res.success && res.data) expect(res.data.sessionId).toBe('s2');
  });

  it('delegates listParticipants', async () => {
    const fake = [{ id: 'p3', sessionId: 's3', createdAt: new Date() } as any];
    const spy = vi.spyOn(participantDataService, 'listParticipants').mockResolvedValue({ success: true, data: fake });
    const res = await dataService.listParticipants({ email: 'x' });
    expect(spy).toHaveBeenCalled();
    expect(res.success).toBe(true);
    if (res.success) expect(res.data.length).toBe(1);
  });
});
