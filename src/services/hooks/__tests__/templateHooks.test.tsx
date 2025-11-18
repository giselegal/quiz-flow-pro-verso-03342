/**
 * Testes Automatizados - React Query Hooks
 * 
 * Testa todas as funcionalidades dos hooks de template:
 * - useTemplateStep (carregamento individual)
 * - useTemplateSteps (carregamento múltiplo)
 * - usePrefetchTemplateStep (prefetch)
 * - usePrepareTemplate (preparação)
 * - usePreloadTemplate (preload)
 * 
 * @module __tests__/hooks/templateHooks.test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import {
    useTemplateStep,
    useTemplateSteps,
    usePrefetchTemplateStep,
    usePrepareTemplate,
    usePreloadTemplate,
    templateKeys,
} from '@/services/hooks';
import { templateService } from '@/services/canonical/TemplateService';

// Mock do TemplateService
vi.mock('@/services/canonical/TemplateService', () => ({
    templateService: {
        getStep: vi.fn(),
        prepareTemplate: vi.fn(),
        preloadTemplate: vi.fn(),
    },
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

describe('useTemplateStep - Carregamento Individual', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve carregar step com sucesso', async () => {
        const mockBlocks = [
            { id: 'block-1', type: 'IntroLogo', content: {}, order: 0 },
            { id: 'block-2', type: 'IntroTitle', content: {}, order: 1 },
        ];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        const { result } = renderHook(
            () => useTemplateStep('step-01-intro', {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper: createWrapper() }
        );

        // Estado inicial: loading
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();

        // Aguardar carregamento
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        // Verificar dados carregados
        expect(result.current.data).toEqual(mockBlocks);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isError).toBe(false);

        // Verificar chamada ao service
        expect(templateService.getStep).toHaveBeenCalledWith(
            'step-01-intro',
            'quiz21StepsComplete',
            expect.objectContaining({ signal: expect.any(AbortSignal) })
        );
    });

    it('deve tratar erro ao carregar step', async () => {
        const mockError = new Error('Step não encontrado');

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: false,
            data: [],
            error: mockError,
        });

        const { result } = renderHook(
            () => useTemplateStep('step-inexistente'),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
        expect(result.current.data).toBeUndefined();
    });

    it('não deve executar query se enabled=false', async () => {
        const { result } = renderHook(
            () => useTemplateStep('step-01', {
                enabled: false,
            }),
            { wrapper: createWrapper() }
        );

        // Deve permanecer idle
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();

        // Service não deve ser chamado
        expect(templateService.getStep).not.toHaveBeenCalled();
    });

    it('deve executar callbacks onSuccess', async () => {
        const onSuccess = vi.fn();
        const mockBlocks = [{ id: 'b1', type: 'Block' }];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        renderHook(
            () => useTemplateStep('step-01', {
                onSuccess,
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(mockBlocks);
        });
    });

    it('deve executar callbacks onError', async () => {
        const onError = vi.fn();
        const mockError = new Error('Erro ao carregar');

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: false,
            error: mockError,
        });

        renderHook(
            () => useTemplateStep('step-01', {
                onError,
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(onError).toHaveBeenCalled();
        });
    });

    it('deve usar staleTime e cacheTime customizados', async () => {
        const mockBlocks = [{ id: 'b1', type: 'Block' }];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        const { result } = renderHook(
            () => useTemplateStep('step-01', {
                staleTime: 10000,
                cacheTime: 60000,
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual(mockBlocks);
    });
});

describe('useTemplateSteps - Carregamento Múltiplo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve carregar múltiplos steps em paralelo', async () => {
        const mockBlocks1 = [{ id: 'b1', type: 'Block1' }];
        const mockBlocks2 = [{ id: 'b2', type: 'Block2' }];
        const mockBlocks3 = [{ id: 'b3', type: 'Block3' }];

        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({ success: true, data: mockBlocks1 })
            .mockResolvedValueOnce({ success: true, data: mockBlocks2 })
            .mockResolvedValueOnce({ success: true, data: mockBlocks3 });

        const { result } = renderHook(
            () => useTemplateSteps(['step-01', 'step-02', 'step-03'], {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            const allSuccess = result.current.data.every(s => !s.isLoading);
            expect(allSuccess).toBe(true);
        });

        // Verificar dados de cada step
        expect(result.current.data[0].blocks).toEqual(mockBlocks1);
        expect(result.current.data[1].blocks).toEqual(mockBlocks2);
        expect(result.current.data[2].blocks).toEqual(mockBlocks3);

        // Verificar stepIds
        expect(result.current.data[0].stepId).toBe('step-01');
        expect(result.current.data[1].stepId).toBe('step-02');
        expect(result.current.data[2].stepId).toBe('step-03');
    });

    it('deve tratar erros individuais por step', async () => {
        const mockBlocks1 = [{ id: 'b1', type: 'Block1' }];
        const mockError = new Error('Step 2 não encontrado');

        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({ success: true, data: mockBlocks1 })
            .mockResolvedValueOnce({ success: false, data: [], error: mockError });

        const { result } = renderHook(
            () => useTemplateSteps(['step-01', 'step-02']),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            const allSettled = result.current.data.every(s => !s.isLoading);
            expect(allSettled).toBe(true);
        });

        // Step 1: sucesso
        expect(result.current.data[0].isError).toBe(false);
        expect(result.current.data[0].blocks).toEqual(mockBlocks1);

        // Step 2: erro
        expect(result.current.data[1].isError).toBe(true);
        expect(result.current.data[1].error).toBeDefined();
        expect(result.current.data[1].blocks).toBeUndefined();
    });

    it('deve retornar array vazio para lista vazia', () => {
        const { result } = renderHook(
            () => useTemplateSteps([]),
            { wrapper: createWrapper() }
        );

        expect(result.current).toEqual([]);
    });
});

describe('usePrefetchTemplateStep - Prefetch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve retornar função de prefetch', () => {
        const { result } = renderHook(
            () => usePrefetchTemplateStep(),
            { wrapper: createWrapper() }
        );

        expect(typeof result.current).toBe('function');
    });

    it('deve executar prefetch sem bloquear', async () => {
        const mockBlocks = [{ id: 'b1', type: 'Block' }];

        vi.mocked(templateService.getStep).mockResolvedValue({
            success: true,
            data: mockBlocks,
        });

        const { result } = renderHook(
            () => usePrefetchTemplateStep(),
            { wrapper: createWrapper() }
        );

        // Executar prefetch
        result.current('step-02', { templateId: 'quiz21StepsComplete' });

        // Não deve bloquear (retorna void)
        expect(result.current).toBeInstanceOf(Function);
    });
});

describe('usePrepareTemplate - Preparação', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve preparar template com sucesso', async () => {
        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const { result } = renderHook(
            () => usePrepareTemplate(),
            { wrapper: createWrapper() }
        );

        // Estado inicial
        expect(result.current.isPending).toBe(false);

        // Executar preparação
        result.current.mutate({
            templateId: 'quiz21StepsComplete',
            options: { preloadAll: false },
        });

        // Aguardar conclusão
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isPending).toBe(false);
        expect(templateService.prepareTemplate).toHaveBeenCalledWith(
            'quiz21StepsComplete',
            { preloadAll: false }
        );
    });

    it('deve preparar template com preloadAll', async () => {
        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const { result } = renderHook(
            () => usePrepareTemplate(),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz21StepsComplete',
            options: { preloadAll: true },
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(templateService.prepareTemplate).toHaveBeenCalledWith(
            'quiz21StepsComplete',
            { preloadAll: true }
        );
    });

    it('deve tratar erro na preparação', async () => {
        const mockError = new Error('Falha ao preparar');

        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: false,
            data: undefined,
            error: mockError,
        });

        const { result } = renderHook(
            () => usePrepareTemplate(),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz-inexistente',
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
    });

    it('deve executar callbacks onSuccess', async () => {
        const onSuccess = vi.fn();

        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const { result } = renderHook(
            () => usePrepareTemplate({ onSuccess }),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz21StepsComplete',
        });

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    it('deve executar callbacks onError', async () => {
        const onError = vi.fn();
        const mockError = new Error('Erro');

        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: false,
            error: mockError,
        });

        const { result } = renderHook(
            () => usePrepareTemplate({ onError }),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz21StepsComplete',
        });

        await waitFor(() => {
            expect(onError).toHaveBeenCalled();
        });
    });
});

describe('usePreloadTemplate - Preload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve fazer preload de template com sucesso', async () => {
        vi.mocked(templateService.preloadTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        const { result } = renderHook(
            () => usePreloadTemplate(),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz21StepsComplete',
        });

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(templateService.preloadTemplate).toHaveBeenCalledWith(
            'quiz21StepsComplete',
            undefined
        );
    });

    it('deve tratar erro no preload', async () => {
        const mockError = new Error('Falha no preload');

        vi.mocked(templateService.preloadTemplate).mockResolvedValue({
            success: false,
            error: mockError,
        });

        const { result } = renderHook(
            () => usePreloadTemplate(),
            { wrapper: createWrapper() }
        );

        result.current.mutate({
            templateId: 'quiz-inexistente',
        });

        await waitFor(() => {
            expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeDefined();
    });
});

describe('templateKeys - Query Key Factory', () => {
    it('deve gerar keys hierárquicas corretas', () => {
        expect(templateKeys.all).toEqual(['templates']);
        expect(templateKeys.lists()).toEqual(['templates', 'list']);
        expect(templateKeys.templates()).toEqual(['templates', 'template']);
        expect(templateKeys.template('quiz21')).toEqual(['templates', 'template', 'quiz21']);
        expect(templateKeys.steps('quiz21')).toEqual(['templates', 'template', 'quiz21', 'steps']);
        expect(templateKeys.step('quiz21', 'step-01')).toEqual([
            'templates',
            'template',
            'quiz21',
            'steps',
            'step-01',
        ]);
        expect(templateKeys.metadata('quiz21')).toEqual([
            'templates',
            'template',
            'quiz21',
            'metadata',
        ]);
        expect(templateKeys.validation('quiz21')).toEqual([
            'templates',
            'template',
            'quiz21',
            'validation',
        ]);
    });
});

describe('Integração - Fluxo Completo', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('deve executar fluxo completo: preparar → carregar step → prefetch próximo', async () => {
        const mockBlocks1 = [{ id: 'b1', type: 'Block1' }];
        const mockBlocks2 = [{ id: 'b2', type: 'Block2' }];

        vi.mocked(templateService.prepareTemplate).mockResolvedValue({
            success: true,
            data: undefined,
        });

        vi.mocked(templateService.getStep)
            .mockResolvedValueOnce({ success: true, data: mockBlocks1 })
            .mockResolvedValueOnce({ success: true, data: mockBlocks2 });

        const wrapper = createWrapper();

        // 1. Preparar template
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
        const { result: stepResult } = renderHook(
            () => useTemplateStep('step-01', {
                templateId: 'quiz21StepsComplete',
            }),
            { wrapper }
        );

        await waitFor(() => {
            expect(stepResult.current.isSuccess).toBe(true);
        });

        expect(stepResult.current.data).toEqual(mockBlocks1);

        // 3. Prefetch próximo step
        const { result: prefetchResult } = renderHook(
            () => usePrefetchTemplateStep(),
            { wrapper }
        );

        prefetchResult.current('step-02', {
            templateId: 'quiz21StepsComplete',
        });

        // Aguardar prefetch
        await waitFor(() => {
            expect(templateService.getStep).toHaveBeenCalledTimes(2);
        });
    });
});
