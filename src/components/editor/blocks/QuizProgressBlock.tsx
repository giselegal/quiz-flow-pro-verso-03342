/**
 * 🎯 QUIZ PROGRESS BLOCK - Componente Modular
 * Barra de progresso isolada e 100% editável
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizProgressBlockProps extends BlockComponentProps {
  properties?: {
    showProgress?: boolean;
    progressValue?: number;
    progressMax?: number;
    color?: string;
    backgroundColor?: string;
    height?: number;
    borderRadius?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    showLabel?: boolean;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    labelText?: string;
  };
}

export const QuizProgressBlock: React.FC<QuizProgressBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    showProgress = false,
    progressValue = 0,
    progressMax = 100,
    color = 'hsl(var(--primary))',
    backgroundColor = 'hsl(var(--muted))',
    height = 8,
    borderRadius = 4,
    marginTop = 0,
    marginBottom = 16,
    marginLeft = 0,
    marginRight = 0,
    showLabel = false,
    labelPosition = 'top',
    labelText = 'Progresso',
  } = properties;

  if (!showProgress) {
    return null;
  }

  const progressPercentage = (progressValue / progressMax) * 100;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
  };

  const progressBarStyle: React.CSSProperties = {
    height: `${height}px`,
    borderRadius: `${borderRadius}px`,
    backgroundColor,
  };

  return (
    <div
      className={cn(
        'w-full transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      {showLabel && labelPosition === 'top' && (
        <div className="mb-2 text-sm font-medium text-foreground">
          {labelText}: {progressPercentage.toFixed(0)}%
        </div>
      )}

      <div className="relative w-full overflow-hidden" style={progressBarStyle}>
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-2 text-sm font-medium text-foreground">
          {labelText}: {progressPercentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default QuizProgressBlock;
