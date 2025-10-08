import { describe, it, expect, beforeEach } from 'vitest';
import { analyticsService } from '@/services/AnalyticsService';

// Simples polyfill localStorage para ambiente de teste jsdom caso necessário
const g: any = globalThis;
if (!g.localStorage) {
    const store: Record<string, string> = {};
    g.localStorage = {
        getItem: (k: string) => store[k] || null,
        setItem: (k: string, v: string) => { store[k] = v; },
        removeItem: (k: string) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    };
}

describe('AnalyticsService persistence', () => {
    beforeEach(() => {
        analyticsService.flushStorage();
    });

    it('persiste métricas e eventos em localStorage', async () => {
        await analyticsService.recordMetric('render_time', 12, 'ms', 'performance');
        await analyticsService.recordEvent('editor_action', 'user1', 'funnelX', { action: 'add_block' });

        const snapshot1 = JSON.parse(localStorage.getItem('analytics.v1') || '{}');
        expect(snapshot1.events?.length).toBeGreaterThan(0);
        expect(snapshot1.metrics?.length).toBeGreaterThan(0);
    });

    it('executa prune quando excede limite de eventos', async () => {
        for (let i = 0; i < 250; i++) {
            await analyticsService.recordEvent('evt_' + i, 'u', 'f', {});
        }
        const stored = JSON.parse(localStorage.getItem('analytics.v1') || '{}');
        expect(stored.events.length).toBeLessThanOrEqual(200);
    });
});
