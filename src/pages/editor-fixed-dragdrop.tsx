import React, { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/editor/ErrorBoundary';
import { PreviewProvider } from '@/contexts/PreviewContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { FunnelsProvider, useFunnels } from '@/context/FunnelsContext';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { EditorNotification } from '@/components/editor/EditorNotification';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';

// FunnelNavigation removido durante limpeza de conflitos
// import { FunnelNavigation } from '@/components/editor-fixed/FunnelNavigation';
import { IntegratedPropertiesPanel } from '@/components/universal/IntegratedPropertiesPanel';
import SmartComponentsPanel from '@/components/editor/smart-panel/SmartComponentsPanel';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';


// Quiz Editor Integration
import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { cn } from '@/lib/utils';
import { BookOpen, Settings } from 'lucide-react';

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
 */
const EditorFixedPageWithDragDrop: React.FC = () => {
  console.log('🚀 EditorFixedPageWithDragDrop: COMPONENTE INICIANDO');
  
  // ⚡ EDITOR CONTEXT - Estado centralizado (UMA ÚNICA EXTRAÇÃO)
  console.log('🚀 EditorFixedPageWithDragDrop: Tentando obter EditorContext...');
  const editorContext = useEditor();
  console.log('✅ EditorFixedPageWithDragDrop: EditorContext obtido com sucesso');
  
  // Extract available properties from the current EditorContext
  const {
    state,
    addBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    togglePreview,
    reorderBlocks,
  } = editorContext;

  // Map the state to expected variables
  const selectedBlockId = state.selectedBlockId;
  const currentBlocks = state.blocks;
  const isPreviewing = state.isPreviewing;
  
  // For missing functionality, create mock implementations or state
  const [activeStage, setActiveStage] = useState('step-1');
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
  
  // Mock functions for missing features
  const setSelectedBlockId = selectBlock;
  const setIsPreviewing = togglePreview;
  const addBlockAtPosition = (blockType: string, position: number, stageId?: string) => {
    // For now, just add at the end - can be enhanced later
    return addBlock(blockType as any);
  };
  
  // Mock persistence actions
  const saveFunnel = async () => {
    console.log('💾 Mock saveFunnel called');
    return { success: true };
  };
  
  // Mock selected block
  const selectedBlock = currentBlocks.find(block => block.id === selectedBlockId) || null;
  
  // Mock quiz state
  const quizState = {
    userName: '',
    answers: [],
    isQuizCompleted: false,
  };
  
  // ✅ DEBUG: Log do estado do quiz
  console.log('🎯 Editor Quiz State:', {
    userName: quizState.userName,
    answersCount: quizState.answers.length,
    isCompleted: quizState.isQuizCompleted,
  });
  
  // Safe scroll sync with try-catch
  let scrollRef;
  try {
    const syncedScroll = useSyncedScroll({ source: 'canvas' });
    scrollRef = syncedScroll.scrollRef;
  } catch (error) {
    console.warn('ScrollSync not available, using fallback:', error);
    scrollRef = { current: null };
  }
  
  // Property history for undo/redo functionality
  const propertyHistory = usePropertyHistory();

  // Estado local do editor
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);

  // Mostrar notificação quando carregar a etapa 1
  useEffect(() => {
    if (activeStage === 'step-1' || activeStage === 'step-01') {
      setShowNotification(true);
    }
  }, [activeStage]);

  // Converte selectedBlock para UnifiedBlock
  const unifiedSelectedBlock = selectedBlock ? {
    id: selectedBlock.id,
    type: selectedBlock.type,
    properties: selectedBlock.properties || {},
    content: selectedBlock.content || {},
  } : null;
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { stepId?: string };
      if (detail?.stepId) {
        setActiveStage(detail.stepId);
      }
    };
    window.addEventListener('quiz-navigate-to-step', handler as EventListener);
    return () => window.removeEventListener('quiz-navigate-to-step', handler as EventListener);
  }, [setActiveStage]);

  // Configuração de viewport responsivo
  const getCanvasClassName = () => {
    const baseClasses =
      'transition-all duration-500 ease-out mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20';

    switch (viewportSize) {
      case 'sm':
        return `${baseClasses} w-[375px] min-h-[600px]`;
      case 'md':
        return `${baseClasses} w-[768px] min-h-[800px]`;
      case 'lg':
      case 'xl':
      default:
        return `${baseClasses} w-full max-w-4xl min-h-[900px]`;
    }
  };

  // Handlers de eventos (with mock persistence)
  const handleSave = async () => {
    try {
      console.log('💾 [Editor] Iniciando salvamento...');
      const result = await saveFunnel();

      if (result.success) {
        console.log('✅ [Editor] Salvamento concluído com sucesso!');
      } else {
        console.error('❌ [Editor] Falha no salvamento:', result.error);
      }
    } catch (error) {
      console.error('❌ [Editor] Erro inesperado durante salvamento:', error);
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
    onUndo: propertyHistory.undo,
    onRedo: propertyHistory.redo,
    onDelete: selectedBlockId ? () => handleDeleteBlock(selectedBlockId) : undefined,
    canUndo: propertyHistory.canUndo,
    canRedo: propertyHistory.canRedo,
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <ErrorBoundary>
      <PreviewProvider totalSteps={21}>
        <ScrollSyncProvider>
          <DndProvider
      blocks={(currentBlocks || []).map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
      }))}
      onBlocksReorder={newBlocksData => {
        const newBlockIds = newBlocksData.map(b => b.id);
        const oldBlockIds = (currentBlocks || []).map(b => b.id);

        if (oldBlockIds.length !== newBlockIds.length) {
          console.warn('⚠️ Reordenação abortada: quantidade de blocos não confere');
          return;
        }

        // Find the source and destination indices for the reorder
        for (let i = 0; i < oldBlockIds.length; i++) {
          if (oldBlockIds[i] !== newBlockIds[i]) {
            const movedId = newBlockIds[i];
            const sourceIndex = oldBlockIds.indexOf(movedId);
            const destinationIndex = i;
            reorderBlocks(sourceIndex, destinationIndex);
            break;
          }
        }
      }}
      onBlockAdd={(blockType, position) => {
        if (position !== undefined && position >= 0) {
          addBlockAtPosition(blockType, position);
        } else {
          addBlock(blockType as any);
        }
      }}
      onBlockSelect={blockId => {
        setSelectedBlockId(blockId);
      }}
      selectedBlockId={selectedBlockId || undefined}
      onBlockUpdate={(blockId, updates) => {
        updateBlock(blockId, updates as any);
      }}
    >
      {/* Notificação de propriedades ativadas */}
      {showNotification && (
        <EditorNotification
          message="Propriedades de edição ativadas na Etapa 1! Clique em qualquer componente para editá-lo diretamente."
          type="success"
          duration={8000}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="flex flex-col h-screen">
        {/* NAVEGAÇÃO E TOOLBARS */}
        <div className="flex-none">
          <div className="sticky top-0 bg-white z-20">
            <EditorToolbar
              isPreviewing={isPreviewing}
              onTogglePreview={() => setIsPreviewing(!isPreviewing)}
              onSave={handleSave}
              viewportSize={viewportSize}
              onViewportSizeChange={setViewportSize}
              onShowFunnelSettings={() => setShowFunnelSettings(true)}
              onShowMonitoring={() => setShowMonitoringDashboard(true)}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <FourColumnLayout
              className="h-full"
              stagesPanel={
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Funnel Stages</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 21 }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setActiveStage(`step-${i + 1}`)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg border transition-colors",
                          activeStage === `step-${i + 1}` 
                            ? "bg-blue-100 border-blue-300 text-blue-900" 
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <div className="font-medium">Etapa {i + 1}</div>
                        <div className="text-sm text-gray-500">
                          {currentBlocks.filter(block => 
                            block.properties?.stageId === `step-${i + 1}`
                          ).length} componentes
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              }
              componentsPanel={
                <SmartComponentsPanel
                  onAddComponent={(componentType: string) => {
                    addBlock(componentType as any);
                  }}
                />
              }
              canvas={
                <div
                  ref={scrollRef}
                  className="p-2 h-full overflow-y-auto [scrollbar-gutter:stable] bg-gradient-to-br from-stone-50/50 via-white/30 to-stone-100/40 backdrop-blur-sm"
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
                </div>
              }
              propertiesPanel={
                !isPreviewing && unifiedSelectedBlock ? (
                  // 🆕 NOVO PAINEL DE PROPRIEDADES OTIMIZADO (SISTEMA ATUALIZADO)
                  <IntegratedPropertiesPanel
                    selectedBlock={unifiedSelectedBlock}
                     onUpdate={(blockId: string, updates: Partial<any>) => {
                       console.log('🔥 EDITOR onUpdate CHAMADO:', { blockId, updates });
                       updateBlock(blockId, updates);
                       console.log('🔥 EDITOR updateBlock executado');
                     }}
                    onClose={() => setSelectedBlockId(null)}
                    onDelete={(blockId: string) => {
                      deleteBlock(blockId);
                      setSelectedBlockId(null);
                    }}
                  />
                ) : !isPreviewing ? (
                  <div className="h-full p-4 flex items-center justify-center text-stone-500">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                        <Settings className="w-8 h-8 text-stone-400" />
                      </div>
                      <p className="text-sm font-medium">
                        Selecione um bloco para editar propriedades
                      </p>
                      <p className="text-xs text-stone-400 mt-2">
                        Novo Painel de Propriedades • Editores Específicos
                        <br />
                        aparecerão aqui quando selecionado
                      </p>
                      <div className="mt-4 text-xs text-stone-400 space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Texto, Botão, Imagem</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Propriedades específicas por tipo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : null
               }
            />
           </div>
        </div>


        {/* Painel de Configurações do Funil */}
        {showFunnelSettings && (
          <FunnelSettingsPanel
            funnelId={activeStage || 'default'}
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}

        {/* Modal do Quiz Editor */}
        {showQuizEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Quiz Editor Integrado
                </h2>
                <button
                  onClick={() => setShowQuizEditor(false)}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border rounded"
                >
                  Fechar
                </button>
              </div>
              <div className="flex-1 overflow-hidden p-4">
                <IntegratedQuizEditor />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard de Monitoramento */}
        {showMonitoringDashboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Production Monitoring</h2>
                <button
                  onClick={() => setShowMonitoringDashboard(false)}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border rounded"
                >
                  Fechar
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <p>Dashboard de monitoramento removido</p>
              </div>
            </div>
          </div>
        )}
      </div>
          </DndProvider>
        </ScrollSyncProvider>
      </PreviewProvider>
    </ErrorBoundary>
  );
};

export default EditorFixedPageWithDragDrop;
