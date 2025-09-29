/**
 * quiz21StepsAdapter.ts
 * Implementação mínima isolada para evitar reinserção de conteúdo legado.
 */
import { buildCanonicalBlocksTemplate, buildBlocksForDefinition } from '@/domain/quiz/blockTemplateGenerator';
import { getQuizDefinition } from '@/domain/quiz/runtime';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Block = any;

let _cache: Record<string, Block[]> | null = null;
let _lastHash: string | null = null;
let _lastMode: QuizDynamicMode | null = null;

// ------------------------------------------------------------
// Feature Flags de Migração
// ------------------------------------------------------------
// Prioridade: ALL > BLOCKS > QUESTIONS
export type QuizDynamicMode = 'all' | 'blocks' | 'questions' | 'legacy';

export function getQuizDynamicMode(): QuizDynamicMode {
    const env = (import.meta as any).env || (globalThis as any).process?.env || {};
    if (env.VITE_QUIZ_DYNAMIC_ALL === '1') return 'all';
    if (env.VITE_QUIZ_DYNAMIC_BLOCKS === '1') return 'blocks';
    if (env.VITE_QUIZ_DYNAMIC_QUESTIONS === '1') return 'questions';
    return 'legacy';
}

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
    _lastMode = null;
}

function load(): Record<string, Block[]> {
    try {
        const def = getQuizDefinition();
        if (!def) {
            if (!_cache) _cache = {};
            return _cache;
        }
        const mode = getQuizDynamicMode();
        const currentHash = computeDefinitionHash(def) + ':' + mode;
        if (_cache && _lastHash === currentHash && _lastMode === mode) {
            return _cache;
        }

        let built: Record<string, Block[]> = {};

        if (mode === 'all') {
            built = buildCanonicalBlocksTemplate();
        } else if (mode === 'blocks') {
            // subset a partir do step 12 (id previsto: step-12)
            const startId = def.steps[11]?.id; // index 11 = 12º step
            const subsetIds = def.steps.slice(11).map((s: any) => s.id);
            built = buildBlocksForDefinition(def, subsetIds);
        } else if (mode === 'questions') {
            // apenas steps tipo question (2–11). Consideramos indexes 1..10
            const qIds = def.steps.filter((s: any) => s.type === 'question').map((s: any) => s.id);
            built = buildBlocksForDefinition(def, qIds);
        } else {
            // legacy mode: construir tudo (para manter compat) – inicialmente mesmo que 'all'
            built = buildCanonicalBlocksTemplate();
        }

        // Log simples (não usar logger central aqui para evitar dependências cíclicas)
        // eslint-disable-next-line no-console
        console.info('[quiz21StepsAdapter] modo', mode, 'stepsConstruidos=', Object.keys(built).length);

        _cache = built;
        _lastHash = currentHash;
        _lastMode = mode;
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
