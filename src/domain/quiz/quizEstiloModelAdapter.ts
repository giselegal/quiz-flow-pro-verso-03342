import { loadQuizEstiloCanonical } from './quizEstiloPublishedFirstLoader';
import { QUIZ_ESTILO_TEMPLATE_ID, canonicalizeQuizEstiloId } from './quiz-estilo-ids';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * Modelo normalizado para o runtime do /quiz-estilo.
 * Centraliza published-first + fallback legacy + geração de stepBlocks.
 */
export interface QuizEstiloModel {
    templateId: string;
    questions: any[]; // TODO: tipar fortemente
    styles: any[];
    scoringMatrix?: Record<string, any>;
    stepBlocks: Record<string, any[]>; // Cada key -> array de blocos (renderer/editor friendly)
    source: 'published' | 'legacy' | 'generated';
    version: number;
    loadedAt: string;
}

interface LoadOptions { force?: boolean; }

let _cache: { model: QuizEstiloModel; ts: number } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minuto

export async function loadQuizEstiloModel(opts?: LoadOptions): Promise<QuizEstiloModel> {
    const force = opts?.force;
    const now = Date.now();
    if (!force && _cache && (now - _cache.ts) < CACHE_TTL) return _cache.model;

    // 1) Published-first (via loader existente)
    try {
        const loaded = await loadQuizEstiloCanonical({ force });
        if (loaded && loaded.questions?.length) {
            const stepBlocks: Record<string, any[]> = {};
            // Se loader já forneceu stepBlocks no formato de objetos simples, adaptar para arrays de blocos
            Object.entries(loaded.stepBlocks || {}).forEach(([k, v]: any) => {
                // Se v já for array, usa direto; se for objeto singular, embrulha; se indefinido, gera placeholder
                if (Array.isArray(v)) stepBlocks[k] = v;
                else if (v && typeof v === 'object') stepBlocks[k] = [v];
                else stepBlocks[k] = [];
            });

            // Garantir contiguidade básica (até número de questões ou mínimo 21 se publicado menor e legacy requer 21)
            const targetLen = Math.max(loaded.questions.length, 0);
            for (let i = 1; i <= targetLen; i++) {
                const key = `step-${i}`;
                if (!stepBlocks[key]) stepBlocks[key] = [];
            }

            const model: QuizEstiloModel = {
                templateId: QUIZ_ESTILO_TEMPLATE_ID,
                questions: loaded.questions,
                styles: loaded.styles || [],
                scoringMatrix: loaded.scoringMatrix,
                stepBlocks,
                source: 'published',
                version: 1,
                loadedAt: new Date().toISOString()
            };
            _cache = { model, ts: now };
            return model;
        }
    } catch (e) {
        if (import.meta.env.DEV) console.warn('[quiz-estilo][model-adapter] Falha published-first, tentando fallback', e);
    }

    // 2) Fallback legacy indireto: aproveitar QUIZ_STEPS (já normalizado) para gerar modelo padrão
    const legacyQuestions = Object.entries(QUIZ_STEPS)
        .filter(([_, step]: any) => ['question', 'strategic-question', 'result', 'offer', 'transition', 'transition-result', 'intro'].includes((step as any).type))
        .map(([key, step]: any, index) => ({
            id: key,
            title: step.questionText || step.title || `Step ${index + 1}`,
            rawType: step.type,
            type: step.type === 'question' ? 'multiple-choice' : step.type,
            stepNumber: parseInt(key.replace('step-', '')) || index + 1,
            requiredSelections: step.requiredSelections || null,
            answers: (step.options || []).map((o: any) => ({ id: `${key}-${o.id}`, text: o.text, image: o.image, stylePoints: {} }))
        }));

    const legacyStyles: any[] = []; // Poderíamos importar styleConfigGisele se necessário (evitar peso aqui)

    // Gerar stepBlocks simples (um bloco por questão)
    const generatedStepBlocks: Record<string, any[]> = {};
    legacyQuestions.forEach((q: any, idx: number) => {
        const stepId = `step-${idx + 1}`;
        generatedStepBlocks[stepId] = [{
            id: q.id,
            type: 'quiz-question-inline',
            order: 0,
            properties: { questionId: q.id, title: q.title, options: q.answers },
            content: { prompt: q.title }
        }];
    });

    const model: QuizEstiloModel = {
        templateId: canonicalizeQuizEstiloId(QUIZ_ESTILO_TEMPLATE_ID) || QUIZ_ESTILO_TEMPLATE_ID,
        questions: legacyQuestions,
        styles: legacyStyles,
        scoringMatrix: undefined,
        stepBlocks: generatedStepBlocks,
        source: 'legacy',
        version: 1,
        loadedAt: new Date().toISOString()
    };
    _cache = { model, ts: now };
    return model;
}

export function clearQuizEstiloModelCache() { _cache = null; }
