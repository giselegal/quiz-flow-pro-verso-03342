/**
 * 🎯 TK-CANVAS-01: EDITABLE BLOCK
 * 
 * Componente especializado APENAS para modo edição.
 * - Sempre mostra controles de edição
 * - Sempre permite seleção e drag & drop
 * - Integrado com EditorProvider
 * - Zero props condicionais de modo
 */

import React, { memo, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/enhancedBlockRegistry';
import { useLogger } from '@/utils/logger/SmartLogger';
import { Trash2, GripVertical, Copy } from 'lucide-react';
import { blockPropsAreEqual, MemoizationMetrics } from '@/utils/performance/memoization';

export interface EditableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Hook para resolver componente de bloco (sem cache aqui, cache fica no registry)
 */
const useBlockComponent = (blockType: string): React.ComponentType<any> | null => {
  const logger = useLogger('EditableBlock');

  return useMemo(() => {
    const component = getEnhancedBlockComponent(blockType);
    
    if (!component) {
      logger.warn(`Componente não encontrado para tipo: ${blockType}`);
    }
    
    return component as React.ComponentType<any> | null;
  }, [blockType, logger]);
};

/**
 * 🎯 EDITABLE BLOCK COMPONENT
 * Componente focado 100% em modo edição
 */
export const EditableBlock: React.FC<EditableBlockProps> = memo(({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  className,
  style,
}) => {
  const logger = useLogger('EditableBlock');
  const BlockComponent = useBlockComponent(block.type);

  // Handlers memoizados
  const handleUpdate = useMemo(() => 
    onUpdate ? (updates: any) => onUpdate(block.id, updates) : undefined,
    [block.id, onUpdate]
  );

  const handleClick = useMemo(() => 
    () => onSelect(block.id),
    [block.id, onSelect]
  );

  const handleDelete = useMemo(() => 
    onDelete ? (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(block.id);
    } : undefined,
    [block.id, onDelete]
  );

  const handleDuplicate = useMemo(() => 
    onDuplicate ? (e: React.MouseEvent) => {
      e.stopPropagation();
      onDuplicate(block.id);
    } : undefined,
    [block.id, onDuplicate]
  );

  // Log de render e métricas (apenas em dev)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      MemoizationMetrics.recordRender('EditableBlock');
      logger.render(`EditableBlock[${block.type}]`, {
        blockId: block.id,
        isSelected,
        hasComponent: !!BlockComponent
      });
    }
  }, [block.type, block.id, BlockComponent, isSelected, logger]);

  if (!BlockComponent) {
    return (
      <div
        className={cn(
          "p-4 border-2 border-dashed border-red-300 bg-red-50 rounded",
          className
        )}
        style={style}
        onClick={handleClick}
        data-block-id={block.id}
        data-block-type={block.type}
      >
        <div className="text-sm text-red-700 font-medium">
          ⚠️ Componente não encontrado: {block.type}
        </div>
        <div className="text-xs text-red-600 mt-1">
          ID: {block.id}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'editable-block relative group transition-all duration-200',
        'hover:ring-1 hover:ring-gray-300 cursor-pointer',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
      style={style}
      onClick={handleClick}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* 🎯 CONTROLES DE EDIÇÃO - Sempre visíveis */}
      <div className="absolute -top-8 left-0 right-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <div className="flex items-center gap-1 bg-white border rounded shadow-sm px-2 py-1">
          <GripVertical className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">{block.type}</span>
        </div>
        
        <div className="flex items-center gap-1">
          {handleDuplicate && (
            <button
              onClick={handleDuplicate}
              className="p-1.5 bg-white border rounded shadow-sm hover:bg-gray-50 transition-colors"
              title="Duplicar bloco"
            >
              <Copy className="w-3 h-3 text-gray-600" />
            </button>
          )}
          
          {handleDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 bg-white border rounded shadow-sm hover:bg-red-50 transition-colors"
              title="Deletar bloco"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </button>
          )}
        </div>
      </div>

      {/* 🎯 INDICADOR DE SELEÇÃO */}
      {isSelected && (
        <div className="absolute top-0 left-0 -mt-6 text-xs bg-blue-500 text-white px-2 py-1 rounded z-10">
          {block.type} #{block.id.slice(0, 8)}
        </div>
      )}

      {/* 🎯 RENDERIZAÇÃO DO COMPONENTE */}
      <BlockComponent
        block={block}
        isSelected={isSelected}
        onUpdate={handleUpdate}
      />
    </div>
  );
}, (prev, next) => {
  // 🎯 TK-CANVAS-07: Memoização inteligente otimizada
  const areEqual = blockPropsAreEqual(prev, next);
  
  if (areEqual && process.env.NODE_ENV === 'development') {
    MemoizationMetrics.recordMemoHit('EditableBlock');
  }
  
  return areEqual;
});

EditableBlock.displayName = 'EditableBlock';

export default EditableBlock;
