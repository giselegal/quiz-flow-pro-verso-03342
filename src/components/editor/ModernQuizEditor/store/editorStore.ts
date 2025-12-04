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

interface EditorStore {
  // ========================================================================
  // ESTADO - SELEÇÕES
  // ========================================================================
  selectedStepId: string | null;
  selectedBlockId: string | null;
  
  // ========================================================================
  // ESTADO - UI
  // ========================================================================
  isPropertiesPanelOpen: boolean;
  isBlockLibraryOpen: boolean;
  isPreviewMode: boolean;
  
  // ========================================================================
  // ESTADO - MODO DO EDITOR
  // ========================================================================
  editorMode: EditorMode;
  splitPreviewEnabled: boolean;
  
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
}

export const useEditorStore = create<EditorStore>()(
  immer((set) => ({
    // ========================================================================
    // ESTADO INICIAL
    // ========================================================================
    selectedStepId: null,
    selectedBlockId: null,
    isPropertiesPanelOpen: true,
    isBlockLibraryOpen: true,
    isPreviewMode: false,
    editorMode: 'visual',
    splitPreviewEnabled: false,
    
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
      });
    },
    
    clearSelection: () => {
      set((state) => {
        state.selectedStepId = null;
        state.selectedBlockId = null;
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
  })),
);
