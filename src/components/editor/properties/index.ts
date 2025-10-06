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
