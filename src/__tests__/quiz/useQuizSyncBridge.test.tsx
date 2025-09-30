import { renderHook, act } from '@testing-library/react';
import useQuizSyncBridge from '@/pages/editor/modern/hooks/useQuizSyncBridge';
import { QUIZ_ESTILO_TEMPLATE_ID } from '@/domain/quiz/quiz-estilo-ids';

// Mock mínimo de unifiedEditor
function createMockUnifiedEditor() {
    const steps = ['step-1'];
    const blocks: any[] = [
        { id: 'opt-1', type: 'quiz-option', selected: false, styleTags: ['styleA'] },
        { id: 'opt-2', type: 'quiz-option', selected: false, styleTags: ['styleB'] }
    ];
    return {
        getBlocksByStep: (stepKey: string) => stepKey === 'step-1' ? blocks : [],
        updateBlock: async (_stepKey: string, blockId: string, updates: any) => {
            const idx = blocks.findIndex(b => b.id === blockId); if (idx >= 0) blocks[idx] = { ...blocks[idx], ...updates };
        },
        listSteps: () => steps,
        markDirty: () => { }
    };
}

describe('useQuizSyncBridge', () => {
    it('inicializa serviço e aplica respostas', async () => {
        const unifiedEditor = createMockUnifiedEditor();
        const extractedInfo = { templateId: QUIZ_ESTILO_TEMPLATE_ID, funnelId: null, type: 'quiz-template' } as any;

        const { result } = renderHook(() => useQuizSyncBridge({ extractedInfo, unifiedEditor, crudContext: {} }));

        expect(result.current.active).toBe(true);
        expect(result.current.answersCount).toBe(0);

        act(() => {
            result.current.applyAnswer?.('step-1', ['opt-1']);
        });

        // Após aplicar resposta deve atualizar answersCount e marcar bloco
        expect(result.current.answersCount).toBe(1);
        const updatedBlocks = unifiedEditor.getBlocksByStep('step-1');
        expect(updatedBlocks.find((b: any) => b.id === 'opt-1')?.selected).toBe(true);
    });
});
