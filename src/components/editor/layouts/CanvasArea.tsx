import React from 'react';
import { cn } from '@/lib/utils';
import CanvasDropZone from '@/components/editor/canvas/CanvasDropZone.simple';
import type { Block } from '@/types/editor';
import { useCanvasContainerStyles } from '@/hooks/useCanvasContainerStyles';

const LazyScalableQuizRenderer = React.lazy(() =>
  import('@/components/core/ScalableQuizRenderer').then(mod => ({ default: mod.default }))
);

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
}) => {
  // Hook para aplicar estilos dinâmicos
  useCanvasContainerStyles();

  return (
    <div
      className={cn(
        'flex-1 min-w-0 overflow-y-auto overflow-x-hidden flex justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900',
        isDragging && 'editor-drop-zone-active',
        previewDevice === 'mobile' && 'px-2',
        previewDevice === 'tablet' && 'px-16',
        previewDevice === 'desktop' && 'px-24',
        previewDevice === 'xl' && 'px-32',
        className
      )}
      data-canvas-container
      ref={containerRef}
    >
      <div className={cn(
        'w-full',
        previewDevice === 'mobile' && 'max-w-sm',
        previewDevice === 'tablet' && 'max-w-3xl',
        previewDevice === 'desktop' && 'max-w-5xl',
        previewDevice === 'xl' && 'max-w-6xl'
      )}>
        {mode === 'preview' ? (
          <LazyScalableQuizRenderer
            funnelId="quiz21StepsComplete"
            mode="preview"
            debugMode={true}
            className="w-full canvas-area-preview"
            onStepChange={(step, data) => {
              actions.setCurrentStep(step);
              console.log('📍 Canvas area step change:', step, data);
            }}
          />
        ) : (
          <CanvasDropZone
            blocks={currentStepData}
            selectedBlockId={selectedBlockId}
            onSelectBlock={actions.setSelectedBlockId}
            onUpdateBlock={(id: string, updates: any) => actions.updateBlock(`step-${safeCurrentStep}`, id, updates)}
            onDeleteBlock={(id: string) => actions.removeBlock(`step-${safeCurrentStep}`, id)}
            onDeselectBlocks={() => actions.setSelectedBlockId(null)}
            className="w-full"
            isPreviewing={mode !== 'edit'}
            scopeId={safeCurrentStep}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(CanvasArea);
