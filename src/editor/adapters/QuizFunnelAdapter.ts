import { IFunnelAdapter } from './FunnelAdapterTypes';
import type { FunnelSnapshot, FunnelBlock } from '@/editor/facade/FunnelEditingFacade';
import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';
import type { QuizStep } from '@/data/quizSteps';

const QUIZ_STEP_BLOCK_TYPE = 'quiz-step';

type QuizStepWithId = QuizStep & {
    id: string;
    order?: number;
    blockId?: string;
};

interface QuizStepSource {
    quizSteps?: QuizStepWithId[];
    settings?: Record<string, any> & { quizSteps?: QuizStepWithId[] };
}

const ensureStepId = (step: QuizStepWithId, idx: number) => step.id || `step-${idx + 1}`;

const toBlock = (step: QuizStepWithId): FunnelBlock => ({
    id: step.blockId || `${ensureStepId(step, step.order ?? 0)}-blk`,
    type: QUIZ_STEP_BLOCK_TYPE,
    data: {
        ...step,
        id: ensureStepId(step, step.order ?? 0)
    }
});

const fromBlock = (block: FunnelBlock, fallback: Partial<QuizStepWithId> = {}): QuizStepWithId => {
    const data = (block?.data || {}) as QuizStepWithId;
    const { id: fallbackId, ...fallbackRest } = fallback;
    const { id: dataId, ...dataRest } = data || {};
    const id = dataId || fallbackId || block.id || `step-${Math.random().toString(36).slice(2, 8)}`;
    return {
        id,
        ...(fallbackRest as any),
        ...(dataRest as any),
        blockId: block.id
    } as QuizStepWithId;
};

const extractQuizSteps = (source: QuizStepSource | null): QuizStepWithId[] => {
    if (!source) return [];
    const fromSettings = source.settings?.quizSteps;
    const steps = (source.quizSteps || fromSettings || []) as QuizStepWithId[];
    return steps.map((step, idx) => ({
        ...step,
        id: ensureStepId(step, idx),
        order: step.order ?? idx
    }));
};

export class QuizFunnelAdapter implements IFunnelAdapter {
    readonly type = 'quiz';

    supports(funnel: UnifiedFunnelData | null): boolean {
        // heurística simples: presença de quizSteps ou templateId começando com 'quiz'
        if (!funnel) return true; // criação nova sempre suportada
        const hasQuizSteps = Array.isArray((funnel as any).quizSteps);
        const templateIsQuiz = !!funnel.templateId && funnel.templateId.startsWith('quiz');
        return hasQuizSteps || templateIsQuiz;
    }

    toSnapshot(funnel: UnifiedFunnelData | null): FunnelSnapshot {
        const quizSteps = extractQuizSteps(funnel as unknown as QuizStepSource);
        return {
            steps: quizSteps.map((step, idx) => ({
                id: ensureStepId(step, idx),
                title: step.title || step.questionText || step.type || `Step ${idx + 1}`,
                order: step.order ?? idx,
                blocks: [toBlock(step)],
                meta: {
                    type: step.type,
                    nextStep: (step as any).nextStep,
                    questionNumber: (step as any).questionNumber
                }
            })),
            meta: {
                id: funnel?.id,
                templateId: funnel?.templateId,
                updatedAt: Date.now()
            }
        };
    }

    applySnapshot(snapshot: FunnelSnapshot, base: UnifiedFunnelData): UnifiedFunnelData {
        const quizSteps: QuizStepWithId[] = snapshot.steps.map((step, idx) => {
            const primaryBlock = step.blocks.find(b => b.type === QUIZ_STEP_BLOCK_TYPE) || step.blocks[0];
            const baseData: Partial<QuizStepWithId> = {
                id: step.id || `step-${idx + 1}`,
                type: (step.meta?.type as QuizStep['type']) || 'question',
                order: step.order,
                nextStep: (step.meta as any)?.nextStep,
                questionNumber: (step.meta as any)?.questionNumber
            };
            return fromBlock(primaryBlock, baseData);
        });

        const nextSettings = {
            ...base.settings,
            quizSteps: quizSteps.map(({ blockId, ...rest }) => ({ ...rest }))
        };

        return {
            ...base,
            quizSteps,
            settings: nextSettings
        } as any;
    }
}

export const quizFunnelAdapter = new QuizFunnelAdapter();
