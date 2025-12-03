
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
import { useEditor as useEditorCanonical } from '@/core/contexts/EditorContext/EditorStateProvider';
import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';
import { logger } from '@/lib/utils/debugLogger';

// 🎯 LAZY LOADED COMPONENTS (código splitting inteligente)
const EditorToolbar = React.lazy(() => import('@/components/editor/toolbar/EditorToolbar').then(m => ({ default: m.EditorToolbar })));
const StepSidebar = React.lazy(() => import('@/components/editor/sidebars/StepSidebar'));
const UnifiedComponentsPanel = React.lazy(() => import('@/components/editor/panels/UnifiedComponentsPanel'));
const CanvasDropZone = React.lazy(() => import('@/components/editor/canvas/CanvasDropZone.simple'));
const SinglePropertiesPanel = React.lazy(() => import('@/components/editor/properties/SinglePropertiesPanel').then(m => ({ default: m.SinglePropertiesPanel })));

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
  const editor = useEditorCanonical();
  const adapter = useEditorAdapter();

  // Fallback when editor context is not available
  if (!editor) {
    return <div className="flex items-center justify-center h-full">Loading editor...</div>;
  }

  const { state } = editor as any;

  const totalSteps = useMemo(() => {
    return state.totalSteps || 21;
  }, [state.totalSteps]);

  // Fallback para actions (compatibilidade)
  const actions = useMemo(() => ({
    setCurrentStep: (step: number) => {
      // Implementação via adapter ou state direto
      if (adapter?.actions?.setCurrentStep) {
        adapter.actions.setCurrentStep(step);
      }
    },
  }), [adapter]);

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
                    stepValidation={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => {
                        const idx = i + 1;
                        const valid = (state as any).stepValidation?.[idx]?.isValid;
                        return [idx, typeof valid === 'boolean' ? valid : undefined];
                      }),
                    ) as Record<number, boolean>}
                    onAddStep={() => {
                      const addViaEditor = (editor as any).actions?.addStep as (() => Promise<void> | void) | undefined;
                      const addViaAdapter = (adapter as any)?.actions?.addStep as (() => Promise<void> | void) | undefined;
                      if (typeof addViaEditor === 'function') {
                        void Promise.resolve(addViaEditor()).catch(() => { });
                        return;
                      }
                      if (typeof addViaAdapter === 'function') {
                        void Promise.resolve(addViaAdapter()).catch(() => { });
                        return;
                      }
                      // Fallback: avançar número total de steps e selecionar a nova etapa
                      const next = (totalSteps || 0) + 1;
                      // Tentar atualizar totalSteps via editor/adapter se disponível
                      const setTotalStepsEditor = (editor as any).actions?.setTotalSteps as ((n: number) => void) | undefined;
                      const setTotalStepsAdapter = (adapter as any)?.actions?.setTotalSteps as ((n: number) => void) | undefined;
                      if (typeof setTotalStepsEditor === 'function') {
                        try { setTotalStepsEditor(next); } catch { }
                      } else if (typeof setTotalStepsAdapter === 'function') {
                        try { setTotalStepsAdapter(next); } catch { }
                      }
                      actions.setCurrentStep(next);
                      const load = (editor as any).actions?.loadStepBlocks as (id: string) => Promise<any> | undefined;
                      if (typeof load === 'function') {
                        const key = `step-${String(next).padStart(2, '0')}`;
                        void Promise.resolve(load(key)).catch(() => { });
                      }
                    }}
                    onSelectStep={(s) => {
                      actions.setCurrentStep(s);
                      const load = (editor as any).actions?.loadStepBlocks as (id: string) => Promise<any> | undefined;
                      if (typeof load === 'function') {
                        const key = `step-${String(s).padStart(2, '0')}`;
                        void Promise.resolve(load(key)).catch(() => { });
                      }
                    }}
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
                    blocks={
                      (state.stepBlocks as any)[state.currentStep] ||
                      (state.stepBlocks as any)[`step-${state.currentStep}`] ||
                      (state.stepBlocks as any)[`step-${String(state.currentStep).padStart(2, '0')}`] ||
                      []
                    }
                    selectedBlockId={adapter.selectedBlockId ?? state.selectedBlockId}
                    onSelectBlock={(id) => (editor as any).actions?.selectBlock ? (editor as any).actions.selectBlock(id) : undefined}
                    onUpdateBlock={adapter.actions.updateBlock}
                    onDeleteBlock={adapter.actions.deleteBlock}
                  />
                </LazyBoundary>
              </div>

              {/* Sidebar Direita - Propriedades */}
              <div className="w-80 border-l border-border bg-card">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <SinglePropertiesPanel
                    selectedBlock={state.selectedBlockId ?
                      (state.stepBlocks as any)[state.currentStep]?.find((b: any) => b.id === state.selectedBlockId) || null
                      : null}
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
                blocks={
                  (state.stepBlocks as any)[state.currentStep] ||
                  (state.stepBlocks as any)[`step-${state.currentStep}`] ||
                  (state.stepBlocks as any)[`step-${String(state.currentStep).padStart(2, '0')}`] ||
                  []
                }
                selectedBlockId={adapter.selectedBlockId ?? state.selectedBlockId}
                onSelectBlock={(id) => (editor as any).actions?.selectBlock ? (editor as any).actions.selectBlock(id) : undefined}
                onUpdateBlock={adapter.actions.updateBlock}
                onDeleteBlock={adapter.actions.deleteBlock}
                className="h-full border border-border rounded-lg"
              />
            </LazyBoundary>
          </div>
        );

      case 'production':
        return (
          <LazyBoundary fallback={<ComponentLoadingFallback name="Quiz Renderer" />}>
            <ScalableQuizRenderer
              funnelId={funnelId ?? ''}
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
                      Array.from({ length: totalSteps }, (_, i) => {
                        const idx = i + 1;
                        const byNum = (state.stepBlocks as any)[idx] || [];
                        const byStr = (state.stepBlocks as any)[`step-${String(idx).padStart(2, '0')}`] || (state.stepBlocks as any)[`step-${idx}`] || [];
                        const count = Array.isArray(byNum) ? byNum.length : Array.isArray(byStr) ? byStr.length : 0;
                        return [idx, count > 0];
                      }),
                    )}
                    stepValidation={Object.fromEntries(
                      Array.from({ length: totalSteps }, (_, i) => {
                        const idx = i + 1;
                        const valid = (state as any).stepValidation?.[idx]?.isValid;
                        return [idx, typeof valid === 'boolean' ? valid : undefined];
                      }),
                    ) as Record<number, boolean>}
                    onAddStep={() => {
                      const addViaEditor = (editor as any).actions?.addStep as (() => Promise<void> | void) | undefined;
                      const addViaAdapter = (adapter as any)?.actions?.addStep as (() => Promise<void> | void) | undefined;
                      if (typeof addViaEditor === 'function') {
                        void Promise.resolve(addViaEditor()).catch(() => { });
                        return;
                      }
                      if (typeof addViaAdapter === 'function') {
                        void Promise.resolve(addViaAdapter()).catch(() => { });
                        return;
                      }
                      const next = (totalSteps || 0) + 1;
                      // Tentar atualizar totalSteps via editor/adapter se disponível
                      const setTotalStepsEditor = (editor as any).actions?.setTotalSteps as ((n: number) => void) | undefined;
                      const setTotalStepsAdapter = (adapter as any)?.actions?.setTotalSteps as ((n: number) => void) | undefined;
                      if (typeof setTotalStepsEditor === 'function') {
                        try { setTotalStepsEditor(next); } catch { }
                      } else if (typeof setTotalStepsAdapter === 'function') {
                        try { setTotalStepsAdapter(next); } catch { }
                      }
                      actions.setCurrentStep(next);
                      const load = (editor as any).actions?.loadStepBlocks as (id: string) => Promise<any> | undefined;
                      if (typeof load === 'function') {
                        const key = `step-${String(next).padStart(2, '0')}`;
                        void Promise.resolve(load(key)).catch(() => { });
                      }
                    }}
                    onSelectStep={(s) => {
                      actions.setCurrentStep(s);
                      const load = (editor as any).actions?.loadStepBlocks as (id: string) => Promise<any> | undefined;
                      if (typeof load === 'function') {
                        const key = `step-${String(s).padStart(2, '0')}`;
                        void Promise.resolve(load(key)).catch(() => { });
                      }
                    }}
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
                    blocks={
                      (state.stepBlocks as any)[state.currentStep] ||
                      (state.stepBlocks as any)[`step-${state.currentStep}`] ||
                      (state.stepBlocks as any)[`step-${String(state.currentStep).padStart(2, '0')}`] ||
                      []
                    }
                    selectedBlockId={state.selectedBlockId}
                    onSelectBlock={(id) => (editor as any).actions?.selectBlock ? (editor as any).actions.selectBlock(id) : undefined}
                    onUpdateBlock={adapter.actions.updateBlock}
                    onDeleteBlock={adapter.actions.deleteBlock}
                  />
                </LazyBoundary>
              </div>
              <div className="w-80 border-l border-border">
                <LazyBoundary fallback={<ComponentLoadingFallback name="Propriedades" />}>
                  <SinglePropertiesPanel
                    selectedBlock={state.selectedBlockId ?
                      (state.stepBlocks as any)[state.currentStep]?.find((b: any) => b.id === state.selectedBlockId) || null
                      : null}
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
  const editor = useEditorCanonical();
  const adapter = useEditorAdapter();
  const [streamProgress, setStreamProgress] = React.useState(0);

  // Fallback when editor context is not available
  if (!editor) {
    return <div className="flex items-center justify-center h-full">Loading editor...</div>;
  }

  const { state } = editor as any;
  const editorActions = (editor as any).actions as {
    selectBlock?: (id: string) => void;
    loadStepBlocks?: (stepKey: string) => Promise<void>;
  } | undefined;

  // Criar wrapper de actions para compatibilidade
  const actions = React.useMemo(() => ({
    setCurrentStep: (step: number) => {
      if (adapter?.actions?.setCurrentStep) {
        adapter.actions.setCurrentStep(step);
      }
    },
  }), [adapter]);

  React.useEffect(() => {
    Promise.all([
      import('@/components/editor/sidebars/StepSidebar'),
      import('@/components/editor/panels/UnifiedComponentsPanel'),
      import('@/components/editor/canvas/CanvasDropZone.simple'),
      import('@/components/editor/properties/SinglePropertiesPanel'),
    ]).catch(() => { });
  }, []);

  React.useEffect(() => {
    try {
      const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const templateParam = sp?.get('template');
      const resourceParam = sp?.get('resource');
      const candidateTemplate = templateParam || resourceParam;
      if (!candidateTemplate) return;

      // Template loading removed - blockActions.replaceBlocks doesn't exist
      setStreamProgress(1);
    } catch { }
  }, []);

  // 🎯 INITIALIZE STEP ON MOUNT
  React.useEffect(() => {
    if (initialStep !== state.currentStep) {
      actions.setCurrentStep(initialStep);
    }

    // Ensure current step is loaded
    const load = editorActions?.loadStepBlocks;
    if (typeof load === 'function') {
      const key = `step-${String(state.currentStep).padStart(2, '0')}`;
      void Promise.resolve(load(key)).catch(() => { });
    }
  }, [initialStep, state.currentStep, editorActions, actions]);

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
