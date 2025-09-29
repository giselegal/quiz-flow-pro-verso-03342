/**
 * quiz21StepsAdapter.ts
 * Implementação mínima isolada para evitar reinserção de conteúdo legado.
 */
import { buildCanonicalBlocksTemplate } from '@/domain/quiz/blockTemplateGenerator';
import { getQuizDefinition } from '@/domain/quiz/runtime';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Block = any;

let _cache: Record<string, Block[]> | null = null;
function load(): Record<string, Block[]> {
    if (_cache) return _cache;
    try {
        const def = getQuizDefinition();
        _cache = def ? buildCanonicalBlocksTemplate() : {};
    } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[quiz21StepsAdapter] fallback vazio', e);
        _cache = {};
    }
    return _cache;
}

export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, Block[]> = load();
export function getStepTemplate(stepId: string) { return load()[stepId] || null; }
export function getPersonalizedStepTemplate(stepId: string) { return getStepTemplate(stepId); }
export const FUNNEL_PERSISTENCE_SCHEMA = { id: 'quiz21StepsComplete', version: '2.0.0' };
export const QUIZ_GLOBAL_CONFIG = { seo: { title: 'Quiz Estilo Pessoal' } };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const QUIZ_QUESTIONS_COMPLETE: any[] = [];

export const quiz21StepsCompleteTemplate = {
    id: 'quiz21StepsComplete',
    steps: Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).map((id, i) => ({
        id,
        stepNumber: i + 1,
        blocks: QUIZ_STYLE_21_STEPS_TEMPLATE[id] || []
    }))
};

export default quiz21StepsCompleteTemplate;
