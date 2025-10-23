import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useQuizUserProgress } from '../useQuizUserProgress';
import { useUnifiedQuizNavigation } from '../useUnifiedQuizNavigation';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useQuizUserProgress', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('deve inicializar com valores padrão', () => {
        const { result } = renderHook(() => useQuizUserProgress({
            funnelId: 'test-funnel',
        }));

        expect(result.current.progress).toEqual(expect.objectContaining({
            funnelId: 'test-funnel',
            answers: [],
            currentStepIndex: 0,
            totalPoints: 0,
        }));
    });

    it('deve registrar resposta corretamente', () => {
        const { result } = renderHook(() => useQuizUserProgress({
            funnelId: 'test-funnel',
        }));

        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'opt1', value: 'Option 1', points: 10 }],
            });
        });

        expect(result.current.answers).toHaveLength(1);
        expect(result.current.totalPoints).toBe(10);
    });

    it('deve substituir resposta existente para o mesmo step', () => {
        const { result } = renderHook(() => useQuizUserProgress({
            funnelId: 'test-funnel',
        }));

        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'opt1', value: 'Option 1', points: 10 }],
            });
        });

        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'opt2', value: 'Option 2', points: 20 }],
            });
        });

        expect(result.current.answers).toHaveLength(1);
        expect(result.current.totalPoints).toBe(20);
    });

    it('deve persistir dados no localStorage', () => {
        const { result } = renderHook(() => useQuizUserProgress({
            funnelId: 'test-funnel',
            persistToLocalStorage: true,
        }));

        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'opt1', value: 'Option 1', points: 10 }],
            });
        });

        const savedData = localStorageMock.getItem('quiz_progress_test-funnel');
        expect(savedData).toBeTruthy();

        const parsedData = JSON.parse(savedData!);
        expect(parsedData.answers).toHaveLength(1);
        expect(parsedData.totalPoints).toBe(10);
    });
});

describe('useUnifiedQuizNavigation', () => {
    it('deve inicializar com valores corretos', () => {
        const { result } = renderHook(() => useUnifiedQuizNavigation({
            funnelId: 'test-funnel',
            totalSteps: 5,
        }));

        expect(result.current.currentStepIndex).toBe(0);
        expect(result.current.isFirstStep).toBe(true);
        expect(result.current.isLastStep).toBe(false);
        expect(result.current.canGoBack).toBe(false);
        expect(result.current.completionPercentage).toBe(20); // 1/5 = 20%
    });

    it('deve navegar para o próximo passo', () => {
        const onStepChangeMock = vi.fn();

        const { result } = renderHook(() => useUnifiedQuizNavigation({
            funnelId: 'test-funnel',
            totalSteps: 5,
            onStepChange: onStepChangeMock,
        }));

        act(() => {
            result.current.setStepValidity(true);
        });

        act(() => {
            result.current.navigateToNextStep();
        });

        expect(result.current.currentStepIndex).toBe(1);
        expect(result.current.isFirstStep).toBe(false);
        expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    it('deve voltar para o passo anterior', () => {
        const onStepChangeMock = vi.fn();

        const { result } = renderHook(() => useUnifiedQuizNavigation({
            funnelId: 'test-funnel-nav',
            totalSteps: 5,
            initialStep: 2,
            persistNavigation: false, // Desabilitar persistência para evitar interferência
            onStepChange: onStepChangeMock,
        }));

        // Verificar que inicializou corretamente
        expect(result.current.currentStepIndex).toBe(2);

        // Navegar para trás
        act(() => {
            result.current.navigateToPreviousStep();
        });

        // Deve voltar para 1 (sem histórico, só subtrai 1)
        expect(result.current.currentStepIndex).toBe(1);
        expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    it('deve respeitar regras de navegação condicional', () => {
        const rules = [
            {
                stepId: 1,
                condition: (answers: any[]) => {
                    return answers.some((a: any) =>
                        a.stepId === 1 && a.selectedOptions && a.selectedOptions.some((opt: any) => opt.id === 'special')
                    );
                },
                targetStepId: 3,
            },
        ];

        const { result } = renderHook(() => useUnifiedQuizNavigation({
            funnelId: 'test-funnel',
            totalSteps: 5,
            initialStep: 1,
            rules,
        }));

        // Verificar inicialização
        expect(result.current.currentStepIndex).toBe(1);

        // Registrar resposta que ativa a regra condicional
        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'special', value: 'Special Option' }],
            });
        });

        // Marcar step como válido e navegar
        act(() => {
            result.current.setStepValidity(true);
        });

        act(() => {
            result.current.navigateToNextStep();
        });

        // Deve pular para o passo 3 conforme a regra
        expect(result.current.currentStepIndex).toBe(3);
    });

    // Tipagem coberta no escopo do teste acima
});