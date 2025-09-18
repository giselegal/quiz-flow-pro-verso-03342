import { describe, it, expect } from 'vitest';
import { toCanonicalAny } from '../adapters';
import { accumulateScores } from '../CanonicalScorer';

describe('Adapters + CanonicalScorer', () => {
    it('converte template options-grid para canônico e acumula pontuações', () => {
        const template = {
            'step-2': [
                {
                    id: 'q1',
                    type: 'options-grid',
                    content: {
                        question: 'Pergunta?',
                        options: [
                            { id: 'natural_q1', text: 'A' },
                            { id: 'classico_q1', text: 'B' },
                        ],
                    },
                    properties: { scoreValues: { natural: 2, classico: 1 }, requiredSelections: 1 },
                },
            ],
        } as any;

        const quiz = toCanonicalAny(template);
        expect(quiz.questions.length).toBeGreaterThan(0);
        const q = quiz.questions[0];
        expect(q.kind).toBe('scored');
        expect(q.options[0].score).toEqual({ natural: 2 });

        const scores = accumulateScores(quiz, { [q.id]: ['natural_q1'] });
        expect(scores.natural).toBe(2);
    });

    it('converte optimized (questionData) para canônico e acumula scores', () => {
        const optimized = {
            questionData: [
                {
                    id: 'q1',
                    text: 'Pergunta 1',
                    options: [
                        { id: 'a', text: 'A', score: { natural: 3 } },
                        { id: 'b', text: 'B', score: { classico: 1 } },
                    ],
                    selectionMode: 'single',
                },
            ],
        } as any;

        const quiz = toCanonicalAny(optimized);
        const q = quiz.questions[0];
        expect(q.kind).toBe('scored');
        const scores = accumulateScores(quiz, { [q.id]: ['a'] });
        expect(scores.natural).toBe(3);
    });
});
