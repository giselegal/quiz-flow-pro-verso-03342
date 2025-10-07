import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { QuestionStepAdapter } from '@/components/step-registry/ProductionStepsRegistry';

// Mock do componente OriginalQuestionStep para isolar lógica do adapter
vi.mock('@/components/quiz/QuestionStep', () => ({
  __esModule: true,
  default: ({ data, currentAnswers, onAnswersChange }: any) => {
    return (
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
    );
  }
}));

describe('QuestionStepAdapter', () => {
  it('só chama onNext quando atingir requiredSelections', () => {
    const onNext = vi.fn();
    const onSave = vi.fn();

    const { getByTestId } = render(
      <QuestionStepAdapter
        stepId="step-02"
        stepNumber={2}
        isActive
        isEditable={false}
        onNext={onNext}
        onPrevious={() => {}}
        onSave={onSave}
        data={{
          requiredSelections: 3,
          options: [
            { id: 'a', text: 'A' },
            { id: 'b', text: 'B' },
            { id: 'c', text: 'C' },
            { id: 'd', text: 'D' },
          ]
        }}
        quizState={{ answers: {} }}
      />
    );

    // Seleciona menos que o necessário
    fireEvent.click(getByTestId('opt-a'));
    fireEvent.click(getByTestId('opt-b'));
    expect(onNext).not.toHaveBeenCalled();

    // Seleciona terceira opção -> deve avançar
    fireEvent.click(getByTestId('opt-c'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('avança com requiredSelections=1 após primeira seleção', () => {
    const onNext = vi.fn();
    const onSave = vi.fn();

    const { getByTestId } = render(
      <QuestionStepAdapter
        stepId="step-03"
        stepNumber={3}
        isActive
        isEditable={false}
        onNext={onNext}
        onPrevious={() => {}}
        onSave={onSave}
        data={{
          options: [
            { id: 'x', text: 'X' },
            { id: 'y', text: 'Y' }
          ]
        }}
        quizState={{ answers: {} }}
      />
    );

    fireEvent.click(getByTestId('opt-x'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
