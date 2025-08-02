
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BlockData } from '@/types/blocks';

export interface InlineBaseWrapperProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
  editLabel?: string;
  gap?: 'sm' | 'md' | 'lg';
  justify?: 'start' | 'center' | 'end';
  align?: 'center' | 'start' | 'end';
  direction?: 'row' | 'col';
  wrap?: boolean;
  trackingData?: Record<string, any>;
  isLoading?: boolean;
  onMove?: (direction: 'up' | 'down') => void;
}

const InlineBaseWrapper: React.FC<InlineBaseWrapperProps> = ({
  children,
  className = '',
  minHeight = '2rem',
  editLabel = 'Editar',
  gap = 'md',
  justify = 'start',
  align = 'start',
  direction = 'col',
  wrap = false,
  trackingData,
  isLoading = false,
  onMove
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end'
  };

  return (
    <div
      className={cn(
        'inline-base-wrapper',
        direction === 'row' ? 'flex flex-row' : 'flex flex-col',
        gapClasses[gap],
        justifyClasses[justify],
        alignClasses[align],
        wrap && 'flex-wrap',
        className
      )}
      style={{ minHeight }}
    >
      {children}
    </div>
  );
};

export default InlineBaseWrapper;
