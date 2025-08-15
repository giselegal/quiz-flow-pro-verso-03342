import React, { useEffect, useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { EditorNotification } from '@/components/editor/EditorNotification';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';

// FunnelNavigation removido durante limpeza de conflitos
// import { FunnelNavigation } from '@/components/editor-fixed/FunnelNavigation';
import OptimizedPropertiesPanel from '@/components/editor/OptimizedPropertiesPanel';
import SmartComponentsPanel from '@/components/editor/smart-panel/SmartComponentsPanel';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';

// Quiz Editor Integration
import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';

// Context & Hooks
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext';
import { useFunnelNavigation } from '@/hooks/useFunnelNavigation';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { BookOpen, Eye, Save, Settings } from 'lucide-react';

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
  // ⚡ EDITOR CONTEXT - Estado centralizado (UMA ÚNICA EXTRAÇÃO)
  const editorContext = useEditor();
  const {
    activeStageId: activeStage,
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
    persistenceActions: { saveFunnel, isSaving },
    computed: { currentBlocks, selectedBlock, totalBlocks },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
  } = editorContext;
  
  // Safe scroll sync with try-catch
  let scrollRef;
  try {
    const syncedScroll = useSyncedScroll({ source: 'canvas' });
    scrollRef = syncedScroll.scrollRef;
  } catch (error) {
    console.warn('ScrollSync not available, using fallback:', error);
    scrollRef = { current: null };
  }
  
  // ✅ SAFE FUNNEL NAVIGATION - Hook principal unificado
  const funnelNavigation = useFunnelNavigation();
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

  // Handlers de eventos (com Supabase persistência)
  const handleSave = async () => {
    try {
      console.log('💾 [Editor] Iniciando salvamento...');
      // Integração com navegação e salvamento
      funnelNavigation.handleSave();
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

        reorderBlocks(newBlockIds, activeStage || undefined);
      }}
      onBlockAdd={(blockType, position) => {
        if (position !== undefined && position >= 0) {
          addBlockAtPosition(blockType, position, activeStage || undefined);
        } else {
          addBlock(blockType, activeStage || undefined);
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
        {/* 🚀 HEADER AVANÇADO DO EDITOR */}
        <div className="flex-shrink-0 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary-foreground" />
                </div>
                <span>Editor Quiz Quest - 21 Etapas</span>
              </h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  v3.0 - Sistema Integrado + Navegação Inteligente
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Etapa {funnelNavigation.currentStepNumber}/{funnelNavigation.totalSteps}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>

              <Button size="sm" variant="outline" onClick={() => setIsPreviewing(!isPreviewing)}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewing ? 'Editar' : 'Preview'}
              </Button>

              <Button size="sm" variant="outline" onClick={() => setShowFunnelSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>

              <Button size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Testar Funil
              </Button>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO E TOOLBARS */}
        <div className="flex-none">
          <div className="sticky top-0 bg-white z-20">
            {/* ✅ NAVEGAÇÃO UNIFICADA DO FUNIL */}
            {/* FunnelNavigation removido durante limpeza de conflitos */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Etapa {funnelNavigation.currentStepNumber} de {funnelNavigation.totalSteps}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      funnelNavigation.navigateToStep(funnelNavigation.currentStepNumber - 1)
                    }
                    disabled={!funnelNavigation.canNavigatePrevious}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={funnelNavigation.handleSave}
                    disabled={funnelNavigation.isSaving}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
                  >
                    {funnelNavigation.isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() =>
                      funnelNavigation.navigateToStep(funnelNavigation.currentStepNumber + 1)
                    }
                    disabled={!funnelNavigation.canNavigateNext}
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50 text-sm"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>

            <EditorToolbar
              isPreviewing={isPreviewing}
              onTogglePreview={() => setIsPreviewing(!isPreviewing)}
              onSave={handleSave}
              viewportSize={viewportSize}
              onViewportSizeChange={setViewportSize}
              onShowFunnelSettings={() => setShowFunnelSettings(true)}
              onShowMonitoring={() => setShowMonitoringDashboard(true)}
            />

            {/* INFORMAÇÕES DA ETAPA ATUAL */}
            <div
              style={{ borderColor: '#E5DDD5' }}
              className="border-b bg-gradient-to-r from-blue-50/50 to-purple-50/50"
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-stone-700 flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {funnelNavigation.currentStepNumber}
                    </div>
                    {funnelNavigation.stepName}
                  </h2>
                  <div className="flex items-center space-x-3 text-sm text-stone-500">
                    <span>
                      {totalBlocks} componente{totalBlocks !== 1 ? 's' : ''}
                    </span>
                    <span>•</span>
                    <span>{Math.round(funnelNavigation.progressValue)}% completo</span>
                    <span>•</span>
                    <span>Modo {isPreviewing ? 'Preview' : 'Edição'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowQuizEditor(true)}
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Quiz Editor
                  </Button>
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
                  onAddComponent={(componentType: string) => {
                    if (activeStage) {
                      addBlock(componentType, activeStage);
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
                  <OptimizedPropertiesPanel
                    selectedBlock={unifiedSelectedBlock}
                    onUpdate={(blockId: string, updates: Partial<any>) => {
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
  );
};

export default EditorFixedPageWithDragDrop;
