import { describe, it, expect, vi, afterEach } from 'vitest';
import * as adapter from '../../../server/quiz-style/adapter';
import { getAdapterMetrics } from '../../../server/quiz-style/metrics';

// Testa comportamento do safeToTemplateDraft em modo fallback

describe('legacy adapter fallback', () => {
    const originalFlag = process.env.LEGACY_ADAPTER_FALLBACK;
    afterEach(() => {
        process.env.LEGACY_ADAPTER_FALLBACK = originalFlag;
        vi.restoreAllMocks();
    });

    it('retorna fallback quando load falha e flag ativa', async () => {
        process.env.LEGACY_ADAPTER_FALLBACK = 'true';
        vi.spyOn(adapter, 'toTemplateDraft').mockRejectedValue(new Error('Falha simulada'));
        // Mock secundário para retornar steps vazios sem quebrar
        vi.spyOn(adapter, 'loadLegacyStepsFromJson').mockResolvedValue({ steps: [], source: 'json-files', manifest: null, baseDir: '/tmp' } as any);
        const result = await adapter.safeToTemplateDraft({ slug: 'x' });
        expect(result.fallback).toBeDefined();
        expect(result.fallback.reason).toMatch(/Falha simulada/);
        const metrics = getAdapterMetrics();
        expect((metrics.fallbackCount || 0)).toBeGreaterThanOrEqual(1);
    });

    it('propaga erro quando flag desativada', async () => {
        process.env.LEGACY_ADAPTER_FALLBACK = 'false';
        // Importante: como toTemplateDraft referencia loadLegacyStepsFromJson internamente (mesmo módulo),
        // mockar apenas loadLegacyStepsFromJson não afeta a chamada interna. Portanto simulamos erro
        // diretamente em toTemplateDraft para validar que safeToTemplateDraft propaga quando fallback off.
        vi.spyOn(adapter, 'toTemplateDraft').mockRejectedValue(new Error('Erro direto'));
        await expect(adapter.safeToTemplateDraft({ slug: 'y' })).rejects.toThrow(/Erro direto/);
    });
});
