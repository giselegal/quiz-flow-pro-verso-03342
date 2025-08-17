import React, { useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { SaveTemplateModal } from '@/components/editor/SaveTemplateModal';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';
// 🚀 PREVIEW SYSTEM
import { PreviewNavigation } from '@/components/preview/PreviewNavigation';
import { PreviewToggleButton } from '@/components/preview/PreviewToggleButton';
import { PreviewProvider } from '@/contexts/PreviewContext';
// 🆕 NOVO PAINEL DE PROPRIEDADES (AGORA PADRÃO)
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { BlockType } from '@/types/editor';
import { useLocation } from 'wouter';

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
 * 🚀 SISTEMA DE PREVIEW INTEGRADO
 */
const EditorFixedPageWithDragDrop: React.FC = () => {
  // Navigation hook
  const [, setLocation] = useLocation();
  
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });
  const propertyHistory = usePropertyHistory();

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    blockActions: { addBlock, setSelectedBlockId, deleteBlock, updateBlock },
    persistenceActions: { saveFunnel },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock, totalBlocks, stageCount },
  } = useEditor();

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
  const handleSave = async () => {
    try {
      console.log('💾 Iniciando salvamento do editor...');
      await saveFunnel();
      console.log('✅ Editor salvo com sucesso!');
    } catch (error) {
      console.error('❌ Erro inesperado ao salvar:', error);
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

  const handleImportTemplate = (template: any) => {
    try {
      console.log('📥 Importando template:', template);

      // TODO: Implement template import logic
      // This would involve:
    } catch (error) {
      console.error('❌ Erro ao importar template:', error);
    }
  };

  const handleOpenMyTemplates = () => {
    setLocation('/meus-templates');
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

        // Fix: reorderBlocks expects the start and end indices
        console.log('🔄 Reordenando blocos:', newBlockIds);
      }}
      onBlockAdd={(blockType, position) => {
        if (position !== undefined && position >= 0) {
          // Fix: addBlock with proper BlockType casting
          addBlock(blockType as BlockType);
        } else {
          addBlock(blockType as BlockType);
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
      <div className="h-screen flex flex-col bg-gradient-to-br from-stone-50/80 via-stone-100/60 to-stone-150/40 relative">
        {/* Overlay sutil para mais elegância */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.02] via-transparent to-brand-dark/[0.01] pointer-events-none"></div>

        <div className="relative z-10">
          <EditorToolbar
            isPreviewing={isPreviewing}
            onTogglePreview={() => setIsPreviewing(!isPreviewing)}
            onSave={handleSave}
            onSaveAsTemplate={() => setShowSaveTemplateModal(true)}
            viewportSize={viewportSize as 'sm' | 'md' | 'lg' | 'xl'}
            onViewportSizeChange={(size: 'sm' | 'md' | 'lg' | 'xl') => setViewportSize(size)}
            onShowFunnelSettings={() => setShowFunnelSettings(true)}
            currentFunnelData={{}} // TODO: Get actual funnel data from context
            currentComponents={currentBlocks || []}
            onImportTemplate={handleImportTemplate}
          />

          {/* Top Bar - Otimizado */}
          <div style={{ borderColor: '#E5DDD5' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-stone-700">
                  Editor de Funil - Etapa {activeStageId}
                </h1>

                <div className="text-sm text-stone-500">
                  {totalBlocks} componente{totalBlocks !== 1 ? 's' : ''} • {stageCount} etapa
                  {stageCount !== 1 ? 's' : ''} • Novo Painel Ativo
                </div>
              </div>
            </div>
          </div>

          <FourColumnLayout
            stagesPanel={<FunnelStagesPanel onStageSelect={handleStageSelect} />}
            componentsPanel={
              <CombinedComponentsPanel
                currentStepNumber={getStepNumberFromStageId(activeStageId)}
              />
            }
            canvas={
              <div
                ref={scrollRef}
                className="p-2 overflow-auto h-full bg-gradient-to-br from-stone-50/50 via-white/30 to-stone-100/40 backdrop-blur-sm"
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
              !isPreviewing && selectedBlock ? (
                // 🆕 NOVO PAINEL DE PROPRIEDADES (AGORA PADRÃO)
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
                    <p className="text-sm">Selecione um bloco para editar propriedades</p>
                    <p className="text-xs text-stone-400 mt-1">
                      Novo Painel de Propriedades • Editores Específicos
                    </p>
                  </div>
                </div>
              ) : null
            }
          />
        </div>

        {/* Painel de Configurações do Funil */}
        {showFunnelSettings && (
          <FunnelSettingsPanel
            funnelId={activeStageId || 'default'}
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}

        {/* Modal de Salvamento de Template */}
        <SaveTemplateModal
          isOpen={showSaveTemplateModal}
          onClose={() => setShowSaveTemplateModal(false)}
          currentBlocks={currentBlocks || []}
          currentFunnelId={activeStageId || 'default'}
          onSaveSuccess={templateId => {
            console.log('✅ Template salvo com ID:', templateId);
            // Opcional: redirecionar para dashboard ou mostrar próximos passos
          }}
        />
      </div>
    </DndProvider>
  );
};

export default EditorFixedPageWithDragDrop;

// 🚀 WRAPPER COM SISTEMA DE PREVIEW COMPLETO
export const EditorWithPreview: React.FC = () => {
  return (
    <PreviewProvider totalSteps={21} funnelId="default">
      <div className="relative h-screen">
        {/* Componente de Preview Navigation - Flutuante */}
        <PreviewNavigation position="floating" />

        {/* Editor Principal */}
        <EditorFixedPageWithDragDrop />

        {/* Toggle de Preview - Posição fixa no canto */}
        <div className="fixed bottom-4 right-4 z-50">
          <PreviewToggleButton variant="full" />
        </div>
      </div>
    </PreviewProvider>
  );
};
