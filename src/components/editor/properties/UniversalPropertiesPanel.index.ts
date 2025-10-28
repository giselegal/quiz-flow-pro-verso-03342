/**
 * 🎛️ UNIVERSAL PROPERTIES PANEL - EXPORTS
 * 
 * Painel de propriedades universal context-aware
 * Centraliza TODAS as configurações NoCode em um único lugar
 */

// Main component
export { UniversalPropertiesPanel, default } from './UniversalPropertiesPanel';

// Contexts
export { FunnelContext } from './contexts/FunnelContext';
export { StepContext } from './contexts/StepContext';
export { BlockContext } from './contexts/BlockContext';

// Components
export { CollapsibleSection, CollapsibleSectionWithHeader } from './components/CollapsibleSection';

// Types
export type { SelectionContextType } from './UniversalPropertiesPanel';
export type { CollapsibleSectionProps } from './components/CollapsibleSection';
