import React, { useState } from 'react';

// 🎨 EDITOR UNIFICADO - Componentes principais
import {
  EditorControlsManager,
  EditorPropertiesPanel,
  EditorStageManager,
  UnifiedPreviewEngine,
} from '@/components/editor/unified';

// 🚀 PREVIEW SYSTEM
import { PreviewProvider } from '@/contexts/PreviewContext';

// 🎪 HOOKS CORE UNIFICADO
import { useQuizFlow } from '@/hooks/core/useQuizFlow';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { saveEditor } from '@/services/editorService';
import type { Block } from '@/types/editor';

// 🔧 MODAIS (legados)
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { SaveTemplateModal } from '@/components/editor/SaveTemplateModal';

/**
 * 🎨 EDITOR UNIFICADO - Versão Completa Integrada
 *
 * Editor de funil com sistema unificado completo:
 * - UnifiedPreviewEngine: Preview 100% idêntico à produção
 * - EditorStageManager: Gerenciamento completo das 21 etapas
 * - EditorControlsManager: Controles unificados do editor
 * - EditorPropertiesPanel: Painel de propriedades avançado
 * - Integração com useQuizFlow e quiz21StepsComplete.ts
 * - Sistema de auto-save e keyboard shortcuts
 * 🚀 EDITOR UNIFICADO INTEGRADO
 */
