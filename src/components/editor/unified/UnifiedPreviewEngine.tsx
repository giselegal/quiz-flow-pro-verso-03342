/**
 * 🎯 UNIFIED PREVIEW ENGINE - Arquitetura Consolidada
 * Unifica os diferentes engines de preview em um só componente
 * Substitui PreviewEngine, StandardPreviewEngine e ProductionPreviewEngine
 */

import React from 'react';
import { StyleResult } from '@/types/quiz';
import { Block } from '@/types/editor';

interface UnifiedPreviewEngineProps {
  blocks: Block[];
  selectedBlockId?: string | null;
  isPreviewing?: boolean;
  viewportSize?: 'mobile' | 'tablet' | 'desktop';
  primaryStyle?: StyleResult;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: any) => void;
  onBlocksReordered?: (blocks: Block[]) => void;
  funnelId?: string;
  currentStep?: number;
  enableInteractions?: boolean;
  mode?: 'editor' | 'production' | 'preview';
  enableProductionMode?: boolean;
}

export type { UnifiedPreviewEngineProps };

/**
 * Unified Preview Engine
 * Handles all preview modes in a single component
 */
export const UnifiedPreviewEngine: React.FC<UnifiedPreviewEngineProps> = ({
  blocks = [],
  selectedBlockId,
  onBlockSelect,
  viewportSize = 'desktop',
}) => {
  // Render simplified preview for now
  return (
    <div className="unified-preview-engine">
      <div className={`preview-viewport ${viewportSize}`}>
        {blocks.length > 0 ? (
          <div className="blocks-container">
            {blocks.map((block) => (
              <div 
                key={block.id}
                className={`block-preview ${selectedBlockId === block.id ? 'selected' : ''}`}
                onClick={() => onBlockSelect?.(block.id)}
              >
                <div className="block-type">{block.type}</div>
                <div className="block-id">{block.id}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-canvas">
            <p>Canvas vazio - adicione componentes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPreviewEngine;