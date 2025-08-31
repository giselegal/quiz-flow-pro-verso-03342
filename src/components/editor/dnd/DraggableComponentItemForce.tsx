import React from 'react';
import { ForceDraggableWrapper } from './ForceDraggableWrapper';

// Utility function for class names
const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface DraggableComponentItemProps {
  blockType: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  category?: string;
  disabled?: boolean;
  className?: string;
  idSuffix?: string;
}

export const DraggableComponentItemForce: React.FC<DraggableComponentItemProps> = ({
  blockType,
  title,
  description,
  icon,
  category,
  disabled = false,
  className,
  idSuffix,
}) => {
  const catSlug = (category || 'default').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const id = `sidebar-item-${blockType}-${catSlug}${idSuffix ? `-${idSuffix}` : ''}`;
  const data = {
    type: 'sidebar-component',
    blockType: String(blockType),
    title: title,
    description: description,
    category: category || 'default',
    source: 'sidebar',
  };

  return (
    <ForceDraggableWrapper
      id={id}
      data={data}
      disabled={disabled}
      className={cn(
        'ToolbarButton w-full h-auto p-3 flex flex-col items-start gap-2 text-left transition-all duration-200 border border-stone-200 rounded-lg bg-white group',
        // Mantemos hover de fundo levemente neutro
        'hover:bg-stone-50 hover:border-stone-300',
        // Anel de foco/destaque ajustado para dourado
        'ring-2 ring-[#B89B7A]/40 hover:ring-[#B89B7A]/60',
        'pointer-events-auto touch-manipulation select-none',
        'dnd-draggable-item',
        disabled && 'opacity-30 bg-gray-100',
        className
      )}
      // Fallback: permitir adicionar por duplo clique
      onDoubleClick={() => {
        try {
          const ev = new CustomEvent('editor-add-component', {
            detail: { blockType, source: 'sidebar-double-click' },
          });
          window.dispatchEvent(ev);
        } catch { }
      }}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-stone-900 truncate">{title}</h4>
            {blockType.includes('step01') && (
              <span className="bg-[#B89B7A] text-white text-xs px-1.5 py-0.5 rounded">STEP1</span>
            )}
          </div>
          {category && (
            <span className="text-xs text-stone-500 uppercase tracking-wide">{category}</span>
          )}
        </div>
      </div>

      {/* Description */}
      {description && <p className="text-xs text-stone-600 line-clamp-2 w-full">{description}</p>}

      {/* Debug indicator */}
      <div className="text-xs text-[#8B7355] font-mono">FORCE: {blockType}</div>
    </ForceDraggableWrapper>
  );
};
