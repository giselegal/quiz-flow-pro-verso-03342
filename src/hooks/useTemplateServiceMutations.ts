/**
 * 🎯 HOOKS REACT QUERY ESPECIALIZADOS - TEMPLATE SERVICE
 * 
 * Hooks React Query otimizados para operações do TemplateService
 * com invalidação automática de cache e gestão de estado.
 * 
 * @version 4.0.0
 * @phase Refinamento Pós-Auditoria
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/types/editor';
import type { ServiceResult } from '@/services/canonical/types';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const templateKeys = {
  all: ['template'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
  steps: () => [...templateKeys.all, 'steps'] as const,
  step: (stepId: string, templateId?: string) => 
    [...templateKeys.steps(), stepId, templateId || 'default'] as const,
  metadata: (id: string) => [...templateKeys.detail(id), 'metadata'] as const,
  v4: () => [...templateKeys.all, 'v4'] as const,
  v4Step: (stepId: string) => [...templateKeys.v4(), stepId] as const,
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Hook para carregar step com cache React Query
 * 
 * @example
 * ```tsx
 * const { data: blocks, isLoading, error } = useStep('step-01', 'quiz21StepsComplete');
 * ```
 */
export function useStep(
  stepId: string,
  templateId?: string,
  options?: Omit<UseQueryOptions<Block[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Block[], Error>({
    queryKey: templateKeys.step(stepId, templateId),
    queryFn: async ({ signal }) => {
      const result = await templateService.getStep(stepId, templateId, { signal });
      if (!result.success) {
        throw result.error || new Error('Failed to load step');
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

/**
 * Hook para carregar step v4 com validação Zod
 * 
 * @example
 * ```tsx
 * const { data: step, isLoading } = useStepV4('step-01');
 * ```
 */
export function useStepV4(
  stepId: string,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templateKeys.v4Step(stepId),
    queryFn: async () => {
      const result = await templateService.getStepV4(stepId);
      if (!result.success) {
        throw result.error || new Error('Failed to load v4 step');
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
    ...options,
  });
}

/**
 * Hook para listar steps com paginação
 * 
 * @example
 * ```tsx
 * const { data: steps } = useSteps('quiz21StepsComplete');
 * ```
 */
export function useSteps(
  templateId?: string,
  options?: Omit<UseQueryOptions<any[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templateKeys.list({ templateId }),
    queryFn: async ({ signal }) => {
      const result = await templateService.listSteps(templateId, { signal });
      if (!result.success) {
        throw result.error || new Error('Failed to list steps');
      }
      return result.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
}

/**
 * Hook para preparar template (sem carregar blocos)
 * 
 * @example
 * ```tsx
 * const { data: prepared } = usePrepareTemplate('quiz21StepsComplete');
 * ```
 */
export function usePrepareTemplate(
  templateId: string,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: [...templateKeys.detail(templateId), 'prepared'],
    queryFn: async ({ signal }) => {
      const result = await templateService.prepareTemplate(templateId, { signal });
      if (!result.success) {
        throw result.error || new Error('Failed to prepare template');
      }
      return result.data;
    },
    enabled: !!templateId,
    staleTime: Infinity, // Preparação não expira
    ...options,
  });
}

/**
 * Hook para preload completo (usado em background)
 * 
 * @example
 * ```tsx
 * const { isLoading } = usePreloadTemplate('quiz21StepsComplete', true);
 * ```
 */
export function usePreloadTemplate(
  templateId: string,
  enabled = false,
  options?: Omit<UseQueryOptions<void, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useQuery({
    queryKey: [...templateKeys.detail(templateId), 'preload'],
    queryFn: async ({ signal }) => {
      const result = await templateService.preloadTemplate(templateId, { signal });
      if (!result.success) {
        throw result.error || new Error('Failed to preload template');
      }
      return result.data;
    },
    enabled: enabled && !!templateId,
    staleTime: 30 * 60 * 1000, // 30 minutos
    ...options,
  });
}

/**
 * Hook para obter metadata de template
 * 
 * @example
 * ```tsx
 * const { data: metadata } = useTemplateMetadata('quiz21StepsComplete');
 * ```
 */
export function useTemplateMetadata(
  templateId: string,
  options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: templateKeys.metadata(templateId),
    queryFn: async () => {
      const result = await templateService.getTemplateMetadata(templateId);
      if (!result.success) {
        throw result.error || new Error('Failed to get metadata');
      }
      return result.data;
    },
    enabled: !!templateId,
    staleTime: 15 * 60 * 1000, // 15 minutos
    ...options,
  });
}

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Hook para salvar step com invalidação automática
 * 
 * @example
 * ```tsx
 * const { mutate: saveStep, isPending } = useSaveStep('step-01');
 * saveStep(updatedBlocks);
 * ```
 */
export function useSaveStep(stepId: string, templateId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blocks: Block[]) => {
      const result = await templateService.saveStep(stepId, blocks);
      if (!result.success) {
        throw result.error || new Error('Failed to save step');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar cache do step específico
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId, templateId) });
      
      // Invalidar lista de steps
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      
      // Invalidar v4 cache se existir
      queryClient.invalidateQueries({ queryKey: templateKeys.v4Step(stepId) });
    },
  });
}

