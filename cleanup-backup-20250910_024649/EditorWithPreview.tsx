import React, { useState } from 'react';

// Utility functions
// import { cn } from '@/lib/utils';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { StepDndProvider } from '@/components/editor/dnd/StepDndProvider';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
// Configurações de funil movidas para "Meus Funis" e "Modelos de Funis"
// import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { SaveTemplateModal } from '@/components/editor/SaveTemplateModal';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
// 🚀 PREVIEW SYSTEM
import { PreviewNavigation } from '@/components/preview/PreviewNavigation';
import { PreviewToggleButton } from '@/components/preview/PreviewToggleButton';
import { PreviewProvider } from '@/context/PreviewContext';
import { QuizFlowProvider } from '@/context/QuizFlowProvider';
// 🎯 QUIZ 21 STEPS SYSTEM
import { Quiz21StepsNavigation } from '@/components/quiz/Quiz21StepsNavigation';
import { Quiz21StepsProvider, useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
// 🆕 NOVO PAINEL DE PROPRIEDADES (AGORA PADRÃO)
import { PropertiesColumn } from '@/components/editor/properties/PropertiesColumn';
// 🔍 DEBUG COMPONENT
import { StepsDebugPanel } from '@/components/debug/StepsDebugPanel';

// Context & Hooks
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { saveEditor } from '@/services/editorService';

/**
 * Editor Fixed - Versão Estável do Editor Principal
 *
 * Editor de funil com drag & drop completo, incluindo:
 * - Layout de 4 colunas responsivo
 * - Sistema avançado de drag & drop
 * - Painel universal de propriedades
 * - Atalhos de teclado e histórico de mudanças
 * - Preview mode e viewport responsivo
 * - Sistema de ativação automática de 21 etapas
 * - 🆕 AUTO-SAVE IMPLEMENTADO COM FEEDBACK
 * 🚀 SISTEMA DE PREVIEW INTEGRADO
 */
const EditorFixedPageWithDragDrop: React.FC = () => {
  // 🎯 OBTER ID DINÂMICO DA URL
  const getCurrentFunnelId = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('funnel') || 'default-funnel';
    } catch {
      return 'default-funnel';
    }
  };

  const dynamicFunnelId = getCurrentFunnelId();
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });

  // Estado local
  // const [showFunnelSettings, setShowFunnelSettings] = useState(false); // Removido - configurações movidas para Meus Funis
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    blockActions: { setSelectedBlockId, deleteBlock, updateBlock },
    uiState: { isPreviewing, viewportSize },
    computed: { currentBlocks, selectedBlock },
  } = useEditor();

  // 🎯 QUIZ 21 STEPS CONTEXT - Acesso aos dados das 21 etapas
  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    isLoading: stepsLoading,
  } = useQuiz21Steps();

  // 🔍 DEBUG: Verificando estado das 21 etapas
  console.log('🎯 EditorWithPreview DEBUG:', {
    isPreviewing,
    activeStageId,
    currentBlocks: currentBlocks?.length || 0,
    currentStep,
    totalSteps,
    stepsLoading,
    canGoNext,
    canGoPrevious,
    timestamp: new Date().toISOString(),
  });

  // 🔍 PONTO CEGO: Análise detalhada do problema
  const debugInfo = {
    quiz21Steps: {
      currentStep,
      totalSteps,
      stepsLoading,
      canGoNext,
      canGoPrevious,
    },
    problemAnalysis: {
      isStepsLoadingStuck: stepsLoading && totalSteps === 0,
      hasTotalSteps: totalSteps > 0,
      isCurrentStepValid: currentStep >= 1 && currentStep <= 21,
      navigationWorking: canGoNext || canGoPrevious,
    },
  };

  console.log('🔍 ANÁLISE DO PONTO CEGO:', debugInfo);

  // 🆕 AUTO-SAVE COM DEBOUNCE - Implementação do salvamento automático
  useAutoSaveWithDebounce({
    data: {
      blocks: currentBlocks,
      activeStageId,
      funnelId: `editor-${Date.now()}`,
      timestamp: Date.now(),
    },
    onSave: async data => {
      try {
        console.log('🔄 Auto-save ativado:', data);
        await saveEditor(data, false); // false = não mostrar toast para auto-save
        console.log('✅ Auto-save realizado com sucesso');
      } catch (error) {
        console.warn('⚠️ Auto-save: Erro:', error);
      }
    },
    delay: 3000, // 3 segundos após última alteração
    enabled: true, // Sempre ativo
    showToasts: false, // Não mostrar toast para auto-save (só para manual)
  });

  // Configuração de viewport responsivo - MANTÉM O FUNIL COM APARÊNCIA ORIGINAL
  const getCanvasClassName = () => {
    const baseClasses =
      'transition-all duration-500 ease-out mx-auto bg-white rounded-2xl shadow-2xl shadow-black/40 border border-gray-300/50 ring-1 ring-gray-200/30';

    switch (viewportSize) {
      case 'sm':
        return `${baseClasses} w-[375px] min-h-[600px]`;
      case 'md':
        return `${baseClasses} w-[768px] min-h-[1024px]`;
      case 'lg':
        return `${baseClasses} w-[1200px] min-h-[1024px]`;
      case 'full':
      default:
        return `${baseClasses} w-full min-h-full`;
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onDelete: () => {
      if (selectedBlockId) {
        handleDeleteBlock(selectedBlockId);
      }
    },
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <PreviewProvider>
      <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Navigation optimizado */}
        {isPreviewing ? (
          <PreviewNavigation />
        ) : (
          <EditorToolbar />
        )}

        <FourColumnLayout
          stagesPanel={<FunnelStagesPanel />}
          componentsPanel={<CombinedComponentsPanel />}
          canvas={
            <div className="flex flex-col h-full">
              {/* 🎯 NAVEGAÇÃO DAS 21 ETAPAS - Sistema integrado */}
              <div className="border-b border-gray-700/50 bg-black/20 backdrop-blur-sm">
                <Quiz21StepsNavigation
                  className="text-white"
                />
              </div>

              {/* 🔍 SEÇÃO DE DEBUG E DIAGNÓSTICO */}
              {!isPreviewing && stepsLoading && (
                <div className="bg-red-900/20 border border-red-700/30 p-4 m-4 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-red-300">
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-medium">Carregando sistema de 21 etapas...</span>
                  </div>
                  <div className="mt-2 text-sm text-red-400">
                    <details>
                      <summary className="cursor-pointer hover:text-red-300">Ver diagnóstico</summary>
                      <div className="mt-2 p-2 bg-red-950/30 rounded border border-red-800/30">
                        <small>Verificar FunnelsProvider está configurado corretamente</small>
                        <br />
                        <small>currentStep: {currentStep}</small>
                        <br />
                        <small>totalSteps: {totalSteps}</small>
                        <br />
                        <small>isLoading: {String(stepsLoading)}</small>
                      </div>
                    </details>
                  </div>
                </div>
              )}

              {/* ⚠️ SISTEMA DE ALERTA - Navegação travada */}
              {!isPreviewing && !stepsLoading && (!canGoNext && !canGoPrevious) && (
                <div className="bg-amber-900/20 border border-amber-700/30 p-4 m-4 rounded-lg backdrop-blur-sm">
                  <div className="text-amber-300">
                    <span className="font-semibold">⚠️ Navegação bloqueada - verificar configurações</span>
                    <div className="text-sm text-amber-400 mt-1">
                      Etapa {currentStep} de {totalSteps} - Verificar contexto do Quiz21Steps
                    </div>
                  </div>
                </div>
              )}

              {/* 🎨 CANVAS PRINCIPAL - Sistema de Drop Zone */}
              <div className="flex-1 overflow-auto">
                <div
                  ref={scrollRef}
                  className="min-h-full p-8 relative"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <div className={getCanvasClassName()}>
                    <StepDndProvider stepNumber={currentStep}>
                      <CanvasDropZone isEmpty={currentBlocks.length === 0} scopeId={currentStep}>
                        <div className="space-y-4">
                          {currentBlocks.map(block => (
                            <div key={block.id} onClick={() => setSelectedBlockId(block.id)}>
                              <UniversalBlockRenderer
                                block={block as any}
                                isSelected={selectedBlockId === block.id}
                                mode={isPreviewing ? 'preview' : 'editor'}
                                onPropertyChange={(key, value) =>
                                  updateBlock(block.id, { [key]: value })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </CanvasDropZone>
                    </StepDndProvider>
                  </div>

                  {/* 🎮 PREVIEW TOGGLE - Botão flutuante para alternar preview */}
                  <div className="fixed bottom-4 right-4 z-50">
                    <PreviewToggleButton variant="full" />
                  </div>
                </div>
              </div>
            </div>
          }
          propertiesPanel={
            <PropertiesColumn
              selectedBlock={selectedBlock || undefined}
              onUpdate={updates => {
                if (selectedBlock?.id) {
                  updateBlock(selectedBlock.id, updates as any);
                }
              }}
              onClose={() => setSelectedBlockId(null)}
              onDelete={() => {
                if (selectedBlock?.id) {
                  handleDeleteBlock(selectedBlock.id);
                }
              }}
            />
          }
        />

        {/* 🔍 DEBUG PANEL - Para analisar o problema das etapas */}
        <StepsDebugPanel />

        {/* MODAIS */}
        {/* CONFIGURAÇÕES DE FUNIL REMOVIDAS - Agora disponíveis em "Meus Funis" */}
        {/* {showFunnelSettings && (
          <FunnelSettingsPanel
            funnelId={dynamicFunnelId}
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )} */}

        {showSaveTemplateModal && (
          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            currentBlocks={currentBlocks}
            currentFunnelId={dynamicFunnelId}
          />
        )}
      </div>
    </PreviewProvider>
  );
};

// EXPORT WRAPPER - Component com Preview System, FunnelsProvider e Quiz21StepsProvider
export const EditorWithPreview: React.FC = () => {
  // 🎯 OBTER ID DINÂMICO DA URL
  const getCurrentFunnelId = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('funnel') || 'default-funnel';
    } catch {
      return 'default-funnel';
    }
  };

  const dynamicFunnelId = getCurrentFunnelId();

  React.useEffect(() => {
    console.log('🚀 EditorWithPreview: Inicializando com funnelId dinâmico:', dynamicFunnelId);
  }, [dynamicFunnelId]);

  return (
    <FunnelsProvider debug={true}>
      <EditorProvider funnelId={dynamicFunnelId}>
        <EditorQuizProvider>
          <QuizFlowProvider>
            <PreviewProvider>
              <Quiz21StepsProvider debug={true} initialStep={1}>
                <EditorFixedPageWithDragDrop />
              </Quiz21StepsProvider>
            </PreviewProvider>
          </QuizFlowProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

// ✅ EXPORT DEFAULT
export default EditorWithPreview;
