import { QuizEditorSyncService } from '@/components/editor/services/QuizEditorSyncService';

function createMockEditor() {
    return {
        getStepBlocks: () => [],
        updateBlock: async () => { },
        listAllSteps: () => ['step-1', 'step-2', 'step-3']
    };
}

describe('QuizEditorSyncService step sync', () => {
    it('atualiza currentStep via setCurrentStep idempotente', () => {
        const svc = new QuizEditorSyncService();
        svc.attachEditor(createMockEditor());
        svc.loadQuizState({ currentStep: 'step-1', answers: {}, scores: {} });
        expect(svc.exportQuizState()!.currentStep).toBe('step-1');
        svc.setCurrentStep('step-2');
        expect(svc.exportQuizState()!.currentStep).toBe('step-2');
        // idempotente
        const before = svc.exportQuizState();
        svc.setCurrentStep('step-2');
        expect(svc.exportQuizState()!.currentStep).toBe(before!.currentStep);
    });
});
