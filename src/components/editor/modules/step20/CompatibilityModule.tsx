import React from 'react';
import { cn } from '@/lib/utils';
import { useQuizData } from './QuizDataProvider';
import type { BaseModuleProps } from '../types';

export interface CompatibilityModuleProps extends BaseModuleProps {
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  progressColor?: string;
  textColor?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const CompatibilityModule: React.FC<CompatibilityModuleProps> = ({
  showLabel = true,
  label = 'Compatibilidade:',
  showPercentage = true,
  progressColor = '#B89B7A',
  textColor = '#432818',
  size = 'md',
  animated = true,
  className = '',
  isSelected = false
}) => {
  const { primaryStyle, isLoading } = useQuizData();

  if (isLoading || !primaryStyle) {
    return (
      <div className={cn('animate-pulse text-center', className)}>
        <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
        <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto"></div>
      </div>
    );
  }

  const sizeClasses = {
    sm: 'w-16 h-16 text-lg',
    md: 'w-20 h-20 text-xl', 
    lg: 'w-24 h-24 text-2xl'
  };

  return (
    <div
      className={cn(
        'text-center space-y-2',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
    >
      {showLabel && (
        <div style={{ color: textColor }} className="font-medium">
          {label}
        </div>
      )}
      
      <div className="flex justify-center">
        <div 
          className={cn(
            'rounded-full border-4 flex items-center justify-center font-bold',
            sizeClasses[size],
            animated && 'animate-pulse'
          )}
          style={{ 
            borderColor: progressColor,
            backgroundColor: `${progressColor}20`,
            color: textColor
          }}
        >
          {showPercentage && `${primaryStyle.percentage}%`}
        </div>
      </div>
    </div>
  );
};

export default CompatibilityModule;