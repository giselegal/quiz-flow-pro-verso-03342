import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Normaliza payload de step para um array consistente de blocos.
 * Aceita três formatos:
 * 1. Array direto
 * 2. Objeto com .blocks
 * 3. Objeto { steps: { stepId: { blocks: [] } } }
 */
export function normalizeStepPayload(raw: any, stepId: string): Block[] {
  try {
    if (!raw) return [];

    if (Array.isArray(raw)) {
      return raw.filter((b: any) => b && b.id && b.type);
    }
    if (raw.blocks && Array.isArray(raw.blocks)) {
      return raw.blocks.filter((b: any) => b && b.id && b.type);
    }
    if (raw.steps && raw.steps[stepId]?.blocks && Array.isArray(raw.steps[stepId].blocks)) {
      return raw.steps[stepId].blocks.filter((b: any) => b && b.id && b.type);
    }

    appLogger.warn('[normalizeStepPayload] Formato não reconhecido', {
      stepId,
      keys: Object.keys(raw)
    });
    return [];
  } catch (e) {
    appLogger.error('[normalizeStepPayload] Erro ao normalizar', { stepId, error: e });
    return [];
  }
}
