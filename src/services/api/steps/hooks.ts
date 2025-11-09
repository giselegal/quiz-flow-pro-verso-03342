import { useQuery } from '@tanstack/react-query';
import { templateService } from '@/services/canonical/TemplateService';
import type { Block } from '@/types/editor';
import { blockArraySchema } from '@/types/schemas/block';

export const stepKeys = {
  detail: (
    stepId: string | null | undefined,
    templateId?: string | null,
    funnelId?: string | null
  ) => [
    'steps',
    'blocks',
    stepId ?? '_',
    templateId ?? '_',
    funnelId ?? '_',
  ] as const,
};

type UseStepBlocksQueryParams = {
  stepId: string | null | undefined;
  templateId?: string | null;
  funnelId?: string | null;
  enabled?: boolean;
  staleTimeMs?: number;
};

/**
 * Hook para carregar blocos de um step via TemplateService com React Query.
 * - Usa o caminho hierárquico quando o feature flag está ativo.
 * - Mantém compatibilidade com o caminho legado via fallback do service.
 */
export function useStepBlocksQuery({
  stepId,
  templateId,
  funnelId,
  enabled = true,
  staleTimeMs = 30_000,
}: UseStepBlocksQueryParams) {
  return useQuery<Block[], Error>({
    queryKey: stepKeys.detail(stepId, templateId ?? undefined, funnelId ?? undefined),
    queryFn: async () => {
      if (!stepId) throw new Error('stepId inválido');
      const res = await templateService.getStep(stepId, templateId ?? undefined);
      if (res.success) {
        // Validação leve com fallback de normalização
        const parsed = blockArraySchema.safeParse(res.data);
        if (parsed.success) return parsed.data as Block[];
        try {
          const normalized = templateService.normalizeBlocks(res.data as any);
          const reparsed = blockArraySchema.safeParse(normalized);
          if (reparsed.success) return reparsed.data as Block[];
          // Se ainda falhar, retornar normalizado mesmo assim para não quebrar a UI
          return normalized as Block[];
        } catch {
          return res.data as Block[];
        }
      }
      throw res.error ?? new Error('Falha ao carregar blocos');
    },
    enabled: Boolean(enabled && stepId),
    // Valores razoáveis para edição: dados podem ficar um pouco "stale" sem problemas
    staleTime: staleTimeMs,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}
