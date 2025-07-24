import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { UniversalBlockRenderer } from '../blocks/UniversalBlockRenderer';

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Tipo local para BlockData
interface BlockData {
  id: string;
  type: string;
  properties: Record<string, any>;
}

interface SortableBlockItemProps {
  block: BlockData;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onSaveInline: (blockId: string, updates: Partial<BlockData>) => void;
  disabled?: boolean;
  className?: string;
}

export const SortableBlockItem: React.FC<SortableBlockItemProps> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onSaveInline,
  disabled = false,
  className
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({
    id: block.id,
    data: {
      type: 'canvas-block',
      block
    },
    disabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isHidden = block.properties?.hidden || false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative w-full rounded-lg transition-all duration-200',
        'flex flex-col', // Layout flexível vertical
        isDragging && 'opacity-50 scale-105 z-50',
        isOver && 'ring-1 ring-blue-300/50',
        isSelected && 'ring-1 ring-blue-400/60 shadow-sm',
        isHidden && 'opacity-60',
        className
      )}
      onClick={onSelect}
    >
      {/* Controls Overlay - Top Right */}
      <div className={cn(
        'absolute top-2 right-2 flex gap-1 opacity-90 group-hover:opacity-100 transition-opacity z-10 bg-white/90 backdrop-blur-sm rounded-md p-1 shadow-md border',
        isSelected && 'opacity-100',
        // Mobile optimizations
        'md:gap-1 gap-0.5',
        'md:p-1 p-0.5'
      )}>
        {/* Drag Handle */}
        <button
          type="button"
          className="w-5 h-5 md:w-6 md:h-6 p-0 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-sm flex items-center justify-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-600" />
        </button>

        {/* Toggle Visibility */}
        <button
          type="button"
          className="w-5 h-5 md:w-6 md:h-6 p-0 hover:bg-gray-100 rounded-sm flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
        >
          {isHidden ? (
            <EyeOff className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-600" />
          ) : (
            <Eye className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-600" />
          )}
        </button>

        {/* Duplicate */}
        <button
          type="button"
          className="w-5 h-5 md:w-6 md:h-6 p-0 hover:bg-gray-100 rounded-sm flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
        >
          <Copy className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-600" />
        </button>

        {/* Delete */}
        <button
          type="button"
          className="w-5 h-5 md:w-6 md:h-6 p-0 hover:bg-red-100 hover:text-red-600 rounded-sm flex items-center justify-center bg-red-50 border border-red-200"
          onClick={(e) => {
            console.log('🗑️ Delete button clicked for block:', block.id);
            e.stopPropagation();
            if (typeof onDelete === 'function') {
              console.log('✅ Calling onDelete function...');
              onDelete();
            } else {
              console.error('❌ onDelete is not a function:', typeof onDelete);
            }
          }}
          title="Excluir componente"
        >
          <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-600 hover:text-red-600" />
        </button>
      </div>

      {/* Block Content - Using UniversalBlockRenderer */}
      <div className={`relative w-full flex-1 ${isHidden ? 'pointer-events-none' : ''}`}>
        <div className={`w-full h-full transition-all duration-200 ${
          isDragging ? 'pointer-events-none' : ''
        }`}>
          <UniversalBlockRenderer
            block={block}
            isSelected={isSelected}
            onClick={onSelect}
            onSaveInline={onSaveInline}
            disabled={disabled}
            className={cn(
              'w-full transition-all duration-200',
              isSelected && 'ring-2 ring-blue-500 border-blue-400',
              !isSelected && 'border-gray-200 hover:border-gray-300'
            )}
          />
        </div>

        {/* Block Type Label - Bottom Left when selected */}
        {isSelected && (
          <div className="absolute bottom-2 left-2 bg-gray-600/80 text-white text-xs px-2 py-1 rounded-md shadow-sm opacity-75">
            {block.type}
          </div>
        )}

        {/* Hidden Overlay */}
        {isHidden && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              Oculto
            </div>
          </div>
        )}
      </div>

      {/* Drop Zone Indicators */}
      <div
        className="absolute -top-2 left-0 right-0 h-1 bg-blue-500 opacity-0 transition-opacity"
        data-drop-zone="before"
      />
      <div
        className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 opacity-0 transition-opacity"
        data-drop-zone="after"
      />
    </div>
  );
};