const EditorUnified: React.FC = () => {
  // 🎪 HOOK PRINCIPAL UNIFICADO
  const { actions } = useQuizFlow({
    mode: 'editor',
    onStepChange: step => {
      console.log('🎯 Editor: Mudança de etapa:', step);
      setCurrentStep(step);
    },
    initialStep: 1,
  });

  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });

  // Estado local do Editor Unificado
  const [editorMode, setEditorMode] = useState<'edit' | 'preview' | 'test'>('edit');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);

  // Estados para EditorControlsManager
  const [controlsState, setControlsState] = useState({
    isPreviewing: editorMode === 'preview',
    viewportSize: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    showGrid: false,
    showLayers: false,
    autoSave: true,
    canUndo: false,
    canRedo: false,
    isSaving: false,
  });

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    blockActions: { deleteBlock, updateBlock },
    uiState: { setIsPreviewing },
    computed: { currentBlocks },
  } = useEditor();

  // 🆕 AUTO-SAVE COM DEBOUNCE - Implementação do salvamento automático
  useAutoSaveWithDebounce({
    data: {
      blocks: currentBlocks,
      activeStageId,
      currentStep,
      funnelId: `editor-unified-${Date.now()}`,
      timestamp: Date.now(),
    },
    onSave: async data => {
      try {
        console.log('🔄 Auto-save ativado (Editor Unificado):', data);
        await saveEditor(data, false);
        console.log('✅ Auto-save realizado com sucesso');
      } catch (error) {
        console.warn('⚠️ Auto-save: Erro:', error);
      }
    },
    delay: 3000,
    enabled: true,
    showToasts: false,
  });

  // Handlers do Editor Unificado
  const handleStepSelect = (step: number) => {
    console.log('🎯 Editor Unificado: Step selecionado:', step);
    setCurrentStep(step);
    actions.getStepData(); // Carrega dados da etapa
  };

  const handleModeChange = (mode: 'edit' | 'preview' | 'test') => {
    console.log('🔄 Editor Unificado: Modo alterado:', mode);
    setEditorMode(mode);
    setIsPreviewing(mode === 'preview' || mode === 'test');
    setControlsState(prev => ({ ...prev, isPreviewing: mode === 'preview' || mode === 'test' }));
  };

  const handleViewportChange = (size: 'mobile' | 'tablet' | 'desktop') => {
    setControlsState(prev => ({ ...prev, viewportSize: size }));
  };

  // Actions para EditorControlsManager
  const controlsActions = {
    togglePreview: () => handleModeChange(editorMode === 'preview' ? 'edit' : 'preview'),
    setViewportSize: handleViewportChange,
    toggleGrid: () => setControlsState(prev => ({ ...prev, showGrid: !prev.showGrid })),
    toggleLayers: () => setControlsState(prev => ({ ...prev, showLayers: !prev.showLayers })),
    save: () => {
      console.log('💾 Salvamento manual acionado');
      setControlsState(prev => ({ ...prev, isSaving: true }));
      // TODO: Implementar save manual
      setTimeout(() => setControlsState(prev => ({ ...prev, isSaving: false })), 1000);
    },
    undo: () => console.log('↶ Undo'),
    redo: () => console.log('↷ Redo'),
    exportTemplate: () => console.log('📤 Export'),
    importTemplate: () => console.log('📥 Import'),
  };

  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    console.log('📝 Editor Unificado: Atualizando bloco:', blockId, updates);
    updateBlock(blockId, updates);
  };

  const handleBlockSelect = (blockId: string) => {
    console.log('🎯 Editor Unificado: Bloco selecionado:', blockId);
    setSelectedBlockId(blockId);
  };

  const handleBlockDelete = (blockId: string) => {
    if (window.confirm('Tem certeza que deseja deletar este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = currentBlocks.find(b => b.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `${blockId}-copy-${Date.now()}`,
        order: blockToDuplicate.order + 1,
      };
      // TODO: Implementar duplicação via context
      console.log('📋 Duplicando bloco:', newBlock);
    }
  };

  // Obter bloco selecionado
  const currentSelectedBlock = selectedBlockId
    ? currentBlocks.find(b => b.id === selectedBlockId) || null
    : null;

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onDelete: () => {
      if (selectedBlockId) {
        handleBlockDelete(selectedBlockId);
      }
    },
    hasSelectedBlock: !!selectedBlockId,
  });

  return (
    <PreviewProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
        {/* 🎮 CONTROLS MANAGER - Barra superior unificada */}
        <EditorControlsManager
          state={controlsState}
          actions={controlsActions}
          mode={editorMode === 'edit' ? 'full' : 'minimal'}
          className="border-b border-stone-200/50 bg-white/80 backdrop-blur-sm"
        />

        {/* 🎯 LAYOUT PRINCIPAL UNIFICADO */}
        <div className="flex h-[calc(100vh-60px)]">
          {/* 🎪 STAGE MANAGER - Navegação de etapas */}
          <div className="w-80 border-r border-stone-200/50 bg-white/90 backdrop-blur-sm">
            <EditorStageManager
              mode={editorMode}
              initialStep={currentStep}
              onStepSelect={handleStepSelect}
              onModeChange={handleModeChange}
              className="h-full"
            />
          </div>

          {/* 🎨 UNIFIED PREVIEW ENGINE - Canvas principal */}
          <div className="flex-1 relative overflow-hidden">
            <div ref={scrollRef} className="h-full p-6 overflow-auto">
              <UnifiedPreviewEngine
                blocks={currentBlocks}
                selectedBlockId={selectedBlockId}
                isPreviewing={editorMode === 'preview' || editorMode === 'test'}
                viewportSize={controlsState.viewportSize}
                onBlockSelect={handleBlockSelect}
                onBlockUpdate={handleBlockUpdate}
                mode={editorMode === 'edit' ? 'editor' : 'preview'}
                className="mx-auto"
              />
            </div>
          </div>

          {/* 📝 PROPERTIES PANEL - Painel de propriedades unificado */}
          <div className="w-80 border-l border-stone-200/50 bg-white/90 backdrop-blur-sm">
            <EditorPropertiesPanel
              selectedBlock={currentSelectedBlock}
              onBlockUpdate={handleBlockUpdate}
              onBlockDuplicate={handleBlockDuplicate}
              onBlockDelete={handleBlockDelete}
              previewMode={editorMode === 'preview'}
              onPreviewToggle={enabled => {
                setEditorMode(enabled ? 'preview' : 'edit');
              }}
              className="h-full"
            />
          </div>
        </div>

        {/* MODAIS LEGADOS (mantidos para compatibilidade) */}
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

export default EditorUnified;
