import type { Block } from '@/types/editor';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * BlockEditingService
 * Adaptador fino para persistir blocos de uma etapa usando o TemplateService canônico.
 */
export async function persistBlocks(
  stepId: string,
  funnelId: string,
  blocks: Block[],
): Promise<void> {
  try {
    // Garantir ordem sequencial estável
    const normalized = (blocks || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((b, i) => ({ ...b, order: i }));

    // Vincular funil ativo para direcionar USER_EDIT no HierarchicalTemplateSource
    templateService.setActiveFunnel(funnelId);

    const result = await templateService.saveStep(stepId, normalized);
    if (!result.success) {
      throw result.error || new Error('Falha ao salvar etapa');
    }
    appLogger.info('[BlockEditingService] Step salvo com sucesso', { data: [{ stepId, blocks: normalized.length }] });
  } catch (error) {
    appLogger.error('[BlockEditingService] Erro ao persistir blocos', { data: [error] });
    throw error;
  }
}
