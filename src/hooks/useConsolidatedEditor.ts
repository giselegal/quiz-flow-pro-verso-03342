/**
 * Consolidated Editor Hook - Replaces useEditor conflicts
 *
 * This hook consolidates useEditor and EditorContext functionality,
 * providing a unified interface for editor operations.
 *
 * Eliminates the conflict between:
 * - useEditor (simple block operations)
 * - EditorContext (comprehensive editor state)
 */

import { useContext } from 'react';
import { EditorContext } from '../context/EditorContext';
import { Block, BlockType } from '../types/editor';

// Compatibility interface for legacy useEditor consumers
export interface LegacyEditorConfig {
  blocks: Block[];
  title: string;
  description: string;
}

export interface ConsolidatedEditorReturn {
  // Legacy useEditor compatibility
  blocks: Block[];
  config: LegacyEditorConfig;
  addBlock: (type: string) => Promise<string>;
  updateBlock: (id: string, updates: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
  setAllBlocks: (newBlocks: Block[]) => void;
  clearAllBlocks: () => void;

  // Enhanced EditorContext features
  stages: any[];
  activeStageId: string;
  selectedBlockId: string | null;
  setActiveStage: (stageId: string) => void;
  setSelectedBlock: (blockId: string | null) => void;

  // Performance and persistence
  isSaving: boolean;
  saveFunnel: () => Promise<{ success: boolean; error?: string }>;

  // UI state
  isPreviewing: boolean;
  setIsPreviewing: (value: boolean) => void;
}

/**
 * Consolidated editor hook that replaces both useEditor and direct EditorContext usage
 */
export const useUnifiedEditor = (): ConsolidatedEditorReturn => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error('useUnifiedEditor must be used within EditorProvider');
  }

  const {
    stages,
    activeStageId,
    selectedBlockId,
    stageActions,
    blockActions,
    persistenceActions,
    uiState,
  } = context;

  // Convert EditorContext blocks to legacy Block format for compatibility
  const currentStage = stages.find(stage => stage.id === activeStageId);
  const blocks: Block[] =
    currentStage?.blocks?.map((block: any) => ({
      id: block.id,
      type: block.type as BlockType,
      content: block.properties || {},
      order: block.order || 0,
      properties: block.properties || {},
    })) || [];

  // Legacy config for backward compatibility
  const config: LegacyEditorConfig = {
    blocks,
    title: currentStage?.name || 'Editor',
    description: currentStage?.description || '',
  };

  // Legacy addBlock with automatic ordering
  const addBlock = async (type: string): Promise<string> => {
    // API do EditorContext: addBlock(type) sem stageId
    return await blockActions.addBlock(type as BlockType);
  };

  // Legacy updateBlock
  const updateBlock = async (id: string, updates: any): Promise<void> => {
    await blockActions.updateBlock(id, {
      properties: updates,
      ...updates,
    });
  };

  // Legacy deleteBlock
  const deleteBlock = async (id: string): Promise<void> => {
    await blockActions.deleteBlock(id);
  };

  // Legacy reorderBlocks (converts from index-based to ID-based)
  const reorderBlocks = async (startIndex: number, endIndex: number): Promise<void> => {
    // API do EditorContext: reorderBlocks(startIndex, endIndex)
    await blockActions.reorderBlocks(startIndex, endIndex);
  };

  // Legacy setAllBlocks - replaces all blocks in current stage
  const setAllBlocks = (newBlocks: Block[]): void => {
    // This is a potentially destructive operation, so we'll implement it carefully
    newBlocks.forEach(async (block, index) => {
      const existingBlock = blocks.find(b => b.id === block.id);
      if (existingBlock) {
        await updateBlock(block.id, block);
      } else {
        // Sem suporte garantido a inserção posicional na API; adiciona e depois reordena
        const newId = await blockActions.addBlock(block.type as BlockType);
        if (typeof index === 'number') {
          const currentIndex = blocks.findIndex(b => b.id === newId);
          if (currentIndex >= 0 && currentIndex !== index) {
            await blockActions.reorderBlocks(currentIndex, index);
          }
        }
      }
    });
  };

  // Legacy clearAllBlocks
  const clearAllBlocks = (): void => {
    blocks.forEach(block => {
      blockActions.deleteBlock(block.id);
    });
  };

  return {
    // Legacy useEditor interface
    blocks,
    config,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setAllBlocks,
    clearAllBlocks,

    // Enhanced EditorContext features
    stages,
    activeStageId,
    selectedBlockId,
    setActiveStage: stageActions.setActiveStage,
    setSelectedBlock: blockActions.setSelectedBlockId,

    // Performance and persistence
    isSaving: false,
    saveFunnel: async () => {
      try {
        await persistenceActions.saveFunnel();
        return { success: true } as const;
      } catch (e: any) {
        return { success: false, error: e?.message || String(e) } as const;
      }
    },

    // UI state
    isPreviewing: uiState.isPreviewing,
    setIsPreviewing: uiState.setIsPreviewing,
  };
};

/**
 * @deprecated Use useUnifiedEditor instead
 * This is kept for backward compatibility during migration
 */
export const useEditor = (): Partial<ConsolidatedEditorReturn> => {
  console.warn('useEditor is deprecated. Use useUnifiedEditor instead.');

  try {
    return useUnifiedEditor();
  } catch (error) {
    // Fallback to simple editor if EditorContext is not available
    console.warn('EditorContext not available, using fallback editor');

    // Simple fallback implementation
    const blocks: Block[] = [];

    return {
      blocks,
      config: { blocks, title: 'Editor', description: '' },
  addBlock: async (_type: string) => {
        console.warn('Fallback addBlock called');
        return `block-${Date.now()}`;
      },
      updateBlock: async () => {
        console.warn('Fallback updateBlock called');
      },
      deleteBlock: async () => {
        console.warn('Fallback deleteBlock called');
      },
      reorderBlocks: async () => {
        console.warn('Fallback reorderBlocks called');
      },
      setAllBlocks: () => {
        console.warn('Fallback setAllBlocks called');
      },
      clearAllBlocks: () => {
        console.warn('Fallback clearAllBlocks called');
      },
    };
  }
};

export default useUnifiedEditor;
