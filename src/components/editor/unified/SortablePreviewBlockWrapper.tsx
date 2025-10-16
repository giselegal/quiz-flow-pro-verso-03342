import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';
import UniversalBlockRenderer from '../blocks/UniversalBlockRenderer';

interface SortablePreviewBlockWrapperProps {
  block: Block;
  isSelected: boolean;
  isPreviewing: boolean;
  renderConfig?: {
    showBorders: boolean;
    showLabels: boolean;
    enableHover: boolean;
    enableSelection: boolean;
  };
  primaryStyle?: StyleResult;
  onClick: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onSelect?: (blockId: string) => void;
  children?: React.ReactNode;
}

/**
 * 🎯 Wrapper para cada bloco no preview com funcionalidade de arrastar e soltar
 */
export const SortablePreviewBlockWrapper: React.FC<SortablePreviewBlockWrapperProps> = ({
  block,
  isSelected,
  isPreviewing,
  // renderConfig, // removido - não usado mais
  // primaryStyle, // unused
  onClick,
  // onUpdate, // unused
  onSelect,
  children,
}) => {
  console.log(`🔄 SortablePreviewBlockWrapper renderizado: ${block.id} (${block.type})`);

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

  console.log(`🔧 useSortable config para ${block.id}:`, {
    id: block.id,
    disabled: isPreviewing,
    hasListeners: !!listeners,
    hasAttributes: !!attributes,
    hasSetNodeRef: !!setNodeRef,
  });

  // Estilo do wrapper com transformação de arrastar e soltar
  const wrapperStyle = {
    outline: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : 'none', // Cor azul semi-transparente apenas quando selecionado
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
      style={{
        ...wrapperStyle,
        marginBottom: '16px',
        padding: '12px',
        border: `2px solid ${isSelected ? 'hsl(var(--primary))' : isHovered ? 'hsl(var(--border))' : 'hsl(var(--muted))'}`,
        borderRadius: '8px',
        backgroundColor: isSelected ? 'hsl(var(--accent) / 0.1)' : 'hsl(var(--card))',
        transition: 'all 0.2s ease',
        cursor: isPreviewing ? 'default' : 'move',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* Badge de Tipo do Bloco */}
      {!isPreviewing && (isHovered || isSelected) && (
        <div className="absolute -top-2 left-3 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold z-20 shadow-md">
          {block.type}
        </div>
      )}

      {/* Badge de Editando */}
      {!isPreviewing && isSelected && (
        <div className="absolute -top-2 right-3 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold z-20 shadow-md animate-pulse">
          ✏️ Editando
        </div>
      )}

      {/* Drag Handle */}
      {!isPreviewing && (isHovered || isDragging) && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-muted rounded opacity-70 z-20">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="6" cy="4" r="1.5"/>
            <circle cx="10" cy="4" r="1.5"/>
            <circle cx="6" cy="8" r="1.5"/>
            <circle cx="10" cy="8" r="1.5"/>
            <circle cx="6" cy="12" r="1.5"/>
            <circle cx="10" cy="12" r="1.5"/>
          </svg>
        </div>
      )}

      {/* Renderização do bloco */}
      <div className="block-content relative">
        {typeof children !== 'undefined' ? (
          children
        ) : (
          <UniversalBlockRenderer
            block={block}
            isSelected={isSelected}
            onClick={() => {
              onClick();
              onSelect?.(block.id);
            }}
          />
        )}
      </div>

      {/* Overlay no hover */}
      {!isPreviewing && isHovered && !isSelected && !isDragging && (
        <div className="absolute inset-0 bg-primary/5 rounded pointer-events-none"></div>
      )}
    </div>
  );
};

export default SortablePreviewBlockWrapper;
