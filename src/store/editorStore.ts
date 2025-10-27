/**
 * 🎯 EDITOR STORE - Zustand Store Principal
 * 
 * Store centralizada para gerenciar todo o estado do editor:
 * - Blocos e steps
 * - Seleção (block/step)
 * - Modo de edição
 * - Dirty state
 * - Histórico (undo/redo)
 * 
 * Substitui: EditorContext, useConsolidatedEditor, 50+ hooks fragmentados
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Block, BlockType } from '@/types/editor';

// ============================================================================
// TYPES
// ============================================================================

export interface EditorStep {
  id: string;
  order: number;
  name: string;
  description?: string;
  blocks: Block[];
}

interface EditorState {
  // Estado principal
  steps: EditorStep[];
  currentStepId: string | null;
  selectedBlockId: string | null;
  
  // Modo e flags
  isEditMode: boolean;
  isPreviewMode: boolean;
  isDirty: boolean;
  isSaving: boolean;
  
  // Histórico
  history: EditorStep[][];
  historyIndex: number;
  
  // Funnel metadata
  funnelId: string | null;
  funnelName: string;
  funnelDescription: string;
}

interface EditorActions {
  // Step management
  setSteps: (steps: EditorStep[]) => void;
  setCurrentStep: (stepId: string) => void;
  addStep: (name: string, position?: number) => void;
  removeStep: (stepId: string) => void;
  reorderSteps: (startIndex: number, endIndex: number) => void;
  
  // Block management
  addBlock: (type: BlockType, properties?: any) => string;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  removeBlock: (blockId: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  duplicateBlock: (blockId: string) => void;
  
  // Selection
  setSelectedBlock: (blockId: string | null) => void;
  
  // Modes
  setEditMode: (isEdit: boolean) => void;
  setPreviewMode: (isPreview: boolean) => void;
  
  // Dirty state
  markDirty: () => void;
  markClean: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Persistence
  setSaving: (isSaving: boolean) => void;
  setFunnelMetadata: (id: string, name: string, description?: string) => void;
  
  // Reset
  reset: () => void;
}

type EditorStore = EditorState & EditorActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: EditorState = {
  steps: [],
  currentStepId: null,
  selectedBlockId: null,
  isEditMode: true,
  isPreviewMode: false,
  isDirty: false,
  isSaving: false,
  history: [],
  historyIndex: -1,
  funnelId: null,
  funnelName: '',
  funnelDescription: '',
};

// ============================================================================
// STORE
// ============================================================================

export const useEditorStore = create<EditorStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Step management
        setSteps: (steps) =>
          set((state) => {
            state.steps = steps;
            if (!state.currentStepId && steps.length > 0) {
              state.currentStepId = steps[0].id;
            }
          }),

        setCurrentStep: (stepId) =>
          set((state) => {
            state.currentStepId = stepId;
            state.selectedBlockId = null;
          }),

        addStep: (name, position) =>
          set((state) => {
            const newStep: EditorStep = {
              id: `step-${Date.now()}`,
              order: position ?? state.steps.length,
              name,
              blocks: [],
            };
            
            if (position !== undefined) {
              state.steps.splice(position, 0, newStep);
            } else {
              state.steps.push(newStep);
            }
            
            state.isDirty = true;
          }),

        removeStep: (stepId) =>
          set((state) => {
            state.steps = state.steps.filter((s) => s.id !== stepId);
            if (state.currentStepId === stepId) {
              state.currentStepId = state.steps[0]?.id ?? null;
            }
            state.isDirty = true;
          }),

        reorderSteps: (startIndex, endIndex) =>
          set((state) => {
            const [removed] = state.steps.splice(startIndex, 1);
            state.steps.splice(endIndex, 0, removed);
            state.isDirty = true;
          }),

        // Block management
        addBlock: (type, properties = {}) => {
          let newBlockId = '';
          
          set((state) => {
            const currentStep = state.steps.find((s) => s.id === state.currentStepId);
            if (!currentStep) return;

            newBlockId = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const newBlock: Block = {
              id: newBlockId,
              type,
              order: currentStep.blocks.length,
              properties,
              content: {},
            };

            currentStep.blocks.push(newBlock);
            state.selectedBlockId = newBlockId;
            state.isDirty = true;
          });

          return newBlockId;
        },

        updateBlock: (blockId, updates) =>
          set((state) => {
            const currentStep = state.steps.find((s) => s.id === state.currentStepId);
            if (!currentStep) return;

            const block = currentStep.blocks.find((b) => b.id === blockId);
            if (block) {
              Object.assign(block, updates);
              state.isDirty = true;
            }
          }),

        removeBlock: (blockId) =>
          set((state) => {
            const currentStep = state.steps.find((s) => s.id === state.currentStepId);
            if (!currentStep) return;

            currentStep.blocks = currentStep.blocks.filter((b) => b.id !== blockId);
            if (state.selectedBlockId === blockId) {
              state.selectedBlockId = null;
            }
            state.isDirty = true;
          }),

        reorderBlocks: (startIndex, endIndex) =>
          set((state) => {
            const currentStep = state.steps.find((s) => s.id === state.currentStepId);
            if (!currentStep) return;

            const [removed] = currentStep.blocks.splice(startIndex, 1);
            currentStep.blocks.splice(endIndex, 0, removed);
            
            // Atualizar order
            currentStep.blocks.forEach((block, index) => {
              block.order = index;
            });
            
            state.isDirty = true;
          }),

        duplicateBlock: (blockId) =>
          set((state) => {
            const currentStep = state.steps.find((s) => s.id === state.currentStepId);
            if (!currentStep) return;

            const block = currentStep.blocks.find((b) => b.id === blockId);
            if (!block) return;

            const newBlock: Block = {
              ...block,
              id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              order: block.order + 1,
            };

            const insertIndex = currentStep.blocks.findIndex((b) => b.id === blockId) + 1;
            currentStep.blocks.splice(insertIndex, 0, newBlock);
            
            state.selectedBlockId = newBlock.id;
            state.isDirty = true;
          }),

        // Selection
        setSelectedBlock: (blockId) =>
          set((state) => {
            state.selectedBlockId = blockId;
          }),

        // Modes
        setEditMode: (isEdit) =>
          set((state) => {
            state.isEditMode = isEdit;
            if (isEdit) state.isPreviewMode = false;
          }),

        setPreviewMode: (isPreview) =>
          set((state) => {
            state.isPreviewMode = isPreview;
            if (isPreview) state.isEditMode = false;
          }),

        // Dirty state
        markDirty: () =>
          set((state) => {
            state.isDirty = true;
          }),

        markClean: () =>
          set((state) => {
            state.isDirty = false;
          }),

        // History
        undo: () =>
          set((state) => {
            if (state.historyIndex > 0) {
              state.historyIndex--;
              state.steps = state.history[state.historyIndex];
              state.isDirty = true;
            }
          }),

        redo: () =>
          set((state) => {
            if (state.historyIndex < state.history.length - 1) {
              state.historyIndex++;
              state.steps = state.history[state.historyIndex];
              state.isDirty = true;
            }
          }),

        canUndo: () => get().historyIndex > 0,
        canRedo: () => get().historyIndex < get().history.length - 1,

        // Persistence
        setSaving: (isSaving) =>
          set((state) => {
            state.isSaving = isSaving;
          }),

        setFunnelMetadata: (id, name, description = '') =>
          set((state) => {
            state.funnelId = id;
            state.funnelName = name;
            state.funnelDescription = description;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'editor-storage',
        partialize: (state) => ({
          steps: state.steps,
          currentStepId: state.currentStepId,
          funnelId: state.funnelId,
          funnelName: state.funnelName,
        }),
      },
    ),
    { name: 'EditorStore' },
  ),
);

// ============================================================================
// SELECTORS (Performance Optimized)
// ============================================================================

export const useCurrentStep = () =>
  useEditorStore((state) => state.steps.find((s) => s.id === state.currentStepId) ?? null);

export const useCurrentStepBlocks = () =>
  useEditorStore((state) => {
    const currentStep = state.steps.find((s) => s.id === state.currentStepId);
    return currentStep?.blocks ?? [];
  });

export const useSelectedBlock = () =>
  useEditorStore((state) => {
    const currentStep = state.steps.find((s) => s.id === state.currentStepId);
    return currentStep?.blocks.find((b) => b.id === state.selectedBlockId) ?? null;
  });

export const useEditorMode = () =>
  useEditorStore((state) => ({
    isEditMode: state.isEditMode,
    isPreviewMode: state.isPreviewMode,
  }));

export const useEditorDirtyState = () =>
  useEditorStore((state) => ({
    isDirty: state.isDirty,
    isSaving: state.isSaving,
  }));
