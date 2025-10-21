import { renderHook, act } from '@testing-library/react';
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
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('deve inicializar com valores padrão', () => {
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

    test('deve registrar resposta corretamente', () => {
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

    test('deve substituir resposta existente para o mesmo step', () => {
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

    test('deve persistir dados no localStorage', () => {
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
    test('deve inicializar com valores corretos', () => {
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

    test('deve navegar para o próximo passo', () => {
        const onStepChangeMock = jest.fn();

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

    test('deve voltar para o passo anterior', () => {
        const onStepChangeMock = jest.fn();

        const { result } = renderHook(() => useUnifiedQuizNavigation({
            funnelId: 'test-funnel',
            totalSteps: 5,
            initialStep: 2,
            onStepChange: onStepChangeMock,
        }));

        act(() => {
            result.current.navigateToPreviousStep();
        });

        expect(result.current.currentStepIndex).toBe(1);
        expect(onStepChangeMock).toHaveBeenCalledWith(1);
    });

    test('deve respeitar regras de navegação condicional', () => {
        const rules = [
            {
                stepId: 1,
                condition: (answers: any[]) => {
                    return answers.some(a =>
                        a.stepId === 1 && a.selectedOptions.some(o => o.id === 'special')
                    );
                },
                targetStepId: 3,
            },
        ];

        const { result } = renderHook(() => {
            const progressHook = useQuizUserProgress({
                funnelId: 'test-funnel',
            });

            const navigationHook = useUnifiedQuizNavigation({
                funnelId: 'test-funnel',
                totalSteps: 5,
                initialStep: 1, // Começar no passo 1
                rules,
            });

            return {
                ...navigationHook,
                recordAnswer: progressHook.recordAnswer,
            };
        });

        // Registrar resposta que ativa a regra condicional
        act(() => {
            result.current.recordAnswer(1, {
                questionId: 'q1',
                selectedOptions: [{ id: 'special', value: 'Special Option' }],
            });
        });

        act(() => {
            result.current.setStepValidity(true);
        });

        act(() => {
            result.current.navigateToNextStep();
        });

        // Deve pular para o passo 3 conforme a regra
        expect(result.current.currentStepIndex).toBe(3);
    });

    // Tipagem explícita para SelectedOption
    interface SelectedOption { id: string; value: string; points?: number; }
    // Exemplo de uso tipado (ajustar conforme o teste real)
    // a.selectedOptions.some((o: SelectedOption) => o.id === 'special')
});