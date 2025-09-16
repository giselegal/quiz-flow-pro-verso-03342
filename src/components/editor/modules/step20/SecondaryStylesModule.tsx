import React from 'react';
import { cn } from '@/lib/utils';
import { useQuizData } from './QuizDataProvider';
import type { BaseModuleProps } from '../types';

export interface SecondaryStylesModuleProps extends BaseModuleProps {
  title?: string;
  showTitle?: boolean;
  maxStyles?: number;
  columns?: number;
  showPercentage?: boolean;
  cardBackground?: string;
  titleColor?: string;
  textColor?: string;
}

const SecondaryStylesModule: React.FC<SecondaryStylesModuleProps> = ({
  title = 'Estilos Complementares',
  showTitle = true,
  maxStyles = 2,
  columns = 2,
  showPercentage = true,
  cardBackground = '#FFFFFF',
  titleColor = '#432818',
  textColor = '#6B4F43',
  className = '',
  isSelected = false
}) => {
  const { secondaryStyles, isLoading } = useQuizData();

  if (isLoading) {
    return (
      <div className={cn('animate-pulse space-y-4', className)}>
        <div className="h-6 bg-gray-200 rounded w-48"></div>
        <div className={cn('grid gap-4', `grid-cols-${columns}`)}>
          {[1, 2].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!secondaryStyles?.length) {
    return (
      <div className={cn('text-center text-gray-500', className)}>
        Estilos complementares não disponíveis
      </div>
    );
  }

  const displayStyles = secondaryStyles.slice(0, maxStyles);

  return (
    <div
      className={cn(
        'w-full space-y-4',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
    >
      {showTitle && title && (
        <h3 className="text-xl font-semibold text-center" style={{ color: titleColor }}>
          {title}
        </h3>
      )}

      <div className={cn('grid gap-4', `grid-cols-${columns}`)}>
        {displayStyles.map((style, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border flex items-center justify-between"
            style={{ backgroundColor: cardBackground }}
          >
            <span className="font-medium" style={{ color: titleColor }}>
              {style.style}
            </span>
            {showPercentage && (
              <span className="text-sm font-bold" style={{ color: textColor }}>
                {Math.round(style.percentage)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecondaryStylesModule;