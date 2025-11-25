/**
 * 🎯 CANONICAL PROPERTIES PANEL EXPORTS
 * 
 * SinglePropertiesPanel is the OFFICIAL and CANONICAL implementation.
 * All legacy panels are deprecated and should be migrated to SinglePropertiesPanel.
 * 
 * @see SinglePropertiesPanel.tsx for implementation details
 */

// ✅ CANONICAL: Main component - use this for all new implementations
export { SinglePropertiesPanel, default as PropertiesPanel } from './SinglePropertiesPanel';
export type { SinglePropertiesPanelProps } from './SinglePropertiesPanel';

/**
 * @deprecated Use SinglePropertiesPanel instead
 * Legacy aliases for backwards compatibility
 */
export { SinglePropertiesPanel as EnhancedPropertiesPanel } from './SinglePropertiesPanel';
export { SinglePropertiesPanel as ModernPropertiesPanel } from './SinglePropertiesPanel';
export { SinglePropertiesPanel as DynamicPropertiesPanel } from './SinglePropertiesPanel';
export { SinglePropertiesPanel as OptimizedPropertiesPanel } from './SinglePropertiesPanel';
export { SinglePropertiesPanel as UltraUnifiedPropertiesPanel } from './SinglePropertiesPanel';

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
