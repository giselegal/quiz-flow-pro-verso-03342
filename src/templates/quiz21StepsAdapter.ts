/**
 * quiz21StepsAdapter.ts
 * Implementação mínima isolada para evitar reinserção de conteúdo legado.
 */
import { buildCanonicalBlocksTemplate } from '@/domain/quiz/blockTemplateGenerator';
import { getQuizDefinition } from '@/domain/quiz/runtime';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Block = any;

let _cache: Record<string, Block[]> | null = null;
let _lastHash: string | null = null;

function computeDefinitionHash(def: any): string {
    try {
        const json = JSON.stringify(def.steps.map((s: any) => ({ id: s.id, t: s.type, q: s.questionText, n: s.next }))); // reduzir
        let h = 0; for (let i = 0; i < json.length; i++) { h = (h << 5) - h + json.charCodeAt(i); h |= 0; }
        return ('00000000' + (h >>> 0).toString(16)).slice(-8);
    } catch { return '00000000'; }
}

export function invalidateQuizTemplate(reason?: string) {
    // eslint-disable-next-line no-console
    console.info('[quiz21StepsAdapter] invalidando cache', reason || 'sem motivo');
    _cache = null;
    _lastHash = null;
}

function load(): Record<string, Block[]> {
    try {
        const def = getQuizDefinition();
        if (!def) {
            if (!_cache) _cache = {};
            return _cache;
        }
        const currentHash = computeDefinitionHash(def);
        if (_cache && _lastHash === currentHash) {
            return _cache;
        }
        _cache = buildCanonicalBlocksTemplate();
        _lastHash = currentHash;
        return _cache;
    } catch (e) {
        console.warn('[quiz21StepsAdapter] erro ao carregar, usando cache ou vazio', e);
        if (!_cache) _cache = {};
        return _cache;
    }
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
