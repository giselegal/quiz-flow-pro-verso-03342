import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventTracker } from '@/analytics/UnifiedEventTracker';
import { getSupabase } from '@/supabase/config';

vi.mock('@/supabase/config', () => {
    return {
        getSupabase: () => ({ from: () => ({ insert: () => Promise.resolve({ error: new Error('fail') }) }) })
    };
});

describe('Rollback / Auto-disable analytics', () => {
    let tracker: EventTracker;
    beforeEach(() => {
        tracker = new EventTracker();
        // Força ativo
        // @ts-ignore
        tracker._setFeatureEnabledForTests(true);
    });

    it('desativa após taxa de falha alta', async () => {
        for (let i = 0; i < 12; i++) {
            tracker.track({ type: 'editor_action', sessionId: 's' + i, funnelId: 'f1' });
        }
        // força flush com falha
        await tracker.flush({ force: true });
        const stats = tracker.getFlushFailureStats();
        expect(stats.failed).toBeGreaterThan(0);
        const disabled = tracker.evaluateAutoDisable(10); // threshold baixo para teste
        expect(disabled).toBe(true);
        // tentativa de rastrear não deve aumentar buffer
        const sizeBefore = tracker.getBufferSize();
        tracker.track({ type: 'editor_action', sessionId: 'sx', funnelId: 'f1' });
        expect(tracker.getBufferSize()).toBe(sizeBefore);
    });
});
