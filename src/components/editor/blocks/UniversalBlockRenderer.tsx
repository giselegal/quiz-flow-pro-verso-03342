/**
 * 🎨 UNIVERSAL BLOCK RENDERER v3.0 - CLEAN ARCHITECTURE
 * 
 * Renderer universal de blocos otimizado com Clean Architecture
 * Performance máxima e flexibilidade total
 */

import React, { memo, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { getEnhancedBlockComponent } from './EnhancedBlockRegistry';

// 🎯 INTERFACES (EXPORTADAS)
export interface Block {
  id: string;
  type: string;
  properties?: Record<string, any>;
}

export interface UniversalBlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreviewing?: boolean;
  mode?: 'production' | 'preview' | 'editor';
  onSelect?: (blockId: string) => void;
  onClick?: () => void; // Legacy compatibility
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onPropertyChange?: (key: string, value: any) => void; // Legacy compatibility
  className?: string;
  style?: React.CSSProperties;
}

// 🎯 FALLBACK COMPONENT
const FallbackBlock: React.FC<{ block: Block; isSelected?: boolean }> = memo(({ 
  block, 
  isSelected 
}) => (
  <div className={cn(
    'p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg bg-muted/10',
    isSelected && 'border-primary bg-primary/5'
  )}>
    <div className="text-sm text-muted-foreground">
      Tipo de bloco: <span className="font-mono">{block.type}</span>
    </div>
    <div className="text-xs text-muted-foreground mt-1">
      ID: {block.id}
    </div>
  </div>
));

// 📦 UNIVERSAL BLOCK RENDERER PRINCIPAL
export const UniversalBlockRenderer: React.FC<UniversalBlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreviewing = false,
  mode = 'editor',
  onSelect,
  onClick,
  onUpdate,
  onDelete,
  onPropertyChange,
  className,
  style
}) => {
  // 🎯 OBTER COMPONENTE DO REGISTRY
  const Component = useMemo(() => {
    try {
      return getEnhancedBlockComponent(block.type);
    } catch (error) {
      console.warn(`Block type '${block.type}' not found in enhanced registry`, error);
      return null;
    }
  }, [block.type]);

  // 🎯 HANDLERS OTIMIZADOS
  const handleClick = useCallback(() => {
    onSelect?.(block.id);
    onClick?.();
  }, [onSelect, onClick, block.id]);

  const handleUpdate = useCallback((updates: Partial<Block>) => {
    onUpdate?.(block.id, updates);
  }, [onUpdate, block.id]);

  const handlePropertyChange = useCallback((key: string, value: any) => {
    onPropertyChange?.(key, value);
    // Também atualiza via onUpdate para compatibilidade
    onUpdate?.(block.id, {
      properties: { ...block.properties, [key]: value }
    });
  }, [onPropertyChange, onUpdate, block.id, block.properties]);

  const handleDelete = useCallback(() => {
    onDelete?.(block.id);
  }, [onDelete, block.id]);

  // 🎯 PROPRIEDADES UNIFICADAS
  const blockProps = useMemo(() => ({
    block,
    isSelected,
    isPreviewing,
    mode,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onPropertyChange: handlePropertyChange,
    onClick: handleClick,
  }), [
    block, 
    isSelected, 
    isPreviewing, 
    mode, 
    handleUpdate, 
    handleDelete, 
    handlePropertyChange, 
    handleClick
  ]);

  // 🎯 RENDERIZAÇÃO CONDICIONAL
  if (!Component) {
    return (
      <div 
        className={cn('cursor-pointer', className)} 
        style={style}
        onClick={handleClick}
      >
        <FallbackBlock block={block} isSelected={isSelected} />
      </div>
    );
  }

  return (
    <div 
      className={cn('cursor-pointer', className)} 
      style={style}
      onClick={handleClick}
    >
      <Component {...blockProps} />
    </div>
  );
});

UniversalBlockRenderer.displayName = 'UniversalBlockRenderer';

export default UniversalBlockRenderer;