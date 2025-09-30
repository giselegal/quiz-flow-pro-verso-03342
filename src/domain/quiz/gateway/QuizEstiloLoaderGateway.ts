import { loadQuizEstiloCanonical } from '@/domain/quiz/quizEstiloPublishedFirstLoader';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';
import { getQuizDefinition } from '@/domain/quiz/runtime';
import { QUIZ_STEPS } from '@/data/quizSteps';

/**
 * 🔌 QuizEstiloLoaderGateway
 * Unifica estratégia de carregamento do modelo canônico do quiz-estilo.
 * Ordem de prioridade:
 * 1. published-first loader (dados publicados / persistidos)
 * 2. runtime canonical definition (getQuizDefinition)
 * 3. fallback derivado de QUIZ_STEPS legacy normalizado
 */

export interface CanonicalStep {
    id: string;
    kind: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
    title?: string;
    requiredSelections?: number;
    autoAdvance?: boolean;
    options?: any[];
    strategicKey?: string;
}

export interface CanonicalQuizDefinition {
    templateId: string;
    steps: CanonicalStep[];
    progress: { countedStepIds: string[] };
    version: string;
    source: 'published' | 'runtime' | 'legacy-fallback';
}

function adaptPublishedQuestions(loaded: any): CanonicalStep[] {
    // loaded.questions esperado array
    return (loaded.questions || []).map((q: any, index: number) => {
        const base: CanonicalStep = {
            id: `step-${index + 1}`,
            kind: 'question',
            title: q.title || q.text || `Pergunta ${index + 1}`,
            options: q.options || q.answers || [],
            autoAdvance: index + 1 >= 2 && index + 1 <= 11,
            requiredSelections: index + 1 >= 2 && index + 1 <= 11 ? 3 : (index + 1 >= 13 && index + 1 <= 18 ? 1 : undefined)
        };
        return base;
    });
}

function legacyFallback(): CanonicalStep[] {
    return Object.entries(QUIZ_STEPS).map(([id, step]: any) => {
        const kindMap: Record<string, CanonicalStep['kind']> = {
            intro: 'intro',
            question: 'question',
            'strategic-question': 'strategic-question',
            transition: 'transition',
            'transition-result': 'transition',
            result: 'result',
            offer: 'offer'
        };
        const kind = kindMap[step.type] || 'question';
        return {
            id,
            kind,
            title: step.title || step.questionText,
            requiredSelections: step.requiredSelections,
            autoAdvance: step.autoAdvance,
            options: step.options,
            strategicKey: step.strategicKey
        } as CanonicalStep;
    });
}

export class QuizEstiloLoaderGateway {
    private cached: CanonicalQuizDefinition | null = null;

    async load(): Promise<CanonicalQuizDefinition> {
        if (this.cached) return this.cached;

        // 1. Published-first
        try {
            const published = await loadQuizEstiloCanonical();
            if (published) {
                const steps = adaptPublishedQuestions(published);
                // Inserir transições / resultado / oferta se não existirem
                const ensureUnique = (id: string, kind: CanonicalStep['kind'], title: string) => {
                    if (!steps.find(s => s.id === id)) {
                        steps.push({ id, kind, title });
                    }
                };
                ensureUnique('step-12', 'transition', 'Transição Estratégica');
                ensureUnique('step-19', 'transition', 'Pré-Resultados');
                ensureUnique('step-20', 'result', 'Resultados');
                ensureUnique('step-21', 'offer', 'Oferta');

                const counted = steps.filter(s => ['question', 'strategic-question'].includes(s.kind)).map(s => s.id);
                this.cached = {
                    templateId: QUIZ_ESTILO_TEMPLATE_ID,
                    steps: steps.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1])),
                    progress: { countedStepIds: counted },
                    version: '1.0.0',
                    source: 'published'
                };
                return this.cached;
            }
        } catch (err) {
            console.warn('[QuizEstiloLoaderGateway] published-first falhou', err);
        }

        // 2. Runtime canonical (se disponível)
        try {
            const runtime = getQuizDefinition();
            if (runtime) {
                const steps: CanonicalStep[] = runtime.steps.map((s: any) => ({
                    id: s.id,
                    kind: (s.type === 'transition-result' ? 'transition' : s.type) as any,
                    title: s.title || s.questionText,
                    requiredSelections: s.requiredSelections,
                    autoAdvance: s.autoAdvance,
                    options: s.options,
                    strategicKey: s.strategicKey
                }));
                this.cached = {
                    templateId: QUIZ_ESTILO_TEMPLATE_ID,
                    steps,
                    progress: { countedStepIds: runtime.progress?.countedStepIds || [] },
                    version: runtime.version || 'runtime-1',
                    source: 'runtime'
                };
                return this.cached;
            }
        } catch (err) {
            console.warn('[QuizEstiloLoaderGateway] runtime canonical indisponível', err);
        }

        // 3. Fallback QUIZ_STEPS
        const legacy = legacyFallback();
        const counted = legacy.filter(s => ['question', 'strategic-question'].includes(s.kind)).map(s => s.id);
        this.cached = {
            templateId: QUIZ_ESTILO_TEMPLATE_ID,
            steps: legacy,
            progress: { countedStepIds: counted },
            version: 'legacy-fallback-1',
            source: 'legacy-fallback'
        };
        return this.cached;
    }

    invalidate() {
        this.cached = null;
    }
}

export const quizEstiloLoaderGateway = new QuizEstiloLoaderGateway();
