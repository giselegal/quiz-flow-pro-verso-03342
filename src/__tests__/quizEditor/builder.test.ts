import { describe, it, expect } from 'vitest';
import { buildQuizEditableModel } from '@/utils/quizQuestionBuilder';

describe('buildQuizEditableModel', () => {
    it('constrói questions e styles com contagens > 0', () => {
        const { questions, styles } = buildQuizEditableModel();
        expect(questions.length).toBeGreaterThan(0);
        expect(styles.length).toBeGreaterThan(0);
        // IDs estáveis
        expect(questions[0].id).toBeTruthy();
    });
});
