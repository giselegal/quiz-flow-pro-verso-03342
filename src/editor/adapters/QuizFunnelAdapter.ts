import { IFunnelAdapter } from './FunnelAdapterTypes';
import type { FunnelSnapshot } from '@/editor/facade/FunnelEditingFacade';
import type { UnifiedFunnelData } from '@/services/FunnelUnifiedService';

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
        const quizSteps: any[] = (funnel as any)?.quizSteps || [];
        return {
            steps: quizSteps.map((s, idx) => ({
                id: s.id || `step-${idx}`,
                title: s.title || s.questionText || s.type || `Step ${idx + 1}`,
                order: idx,
                blocks: (s.blocks || []).map((b: any) => ({
                    id: b.id || `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    type: b.type || 'unknown',
                    data: b.config || b.data || {}
                })),
                meta: { type: s.type, nextStep: s.nextStep }
            })),
            meta: {
                id: funnel?.id,
                templateId: funnel?.templateId,
                updatedAt: Date.now()
            }
        };
    }

    applySnapshot(snapshot: FunnelSnapshot, base: UnifiedFunnelData): UnifiedFunnelData {
        const quizSteps = snapshot.steps.map(s => ({
            id: s.id,
            title: s.title,
            order: s.order,
            type: s.meta?.type,
            nextStep: s.meta?.nextStep,
            blocks: s.blocks.map(b => ({ id: b.id, type: b.type, config: b.data }))
        }));
        return { ...base, quizSteps } as any;
    }
}

export const quizFunnelAdapter = new QuizFunnelAdapter();
