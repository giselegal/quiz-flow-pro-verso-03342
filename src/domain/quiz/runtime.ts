import { loadQuizDefinition } from './loader';
import type { QuizDefinition, QuestionStep, StrategicStep, OfferStep } from './types';

// Carrega singleton em memória (poderemos futuramente invalidar se version mudar)
let cached: QuizDefinition | null = null;
let loadError: Error | null = null;

export function getQuizDefinition(): QuizDefinition | null {
    // Retorna cache se já carregado ou se erro previamente registrado
    if (cached) return cached;
    if (loadError) return null;
        try {
            const { definition, warnings } = loadQuizDefinition();
            if (warnings.length) {
                console.warn('quiz-definition warnings:', warnings);
            }
            cached = definition;
            return cached;
        } catch (err) {
            loadError = err instanceof Error ? err : new Error(String(err));
            console.error('[quiz-estilo] Falha ao carregar definição canônica:', loadError.message);
            return null;
        }
}

export function findStep(stepId: string) {
    const def = getQuizDefinition();
    if (!def) return undefined;
    return def.steps.find(s => s.id === stepId);
}

export function listSteps() {
    const def = getQuizDefinition();
    return def ? def.steps : [];
}

export function getOfferVariants(): OfferStep['variants'] | [] {
    const def = getQuizDefinition();
    if (!def) return [];
    const offer = def.steps.find(s => s.type === 'offer') as OfferStep | undefined;
    return offer?.variants || [];
}
