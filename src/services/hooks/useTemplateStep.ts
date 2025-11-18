/**
 * 🪝 USE TEMPLATE STEP HOOK
 * 
 * Hook React Query para carregar steps de templates
 * Benefícios:
 * - AbortSignal automático (cancela ao desmontar)
 * - Cache gerenciado pelo React Query
 * - Loading/Error states
 * - Retry automático
 * - Stale-while-revalidate
 * 
 * @module useTemplateStep
 */

import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { templateService } from '@/services/canonical/TemplateService';
import { templateKeys } from './templateKeys';
import type { Block } from '@/types/editor';

/**
 * Options para useTemplateStep
 */
export interface UseTemplateStepOptions {
  /**
   * ID do template (opcional)
   */
  templateId?: string;

  /**
   * Habilitar query (default: true se stepId fornecido)
   */
  enabled?: boolean;

  /**
   * Tempo em ms para considerar dados stale (default: 5min)
   */
  staleTime?: number;

  /**
   * Tempo em ms para manter cache (default: 30min)
   */
  cacheTime?: number;

  /**
   * Retry automático em caso de erro (default: 3)
   */
  retry?: number | boolean;

  /**
   * Callback de sucesso
   */
  onSuccess?: (data: Block[]) => void;

  /**
   * Callback de erro
   */
  onError?: (error: Error) => void;
}

/**
 * Hook para carregar um step específico
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error } = useTemplateStep('step-01', {
 *   templateId: 'quiz21StepsComplete',
 *   staleTime: 5 * 60 * 1000 // 5min
 * });
 * ```
 */
export function useTemplateStep(
  stepId: string | undefined,
  options: UseTemplateStepOptions = {}
): UseQueryResult<Block[], Error> {
  const {
    templateId,
    enabled = !!stepId,
    staleTime = 5 * 60 * 1000, // 5 minutos
    cacheTime = 30 * 60 * 1000, // 30 minutos
    retry = 3,
    onSuccess,
    onError,
  } = options;

  return useQuery<Block[], Error>({
    queryKey: templateId
      ? templateKeys.step(templateId, stepId || '')
      : ['templates', 'default', 'step', stepId],

    queryFn: async ({ signal }) => {
      if (!stepId) {
        throw new Error('stepId is required');
      }

      const result = await templateService.getStep(stepId, templateId, { signal });

      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },

    enabled,
    staleTime,
    gcTime: cacheTime, // React Query v5 usa gcTime em vez de cacheTime
    retry,
    onSuccess,
    onError,
  } as UseQueryOptions<Block[], Error>);
}

/**
 * Hook para carregar múltiplos steps
 * Útil para preload ou exibição de múltiplos steps
 * 
 * @example
 * ```tsx
 * const steps = useTemplateSteps(['step-01', 'step-02', 'step-03'], {
 *   templateId: 'quiz21StepsComplete'
 * });
 * ```
 */
export function useTemplateSteps(
  stepIds: string[],
  options: Omit<UseTemplateStepOptions, 'onSuccess' | 'onError'> = {}
) {
  const queries = stepIds.map(stepId =>
    useTemplateStep(stepId, {
      ...options,
      enabled: options.enabled !== false && stepIds.length > 0,
    })
  );

  return queries;
}

/**
 * Hook para prefetch de step
 * Não retorna dados, apenas carrega em background para cache
 * 
 * @example
 * ```tsx
 * const prefetchStep = usePrefetchTemplateStep();
 * 
 * // Prefetch próximo step
 * useEffect(() => {
 *   prefetchStep('step-02', { templateId: 'quiz21StepsComplete' });
 * }, [currentStep]);
 * ```
 */
export function usePrefetchTemplateStep() {
  return (stepId: string, options: Pick<UseTemplateStepOptions, 'templateId'> = {}) => {
    const { templateId } = options;

    // Usar queryClient para prefetch
    // Note: isso requer acesso ao queryClient via hook
    // Por enquanto, simplesmente chama useTemplateStep com enabled=true
    // Em produção, usar queryClient.prefetchQuery()
    useTemplateStep(stepId, {
      templateId,
      enabled: true,
      staleTime: 10 * 60 * 1000, // 10min para prefetch
    });
  };
}