/**
 * Hook para criar bloco em um step
 * 
 * @example
 * ```tsx
 * const { mutate: createBlock } = useCreateBlock('step-01');
 * createBlock({ type: 'TextBlock', properties: { text: 'Hello' } });
 * ```
 */
export function useCreateBlock(stepId: string, templateId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blockDTO: { 
      type: string; 
      properties?: Record<string, any>; 
      content?: Record<string, any>;
      parentId?: string | null;
    }) => {
      const result = await templateService.createBlock(stepId, blockDTO);
      if (!result.success) {
        throw result.error || new Error('Failed to create block');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar step que recebeu o novo bloco
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId, templateId) });
    },
  });
}

/**
 * Hook para atualizar bloco
 * 
 * @example
 * ```tsx
 * const { mutate: updateBlock } = useUpdateBlock('step-01', 'block-123');
 * updateBlock({ properties: { text: 'Updated' } });
 * ```
 */
export function useUpdateBlock(stepId: string, blockId: string, templateId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Block>) => {
      const result = await templateService.updateBlock(stepId, blockId, updates);
      if (!result.success) {
        throw result.error || new Error('Failed to update block');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar step que contém o bloco
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId, templateId) });
    },
  });
}

/**
 * Hook para deletar bloco
 * 
 * @example
 * ```tsx
 * const { mutate: deleteBlock } = useDeleteBlock('step-01', 'block-123');
 * deleteBlock();
 * ```
 */
export function useDeleteBlock(stepId: string, blockId: string, templateId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await templateService.deleteBlock(stepId, blockId);
      if (!result.success) {
        throw result.error || new Error('Failed to delete block');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar step que continha o bloco
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId, templateId) });
    },
  });
}

/**
 * Hook para adicionar step customizado
 * 
 * @example
 * ```tsx
 * const { mutate: addStep } = useAddCustomStep();
 * addStep({
 *   id: 'step-custom-01',
 *   name: 'My Custom Step',
 *   type: 'custom',
 *   order: 22,
 *   description: 'Custom step description',
 *   blocksCount: 0,
 *   hasTemplate: false
 * });
 * ```
 */
export function useAddCustomStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepInfo: any) => {
      const result = await templateService.steps.add(stepInfo);
      if (!result.success) {
        throw result.error || new Error('Failed to add custom step');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar lista de steps
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

/**
 * Hook para remover step customizado
 * 
 * @example
 * ```tsx
 * const { mutate: removeStep } = useRemoveCustomStep();
 * removeStep('step-custom-01');
 * ```
 */
export function useRemoveCustomStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepId: string) => {
      const result = await templateService.steps.remove(stepId);
      if (!result.success) {
        throw result.error || new Error('Failed to remove custom step');
      }
      return result.data;
    },
    onSuccess: (_data, stepId) => {
      // Invalidar step específico
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId) });
      
      // Invalidar lista de steps
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

/**
 * Hook para duplicar step
 * 
 * @example
 * ```tsx
 * const { mutate: duplicateStep } = useDuplicateStep();
 * duplicateStep('step-01');
 * ```
 */
export function useDuplicateStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (stepId: string) => {
      const result = await templateService.steps.duplicate(stepId);
      if (!result.success) {
        throw result.error || new Error('Failed to duplicate step');
      }
      return result.data;
    },
    onSuccess: () => {
      // Invalidar lista de steps (novo step foi adicionado)
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

/**
 * Hook para invalidar cache de template
 * 
 * @example
 * ```tsx
 * const invalidate = useInvalidateTemplate();
 * invalidate.step('step-01');
 * invalidate.all();
 * ```
 */
export function useInvalidateTemplate() {
  const queryClient = useQueryClient();

  return {
    step: (stepId: string, templateId?: string) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.step(stepId, templateId) });
    },
    steps: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.steps() });
    },
    detail: (templateId: string) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) });
    },
    all: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
    },
  };
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook para obter estatísticas de cache
 * 
 * @example
 * ```tsx
 * const stats = useCacheStats();
 * console.log(`Cache Hit Rate: ${stats.cacheHitRate}`);
 * ```
 */
export function useCacheStats() {
  return useQuery({
    queryKey: [...templateKeys.all, 'stats'],
    queryFn: () => templateService.getCacheStats(),
    refetchInterval: 30000, // Atualizar a cada 30s
    staleTime: 10000, // 10s
  });
}

/**
 * Hook combinado para carregar e salvar step
 * Útil para componentes que precisam de ambas operações
 * 
 * @example
 * ```tsx
 * const { blocks, isLoading, saveBlocks, isSaving } = useStepWithMutation('step-01');
 * ```
 */
export function useStepWithMutation(stepId: string, templateId?: string) {
  const { data: blocks, isLoading, error, refetch } = useStep(stepId, templateId);
  const { mutate: save, isPending: isSaving } = useSaveStep(stepId, templateId);

  return {
    blocks: blocks || [],
    isLoading,
    error,
    refetch,
    saveBlocks: save,
    isSaving,
  };
}
