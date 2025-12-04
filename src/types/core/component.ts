/**
 * 🎯 CANONICAL COMPONENT TYPE DEFINITION
 * 
 * Tipos para definições de componentes e suas propriedades.
 * 
 * @canonical
 */

import type { LucideIcon } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import type { Block, BlockType, BlockComponentProps } from './block';
import type { PropertyType, PropertySchema } from './editor';

// =============================================================================
// COMPONENT CATEGORY
// =============================================================================

export type ComponentCategory =
  | 'basic'
  | 'layout'
  | 'quiz'
  | 'form'
  | 'content'
  | 'media'
  | 'navigation'
  | 'result'
  | 'offer'
  | 'utility'
  | 'custom';

// =============================================================================
// COMPONENT DEFINITION
// =============================================================================

export interface ComponentDefinition {
  /** Unique type identifier */
  type: BlockType;
  
  /** Display name */
  name: string;
  
  /** Short label */
  label: string;
  
  /** Description */
  description: string;
  
  /** Category for organization */
  category: ComponentCategory;
  
  /** Icon component */
  icon: LucideIcon;
  
  /** React component to render */
  component: ComponentType<BlockComponentProps>;
  
  /** Property definitions */
  properties: Record<string, PropertySchema>;
  
  /** Default property values */
  defaultProps: Record<string, unknown>;
  
  /** Default content values */
  defaultContent?: Record<string, unknown>;
  
  /** Tags for search */
  tags?: string[];
  
  /** Whether this component can have children */
  allowChildren?: boolean;
  
  /** Allowed child component types */
  allowedChildTypes?: BlockType[];
  
  /** Whether this is a container component */
  isContainer?: boolean;
  
  /** Whether this component is deprecated */
  deprecated?: boolean;
  
  /** Replacement component if deprecated */
  replacement?: BlockType;
}

// =============================================================================
// COMPONENT REGISTRY
// =============================================================================

export interface ComponentRegistry {
  /** All registered components */
  components: Map<BlockType, ComponentDefinition>;
  
  /** Register a component */
  register: (definition: ComponentDefinition) => void;
  
  /** Get a component by type */
  get: (type: BlockType) => ComponentDefinition | undefined;
  
  /** Check if a component exists */
  has: (type: BlockType) => boolean;
  
  /** Get all components */
  getAll: () => ComponentDefinition[];
  
  /** Get components by category */
  getByCategory: (category: ComponentCategory) => ComponentDefinition[];
  
  /** Search components */
  search: (query: string) => ComponentDefinition[];
}

// =============================================================================
// COMPONENT INSTANCE
// =============================================================================

export interface ComponentInstance {
  id: string;
  componentTypeId?: string;
  componentTypeKey: string;
  funnelId?: string;
  stageId?: string;
  stepNumber: number;
  orderIndex: number;
  position: number;
  config: Record<string, unknown>;
  properties: Record<string, unknown>;
  customStyling?: Record<string, unknown>;
  isActive: boolean;
  isLocked: boolean;
  isTemplate: boolean;
  instanceKey?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// COMPONENT PRESET
// =============================================================================

export interface ComponentPreset {
  id: string;
  componentTypeId: string;
  presetName: string;
  presetConfig: Record<string, unknown>;
  isDefault: boolean;
  createdAt: string;
  createdBy?: string;
}

// =============================================================================
// COMPONENT TYPE (Database)
// =============================================================================

export interface ComponentTypeRecord {
  id: string;
  typeKey: string;
  displayName: string;
  category: string;
  configSchema: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// =============================================================================
// COMPONENT PROPS INTERFACES
// =============================================================================

export interface BaseComponentProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export interface EditableComponentProps extends BaseComponentProps {
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Record<string, unknown>) => void;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  onHover?: () => void;
  disabled?: boolean;
}

// =============================================================================
// BLOCK RENDERER PROPS
// =============================================================================

export interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelect?: (blockId: string) => void;
  onUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
  onMoveUp?: (blockId: string) => void;
  onMoveDown?: (blockId: string) => void;
}

// =============================================================================
// STEP RENDERER PROPS
// =============================================================================

export interface StepRendererProps {
  step: {
    id: string;
    type: string;
    blocks: Block[];
  };
  stepIndex: number;
  isActive?: boolean;
  isEditing?: boolean;
  onBlockSelect?: (blockId: string) => void;
  onBlockUpdate?: (blockId: string, updates: Partial<Block>) => void;
  onBlockAdd?: (block: Block) => void;
  onBlockRemove?: (blockId: string) => void;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isComponentDefinition(value: unknown): value is ComponentDefinition {
  return (
    !!value &&
    typeof value === 'object' &&
    'type' in value &&
    'name' in value &&
    'component' in value
  );
}

export function isComponentInstance(value: unknown): value is ComponentInstance {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'componentTypeKey' in value
  );
}
