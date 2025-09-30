/**
 * 🎯 UNIFIED EDITOR CORE - COMPONENTE PRINCIPAL CONSOLIDADO
 * 
 * Substitui toda a fragmentação de editores por um único componente inteligente:
 * - ModularEditorPro
 * - SchemaDrivenEditorResponsive  
 * - UniversalStepEditor
 * - EditorPro
 * 
 * FUNCIONALIDADES:
 * ✅ Mode switching inteligente
 * ✅ Layout 4 colunas responsivo
 * ✅ Drag & Drop otimizado
 * ✅ Performance superior
 * ✅ Code splitting por funcionalidade
 */

import React, { Suspense, useMemo, useCallback } from 'react';
import { useEditor } from '@/components/editor/provider-alias';
import { logger } from '@/utils/debugLogger';

// 🎯 LAZY LOADED COMPONENTS (código splitting inteligente)
const EditorToolbar = React.lazy(() => import('@/components/editor/toolbar/EditorToolbar').then(m => ({ default: m.EditorToolbar })));
const StepSidebar = React.lazy(() => import('@/components/editor/sidebars/StepSidebar'));
const UnifiedComponentsPanel = React.lazy(() => import('@/components/editor/panels/UnifiedComponentsPanel'));
const CanvasDropZone = React.lazy(() => import('@/components/editor/canvas/CanvasDropZone.simple'));
const UltraUnifiedPropertiesPanel = React.lazy(() => import('@/components/editor/properties/UltraUnifiedPropertiesPanel'));

// 🎯 FALLBACK COMPONENTS
const ModularEditorProFallback = React.lazy(() =>
  import('@/components/editor/EditorPro/components/ModularEditorPro')
);

export interface UnifiedEditorCoreProps {
  mode?: 'visual' | 'headless' | 'production' | 'funnel';
  funnelId?: string;
  initialStep?: number;
  className?: string;
}

const ComponentLoadingFallback = React.memo(({ name }: { name: string }) => (
  <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Carregando {name}...</p>
    </div>
  </div>
));

const EditorLoadingFallback = React.memo(() => (
  <div className="flex items-center justify-center h-screen bg-background">
    <div className="text-center max-w-md">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-foreground mb-2">Inicializando Editor</h2>
      <p className="text-muted-foreground mb-4">Carregando sistema unificado...</p>
      <div className="flex justify-center space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
));

/**
 * 🎯 MODE-SPECIFIC LAYOUT RENDERER
 * 
 * Renderiza diferentes layouts baseado no modo:
 * - visual: 4 colunas completas
 * - headless: Apenas canvas
 * - production: Quiz renderer
 * - funnel: Layout otimizado para funnel
 */
