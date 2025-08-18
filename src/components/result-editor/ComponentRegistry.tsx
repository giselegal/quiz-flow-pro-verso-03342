// @ts-nocheck

export const COMPONENT_CATEGORIES = [
  { id: 'text', name: 'Texto', icon: '📝' },
  { id: 'media', name: 'Mídia', icon: '🖼️' },
  { id: 'layout', name: 'Layout', icon: '📐' },
  { id: 'interactive', name: 'Interativo', icon: '🎮' },
];

export interface ComponentDefinition {
  id: string;
  name: string;
  label: string;
  icon: React.ComponentType<any>;
  category: string;
  component: React.ComponentType<any>;
  preview?: string;
  description?: string;
  isPremium?: boolean;
}

export interface ComponentRegistryItem {
  id: string;
  name: string;
  category: string;
  component: React.ComponentType<any>;
  preview?: string;
}

export const componentRegistry: ComponentRegistryItem[] = [
  // Registry básico para resolver erros
];

export const getAvailableComponents = (context?: any, filter?: any) => componentRegistry;
export const getComponentsByCategory = (category: string) =>
  componentRegistry.filter(c => c.category === category);

export default {
  COMPONENT_CATEGORIES,
  componentRegistry,
  getAvailableComponents,
  getComponentsByCategory,
};
