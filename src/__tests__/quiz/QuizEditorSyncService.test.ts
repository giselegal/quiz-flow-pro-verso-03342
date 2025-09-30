import { describe, it, expect } from 'vitest';
import { QuizEditorSyncService } from '@/components/editor/services/QuizEditorSyncService';
import { toStepKey } from '@/components/editor/navigation/stepMapping';

function mockEditor(total = 3) {
    const steps = Array.from({ length: total }, (_, i) => toStepKey(i + 1));
    const blocks: Record<string, any[]> = {};
    for (const s of steps) {
        blocks[s] = [
            { id: `${s}-opt-a`, type: 'quiz-option', selected: false, styleTags: ['clássico'] },
            { id: `${s}-opt-b`, type: 'quiz-option', selected: false, styleTags: ['criativo'] }
        ];
    }
    return {
        listAllSteps: () => steps,
        getStepBlocks: (k: string) => blocks[k] || [],
        updateBlock: async (k: string, id: string, upd: any) => {
            const b = blocks[k].find(b => b.id === id);
            Object.assign(b, upd);
        }
    };
}

describe('QuizEditorSyncService', () => {
    it('aplica respostas e recalc pontuação básica', () => {
        const svc = new QuizEditorSyncService({ enableScoreRecompute: true });
        const editor = mockEditor(2);
        svc.attachEditor(editor);
        svc.loadQuizState({ currentStep: 'step-1', answers: {}, scores: { 'clássico': 0, 'criativo': 0 } });

        svc.applyAnswer(1, ['step-1-opt-a']); // clássico +1
        svc.applyAnswer(2, ['step-2-opt-b']); // criativo +1

        const exported = svc.exportQuizState();
        expect(exported?.answers['step-1']).toEqual(['step-1-opt-a']);
        expect(exported?.scores['clássico']).toBe(1);
        expect(exported?.scores['criativo']).toBe(1);
    });
});
