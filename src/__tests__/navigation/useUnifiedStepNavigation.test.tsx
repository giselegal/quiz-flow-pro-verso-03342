import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { EditorProvider } from '@/components/editor/provider-alias';
import { useUnifiedStepNavigation } from '@/hooks/useUnifiedStepNavigation';

// Util simples para montar provider com estado mínimo
const wrapperFactory = (initial: any = {}) => {
    const defaultState = {
        state: {
            currentStep: 1,
            totalSteps: initial.totalSteps ?? 3,
            stepBlocks: initial.stepBlocks || { 'step-1': [{}], 'step-2': [{}], 'step-3': [{}] },
            stepValidation: initial.stepValidation || {},
            isLoading: false
        }
    };
    // Mock do provider real: se o EditorProvider exigir props específicos, ajustar aqui.
    // Para manter baixo acoplamento, usamos o provider real se possível.
    return ({ children }: any) => <EditorProvider>{children}</EditorProvider>;
};

describe('useUnifiedStepNavigation', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('expõe estrutura básica e começa no step 1', () => {
        const { result } = renderHook(() => useUnifiedStepNavigation(), { wrapper: wrapperFactory() });
        expect(result.current.currentStep).toBe(1);
        expect(result.current.totalSteps).toBeGreaterThanOrEqual(1);
        expect(result.current.currentStepId).toBe('step-1');
        expect(result.current.canGoPrevious).toBe(false);
    });

    it('navega para próximo e anterior respeitando limites', () => {
        const { result } = renderHook(() => useUnifiedStepNavigation(), { wrapper: wrapperFactory({ totalSteps: 2 }) });

        act(() => {
            result.current.goToNext();
        });
        expect(result.current.currentStep).toBe(2);
        expect(result.current.canGoNext).toBe(false);

        act(() => {
            result.current.goToPrevious();
        });
        expect(result.current.currentStep).toBe(1);
    });

    it('ignora navegação para o mesmo step (idempotência)', () => {
        const { result } = renderHook(() => useUnifiedStepNavigation(), { wrapper: wrapperFactory({ totalSteps: 2 }) });
        const prev = result.current.currentStep;
        act(() => {
            result.current.goToStep(prev); // mesmo step
        });
        expect(result.current.currentStep).toBe(prev);
    });

    it('não navega para step inválido (<1 ou > total)', () => {
        const { result } = renderHook(() => useUnifiedStepNavigation(), { wrapper: wrapperFactory({ totalSteps: 2 }) });
        act(() => {
            result.current.goToStep(0);
            result.current.goToStep(99);
        });
        expect(result.current.currentStep).toBe(1);
    });
});
