import ErrorBoundary from '@/components/editor/ErrorBoundary';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { PreviewProvider } from '@/contexts/PreviewContext';
import React, { useEffect, useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';
import SmartComponentsPanel from '@/components/editor/smart-panel/SmartComponentsPanel';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';
import { IntegratedPropertiesPanel } from '@/components/universal/IntegratedPropertiesPanel';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { cn } from '@/lib/utils';
import { BookOpen, Settings } from 'lucide-react';

/**
 * Editor Fixed - 4-Colunas (versão consolidada)
 * - Usa `FourColumnLayout` para stages | components | canvas | properties
 * - Mantém integração com `useEditor` (add/update/delete/reorder/select)
 * - Suporte a parâmetros URL: ?funnelId=xxx&template=xxx&stage=xxx&preview=true
 */

// Component that uses useEditor hook - must be inside EditorProvider
const EditorContent: React.FC<{
  urlFunnelId: string;
  urlStage: string;
  urlPreview: boolean;
  urlViewport: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ urlFunnelId, urlStage, urlPreview, urlViewport }) => {
  const editor = useEditor();

  const {
    state,
    addBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    togglePreview,
    reorderBlocks,
    save,
  } = editor;

  const selectedBlockId = state?.selectedBlockId || null;
  const currentBlocks = state?.blocks || [];
  const isPreviewing = urlPreview || !!state?.isPreviewing;

  const [activeStage, setActiveStage] = useState<string>(urlStage);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(urlViewport);
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showQuizEditor, setShowQuizEditor] = useState(false);
  const [showMonitoringDashboard, setShowMonitoringDashboard] = useState(false);

  // Set funnelId from URL on mount
  useEffect(() => {
    if (editor.setFunnelId && urlFunnelId !== editor.funnelId) {
      editor.setFunnelId(urlFunnelId);
      console.log('🔗 FunnelId set from URL:', urlFunnelId);
    }
  }, [urlFunnelId, editor.setFunnelId, editor.funnelId]);

  // Scroll sync
  const synced = useSyncedScroll({ source: 'canvas' });
  const scrollRef = synced?.scrollRef ?? { current: null };

  // Keyboard shortcuts
  useKeyboardShortcuts();

  // Property history
  const { history } = usePropertyHistory();

  return (
    <ScrollSyncProvider>
      <PreviewProvider totalSteps={21} funnelId={urlFunnelId}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('🚨 Editor Error:', error);
            console.error('🔍 Error Info:', errorInfo);
          }}
        >
          <DndProvider>
            <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <EditorToolbar
                onSave={save}
                onTogglePreview={togglePreview}
                onToggleFunnelSettings={() => setShowFunnelSettings(!showFunnelSettings)}
                onToggleQuizEditor={() => setShowQuizEditor(!showQuizEditor)}
                onToggleMonitoring={() => setShowMonitoringDashboard(!showMonitoringDashboard)}
                viewportSize={viewportSize}
                onViewportChange={setViewportSize}
                activeStage={activeStage}
                isPreviewing={isPreviewing}
              />

              {/* Main 4-Column Layout */}
              <FourColumnLayout
                // Column 1: Stages
                stagesPanel={{
                  activeStageId: activeStage,
                  onStageSelect: setActiveStage,
                  totalStages: 21,
                }}
                // Column 2: Components
                componentsPanel={
                  <SmartComponentsPanel
                    onAddBlock={addBlock}
                    selectedBlockId={selectedBlockId}
                    activeStageId={activeStage}
                  />
                }
                // Column 3: Canvas
                canvasPanel={
                  <CanvasDropZone
                    blocks={currentBlocks}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={selectBlock}
                    onUpdateBlock={updateBlock}
                    onDeleteBlock={deleteBlock}
                    onReorderBlocks={reorderBlocks}
                    scrollRef={scrollRef}
                    viewportSize={viewportSize}
                    isPreviewing={isPreviewing}
                  />
                }
                // Column 4: Properties
                propertiesPanel={
                  <IntegratedPropertiesPanel
                    selectedBlockId={selectedBlockId}
                    onUpdateBlock={updateBlock}
                    propertyHistory={history}
                  />
                }
              />

              {/* Modal Overlays */}
              {showFunnelSettings && (
                <FunnelSettingsPanel
                  funnelId={activeStage}
                  isOpen={showFunnelSettings}
                  onClose={() => setShowFunnelSettings(false)}
                />
              )}

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
                    <div className="flex-1 overflow-auto p-4">Dashboard de monitoramento</div>
                  </div>
                </div>
              )}
            </div>
          </DndProvider>
        </ErrorBoundary>
      </PreviewProvider>
    </ScrollSyncProvider>
  );
};

