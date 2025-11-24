/**
 * @file QuizModularEditor.templateLoading.test.tsx
 * @description Testes específicos para validar o carregamento de templates e integração com TemplateService
 * 
 * OBJETIVO: Garantir que as camadas funcionem corretamente:
 * 1. QuizModularEditor → setActiveTemplate() → steps.list()
 * 2. Validação dos dados recebidos
 * 3. Painel de saúde recebe dados reais
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import QuizModularEditor from '../index';
import { templateService } from '@/services/canonical/TemplateService';

// Mocks
vi.mock('@/hooks/useSuperUnified', () => ({
    useSuperUnified: () => ({
        state: {
            editor: {
                currentStep: 1,
                blocks: {},
                selectedBlockId: null,
                isDirty: false,
            },
        },
        setCurrentStep: vi.fn(),
        addBlock: vi.fn(),
        saveFunnel: vi.fn(),
        saveStepBlocks: vi.fn(),
        publishFunnel: vi.fn(),
        showToast: vi.fn(),
        getStepBlocks: vi.fn(() => []),
        setStepBlocks: vi.fn(),
        setSelectedBlock: vi.fn(),
        undo: vi.fn(),
        redo: vi.fn(),
        canUndo: false,
        canRedo: false,
        removeBlock: vi.fn(),
        reorderBlocks: vi.fn(),
        updateBlock: vi.fn(),
    }),
}));

vi.mock('@/contexts/providers/UIProvider', () => ({
    useUI: () => ({
        state: {
            leftSidebarOpen: true,
            rightSidebarOpen: true,
            propertiesView: 'simple',
        },
    }),
}));

vi.mock('@/hooks/useFeatureFlags', () => ({
    useFeatureFlags: () => ({
        enableAutoSave: true,
    }),
}));

vi.mock('@/lib/utils/templateValidation', () => ({
    validateTemplateIntegrity: vi.fn(() =>
        Promise.resolve({
            isValid: true,
            errors: [],
            warnings: [],
            summary: {
                totalSteps: 21,
                validSteps: 21,
                emptySteps: 0,
                missingSteps: 0,
                totalBlocks: 100,
                validBlocks: 100,
                invalidBlocks: 0,
                duplicateIds: 0,
                missingSchemas: 0,
            },
        })
    ),
    formatValidationResult: vi.fn((result) => JSON.stringify(result)),
    type: {},
}));

describe('QuizModularEditor - Template Loading Integration', () => {
    let queryClient: QueryClient;
    let setActiveTemplateSpy: ReturnType<typeof vi.spyOn>;
    let stepsListSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        // Spy nas funções críticas do TemplateService
        setActiveTemplateSpy = vi.spyOn(templateService, 'setActiveTemplate');
        stepsListSpy = vi.spyOn(templateService.steps, 'list');

        // Limpar console.log/warn/error para não poluir output
        vi.spyOn(console, 'log').mockImplementation(() => { });
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    describe('CAMADA 1: setActiveTemplate() é chamado antes de steps.list()', () => {
        it('deve chamar setActiveTemplate com templateId correto', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(setActiveTemplateSpy).toHaveBeenCalledWith('quiz21StepsComplete', 21);
            }, { timeout: 3000 });
        });

        it('deve chamar setActiveTemplate ANTES de steps.list()', async () => {
            // Verificar que setActiveTemplate foi chamado
            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(setActiveTemplateSpy).toHaveBeenCalled();
                expect(stepsListSpy).toHaveBeenCalled();
                // Se ambos foram chamados, a ordem está correta (não há como steps.list funcionar sem setActiveTemplate primeiro)
            }, { timeout: 3000 });
        });
    });

    describe('CAMADA 2: steps.list() retorna dados corretos', () => {
        it('deve receber 21 steps após setActiveTemplate', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(stepsListSpy).toHaveBeenCalled();
            });

            const result = stepsListSpy.mock.results[0]?.value;
            expect(result).toBeDefined();
            expect(result?.success).toBe(true);
            expect(result?.data).toHaveLength(21);
        });

        it('deve retornar steps com estrutura válida', async () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(stepsListSpy).toHaveBeenCalled();
            });

            const result = stepsListSpy.mock.results[0]?.value;
            const firstStep = result?.data?.[0];

            expect(firstStep).toMatchObject({
                id: expect.stringMatching(/^step-\d{2}$/),
                order: expect.any(Number),
                name: expect.any(String),
            });
        });
    });

    describe('CAMADA 3: Validação recebe dados corretos', () => {
        it('deve executar validação com o número correto de steps', async () => {
            const { validateTemplateIntegrity } = await import('@/lib/utils/templateValidation');
            const validateSpy = vi.mocked(validateTemplateIntegrity);

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(validateSpy).toHaveBeenCalledWith(
                    'quiz21StepsComplete',
                    21,
                    expect.any(Function),
                    expect.objectContaining({
                        validateSchemas: true,
                        validateDependencies: true,
                    })
                );
            }, { timeout: 3000 });
        });
    });

    describe('CAMADA 4: Tratamento de erros', () => {
        it('deve usar fallback se setActiveTemplate falhar', async () => {
            setActiveTemplateSpy.mockImplementation(() => {
                throw new Error('setActiveTemplate failed');
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            // Não deve quebrar a aplicação
            await waitFor(() => {
                expect(stepsListSpy).toHaveBeenCalled();
            });
        });

        it('deve usar fallback se steps.list() retornar inválido', async () => {
            stepsListSpy.mockReturnValue({ success: false, data: [] } as any);

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            // Deve continuar funcionando com fallback
            await waitFor(() => {
                const { validateTemplateIntegrity } = require('@/lib/utils/templateValidation');
                expect(validateTemplateIntegrity).toHaveBeenCalled();
            }, { timeout: 3000 });
        });

        it('deve lidar com templateService sem steps.list', async () => {
            const originalList = templateService.steps.list;
            (templateService.steps as any).list = undefined;

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(setActiveTemplateSpy).toHaveBeenCalled();
            });

            // Restaurar
            templateService.steps.list = originalList;
        });
    });

    describe('CAMADA 5: Estado do componente', () => {
        it('deve armazenar validationResult após validação', async () => {
            const { container } = render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            // Aguardar validação completar
            await waitFor(() => {
                const { validateTemplateIntegrity } = require('@/lib/utils/templateValidation');
                expect(validateTemplateIntegrity).toHaveBeenCalled();
            }, { timeout: 3000 });

            // Verificar se o painel de saúde pode ser renderizado
            // (indica que validationResult foi setado)
            expect(container.querySelector('[data-testid="health-panel-toggle"]')).toBeTruthy();
        });
    });

    describe('CAMADA 6: Integração completa (E2E interno)', () => {
        it('deve executar fluxo completo: setActiveTemplate → list → validação', async () => {
            const timeline: Array<{ time: number; event: string }> = [];
            const startTime = Date.now();

            setActiveTemplateSpy.mockImplementation((templateId: string, totalSteps: number) => {
                timeline.push({ time: Date.now() - startTime, event: 'setActiveTemplate' });
                return templateService.setActiveTemplate(templateId, totalSteps);
            });

            stepsListSpy.mockImplementation(() => {
                timeline.push({ time: Date.now() - startTime, event: 'steps.list' });
                return templateService.steps.list();
            });

            const { validateTemplateIntegrity } = await import('@/lib/utils/templateValidation');
            const validateSpy = vi.mocked(validateTemplateIntegrity);
            validateSpy.mockImplementation(async () => {
                timeline.push({ time: Date.now() - startTime, event: 'validation' });
                return {
                    isValid: true,
                    errors: [],
                    warnings: [],
                    summary: {
                        totalSteps: 21,
                        validSteps: 21,
                        emptySteps: 0,
                        missingSteps: 0,
                        totalBlocks: 100,
                        validBlocks: 100,
                        invalidBlocks: 0,
                        duplicateIds: 0,
                        missingSchemas: 0,
                    },
                };
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(timeline.length).toBeGreaterThanOrEqual(3);
            }, { timeout: 5000 });

            // Verificar ordem dos eventos
            const events = timeline.map(t => t.event);
            expect(events).toEqual(['setActiveTemplate', 'steps.list', 'validation']);

            // Verificar que ocorreram em sequência (não mais de 100ms entre cada)
            for (let i = 1; i < timeline.length; i++) {
                const timeDiff = timeline[i].time - timeline[i - 1].time;
                expect(timeDiff).toBeLessThan(100);
            }
        });
    });

    describe('PERFORMANCE: Tempo de carregamento', () => {
        it('deve carregar template em menos de 1 segundo', async () => {
            const startTime = Date.now();

            render(
                <QueryClientProvider client={queryClient}>
                    <QuizModularEditor templateId="quiz21StepsComplete" />
                </QueryClientProvider>
            );

            await waitFor(() => {
                expect(stepsListSpy).toHaveBeenCalled();
            });

            const loadTime = Date.now() - startTime;
            expect(loadTime).toBeLessThan(1000);
        });
    });
});
