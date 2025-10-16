/**
 * 🎨 PROGRESS BAR BLOCK - Atomic Component
 * 
 * Barra de progresso animada
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarBlockProps {
  progress?: number;
  showPercentage?: boolean;
  height?: number;
  bgColor?: string;
  fillColor?: string;
  rounded?: boolean;
  animated?: boolean;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const ProgressBarBlock = memo(({
  progress = 0,
  showPercentage = false,
  height = 8,
  bgColor = '#e5e7eb',
  fillColor = '#B89B7A',
  rounded = true,
  animated = true,
  className = '',
  mode = 'preview'
}: ProgressBarBlockProps) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full overflow-hidden',
          rounded && 'rounded-full'
        )}
        style={{
          height: `${height}px`,
          backgroundColor: bgColor
        }}
      >
        <div
          className={cn(
            'h-full transition-all duration-500',
            animated && 'ease-out'
          )}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: fillColor
          }}
        />
      </div>
      
      {showPercentage && (
        <p className="text-center text-sm text-gray-600 mt-2">
          {normalizedProgress}%
        </p>
      )}
    </div>
  );
});

ProgressBarBlock.displayName = 'ProgressBarBlock';
