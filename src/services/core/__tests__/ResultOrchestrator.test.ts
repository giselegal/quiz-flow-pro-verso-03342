import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResultOrchestrator } from '../ResultOrchestrator';
import * as StorageMod from '../StorageService';
import * as SupaMod from '@/services/quizSupabaseService';

describe('ResultOrchestrator', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('persiste localmente e não tenta remoto quando sessionId não é UUID', async () => {
    const spySet = vi.spyOn(StorageMod.StorageService, 'safeSetJSON').mockReturnValue(true);
    const spySave = vi.spyOn(SupaMod.quizSupabaseService, 'saveQuizResult');

    const r = await ResultOrchestrator.run({
      selectionsByQuestion: { q1: ['natural_a', 'sexy_b'] },
      userName: 'Ana',
      persistToSupabase: true,
      sessionId: 'session_local_123',
    });

    expect(spySet).toHaveBeenCalled();
    expect(r.total).toBeGreaterThan(0);
    expect(spySave).not.toHaveBeenCalled();
  });

  it('chama Supabase quando sessionId é UUID', async () => {
    const spySet = vi.spyOn(StorageMod.StorageService, 'safeSetJSON').mockReturnValue(true);
    const spySave = vi
      .spyOn(SupaMod.quizSupabaseService, 'saveQuizResult')
      .mockResolvedValue('result-uuid-1');

    const r = await ResultOrchestrator.run({
      selectionsByQuestion: { q1: ['natural_a'] },
      userName: 'Ana',
      persistToSupabase: true,
      sessionId: '3d6f0a60-9c7a-4b57-9a4b-6d4b9c9d2b9a',
    });

    expect(spySet).toHaveBeenCalled();
    expect(r.resultId).toBe('result-uuid-1');
    expect(spySave).toHaveBeenCalledOnce();
  });
});
