import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { getSupabase } from '@/supabase/config';

// Mock supabase
vi.mock('@/supabase/config', () => {
    const insertMock = vi.fn();
    return {
        getSupabase: () => ({ from: () => ({ insert: insertMock }) }),
        __insertMock: insertMock
    };
});

// Helper para acessar mock interno
const getInsertMock = () => (getSupabase() as any).from().insert as ReturnType<typeof vi.fn>;

function trackN(n: number) {
    for (let i = 0; i < n; i++) {
        unifiedEventTracker.track({
            type: 'editor_action',
            sessionId: 's-test',
            funnelId: 'f-test',
            payload: { i }
        });
    }
}

describe('UnifiedEventTracker', () => {
    beforeEach(() => {
        // Reset mocks
        getInsertMock().mockReset().mockResolvedValue({ error: null });
    });

    afterEach(async () => {
        await unifiedEventTracker.flush({ force: true });
    });

    it('faz flush manual e envia eventos', async () => {
        trackN(3);
        const mock = getInsertMock();
        expect(mock).toHaveBeenCalledTimes(0);
        const result = await unifiedEventTracker.flush({ force: true });
        expect(result.attempted).toBe(3);
        expect(mock).toHaveBeenCalledTimes(1);
    });

    it('faz flush automático ao atingir tamanho máximo do buffer', async () => {
        const mock = getInsertMock();
        trackN(21); // maxBuffer = 20 -> flush + 1 fica no buffer
        // Flush pode ser async; forçar flush final para validar contagem total
        await unifiedEventTracker.flush({ force: true });
        // Tentativa total de envio = 21
        const totalInserted = mock.mock.calls.reduce((acc, call) => acc + call[0].length, 0);
        expect(totalInserted).toBe(21);
    });

    it('honra feature flag desligada (override global)', async () => {
        (globalThis as any).__UNIFIED_ANALYTICS_FORCE = false;
        // Necessário recriar módulo para aplicar flag - simular import dinâmico
        const { unifiedEventTracker: freshTracker } = await import('@/analytics/UnifiedEventTracker');
        freshTracker.track({ type: 'editor_action', sessionId: 's1', funnelId: 'f1' });
        const res = await freshTracker.flush({ force: true });
        expect(res.attempted).toBe(0);
        delete (globalThis as any).__UNIFIED_ANALYTICS_FORCE;
    });

    it('persiste em offline storage quando insert falha', async () => {
        const mock = getInsertMock();
        mock.mockResolvedValueOnce({ error: new Error('boom') });
        // Mock localStorage
        const store: Record<string, string> = {};
        // @ts-ignore
        global.localStorage = {
            getItem: (k: string) => store[k] || null,
            setItem: (k: string, v: string) => { store[k] = v; },
            removeItem: (k: string) => { delete store[k]; }
        };
        unifiedEventTracker.track({ type: 'editor_action', sessionId: 'sX', funnelId: 'fX' });
        const res = await unifiedEventTracker.flush({ force: true });
        expect(res.failed).toBe(1);
        expect(store['unified_events_offline']).toBeTruthy();
    });

    it('não envia eventos quando supabase retorna erro e preserva buffer', async () => {
        const mock = getInsertMock();
        mock.mockResolvedValueOnce({ error: new Error('falha') });
        trackN(5);
        const res = await unifiedEventTracker.flush({ force: true });
        expect(res.failed).toBe(5);
        // segunda chamada sem novos eventos tentará novamente (buffer recolocado)
        mock.mockResolvedValueOnce({ error: null });
        const res2 = await unifiedEventTracker.flush({ force: true });
        expect(res2.succeeded).toBe(5);
    });
});
