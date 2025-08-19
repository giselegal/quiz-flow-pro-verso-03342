import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';

interface SortablePreviewBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  isPreviewing: boolean;
  renderConfig: any;
  primaryStyle?: StyleResult;
  onClick: () => void;
  onUpdate: (updates: Partial<Block>) => void;
}

/**
 * 🎯 Wrapper para cada bloco no preview com funcionalidade de arrastar e soltar
 */
export const SortablePreviewBlockWrapper: React.FC<SortablePreviewBlockWrapperProps> = ({
  block,
  isSelected,
  isPreviewing,
  renderConfig,
  primaryStyle,
  onClick,
  onUpdate,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Configuração do useSortable do dnd-kit
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: isPreviewing,
    data: {
      type: 'block',
      block,
    },
  });

  // Estilo do wrapper com transformação de arrastar e soltar
  const wrapperStyle = {
    outline: renderConfig?.showOutlines && isSelected ? '2px solid #3b82f6' : 'none',
    position: 'relative' as const,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  // Classes do wrapper
  const wrapperClasses = [
    'preview-block-wrapper',
    `block-${block.type}`,
    isSelected ? 'is-selected' : '',
    isHovered ? 'is-hovered' : '',
    isPreviewing ? 'in-preview-mode' : '',
    isDragging ? 'is-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={setNodeRef}
      className={wrapperClasses}
      style={wrapperStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
    >
      {/* ID do bloco (modo debug) */}
      {renderConfig?.showIds && (
        <div className="absolute -top-6 left-0 text-xs bg-gray-800 text-white px-2 py-1 rounded z-10">
          {block.id.slice(0, 8)}...
        </div>
      )}

      {/* Renderização do bloco */}
      <div className="block-content p-4 border rounded relative">
        {/* Alça para arrastar (visível apenas no modo editor e quando não está previsualizando) */}
        {!isPreviewing && renderConfig?.showOutlines && (
          <div
            className="drag-handle absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded cursor-move z-10"
            {...listeners}
          >
            ⋮⋮
          </div>
        )}

        <div className="text-sm text-gray-600 mb-2">
          {block.type} - {block.id.slice(0, 8)}
        </div>
        <div className="text-gray-800">{JSON.stringify((block as any).data || {}, null, 2)}</div>
      </div>

      {/* Indicadores visuais (modo editor) */}
      {!isPreviewing && renderConfig?.showOutlines && (
        <div className="absolute inset-0 pointer-events-none">
          {isSelected && (
            <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
              ✏️ Editando
            </div>
          )}

          {isHovered && !isSelected && !isDragging && (
            <div className="absolute inset-0 bg-blue-100 bg-opacity-20 border-2 border-blue-300 border-dashed rounded"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortablePreviewBlockWrapper;
