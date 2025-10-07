import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

// Mockar todos os componentes de produção antes de importar o adapter para evitar side-effects pesados
vi.mock('@/components/quiz/IntroStep', () => ({ default: () => null }));
vi.mock('@/components/quiz/StrategicQuestionStep', () => ({ default: () => null }));
vi.mock('@/components/quiz/TransitionStep', () => ({ default: () => null }));
vi.mock('@/components/quiz/ResultStep', () => ({ default: () => null }));
vi.mock('@/components/quiz/OfferStep', () => ({ default: () => null }));

// Mock do componente OriginalQuestionStep para isolar lógica do adapter
vi.mock('@/components/quiz/QuestionStep', () => ({
    __esModule: true,
    default: ({ data, currentAnswers, onAnswersChange }: any) => (
        <div>
            <div data-testid="required">{data.requiredSelections}</div>
            {data.options.map((opt: any) => (
                <button
                    key={opt.id}
                    data-testid={`opt-${opt.id}`}
                    onClick={() => {
                        const next = currentAnswers.includes(opt.id)
                            ? currentAnswers.filter((a: string) => a !== opt.id)
                            : [...currentAnswers, opt.id];
                        onAnswersChange(next);
                    }}
                >{opt.text}</button>
            ))}
            <div data-testid="answers">{currentAnswers.join(',')}</div>
        </div>
    )
}));

let QuestionStepAdapter: any;
beforeAll(async () => {
    // Import tardio após mocks
    ({ QuestionStepAdapter } = await import('@/components/step-registry/ProductionStepsRegistry'));
});

// Wrapper stateful para simular ciclo de salvamento -> re-render

const QuestionAdapterTestWrapper = ({
    stepId,
    requiredSelections,
    options,
    onNext,
}: {
    stepId: string;
    requiredSelections: number;
    options: { id: string; text: string }[];
    onNext: () => void;
}) => {
    const [answers, setAnswers] = useState<string[]>([]);
    return (
        <QuestionStepAdapter
            stepId={stepId}
            stepNumber={Number(stepId.replace('step-', ''))}
            isActive
            isEditable={false}
            onNext={onNext}
            onPrevious={() => { }}
            onSave={(payload: Record<string, any>) => {
                const arr = payload[stepId];
                if (Array.isArray(arr)) setAnswers(arr);
            }}
            data={{ requiredSelections, options }}
            quizState={{ answers: { [stepId]: answers } }}
        />
    );
};

describe('QuestionStepAdapter', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('só chama onNext quando atingir requiredSelections', () => {
        const onNext = vi.fn();
        const onSave = vi.fn();

        const { getByTestId } = render(
            <QuestionAdapterTestWrapper
                stepId="step-02"
                requiredSelections={3}
                options={[
                    { id: 'a', text: 'A' },
                    { id: 'b', text: 'B' },
                    { id: 'c', text: 'C' },
                    { id: 'd', text: 'D' },
                ]}
                onNext={onNext}
            />
        );

        // Seleciona menos que o necessário
        fireEvent.click(getByTestId('opt-a'));
        fireEvent.click(getByTestId('opt-b'));
        expect(onNext).not.toHaveBeenCalled();

        // Seleciona terceira opção -> deve avançar
        fireEvent.click(getByTestId('opt-c'));
        vi.runAllTimers();
        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('avança com requiredSelections=1 após primeira seleção', () => {
        const onNext = vi.fn();
        const onSave = vi.fn();

        const { getByTestId } = render(
            <QuestionAdapterTestWrapper
                stepId="step-03"
                requiredSelections={1}
                options={[
                    { id: 'x', text: 'X' },
                    { id: 'y', text: 'Y' }
                ]}
                onNext={onNext}
            />
        );

        fireEvent.click(getByTestId('opt-x'));
        vi.runAllTimers();
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});
