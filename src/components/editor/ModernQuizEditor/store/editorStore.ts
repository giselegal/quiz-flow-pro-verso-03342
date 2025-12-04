/**
 * 🎨 Editor Store - Estado da UI do editor
 * 
 * Gerencia:
 * - Seleções (step, block)
 * - Estado da UI (panels abertos, etc)
 * - Preview mode
 * - Editor mode (visual/json)
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type EditorMode = 'visual' | 'json';
type LibraryTab = 'blocks' | 'saved';

interface EditorStore {
  // ========================================================================
  // ESTADO - SELEÇÕES
  // ========================================================================
  selectedStepId: string | null;
  selectedBlockId: string | null;
  /** 🆕 Multi-select: IDs de blocos selecionados */
  selectedBlockIds: string[];
  
  // ========================================================================
  // ESTADO - UI
  // ========================================================================
  isPropertiesPanelOpen: boolean;
  isBlockLibraryOpen: boolean;
  isPreviewMode: boolean;
  /** 🆕 Command Palette */
  isCommandPaletteOpen: boolean;
  
  // ========================================================================
  // ESTADO - MODO DO EDITOR
  // ========================================================================
  editorMode: EditorMode;
  splitPreviewEnabled: boolean;
  libraryTab: LibraryTab;
  
  // ========================================================================
  // ESTADO - SAVE TO LIBRARY DIALOG
  // ========================================================================
  saveToLibraryDialog: {
    open: boolean;
    blockType: string;
    blockConfig: Record<string, any>;
  };
  
  // ========================================================================
  // AÇÕES - SELEÇÃO
  // ========================================================================
  
  /**
   * Selecionar step (e limpar seleção de bloco)
   */
  selectStep: (stepId: string | null) => void;
  
  /**
   * Selecionar bloco
   */
  selectBlock: (blockId: string | null) => void;
  
  /**
   * 🆕 Toggle bloco na seleção múltipla (Ctrl+Click)
   */
  toggleBlockSelection: (blockId: string) => void;
  
  /**
   * 🆕 Selecionar todos os blocos
   */
  selectAllBlocks: (blockIds: string[]) => void;
  
  /**
   * Limpar todas as seleções
   */
  clearSelection: () => void;
  
  // ========================================================================
  // AÇÕES - UI
  // ========================================================================
  
  /**
   * Toggle properties panel
   */
  togglePropertiesPanel: () => void;
  
  /**
   * Toggle block library
   */
  toggleBlockLibrary: () => void;
  
  /**
   * Toggle preview mode
   */
  togglePreviewMode: () => void;
  
  /**
   * Set editor mode (visual or json)
   */
  setEditorMode: (mode: EditorMode) => void;
  
  /**
   * Toggle between visual and json mode
   */
  toggleEditorMode: () => void;

  /**
   * Toggle split preview
   */
  toggleSplitPreview: () => void;
  
  /**
   * Set library tab
   */
  setLibraryTab: (tab: LibraryTab) => void;
  
  /**
   * Open save to library dialog
   */
  openSaveToLibrary: (blockType: string, blockConfig: Record<string, any>) => void;
  
  /**
   * Close save to library dialog
   */
  closeSaveToLibrary: () => void;
  
  /**
   * 🆕 Toggle command palette
   */
  toggleCommandPalette: () => void;
  
  /**
   * 🆕 Set command palette open state
   */
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useEditorStore = create<EditorStore>()(
  immer((set) => ({
    // ========================================================================
    // ESTADO INICIAL
    // ========================================================================
    selectedStepId: null,
    selectedBlockId: null,
    selectedBlockIds: [],
    isPropertiesPanelOpen: true,
    isBlockLibraryOpen: true,
    isPreviewMode: false,
    isCommandPaletteOpen: false,
    editorMode: 'visual',
    splitPreviewEnabled: false,
    libraryTab: 'blocks',
    saveToLibraryDialog: {
      open: false,
      blockType: '',
      blockConfig: {},
    },
    
    // ========================================================================
    // IMPLEMENTAÇÕES - SELEÇÃO
    // ========================================================================
    
    selectStep: (stepId) => {
      set((state) => {
        state.selectedStepId = stepId;
        state.selectedBlockId = null; // Limpar seleção de bloco
      });
    },
    
    selectBlock: (blockId) => {
      set((state) => {
        state.selectedBlockId = blockId;
        state.selectedBlockIds = blockId ? [blockId] : [];
      });
    },
    
    toggleBlockSelection: (blockId) => {
      set((state) => {
        const idx = state.selectedBlockIds.indexOf(blockId);
        if (idx === -1) {
          state.selectedBlockIds.push(blockId);
          state.selectedBlockId = blockId;
        } else {
          state.selectedBlockIds.splice(idx, 1);
          state.selectedBlockId = state.selectedBlockIds[state.selectedBlockIds.length - 1] || null;
        }
      });
    },
    
    selectAllBlocks: (blockIds) => {
      set((state) => {
        state.selectedBlockIds = [...blockIds];
        state.selectedBlockId = blockIds[blockIds.length - 1] || null;
      });
    },
    
    clearSelection: () => {
      set((state) => {
        state.selectedStepId = null;
        state.selectedBlockId = null;
        state.selectedBlockIds = [];
      });
    },
    
    // ========================================================================
    // IMPLEMENTAÇÕES - UI
    // ========================================================================
    
    togglePropertiesPanel: () => {
      set((state) => {
        state.isPropertiesPanelOpen = !state.isPropertiesPanelOpen;
      });
    },
    
    toggleBlockLibrary: () => {
      set((state) => {
        state.isBlockLibraryOpen = !state.isBlockLibraryOpen;
      });
    },
    
    togglePreviewMode: () => {
      set((state) => {
        state.isPreviewMode = !state.isPreviewMode;
      });
    },
    
    setEditorMode: (mode) => {
      set((state) => {
        state.editorMode = mode;
      });
    },
    
    toggleEditorMode: () => {
      set((state) => {
        state.editorMode = state.editorMode === 'visual' ? 'json' : 'visual';
      });
    },

    toggleSplitPreview: () => {
      set((state) => {
        state.splitPreviewEnabled = !state.splitPreviewEnabled;
      });
    },
    
    setLibraryTab: (tab) => {
      set((state) => {
        state.libraryTab = tab;
      });
    },
    
    openSaveToLibrary: (blockType, blockConfig) => {
      set((state) => {
        state.saveToLibraryDialog = {
          open: true,
          blockType,
          blockConfig,
        };
      });
    },
    
    closeSaveToLibrary: () => {
      set((state) => {
        state.saveToLibraryDialog.open = false;
      });
    },
    
    toggleCommandPalette: () => {
      set((state) => {
        state.isCommandPaletteOpen = !state.isCommandPaletteOpen;
      });
    },
    
    setCommandPaletteOpen: (open) => {
      set((state) => {
        state.isCommandPaletteOpen = open;
      });
    },
  })),
);
