/**
 * ⚠️ DEPRECATED: Este componente é um wrapper fino para UniversalBlockRenderer.
 * Use diretamente `UniversalBlockRenderer` a partir de `@/components/core/renderers`.
 */
import React, { memo, useCallback, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Block } from '@/types/editor';
import { UniversalBlockRenderer } from '@/components/core/renderers';

interface BlockRendererProps {
  block: Block;
  isSelected?: boolean;
  isPreview?: boolean; // mapeado para isPreviewing (deprecated) no Universal
  onUpdate?: (updates: Partial<Block>) => void;
  onDelete?: () => void;
  onSelect?: () => void;
  className?: string;
  style?: CSSProperties;
}

const BlockRenderer: React.FC<BlockRendererProps> = memo(({
  block,
  isSelected = false,
  isPreview = false,
  onUpdate,
  onDelete,
  onSelect,
  className,
  style,
}) => {
  useEffect(() => {
    console.warn(
      '⚠️ DEPRECATED: BlockRenderer será removido em 21/out/2025. ' +
      'Use UniversalBlockRenderer a partir de @/components/core/renderers.',
    );
  }, []);

  const handleUpdate = useCallback((blockId: string, updates: any) => {
    // repassa atualizações cruas; consumidores antigos devem lidar com merge
    onUpdate?.(updates);
  }, [onUpdate]);

  const handleDelete = useCallback(() => {
    onDelete?.();
  }, [onDelete]);

  const handleSelect = useCallback(() => {
    onSelect?.();
  }, [onSelect]);

  return (
    <UniversalBlockRenderer
      block={block}
      isSelected={isSelected}
      isPreviewing={!!isPreview}
      onUpdate={handleUpdate}
      onDelete={() => handleDelete()}
      onSelect={() => handleSelect()}
      className={className}
      style={style}
    />
  );
});

BlockRenderer.displayName = 'BlockRenderer';

export default BlockRenderer;