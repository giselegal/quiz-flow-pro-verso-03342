import { describe, it, expect, beforeEach, vi } from 'vitest';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';
import { getSupabase } from '@/supabase/config';

// Mock supabase
vi.mock('@/supabase/config', () => {
    const terminalPromise = () => Promise.resolve({ data: [], error: null });
    const chain: any = {
        select: vi.fn(() => chain),
        eq: vi.fn(() => chain),
        gte: vi.fn(() => chain),
        in: vi.fn(() => chain),
        not: vi.fn(() => chain),
        order: vi.fn(() => chain)
    };
    const fromMock = vi.fn(() => chain);
    return {
        getSupabase: () => ({ from: fromMock }),
        __chain: chain
    };
});

const getChain = () => (getSupabase() as any).from();

function buildRows(rows: any[]) {
    return rows.map(r => ({
        session_id: r.session_id,
        event_type: r.event_type,
        occurred_at: r.occurred_at || new Date().toISOString(),
        payload: r.payload || null,
        step_id: r.step_id || null,
        device: r.device || null
    }));
}

describe('UnifiedAnalyticsEngine', () => {
        beforeEach(() => {
            const c = getChain();
            c.select.mockReset();
            c.eq.mockReset();
            c.gte.mockReset();
            c.in.mockReset();
            c.not.mockReset();
            c.order.mockReset();
        });

    it('calcula FunnelSummary básico', async () => {
        const now = Date.now();
        const rows = buildRows([
            { session_id: 's1', event_type: 'session_start', occurred_at: new Date(now - 5000).toISOString() },
            { session_id: 's1', event_type: 'quiz_completed', occurred_at: new Date(now - 1000).toISOString() },
            { session_id: 's2', event_type: 'session_start', occurred_at: new Date(now - 4000).toISOString() }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ gte: () => Promise.resolve({ data: rows, error: null }) })
            });
        const summary = await unifiedAnalyticsEngine.getFunnelSummary('f1', '24h');
        expect(summary.totalSessions).toBe(2);
        expect(summary.completedSessions).toBe(1);
        expect(summary.activeSessions).toBe(1);
        expect(summary.conversionRate).toBeCloseTo(50);
    });

    it('gera snapshot realtime', async () => {
        const now = Date.now();
        const rows = buildRows([
            { session_id: 's1', event_type: 'step_viewed', step_id: 'step1', occurred_at: new Date(now - 4000).toISOString() },
            { session_id: 's1', event_type: 'question_answered', step_id: 'step1', occurred_at: new Date(now - 3000).toISOString(), payload: { answer: 'A' } },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'step1', occurred_at: new Date(now - 2000).toISOString() },
            { session_id: 's2', event_type: 'quiz_completed', occurred_at: new Date(now - 1000).toISOString() }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ gte: () => Promise.resolve({ data: rows, error: null }) })
            });
        const snap = await unifiedAnalyticsEngine.getRealtimeSnapshot('f1');
        expect(snap.activeUsers).toBe(2);
        expect(snap.recentCompletions).toBe(1);
        expect(snap.recentEvents).toBe(rows.length);
        expect(snap.avgStepTimeSec).toBeGreaterThanOrEqual(0);
    });

    it('calcula dropoff por step', async () => {
        const now = Date.now();
        const rows = buildRows([
            { session_id: 's1', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 8000).toISOString() },
            { session_id: 's1', event_type: 'question_answered', step_id: 'A', occurred_at: new Date(now - 7000).toISOString() },
            { session_id: 's1', event_type: 'step_viewed', step_id: 'B', occurred_at: new Date(now - 6000).toISOString() },
            { session_id: 's1', event_type: 'quiz_completed', occurred_at: new Date(now - 5000).toISOString() },
            { session_id: 's2', event_type: 'step_viewed', step_id: 'A', occurred_at: new Date(now - 4000).toISOString() },
            { session_id: 's2', event_type: 'question_answered', step_id: 'A', occurred_at: new Date(now - 3000).toISOString() }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ gte: () => ({ not: () => Promise.resolve({ data: rows, error: null }) }) })
            });
        const drop = await unifiedAnalyticsEngine.getStepDropoff('f1', '24h');
        const stepA = drop.find(d => d.stepId === 'A');
        const stepB = drop.find(d => d.stepId === 'B');
        expect(stepA?.entrances).toBe(2);
        expect(stepB?.entrances).toBe(1);
    });

    it('distribuição de estilos a partir de payload', async () => {
        const rows = buildRows([
            { session_id: 's1', event_type: 'quiz_completed', payload: { style: 'alpha' } },
            { session_id: 's2', event_type: 'conversion', payload: { styleCategory: 'beta' } },
            { session_id: 's3', event_type: 'quiz_completed', payload: { style_result: 'alpha' } }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ gte: () => ({ in: () => Promise.resolve({ data: rows, error: null }) }) })
            });
        const styles = await unifiedAnalyticsEngine.getStyleDistribution('f1', '24h');
        const alpha = styles.find(s => s.style === 'alpha');
        expect(alpha?.count).toBe(2);
        expect(styles.reduce((a, b) => a + b.count, 0)).toBe(3);
    });

    it('device breakdown soma corretamente', async () => {
        const rows = buildRows([
            { session_id: 's1', event_type: 'session_start', device: { type: 'desktop' } },
            { session_id: 's2', event_type: 'session_start', device: { type: 'mobile' } },
            { session_id: 's3', event_type: 'session_start', device: { type: 'tablet' } },
            { session_id: 's4', event_type: 'session_start', device: { type: 'mobile' } }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ gte: () => ({ not: () => Promise.resolve({ data: rows, error: null }) }) })
            });
        const devices = await unifiedAnalyticsEngine.getDeviceBreakdown('f1', '24h');
        expect(devices.desktop).toBe(1);
        expect(devices.mobile).toBe(2);
        expect(devices.tablet).toBe(1);
    });

    it('answer distribution agrega respostas', async () => {
        const rows = buildRows([
            { session_id: 's1', event_type: 'question_answered', step_id: 'Q1', payload: { answer: 'A' } },
            { session_id: 's2', event_type: 'question_answered', step_id: 'Q1', payload: { answer: 'B' } },
            { session_id: 's3', event_type: 'question_answered', step_id: 'Q1', payload: { answer: 'A' } }
        ]);
            getChain().select.mockReturnValueOnce({
                eq: () => ({ eq: () => ({ gte: () => Promise.resolve({ data: rows, error: null }) }) })
            });
        const dist = await unifiedAnalyticsEngine.getAnswerDistribution('f1', 'Q1', '24h');
        const optA = dist.options.find(o => o.value === 'A');
        expect(optA?.count).toBe(2);
        expect(dist.total).toBe(3);
    });
});
