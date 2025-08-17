import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { useEditorSave } from '@/services/editorPersistenceService';
import { useLocation } from 'wouter';

/**
 * 🚀 EDITOR SIMPLES - FOCO NO SALVAMENTO
 * Versão simplificada focada em resolver o problema de salvamento
 */
export const EditorSimpleSave: React.FC = () => {
  const [, setLocation] = useLocation();
  const { save: saveEditor } = useEditorSave();
  const [isSaving, setIsSaving] = useState(false);

  // Editor Context
  const {
    activeStageId,
    blockActions: { addBlock, setSelectedBlockId, deleteBlock, updateBlock },
    uiState: { isPreviewing, setIsPreviewing },
    computed: { currentBlocks, selectedBlock },
  } = useEditor();

  // 🎯 AUTO-SAVE OTIMIZADO
  useAutoSaveWithDebounce({
    data: {
      blocks: currentBlocks,
      activeStageId,
      funnelId: `auto-save-${Date.now()}`,
      timestamp: Date.now(),
    },
    onSave: async data => {
      console.log('🔄 Auto-save iniciado:', data);
      await saveEditor(data, false); // Sem toast para auto-save
      console.log('✅ Auto-save concluído');
    },
    delay: 3000,
    enabled: true,
    showToasts: false,
  });

  // 🎯 SAVE MANUAL
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      await saveEditor({
        blocks: currentBlocks,
        activeStageId,
        funnelId: `manual-save-${Date.now()}`,
        timestamp: Date.now(),
      }, true); // Com toast para save manual
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = () => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: 'text' as any,
      stageId: activeStageId || 'step-1',
      order: currentBlocks.length,
      props: { content: 'Novo bloco de texto' },
    };
    addBlock(newBlock as any);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Excluir este bloco?')) {
      deleteBlock(blockId);
      setSelectedBlockId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      {/* TOOLBAR SIMPLIFICADO */}
      <div className="border-b border-[#B89B7A]/20 p-4 bg-white flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#432818]">
          🚀 Editor - Teste de Salvamento
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setLocation('/meus-templates')}
            className="px-4 py-2 border border-[#B89B7A] text-[#432818] rounded-lg hover:bg-[#B89B7A]/10"
          >
            Meus Templates
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#B89B7A] hover:bg-[#A38A69]'
            }`}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* ÁREA DE TRABALHO */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* STATUS */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#432818] mb-4">
              📊 Status do Editor
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-[#6B4F43]">Blocos:</span>
                <div className="font-semibold">{currentBlocks.length}</div>
              </div>
              <div>
                <span className="text-[#6B4F43]">Estágio:</span>
                <div className="font-semibold">{activeStageId || 'step-1'}</div>
              </div>
              <div>
                <span className="text-[#6B4F43]">Preview:</span>
                <div className="font-semibold">{isPreviewing ? 'Ativo' : 'Desativo'}</div>
              </div>
              <div>
                <span className="text-[#6B4F43]">Auto-save:</span>
                <div className="font-semibold text-green-600">Ativo</div>
              </div>
            </div>
          </div>

          {/* CONTROLES */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#432818] mb-4">
              🎮 Controles
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddBlock}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                ➕ Adicionar Bloco
              </button>
              
              <button
                onClick={() => setIsPreviewing(!isPreviewing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                👁️ {isPreviewing ? 'Sair do Preview' : 'Preview'}
              </button>

              <button
                onClick={() => localStorage.clear()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Limpar Cache
              </button>
            </div>
          </div>

          {/* BLOCOS */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#432818] mb-4">
              📦 Blocos ({currentBlocks.length})
            </h3>
            
            {currentBlocks.length === 0 ? (
              <div className="text-center py-8 text-[#6B4F43]">
                Nenhum bloco ainda. Clique em "Adicionar Bloco" para começar.
              </div>
            ) : (
              <div className="space-y-3">
                {currentBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      selectedBlock?.id === block.id
                        ? 'border-[#B89B7A] bg-[#B89B7A]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBlockId(block.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-[#432818]">
                          Bloco {index + 1}
                        </span>
                        <span className="text-sm text-[#6B4F43] ml-2">
                          ({block.type})
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateBlock(block.id, {
                              ...block.props,
                              content: `Editado em ${new Date().toLocaleTimeString()}`,
                            });
                          }}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          ✏️ Editar
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-[#8B7355]">
                      Conteúdo: {JSON.stringify(block.props).slice(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOG DE DEBUG */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">🔍 Debug Info</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Timestamp: {new Date().toLocaleString()}</div>
              <div>Auto-save: Ativo a cada 3s após mudanças</div>
              <div>Salvamento: Supabase (primário) + localStorage (fallback)</div>
              <div>Estado: {isSaving ? 'Salvando...' : 'Pronto'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSimpleSave;
