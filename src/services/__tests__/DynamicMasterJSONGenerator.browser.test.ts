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

describe('DynamicMasterJSONGenerator (browser)', () => {
    const originalWindow: any = (global as any).window;

    beforeEach(() => {
        // Simular ambiente de browser
        (global as any).window = originalWindow || ({} as any);
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('não tenta importar fs no browser e apenas avisa ao receber outputPath', async () => {
        const mod = await import('@/services/DynamicMasterJSONGenerator');
        const gen = mod.DynamicMasterJSONGenerator.getInstance();

        // Espionar internamente generateMasterJSON para um retorno mínimo
        const masterSpy = vi
            .spyOn(gen as any, 'generateMasterJSON')
            .mockResolvedValueOnce({ steps: {}, components: {}, metadata: {}, templateVersion: 'x', globalConfig: {} });

        const warnSpy = vi.spyOn(console, 'warn');

        const json = await gen.generateAndSaveJSON('funnel-x', '/tmp/out.json');
        expect(typeof json).toBe('string');
        expect(masterSpy).toHaveBeenCalled();
        // Deve avisar que não irá salvar no browser
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('generateAndSaveJSON: Ignorando writeFile no browser')
        );
    });
});
