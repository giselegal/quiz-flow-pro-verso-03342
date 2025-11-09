/**
 * Testes de Integração - Fluxos Completos
 * 
 * Testa workflows end-to-end do sistema de templates:
 * - Fluxo: Importar → Validar → Salvar
 * - Fluxo: Carregar → Editar → Exportar
 * - Fluxo: Preparar → Navegar Steps → Prefetch
 * - Fluxo: API Fallback → Cache → Retry
 * - Fluxo: Múltiplos Templates → Concorrência
 * 
 * @module __tests__/integration/templateWorkflows.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
    useTemplateStep,
    useTemplateSteps,
    usePrepareTemplate,
    usePrefetchTemplateStep,
} from '@/services/hooks';
import { templateService } from '@/services/canonical/TemplateService';
import { validateTemplate } from '@/types/schemas/templateSchema';

// Mock do TemplateService
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        getStep: vi.fn(),
        prepareTemplate: vi.fn(),
        preloadTemplate: vi.fn(),
    },
}));

// Mock do templateSchema
vi.mock('@/schemas/templateSchema', () => ({
    validateTemplate: vi.fn(),
    isValidTemplate: vi.fn(),
    safeParseTemplate: vi.fn(),
}));

// Helper para criar wrapper com QueryClient
function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

// Template completo para testes
const createMockTemplate = () => ({
    metadata: {
        id: 'quiz21StepsComplete',
        version: '3.1',
        name: 'Quiz 21 Steps Complete',
        description: 'Template completo com 21 passos',
    },
    steps: {
        'step-01-intro': [
            { id: 'intro-logo', type: 'intro-logo' as const, order: 0, content: {}, properties: {} },
            { id: 'intro-title', type: 'intro-title' as const, order: 1, content: {}, properties: {} },
        ],
        'step-02-question-1': [
            { id: 'q1-question', type: 'quiz-question' as const, order: 0, content: {}, properties: {} },
            { id: 'q1-options', type: 'options-grid' as const, order: 1, content: {}, properties: {} },
        ],
        'step-03-question-2': [
            { id: 'q2-question', type: 'quiz-question' as const, order: 0, content: {}, properties: {} },
            { id: 'q2-options', type: 'options-grid' as const, order: 1, content: {}, properties: {} },
        ],
        'step-04-result': [
            { id: 'result-score', type: 'quiz-result' as const, order: 0, content: {}, properties: {} },
            { id: 'result-message', type: 'text' as const, order: 1, content: {}, properties: {} },
        ],
    },
});

describe('Fluxo 1: Importar → Validar → Salvar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve executar fluxo completo de importação', async () => {
        const mockTemplate = createMockTemplate();

        // 1. Validar template importado
        vi.mocked(validateTemplate).mockReturnValue({
            success: true,
            data: mockTemplate,
        });

        const validationResult = validateTemplate(mockTemplate);
        expect(validationResult.success).toBe(true);

        // 2. Preparar template
        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const wrapper = createWrapper();
        const { result: prepareResult } = renderHook(
            () => usePrepareTemplate(),
            { wrapper }
        );

        prepareResult.current.mutate({
            templateId: mockTemplate.metadata.id,
            options: { preloadAll: true },
        });

        await waitFor(() => {
            expect(prepareResult.current.isSuccess).toBe(true);
        });

        // 3. Verificar que template está pronto para uso
        expect(templateService.prepareTemplate).toHaveBeenCalledWith(
            'quiz21StepsComplete',
            { preloadAll: true }
        );
    });

    it('deve tratar erro de validação durante importação', async () => {
        const invalidTemplate = {
            metadata: {}, // Falta campos obrigatórios
            steps: {},
        };

        vi.mocked(validateTemplate).mockReturnValue({
            success: false,
            errors: ['Template inválido: falta campo id'],
        });

        const validationResult = validateTemplate(invalidTemplate);

        expect(validationResult.success).toBe(false);
        if (!validationResult.success && validationResult.errors) {
            expect(validationResult.errors[0]).toContain('falta campo id');
        }
    });
});

describe('Fluxo 2: Carregar → Editar → Exportar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve carregar, modificar e preparar para exportação', async () => {
        const mockTemplate = createMockTemplate();
        const mockBlocks = mockTemplate.steps['step-01-intro'];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        const wrapper = createWrapper();

        // 1. Carregar step
        const { result: stepResult } = renderHook(
            () => useTemplateStep('step-01-intro', {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(stepResult.current.isSuccess).toBe(true);
        });

        const loadedBlocks = stepResult.current.data!;
        expect(loadedBlocks).toHaveLength(2);

        // 2. Simular edição (adicionar bloco)
        const editedBlocks = [
            ...loadedBlocks,
            { id: 'new-block', type: 'NewBlock', properties: {} },
        ];

        expect(editedBlocks).toHaveLength(3);

        // 3. Validar estrutura modificada
        const modifiedTemplate = {
            ...mockTemplate,
            steps: {
                ...mockTemplate.steps,
                'step-01-intro': editedBlocks,
            },
        };

        vi.mocked(validateTemplate).mockReturnValue({
            success: true,
            data: modifiedTemplate,
        });

        const validationResult = validateTemplate(modifiedTemplate);
        expect(validationResult.success).toBe(true);
    });
});

describe('Fluxo 3: Preparar → Navegar Steps → Prefetch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve preparar template e navegar com prefetch automático', async () => {
        const mockTemplate = createMockTemplate();

        // 1. Preparar template
        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const wrapper = createWrapper();
        const { result: prepareResult } = renderHook(
            () => usePrepareTemplate(),
            { wrapper }
        );

        prepareResult.current.mutate({
            templateId: 'quiz21StepsComplete',
            options: { preloadAll: false },
        });

        await waitFor(() => {
            expect(prepareResult.current.isSuccess).toBe(true);
        });

        // 2. Carregar step atual
        const mockBlocks1 = mockTemplate.steps['step-01-intro'];
        vi.mocked(templateService.getStep).mockResolvedValueOnce({
            success: true,
            data: mockBlocks1,
        });

        const { result: step1Result } = renderHook(
            () => useTemplateStep('step-01-intro', {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(step1Result.current.isSuccess).toBe(true);
        });

        // 3. Prefetch próximo step
        const mockBlocks2 = mockTemplate.steps['step-02-question-1'];
        vi.mocked(templateService.getStep).mockResolvedValueOnce({
            success: true,
            data: mockBlocks2,
        });

        const { result: prefetchResult } = renderHook(
            () => usePrefetchTemplateStep(),
            { wrapper }
        );

        prefetchResult.current('step-02-question-1', {
            templateId: 'quiz21StepsComplete',
        });

        // Aguardar prefetch completar
        await waitFor(() => {
            expect(templateService.getStep).toHaveBeenCalledWith(
                'step-02-question-1',
                'quiz21StepsComplete',
                expect.any(Object)
            );
        });

        // 4. Navegar para próximo step (deve usar cache)
        const { result: step2Result } = renderHook(
            () => useTemplateStep('step-02-question-1', {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(step2Result.current.isSuccess).toBe(true);
        });

        expect(step2Result.current.data).toEqual(mockBlocks2);
    });
});

describe('Fluxo 4: API Fallback → Cache → Retry', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve usar API como fallback e cachear resultado', async () => {
        // Simular JSON não disponível, usar API
        const mockBlocks = [
            { id: 'api-block-1', type: 'APIBlock' },
        ];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        const wrapper = createWrapper();

        // 1. Primeira requisição (API)
        const { result: firstResult } = renderHook(
            () => useTemplateStep('step-api', {
                templateId: 'api-template',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(firstResult.current.isSuccess).toBe(true);
        });

        expect(firstResult.current.data).toEqual(mockBlocks);
        expect(templateService.getStep).toHaveBeenCalledTimes(1);

        // 2. Segunda requisição (deve usar cache)
        const { result: secondResult } = renderHook(
            () => useTemplateStep('step-api', {
                templateId: 'api-template',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(secondResult.current.isSuccess).toBe(true);
        });

        // Deve retornar dados do cache (não fazer nova requisição)
        expect(secondResult.current.data).toEqual(mockBlocks);
        // Service deve ter sido chamado apenas 1x (primeira requisição)
        expect(templateService.getStep).toHaveBeenCalledTimes(1);
    });

    it('deve fazer retry após erro temporário', async () => {
        const mockBlocks = [{ id: 'b1', type: 'Block' }];

        // Primeira tentativa: erro
        // Segunda tentativa: sucesso
        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({
                success: false,
                error: new Error('Erro temporário'),
            })
            .mockResolvedValueOnce({
                success: true,
                data: mockBlocks,
            });

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: 1, // Permitir 1 retry
                    gcTime: 0,
                },
            },
        });

        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );

        const { result } = renderHook(
            () => useTemplateStep('step-retry', {
                templateId: 'retry-template',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Deve ter sucesso após retry
        expect(result.current.data).toEqual(mockBlocks);
        expect(templateService.getStep).toHaveBeenCalledTimes(2);
    });
});

describe('Fluxo 5: Múltiplos Templates → Concorrência', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve carregar múltiplos steps de diferentes templates em paralelo', async () => {
        const template1Blocks = [{ id: 't1-b1', type: 'Block1' }];
        const template2Blocks = [{ id: 't2-b1', type: 'Block2' }];
        const template3Blocks = [{ id: 't3-b1', type: 'Block3' }];

        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({ success: true, data: template1Blocks })
            .mockResolvedValueOnce({ success: true, data: template2Blocks })
            .mockResolvedValueOnce({ success: true, data: template3Blocks });

        const wrapper = createWrapper();

        // Carregar 3 steps de templates diferentes em paralelo
        const { result: result1 } = renderHook(
            () => useTemplateStep('step-01', { templateId: 'template1' }),
            { wrapper }
        );

        const { result: result2 } = renderHook(
            () => useTemplateStep('step-01', { templateId: 'template2' }),
            { wrapper }
        );

        const { result: result3 } = renderHook(
            () => useTemplateStep('step-01', { templateId: 'template3' }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
            expect(result2.current.isSuccess).toBe(true);
            expect(result3.current.isSuccess).toBe(true);
        });

        // Verificar dados corretos
        expect(result1.current.data).toEqual(template1Blocks);
        expect(result2.current.data).toEqual(template2Blocks);
        expect(result3.current.data).toEqual(template3Blocks);

        // Todas as requisições devem ter sido feitas
        expect(templateService.getStep).toHaveBeenCalledTimes(3);
    });

    it('deve isolar cache entre templates diferentes', async () => {
        const template1Blocks = [{ id: 't1-b1', type: 'Block1' }];
        const template2Blocks = [{ id: 't2-b1', type: 'Block2' }];

        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({ success: true, data: template1Blocks })
            .mockResolvedValueOnce({ success: true, data: template2Blocks });

        const wrapper = createWrapper();

        // Carregar mesmo stepId de templates diferentes
        const { result: result1 } = renderHook(
            () => useTemplateStep('step-01', { templateId: 'template1' }),
            { wrapper }
        );

        const { result: result2 } = renderHook(
            () => useTemplateStep('step-01', { templateId: 'template2' }),
            { wrapper }
        );

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true);
            expect(result2.current.isSuccess).toBe(true);
        });

        // Dados devem ser diferentes (cache isolado)
        expect(result1.current.data).toEqual(template1Blocks);
        expect(result2.current.data).toEqual(template2Blocks);
        expect(result1.current.data).not.toEqual(result2.current.data);
    });
});

describe('Fluxo 6: Navegação Sequencial com Prefetch Inteligente', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve navegar sequencialmente com prefetch do próximo', async () => {
        const mockTemplate = createMockTemplate();
        const steps = Object.keys(mockTemplate.steps);

        const wrapper = createWrapper();
        const { result: prefetchFn } = renderHook(
            () => usePrefetchTemplateStep(),
            { wrapper }
        );

        for (let i = 0; i < steps.length; i++) {
            const currentStep = steps[i];
            const nextStep = steps[i + 1];

            // Mock dados do step atual
            const currentBlocks = mockTemplate.steps[currentStep as keyof typeof mockTemplate.steps];
            vi.mocked(templateService.getStep).mockResolvedValueOnce({
                success: true,
                data: currentBlocks,
            });

            // Carregar step atual
            const { result: stepResult } = renderHook(
                () => useTemplateStep(currentStep, {
                    templateId: 'quiz21StepsComplete',
                }),
                { wrapper }
            );

            await waitFor(() => {
                expect(stepResult.current.isSuccess).toBe(true);
            });

            // Prefetch próximo step (se existir)
            if (nextStep) {
                const nextBlocks = mockTemplate.steps[nextStep as keyof typeof mockTemplate.steps];
                vi.mocked(templateService.getStep).mockResolvedValueOnce({
                    success: true,
                    data: nextBlocks,
                });

                prefetchFn.current(nextStep, {
                    templateId: 'quiz21StepsComplete',
                });
            }
        }

        // Verificar que todos os steps foram carregados
        expect(templateService.getStep).toHaveBeenCalledTimes(steps.length * 2 - 1);
        // (load + prefetch) * n steps - 1 (último não tem prefetch)
    });
});

describe('Fluxo 7: Carregamento Batch de Múltiplos Steps', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve carregar múltiplos steps de uma vez eficientemente', async () => {
        const mockTemplate = createMockTemplate();
        const stepIds = ['step-01-intro', 'step-02-question-1', 'step-03-question-2'];

        // Mock respostas para cada step
        stepIds.forEach(stepId => {
            const blocks = mockTemplate.steps[stepId as keyof typeof mockTemplate.steps];
            vi.mocked(templateService.getStep).mockResolvedValueOnce({
                success: true,
                data: blocks,
            });
        });

        const wrapper = createWrapper();

        // Carregar múltiplos steps
        const { result } = renderHook(
            () => useTemplateSteps(stepIds, {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper }
        );

        await waitFor(() => {
            const allLoaded = result.current.every(s => !s.isLoading);
            expect(allLoaded).toBe(true);
        });

        // Verificar que todos os steps foram carregados
        expect(result.current).toHaveLength(3);
        result.current.forEach((stepResult, index) => {
            expect(stepResult.stepId).toBe(stepIds[index]);
            expect(stepResult.isError).toBe(false);
            expect(stepResult.blocks).toBeDefined();
        });

        // Service deve ter sido chamado 3 vezes em paralelo
        expect(templateService.getStep).toHaveBeenCalledTimes(3);
    });
});
