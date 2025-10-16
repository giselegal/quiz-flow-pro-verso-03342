/**
 * 🎯 UNIFIED BLOCK WRAPPER - Renderiza componente final com overlay condicional
 * 
 * Componente central da arquitetura unificada:
 * - Edit Mode: Componente final + EditOverlay
 * - Preview Mode: Componente final sem overlay
 * 
 * Props key: isInteractive controla interatividade do quiz
 */

import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { BlockComponent } from '../types';
import { EditOverlay } from './EditOverlay';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { TooltipProvider } from '@/components/ui/tooltip';

export interface UnifiedBlockWrapperProps {
  block: BlockComponent;
  allBlocks: BlockComponent[];
  
  // Estado
  isSelected: boolean;
  isMultiSelected: boolean;
  hasErrors: boolean;
  errors: any[];
  
  // Modo
  mode: 'edit' | 'preview';
  isInteractive: boolean; // false em edit, true em preview
  
  // Handlers (Edit Mode)
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  
  // Container support
  isContainer?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  
  // Preview mode props
  sessionData?: Record<string, any>;
  onNext?: () => void;
  onUpdateSessionData?: (key: string, value: any) => void;
}

export const UnifiedBlockWrapper: React.FC<UnifiedBlockWrapperProps> = ({
  block,
  allBlocks,
  isSelected,
  isMultiSelected,
  hasErrors,
  errors,
  mode,
  isInteractive,
  onClick,
  onDelete,
  onDuplicate,
  isContainer,
  isExpanded,
  onToggleExpand,
  sessionData,
  onNext,
  onUpdateSessionData
}) => {
  
  // 🎯 Drag & Drop (apenas Edit Mode)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: block.id,
    disabled: mode === 'preview'
  });
  
  const style: React.CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition
  };
  
  // 🎯 Obter componente final via registry
  const BlockComponent = useMemo(() => {
    const Component = getEnhancedBlockComponent(block.type);
    if (!Component) {
      console.warn(`⚠️ UnifiedBlockWrapper: Componente não encontrado para tipo "${block.type}"`);
    }
    return Component;
  }, [block.type]);
  
  if (!BlockComponent) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
        ⚠️ Componente não encontrado: <code>{block.type}</code>
      </div>
    );
  }
  
  // Children (para containers)
  const children = useMemo(() => 
    allBlocks
      .filter(b => b.parentId === block.id)
      .sort((a, b) => a.order - b.order),
    [allBlocks, block.id]
  );
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all',
        mode === 'edit' && [
          'rounded-lg bg-white p-3 mb-2',
          'hover:shadow-md',
          isDragging && 'opacity-50 cursor-grabbing',
          !isDragging && 'cursor-move'
        ],
        mode === 'preview' && 'bg-transparent',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        isMultiSelected && 'bg-blue-50/30'
      )}
      onClick={mode === 'edit' ? onClick : undefined}
      {...(mode === 'edit' ? { ...attributes, ...listeners } : {})}
    >
      {/* 🎯 COMPONENTE FINAL (100% produção) */}
      <div className={cn(
        mode === 'edit' && 'pointer-events-none' // Desabilitar interação em edit
      )}>
        <BlockComponent
          block={block}
          isSelected={isSelected}
          isPreviewMode={mode === 'preview'}
          properties={{
            ...block.properties,
            // 🔑 KEY: Desabilitar interatividade em Edit Mode
            isInteractive: isInteractive,
            // Preview mode props
            ...(mode === 'preview' && {
              onNext,
              onUpdateSessionData,
              sessionData
            })
          }}
        />
      </div>
      
      {/* 🎯 OVERLAY DE EDIÇÃO (apenas Edit Mode) */}
      {mode === 'edit' && (
        <TooltipProvider>
          <EditOverlay
            block={block}
            isSelected={isSelected}
            isMultiSelected={isMultiSelected}
            hasErrors={hasErrors}
            errors={errors}
            onDelete={onDelete || (() => {})}
            onDuplicate={onDuplicate || (() => {})}
            isContainer={isContainer}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
          />
        </TooltipProvider>
      )}
      
      {/* 🎯 CHILDREN CONTAINERS (recursivo - apenas edit) */}
      {isContainer && isExpanded && mode === 'edit' && children.length > 0 && (
        <div className="mt-3 ml-4 pl-4 border-l-2 border-dashed border-gray-300">
          <div className="space-y-2">
            {children.map(child => (
              <UnifiedBlockWrapper
                key={child.id}
                block={child}
                allBlocks={allBlocks}
                mode={mode}
                isInteractive={isInteractive}
                isSelected={isSelected && block.id === child.id}
                isMultiSelected={isMultiSelected}
                hasErrors={hasErrors}
                errors={errors}
                onClick={onClick}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                sessionData={sessionData}
                onNext={onNext}
                onUpdateSessionData={onUpdateSessionData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedBlockWrapper;
