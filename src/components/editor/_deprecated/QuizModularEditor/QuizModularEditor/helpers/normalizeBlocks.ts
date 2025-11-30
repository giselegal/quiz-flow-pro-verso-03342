import { appLogger } from '@/lib/utils/appLogger';

/**
 * Normaliza e extrai uma lista de blocks a partir de formatos de step variados.
 * Retorna sempre um array seguro para evitar crashes na UI.
 */
export function extractBlocksFromStepData(raw: any, stepId: string) {
  try {
    if (!raw) {
      appLogger.debug(`[extractBlocks] Dados nulos para ${stepId}`);
      return [] as any[];
    }

    if (Array.isArray(raw)) {
      const blocks = raw.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
      appLogger.debug(`[extractBlocks] Array direto: ${blocks.length} blocos válidos para ${stepId}`);
      return blocks as any[];
    }

    if (raw.blocks && Array.isArray(raw.blocks)) {
      const blocks = raw.blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
      appLogger.debug(`[extractBlocks] Formato {blocks}: ${blocks.length} blocos válidos para ${stepId}`);
      return blocks as any[];
    }

    if (raw.steps && raw.steps[stepId]?.blocks && Array.isArray(raw.steps[stepId].blocks)) {
      const blocks = raw.steps[stepId].blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
      appLogger.debug(`[extractBlocks] Formato {steps}: ${blocks.length} blocos válidos para ${stepId}`);
      return blocks as any[];
    }

    if (raw.steps && Array.isArray(raw.steps)) {
      const found = raw.steps.find((s: any) => s?.id === stepId || String(s?.id) === String(Number(stepId.replace(/^step-/, ''))));
      if (found && Array.isArray(found.blocks)) {
        const blocks = found.blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
        appLogger.debug(`[extractBlocks] Formato steps[] encontrado: ${blocks.length} blocos válidos para ${stepId}`);
        return blocks as any[];
      }
    }

    appLogger.error(`[extractBlocks] Formato não reconhecido para ${stepId}`, {
      dataType: typeof raw,
      keys: Object.keys(raw || {}).slice(0, 10),
      hasBlocks: !!raw?.blocks,
      hasSteps: !!raw?.steps,
    });

    return [] as any[];
  } catch (err) {
    appLogger.error(`[extractBlocks] Exceção ao normalizar ${stepId}`, {
      error: (err as Error)?.message,
      stack: (err as Error)?.stack?.split('\n').slice(0, 3),
    });
    return [] as any[];
  }
}

export default extractBlocksFromStepData;
