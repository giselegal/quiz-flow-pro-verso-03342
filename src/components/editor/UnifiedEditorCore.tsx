
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
import { appLogger } from '@/lib/utils/logger';
import LazyBoundary from '@/components/common/LazyBoundary';
import { useEditor } from '@/hooks/useEditor';
import { logger } from '@/lib/utils/debugLogger';

// 🎯 LAZY LOADED COMPONENTS (código splitting inteligente)
const EditorToolbar = React.lazy(() => import('@/components/editor/toolbar/EditorToolbar').then(m => ({ default: m.EditorToolbar })));
const StepSidebar = React.lazy(() => import('@/components/editor/sidebars/StepSidebar'));
const UnifiedComponentsPanel = React.lazy(() => import('@/components/editor/panels/UnifiedComponentsPanel'));
const CanvasDropZone = React.lazy(() => import('@/components/editor/canvas/CanvasDropZone.simple'));
const UltraUnifiedPropertiesPanel = React.lazy(() => import('@/components/editor/properties/UltraUnifiedPropertiesPanel'));

// 🎯 FALLBACK COMPONENTS (removed deprecated ModularEditorPro)
// 💡 Produção (quiz renderer) declarado no topo para evitar recriações
const ScalableQuizRenderer = React.lazy(() => import('@/components/core/ScalableQuizRenderer'));

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
    const numsFromNumericKeys = stepKeys
      .map(k => parseInt(k, 10))
      .filter(n => !isNaN(n) && n > 0);
    const numsFromStringKeys = stepKeys
      .map(k => {
        const m = k.match(/step-(\d+)/);
        return m ? parseInt(m[1], 10) : NaN;
      })
      .filter(n => !isNaN(n) && n > 0);
    const allNums = Array.from(new Set([...(numsFromNumericKeys as number[]), ...(numsFromStringKeys as number[])]));
    if (allNums.length > 0) return Math.max(...allNums);
    return state.totalSteps || 21;
  }, [state.stepBlocks]);

  const renderModeContent = useCallback(() => {
    switch (mode) {
      case 'visual':
        return (
          <div className="h-full w-full flex flex-col">
            {/* Toolbar Superior */}
            <LazyBoundary fallback={<ComponentLoadingFallback name="Toolbar" />}>
              <EditorToolbar />
            </LazyBoundary>

            {/* Layout Principal 4 Colunas */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Esquerda - Etapas */}
              <div className="w-64 border-r border-border bg-card">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Etapas" />}>
                  <StepSidebar
                    currentStep={state.currentStep}
                    totalSteps={totalSteps}
                    stepHasBlocks={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => {
                        const idx = i + 1;
                        const byNum = (state.stepBlocks as any)[idx] || [];
                        const byStr = (state.stepBlocks as any)[`step-${String(idx).padStart(2, '0')}`] || (state.stepBlocks as any)[`step-${idx}`] || [];
                        const count = Array.isArray(byNum) ? byNum.length : Array.isArray(byStr) ? byStr.length : 0;
                        return [idx, count > 0];
                      }),
                    )}
                    stepValidation={state.stepValidation}
                    onSelectStep={actions.setCurrentStep}
                    getStepAnalysis={(step) => ({
                      icon: 'quiz',
                      label: `Etapa ${step}`,
                      desc: `Quiz step ${step}`,
                    })}
                    renderIcon={(_name, className) => <span className={className}>🎯</span>}
                  />
                </LazyBoundary>
              </div>

              {/* Sidebar Esquerda - Componentes */}
              <div className="w-64 border-r border-border bg-card">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Componentes" />}>
                  <UnifiedComponentsPanel
                    onAddComponent={(componentId, metadata) => {
                      // Handle component addition
                      appLogger.debug('Adding component:', componentId, metadata);
                    }}
                    compactMode={true}
                  />
                </LazyBoundary>
              </div>

              {/* Canvas Principal */}
              <div className="flex-1 bg-background">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Canvas" />}>
                  <CanvasDropZone
                    blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                    selectedBlockId={state.selectedBlockId}
                    onSelectBlock={actions.setSelectedBlockId}
                    onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                    onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                  />
                </LazyBoundary>
              </div>

              {/* Sidebar Direita - Propriedades */}
              <div className="w-80 border-l border-border bg-card">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <UltraUnifiedPropertiesPanel
                    onUpdate={() => { }}
                  />
                </LazyBoundary>
              </div>
            </div>
          </div>
        );

      case 'headless':
        return (
          <div className="h-full w-full p-4">
            <LazyBoundary fallback={<ComponentLoadingFallback name="Canvas Headless" />}>
              <CanvasDropZone
                blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                selectedBlockId={state.selectedBlockId}
                onSelectBlock={actions.setSelectedBlockId}
                onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                className="h-full border border-border rounded-lg"
              />
            </LazyBoundary>
          </div>
        );

      case 'production':
        return (
          <LazyBoundary fallback={<ComponentLoadingFallback name="Quiz Renderer" />}>
            <ScalableQuizRenderer
              funnelId={funnelId || 'quiz21StepsComplete'}
              mode="production"
              className="h-full"
            />
          </LazyBoundary>
        );

      case 'funnel':
        return (
          <div className="h-full w-full">
            {/* Layout simplificado para funnel */}
            <div className="flex h-full">
              <div className="w-64 border-r border-border">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Etapas" />}>
                  <StepSidebar
                    currentStep={state.currentStep}
                    totalSteps={totalSteps}
                    stepHasBlocks={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => [i + 1, (state.stepBlocks[`step-${i + 1}`]?.length || 0) > 0]),
                    )}
                    stepValidation={state.stepValidation}
                    onSelectStep={actions.setCurrentStep}
                    getStepAnalysis={(step) => ({
                      icon: 'quiz',
                      label: `Etapa ${step}`,
                      desc: `Quiz step ${step}`,
                    })}
                    renderIcon={(_name, className) => <span className={className}>🎯</span>}
                  />
                </LazyBoundary>
              </div>
              <div className="flex-1">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Canvas" />}>
                  <CanvasDropZone
                    blocks={state.stepBlocks[`step-${state.currentStep}`] || []}
                    selectedBlockId={state.selectedBlockId}
                    onSelectBlock={actions.setSelectedBlockId}
                    onUpdateBlock={(blockId, updates) => actions.updateBlock(`step-${state.currentStep}`, blockId, updates)}
                    onDeleteBlock={(blockId) => actions.removeBlock(`step-${state.currentStep}`, blockId)}
                  />
                </LazyBoundary>
              </div>
              <div className="w-80 border-l border-border">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <UltraUnifiedPropertiesPanel
                    onUpdate={() => { }}
                  />
                </LazyBoundary>
              </div>
            </div>
          </div>
        );

      default:
        logger.warn('UnifiedEditorCore: Modo desconhecido, usando fallback', mode);
        return (
          <div className="p-8 text-center">
            <p className="text-gray-600">Modo de edição não suportado: {mode}</p>
          </div>
        );
    }
  }, [mode, funnelId, state.currentStep, state.stepBlocks, actions]);

  return renderModeContent();
};

