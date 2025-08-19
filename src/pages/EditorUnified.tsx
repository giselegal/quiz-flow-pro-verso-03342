import React, { useEffect, useRef, useState } from 'react';

// 🎨 ESTILOS PROFISSIONAIS
import '@/styles/editor-unified.css';

// Importações DnD
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

// EDITOR UNIFICADO - Componentes principais
import {
    EditorControlsManager,
    EditorPropertiesPanel,
    EditorStageManager,
    UnifiedPreviewEngine,
    UnifiedQuizStepLoader,
} from '@/components/editor/unified';

// 🚀 PREVIEW SYSTEM
import { PreviewProvider } from '@/contexts/PreviewContext';

// 🎪 HOOKS CORE UNIFICADO
import { useQuizFlow } from '@/hooks/core/useQuizFlow';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { saveEditor } from '@/services/editorService';
import type { Block } from '@/types/editor';

// 🔧 MODAIS (legados)
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { SaveTemplateModal } from '@/components/editor/SaveTemplateModal';

// 🎨 ÍCONES E COMPONENTES DE UI PROFISSIONAIS
import { BrandLogo } from '@/components/ui/brand-logo';
import { Separator } from '@/components/ui/separator';

/**
 * 🎨 EDITOR UNIFICADO - Design Profissional
 *
 * Editor de funil com sistema unificado e identidade visual consistente:
 * - Design profissional com cores da marca
 * - Identidade visual coesa e moderna
 * - UnifiedPreviewEngine: Preview 100% idêntico à produção
 * - EditorStageManager: Gerenciamento completo das 21 etapas
 * - EditorControlsManager: Controles unificados do editor
 * - EditorPropertiesPanel: Painel de propriedades avançado
 * - Integração com useQuizFlow e quiz21StepsComplete.ts
 * - Sistema de auto-save e keyboard shortcuts
 * 🚀 EDITOR UNIFICADO INTEGRADO
 */
