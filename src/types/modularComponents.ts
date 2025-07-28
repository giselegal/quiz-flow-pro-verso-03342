/**
 * SISTEMA DE COMPONENTES MODULARES E EDITÁVEIS
 * Interface padrão para todos os componentes do funil
 */

import { ReactNode } from 'react';

// Interface base para propriedades de componentes modulares
export interface ModularComponentProps {
  id: string;
  type: string;
  properties: Record<string, any>;
  isSelected?: boolean;
  isEditing?: boolean;
  isPreview?: boolean;
  isDragging?: boolean;
  onSelect?: (id: string) => void;
  onPropertyChange?: (id: string, property: string, value: any) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  className?: string;
}

// Schema de propriedade editável
export interface EditableProperty {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color' | 'image' | 'array' | 'range';
  defaultValue: any;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  description?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  conditional?: {
    dependsOn: string;
    showWhen: any;
  };
  group?: string;
}

// Definição completa de componente modular
export interface ModularComponentDefinition {
  type: string;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'quiz' | 'result' | 'layout' | 'media';
  isInline?: boolean;
  isContainer?: boolean;
  allowedParents?: string[];
  allowedChildren?: string[];
  properties: EditableProperty[];
  defaultProperties: Record<string, any>;
  preview?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  };
  validation?: {
    required?: string[];
    custom?: (props: Record<string, any>) => string | null;
  };
}

// Context para editor de propriedades
export interface PropertyEditorContext {
  selectedComponent: string | null;
  editingProperty: string | null;
  validationErrors: Record<string, string[]>;
  isLoading: boolean;
  setSelectedComponent: (id: string | null) => void;
  setEditingProperty: (property: string | null) => void;
  updateProperty: (componentId: string, property: string, value: any) => void;
  validateComponent: (componentId: string) => boolean;
  getComponentDefinition: (type: string) => ModularComponentDefinition | null;
}

// Estado de um componente editável
export interface EditableComponentState {
  id: string;
  type: string;
  properties: Record<string, any>;
  errors: string[];
  isDirty: boolean;
  isValid: boolean;
  lastModified: Date;
}

// Interface para wrapper de componente editável
export interface EditableComponentWrapperProps {
  component: EditableComponentState;
  definition: ModularComponentDefinition;
  children: ReactNode;
  onEdit: (property: string) => void;
  onValidate: () => boolean;
  showEditingUI?: boolean;
}

export default ModularComponentProps;
