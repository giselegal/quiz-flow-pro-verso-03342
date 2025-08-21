/**
 * 🎨 UNIFIED PREVIEW ENGINE - EDITOR UNIFICADO
 *
 * Engine de preview 100% idêntico à produção
 */

import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import React, { useMemo } from 'react';
import { SortablePreviewBlockWrapper } from './SortablePreviewBlockWrapper';

// 🏗️ TIPOS

export interface UnifiedPreviewEngineProps {
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
}

/**
 * 👁️ Engine de Preview Unificado
 *
 * Renderiza blocos com fidelidade 100% à produção
 */
export const UnifiedPreviewEngine: React.FC<UnifiedPreviewEngineProps> = ({
  blocks = [],
  primaryStyle,
  selectedBlockId,
  isPreviewing,
  viewportSize,
  onBlockSelect,
  onBlockUpdate,
  mode = 'preview',
  className,
  // onBlocksReordered, // unused - DndContext foi movido para componente pai
}) => {
  // Configurações do viewport
  const viewportConfig = useMemo(() => {
    const configs = {
      mobile: { width: 375, maxWidth: '375px', label: 'Mobile' },
      tablet: { width: 768, maxWidth: '768px', label: 'Tablet' },
      desktop: { width: 1024, maxWidth: '100%', label: 'Desktop' },
    };
    return configs[viewportSize] || configs.desktop;
  }, [viewportSize]);

  // Configurações de rendering por modo (removidas pois não utilizadas)
  // Tracking de preview events (removido pois não utilizado)

  // Renderizar conteúdo vazio se não há blocos
  if (!blocks || blocks.length === 0) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg",
          "text-gray-500 bg-gray-50",
          className
        )}
        style={{ maxWidth: viewportConfig.maxWidth }}
      >
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Canvas vazio</div>
          <div className="text-sm">Arraste componentes da sidebar para começar</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "preview-container",
        "transition-all duration-200",
        className
      )}
      style={{ maxWidth: viewportConfig.maxWidth }}
    >
      {blocks.map((block) => (
        <SortablePreviewBlockWrapper
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          onSelect={onBlockSelect}
          onUpdate={onBlockUpdate ? (updates) => onBlockUpdate(block.id, updates) : () => {}}
        />
      ))}
    </div>
  );
};

/**
 * 🏜️ Estado vazio do preview
 */
const EmptyPreviewState: React.FC<{ mode: string }> = ({ mode }) => (
  <div className="empty-preview-state flex flex-col items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50">
    <div className="text-4xl mb-4">📱</div>
    <h3 className="text-lg font-medium text-gray-700 mb-2">Preview Vazio</h3>
    <p className="text-gray-500 text-center max-w-md">
      {mode === 'editor'
        ? 'Adicione blocos do painel de componentes para começar a construir sua página.'
        : 'Nenhum conteúdo disponível para preview.'}
    </p>
  </div>
);

export default UnifiedPreviewEngine;
