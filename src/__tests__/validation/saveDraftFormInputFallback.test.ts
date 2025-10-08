import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { vi, describe, it, expect } from 'vitest';

// Mock supabase para salvar draft
vi.mock('@/integrations/supabase/client', () => ({
    supabase: {
        from: () => ({ upsert: () => ({ error: null }) })
    }
}));

function makeStepsWithoutFormInput() {
    const steps: any[] = [];
    // step-01 intro sem formQuestion / placeholder / buttonText
    steps.push({
        id: 'step-01',
        order: 1,
        type: 'intro',
        // campos faltando de propósito
    });
    // demais steps mínimas questions
    for (let i = 2; i <= 20; i++) {
        const id = `step-${String(i).padStart(2, '0')}`;
        steps.push({
            id,
            order: i,
            type: 'question',
            options: ['classico', 'natural', 'contemporâneo', 'elegante', 'romântico', 'sexy', 'dramático', 'criativo'].map((sid, idx) => ({ id: sid, text: `Opção ${idx + 1}`, image: 'x.png' })),
            nextStep: i < 20 ? `step-${String(i + 1).padStart(2, '0')}` : undefined
        });
    }
    return steps;
}

describe('Fallback de formInput (step-01)', () => {
    it('salva draft mesmo sem campos de formInput iniciais', async () => {
        const funnel: any = {
            id: 'draft-form-fallback',
            name: 'Draft Form Fallback',
            slug: 'quiz-estilo',
            steps: makeStepsWithoutFormInput(),
            isPublished: false,
            version: 1
        };

        const id = await quizEditorBridge.saveDraft(funnel);
        expect(id).toBe('draft-form-fallback');
    });
});
