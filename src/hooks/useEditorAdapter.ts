/**
 * 🔌 UNIVERSAL EDITOR ADAPTER
 * 
 * Adaptador universal que unifica todos os contextos do editor
 * Resolve o Problema #3 (Desalinhamento de Contextos)
 * 
 * OBJETIVO:
 * - Fornecer uma interface consistente para todos os componentes
 * - Computar selectedBlock a partir de selectedBlockId
 * - Adicionar métodos faltantes (duplicateBlock, removeBlock, etc)
 * - Garantir compatibilidade entre EditorContext e SuperUnifiedProvider
 * 
 * @version 1.0.0
 */

import { useEditor } from '@/contexts/editor/EditorContext';
import { Block, BlockType } from '@/types/editor';
import { EditorState } from '@/types/editorTypes';
import { generateBlockId } from '@/lib/utils/stableIdGenerator';
import { appLogger } from '@/lib/utils/logger';

/**
 * Interface do adaptador universal
 * Combina todas as propriedades e métodos esperados pelos componentes
 */
export interface EditorAdapter {
  // Estado
  currentStep: number;
  selectedBlockId: string | null;
  selectedBlock: Block | null;
  blocks: Block[];
  isPreviewing: boolean;
  isLoading: boolean;
  funnelId: string;
  
  // Estado completo
  state: EditorState;
  
  // Ações unificadas
  actions: {
    // Block CRUD
    addBlock: (type: BlockType) => Promise<string>;
    updateBlock: (id: string, content: any) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    removeBlock: (id: string) => Promise<void>; // Alias de deleteBlock
    duplicateBlock: (id: string) => Promise<void>;
    addBlockAtIndex: (type: BlockType, index: number) => Promise<string>;
    
    // Reordenação
    reorderBlocks: (startIndex: number, endIndex: number) => void;
    
    // Seleção
    selectBlock: (id: string | null) => void;
    setSelectedBlockId: (id: string | null) => void;
    
    // Preview
    togglePreview: (preview?: boolean) => void;
    
    // Persistência
    save: () => Promise<void>;
    
    // Navegação
    setCurrentStep: (step: number) => void;
    ensureStepLoaded: (step: number) => Promise<void>;
  };
}

/**
 * Hook adaptador universal
 * 
 * @throws {Error} Se usado fora do EditorProvider
 * @returns {EditorAdapter} Interface unificada do editor
 */
export function useEditorAdapter(): EditorAdapter {
  const context = useEditor({ optional: true });
  
  if (!context) {
    throw new Error(
      'useEditorAdapter deve ser usado dentro de um EditorProvider. ' +
      'Verifique se o componente está envolvido por <EditorProvider> ou <SuperUnifiedProvider>.'
    );
  }
  
  const { state, actions, currentStep, funnelId, isPreviewing, isLoading } = context;
  
  // Computar selectedBlock a partir de selectedBlockId
  // Garante que sempre retorna o bloco correto ou null
  const selectedBlock = state.selectedBlockId
    ? state.blocks.find(b => b.id === state.selectedBlockId) || null
    : null;
  
  // Implementar duplicateBlock (FALTAVA)
  const duplicateBlock = async (id: string): Promise<void> => {
    try {
      appLogger.debug('🔄 Duplicando bloco:', id);
      
      // Encontrar bloco original
      const originalBlock = state.blocks.find(b => b.id === id);
      if (!originalBlock) {
        appLogger.warn('⚠️ Bloco não encontrado para duplicar:', id);
        return;
      }
      
      // Criar novo bloco com ID único
      const newId = generateBlockId();
      
      // Adicionar novo bloco do mesmo tipo
      await actions.addBlock(originalBlock.type);
      
      // Atualizar conteúdo do novo bloco com dados do original
      await actions.updateBlock(newId, {
        properties: { ...originalBlock.properties },
        content: { ...originalBlock.content },
      });
      
      appLogger.info('✅ Bloco duplicado com sucesso:', { originalId: id, newId });
    } catch (error) {
      appLogger.error('❌ Erro ao duplicar bloco:', error);
      throw error;
    }
  };
  
  // Implementar addBlockAtIndex (FALTAVA)
  const addBlockAtIndex = async (type: BlockType, index: number): Promise<string> => {
    try {
      appLogger.debug('➕ Adicionando bloco no índice:', { type, index });
      
      // Adicionar bloco normalmente
      const newId = await actions.addBlock(type);
      
      // Reordenar se necessário (mover do final para o índice desejado)
      const currentIndex = state.blocks.findIndex(b => b.id === newId);
      if (currentIndex !== -1 && currentIndex !== index) {
        actions.reorderBlocks(currentIndex, index);
      }
      
      appLogger.info('✅ Bloco adicionado no índice:', { type, index, id: newId });
      return newId;
    } catch (error) {
      appLogger.error('❌ Erro ao adicionar bloco no índice:', error);
      throw error;
    }
  };
  
  // Compor interface do adaptador
  return {
    // Estado
    currentStep,
    selectedBlockId: state.selectedBlockId,
    selectedBlock,
    blocks: state.blocks,
    isPreviewing: isPreviewing ?? false,
    isLoading: isLoading ?? false,
    funnelId,
    state,
    
    // Ações
    actions: {
      // CRUD
      addBlock: actions.addBlock,
      updateBlock: actions.updateBlock,
      deleteBlock: actions.deleteBlock,
      removeBlock: actions.deleteBlock, // Alias
      duplicateBlock, // ✅ IMPLEMENTADO
      addBlockAtIndex, // ✅ IMPLEMENTADO
      
      // Reordenação
      reorderBlocks: actions.reorderBlocks,
      
      // Seleção
      selectBlock: actions.selectBlock,
      setSelectedBlockId: actions.setSelectedBlockId || actions.selectBlock,
      
      // Preview
      togglePreview: actions.togglePreview,
      
      // Persistência
      save: actions.save,
      
      // Navegação
      setCurrentStep: actions.setCurrentStep,
      ensureStepLoaded: actions.ensureStepLoaded || (async () => {}),
    },
  };
}

/**
 * Hook com fallback seguro
 * Retorna null se não estiver dentro do EditorProvider
 * 
 * @returns {EditorAdapter | null} Interface do editor ou null
 */
export function useEditorAdapterSafe(): EditorAdapter | null {
  try {
    return useEditorAdapter();
  } catch {
    return null;
  }
}