const EditorUnified: React.FC = () => {
  // 🎪 HOOK PRINCIPAL UNIFICADO
  const { actions } = useQuizFlow({
    mode: 'editor',
    onStepChange: step => {
      console.log('🎯 Editor: Mudança de etapa:', step);
      setCurrentStep(step);
    },
    initialStep: 1,
  });

  // Configuração dos sensores para DndContext
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px é a distância mínima para iniciar o drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });

  // Estado local do Editor Unificado
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'test'>('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Estados para EditorControlsManager
  const [controlsState, setControlsState] = useState({
    isPreviewing: editorMode === 'preview',
    viewportSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    showGrid: false,
    showLayers: false,
    autoSave: true,
    canUndo: false,
    canRedo: false,
    isSaving: false,
  });

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    funnelId,
    setFunnelId,
    blockActions: { deleteBlock, updateBlock, reorderBlocks }, // ADICIONADO reorderBlocks
    uiState: { setIsPreviewing },
    computed: { currentBlocks, stageCount },
    stageActions,
  } = useEditor();

  // Total de etapas dinâmico (fallback para 21 se ainda não carregou)
  const totalSteps = stageCount || 21;

  // funnelId estável por sessão do editor
  const funnelIdRef = useRef<string>(`editor-unified-${Date.now()}`);
  useEffect(() => {
    // Sincroniza com o EditorContext (apenas uma vez)
    if (funnelId !== funnelIdRef.current) {
      setFunnelId(funnelIdRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🆕 AUTO-SAVE COM DEBOUNCE - Implementação do salvamento automático
  useAutoSaveWithDebounce({
    data: {
      blocks: currentBlocks,
      activeStageId,
      currentStep,
      funnelId: funnelIdRef.current,
      timestamp: Date.now(),
    },
    onSave: async data => {
      try {
        console.log('🔄 Auto-save ativado (Editor Unificado):', data);
        await saveEditor(data, false);
        console.log('✅ Auto-save realizado com sucesso');
      } catch (error) {
        console.warn('⚠️ Auto-save: Erro:', error);
      }
    },
    delay: 3000,
    enabled: true,
    showToasts: false,
  });

  // Handlers do Editor Unificado
  const handleStepSelect = async (step: number) => {
    console.log('🎯 Editor Unificado: Step selecionado:', step);

    // Atualiza o estado local primeiro
    setCurrentStep(step);

    // Sincroniza navegação com useQuizFlow
    actions.goToStep(step);

    // Atualiza o activeStageId no contexto do editor
    // (o UnifiedQuizStepLoader fará o carregamento dos blocos)
    stageActions.setActiveStage?.(`step-${step}`);
  };

  const handleModeChange = (mode: 'edit' | 'preview' | 'test') => {
    console.log('🔄 Editor Unificado: Modo alterado:', mode);
    setEditorMode(mode);
    setIsPreviewing(mode === 'preview' || mode === 'test');
    setControlsState(prev => ({ ...prev, isPreviewing: mode === 'preview' || mode === 'test' }));
  };

  const handleViewportChange = (size: 'mobile' | 'tablet' | 'desktop') => {
    setControlsState(prev => ({ ...prev, viewportSize: size }));
  };

  // Handler para arrastar e soltar (drag and drop)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Encontrar os índices dos blocos (convertendo IDs para string se necessário)
      const activeId = String(active.id);
      const overId = String(over.id);
      
      console.log('🔄 Drag End:', { activeId, overId });
      
      const oldIndex = currentBlocks.findIndex(block => block.id === activeId);
      const newIndex = currentBlocks.findIndex(block => block.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        console.log('🔄 Reordenando blocos:', { oldIndex, newIndex });
        // Usar reorderBlocks do EditorContext
        reorderBlocks(oldIndex, newIndex);
      } else {
        console.warn('⚠️ Não foi possível encontrar os índices dos blocos:', { 
          activeId, overId, found: currentBlocks.map(b => b.id) 
        });
      }
    }
  };

  // Handler para reordenação direta (ex: via preview engine)
  const handleBlocksReordered = (startIndex: number, endIndex: number) => {
    console.log('🔄 Reordenando blocos:', { startIndex, endIndex });
    reorderBlocks(startIndex, endIndex);
  };

  // Actions para controles do editor
  const controlsActions = {
    togglePreview: () => handleModeChange(editorMode === 'preview' ? 'edit' : 'preview'),
    setViewportSize: handleViewportChange,
    toggleGrid: () => setControlsState(prev => ({ ...prev, showGrid: !prev.showGrid })),
    toggleLayers: () => setControlsState(prev => ({ ...prev, showLayers: !prev.showLayers })),
    save: () => {
      console.log('💾 Salvamento manual acionado');
      setControlsState(prev => ({ ...prev, isSaving: true }));
      // TODO: Implementar save manual
      setTimeout(() => setControlsState(prev => ({ ...prev, isSaving: false })), 1000);
    },
    undo: () => console.log('↶ Undo'),
    redo: () => console.log('↷ Redo'),
    exportTemplate: () => console.log('📤 Export'),
    importTemplate: () => console.log('📥 Import'),
  };

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    console.log('📝 Editor Unificado: Atualizando bloco:', blockId, updates);
    updateBlock(blockId, updates);
  };

  const handleBlockSelect = (blockId: string) => {
    console.log('🎯 Editor Unificado: Bloco selecionado:', blockId);
    setSelectedBlockId(blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = currentBlocks.find(b => b.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `${blockId}-copy-${Date.now()}`,
        order: blockToDuplicate.order + 1,
      };
      // TODO: Implementar duplicação via context
      console.log('📋 Duplicando bloco:', newBlock);
    }
  };

  // Obter bloco selecionado
  const currentSelectedBlock = selectedBlockId
    ? currentBlocks.find(b => b.id === selectedBlockId) || null
    : null;

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onDelete: () => {
      if (selectedBlockId) {
        handleBlockDelete(selectedBlockId);
      }
    },
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={(event) => console.log('🔄 Drag Start:', event)}
      modifiers={[restrictToParentElement]}
      autoScroll={true}
    >
      <PreviewProvider totalSteps={totalSteps} funnelId={funnelIdRef.current}>
        {/* Carregador otimizado de etapas do quiz */}
        <UnifiedQuizStepLoader
          stepNumber={currentStep}
          onStepLoaded={blockCount => {
            console.log(
              `✅ UnifiedQuizStepLoader: ${blockCount} blocos carregados para etapa ${currentStep}`
            );
          }}
          onStepError={error => {
            console.error(
              `❌ UnifiedQuizStepLoader: Erro no carregamento da etapa ${currentStep}:`,
              error.message
            );
          }}
        />

        {/* 🎨 CONTAINER PRINCIPAL COM DESIGN PROFISSIONAL */}
        <div className="unified-editor-container min-h-screen bg-gradient-to-br from-brand-light/10 via-white to-brand-primary/5">
          {/* 🏢 HEADER PROFISSIONAL */}
          <header className="unified-editor-header bg-white/95 backdrop-blur-xl border-b border-brand-light/30 shadow-sm animate-fade-in-up">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between">
                {/* Logo profissional */}
                <BrandLogo
                  size="md"
                  variant="full"
                  showSubtitle={true}
                  className="flex items-center space-x-3 animate-slide-in-left"
                />

                {/* Status e Info */}
                <div className="flex items-center space-x-4 animate-slide-in-right">
                  <div className="hidden md:flex items-center space-x-2">
                    <div className="status-indicator active">
                      <div className="status-pulse bg-emerald-400"></div>
                      <span>Auto-save ativo</span>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-4 hidden md:block opacity-30" />
                  <div className="text-xs text-brand-text/70 font-medium">
                    Etapa {currentStep} de {totalSteps}
                  </div>
                </div>
              </div>
            </div>

            {/* 🎮 CONTROLS MANAGER - Barra de controles integrada */}
            <div className="border-t border-brand-light/20 bg-brand-light/5">
              <EditorControlsManager
                state={controlsState}
                actions={controlsActions}
                mode={editorMode === 'edit' ? 'full' : 'minimal'}
                className="px-6 py-2"
              />
            </div>
          </header>

          {/* 🎯 LAYOUT PRINCIPAL PROFISSIONAL */}
          <div className="flex h-[calc(100vh-120px)]">
            {/* 🎪 STAGE MANAGER - Painel lateral esquerdo */}
            <aside className="unified-editor-sidebar w-80 bg-white/90 backdrop-blur-sm border-r border-brand-light/30 shadow-sm animate-slide-in-left">
              <div className="h-full flex flex-col">
                {/* Header do painel */}
                <div className="sidebar-header px-4 py-3 bg-brand-light/10 border-b border-brand-light/30">
                  <h2 className="text-sm font-semibold text-brand-text flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-brand-primary to-brand-dark rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">{totalSteps}</span>
                    </div>
                    Etapas do Quiz
                  </h2>
                  <p className="text-xs text-brand-text/60 mt-1 font-medium">
                    Navegue pelas etapas do funil
                  </p>
                </div>

                {/* Conteúdo do Stage Manager */}
                <div className="flex-1 overflow-hidden">
                  <EditorStageManager
                    mode={editorMode}
                    initialStep={currentStep}
                    onStepSelect={handleStepSelect}
                    onModeChange={handleModeChange}
                    className="h-full"
                  />
                </div>
              </div>
            </aside>

            {/* 🎨 CANVAS PRINCIPAL - Área central com design premium */}
            <main className="unified-editor-canvas flex-1 relative overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">
              {/* Background pattern sutil */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(184,155,122,0.03)_0%,transparent_50%)]"></div>

              <div
                ref={scrollRef}
                className="preview-container relative h-full p-8 overflow-auto animate-fade-in-up"
              >
                {/* Container do preview com sombra profissional */}
                <div className="mx-auto max-w-5xl">
                  <div className="preview-frame shadow-2xl shadow-brand-primary/10 rounded-2xl overflow-hidden border border-brand-light/20 bg-white">
                    <UnifiedPreviewEngine
                      blocks={currentBlocks}
                      selectedBlockId={selectedBlockId}
                      isPreviewing={editorMode === 'preview' || editorMode === 'test'}
                      viewportSize={controlsState.viewportSize}
                      onBlockSelect={handleBlockSelect}
                      onBlockUpdate={handleBlockUpdate}
                      onBlocksReordered={handleBlocksReordered}
                      mode={editorMode === 'edit' ? 'editor' : 'preview'}
                      className=""
                      key={`preview-step-${currentStep}`} // Força a recriação do componente quando a etapa muda
                    />
                  </div>
                </div>
              </div>
            </main>

            {/* 📝 PROPERTIES PANEL - Painel lateral direito */}
            <aside className="unified-editor-sidebar w-80 bg-white/90 backdrop-blur-sm border-l border-brand-light/30 shadow-sm animate-slide-in-right">
              <div className="h-full flex flex-col">
                {/* Header do painel */}
                <div className="sidebar-header px-4 py-3 bg-brand-light/10 border-b border-brand-light/30">
                  <h2 className="text-sm font-semibold text-brand-text flex items-center gap-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-brand-dark to-brand-primary rounded-md flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs">⚙</span>
                    </div>
                    Propriedades
                  </h2>
                  <p className="text-xs text-brand-text/60 mt-1 font-medium">
                    {currentSelectedBlock
                      ? 'Configurar elemento selecionado'
                      : 'Selecione um elemento para editar'}
                  </p>
                </div>

                {/* Conteúdo do Properties Panel */}
                <div className="flex-1 overflow-auto">
                  <EditorPropertiesPanel
                    selectedBlock={currentSelectedBlock}
                    onBlockUpdate={handleBlockUpdate}
                    onBlockDuplicate={handleBlockDuplicate}
                    onBlockDelete={handleBlockDelete}
                    previewMode={editorMode === 'preview'}
                    onPreviewToggle={enabled => {
                      setEditorMode(enabled ? 'preview' : 'edit');
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </aside>
          </div>

          {/* MODAIS COM DESIGN APRIMORADO */}
          {showFunnelSettings && (
            <FunnelSettingsPanel
              funnelId={funnelIdRef.current}
              isOpen={showFunnelSettings}
              onClose={() => setShowFunnelSettings(false)}
            />
          )}

          {showSaveTemplateModal && (
            <SaveTemplateModal
              isOpen={showSaveTemplateModal}
              onClose={() => setShowSaveTemplateModal(false)}
              currentBlocks={currentBlocks}
              currentFunnelId={funnelIdRef.current}
            />
          )}
        </div>
      </PreviewProvider>
    </DndContext>
  );
};

export default EditorUnified;
