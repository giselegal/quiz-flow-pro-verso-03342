import React, { useState } from 'react';

// Utility functions
// import { cn } from '@/lib/utils';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
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
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
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
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    blockActions: { setSelectedBlockId, deleteBlock, updateBlock },
    uiState: { isPreviewing, setIsPreviewing, viewportSize },
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

  // Configuração de viewport responsivo
  const getCanvasClassName = () => {
    const baseClasses =
      'transition-all duration-500 ease-out mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20';

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

  const handleStageSelect = (_stageId: string) => {
    // O EditorContext já gerencia internamente
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
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
        {/* 🚀 TOOLBAR PRINCIPAL - Versão simplificada integrada */}
        <div className="flex items-center justify-between bg-white border-b border-stone-200 shadow-sm p-4">
          <EditorToolbar />
        </div>

        {/* 🎯 LAYOUT PRINCIPAL - Layout de 4 colunas estável */}
        <FourColumnLayout
          stagesPanel={
            <div className="flex flex-col h-full gap-4">
              {/* Estágios do funil */}
              <FunnelStagesPanel onStageSelect={handleStageSelect} />
            </div>
          }
          componentsPanel={<CombinedComponentsPanel />}
          canvas={
            <div className="h-full flex flex-col">
              {/* 🎯 NAVEGAÇÃO SUPERIOR - Sempre visível, sem sobreposição */}
              <div className="flex-shrink-0 bg-white border-b border-stone-200 shadow-sm">
                {/* 📱 PREVIEW NAVIGATION - Sistema de Navegação do Preview */}
                {isPreviewing ? (
                  <div className="p-4">
                    <PreviewNavigation position="static" />
                  </div>
                ) : (
                  /* 🎯 QUIZ 21 STEPS NAVIGATION - Navegação das 21 Etapas */
                  <div className="p-4">
                    {/* 📊 DEBUG: Status das etapas */}
                    {stepsLoading ? (
                      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
                        🔄 Carregando {totalSteps} etapas...
                      </div>
                    ) : totalSteps === 0 ? (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 animate-pulse">
                        <div className="font-bold">🔴 PONTO CEGO: Nenhuma etapa carregada!</div>
                        <small>Verifique se FunnelsProvider está configurado corretamente</small>
                        <div className="mt-2 text-xs">
                          Timestamp: {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                        <div className="font-semibold">
                          ✅ {totalSteps} etapas carregadas | Etapa atual: {currentStep}
                        </div>
                        <div className="text-sm mt-1">
                          Navegação: {canGoNext ? '➡️' : '🚫'} Próximo |{' '}
                          {canGoPrevious ? '⬅️' : '🚫'} Anterior
                        </div>
                        {!canGoNext && !canGoPrevious && (
                          <small className="text-orange-600">
                            ⚠️ Navegação bloqueada - verificar configurações
                          </small>
                        )}
                      </div>
                    )}

                    <Quiz21StepsNavigation
                      position="static"
                      variant="full"
                      showProgress={true}
                      showControls={true}
                    />
                  </div>
                )}
              </div>

              {/* 🎨 CANVAS PRINCIPAL - Sistema de Drop Zone */}
              <div className="flex-1 overflow-auto">
                <div
                  ref={scrollRef}
                  className="min-h-full p-8 relative"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <div className={getCanvasClassName()}>
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
            <PropertiesPanel
              selectedBlock={selectedBlock ? { ...selectedBlock, properties: selectedBlock.properties || {} } : null}
              onUpdate={updates => {
                if (selectedBlock?.id) {
                  updateBlock(selectedBlock.id, updates);
                }
              }}
              onClose={() => setSelectedBlockId(null)}
              onDelete={() => {
                if (selectedBlock?.id) {
                  handleDeleteBlock(selectedBlock.id);
                }
              }}
              previewMode={isPreviewing ? 'desktop' : 'desktop'}
              onPreviewModeChange={() => setIsPreviewing(!isPreviewing)}
            />
          }
        />

        {/* 🔍 DEBUG PANEL - Para analisar o problema das etapas */}
        <StepsDebugPanel />

        {/* MODAIS */}
        {showFunnelSettings && (
          <FunnelSettingsPanel
            funnelId="quiz-estilo-completo"
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}

        {showSaveTemplateModal && (
          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            currentBlocks={currentBlocks}
            currentFunnelId="quiz-estilo-completo"
          />
        )}
      </div>
    </PreviewProvider>
  );
};

// EXPORT WRAPPER - Component com Preview System, FunnelsProvider e Quiz21StepsProvider
export const EditorWithPreview: React.FC = () => {
  // 🎯 FORÇAR ID CORRETO PARA CARREGAMENTO DAS 21 ETAPAS
  React.useEffect(() => {
    console.log('🚀 EditorWithPreview: Inicializando com template quiz-estilo-completo');
  }, []);

  return (
    <FunnelsProvider debug={true}>
      <EditorProvider funnelId="quiz-estilo-completo">
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
