
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockData } from '@/types/blocks';

interface QuizProgressBlockProps {
  block: BlockData;
  className?: string;
  onUpdate?: (updates: Partial<BlockData>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  block,
  className,
  onUpdate,
  isSelected,
  onSelect
}) => {
  const properties = block.properties || {};
  const {
    currentStep = 1,
    totalSteps = 10,
    showPercentage = true,
    color = '#B89B7A',
    backgroundColor = '#F3F4F6',
    height = 8,
    borderRadius = 4
  } = properties;

  const progress = Math.min((currentStep / totalSteps) * 100, 100);

  const handleClick = () => {
    onSelect?.();
  };

  return (
    <div
      className={cn(
        'quiz-progress-block w-full p-4',
        'transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 bg-blue-50',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Progresso
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-600">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ 
          backgroundColor,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`
        }}
      >
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            borderRadius: `${borderRadius}px`
          }}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          Etapa {currentStep} de {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default QuizProgressBlock;
