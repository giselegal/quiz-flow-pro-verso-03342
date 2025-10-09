import { QUIZ_GLOBAL_CONFIG, QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { Block } from '@/types/editor';
import { QuizTemplateAdapter } from './QuizTemplateAdapter';
import { FunnelDocument, validateFunnelDocument } from '@/schemas/funnelDocument';

// Gera um FunnelDocument a partir do template legacy atual (21 steps)
export async function toFunnelDocument(): Promise<FunnelDocument> {
    const unified = await QuizTemplateAdapter.convertLegacyTemplate();
    const result = validateFunnelDocument(unified as unknown);
    if (!result.valid) {
        throw new Error(`FunnelDocument inválido: ${(result as any).errors?.join(', ')}`);
    }
    return result.data!;
}

// Reconstrói o mapa legacy step-N => Block[] a partir de um FunnelDocument
export function fromFunnelDocument(doc: FunnelDocument): Record<string, Block[]> {
    const stepsMap: Record<string, Block[]> = {};
    for (const step of doc.steps) {
        const key = `step-${step.order}`;
        stepsMap[key] = (step.blocks as unknown as Block[]) || [];
    }
    return stepsMap;
}

// Snapshot rápido: retorna dados essenciais para debug/inspeção
export async function getMigrationSnapshot() {
    const legacy = QUIZ_STYLE_21_STEPS_TEMPLATE;
    const doc = await toFunnelDocument();
    const back = fromFunnelDocument(doc);
    return {
        legacySteps: Object.keys(legacy).length,
        unifiedSteps: doc.steps.length,
        totalBlocksLegacy: Object.values(legacy).reduce((acc, arr) => acc + arr.length, 0),
        totalBlocksUnified: doc.editorMeta.stats.totalBlocks,
        roundTripEqualSteps: Object.keys(back).length === Object.keys(legacy).length,
    };
}
