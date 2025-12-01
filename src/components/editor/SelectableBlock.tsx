/**
 * SelectableBlock - Wrapper component for editor blocks with selection capabilities
 * 
 * Provides visual feedback for selected blocks and handles selection/click events.
 */

import React, { memo, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SelectableBlockProps {
  blockId: string;
  isSelected?: boolean;
  isEditable?: boolean;
  onSelect?: (blockId: string) => void;
  onOpenProperties?: (blockId: string) => void;
  children: React.ReactNode;
  className?: string;
  // Legacy props for backward compatibility
  blockType?: string;
  blockIndex?: number;
  isDraggable?: boolean;
}

export const SelectableBlock: React.FC<SelectableBlockProps> = memo(({
  blockId,
  isSelected = false,
  isEditable = false,
  onSelect,
  onOpenProperties,
  children,
  className,
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(blockId);
    }
  }, [blockId, onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenProperties) {
      onOpenProperties(blockId);
    }
  }, [blockId, onOpenProperties]);

  return (
    <div
      className={cn(
        'selectable-block relative transition-all duration-150',
        isEditable && 'cursor-pointer hover:ring-2 hover:ring-primary/30',
        isSelected && 'ring-2 ring-primary',
        className
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-block-id={blockId}
      data-selected={isSelected}
    >
      {children}

      {/* Selection indicator */}
      {isSelected && isEditable && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
      )}
    </div>
  );
});

SelectableBlock.displayName = 'SelectableBlock';

export default SelectableBlock;
