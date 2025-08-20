/**
 * 🎨 UNIFIED PREVIEW ENGINE - EDITOR UNIFICADO
 *
 * Engine de preview 100% idêntico à produção
 */

import { cn } from '@/lib/utils';
import { useMonitoring } from '@/services/MonitoringService';
import { Block } from '@/types/editor';
import { StyleResult } from '@/types/quiz';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useEffect, useMemo } from 'react';

// Importações DnD
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Importação do componente sortable
import { SortablePreviewBlockWrapper } from './SortablePreviewBlockWrapper';

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
  const { trackEvent } = useMonitoring();
  const flags = useFeatureFlags();

  // Configurar como droppable para aceitar novos componentes
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas-dropzone',
    data: {
      type: 'dropzone',
      position: blocks.length, // Adicionar no final por padrão
    },
  });

  // Extrair os IDs dos blocos para o SortableContext
  const blockIds = useMemo(() => {
    // Garantimos que todos os IDs sejam strings
    const ids = blocks.map(block => String(block.id));
    return ids;
  }, [blocks]);

  // Configurações do viewport
  const viewportConfig = useMemo(() => {
    const configs = {
      mobile: { width: 375, maxWidth: '375px', label: 'Mobile' },
      tablet: { width: 768, maxWidth: '768px', label: 'Tablet' },
      desktop: { width: 1024, maxWidth: '100%', label: 'Desktop' },
    };
    return configs[viewportSize] || configs.desktop;
  }, [viewportSize]);

  // Configurações de rendering por modo
  const renderConfig = useMemo(() => {
    return {
      editor: {
        showOutlines: false,
        showIds: false,
        enableInteraction: true,
        showErrors: false,
      },
      preview: {
        showOutlines: false,
        showIds: false,
        enableInteraction: true,
        showErrors: false,
      },
      production: {
        showOutlines: false,
        showIds: false,
        enableInteraction: true,
        showErrors: false,
      },
    };
  }, [mode, flags]);

  // Tracking de preview events
  useEffect(() => {
    if (isPreviewing) {
      trackEvent('preview_mode_activated', {
        viewport: viewportSize,
        blocksCount: blocks.length,
        mode,
      });
    }
  }, [isPreviewing, viewportSize, blocks.length, mode, trackEvent]);

  // Validação dos blocos
  useEffect(() => {
    const errors: string[] = [];

    blocks.forEach(block => {
      if (!block.id) errors.push(`Block missing ID: ${block.type}`);
      if (!block.type) errors.push(`Block missing type: ${block.id}`);
    });

    if (errors.length > 0 && mode === 'editor') {
      console.warn('Preview errors detected:', errors);
    }
  }, [blocks, mode]);

  // Handler para seleção de blocos
  const handleBlockClick = (blockId: string) => {
    if (mode === 'editor' && !isPreviewing && onBlockSelect) {
      onBlockSelect(blockId);
      trackEvent('block_selected_in_preview', { blockId, viewport: viewportSize });
    }
  };

  // Handler para atualização de blocos
  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    if (onBlockUpdate) {
      onBlockUpdate(blockId, updates);
      trackEvent('block_updated_in_preview', { blockId, updates });
    }
  };

  // Estilo do container principal
  const containerStyle = {
    maxWidth: viewportConfig.maxWidth,
    width: viewportSize === 'desktop' ? '100%' : `${viewportConfig.width}px`,
    margin: '0 auto',
    transition: 'all 0.3s ease-in-out',
  };

  // Classes CSS baseadas no modo
  const containerClasses = [
    'unified-preview-engine',
    `viewport-${viewportSize}`,
    `mode-${mode}`,
    isPreviewing ? 'is-previewing' : 'is-editing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      {/* Header removido para visual limpo */}

      {/* Container Principal do Preview */}
      <div
        ref={setDroppableRef}
        className={cn(
          'preview-container relative',
          // MODO PRODUÇÃO: Layout idêntico ao quiz real
          mode === 'production' && 'min-h-screen bg-gradient-to-b from-white to-gray-50',
          // MODO PREVIEW: Layout limpo sem elementos de edição
          mode === 'preview' && 'min-h-screen bg-white',
          // MODO EDITOR: Layout com indicadores visuais
          mode === 'editor' && 'bg-white min-h-screen border rounded-xl shadow-lg',
          isOver && mode === 'editor' && 'bg-blue-50 border-2 border-dashed border-blue-300'
        )}
        style={mode === 'production' || mode === 'preview' ? {} : containerStyle}
      >
        {/* Visual feedback para drop - APENAS NO MODO EDITOR */}
        {isOver && mode === 'editor' && (
          <div className="absolute inset-4 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/50 flex items-center justify-center z-10">
            <div className="text-blue-600 font-medium text-sm flex items-center gap-2">
              🎯 Solte o componente aqui
            </div>
          </div>
        )}

        {/* Renderização dos Blocos com SortableContext */}
        <div
          className={cn(
            'blocks-container relative z-0',
            // PRODUÇÃO/PREVIEW: Layout sem espaçamento extra
            (mode === 'production' || mode === 'preview') && 'space-y-0',
            // EDITOR: Layout com espaçamento visual
            mode === 'editor' && 'space-y-6 py-4'
          )}
        >
          {blocks.length === 0 ? (
            <EmptyPreviewState mode={mode} />
          ) : (
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              {blocks.map(block => (
                <SortablePreviewBlockWrapper
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  isPreviewing={isPreviewing}
                  renderConfig={renderConfig[mode]}
                  primaryStyle={primaryStyle}
                  onClick={() => handleBlockClick(block.id)}
                  onUpdate={updates => handleBlockUpdate(block.id, updates)}
                  onSelect={onBlockSelect}
                  debug={false}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>

      {/* Debug Info removido para produção limpa */}
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
