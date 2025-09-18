/**
 * 🎨 MOTOR DE RENDERIZAÇÃO MODULAR - VERSÃO COMPLETA
 *
 * Renderiza todos os tipos de blocos do quiz21StepsComplete.ts
 * com suporte para editor, preview e produção
 */

import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import React from 'react';

// Import Universal Block Renderer
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';

interface QuizRenderEngineProps {
  blocks: Block[];
  mode?: 'editor' | 'preview' | 'production';
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlockSelect?: (blockId: string) => void;
  selectedBlockId?: string | null;
}

export const QuizRenderEngineModular: React.FC<QuizRenderEngineProps> = ({
  blocks,
  mode = 'editor',
  onBlockUpdate,
  onBlockSelect,
  selectedBlockId,
}) => {
  const handleBlockClick = (block: Block) => {
    if (mode === 'editor' && onBlockSelect) {
      onBlockSelect(block.id);
    }
  };

  const handlePropertyChange = (blockId: string, key: string, value: any) => {
    if (onBlockUpdate) {
      onBlockUpdate(blockId, {
        properties: {
          ...blocks.find(b => b.id === blockId)?.properties,
          [key]: value,
        },
      });
    }
  };

  const renderBlock = (block: Block) => {
    const isSelected = selectedBlockId === block.id;
    const isEditable = mode === 'editor';

    return (
      <div
        key={block.id}
        className={cn(
          'quiz-block transition-all duration-200',
          isEditable && 'editor-mode',
          isSelected && 'selected'
        )}
      >
        <UniversalBlockRenderer
          block={block}
          isSelected={isSelected}
          onClick={() => handleBlockClick(block)}
          onPropertyChange={(key, value) => handlePropertyChange(block.id, key, value)}
        />
      </div>
    );
  };

  return (
    <div
      className={cn(
        'quiz-render-engine space-y-6',
        mode === 'editor' && 'editor-container',
        mode === 'preview' && 'preview-container',
        mode === 'production' && 'production-container'
      )}
    >
      {blocks.sort((a, b) => a.order - b.order).map(renderBlock)}
    </div>
  );
};
