// @ts-nocheck
import React, { useEffect, useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { EditorNotification } from '@/components/editor/EditorNotification';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { ProductionMonitoringDashboard } from '@/components/editor/monitoring/ProductionMonitoringDashboard';
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';
import SmartComponentsPanel from '@/components/editor/smart-panel/SmartComponentsPanel';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';

// Quiz Editor Integration
import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
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
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });
  const propertyHistory = usePropertyHistory();

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    stageActions: { setActiveStage },
    blockActions: {
      addBlock,
      addBlockAtPosition,
      setSelectedBlockId,
      deleteBlock,
      updateBlock,
      reorderBlocks,
    },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock, totalBlocks, stageCount },
  } = useEditor();

  // Mostrar notificação quando carregar a etapa 1
  useEffect(() => {
    if (activeStageId === 'step-1' || activeStageId === 'step-01') {
      setShowNotification(true);
    }
  }, [activeStageId]);

  // Listener global: navegação entre etapas disparada por botões
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

  // Handlers de eventos
  const handleSave = () => {
    console.log('💾 Salvando editor...');
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

  const getStepNumberFromStageId = (stageId: string | null): number => {
    if (!stageId) return 1;
    const match = stageId.match(/step-(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
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

        reorderBlocks(newBlockIds, activeStageId || undefined);
      }}
      onBlockAdd={(blockType, position) => {
        if (position !== undefined && position >= 0) {
          addBlockAtPosition(blockType, position, activeStageId || undefined);
        } else {
          addBlock(blockType, activeStageId || undefined);
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

            <div style={{ borderColor: '#E5DDD5' }} className="border-b bg-white">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-4">
                  <h1 className="text-lg font-semibold text-stone-700">
                    Editor de Funil - Etapa {activeStageId}
                  </h1>
                  <div className="text-sm text-stone-500">
                    {totalBlocks} componente{totalBlocks !== 1 ? 's' : ''} • {stageCount} etapa
                    {stageCount !== 1 ? 's' : ''} • Novo Painel Ativo
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowQuizEditor(true)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Quiz Editor
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <FourColumnLayout
              className="h-full"
              stagesPanel={<FunnelStagesPanel onStageSelect={handleStageSelect} />}
              componentsPanel={
                <SmartComponentsPanel
                  currentStepNumber={getStepNumberFromStageId(activeStageId)}
                  onComponentSelect={componentType => {
                    if (activeStageId) {
                      addBlock(componentType, activeStageId);
                    }
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
                      isPreviewing={isPreviewing}
                      onSelectBlock={setSelectedBlockId}
                      onUpdateBlock={updateBlock}
                      onDeleteBlock={handleDeleteBlock}
                    />
                  </div>
                </div>
              }
              propertiesPanel={
                !isPreviewing && selectedBlock ? (
                  // 🆕 NOVO PAINEL DE PROPRIEDADES (SISTEMA ATUALIZADO)
                  <PropertiesPanel
                    selectedBlock={selectedBlock}
                    onUpdate={(blockId: string, updates: Record<string, any>) => {
                      updateBlock(blockId, updates);
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
            funnelId={activeStageId || 'default'}
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
          <ProductionMonitoringDashboard
            isOpen={showMonitoringDashboard}
            onClose={() => setShowMonitoringDashboard(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default EditorFixedPageWithDragDrop;
