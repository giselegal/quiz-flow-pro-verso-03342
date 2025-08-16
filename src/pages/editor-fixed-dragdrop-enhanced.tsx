import React, { useEffect, useState } from 'react';

// Editor Components
import { CanvasDropZone } from '@/components/editor/canvas/CanvasDropZone';
import CombinedComponentsPanel from '@/components/editor/CombinedComponentsPanel';
import { DndProvider } from '@/components/editor/dnd/DndProvider';
import { EditorNotification } from '@/components/editor/EditorNotification';
import { FunnelSettingsPanel } from '@/components/editor/funnel-settings/FunnelSettingsPanel';
import { FunnelStagesPanel } from '@/components/editor/funnel/FunnelStagesPanel';
import { FourColumnLayout } from '@/components/editor/layout/FourColumnLayout';
import { EditorToolbar } from '@/components/enhanced-editor/toolbar/EditorToolbar';
import { PropertiesPanel } from '@/components/editor/properties/PropertiesPanel';
import { BlockType } from '@/types/editor';

// Context & Hooks
import { useEditor } from '@/context/EditorContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePropertyHistory } from '@/hooks/usePropertyHistory';
import { useSyncedScroll } from '@/hooks/useSyncedScroll';
import { Settings } from 'lucide-react';

/**
 * Editor Fixed Enhanced - Versão com integração Supabase
 *
 * Editor de funil com drag & drop completo, incluindo:
 * - Layout de 4 colunas responsivo
 * - Sistema avançado de drag & drop
 * - Painel universal de propriedades
 * - Atalhos de teclado e histórico de mudanças
 * - Preview mode e viewport responsivo
 * - ✅ NOVO: Persistência no Supabase
 * - ✅ NOVO: Sistema híbrido local/Supabase
 */
