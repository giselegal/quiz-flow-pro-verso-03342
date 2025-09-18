import React from 'react';
import { cn } from '@/lib/utils';
import { useQuizData } from './QuizDataProvider';
import type { BaseModuleProps } from '../types';

export interface StyleRevealModuleProps extends BaseModuleProps {
  showStyleName?: boolean;
  showDescription?: boolean;
  layout?: 'card' | 'horizontal';
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

const StyleRevealModule: React.FC<StyleRevealModuleProps> = ({
  showStyleName = true,
  showDescription = true,
  layout = 'card',
  // imageWidth = 200, // Unused for now
  // imageHeight = 200, // Unused for now
  backgroundColor = '#F8F9FA',
  textColor = '#432818',
  accentColor = '#B89B7A',
  className = '',
  isSelected = false
}) => {
  const { primaryStyle, isLoading } = useQuizData();

  if (isLoading || !primaryStyle) {
    return (
      <div className={cn('animate-pulse p-6 rounded-lg bg-gray-100', className)}>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        'w-full p-6 rounded-lg transition-all duration-200',
        layout === 'card' ? 'text-center' : 'flex items-center gap-6',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      style={{ backgroundColor }}
    >
      {showStyleName && (
        <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
          Seu Estilo: {primaryStyle.style}
        </h2>
      )}
      
      {showDescription && (
        <p className="text-lg" style={{ color: textColor }}>
          {primaryStyle.description}
        </p>
      )}
    </div>
  );
};

export default StyleRevealModule;