const EditorFixedPageWithDragDrop: React.FC = () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlFunnelId = urlParams.get('funnelId') || 'default-funnel';
  const urlTemplate = urlParams.get('template') || 'funil-21-etapas';
  const urlStage = urlParams.get('stage') || 'step-1';
  const urlPreview = urlParams.get('preview') === 'true';
  const urlViewport = (urlParams.get('viewport') || 'xl') as 'sm' | 'md' | 'lg' | 'xl';

  console.log('🌐 Editor URL Params:', {
    funnelId: urlFunnelId,
    template: urlTemplate,
    stage: urlStage,
    preview: urlPreview,
    viewport: urlViewport,
  });

  return (
    <FunnelsProvider>
      <EditorContent
        urlFunnelId={urlFunnelId}
        urlStage={urlStage}
        urlPreview={urlPreview}
        urlViewport={urlViewport}
      />
    </FunnelsProvider>
  );
};

  // Property history (undo/redo)
  const history = usePropertyHistory();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: history.undo,
    onRedo: history.redo,
    onDelete: selectedBlockId ? () => deleteBlock(selectedBlockId) : undefined,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    hasSelectedBlock: !!selectedBlockId,
  });

  // Handlers
  const handleAddBlock = (type: string) => {
    addBlock(type as any);
  };

  const handleSelectBlock = (id: string | null) => {
    selectBlock(id);
  };

  const handleSave = async () => {
    if (save) {
      try {
        await save();
      } catch (err) {
        console.error('Erro ao salvar funnel:', err);
      }
    }
  };

  // simple viewport classname helper
  const getCanvasClassName = () => {
    const base = 'transition-all duration-300 mx-auto bg-white rounded-2xl shadow';
    switch (viewportSize) {
      case 'sm':
        return `${base} w-[375px] min-h-[600px]`;
      case 'md':
        return `${base} w-[768px] min-h-[800px]`;
      default:
        return `${base} w-full max-w-4xl min-h-[900px]`;
    }
  };

  // selected block full object
  const selectedBlock = currentBlocks.find(b => b.id === selectedBlockId) || null;

  return (
    <FunnelsProvider debug={true}>
      <ErrorBoundary>
        <PreviewProvider totalSteps={21}>
          <ScrollSyncProvider>
            <DndProvider
              blocks={currentBlocks.map(b => ({
                id: b.id,
                type: b.type,
                properties: b.properties || {},
              }))}
              onBlocksReorder={newBlocks => {
                const oldIds = currentBlocks.map(b => b.id);
                const newIds = newBlocks.map((b: any) => b.id);
                if (oldIds.length !== newIds.length) return;
                // naive reorder detection
                for (let i = 0; i < oldIds.length; i++) {
                  if (oldIds[i] !== newIds[i]) {
                    const moved = newIds[i];
                    const from = oldIds.indexOf(moved);
                    const to = i;
                    reorderBlocks(from, to);
                    break;
                  }
                }
              }}
              onBlockAdd={(type: string) => addBlock(type as any)}
              onBlockSelect={(id: string) => handleSelectBlock(id)}
              selectedBlockId={selectedBlockId ?? undefined}
              onBlockUpdate={(id: string, updates: any) => updateBlock(id, updates as any)}
            >
              <div className="flex flex-col h-screen">
                <div className="sticky top-0 z-30 bg-white border-b">
                  <EditorToolbar
                    isPreviewing={isPreviewing}
                    onTogglePreview={() => togglePreview(!isPreviewing)}
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
                        <h3 className="text-lg font-semibold mb-4">Etapas</h3>
                        <div className="space-y-2">
                          {Array.from({ length: 21 }, (_, i) => {
                            const id = `step-${i + 1}`;
                            const count = currentBlocks.filter(
                              b => b.properties?.stageId === id
                            ).length;
                            return (
                              <button
                                key={id}
                                onClick={() => setActiveStage(id)}
                                className={cn(
                                  'w-full text-left p-3 rounded-lg border transition-colors',
                                  activeStage === id
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-white border-gray-200 hover:bg-gray-50'
                                )}
                              >
                                <div className="font-medium">Etapa {i + 1}</div>
                                <div className="text-sm text-gray-500">{count} componentes</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    }
                    componentsPanel={<SmartComponentsPanel onAddComponent={handleAddBlock} />}
                    canvas={
                      <div
                        ref={scrollRef}
                        className="p-2 h-full overflow-y-auto bg-gradient-to-br from-stone-50 to-white"
                      >
                        <div className={getCanvasClassName()}>
                          <CanvasDropZone
                            blocks={currentBlocks}
                            selectedBlockId={selectedBlockId}
                            onSelectBlock={id => handleSelectBlock(id)}
                            onUpdateBlock={(id, upd) => updateBlock(id, upd as any)}
                            onDeleteBlock={id => deleteBlock(id)}
                          />
                        </div>
                      </div>
                    }
                    propertiesPanel={
                      !isPreviewing && selectedBlock ? (
                        <IntegratedPropertiesPanel
                          selectedBlock={{
                            id: selectedBlock.id,
                            type: selectedBlock.type,
                            properties: selectedBlock.properties || {},
                            content: selectedBlock.content || {},
                          }}
                          onUpdate={(id, upd) => updateBlock(id, upd as any)}
                          onClose={() => handleSelectBlock(null)}
                          onDelete={id => {
                            deleteBlock(id);
                            handleSelectBlock(null);
                          }}
                        />
                      ) : (
                        !isPreviewing && (
                          <div className="h-full p-4 flex items-center justify-center text-stone-500">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                                <Settings className="w-8 h-8 text-stone-400" />
                              </div>
                              <p className="text-sm font-medium">
                                Selecione um bloco para editar propriedades
                              </p>
                              <p className="text-xs text-stone-400 mt-2">
                                Propriedades específicas aparecerão aqui
                              </p>
                            </div>
                          </div>
                        )
                      )
                    }
                  />
                </div>

                {showFunnelSettings && (
                  <FunnelSettingsPanel
                    funnelId={activeStage}
                    isOpen={showFunnelSettings}
                    onClose={() => setShowFunnelSettings(false)}
                  />
                )}

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
                      <div className="flex-1 overflow-auto p-4">Dashboard de monitoramento</div>
                    </div>
                  </div>
                )}
              </div>
            </DndProvider>
          </ScrollSyncProvider>
        </PreviewProvider>
      </ErrorBoundary>
    </FunnelsProvider>
  );
};

export default EditorFixedPageWithDragDrop;
