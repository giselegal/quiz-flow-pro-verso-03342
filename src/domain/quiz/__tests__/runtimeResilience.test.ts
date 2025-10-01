import { describe, test, expect, vi } from 'vitest';
import * as runtime from '../runtime';

describe('getQuizDefinition (resilience)', () => {
    test('retorna null e loga erro se loader lança', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const originalLoader = runtime.loadQuizDefinition;
        // Força erro no loader
        vi.spyOn(runtime, 'loadQuizDefinition').mockImplementation(() => { throw new Error('Simulado'); });
        // Limpa cache/erro
        (runtime as any).cached = null;
        (runtime as any).loadError = null;
        const result = runtime.getQuizDefinition();
        expect(result).toBeNull();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Falha ao carregar definição canônica:'), expect.stringContaining('Simulado'));
        // Restaura
        spy.mockRestore();
        (runtime as any).loadQuizDefinition = originalLoader;
    });
});