const ModeRenderer: React.FC<{
  mode: 'visual' | 'headless' | 'production' | 'funnel';
  funnelId?: string;
}> = ({ mode, funnelId }) => {
  const { state, actions } = useEditor();

  // ✅ Calcular totalSteps dinamicamente baseado nas stepBlocks disponíveis
  const totalSteps = useMemo(() => {
    const stepKeys = Object.keys(state.stepBlocks || {});
    const stepNumbers = stepKeys
      .map(key => {
        const match = key.match(/step-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    return stepNumbers.length > 0 ? Math.max(...stepNumbers) : 0;
  }, [state.stepBlocks]);

  const renderModeContent = useCallback(() => {
    switch (mode) {
      case 'visual':
        return (
          <div className="h-full w-full flex flex-col">
            {/* Toolbar Superior */}
            <Suspense fallback={<ComponentLoadingFallback name="Toolbar" />}>
              <EditorToolbar />
            </Suspense>

            {/* Layout Principal 4 Colunas */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Esquerda - Etapas */}
              <div className="w-64 border-r border-border bg-card">
                <Suspense fallback={<ComponentLoadingFallback name="Etapas" />}>
                  <StepSidebar
                    currentStep={state.currentStep}
                    totalSteps={totalSteps}
                    stepHasBlocks={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => [i + 1, (state.stepBlocks[`step-${i + 1}`]?.length || 0) > 0])
                    )}
                    stepValidation={state.stepValidation}
                    onSelectStep={actions.setCurrentStep}
                    getStepAnalysis={(step) => ({
                      icon: 'quiz',
                      label: `Etapa ${step}`,
                      desc: `Quiz step ${step}`
                    })}
                    renderIcon={(_name, className) => <span className={className}>🎯</span>}
                  />
                </Suspense>
              </div>

              {/* Sidebar Esquerda - Componentes */}
              <div className="w-64 border-r border-border bg-card">
                <Suspense fallback={<ComponentLoadingFallback name="Componentes" />}>
                  <UnifiedComponentsPanel
                    onAddComponent={(componentId, metadata) => {
                      // Handle component addition
                      console.log('Adding component:', componentId, metadata);
                    }}
                    compactMode={true}
                  />
                </Suspense>
              </div>

              {/* Canvas Principal */}
              <div className="flex-1 bg-background">
                <Suspense fallback={<ComponentLoadingFallback name="Canvas" />}>
                  <CanvasDropZone
                    blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                    selectedBlockId={state.selectedBlockId}
                    onSelectBlock={actions.setSelectedBlockId}
                    onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                    onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                  />
                </Suspense>
              </div>

              {/* Sidebar Direita - Propriedades */}
              <div className="w-80 border-l border-border bg-card">
                <Suspense fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <UltraUnifiedPropertiesPanel
                    onUpdate={() => { }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        );

      case 'headless':
        return (
          <div className="h-full w-full p-4">
            <Suspense fallback={<ComponentLoadingFallback name="Canvas Headless" />}>
              <CanvasDropZone
                blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                selectedBlockId={state.selectedBlockId}
                onSelectBlock={actions.setSelectedBlockId}
                onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                className="h-full border border-border rounded-lg"
              />
            </Suspense>
          </div>
        );

      case 'production':
        // Para modo produção, usar ScalableQuizRenderer
        const ScalableQuizRenderer = React.lazy(() =>
          import('@/components/core/ScalableQuizRenderer')
        );

        return (
          <Suspense fallback={<ComponentLoadingFallback name="Quiz Renderer" />}>
            <ScalableQuizRenderer
              funnelId={funnelId || 'quiz21StepsComplete'}
              mode="production"
              className="h-full"
            />
          </Suspense>
        );

      case 'funnel':
        return (
          <div className="h-full w-full">
            {/* Layout simplificado para funnel */}
            <div className="flex h-full">
              <div className="w-64 border-r border-border">
                <Suspense fallback={<ComponentLoadingFallback name="Etapas" />}>
                  <StepSidebar
                    currentStep={state.currentStep}
                    totalSteps={totalSteps}
                    stepHasBlocks={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => [i + 1, (state.stepBlocks[`step-${i + 1}`]?.length || 0) > 0])
                    )}
                    stepValidation={state.stepValidation}
                    onSelectStep={actions.setCurrentStep}
                    getStepAnalysis={(step) => ({
                      icon: 'quiz',
                      label: `Etapa ${step}`,
                      desc: `Quiz step ${step}`
                    })}
                    renderIcon={(_name, className) => <span className={className}>🎯</span>}
                  />
                </Suspense>
              </div>
              <div className="flex-1">
                <Suspense fallback={<ComponentLoadingFallback name="Canvas" />}>
                  <CanvasDropZone
                    blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                    selectedBlockId={state.selectedBlockId}
                    onSelectBlock={actions.setSelectedBlockId}
                    onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                    onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                  />
                </Suspense>
              </div>
              <div className="w-80 border-l border-border">
                <Suspense fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <UltraUnifiedPropertiesPanel
                    onUpdate={() => { }}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        );

      default:
        logger.warn('UnifiedEditorCore: Modo desconhecido, usando fallback', mode);
        return (
          <Suspense fallback={<EditorLoadingFallback />}>
            <ModularEditorProFallback />
          </Suspense>
        );
    }
  }, [mode, funnelId, state.currentStep, state.stepBlocks, actions]);

  return renderModeContent();
};

export const UnifiedEditorCore: React.FC<UnifiedEditorCoreProps> = ({
  mode = 'visual',
  funnelId,
  initialStep = 1,
  className = 'h-full w-full'
}) => {
  const { state, actions } = useEditor();

  // 🎯 INITIALIZE STEP ON MOUNT
  React.useEffect(() => {
    if (initialStep !== state.currentStep) {
      actions.setCurrentStep(initialStep);
    }

    // Ensure current step is loaded
    actions.ensureStepLoaded(state.currentStep);
  }, [initialStep, state.currentStep, actions]);

  // 🎯 PERFORMANCE MONITORING
  const performanceStats = useMemo(() => ({
    mode,
    currentStep: state.currentStep,
    totalBlocks: Object.values(state.stepBlocks || {}).reduce((acc: number, blocks: any) => acc + (Array.isArray(blocks) ? blocks.length : 0), 0),
    selectedBlock: state.selectedBlockId,
    funnelId
  }), [mode, state, funnelId]);

  React.useEffect(() => {
    logger.info('UnifiedEditorCore: Performance stats', performanceStats);

    // Set global debug info
    if (typeof window !== 'undefined') {
      (window as any).__UNIFIED_EDITOR_STATS__ = performanceStats;
    }
  }, [performanceStats]);


  return (
    <div className={`unified-editor-core ${className} bg-background`}>
      <React.Suspense fallback={<EditorLoadingFallback />}>
        <ModeRenderer mode={mode} funnelId={funnelId} />
      </React.Suspense>
    </div>
  );
};

export default UnifiedEditorCore;