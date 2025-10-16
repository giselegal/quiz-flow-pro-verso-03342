/**
 * 🎯 UNIFIED BLOCK RENDERER - WYSIWYG Real
 * 
 * Renderiza blocos de forma IDÊNTICA em Edit Mode e Preview Mode.
 * A ÚNICA diferença é:
 * - Edit Mode: Overlay de edição (drag handles, botões)
 * - Preview Mode: Camada de interatividade (quiz funcional)
 */

import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { BlockComponent } from '../types';
import { PreviewInteractionLayer } from './PreviewInteractionLayer';

interface UnifiedBlockRendererProps {
  block: BlockComponent;
  allBlocks: BlockComponent[];
  
  // Modo de operação
  mode: 'edit' | 'preview';
  
  // Estado (Edit Mode)
  isSelected?: boolean;
  isMultiSelected?: boolean;
  hasErrors?: boolean;
  errors?: any[];
  
  // Handlers (Edit Mode)
  onBlockClick?: (e: React.MouseEvent, block: BlockComponent) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  
  // Preview props
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
  
  // Renderização
  renderBlockPreview: (block: BlockComponent, allBlocks: BlockComponent[]) => React.ReactNode;
}

const UnifiedBlockRendererComponent: React.FC<UnifiedBlockRendererProps> = ({
  block,
  allBlocks,
  mode,
  isSelected = false,
  isMultiSelected = false,
  hasErrors = false,
  errors = [],
  onBlockClick,
  onDelete,
  onDuplicate,
  sessionData,
  onUpdateSessionData,
  renderBlockPreview
}) => {
  
  // 🎯 DRAG & DROP (apenas Edit Mode)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    disabled: mode === 'preview'
  });
  
  const style = mode === 'edit' ? {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition
  } : undefined;
  
  // 🎯 INTERATIVIDADE CONDICIONAL
  const clickHandler = mode === 'edit' 
    ? (e: React.MouseEvent) => onBlockClick?.(e, block)
    : undefined;
  
  return (
    <div
      ref={mode === 'edit' ? setNodeRef : undefined}
      style={style}
      className={cn(
        'group relative rounded-lg bg-white overflow-hidden transition-all',
        mode === 'edit' && [
          'p-3 mb-2',
          'cursor-move',
          'hover:shadow-md',
        ],
        mode === 'preview' && [
          'mb-0',
          'cursor-default',
        ],
        // 🎯 VISUAL IDÊNTICO EM AMBOS OS MODOS
        (isSelected || isMultiSelected) && 'ring-2 ring-primary shadow-lg',
        hasErrors && !isSelected && 'shadow-[0_0_0_1px_hsl(var(--destructive))]',
        isMultiSelected && 'bg-primary/5',
        isDragging && 'opacity-50 scale-95'
      )}
      onClick={clickHandler}
      {...(mode === 'edit' ? { ...attributes, ...listeners } : {})}
    >
      {/* 🎯 ERROR BADGE - Sempre visível se houver erros */}
      {hasErrors && errors.length > 0 && (
        <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[9px] px-1.5 py-0.5 rounded-full font-bold z-10 shadow-md">
          {errors.length}
        </div>
      )}
      
      {/* 🎯 DRAG HANDLE - Apenas Edit Mode */}
      {mode === 'edit' && (
        <div className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="p-1 rounded bg-muted/80 backdrop-blur-sm">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
      
      {/* 🎯 CONTEÚDO VISUAL - IDÊNTICO EM AMBOS OS MODOS */}
      <div className={cn(
        mode === 'edit' && 'pl-8 pr-10',
        mode === 'preview' && 'px-0'
      )}>
        {/* 🔑 CHAVE: Renderizar preview visual (sempre igual) */}
        {renderBlockPreview(block, allBlocks)}
      </div>
      
      {/* 🎯 ACTION BUTTONS - Apenas Edit Mode */}
      {mode === 'edit' && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-muted/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete?.(); 
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-muted/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => { 
              e.stopPropagation(); 
              onDuplicate?.(); 
            }}
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
      
      {/* 🎯 PREVIEW INTERACTION LAYER - Apenas Preview Mode */}
      {mode === 'preview' && (
        <PreviewInteractionLayer
          block={block}
          sessionData={sessionData}
          onUpdateSessionData={onUpdateSessionData}
        />
      )}
    </div>
  );
};

// Memoização para performance
const areEqual = (prev: UnifiedBlockRendererProps, next: UnifiedBlockRendererProps) => {
  return (
    prev.block.id === next.block.id &&
    prev.mode === next.mode &&
    prev.isSelected === next.isSelected &&
    prev.isMultiSelected === next.isMultiSelected &&
    prev.hasErrors === next.hasErrors &&
    prev.errors?.length === next.errors?.length &&
    JSON.stringify(prev.block.properties) === JSON.stringify(next.block.properties) &&
    prev.sessionData === next.sessionData
  );
};

export const UnifiedBlockRenderer = memo(UnifiedBlockRendererComponent, areEqual);

export default UnifiedBlockRenderer;
