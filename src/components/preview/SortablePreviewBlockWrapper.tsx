import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';

interface SortablePreviewBlockWrapperProps {
  id?: string;
  block?: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  primaryStyle?: StyleResult;
  onClick?: () => void;
  onUpdate?: (updates: any) => void;
  onSelect?: (blockId: string) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const SortablePreviewBlockWrapper: React.FC<SortablePreviewBlockWrapperProps> = ({
  id,
  block,
  isSelected,
  isPreviewing: _isPreviewing,
  primaryStyle: _primaryStyle,
  onClick,
  onUpdate: _onUpdate,
  onSelect: _onSelect,
  children,
  disabled = false,
  className,
}) => {
  const blockId = id || block?.id || 'unknown';
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: blockId,
    disabled 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // If block is provided, render the block content
  if (block) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative block-preview-wrapper',
          isSelected && 'selected',
          isDragging && 'z-50 opacity-50',
          className
        )}
        onClick={onClick}
        {...attributes}
        {...listeners}
      >
        {/* Basic block content renderer - this should be enhanced based on block type */}
        <div className="preview-block-content">
          <div className="block-type-indicator text-xs text-gray-500 mb-1">
            {block.type || 'Unknown Block'}
          </div>
          <div className="block-content">
            {block.content?.text && (
              <div className="text-content">{block.content.text}</div>
            )}
            {block.content?.title && (
              <h3 className="block-title">{block.content.title}</h3>
            )}
            {/* Add more content renderers as needed */}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise render children with sortable wrapper
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative',
        isDragging && 'z-50 opacity-50',
        className
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default SortablePreviewBlockWrapper;