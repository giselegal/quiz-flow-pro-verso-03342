/**
 * 🎯 PRODUCTION PREVIEW ENGINE - FASE 1 IMPLEMENTADA
 * 
 * Engine de preview com 100% de fidelidade à produção
 * Renderiza componentes reais do UniversalBlockRenderer
 * Suporte completo ao quiz21StepsComplete
 */

import React, { Suspense } from 'react';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import Step20Result from '@/components/steps/Step20Result';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EnhancedBlockRenderer } from './EnhancedBlockRenderer';

export interface ProductionPreviewEngineProps {
  blocks: Block[];
  selectedBlockId?: string;
  isPreviewing?: boolean;
  viewportSize?: string;
  primaryStyle?: any;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: any) => void;
  onBlocksReordered?: (blocks: Block[]) => void;
  funnelId?: string;
  currentStep?: number;
  enableInteractions?: boolean;
  mode?: 'editor' | 'preview' | 'production';
  className?: string;
}

/**
 * Production Preview Engine - Renderiza componentes reais
 */
export const ProductionPreviewEngine: React.FC<ProductionPreviewEngineProps> = ({
  blocks = [],
  selectedBlockId,
  isPreviewing = false,
  viewportSize = 'desktop',
  onBlockSelect,
  onBlockUpdate,
  funnelId = 'quiz21StepsComplete',
  currentStep = 1,
  mode = 'preview',
  className = '',
  enableInteractions = true,
}) => {
  const isProductionMode = mode === 'production';
  const isEditorMode = mode === 'editor';

  // Renderizar Step 20 como caso especial
  if (currentStep === 20) {
    return (
      <div className={cn('production-preview-step20', className)}>
        <Suspense fallback={<LoadingSpinner />}>
          <Step20Result 
            className="w-full" 
            isPreview={!isProductionMode}
          />
        </Suspense>
      </div>
    );
  }

  // Renderizar blocos normais
  return (
    <div className={cn(
      'production-preview-engine w-full',
      'space-y-4', // Espaçamento entre blocos
      viewportSize === 'mobile' && 'max-w-sm mx-auto',
      viewportSize === 'tablet' && 'max-w-3xl mx-auto',
      viewportSize === 'desktop' && 'max-w-5xl mx-auto',
      className
    )}>
      {/* Debug info (apenas em modo desenvolvimento) */}
      {process.env.NODE_ENV === 'development' && mode === 'editor' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
          <div className="font-semibold text-yellow-800 mb-1">
            🔧 Production Preview Engine
          </div>
          <div className="grid grid-cols-2 gap-2 text-yellow-700">
            <div>Funil: {funnelId}</div>
            <div>Step: {currentStep}</div>
            <div>Blocos: {blocks.length}</div>
            <div>Modo: {mode}</div>
            <div>Viewport: {viewportSize}</div>
            <div>Interações: {enableInteractions ? 'On' : 'Off'}</div>
          </div>
        </div>
      )}

      {/* Canvas vazio */}
      {blocks.length === 0 && (
        <div className="min-h-[400px] border-2 border-dashed border-stone-200 rounded-xl flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="text-6xl text-stone-300">📝</div>
            <h3 className="text-xl font-semibold text-stone-600">Canvas Vazio</h3>
            <p className="text-stone-500 max-w-sm">
              {isEditorMode 
                ? 'Adicione componentes da sidebar para começar a construir esta etapa'
                : 'Nenhum componente configurado para esta etapa'
              }
            </p>
            {isEditorMode && (
              <div className="text-sm text-stone-400 mt-2">
                Arraste componentes da sidebar → para esta área
              </div>
            )}
          </div>
        </div>
      )}

      {/* Renderizar blocos */}
      {blocks.map((block, index) => {
        const isSelected = selectedBlockId === block.id;

        return (
          <EnhancedBlockRenderer
            key={block.id || `block-${index}`}
            block={block}
            isSelected={isSelected}
            isPreview={isPreviewing || isProductionMode}
            currentStep={currentStep}
            funnelId={funnelId}
            onSelect={() => {
              if (onBlockSelect && !isPreviewing && enableInteractions) {
                onBlockSelect(block.id);
              }
            }}
            onUpdate={(updates: any) => {
              if (onBlockUpdate && enableInteractions) {
                onBlockUpdate(block.id, updates);
              }
            }}
            onValidationChange={(blockId: string, isValid: boolean) => {
              console.log(`🎯 Block ${blockId} validation: ${isValid}`);
            }}
            enableValidation={true}
            enableAutoAdvance={isPreviewing || isProductionMode}
            className="mb-4"
          />
        );
      })}

      {/* Placeholder para adicionar mais blocos (apenas no editor) */}
      {isEditorMode && blocks.length > 0 && (
        <div className="border border-dashed border-stone-200 rounded-lg p-6 text-center text-stone-400 hover:border-stone-300 transition-colors">
          <div className="text-2xl mb-2">+</div>
          <div className="text-sm">Adicionar novo componente</div>
        </div>
      )}
    </div>
  );
};

export default ProductionPreviewEngine;