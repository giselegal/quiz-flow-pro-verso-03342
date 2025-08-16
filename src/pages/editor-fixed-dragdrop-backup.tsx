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


export default EditorFixedPageWithDragDrop;
