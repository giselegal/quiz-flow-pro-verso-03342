import { blockRegistry } from '@/domain/blocks';
import { CanonicalStep } from './QuizEstiloLoaderGateway';
import type { Block } from '@/types/editor';

/**
 * Converte um CanonicalStep em uma lista de Blocks do editor.
 * Inicialmente 1:1 (um bloco principal por step). Pode evoluir para múltiplos.
 */
export function mapStepToBlocks(step: CanonicalStep): Block[] {
    switch (step.kind) {
        case 'intro':
            return [blockRegistry.create('heading', {
                id: `${step.id}-intro-heading`,
                properties: { text: step.title || 'Bem-vinda!', level: 1 }
            }) as any];
        case 'question':
        case 'strategic-question':
            return [blockRegistry.create('quiz-question-inline', {
                id: `${step.id}-question`,
                properties: {
                    title: step.title || 'Pergunta',
                    options: step.options || [],
                    requiredSelections: step.requiredSelections,
                    autoAdvance: step.autoAdvance
                }
            }) as any];
        case 'transition':
            return [blockRegistry.create('quiz-transition', {
                id: `${step.id}-transition`,
                properties: { label: step.title || 'Transição' }
            }) as any];
        case 'result':
            return [blockRegistry.create('quiz-result', {
                id: `${step.id}-result`,
                properties: { title: step.title || 'Resultados' }
            }) as any];
        case 'offer':
            return [blockRegistry.create('quiz-offer', {
                id: `${step.id}-offer`,
                properties: { title: step.title || 'Oferta' }
            }) as any];
        default:
            return [blockRegistry.create('heading', {
                id: `${step.id}-fallback`,
                properties: { text: step.title || step.id }
            }) as any];
    }
}

export function mapStepsToStepBlocks(steps: CanonicalStep[]): Record<string, Block[]> {
    const result: Record<string, Block[]> = {};
    steps.forEach(step => { result[step.id] = mapStepToBlocks(step); });
    return result;
}
