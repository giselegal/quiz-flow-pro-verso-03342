import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';

const questionData: any = {
    type: 'question',
    questionNumber: '1 de 10',
    questionText: 'Escolha 3 estilos',
    requiredSelections: 3,
    options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
        { id: 'c', text: 'C' }
    ]
};

describe('Callback guards', () => {
    it('QuestionStep não quebra sem onAnswersChange', () => {
        const { getByText } = render(<QuestionStep data={questionData} currentAnswers={[]} onAnswersChange={undefined as any} />);
        fireEvent.click(getByText('A'));
        expect(getByText('Escolha 3 estilos')).toBeTruthy();
    });
    it('StrategicQuestionStep não quebra sem onAnswerChange', () => {
        const strategicData: any = {
            type: 'strategic-question',
            questionText: 'Objetivo principal?',
            options: [{ id: 'x', text: 'X' }]
        };
        const { getByText } = render(<StrategicQuestionStep data={strategicData} currentAnswer="" onAnswerChange={undefined as any} />);
        fireEvent.click(getByText('X'));
        expect(getByText('Objetivo principal?')).toBeTruthy();
    });
});
