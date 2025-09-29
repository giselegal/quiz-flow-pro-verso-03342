import { loadQuizDefinition } from './loader';
import type { QuizDefinition, QuestionStep, StrategicStep, OfferStep } from './types';

// Carrega singleton em memória (poderemos futuramente invalidar se version mudar)
let cached: QuizDefinition | null = null;
let loadError: Error | null = null;

export function getQuizDefinition(): QuizDefinition | null {
    if (cached || loadError) return cached;
    const { definition, warnings } = loadQuizDefinition();
    if (warnings.length) {
        console.warn('quiz-definition warnings:', warnings);
    }
    cached = definition;
    return cached;
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
