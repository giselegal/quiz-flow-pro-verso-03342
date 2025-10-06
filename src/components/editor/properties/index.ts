// Main components
export { default as PropertiesPanel } from './PropertiesPanel';

// Property editors
export { HeaderPropertyEditor } from './editors/HeaderPropertyEditor';

// UI components
export { PropertyCheckbox } from './components/PropertyCheckbox';
export { PropertyInput } from './components/PropertyInput';
export { PropertySelect } from './components/PropertySelect';
export { PropertyTextarea } from './components/PropertyTextarea';

// Configuration and registry
export {
  PROPERTY_EDITOR_REGISTRY,
  getBlockEditorConfig,
  getBlockTypesByCategory,
  getBlockTypesByPriority,
} from './PropertyEditorRegistry';

// Types and interfaces
export type {
  BlockEditorConfig,
  PropertyConfig,
  PropertyEditorProps,
  PropertyEditorRegistry,
  PropertyInputProps,
} from './interfaces/PropertyEditor';

// ============================================================
// 🆕 SISTEMA MODULAR DE PAINÉIS (FASE 2)
// ============================================================

// Registry
export { PropertiesPanelRegistry, createPanelDefinition } from './PropertiesPanelRegistry';
export type { PropertiesPanelProps, PropertiesPanelDefinition } from './PropertiesPanelRegistry';

// Painel Orquestrador
export { DynamicPropertiesPanel, default as DynamicPropertiesPanelDefault } from './DynamicPropertiesPanel';
export type { DynamicPropertiesPanelProps } from './DynamicPropertiesPanel';

// Painéis Modulares Individuais
export {
  QuestionPropertiesPanel,
  QuestionPropertiesPanelDefinition,
  StrategicQuestionPropertiesPanelDefinition
} from './QuestionPropertiesPanel';

export {
  ResultPropertiesPanel,
  ResultPropertiesPanelDefinition,
  TransitionResultPropertiesPanelDefinition
} from './ResultPropertiesPanel';

export {
  OfferPropertiesPanel,
  OfferPropertiesPanelDefinition
} from './OfferPropertiesPanel';

export {
  CommonPropertiesPanel,
  CommonPropertiesPanelDefinition,
  IntroPropertiesPanelDefinition,
  TransitionPropertiesPanelDefinition
} from './CommonPropertiesPanel';

