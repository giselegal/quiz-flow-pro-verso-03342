import { getPublishedTemplate } from '@/services/PublishedTemplateRuntimeService';
import { QUIZ_ESTILO_TEMPLATE_ID } from './quiz-estilo-ids';

/**
 * Carrega template quiz-estilo priorizando versão publicada.
 * Fallback: importa adapter legacy mínimo apenas se não houver publicação.
 */
export async function loadQuizEstiloCanonical(options?: { force?: boolean }) {
    const templateId = QUIZ_ESTILO_TEMPLATE_ID;
    let published = await getPublishedTemplate(templateId, { force: options?.force });

    if (published && published.questions?.length) {
        // Gerar stepBlocks se não vieram (mantendo padrão usado na publicação)
        const stepBlocks: Record<string, any> = {};
        published.questions.forEach((q: any, index: number) => {
            const stepId = `step-${index + 1}`;
            stepBlocks[stepId] = {
                id: stepId,
                type: q.rawType || q.type || 'question',
                questionId: q.id,
                order: index + 1,
                title: q.title,
                meta: { requiredSelections: q.requiredSelections || null }
            };
        });
        return {
            source: 'published',
            templateId,
            questions: published.questions,
            styles: published.styles || [],
            scoringMatrix: published.scoringMatrix,
            stepBlocks
        };
    }

    // Fallback legacy (lazy import para não pesar bundle)
    try {
        const legacy = await import('@/templates/quiz21StepsComplete');
        const base = (legacy as any).QUIZ_STYLE_21_STEPS_TEMPLATE || (legacy as any).default || {};
        const questions = base.questions || base.QUIZ_QUESTIONS_COMPLETE || [];
        const styles = base.styles || base.QUIZ_STYLES || [];
        const stepBlocks: Record<string, any> = {};
        // Se houver blocks no legacy, tentar normalizar
        if (base.blocks && typeof base.blocks === 'object') {
            Object.keys(base.blocks).forEach((k, i) => {
                const bArr = base.blocks[k];
                stepBlocks[k] = {
                    id: k,
                    type: Array.isArray(bArr) && bArr[0]?.type ? bArr[0].type : 'question',
                    questionId: questions[i]?.id,
                    order: i + 1,
                    title: questions[i]?.title,
                    meta: {}
                };
            });
        } else {
            questions.forEach((q: any, index: number) => {
                const stepId = `step-${index + 1}`;
                stepBlocks[stepId] = {
                    id: stepId,
                    type: q.rawType || q.type || 'question',
                    questionId: q.id,
                    order: index + 1,
                    title: q.title,
                    meta: { requiredSelections: q.requiredSelections || null }
                };
            });
        }
        return {
            source: 'legacy',
            templateId,
            questions,
            styles,
            scoringMatrix: base.scoringMatrix || base.SCORING_MATRIX || undefined,
            stepBlocks
        };
    } catch (e) {
        console.error('❌ Falha ao carregar fallback legacy quiz-estilo:', e);
        return null;
    }
}
