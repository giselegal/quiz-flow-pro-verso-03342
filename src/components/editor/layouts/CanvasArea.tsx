import React, { useMemo } from 'react';
import LazyBoundary from '@/components/common/LazyBoundary';
import { cn } from '@/lib/utils';
import type { Block } from '@/types/editor';
import { useCanvasContainerStyles } from '@/hooks/useCanvasContainerStyles';
import StabilizedCanvas from '@/canvas/StabilizedCanvas';
import PreviewModeRenderer from '@/components/editor/renderers/PreviewModeRenderer';

// Removido LazyScalableQuizRenderer: StabilizedCanvas já encapsula preview com lazy interno

export interface CanvasAreaProps {
  className?: string;
  containerRef: React.RefObject<HTMLDivElement>;
  mode: 'edit' | 'preview';
  previewDevice: 'desktop' | 'tablet' | 'mobile' | 'xl';
  safeCurrentStep: number;
  currentStepData: Block[];
  selectedBlockId: string | null;
  actions: any;
  isDragging: boolean;
  funnelId?: string; // funnelId dinâmico
}

const CanvasArea: React.FC<CanvasAreaProps> = ({
  className = '',
  containerRef,
  mode,
  previewDevice,
  safeCurrentStep,
  currentStepData,
  selectedBlockId,
  actions,
  isDragging,
  funnelId = 'quiz-estilo-21-steps', // Fallback alinhado ao runtime
}) => {
  // Hook para aplicar estilos dinâmicos
  useCanvasContainerStyles();

  // Derivar bloco selecionado
  const selectedBlock: Block | null = useMemo(() => {
    if (!Array.isArray(currentStepData) || !selectedBlockId) return null;
    return (currentStepData as Block[]).find(b => (b as any).id === selectedBlockId) || null;
  }, [currentStepData, selectedBlockId]);

  return (
    <div
      className={cn(
        'flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900',
        isDragging && 'editor-drop-zone-active',
        previewDevice === 'mobile' && 'px-2',
        previewDevice === 'tablet' && 'px-16',
        previewDevice === 'desktop' && 'px-24',
        previewDevice === 'xl' && 'px-32',
        className,
      )}
      data-canvas-container
      ref={containerRef}
      onClick={(e) => {
        // 🔥 CRITICAL: Impedir seleção do container - apenas blocos devem ser selecionados
        // Se o clique foi diretamente no container (não em blocos), não fazer nada
        if (e.target === e.currentTarget || (e.target as HTMLElement).hasAttribute?.('data-canvas-container')) {
          e.stopPropagation();
        }
      }}
    >
      <div className={cn(
        'w-full',
        previewDevice === 'mobile' && 'max-w-sm',
        previewDevice === 'tablet' && 'max-w-3xl',
        previewDevice === 'desktop' && 'max-w-5xl',
        previewDevice === 'xl' && 'max-w-6xl',
      )}>
        {mode === 'preview' ? (
          <div className="w-full">
            <PreviewModeRenderer
              step={{ id: `step-${safeCurrentStep}`, blocks: currentStepData as any[] } as any}
              sessionData={{}}
              onUpdateSessionData={() => { /* noop para preview simples no layout */ }}
            />
          </div>
        ) : (
          <StabilizedCanvas
            className="w-full"
            blocks={currentStepData as Block[]}
            selectedBlock={selectedBlock}
            currentStep={safeCurrentStep}
            onSelectBlock={(id: string) => actions.setSelectedBlockId(id)}
            onUpdateBlock={(blockId: string, updates: Partial<Block>) => actions.updateBlock(`step-${safeCurrentStep}`, blockId, updates)}
            onDeleteBlock={(blockId: string) => actions.removeBlock(`step-${safeCurrentStep}`, blockId)}
            onReorderBlocks={(step: number, oldIndex: number, newIndex: number) => {
              const stepKey = `step-${step}`;
              actions.reorderBlocks(stepKey, oldIndex, newIndex);
            }}
            isPreviewMode={false}
            onStepChange={(step: number) => {
              actions.setCurrentStep(step);
            }}
            funnelId={funnelId}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(CanvasArea);
