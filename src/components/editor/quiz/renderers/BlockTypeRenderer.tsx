/**
 * BlockTypeRenderer - Adapter for quiz step blocks
 * 
 * This component wraps UniversalBlockRenderer for use in quiz step renderers.
 * It handles session data and answer updates specific to quiz flow.
 */

import React, { memo } from 'react';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import type { Block } from '@/types/editor';

export interface BlockTypeRendererProps {
  block: Block;
  sessionData?: {
    answers?: string[];
    userName?: string;
    [key: string]: any;
  };
  onUpdate?: (blockId: string, updates: any) => void;
  mode?: 'editable' | 'preview' | 'production';
  className?: string;
}

export const BlockTypeRenderer: React.FC<BlockTypeRendererProps> = memo(({
  block,
  sessionData,
  onUpdate,
  mode = 'preview',
  className,
  ...otherProps
}) => {
  // Convert mode to UniversalBlockRenderer format
  const universalMode = mode === 'editable' ? 'editor' : mode;

  // Merge session data into block properties for rendering
  const enhancedBlock = {
    ...block,
    properties: {
      ...block.properties,
      sessionData,
    },
  };

  const handleUpdate = (blockId: string, updates: any) => {
    if (onUpdate) {
      onUpdate(blockId, updates);
    }
  };

  return (
    <UniversalBlockRenderer
      block={enhancedBlock}
      mode={universalMode}
      onUpdate={handleUpdate}
      className={className}
      {...otherProps}
    />
  );
});

BlockTypeRenderer.displayName = 'BlockTypeRenderer';

export default BlockTypeRenderer;
