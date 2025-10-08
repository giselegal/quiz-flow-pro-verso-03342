import { quizEditorBridge } from '@/services/QuizEditorBridge';
import type { QuizStep } from '@/data/quizSteps';
import { vi } from 'vitest';

// Mock supabase to avoid real network
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: () => ({ upsert: () => ({ error: null }), select: () => ({ eq: () => ({ single: () => ({ data: null }) }) }) })
    }
}));

function mkSteps(count = 20): { steps: any[]; asRecord: Record<string, QuizStep> } {
    const stepsArr: any[] = [];
    const record: Record<string, QuizStep> = {} as any;
    const styleIds = ['classico', 'natural', 'contemporâneo', 'elegante', 'romântico', 'sexy', 'dramático', 'criativo'] as const;
    for (let i = 1; i <= count; i++) {
        const id = `step-${String(i).padStart(2, '0')}`;
        const nextStep = i < count ? `step-${String(i + 1).padStart(2, '0')}` : undefined;
        const step: any = {
            id,
            order: i,
            type: 'question',
            options: styleIds.map((sid, idx) => ({ id: sid, text: `Opção ${idx + 1}`, image: 'x.png' })),
            nextStep: i % 2 === 0 ? nextStep : undefined // metade sem nextStep para testar autoFill
        };
        stepsArr.push(step);
        record[id] = { ...step };
    }
    return { steps: stepsArr, asRecord: record };
}

describe('saveDraft autoFill integração', () => {
    it('preenche nextStep ausentes antes de validar e salva sem erro', async () => {
        const { steps } = mkSteps();
        const funnel = {
            id: 'draft-test',
            name: 'Funnel Teste',
            slug: 'quiz-estilo',
            steps,
            isPublished: false,
            version: 1
        } as any;

        const id = await quizEditorBridge.saveDraft(funnel);
        expect(id).toBe('draft-test');
    });
});
