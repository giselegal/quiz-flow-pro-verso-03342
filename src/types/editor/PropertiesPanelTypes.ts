/**
 * 🎯 UNIFIED PROPERTIES PANEL TYPES
 * 
 * Consolidated type definitions for the Properties Panel system.
 * This file serves as the single source of truth for all Properties Panel related types.
 * 
 * PHASE 1: Consolidating interfaces across the codebase
 */

import type { Block, BlockType } from '@/types/editor';
import type { EditorState } from '@/types/editorTypes';

// ============================================================================
// PROPERTIES PANEL PROPS
// ============================================================================

/**
 * Canonical Props interface for the Properties Panel component
 * Use this for all Properties Panel implementations
 */
export interface PropertiesPanelProps {
  /** The ID of the currently selected block, or null if none */
  blockId: string | null;
  /** Optional: Current step index in the funnel */
  stepIndex?: number;
  /** Optional: Callback when the panel should be closed */
  onClose?: () => void;
  /** Optional: Callback when a block property is updated */
  onUpdate?: (updates: Record<string, any>) => void;
  /** Optional: Callback when a block should be deleted */
  onDelete?: () => void;
  /** Optional: Callback when a block should be duplicated */
  onDuplicate?: () => void;
}

/**
 * Extended props for the Modern Properties Panel
 * Includes the resolved block object
 */
export interface ModernPropertiesPanelProps extends Omit<PropertiesPanelProps, 'blockId'> {
  /** The selected block object, or null/undefined if none */
  selectedBlock?: Block | null;
}

// ============================================================================
// EDITOR CONTEXT TYPES
// ============================================================================

/**
 * Unified EditorActions interface
 * Combines all action methods expected by components
 */
export interface EditorActions {
  // Core block operations
  addBlock: (type: BlockType) => Promise<string>;
  updateBlock: (id: string, content: any) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  
  // Reordering
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  
  // Selection
  selectBlock: (id: string | null) => void;
  setSelectedBlockId: (id: string | null) => void;
  
  // Preview
  togglePreview: (preview?: boolean) => void;
  
  // Persistence
  save: () => Promise<void>;
  
  // Navigation
  setCurrentStep: (step: number) => void;
  ensureStepLoaded: (step: number) => Promise<void>;
}

/**
 * Unified EditorContextType interface
 * Single interface for all editor context consumers
 */
export interface EditorContextType {
  /** Current editor state */
  state: EditorState;
  /** Editor actions object */
  actions: EditorActions;
  /** Current step index (1-indexed) */
  currentStep: number;
  /** Currently selected block */
  selectedBlock: Block | null;
  /** ID of the currently selected block */
  selectedBlockId: string | null;
  /** Current funnel ID */
  funnelId: string;
  /** Whether preview mode is active */
  isPreviewing: boolean;
  /** Whether the editor is loading */
  isLoading?: boolean;
}

// ============================================================================
// PROPERTY FIELD TYPES
// ============================================================================

/**
 * Base interface for all property field types
 * Replaces the PropertyField namespace pattern
 */
export interface PropertyFieldBase {
  key: string;
  label: string;
  type: PropertyFieldType;
  value?: any;
  defaultValue?: any;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  category?: string;
}

/**
 * Property field types enum
 */
export type PropertyFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'boolean'
  | 'switch'
  | 'select'
  | 'color'
  | 'array'
  | 'object'
  | 'url'
  | 'image'
  | 'video'
  | 'interpolated-text'
  | 'rich-text'
  | 'json';

/**
 * Text property field
 */
export interface PropertyFieldText extends PropertyFieldBase {
  type: 'text' | 'textarea' | 'interpolated-text';
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  multiline?: boolean;
  availableVariables?: string[];
}

/**
 * Number property field
 */
export interface PropertyFieldNumber extends PropertyFieldBase {
  type: 'number' | 'range';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

/**
 * Boolean property field
 */
export interface PropertyFieldBoolean extends PropertyFieldBase {
  type: 'boolean' | 'switch';
}

/**
 * Select property field
 */
export interface PropertyFieldSelect extends PropertyFieldBase {
  type: 'select';
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  multiple?: boolean;
}

/**
 * Color property field
 */
export interface PropertyFieldColor extends PropertyFieldBase {
  type: 'color';
  format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
  showAlpha?: boolean;
}

/**
 * Array property field
 */
export interface PropertyFieldArray extends PropertyFieldBase {
  type: 'array';
  itemSchema?: PropertyFieldBase[];
  minItems?: number;
  maxItems?: number;
}

/**
 * Union type for all property fields
 */
export type PropertyField =
  | PropertyFieldText
  | PropertyFieldNumber
  | PropertyFieldBoolean
  | PropertyFieldSelect
  | PropertyFieldColor
  | PropertyFieldArray;

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type guard to check if a value is a PropertyField
 */
export function isPropertyField(value: any): value is PropertyField {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.key === 'string' &&
    typeof value.label === 'string' &&
    typeof value.type === 'string'
  );
}

/**
 * Extracts property updates from a partial block update
 */
export type PropertyUpdates = Partial<Record<string, any>>;

// ============================================================================
// EDITOR ADAPTER TYPES
// ============================================================================

/**
 * Universal editor adapter interface
 * Provides a consistent API regardless of underlying context implementation
 */
export interface EditorAdapter {
  currentStep: number;
  selectedBlockId: string | null;
  selectedBlock: Block | null;
  blocks: Block[];
  isPreviewing: boolean;
  isLoading: boolean;
  
  actions: {
    addBlock: (type: BlockType) => Promise<string>;
    updateBlock: (id: string, content: any) => Promise<void>;
    deleteBlock: (id: string) => Promise<void>;
    removeBlock: (id: string) => Promise<void>; // Alias for deleteBlock
    reorderBlocks: (startIndex: number, endIndex: number) => void;
    selectBlock: (id: string | null) => void;
    setSelectedBlockId: (id: string | null) => void;
    togglePreview: (preview?: boolean) => void;
    save: () => Promise<void>;
    setCurrentStep: (step: number) => void;
  };
}
