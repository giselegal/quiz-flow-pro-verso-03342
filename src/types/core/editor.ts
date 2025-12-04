/**
 * 🎯 CANONICAL EDITOR TYPE DEFINITION
 * 
 * Fonte única de verdade para tipos de Editor em todo o projeto.
 * 
 * @canonical
 */

import type { Block } from './block';

// =============================================================================
// EDITOR MODE
// =============================================================================

export type EditorMode = 'edit' | 'preview' | 'readonly';

// =============================================================================
// EDITOR STATE
// =============================================================================

export interface EditorState {
  /** Current step number (1-indexed) */
  currentStep: number;
  
  /** Current step ID string (e.g., 'step-1') */
  currentStepId: string | null;
  
  /** Currently selected block ID */
  selectedBlockId: string | null;
  
  /** Editor mode */
  mode: EditorMode;
  
  /** Whether the editor has unsaved changes */
  isDirty: boolean;
  
  /** Last save timestamp */
  lastSaved: Date | null;
  
  /** Whether editing is enabled */
  isEditing: boolean;
  
  /** Whether preview mode is active */
  isPreviewMode: boolean;
  
  /** Blocks organized by step number */
  stepBlocks: Record<number, Block[]>;
  
  /** Total number of steps */
  totalSteps: number;
  
  /** Dirty steps that need saving */
  dirtySteps: Set<number>;
  
  /** Template ID being edited */
  templateId?: string;
  
  /** Funnel ID being edited */
  funnelId?: string;
}

// =============================================================================
// EDITOR ACTIONS
// =============================================================================

export interface EditorActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  selectStep: (stepId: string) => void;
  
  // Block selection
  selectBlock: (blockId: string | null) => void;
  
  // Mode
  setMode: (mode: EditorMode) => void;
  togglePreview: (enabled?: boolean) => void;
  toggleEditing: (enabled?: boolean) => void;
  
  // Block CRUD
  addBlock: (step: number, block: Block) => void;
  addBlockAtIndex: (step: number, block: Block, index: number) => void;
  updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (step: number, blockId: string) => void;
  moveBlock: (step: number, blockId: string, newIndex: number) => void;
  duplicateBlock: (step: number, blockId: string) => void;
  
  // Step management
  setStepBlocks: (step: number, blocks: Block[]) => void;
  addStep: () => void;
  removeStep: (step: number) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  
  // State management
  markDirty: (step?: number) => void;
  markClean: (step?: number) => void;
  setLastSaved: (date: Date) => void;
  
  // Persistence
  save: () => Promise<void> | void;
  load: (templateId: string) => Promise<void> | void;
  reset: () => void;
}

// =============================================================================
// EDITOR CONTEXT VALUE
// =============================================================================

export interface EditorContextValue {
  state: EditorState;
  actions: EditorActions;
}

// =============================================================================
// EDITOR API (Unified interface)
// =============================================================================

export interface EditorAPI extends EditorState, EditorActions {}

// =============================================================================
// DEFAULT VALUES
// =============================================================================

export const DEFAULT_EDITOR_STATE: EditorState = {
  currentStep: 1,
  currentStepId: 'step-1',
  selectedBlockId: null,
  mode: 'edit',
  isDirty: false,
  lastSaved: null,
  isEditing: true,
  isPreviewMode: false,
  stepBlocks: {},
  totalSteps: 0,
  dirtySteps: new Set(),
};

// =============================================================================
// EDITOR HISTORY
// =============================================================================

export interface EditorHistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  state: Partial<EditorState>;
  metadata?: Record<string, unknown>;
}

export interface EditorHistory {
  entries: EditorHistoryEntry[];
  currentIndex: number;
  maxEntries: number;
}

// =============================================================================
// EDITOR VALIDATION
// =============================================================================

export interface EditorValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  blockId?: string;
  stepId?: number;
}

export interface EditorValidationResult {
  isValid: boolean;
  errors: EditorValidationError[];
  warnings: EditorValidationError[];
}

// =============================================================================
// PROPERTY PANEL TYPES
// =============================================================================

export type PropertyType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'color'
  | 'image'
  | 'url'
  | 'textarea'
  | 'richtext'
  | 'array'
  | 'object'
  | 'range'
  | 'date';

export interface PropertyDefinition {
  id: string;
  type: PropertyType;
  label: string;
  description?: string;
  category?: 'basic' | 'style' | 'advanced' | 'quiz';
  required?: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface PropertySchema {
  type: PropertyType;
  default?: unknown;
  label: string;
  description?: string;
  category?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isEditorState(value: unknown): value is EditorState {
  return (
    !!value &&
    typeof value === 'object' &&
    'currentStep' in value &&
    'stepBlocks' in value
  );
}
