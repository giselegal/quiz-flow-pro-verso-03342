import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { unifiedEventTracker, EventTracker } from '@/analytics/UnifiedEventTracker';
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
        // Reset mocks e estado do tracker
        getInsertMock().mockReset().mockResolvedValue({ error: null });
        // @ts-ignore
        unifiedEventTracker._clearBufferForTests?.();
        // Garante feature flag ligada por padrão
        // @ts-ignore
        unifiedEventTracker._setFeatureEnabledForTests?.(true);
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
        trackN(20); // deve disparar flush
        // aguarda microtask do flush async
        await new Promise(r => setTimeout(r, 10));
        expect(mock).toHaveBeenCalledTimes(1);
        const insertedFirst = mock.mock.calls[0][0].length;
        expect(insertedFirst).toBe(20);
        unifiedEventTracker.track({ type: 'editor_action', sessionId: 's-test', funnelId: 'f-test' });
        await unifiedEventTracker.flush({ force: true });
        const total = mock.mock.calls.reduce((acc, c) => acc + c[0].length, 0);
        expect(total).toBe(21);
    });

    it('honra feature flag desligada (override global via instancia fresca)', async () => {
        (globalThis as any).__UNIFIED_ANALYTICS_FORCE = false;
        const fresh = new EventTracker();
        fresh.track({ type: 'editor_action', sessionId: 's1', funnelId: 'f1' });
        const res = await fresh.flush({ force: true });
        expect(res.attempted).toBe(0);
        delete (globalThis as any).__UNIFIED_ANALYTICS_FORCE;
    });

    it('persiste em offline storage quando insert falha', async () => {
        const mock = getInsertMock();
        mock.mockResolvedValueOnce({ error: new Error('boom') });
        // Mock localStorage
        const store: Record<string, string> = {};
        Object.defineProperty(global, 'localStorage', {
            configurable: true,
            value: {
                getItem: (k: string) => store[k] || null,
                setItem: (k: string, v: string) => { store[k] = v; },
                removeItem: (k: string) => { delete store[k]; }
            }
        });
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

    it('recupera eventos offline armazenados após falha anterior', async () => {
        const mock = getInsertMock();
        // Simula falha inicial para persistir offline
        mock.mockResolvedValueOnce({ error: new Error('falha persist') });
        const store: Record<string, string> = {};
        Object.defineProperty(global, 'localStorage', {
            configurable: true,
            value: {
                getItem: (k: string) => store[k] || null,
                setItem: (k: string, v: string) => { store[k] = v; },
                removeItem: (k: string) => { delete store[k]; }
            }
        });
        unifiedEventTracker.track({ type: 'editor_action', sessionId: 'sess1', funnelId: 'fun1' });
        const first = await unifiedEventTracker.flush({ force: true });
        expect(first.failed).toBe(1);
        expect(store['unified_events_offline']).toBeTruthy();

        // Agora simula reload manual chamando método interno e sucesso no insert
        mock.mockResolvedValueOnce({ error: null });
        // @ts-ignore acesso interno
        unifiedEventTracker._recoverOfflineForTests();
        const second = await unifiedEventTracker.flush({ force: true });
        // Evento original + replay do buffer que permaneceu em memória (pode resultar em duplicação intencional de tentativa)
        expect(second.succeeded).toBeGreaterThanOrEqual(1);
        expect(store['unified_events_offline']).toBeUndefined();
    });

    it('permite override de feature flag via método interno', async () => {
        // Força desligar
        // @ts-ignore
        unifiedEventTracker._setFeatureEnabledForTests(false);
        unifiedEventTracker.track({ type: 'editor_action', sessionId: 's2', funnelId: 'f2' });
        const res = await unifiedEventTracker.flush({ force: true });
        expect(res.attempted).toBe(0);
        // Reativa para não impactar outros testes
        // @ts-ignore
        unifiedEventTracker._setFeatureEnabledForTests(true);
    });
});
