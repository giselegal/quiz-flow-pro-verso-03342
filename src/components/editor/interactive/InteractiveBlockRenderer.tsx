import { Block } from '@/types/editor';
import { ValidationResult } from '@/types/validation';
import React, { memo } from 'react';

interface QuizContext {
  userName?: string;
  currentStep: number;
  scores: Record<string, number>;
  totalAnswers: number;
}

interface InteractiveBlockRendererProps {
  block: Block;
  onAnswer: (answer: {
    questionId: string;
    selectedOptions: string[];
    validation: ValidationResult;
    scoreValues?: Record<string, number>;
  }) => void;
  selectedAnswers: string[];
  isLiveMode: boolean;
}

export const InteractiveBlockRenderer: React.FC<InteractiveBlockRendererProps> = memo(
  ({ block, onAnswer, selectedAnswers, isLiveMode }) => {
    return (
      <div className="interactive-block p-4 border rounded-lg">
        <h3 className="font-semibold">{block.type}</h3>
        <p className="text-sm text-gray-600">{JSON.stringify(block.content)}</p>
        <div className="mt-2">
          <button
            onClick={() =>
              onAnswer({
                questionId: block.id,
                selectedOptions: ['placeholder'],
                validation: { success: true, errors: [] },
              })
            }
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Responder
          </button>
        </div>
      </div>
    );
  }
);

InteractiveBlockRenderer.displayName = 'InteractiveBlockRenderer';
