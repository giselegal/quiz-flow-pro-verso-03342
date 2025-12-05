/**
 * 🔄 EDITOR CONTEXT - FACADE DE COMPATIBILIDADE
 * @deprecated Use imports de '@/core/contexts/EditorContext' ou '@/core'
 * 
 * Este arquivo é uma facade que re-exporta do EditorContext canônico.
 * Mantido para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { EditorProvider, useEditorContext } from '@/contexts/EditorContext';
 * 
 * // ✅ DEPOIS
 * import { EditorStateProvider, useEditor } from '@/core/contexts/EditorContext';
 * // ou
 * import { EditorProvider, useEditorContext } from '@/contexts';
 * ```
 */

// Re-export everything from canonical EditorContext
export {
  EditorStateProvider,
  EditorStateProvider as EditorProvider,
  useEditorState,
  useEditor,
  useEditor as useEditorContext,
  type EditorState,
  type EditorContextValue,
  type ValidationError,
} from '@/core/contexts/EditorContext';

// Additional exports for compatibility with this file's original API
import { useEditor } from '@/core/contexts/EditorContext';
import type { Block } from '@/types/editor';

export type EditorMode = 'editor' | 'preview' | 'production';
export type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'xl';

/**
 * @deprecated Use useEditor() from '@/core/contexts/EditorContext'
 */
export function useEditorContextSafe() {
  try {
    return useEditor();
  } catch {
    return null;
  }
}

/**
 * @deprecated Use context.state directly
 */
export function useEditorState_Legacy() {
  const context = useEditor();
  return {
    funnelId: '',
    currentStep: context.currentStep,
    totalSteps: context.totalSteps,
    selectedBlockId: context.selectedBlockId,
    selectedBlockIds: context.selectedBlockId ? [context.selectedBlockId] : [],
    blocks: context.getStepBlocks(context.currentStep),
    stepBlocks: context.stepBlocks,
    mode: context.isPreviewMode ? 'preview' : 'editor',
    viewportSize: 'desktop',
    isPreviewing: context.isPreviewMode,
    isReadOnly: false,
    isDragging: context.dragEnabled,
    isLoading: false,
    isSaving: false,
    hasUnsavedChanges: context.isDirty,
    canUndo: false,
    canRedo: false,
  };
}

/**
 * @deprecated Use context.actions directly
 */
export function useEditorActions() {
  const context = useEditor();
  return context.actions;
}

/**
 * @deprecated
 */
export function useEditorFunnelId(): string {
  return '';
}

/**
 * @deprecated Use context.currentStep
 */
export function useEditorCurrentStep(): number {
  const context = useEditor();
  return context.currentStep;
}

/**
 * @deprecated
 */
export function useSelectedBlock(): Block | null {
  const context = useEditor();
  if (!context.selectedBlockId) return null;
  const blocks = context.getStepBlocks(context.currentStep);
  return blocks.find(b => b.id === context.selectedBlockId) || null;
}

/**
 * @deprecated
 */
export function useCurrentStepBlocks(): Block[] {
  const context = useEditor();
  return context.getStepBlocks(context.currentStep);
}

/**
 * @deprecated
 */
export function useBlockSelection() {
  const context = useEditor();
  return {
    selectedBlockId: context.selectedBlockId,
    selectedBlockIds: context.selectedBlockId ? [context.selectedBlockId] : [],
    selectBlock: context.selectBlock,
    selectBlocks: (ids: string[]) => context.selectBlock(ids[0] || null),
    clearSelection: () => context.selectBlock(null),
  };
}

/**
 * @deprecated
 */
export function useStepNavigation() {
  const context = useEditor();
  return {
    currentStep: context.currentStep,
    totalSteps: context.totalSteps,
    setCurrentStep: context.setCurrentStep,
    goToNextStep: () => context.setCurrentStep(Math.min(context.currentStep + 1, context.totalSteps)),
    goToPreviousStep: () => context.setCurrentStep(Math.max(context.currentStep - 1, 1)),
    canGoNext: context.currentStep < context.totalSteps,
    canGoPrevious: context.currentStep > 1,
  };
}

/**
 * @deprecated
 */
export function useEditorHistory() {
  return {
    canUndo: false,
    canRedo: false,
    undo: () => {},
    redo: () => {},
  };
}

// Export EditorState and EditorActions interfaces for compatibility
export interface EditorState_Legacy {
  funnelId: string;
  currentStep: number;
  totalSteps: number;
  selectedBlockId: string | null;
  selectedBlockIds: string[];
  blocks: Block[];
  stepBlocks: Record<string, Block[]>;
  mode: EditorMode;
  viewportSize: ViewportSize;
  isPreviewing: boolean;
  isReadOnly: boolean;
  isDragging: boolean;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export interface EditorActions_Legacy {
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  selectBlock: (blockId: string | null) => void;
  selectBlocks: (blockIds: string[]) => void;
  clearSelection: () => void;
  addBlock: (block: Block, index?: number) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  setMode: (mode: EditorMode) => void;
  setViewportSize: (size: ViewportSize) => void;
  togglePreview: () => void;
  setFunnelId: (funnelId: string) => void;
  setStepBlocks: (stepKey: string, blocks: Block[]) => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<void>;
  markDirty: () => void;
  setIsDragging: (isDragging: boolean) => void;
}
