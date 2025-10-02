import { describe, it, expect } from 'vitest';
import { editorStepsToRuntimeMap } from '../../../runtime/quiz/editorAdapter';

// Mock type minimal
interface EditableQuizStep {
    id: string;
    type: string;
    nextStep?: string;
    requiredSelections?: number;
    questionText?: string;
    questionNumber?: string;
    options?: Array<{ id: string; text: string; image?: string }>;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    title?: string;
    text?: string;
}

describe('editorStepsToRuntimeMap', () => {
    it('converte lista básica preservando campos principais', () => {
        const steps: EditableQuizStep[] = [
            { id: 'step-1', type: 'intro', nextStep: 'step-2', title: 'Intro', formQuestion: 'Nome?', placeholder: 'Seu nome', buttonText: 'Começar' },
            { id: 'step-2', type: 'question', nextStep: 'step-3', questionText: 'Qual estilo?', requiredSelections: 1, options: [{ id: 'natural', text: 'Natural' }] },
            { id: 'step-3', type: 'result', title: 'Resultado', nextStep: 'step-4' },
        ];

        const map = editorStepsToRuntimeMap(steps as any);

        expect(Object.keys(map)).toEqual(['step-1', 'step-2', 'step-3']);
        expect((map['step-2'].options || []).length).toBe(1);
        expect(map['step-2'].questionText).toBe('Qual estilo?');
        expect(map['step-1'].formQuestion).toBe('Nome?');
        expect(map['step-3'].type).toBe('result');
    });

    it('ignora steps sem id', () => {
        const steps: any[] = [
            { id: '', type: 'intro' },
            { id: 'valid', type: 'question', options: [] }
        ];
        const map = editorStepsToRuntimeMap(steps as any);
        expect(Object.keys(map)).toEqual(['valid']);
    });
});
