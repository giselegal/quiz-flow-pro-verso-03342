import { describe, it, expect, beforeEach } from 'vitest';
import { getSupabaseClient, resetSupabaseLazyCache } from '@/integrations/supabase/supabaseLazy';

// Helper para manipular env de forma controlada
function withEnv(vars: Record<string, string | undefined>, fn: () => Promise<void>) {
    const original: any = (import.meta as any).env;
    const backup: Record<string, any> = { ...original };
    Object.entries(vars).forEach(([k, v]) => { (original as any)[k] = v; });
    return fn().finally(() => {
        Object.keys(vars).forEach(k => { (original as any)[k] = backup[k]; });
    });
}

describe('supabaseLazy', () => {
    beforeEach(() => {
        resetSupabaseLazyCache();
    });

    it('retorna mock quando variáveis ausentes', async () => {
        await withEnv({ VITE_SUPABASE_URL: undefined, VITE_SUPABASE_ANON_KEY: undefined }, async () => {
            const client = await getSupabaseClient({ mockOnMissingEnv: true });
            // auth.getSession deve existir e retornar session null
            const session = await client.auth.getSession();
            expect(session?.data?.session).toBeNull();
        });
    });

    it('cacheia instância em chamadas subsequentes', async () => {
        await withEnv({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon' }, async () => {
            const c1 = await getSupabaseClient();
            const c2 = await getSupabaseClient();
            expect(c1).toBe(c2);
        });
    });

    it('force: true recria instância', async () => {
        await withEnv({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon' }, async () => {
            const c1 = await getSupabaseClient();
            const c2 = await getSupabaseClient({ force: true });
            expect(c1).not.toBe(c2);
        });
    });

    it('bloqueia em SSR quando allowOnServer=false (retorna mock)', async () => {
        const originalWindow = (globalThis as any).window;
        // Remover window para simular SSR
        // @ts-ignore
        delete (globalThis as any).window;
        try {
            await withEnv({ VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon' }, async () => {
                const client = await getSupabaseClient({ allowOnServer: false, mockOnMissingEnv: true });
                const session = await client.auth.getSession();
                expect(session?.data?.session).toBeNull();
            });
        } finally {
            (globalThis as any).window = originalWindow;
        }
    });
});
