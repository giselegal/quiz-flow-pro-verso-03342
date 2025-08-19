import React, { useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { SaveTemplateModal } from '@/components/editor/SaveTemplateModal';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
// 🚀 PREVIEW SYSTEM
import { PreviewNavigation } from '@/components/preview/PreviewNavigation';
import { PreviewToggleButton } from '@/components/preview/PreviewToggleButton';
import { PreviewProvider } from '@/contexts/PreviewContext';
// 🎯 QUIZ 21 STEPS SYSTEM
import { Quiz21StepsNavigation } from '@/components/quiz/Quiz21StepsNavigation';
import { Quiz21StepsProvider, useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
// 🆕 QUIZ MODULAR SYSTEM - Nova estrutura modular (placeholder para futuro)
// import { QuizFlowPage } from '@/components/editor/quiz/QuizFlowPage';
// import { QuizNavigationBlock } from '@/components/editor/quiz/QuizNavigationBlock';
// import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
// 🆕 NOVO PAINEL DE PROPRIEDADES (AGORA PADRÃO)
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';
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
 * Editor Fixed - Versão Corrigida do Editor Principal
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

  // 🆕 MODO MODULAR - Estado para alternar entre modo tradicional e modular
  const [isModularMode, setIsModularMode] = useState(false);

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

          {/* 🆕 TOGGLE MODO MODULAR */}
          <button
            onClick={() => setIsModularMode(!isModularMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isModularMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isModularMode ? '📋 Modo Tradicional' : '🎯 Modo Modular'}
          </button>
        </div>

        {/* 🎯 LAYOUT PRINCIPAL - Renderização Condicional */}
        {isModularMode ? (
          /* ✨ NOVO: MODO MODULAR - Estrutura das 21 etapas */
          <div className="h-[calc(100vh-4rem)] flex bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="flex-1 flex flex-col">
              {/* 🎯 NAVEGAÇÃO MODULAR */}
              <div className="bg-white border-b border-stone-200 shadow-sm p-4">
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    🎯 Navegação Modular das 21 Etapas
                  </h3>
                  <p className="text-blue-600 text-sm">
                    Sistema modular ativado - Navegação aprimorada entre as etapas do quiz
                  </p>
                </div>

                <Quiz21StepsNavigation
                  position="static"
                  variant="full"
                  showProgress={true}
                  showControls={true}
                />
              </div>

              {/* 🎨 ÁREA DE CONTEÚDO MODULAR */}
              <div className="flex-1 p-8">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                      🎯 Modo Modular Ativado
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Sistema modular das 21 etapas do quiz interativo
                    </p>

                    {/* � INFORMAÇÕES DO ESTADO ATUAL */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentStep}</div>
                        <div className="text-sm text-blue-700">Etapa Atual</div>
                      </div>
                      <div className="bg-green-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{totalSteps}</div>
                        <div className="text-sm text-green-700">Total de Etapas</div>
                      </div>
                      <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round((currentStep / totalSteps) * 100)}%
                        </div>
                        <div className="text-sm text-purple-700">Progresso</div>
                      </div>
                    </div>

                    {/* 🎯 RENDERIZAÇÃO DA ETAPA ATUAL */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Etapa {currentStep}:{' '}
                        {currentStep === 1
                          ? 'Introdução do Quiz'
                          : currentStep === 2
                            ? 'Primeiro Grupo de Perguntas'
                            : currentStep === 3
                              ? 'Segundo Grupo de Perguntas'
                              : `Etapa ${currentStep}`}
                      </h3>

                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <div className="text-left">
                            <h4 className="font-medium text-gray-700 mb-2">
                              🧩 Componentes da Etapa 1:
                            </h4>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              <li>
                                <code>quiz-intro-header</code> - Cabeçalho principal
                              </li>
                              <li>
                                <code>form-container</code> - Container do formulário
                              </li>
                              <li>
                                <code>text-block</code> - Blocos de texto explicativo
                              </li>
                            </ul>
                          </div>

                          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                            <p className="text-blue-700 text-sm">
                              💡 <strong>Sistema Modular:</strong> Cada etapa é renderizada como
                              componentes independentes e reutilizáveis.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 🔄 BOTÃO PARA VOLTAR AO MODO TRADICIONAL */}
                    <button
                      onClick={() => setIsModularMode(false)}
                      className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      📋 Voltar ao Modo Tradicional
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 📋 EXISTENTE: MODO TRADICIONAL - Layout de 4 colunas */
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
                      <CanvasDropZone
                        blocks={currentBlocks}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={setSelectedBlockId}
                        onUpdateBlock={updateBlock}
                        onDeleteBlock={handleDeleteBlock}
                      />
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
                selectedBlock={selectedBlock}
                onUpdate={updateBlock}
                onClose={() => setSelectedBlockId(null)}
                onDelete={handleDeleteBlock}
                isPreviewMode={isPreviewing}
                onTogglePreview={() => setIsPreviewing(!isPreviewing)}
              />
            }
          />
        )}

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

//   EXPORT WRAPPER - Component com Preview System, FunnelsProvider e Quiz21StepsProvider
export const EditorWithPreview: React.FC = () => {
  // 🎯 FORÇAR ID CORRETO PARA CARREGAMENTO DAS 21 ETAPAS
  React.useEffect(() => {
    console.log('🚀 EditorWithPreview: Inicializando com template quiz-estilo-completo');
  }, []);

  return (
    <FunnelsProvider debug={true}>
      <EditorProvider funnelId="quiz-estilo-completo">
        <EditorQuizProvider>
          <PreviewProvider>
            <Quiz21StepsProvider debug={true} initialStep={1}>
              <EditorFixedPageWithDragDrop />
            </Quiz21StepsProvider>
          </PreviewProvider>
        </EditorQuizProvider>
      </EditorProvider>
    </FunnelsProvider>
  );
};

// ✅ EXPORT DEFAULT
export default EditorWithPreview;
