import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

export interface QuizProgressBlockProps extends BlockComponentProps {
  currentStep?: number;
  totalSteps?: number;
  percentage?: number;
  showNumbers?: boolean;
  showPercentage?: boolean;
  progressColor?: string;
  backgroundColor?: string;
  textColor?: string;
  height?: number;
  borderRadius?: number;
  isEditable?: boolean;
  onUpdate?: (updates: any) => void;
}

const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  blockId = 'quiz-progress',
  currentStep = 1,
  totalSteps = 10,
  percentage = 0,
  showNumbers = true,
  showPercentage = true,
  progressColor = '#B89B7A',
  backgroundColor = '#f3f4f6',
  textColor = '#374151',
  height = 8,
  borderRadius = 9999,
  className = '',
  isEditable = false,
  onUpdate = () => {}
}) => {
  const calculatedPercentage = percentage || (currentStep / totalSteps) * 100;

  return (
    <div 
      className={cn(
        'quiz-progress-block w-full py-4',
        className
      )}
      data-block-id={blockId}
    >
      {/* Step counter */}
      {showNumbers && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium" style={{ color: textColor }}>
            Etapa {currentStep} de {totalSteps}
          </span>
          {showPercentage && (
            <span className="text-sm font-medium" style={{ color: textColor }}>
              {Math.round(calculatedPercentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ 
          backgroundColor,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`
        }}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{ 
            width: `${calculatedPercentage}%`,
            backgroundColor: progressColor,
            borderRadius: `${borderRadius}px`
          }}
        />
      </div>

      {/* Percentage only display */}
      {!showNumbers && showPercentage && (
        <div className="text-center mt-2">
          <span className="text-sm font-medium" style={{ color: textColor }}>
            {Math.round(calculatedPercentage)}% completo
          </span>
        </div>
      )}
    </div>
  );
};

export default QuizProgressBlock;
