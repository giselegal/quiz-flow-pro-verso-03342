import { describe, it, expect, vi, beforeEach } from 'vitest';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';
import { getSupabase } from '@/supabase/config';

vi.mock('@/supabase/config', () => {
    const chain: any = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        gte: vi.fn(() => chain),
        order: vi.fn(() => chain)
    };
    const fromMock = vi.fn(() => chain);
    return { getSupabase: () => ({ from: fromMock }), __chain: chain };
});

const chain = (getSupabase() as any).from();

function rows(data: any[]) {
    chain.select.mockReturnValueOnce({
        eq: () => ({ gte: () => ({ order: () => Promise.resolve({ data, error: null }) }) })
    });
}

describe('Advanced Funnel Metrics', () => {
    beforeEach(() => {
        chain.select.mockReset();
        chain.eq.mockReset();
        chain.gte.mockReset();
        chain.order.mockReset();
    });

    it('calcula caminhos mais comuns', async () => {
        const now = Date.now();
        rows([
            { session_id: 's1', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 6000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 5000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'C', occurred_at: new Date(now - 4000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 3000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 2000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'C', occurred_at: new Date(now - 1000).toISOString() }
        ]);
        const common = await unifiedAnalyticsEngine.getCommonPaths('f1', '24h', 5);
        expect(common[0].sequence).toEqual(['A', 'B', 'C']);
        expect(common[0].count).toBe(2);
        expect(common[0].percentage).toBeCloseTo(100);
    });

    it('calcula abandono cumulativo', async () => {
        const now = Date.now();
        rows([
            { session_id: 's1', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 6000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 5000).toISOString() },
            { session_id: 's1', event_type: 'quiz_completed', occurred_at: new Date(now - 4000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 3000).toISOString() },
            { session_id: 's3', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 2000).toISOString() }
        ]);
        const abandonment = await unifiedAnalyticsEngine.getCumulativeAbandonment('f1', '24h');
        const stepA = abandonment.find(s => s.stepId === 'A');
        const stepB = abandonment.find(s => s.stepId === 'B');
        expect(stepA?.reached).toBe(3);
        expect(stepA && stepA.completedAfter).toBe(1);
        expect(stepB?.reached).toBe(1);
    });

    it('calcula tempos de transição entre steps', async () => {
        const now = Date.now();
        rows([
            { session_id: 's1', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 9000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 8000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'C', occurred_at: new Date(now - 7000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 6000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 5000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'C', occurred_at: new Date(now - 3000).toISOString() }
        ]);
        const transitions = await unifiedAnalyticsEngine.getStepTransitionTimes('f1', '24h');
        const ab = transitions.find(t => t.fromStep === 'A' && t.toStep === 'B');
        expect(ab?.samples).toBe(2);
        expect(ab && ab.avgTimeSec).toBeGreaterThanOrEqual(1); // 1 segundo ou mais
    });
});
