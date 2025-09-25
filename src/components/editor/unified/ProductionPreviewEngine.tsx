/**
 * 🎯 PRODUCTION PREVIEW ENGINE - FASE 1 IMPLEMENTADA
 * 
 * Engine de preview com 100% de fidelidade à produção
 * Renderiza componentes reais do UniversalBlockRenderer
 * Suporte completo ao quiz21StepsComplete
 */

import React, { Suspense } from 'react';
import { getEnhancedBlockComponent } from '@/components/editor/blocks/EnhancedBlockRegistry';
import { Block } from '@/types/editor';
import { cn } from '@/lib/utils';
import Step20Result from '@/components/steps/Step20Result';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
 * Componente de erro para blocos que falharam na renderização
 */
const BlockErrorBoundary: React.FC<{
  blockId: string;
  blockType: string;
  children: React.ReactNode;
}> = ({ blockId, blockType, children }) => {
  return (
    <div className="min-h-[60px] border border-red-200 bg-red-50 rounded-lg p-4 text-center">
      <div className="text-red-600 text-sm">
        ⚠️ Erro ao renderizar bloco
      </div>
      <div className="text-red-500 text-xs mt-1">
        ID: {blockId} | Tipo: {blockType}
      </div>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

/**
 * Wrapper para blocos selecionáveis no editor
 */
const SelectableBlockWrapper: React.FC<{
  block: Block;
  isSelected: boolean;
  isPreview: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}> = ({ block, isSelected, isPreview, onSelect, children }) => {
  if (isPreview) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        'relative transition-all duration-200 cursor-pointer',
        'hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 rounded-lg',
        isSelected && 'ring-2 ring-primary ring-offset-2',
        'group'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-6 left-0 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-t-md">
          {block.type} • {block.id}
        </div>
      )}
      
      {/* Indicador de hover no modo editor */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
      
      {children}
    </div>
  );
};

/**
 * Carregador de mock data para preview
 */
const useMockQuizData = (funnelId?: string, currentStep?: number) => {
  return React.useMemo(() => {
    if (currentStep === 20) {
      // Mock data para Step 20 (resultado)
      return {
        primaryStyle: {
          style: 'Clássico',
          category: 'Clássico',
          percentage: 85,
          description: 'Seu estilo clássico reflete elegância e sofisticação. Você aprecia peças atemporais e bem estruturadas.',
          score: 85
        },
        secondaryStyles: [
          { style: 'Romântico', category: 'Romântico', percentage: 65, score: 65 },
          { style: 'Natural', category: 'Natural', percentage: 45, score: 45 }
        ],
        userName: 'Maria Silva'
      };
    }

    // Mock data para outras etapas
    return {
      currentStep: currentStep || 1,
      totalSteps: 21,
      userName: 'Maria Silva',
      progress: ((currentStep || 1) / 21) * 100
    };
  }, [funnelId, currentStep]);
};

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
  const mockData = useMockQuizData(funnelId, currentStep);
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
        const Component = getEnhancedBlockComponent(block.type);
        const isSelected = selectedBlockId === block.id;

        if (!Component) {
          return (
            <BlockErrorBoundary
              key={block.id || `block-${index}`}
              blockId={block.id || `block-${index}`}
              blockType={block.type || 'unknown'}
            >
              <div className="text-stone-600">
                Componente não encontrado: <code>{block.type}</code>
              </div>
            </BlockErrorBoundary>
          );
        }

        // Preparar props do bloco
        const blockProps = {
          key: block.id || `block-${index}`,
          block,
          properties: block.properties || {},
          content: block.content || {},
          isSelected: isSelected && !isPreviewing,
          isPreviewing: isPreviewing || isProductionMode,
          isEditor: isEditorMode,
          mockData,
          funnelId,
          currentStep,
          onSave: (updates: any) => {
            if (onBlockUpdate && enableInteractions) {
              onBlockUpdate(block.id, updates);
            }
          },
          onClick: () => {
            if (onBlockSelect && !isPreviewing && enableInteractions) {
              onBlockSelect(block.id);
            }
          },
          // Passar todas as propriedades do bloco como props também
          ...block.properties,
        };

        return (
          <SelectableBlockWrapper
            key={block.id || `wrapper-${index}`}
            block={block}
            isSelected={isSelected}
            isPreview={isPreviewing || isProductionMode}
            onSelect={() => {
              if (onBlockSelect && !isPreviewing && enableInteractions) {
                onBlockSelect(block.id);
              }
            }}
          >
            <Suspense
              fallback={
                <div className="min-h-[80px] bg-stone-50 border border-stone-200 rounded-lg animate-pulse flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm text-stone-500">
                    Carregando {block.type}...
                  </span>
                </div>
              }
            >
              <Component {...blockProps} />
            </Suspense>
          </SelectableBlockWrapper>
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