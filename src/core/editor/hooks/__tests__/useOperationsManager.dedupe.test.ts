import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOperationsManager } from '../useOperationsManager';

describe('useOperationsManager dedupe', () => {
    it('impede execução simultânea quando dedupe: true', async () => {
        const { result } = renderHook(() => useOperationsManager());

        // Inicia operação longa (não aguardar término)
        void act(async () => {
            await result.current.runOperation('save', async () => {
                await new Promise(r => setTimeout(r, 60));
            }, { dedupe: true });
        });

        // Pequeno delay para garantir flag running propagada
        await new Promise(r => setTimeout(r, 5));

        // Segunda chamada deve rejeitar imediatamente
        await expect(result.current.runOperation('save', async () => { /* noop */ }, { dedupe: true })).rejects.toThrow(/já em execução/);
    });
});