export const UnifiedEditorCore: React.FC<UnifiedEditorCoreProps> = ({
  mode = 'visual',
  funnelId,
  initialStep = 1,
  className = 'h-full w-full',
}) => {
  const { state, actions } = useEditor();
  const [streamProgress, setStreamProgress] = React.useState(0);

  React.useEffect(() => {
    Promise.all([
      import('@/components/editor/sidebars/StepSidebar'),
      import('@/components/editor/panels/UnifiedComponentsPanel'),
      import('@/components/editor/canvas/CanvasDropZone.simple'),
      import('@/components/editor/properties/UltraUnifiedPropertiesPanel'),
    ]).catch(() => {});
  }, []);

  React.useEffect(() => {
    try {
      const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const templateParam = sp?.get('template');
      const resourceParam = sp?.get('resource');
      const candidateTemplate = templateParam || resourceParam;
      if (!candidateTemplate) return;

      const adapter = new (require('@/editor/adapters/TemplateToFunnelAdapter').TemplateToFunnelAdapter)();
      (async () => {
        for await (const { stage, progress } of adapter.convertTemplateToFunnelStream({ templateId: candidateTemplate, loadAllSteps: true })) {
          actions.setStepBlocks(stage.id, stage.blocks as any[]);
          setStreamProgress(progress);
        }
        setStreamProgress(1);
      })();
    } catch {}
  }, [actions]);

  // Extrair funções estáveis
  const { ensureStepLoaded, setCurrentStep } = actions;

  // 🎯 INITIALIZE STEP ON MOUNT
  React.useEffect(() => {
    if (initialStep !== state.currentStep) {
      setCurrentStep(initialStep);
    }

    // Ensure current step is loaded
    ensureStepLoaded(state.currentStep);
  }, [initialStep, state.currentStep, ensureStepLoaded, setCurrentStep]);

  // 🎯 PERFORMANCE MONITORING
  const performanceStats = useMemo(() => ({
    mode,
    currentStep: state.currentStep,
    totalBlocks: Object.values(state.stepBlocks || {}).reduce((acc: number, blocks: any) => acc + (Array.isArray(blocks) ? blocks.length : 0), 0),
    selectedBlock: state.selectedBlockId,
    funnelId,
    stepsCount: Object.keys(state.stepBlocks || {}).length,
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
      {streamProgress > 0 && streamProgress < 1 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
          <div className="h-1 bg-primary transition-all" style={{ width: `${Math.round(streamProgress * 100)}%` }} />
        </div>
      )}
      <LazyBoundary fallback={<EditorLoadingFallback />}>
        <ModeRenderer mode={mode} funnelId={funnelId} />
      </LazyBoundary>
    </div>
  );
};

export default UnifiedEditorCore;
