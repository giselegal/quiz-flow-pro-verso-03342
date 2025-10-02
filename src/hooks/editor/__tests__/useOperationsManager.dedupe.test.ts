import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useOperationsManager } from '../useOperationsManager';

describe('useOperationsManager dedupe', () => {
    it('impede execução simultânea quando dedupe: true', async () => {
        const { result } = renderHook(() => useOperationsManager());

        const p1 = act(async () => {
            return result.current.runOperation('save', async () => {
                await new Promise(r => setTimeout(r, 50));
            }, { dedupe: true });
        });

        let error: any = null;
        await act(async () => {
            try {
                await result.current.runOperation('save', async () => { }, { dedupe: true });
            } catch (e) { error = e; }
        });

        expect(error).toBeInstanceOf(Error);
    });
});
