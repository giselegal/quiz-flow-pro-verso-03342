import { describe, test, expect, vi } from 'vitest';
import { getQuizDefinition } from '../runtime';
import * as loader from '../loader';

describe('getQuizDefinition (resilience)', () => {
    test('retorna null e loga erro se loader lança', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });
        const spyLoader = vi.spyOn(loader, 'loadQuizDefinition').mockImplementation(() => { throw new Error('Simulado'); });
        // Limpa cache/erro
        // Como cached/loadError são escopo do módulo, não do global, não há como resetar diretamente
        // Executa getQuizDefinition para forçar erro
        const result = getQuizDefinition();
        expect(result).toBeNull();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Falha ao carregar definição canônica:'), expect.stringContaining('Simulado'));
        // Restaura
        spy.mockRestore();
        spyLoader.mockRestore();
    });
});
