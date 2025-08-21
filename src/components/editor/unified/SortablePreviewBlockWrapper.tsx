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
  renderConfig: any;
  primaryStyle?: StyleResult;
  onClick: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onSelect?: (blockId: string) => void;
  debug?: boolean;
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
  debug = false, // Forçar false para teste
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
      style={wrapperStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* IDs removidos para visual limpo */}

      {/* Renderização do bloco usando UniversalBlockRenderer */}
      <div className="block-content relative">
        {/* Visual totalmente limpo para produção */}

        {/* Renderizar componente real usando UniversalBlockRenderer */}
        <UniversalBlockRenderer
          block={block}
          isSelected={isSelected}
          onClick={() => {
            onClick();
            onSelect?.(block.id);
          }}
        />
      </div>

      {/* Indicadores visuais removidos para visual limpo */}
      {!isPreviewing && (
        <div className="absolute inset-0 pointer-events-none">
          {isHovered && !isSelected && !isDragging && (
            <div className="absolute inset-0 border border-gray-200 rounded"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortablePreviewBlockWrapper;
