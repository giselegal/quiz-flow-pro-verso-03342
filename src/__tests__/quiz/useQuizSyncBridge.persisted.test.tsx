import { renderHook, waitFor } from '@testing-library/react';
import useQuizSyncBridge from '@/pages/editor/modern/hooks/useQuizSyncBridge';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

vi.mock('@/supabase/config', () => {
    return {
        getSupabase: () => ({
            from: () => ({
                select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { state_json: { currentStep: 'step-3', answers: { 'step-2': ['x'] }, scores: { styleA: 5, styleB: 1 }, userProfile: { level: 2 } }, error: null } }) }) })
            })
        })
    };
});

function createMockUnifiedEditor() {
    return {
        getBlocksByStep: () => [],
        updateBlock: async () => { },
        listSteps: () => ['step-1', 'step-2', 'step-3'],
        funnel: { id: 'funnel-123' }
    };
}

describe('useQuizSyncBridge - carga persistida', () => {
    it('carrega currentStep e scores persistidos', async () => {
        const unifiedEditor = createMockUnifiedEditor();
        const extractedInfo = { templateId: QUIZ_ESTILO_TEMPLATE_ID, funnelId: 'funnel-123', type: 'quiz-template' } as any;

        const { result } = renderHook(() => useQuizSyncBridge({ extractedInfo, unifiedEditor, crudContext: {} }));

        await waitFor(() => {
            expect(result.current.currentStepKey).toBe('step-3');
        });
        expect(result.current.scores?.styleA).toBe(5);
        expect(result.current.answersCount).toBe(1);
    });
});
