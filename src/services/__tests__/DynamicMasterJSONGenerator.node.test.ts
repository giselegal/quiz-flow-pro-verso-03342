import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock do ConfigurationAPI para evitar inicializar Supabase/IndexedDB
vi.mock('@/services/ConfigurationAPI', () => {
    class MockConfigurationAPI {
        static getInstance() {
            return new MockConfigurationAPI();
        }
        async getConfiguration() {
            return {};
        }
    }
    return { ConfigurationAPI: MockConfigurationAPI };
});

// Mock do módulo node:fs para capturar writeFileSync do import dinâmico
const writeSpy = vi.fn();
vi.mock('node:fs', () => ({ default: { writeFileSync: writeSpy }, writeFileSync: writeSpy }));

// Esses testes simulam ambiente Node: window indefinido

describe('DynamicMasterJSONGenerator (node-like)', () => {
    const originalWindow = global.window as any;

    beforeEach(() => {
        // Remover window para simular Node/SSR
        // @ts-ignore
        delete (global as any).window;
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        // Restaurar window após cada teste
        (global as any).window = originalWindow;
        vi.restoreAllMocks();
    });

    it('usa import dinâmico de node:fs e chama writeFileSync quando outputPath é fornecido', async () => {
        const mod = await import('@/services/DynamicMasterJSONGenerator');
        const gen = mod.DynamicMasterJSONGenerator.getInstance();

        // Espiar generateMasterJSON para retorno mínimo válido
        const masterSpy = vi
            .spyOn(gen as any, 'generateMasterJSON')
            .mockResolvedValueOnce({ steps: {}, components: {}, metadata: {}, templateVersion: 'x', globalConfig: {} });

        const out = await gen.generateAndSaveJSON('funnel-y', '/tmp/out.json');
        expect(typeof out).toBe('string');
        expect(masterSpy).toHaveBeenCalled();
        expect(writeSpy).toHaveBeenCalledWith('/tmp/out.json', expect.any(String));
    });
});
