import type { QuizStep } from '@/data/quizSteps';
import type { Block } from '@/types/editor';

/**
 * Mapeia blocos do editor (agrupados por step-X) para uma sequência de QuizStep mínima
 * Foco Fase 3 preview: extrair apenas campos usados pelo runtime atual.
 */
export function mapEditorBlocksToQuizSteps(stepBlocks: Record<string, Block[]>): QuizStep[] {
    if (!stepBlocks || typeof stepBlocks !== 'object') {
        console.warn('[mapEditorBlocksToQuizSteps] stepBlocks inválido ou ausente');
        return [];
    }
    const stepKeys = Object.keys(stepBlocks).sort((a, b) => {
        const na = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
        const nb = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
        return na - nb;
    });

    const steps: QuizStep[] = [];

    for (const key of stepKeys) {
        const blocks = Array.isArray(stepBlocks[key]) ? stepBlocks[key] : [];
        if (!blocks.length) {
            continue;
        }

        // Heurística: primeiro bloco com tipo 'quiz-intro' vira intro; 'quiz-question-inline' vira question.
        // Ajustar conforme emergirem blocos novos.
        const primary = blocks[0];
        if (!primary || typeof primary !== 'object') {
            console.warn('[mapEditorBlocksToQuizSteps] Bloco primário inválido para key', key);
            continue;
        }
        const typeMap: Record<string, QuizStep['type']> = {
            'quiz-intro': 'intro',
            'quiz-question-inline': 'question',
            'quiz-transition': 'transition',
            'quiz-transition-result': 'transition-result',
            'quiz-result': 'result',
            'quiz-offer': 'offer'
        };
        const resolvedType = typeMap[primary.type] || 'question';

        if (!['intro', 'question', 'strategic-question', 'transition', 'transition-result', 'result', 'offer'].includes(resolvedType)) {
            console.warn('[mapEditorBlocksToQuizSteps] Tipo não suportado mapeado como question fallback:', primary.type);
        }

        const quizStep: QuizStep = {
            type: resolvedType as QuizStep['type'],
            title: (primary as any).properties?.title || (primary as any).content?.title,
            questionText: (primary as any).properties?.question || (primary as any).properties?.text,
            image: (primary as any).properties?.image,
            requiredSelections: (primary as any).properties?.requiredSelections,
            options: (primary as any).properties?.options
        };

        if (!quizStep.title && !quizStep.questionText) {
            console.warn('[mapEditorBlocksToQuizSteps] Step sem título e sem questionText ignorado', { key, primaryType: primary.type });
            // ainda assim podemos incluí-lo como placeholder; optar por ignorar por enquanto:
            // continue;
        }

        steps.push(quizStep);
    }

    if (steps.length === 0) {
        console.info('[mapEditorBlocksToQuizSteps] Nenhum step válido mapeado');
    }
    return steps;
}