const EditorFixedEnhancedPage: React.FC = () => {
  // Hooks para funcionalidades avançadas
  const { scrollRef } = useSyncedScroll({ source: 'canvas' });
  const propertyHistory = usePropertyHistory();

  // Estado local
  const [showFunnelSettings, setShowFunnelSettings] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Editor Context - Estado centralizado do editor
  const {
    activeStageId,
    selectedBlockId,
    funnelId,
    isSupabaseEnabled,
    stageActions: { setActiveStage },
    blockActions: {
      addBlock,
      addBlockAtPosition,
      setSelectedBlockId,
      deleteBlock,
      updateBlock,
      reorderBlocks,
    },
    persistenceActions: { saveFunnel },
    uiState: { isPreviewing, setIsPreviewing, viewportSize, setViewportSize },
    computed: { currentBlocks, selectedBlock, totalBlocks, stageCount },
  } = useEditor();

  // Mostrar notificação quando carregar a etapa 1 (apenas uma vez por sessão)
  useEffect(() => {
    const hasShown = sessionStorage.getItem('editor-onboarding-shown');
    if ((activeStageId === 'step-1' || activeStageId === 'step-01') && !hasShown) {
      setShowNotification(true);
      sessionStorage.setItem('editor-onboarding-shown', 'true');
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
  const handleSave = async () => {
    try {
      console.log(
        '💾 Iniciando salvamento do editor... (Supabase:',
        isSupabaseEnabled ? 'enabled' : 'disabled',
        ')'
      );
      const result = await saveFunnel();
      if (result.success) {
        console.log('✅ Editor salvo com sucesso no Supabase:', funnelId);
      } else {
        console.error('❌ Erro no salvamento:', result.error);
      }
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
      // TODO: Implementar disabled prop no DndProvider
      blocks={(currentBlocks || []).map(block => ({
        id: block.id,
        type: block.type,
        properties: block.properties || {},
      }))}
      onBlocksReorder={newBlocksData => {
        if (isPreviewing) {
          console.warn('⚠️ Reordenação bloqueada em modo preview');
          return;
        }

        const newBlockIds = newBlocksData.map(b => b.id);
        const oldBlockIds = (currentBlocks || []).map(b => b.id);

        // ✅ VALIDAÇÃO RIGOROSA: Validar conjunto exato de IDs
        if (oldBlockIds.length !== newBlockIds.length) {
          console.warn('⚠️ Reordenação abortada: quantidade de blocos não confere');
          return;
        }

        const oldSet = new Set(oldBlockIds);
        const newSet = new Set(newBlockIds);

        if (oldSet.size !== newSet.size) {
          console.warn('⚠️ Reordenação abortada: IDs duplicados detectados');
          return;
        }

        for (const id of newBlockIds) {
          if (!oldSet.has(id)) {
            console.warn('⚠️ Reordenação abortada: ID desconhecido:', id);
            return;
          }
        }

        console.log('✅ Reordenação válida, aplicando...');
        reorderBlocks(0, 1);
      }}
      onBlockAdd={(blockType, position) => {
        if (isPreviewing) {
          console.warn('⚠️ Adição de bloco bloqueada em modo preview');
          return;
        }

        if (position !== undefined && position >= 0) {
          addBlockAtPosition(blockType as BlockType);
        } else {
          addBlock(blockType as BlockType);
        }
      }}
      onBlockSelect={blockId => {
        if (!isPreviewing) {
          setSelectedBlockId(blockId);
        }
      }}
      selectedBlockId={isPreviewing ? undefined : selectedBlockId || undefined}
      onBlockUpdate={(blockId, updates) => {
        if (!isPreviewing) {
          updateBlock(blockId, updates as any);
        }
      }}
    >
      {/* Notificação de onboarding (apenas uma vez por sessão) */}
      {showNotification && (
        <EditorNotification
          message={`🎉 Editor Enhanced ativo! Persistência ${isSupabaseEnabled ? 'Supabase' : 'Local'} • Propriedades inteligentes • Funil: ${funnelId}`}
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
              onTogglePreview={() => {
                setIsPreviewing(!isPreviewing);
                if (!isPreviewing) {
                  setSelectedBlockId(null); // Limpar seleção ao entrar em preview
                }
              }}
              onSave={handleSave}
              viewportSize={viewportSize}
              onViewportSizeChange={setViewportSize}
              onShowFunnelSettings={() => setShowFunnelSettings(true)}
            />

            <div style={{ borderColor: '#E5DDD5' }} className="border-b bg-white">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center space-x-4">
                  <h1 className="text-lg font-semibold text-stone-700">
                    Editor Enhanced - Etapa {activeStageId}
                    {isSupabaseEnabled && (
                      <span className="text-xs text-green-600 ml-2">[Supabase]</span>
                    )}
                  </h1>
                  <div className="text-sm text-stone-500">
                    {totalBlocks} componente{totalBlocks !== 1 ? 's' : ''} • {stageCount} etapa
                    {stageCount !== 1 ? 's' : ''} • Funil: {funnelId}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <FourColumnLayout
              className="h-full"
              stagesPanel={<FunnelStagesPanel onStageSelect={handleStageSelect} />}
              componentsPanel={
                <CombinedComponentsPanel
                  currentStepNumber={getStepNumberFromStageId(activeStageId)}
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
                      selectedBlockId={isPreviewing ? null : selectedBlockId}
                      onSelectBlock={isPreviewing ? () => {} : setSelectedBlockId}
                      onUpdateBlock={isPreviewing ? () => {} : updateBlock}
                      onDeleteBlock={isPreviewing ? () => {} : handleDeleteBlock}
                    />
                  </div>
                </div>
              }
              propertiesPanel={
                !isPreviewing && selectedBlock ? (
                  // 🆕 PAINEL DE PROPRIEDADES ENHANCED
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
                        Editor Enhanced • Persistência {isSupabaseEnabled ? 'Supabase' : 'Local'}
                        <br />
                        Propriedades específicas por tipo aparecem aqui
                      </p>
                      <div className="mt-4 text-xs text-stone-400 space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${isSupabaseEnabled ? 'bg-green-400' : 'bg-blue-400'}`}
                          ></div>
                          <span>{isSupabaseEnabled ? 'Supabase Online' : 'Modo Local'}</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <span>Funil: {funnelId}</span>
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
            funnelId={funnelId}
            isOpen={showFunnelSettings}
            onClose={() => setShowFunnelSettings(false)}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default EditorFixedEnhancedPage;
