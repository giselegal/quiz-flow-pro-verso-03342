// Main components
export { PropertiesPanel } from './PropertiesPanel';
export { default as PropertiesPanelDefault } from './PropertiesPanel';

// Property editors
export { HeaderPropertyEditor } from './editors/HeaderPropertyEditor';

// UI components
export { PropertyInput } from './components/PropertyInput';
export { PropertyTextarea } from './components/PropertyTextarea';
export { PropertySelect } from './components/PropertySelect';
export { PropertyCheckbox } from './components/PropertyCheckbox';

// Configuration and registry
export { PROPERTY_EDITOR_REGISTRY, getBlockEditorConfig, getBlockTypesByPriority, getBlockTypesByCategory } from './PropertyEditorRegistry';

// Types and interfaces
export type { 
  PropertyEditorProps, 
  PropertyConfig, 
  BlockEditorConfig, 
  PropertyEditorRegistry,
  PropertyInputProps 
} from './interfaces/PropertyEditor';
