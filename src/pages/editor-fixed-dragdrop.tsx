import ErrorBoundary from '@/components/editor/ErrorBoundary';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { ScrollSyncProvider } from '@/context/ScrollSyncContext';
import { PreviewProvider } from '@/contexts/PreviewContext';
import React, { useEffect, useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import IntegratedQuizEditor from '@/components/editor/quiz-specific/IntegratedQuizEditor';
import SmartComponentsPanel from '@/components/editor/smart-panel/SmartComponentsPanel';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';
import { IntegratedPropertiesPanel } from '@/components/universal/IntegratedPropertiesPanel';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { BookOpen } from 'lucide-react';

/**
 * Component that uses useEditor hook - must be inside EditorProvider
 */
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onDelete: selectedBlockId ? () => deleteBlock(selectedBlockId) : undefined,
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <ScrollSyncProvider>
      <PreviewProvider totalSteps={21} funnelId={urlFunnelId}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error('🚨 Editor Error:', error);
            console.error('🔍 Error Info:', errorInfo);
          }}
        >
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
            onBlockSelect={(id: string) => selectBlock(id)}
            selectedBlockId={selectedBlockId ?? undefined}
            onBlockUpdate={(id: string, updates: any) => updateBlock(id, updates as any)}
          >
            <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <EditorToolbar
                onSave={save}
                onTogglePreview={togglePreview}
                onShowFunnelSettings={() => setShowFunnelSettings(!showFunnelSettings)}
                onShowMonitoring={() => setShowMonitoringDashboard(!showMonitoringDashboard)}
                viewportSize={viewportSize}
                onViewportSizeChange={setViewportSize}
                isPreviewing={isPreviewing}
              />

              {/* DEBUG: Layout simples sem Resizable */}
              <div className="flex-1 flex">
                {/* Coluna 1: Etapas */}
                <div className="w-1/5 p-4 bg-blue-100 border-2 border-blue-500">
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">🎯 Etapas do Funil</h3>
                  <p className="text-xs text-blue-500 mb-2">DEBUG: Coluna 1 funcionando</p>
                  {Array.from({ length: 21 }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setActiveStage(`step-${i + 1}`)}
                      className={`w-full p-2 mb-2 text-left rounded transition-colors ${
                        activeStage === `step-${i + 1}`
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Etapa {i + 1}</span>
                        {activeStage === `step-${i + 1}` && (
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">Ativa</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Coluna 2: Componentes */}
                <div className="w-1/5 p-4 bg-green-100 border-2 border-green-500">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">🧱 Componentes</h3>
                  <p className="text-xs text-green-500 mb-2">DEBUG: Coluna 2 funcionando</p>
                  <SmartComponentsPanel />
                </div>
                
                {/* Coluna 3: Canvas */}
                <div className="w-2/5 bg-red-100 border-2 border-red-500">
                  <div className="h-full flex flex-col">
                    <div className="bg-white border-b p-3">
                      <h3 className="text-lg font-semibold text-red-600">🎨 Canvas - {activeStage}</h3>
                      <p className="text-sm text-gray-600">
                        {currentBlocks.length} bloco(s) • Viewport: {viewportSize}
                      </p>
                      <p className="text-xs text-red-500">DEBUG: Canvas está renderizando!</p>
                    </div>
                    <div className="flex-1 overflow-auto bg-gray-100 p-4">
                      <div className="bg-yellow-200 p-4 border-2 border-yellow-500 rounded">
                        <p className="text-yellow-800 font-bold">DEBUG: Canvas Drop Zone Wrapper</p>
                        <CanvasDropZone
                          blocks={currentBlocks}
                          selectedBlockId={selectedBlockId}
                          onSelectBlock={selectBlock}
                          onUpdateBlock={updateBlock}
                          onDeleteBlock={deleteBlock}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Coluna 4: Propriedades */}
                <div className="w-1/5 p-4 bg-purple-100 border-2 border-purple-500">
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">⚙️ Propriedades</h3>
                  <p className="text-xs text-purple-500 mb-2">DEBUG: Coluna 4 funcionando</p>
                  <IntegratedPropertiesPanel
                    selectedBlock={currentBlocks.find(block => block.id === selectedBlockId) || null}
                  />
                </div>
              </div>

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

/**
 * Editor Fixed - 4-Colunas (versão consolidada)
 * - Usa `FourColumnLayout` para stages | components | canvas | properties
 * - Mantém integração com `useEditor` (add/update/delete/reorder/select)
 * - Suporte a parâmetros URL: ?funnelId=xxx&template=xxx&stage=xxx&preview=true
 */
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

export default EditorFixedPageWithDragDrop;
