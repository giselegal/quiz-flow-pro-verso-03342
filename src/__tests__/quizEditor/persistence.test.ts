import { describe, it, expect } from 'vitest';
import { QuizEditorPersistenceService } from '@/services/QuizEditorPersistenceService';
import { QUIZ_EDITOR_VERSION, QuizTemplateData } from '@/types/quizEditor';

const sample: QuizTemplateData = {
    templateId: 'quiz-estilo',
    version: QUIZ_EDITOR_VERSION,
    questions: [{ id: 'q1', stepNumber: 1, title: 'Pergunta 1', type: 'multiple-choice', answers: [] }],
    styles: [{ id: 's1', name: 'Estilo 1' } as any],
    updatedAt: new Date().toISOString()
};

describe('QuizEditorPersistenceService', () => {
    it('salva e carrega dados', async () => {
        const saveResult = await QuizEditorPersistenceService.save(sample);
        expect(saveResult.success).toBe(true);
        const loaded = await QuizEditorPersistenceService.load('quiz-estilo');
        expect(loaded?.questions?.[0].id).toBe('q1');
        expect(loaded?.styles?.length).toBe(1);
    });
});
