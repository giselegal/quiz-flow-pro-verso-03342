/**
 * 🚀 LAZY LOADING STRATEGY FOR QUIZ STEPS
 * 
 * Virtualiza o carregamento dos dados de quiz steps para melhorar
 * performance inicial do editor.
 * 
 * Estratégia:
 * - Import dinâmico sob demanda
 * - Cache de steps carregados
 * - Pré-carregamento inteligente de steps adjacentes
 */

import type { QuizStep } from './quizSteps';

// Cache em memória dos steps já carregados
const stepsCache = new Map<string, QuizStep>();

// Promise cache para evitar múltiplas requisições simultâneas
const loadingPromises = new Map<string, Promise<QuizStep>>();

/**
 * Carrega um step específico de forma lazy
 */
export async function loadQuizStep(stepId: string): Promise<QuizStep | null> {
    // 1. Verificar cache
    if (stepsCache.has(stepId)) {
        return stepsCache.get(stepId)!;
    }

    // 2. Verificar se já está carregando
    if (loadingPromises.has(stepId)) {
        return loadingPromises.get(stepId)!;
    }

    // 3. Carregar dinamicamente
    const loadPromise = (async () => {
        try {
            const { QUIZ_STEPS } = await import('./quizSteps');
            const step = (QUIZ_STEPS as any)[stepId];

            if (step) {
                stepsCache.set(stepId, step);
                return step;
            }

            return null;
        } catch (error) {
            console.error(`Erro ao carregar step ${stepId}:`, error);
            return null;
        } finally {
            loadingPromises.delete(stepId);
        }
    })();

    loadingPromises.set(stepId, loadPromise);
    return loadPromise;
}

/**
 * Carrega múltiplos steps em paralelo
 */
export async function loadQuizSteps(stepIds: string[]): Promise<Map<string, QuizStep>> {
    const results = await Promise.all(
        stepIds.map(id => loadQuizStep(id))
    );

    const stepsMap = new Map<string, QuizStep>();
    stepIds.forEach((id, index) => {
        const step = results[index];
        if (step) {
            stepsMap.set(id, step);
        }
    });

    return stepsMap;
}

/**
 * Pré-carrega steps adjacentes para melhorar UX
 */
export function preloadAdjacentSteps(currentStepId: string, range: number = 2) {
    const match = currentStepId.match(/step-(\d+)/);
    if (!match) return;

    const currentNum = parseInt(match[1], 10);
    const toPreload: string[] = [];

    for (let i = Math.max(1, currentNum - range); i <= Math.min(21, currentNum + range); i++) {
        const stepId = `step-${String(i).padStart(2, '0')}`;
        if (stepId !== currentStepId && !stepsCache.has(stepId)) {
            toPreload.push(stepId);
        }
    }

    if (toPreload.length > 0) {
        // Fire and forget - não bloqueia
        loadQuizSteps(toPreload).catch(err => {
            console.warn('Falha ao pré-carregar steps adjacentes:', err);
        });
    }
}

/**
 * Carrega todos os steps de uma vez (fallback para modo eager)
 */
export async function loadAllQuizSteps(): Promise<Map<string, QuizStep>> {
    try {
        const { QUIZ_STEPS, STEP_ORDER } = await import('./quizSteps');

        const stepsMap = new Map<string, QuizStep>();
        STEP_ORDER.forEach(stepId => {
            const step = (QUIZ_STEPS as any)[stepId];
            if (step) {
                stepsCache.set(stepId, step);
                stepsMap.set(stepId, step);
            }
        });

        return stepsMap;
    } catch (error) {
        console.error('Erro ao carregar todos os steps:', error);
        return new Map();
    }
}

/**
 * Limpa o cache (útil para hot reload durante dev)
 */
export function clearStepsCache() {
    stepsCache.clear();
    loadingPromises.clear();
}

/**
 * Retorna estatísticas do cache
 */
export function getCacheStats() {
    return {
        cached: stepsCache.size,
        loading: loadingPromises.size,
        cachedSteps: Array.from(stepsCache.keys())
    };
}

/**
 * Hook para ordem dos steps (síncrono, apenas IDs)
 */
export const STEP_ORDER = [
    'step-01', 'step-02', 'step-03', 'step-04', 'step-05', 'step-06', 'step-07',
    'step-08', 'step-09', 'step-10', 'step-11', 'step-12', 'step-13', 'step-14',
    'step-15', 'step-16', 'step-17', 'step-18', 'step-19', 'step-20', 'step-21'
];
