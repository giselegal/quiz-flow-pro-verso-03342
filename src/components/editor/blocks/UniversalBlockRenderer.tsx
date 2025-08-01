import React from 'react';
import { EditorBlock } from '@/types/editor';
import { Button } from '@/components/ui/button';
import QuizQuestionInteractiveBlock from './QuizQuestionInteractiveBlock';
import QuizResultCalculatedBlock from './QuizResultCalculatedBlock';
import ProgressBarModernBlock from './ProgressBarModernBlock';

export interface BlockRendererProps {
  block: EditorBlock;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<EditorBlock>) => void;
  onDelete: () => void;
  isPreview?: boolean;
}

export const UniversalBlockRenderer: React.FC<BlockRendererProps> = ({
  }
  // Retorno padrão usando renderBlock
  return (
    <div
      onClick={onSelect}
      className={
        `relative cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : 'hover:bg-gray-50'}
        ${isPreview ? '' : 'border border-transparent hover:border-gray-200 rounded-lg p-2'}`
      }
    >
      {renderBlock()}
      {!isPreview && isSelected && (
        <div className="absolute top-2 right-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
export default UniversalBlockRenderer;
