/**
 * 🎨 UNIFIED PREVIEW ENGINE - EDITOR UNIFICADO
 *
 * Engine de preview 100% idêntico à produção com integração completa de configurações
 */

import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import React, { useMemo } from 'react';
import { SortablePreviewBlockWrapper } from './SortablePreviewBlockWrapper';
import { ProductionPreviewEngine, type ProductionPreviewEngineProps } from './ProductionPreviewEngine';

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
  // Novas props para integração com configurações
  funnelId?: string;
  enableProductionMode?: boolean;
  enableInteractions?: boolean;
  enableAnalytics?: boolean;
}

/**
 * 👁️ Engine de Preview Unificado
 *
 * Renderiza blocos com fidelidade 100% à produção
 * Integração inteligente: modo editor básico ou produção completa
 */
export const UnifiedPreviewEngine: React.FC<UnifiedPreviewEngineProps> = ({
  blocks = [],
  primaryStyle,
  selectedBlockId,
  isPreviewing,
  viewportSize,
  onBlockSelect,
  onBlockUpdate,
  onBlocksReordered,
  mode = 'preview',
  className,
  funnelId,
  enableProductionMode = false,
  enableInteractions = false,
  enableAnalytics = false,
}) => {
  // ============================================================================
  // DECISÃO DE RENDERING: BÁSICO vs PRODUÇÃO
  // ============================================================================

  // Se tem funnelId e está em modo produção, usar ProductionPreviewEngine
  if (funnelId && (enableProductionMode || mode === 'production' || enableInteractions)) {
    const productionProps: ProductionPreviewEngineProps = {
      blocks,
      selectedBlockId,
      isPreviewing,
      viewportSize,
      primaryStyle,
      onBlockSelect,
      onBlockUpdate,
      onBlocksReordered,
      mode,
      className,
      funnelId,
      enableProductionMode,
      enableInteractions,
      enableAnalytics,
    };

    return <ProductionPreviewEngine {...productionProps} />;
  }

  // ============================================================================
  // MODO BÁSICO: PREVIEW SIMPLES PARA EDITOR
  // ============================================================================

  // Configurações do viewport
  const viewportConfig = useMemo(() => {
    const configs = {
      mobile: { width: 375, maxWidth: '375px', label: 'Mobile' },
      tablet: { width: 768, maxWidth: '768px', label: 'Tablet' },
      desktop: { width: 1024, maxWidth: '100%', label: 'Desktop' },
    };
    return configs[viewportSize] || configs.desktop;
  }, [viewportSize]);

  // Renderizar conteúdo vazio se não há blocos
  if (!blocks || blocks.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg',
          'text-gray-500 bg-gray-50',
          className
        )}
        style={{ maxWidth: viewportConfig.maxWidth }}
      >
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Canvas vazio</div>
          <div className="text-sm">
            {funnelId
              ? `Arraste componentes para configurar o funil: ${funnelId}`
              : 'Arraste componentes da sidebar para começar'
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('preview-container', 'transition-all duration-200', className)}
      style={{ maxWidth: viewportConfig.maxWidth }}
    >
      {blocks.map(block => (
        <SortablePreviewBlockWrapper
          key={block.id}
          block={block}
          isSelected={selectedBlockId === block.id}
          isPreviewing={isPreviewing || false}
          primaryStyle={primaryStyle}
          onClick={() => onBlockSelect?.(block.id)}
          onUpdate={onBlockUpdate ? (updates: any) => onBlockUpdate(block.id, updates) : () => { }}
          onSelect={onBlockSelect}
        />
      ))}
    </div>
  );
};

export default UnifiedPreviewEngine;
