import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BlockData } from '@/types/blocks';

export interface InlineBaseWrapperProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
  editLabel?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  justify?: 'start' | 'center' | 'end';
  align?: 'center' | 'start' | 'end' | 'stretch';
  direction?: 'row' | 'col';
  wrap?: boolean;
  trackingData?: Record<string, any>;
  isLoading?: boolean;
  onMove?: (direction: 'up' | 'down') => void;
  responsive?: boolean | Record<string, any>;
  onEdit?: () => void;
  maxWidth?: string;
  showControls?: boolean;
  disabled?: boolean;
  isDraggable?: boolean;
  onDuplicate?: () => void;
  onDelete?: () => void;
  // Additional compatibility props
  block?: BlockData;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
}

const InlineBaseWrapper: React.FC<InlineBaseWrapperProps> = ({
  children,
  className = '',
  minHeight = '2rem',
  editLabel: _editLabel = 'Editar',
  gap = 'md',
  justify = 'start',
  align = 'start',
  direction = 'col',
  wrap = false,
  trackingData: _trackingData,
  isLoading: _isLoading = false,
  onMove: _onMove,
  responsive = false,
  onEdit: _onEdit,
  maxWidth,
  // Compatibility props (ignored for now)
  block: _block,
  isSelected: _isSelected,
  onPropertyChange: _onPropertyChange,
}) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  // Handle responsive as boolean or object
  const isResponsive = typeof responsive === 'boolean' ? responsive : false;

  return (
    <div
      className={cn(
        'inline-base-wrapper',
        direction === 'row' ? 'flex flex-row' : 'flex flex-col',
        gapClasses[gap],
        justifyClasses[justify],
        alignClasses[align],
        wrap && 'flex-wrap',
        isResponsive && 'w-full',
        className
      )}
      style={{
        minHeight,
        maxWidth: maxWidth || undefined,
      }}
    >
      {children}
    </div>
  );
};

export default InlineBaseWrapper;
