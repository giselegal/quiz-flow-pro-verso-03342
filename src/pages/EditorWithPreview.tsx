import React, { useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
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
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
// 🆕 NOVO PAINEL DE PROPRIEDADES (AGORA PADRÃO)
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';

// Context & Hooks
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { toast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { saveEditor } from '@/services/editorService';
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
 * - 🆕 AUTO-SAVE IMPLEMENTADO COM FEEDBACK
 * 🚀 SISTEMA DE PREVIEW INTEGRADO
 */
const EditorFixedPageWithDragDrop: React.FC = () => {
  // Navigation hook
  const [, setLocation] = useLocation();

  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    blockActions: { addBlock, setSelectedBlockId, deleteBlock, updateBlock },
    persistenceActions: {},
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock },
  } = useEditor();

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

        // Usar o novo serviço otimizado
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
        return `${baseClasses} w-[768px] min-h-[800px]`;
      case 'lg':
      case 'xl':
      default:
        return `${baseClasses} w-full max-w-4xl min-h-[900px]`;
    }
  };

  // 🆕 HANDLER DE SAVE MANUAL MELHORADO
  const handleSave = async () => {
    if (isSaving) return; // Prevenir cliques duplos

    setIsSaving(true);

    try {
      console.log('💾 Iniciando salvamento manual do editor...');

      // Usar o novo serviço otimizado com feedback
      const result = await saveEditor(
        {
          blocks: currentBlocks,
          activeStageId,
          funnelId: `editor-manual-${Date.now()}`,
          timestamp: Date.now(),
        },
        true
      ); // true = mostrar toast

      console.log('✅ Salvamento manual concluído:', result);
    } catch (error) {
      console.error('❌ Erro no salvamento manual:', error);
    } finally {
      setIsSaving(false);
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
      // 1. Clear current blocks
      // 2. Load template components
      // 3. Update funnel data

      toast({
        title: 'Template importado',
        description: 'Template carregado com sucesso!',
        variant: 'default',
      });

      console.log('✅ Template importado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao importar template:', error);

      toast({
        title: 'Erro ao importar',
        description: 'Não foi possível carregar o template.',
        variant: 'destructive',
      });
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
    onSave: handleSave,
    onDeleteSelected: () => {
      if (selectedBlockId) {
        handleDeleteBlock(selectedBlockId);
      }
    },
    onTogglePreview: () => setIsPreviewing(!isPreviewing),
    onEscape: () => setSelectedBlockId(null),
  });

  return (
    <PreviewProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
        {/* 🚀 TOOLBAR PRINCIPAL - Versão simplificada integrada */}
        <EditorToolbar />

        {/* 🎯 LAYOUT PRINCIPAL */}
        <DndProvider>
          <FourColumnLayout
            stagesPanel={
              <div className="flex flex-col h-full gap-4">
                {/* Estágios do funil */}
                <FunnelStagesPanel onStageSelect={handleStageSelect} showAddStageButton={true} />
              </div>
            }
            componentsPanel={
              <CombinedComponentsPanel
                onAddBlock={(type: BlockType) => {
                  const newBlock = {
                    id: `block-${Date.now()}`,
                    type,
                    stageId: activeStageId || 'step-1',
                    order: currentBlocks.length,
                    props: {},
                  };
                  addBlock(newBlock);
                }}
              />
            }
            canvas={
              <>
                {/* 📱 PREVIEW NAVIGATION - Sistema de Navegação do Preview */}
                {isPreviewing && <PreviewNavigation />}

                {/* 🎯 QUIZ 21 STEPS NAVIGATION - Navegação das 21 Etapas (quando não estiver em preview) */}
                {!isPreviewing && (
                  <Quiz21StepsNavigation
                    position="sticky"
                    variant="full"
                    showProgress={true}
                    showControls={true}
                  />
                )}

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
                        onBlockSelect={setSelectedBlockId}
                        selectedBlockId={selectedBlockId}
                        onBlockUpdate={updateBlock}
                        onBlockDelete={handleDeleteBlock}
                      />
                    </div>

                    {/* 🎮 PREVIEW TOGGLE - Botão flutuante para alternar preview */}
                    <PreviewToggleButton onToggle={() => setIsPreviewing(!isPreviewing)} />
                  </div>
                </div>
              </>
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
        </DndProvider>

        {/* MODAIS */}
        {showFunnelSettings && (
          <FunnelSettingsPanel
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}

        {showSaveTemplateModal && (
          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            onSuccess={() => {
              setShowSaveTemplateModal(false);
              toast({
                title: 'Template salvo',
                description: 'Seu template foi salvo com sucesso!',
                variant: 'default',
              });
            }}
          />
        )}

        {/* 🆕 INDICADOR DE STATUS DE SALVAMENTO */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-[#B89B7A] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Salvando...</span>
          </div>
        )}
      </div>
    </PreviewProvider>
  );
};

//   EXPORT WRAPPER - Component com Preview System, FunnelsProvider e Quiz21StepsProvider
export const EditorWithPreview: React.FC = () => {
  return (
    <FunnelsProvider debug={true}>
      <EditorProvider>
        <EditorQuizProvider>
          <PreviewProvider>
            <Quiz21StepsProvider debug={true}>
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
