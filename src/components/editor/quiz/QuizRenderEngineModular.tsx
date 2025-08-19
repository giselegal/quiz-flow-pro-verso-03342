/**
 * 🎨 MOTOR DE RENDERIZAÇÃO MODULAR
 *
 * Renderiza blocos com suporte para editor, preview e produção
 */

import { Block } from '@/types/editor';
import React from 'react';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';

import { QuizNavigationBlock } from '@/components/editor/quiz/QuizNavigationBlock';

interface QuizRenderEngineProps {
  blocks: Block[];
  mode?: 'editor' | 'preview' | 'production';
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlockSelect?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

export const QuizRenderEngineModular: React.FC<QuizRenderEngineProps> = ({
  blocks,
  mode = 'editor',
  onBlockUpdate,
  onBlockSelect,
  selectedBlockId,
}) => {
  const { actions } = useQuizFlow();
  const setAnswer = (questionId: string, answer: any) => {
    // Implementação usando ações do useQuizFlow
    actions.answerScoredQuestion(questionId, answer);
  };

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;
    const isEditable = mode === 'editor';

    const commonProps = {
      key: block.id,
      isSelected,
      isEditing: isEditable,
      onUpdate: onBlockUpdate
        ? (updates: Partial<Block>) => onBlockUpdate(block.id, updates)
        : undefined,
      onClick: onBlockSelect ? () => onBlockSelect(block.id) : undefined,
    };

    switch (block.type) {
      case 'headline':
        return (
          <div 
            key={commonProps.key} 
            className={`p-4 bg-card rounded-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
            onClick={commonProps.onClick}
          >
            <h2 className="text-2xl font-bold">{block.content.title}</h2>
            {block.content.subtitle && (
              <p className="text-muted-foreground mt-2">{block.content.subtitle}</p>
            )}
          </div>
        );

      case 'text':
        return (
          <div key={block.id} className="p-4 bg-card rounded-lg">
            <p>{block.content.text}</p>
          </div>
        );

      case 'options-grid':
        return (
          <div key={block.id} className="p-4 bg-card rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {block.content.options?.map((option: any) => (
                <button
                  key={option.id}
                  className="p-4 border rounded-lg hover:bg-accent"
                  onClick={() => setAnswer(block.id, [option.id])}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        );

      case 'quiz-navigation':
        return (
          <QuizNavigationBlock
            currentStep={1}
            totalSteps={21}
            onNext={() => {}}
            onPrevious={() => {}}
            canGoNext={true}
            canGoPrevious={false}
          />
        );

      default:
        return (
          <div
            key={block.id}
            className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          >
            <p className="text-sm text-muted-foreground">
              Block type "{block.type}" not implemented
            </p>
          </div>
        );
    }
  };

  return (
    <div className="quiz-render-engine space-y-6">
      {blocks.sort((a, b) => a.order - b.order).map(renderBlock)}
    </div>
  );
};
