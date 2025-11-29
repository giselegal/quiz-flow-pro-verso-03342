/**
 * 🎯 CANONICAL PROPERTIES PANEL EXPORTS
 * 
 * SinglePropertiesPanel is the OFFICIAL and CANONICAL implementation.
 * All legacy panels are deprecated and should be migrated to SinglePropertiesPanel.
 * 
 * @see SinglePropertiesPanel.tsx for implementation details
 */

// ✅ CANONICAL: Main component - use this for all new implementations
export { SinglePropertiesPanel } from './SinglePropertiesPanel';
export { SinglePropertiesPanel as PropertiesPanel } from './SinglePropertiesPanel';
export type { SinglePropertiesPanelProps } from './SinglePropertiesPanel';

/**
 * Legacy aliases for backwards compatibility.
 * All of these re-export SinglePropertiesPanel.
 * 
 * @deprecated Use SinglePropertiesPanel instead
 */

/** @deprecated Use SinglePropertiesPanel instead */
export { SinglePropertiesPanel as EnhancedPropertiesPanel } from './SinglePropertiesPanel';

/** @deprecated Use SinglePropertiesPanel instead */
export { SinglePropertiesPanel as ModernPropertiesPanel } from './SinglePropertiesPanel';

/** @deprecated Use SinglePropertiesPanel instead */
export { SinglePropertiesPanel as DynamicPropertiesPanel } from './SinglePropertiesPanel';

/** @deprecated Use SinglePropertiesPanel instead */
export { SinglePropertiesPanel as OptimizedPropertiesPanel } from './SinglePropertiesPanel';

/** @deprecated Use SinglePropertiesPanel instead */
export { SinglePropertiesPanel as UltraUnifiedPropertiesPanel } from './SinglePropertiesPanel';

// Property editors
// Removido re-export estático de HeaderPropertyEditor para evitar import misto

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
