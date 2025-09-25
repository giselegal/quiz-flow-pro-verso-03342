import React from 'react';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';

export interface ProductionPreviewEngineProps {
  blocks: Block[];
  selectedBlockId?: string | null;
  isPreviewing: boolean;
  viewportSize: 'mobile' | 'tablet' | 'desktop';
  primaryStyle?: StyleResult;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlocksReordered?: (startIndex: number, endIndex: number) => void;
  mode?: 'editor' | 'preview' | 'production';
  className?: string;
  funnelId?: string;
  enableProductionMode?: boolean;
  enableInteractions?: boolean;
  enableAnalytics?: boolean;
}

export const ProductionPreviewEngine: React.FC<ProductionPreviewEngineProps> = ({
  blocks = [],
  funnelId,
  className = ''
}) => {
  return (
    <div className={`production-preview p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-4">Preview de Produção</h2>
      <p className="text-muted-foreground">
        Engine de produção com {blocks.length} blocos
        {funnelId && ` para funil: ${funnelId}`}
      </p>
      <div className="mt-4 grid gap-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="p-3 bg-muted rounded border">
            <div className="text-sm font-medium">Bloco {index + 1}: {block.type}</div>
            <div className="text-xs text-muted-foreground">{block.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionPreviewEngine;