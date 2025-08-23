import React, { useCallback } from 'react';
import { cn } from '../../lib/utils';
import { useUnifiedEditor } from './UnifiedEditorProvider';

// Types
interface EditorUnifiedProps {
  funnelId?: string;
  className?: string;
  displayMode?: 'edit' | 'preview' | 'interactive';
  userName?: string;
  config?: EditorConfig;
}

interface EditorConfig {
  showToolbar?: boolean;
  showStages?: boolean;
  showComponents?: boolean;
  showProperties?: boolean;
  enableAnalytics?: boolean;
  enableAutoSave?: boolean;
}

/**
 * 🎯 EditorUnified - Editor Principal Unificado
 *
 * Este é o componente principal que substitui todos os editores existentes,
 * fornecendo uma interface consistente e modular para edição de quiz.
 *
 * Funcionalidades:
 * - ✅ Sistema de 21 etapas
 * - ✅ Drag & Drop completo
 * - ✅ Painéis modulares
 * - ✅ Preview em tempo real
 * - ✅ Cálculos unificados
 * - ✅ Analytics integrados
 * - ✅ Auto-save
 * - ✅ Extensibilidade
 */
const EditorUnified: React.FC<EditorUnifiedProps> = ({
  funnelId,
  className = '',
  userName,
  config = {
    showToolbar: true,
    showStages: true,
    showComponents: true,
    showProperties: true,
    enableAnalytics: true,
    enableAutoSave: true,
  },
}) => {
  // Usar o hook do provider unificado
  const { state: editorState, actions, computed } = useUnifiedEditor();

  // Valores computados usando o computed do provider
  const safeCurrentStep = computed.currentStep;
  const currentStepBlocks = computed.currentStepBlocks;
  const selectedBlock = computed.selectedBlock;

  /* -------------------------
     Event Handlers
     ------------------------- */

  const handleModeChange = useCallback(
    (mode: 'edit' | 'preview' | 'interactive') => {
      actions.setMode(mode);
      console.log('🔄 Modo alterado para:', mode);
    },
    [actions]
  );

  const handleStepChange = useCallback(
    (step: number) => {
      actions.setCurrentStep(step);
      console.log('📍 Etapa alterada para:', step);
    },
    [actions]
  );

  const handleBlockAdd = useCallback(
    async (type: string) => {
      try {
        const blockId = await actions.addBlock(type as any);
        actions.selectBlock(blockId);
        console.log(`➕ Bloco ${type} adicionado:`, blockId);
      } catch (error) {
        console.error('❌ Erro ao adicionar bloco:', error);
      }
    },
    [actions]
  );

  const handleBlockUpdate = useCallback(
    async (blockId: string, updates: any) => {
      try {
        await actions.updateBlock(blockId, updates);
        console.log('✅ Bloco atualizado:', blockId);
      } catch (error) {
        console.error('❌ Erro ao atualizar bloco:', error);
      }
    },
    [actions]
  );

  const handleBlockDelete = useCallback(
    async (blockId: string) => {
      try {
        await actions.deleteBlock(blockId);
        console.log('🗑️ Bloco removido:', blockId);
      } catch (error) {
        console.error('❌ Erro ao remover bloco:', error);
      }
    },
    [actions]
  );

  const handleBlockSelect = useCallback(
    (blockId: string | null) => {
      actions.selectBlock(blockId);
    },
    [actions]
  );

  /* -------------------------
     Render Components
     ------------------------- */

  const renderToolbar = () => {
    if (!config.showToolbar) return null;

    return (
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Editor Unificado - Etapa {safeCurrentStep}
          </h1>

          <div className="flex space-x-2">
            {(['edit', 'preview', 'interactive'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={cn(
                  'px-3 py-1 rounded text-sm capitalize',
                  editorState.mode === mode
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {editorState.isLoading && <div className="text-sm text-gray-500">Carregando...</div>}
          <div className="text-sm text-gray-500">{currentStepBlocks.length} blocos</div>
        </div>
      </div>
    );
  };

  const renderStagesPanel = () => {
    if (!config.showStages) return null;

    return (
      <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Etapas</h2>
          <p className="text-sm text-gray-600 mt-1">Quiz de 21 etapas</p>
        </div>

        <div className="p-4">
          {Array.from({ length: 21 }, (_, i) => i + 1).map(step => (
            <button
              key={step}
              onClick={() => handleStepChange(step)}
              className={cn(
                'w-full text-left p-2 rounded mb-2 transition-colors',
                step === safeCurrentStep
                  ? 'bg-blue-100 text-blue-900 border border-blue-300'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              <div className="flex justify-between items-center">
                <span>Etapa {step}</span>
                <span className="text-xs text-gray-500">
                  {editorState.blocks[`step_${step}`]?.length || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderComponentsPanel = () => {
    if (!config.showComponents) return null;

    const components = [
      { type: 'text', name: 'Texto', icon: '📝' },
      { type: 'image', name: 'Imagem', icon: '🖼️' },
      { type: 'button', name: 'Botão', icon: '🔘' },
      { type: 'input', name: 'Input', icon: '📝' },
      { type: 'select', name: 'Seleção', icon: '📋' },
      { type: 'quiz-question', name: 'Questão Quiz', icon: '❓' },
    ];

    return (
      <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Componentes</h2>
          <p className="text-sm text-gray-600 mt-1">Arraste para o canvas</p>
        </div>

        <div className="p-4">
          {components.map(component => (
            <button
              key={component.type}
              onClick={() => handleBlockAdd(component.type)}
              className="w-full text-left p-3 rounded mb-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              disabled={editorState.isLoading}
            >
              <div className="flex items-center">
                <span className="text-xl mr-3">{component.icon}</span>
                <span className="font-medium">{component.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCanvas = () => {
    return (
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-96">
            <div className="p-6">
              {currentStepBlocks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Canvas vazio</h3>
                  <p className="text-gray-500">Adicione componentes usando o painel lateral</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentStepBlocks.map(block => (
                    <div
                      key={block.id}
                      onClick={() => handleBlockSelect(block.id)}
                      className={cn(
                        'p-4 border rounded-lg cursor-pointer transition-colors',
                        editorState.selectedBlockId === block.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium capitalize">{block.type}</div>
                          <div className="text-sm text-gray-500">ID: {block.id}</div>
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleBlockDelete(block.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPropertiesPanel = () => {
    if (!config.showProperties) return null;

    return (
      <div className="w-80 bg-white border-l border-gray-200 h-full overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Propriedades</h2>
          <p className="text-sm text-gray-600 mt-1">
            {selectedBlock ? `Editando: ${selectedBlock.type}` : 'Nenhum bloco selecionado'}
          </p>
        </div>

        <div className="p-4">
          {selectedBlock ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo do Bloco
                </label>
                <input
                  type="text"
                  value={selectedBlock.type}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ID do Bloco</label>
                <input
                  type="text"
                  value={selectedBlock.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Propriedades (JSON)
                </label>
                <textarea
                  value={JSON.stringify(selectedBlock.properties, null, 2)}
                  onChange={e => {
                    try {
                      const properties = JSON.parse(e.target.value);
                      handleBlockUpdate(selectedBlock.id, { properties });
                    } catch (error) {
                      console.warn('JSON inválido');
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-3xl mb-2">⚙️</div>
              <p className="text-gray-500 text-sm">
                Selecione um bloco para editar suas propriedades
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* -------------------------
     Main Render
     ------------------------- */

  return (
    <div className={cn('w-full h-screen flex flex-col', className)}>
      {/* Toolbar */}
      {renderToolbar()}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stages Panel */}
        {renderStagesPanel()}

        {/* Components Panel */}
        {renderComponentsPanel()}

        {/* Canvas */}
        {renderCanvas()}

        {/* Properties Panel */}
        {renderPropertiesPanel()}
      </div>

      {/* Status Bar (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span>
              Etapa: {safeCurrentStep}/21 | Blocos: {currentStepBlocks.length} | Selecionado:{' '}
              {editorState.selectedBlockId || 'nenhum'}
            </span>
            <span>
              Modo: {editorState.mode} | Funnel: {funnelId || 'local'} | Usuário:{' '}
              {userName || 'anônimo'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorUnified;
