/**
 * 🔍 NOCODE Property Discovery System
 * 
 * Automatically discovers and categorizes all properties from backend/code configurations
 * to ensure the NOCODE panel displays ALL available settings.
 */

import { MODULAR_COMPONENTS } from '@/config/modularComponents';
import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';
import { mapComponentType } from './ComponentTypeMapping';

export interface DiscoveredProperty {
  key: string;
  type: PropertyType;
  category: PropertyCategory;
  label: string;
  description?: string;
  defaultValue: any;
  options?: Array<{ value: any; label: string }>;
  constraints?: {
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    required?: boolean;
  };
  isEditable: boolean;
  isAdvanced?: boolean;
}

export interface ComponentPropertySchema {
  componentType: string;
  componentName: string;
  properties: DiscoveredProperty[];
  categories: Set<PropertyCategory>;
}

/**
 * Infers property type from value and configuration
 */
function inferPropertyType(property: {
  type?: string;
  default?: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
  editable?: boolean;
  description?: string;
}): PropertyType {
  if (property.options && Array.isArray(property.options)) {
    return PropertyType.SELECT;
  }

  if (property.type === 'boolean') {
    return PropertyType.SWITCH;
  }

  if (property.type === 'number' || typeof property.default === 'number') {
    return property.min !== undefined || property.max !== undefined
      ? PropertyType.RANGE
      : PropertyType.NUMBER;
  }

  if (property.type === 'string' || typeof property.default === 'string') {
    const defaultValue = property.default || '';

    // Detect color values
    if (defaultValue.match(/^#[0-9A-Fa-f]{6}$/) ||
      defaultValue.match(/^rgb\(/) ||
      defaultValue.match(/^hsl\(/)) {
      return PropertyType.COLOR;
    }

    // Detect URLs
    if (defaultValue.startsWith('http') || defaultValue.includes('://')) {
      return PropertyType.URL;
    }

    // Detect CSS classes or long text
    if (defaultValue.length > 100) {
      return PropertyType.TEXTAREA;
    }

    return PropertyType.TEXT;
  }

  if (property.type === 'object' || typeof property.default === 'object') {
    return PropertyType.OBJECT;
  }

  if (property.type === 'array' || Array.isArray(property.default)) {
    return PropertyType.ARRAY;
  }

  return PropertyType.TEXT;
}

/**
 * Categorizes property based on its key and type
 */
function categorizeProperty(key: string, type: PropertyType): PropertyCategory {
  const keyLower = key.toLowerCase();

  // Content-related properties
  if (keyLower.includes('text') || keyLower.includes('title') ||
    keyLower.includes('content') || keyLower.includes('label') ||
    keyLower.includes('description') || keyLower.includes('placeholder')) {
    return PropertyCategory.CONTENT;
  }

  // Style-related properties
  if (keyLower.includes('color') || keyLower.includes('font') ||
    keyLower.includes('background') || keyLower.includes('border') ||
    keyLower.includes('shadow') || keyLower.includes('opacity') ||
    type === PropertyType.COLOR) {
    return PropertyCategory.STYLE;
  }

  // Layout-related properties
  if (keyLower.includes('width') || keyLower.includes('height') ||
    keyLower.includes('margin') || keyLower.includes('padding') ||
    keyLower.includes('position') || keyLower.includes('display') ||
    keyLower.includes('grid') || keyLower.includes('flex') ||
    keyLower.includes('columns') || keyLower.includes('layout')) {
    return PropertyCategory.LAYOUT;
  }

  // Behavior-related properties
  if (keyLower.includes('click') || keyLower.includes('hover') ||
    keyLower.includes('auto') || keyLower.includes('enable') ||
    keyLower.includes('disable') || keyLower.includes('toggle') ||
    keyLower.includes('validation') || keyLower.includes('required') ||
    type === PropertyType.SWITCH) {
    return PropertyCategory.BEHAVIOR;
  }

  // Animation properties
  if (keyLower.includes('animation') || keyLower.includes('transition') ||
    keyLower.includes('duration') || keyLower.includes('delay') ||
    keyLower.includes('ease')) {
    return PropertyCategory.ANIMATION;
  }

  // Accessibility properties
  if (keyLower.includes('aria') || keyLower.includes('alt') ||
    keyLower.includes('role') || keyLower.includes('tab') ||
    keyLower.includes('accessibility')) {
    return PropertyCategory.ACCESSIBILITY;
  }

  // SEO properties
  if (keyLower.includes('meta') || keyLower.includes('seo') ||
    keyLower.includes('canonical') || keyLower.includes('schema')) {
    return PropertyCategory.SEO;
  }

  // Default to advanced for unknown properties
  return PropertyCategory.ADVANCED;
}

/**
 * Creates user-friendly label from property key
 */
function createLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capitals
    .replace(/[-_]/g, ' ') // Replace dashes and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

/**
 * Discovers all properties from a modular component configuration
 */
export function discoverComponentProperties(componentType: string): ComponentPropertySchema | null {
  console.log('🔍 PropertyDiscovery: buscando componente:', componentType);

  // 🔗 Aplicar mapeamento de tipos
  const mappedType = mapComponentType(componentType);
  console.log('🔗 Tipo mapeado:', componentType, '->', mappedType);

  const component = MODULAR_COMPONENTS.find(c => c.type === mappedType);

  console.log('🎯 PropertyDiscovery: resultado da busca:', {
    componentType,
    mappedType,
    encontrado: !!component,
    totalComponentes: MODULAR_COMPONENTS.length,
    tiposDisponiveis: MODULAR_COMPONENTS.slice(0, 5).map(c => c.type)
  });

  if (!component || !component.properties) {
    console.log('❌ PropertyDiscovery: componente não encontrado ou sem propriedades');
    return null;
  } const discoveredProperties: DiscoveredProperty[] = [];
  const categories = new Set<PropertyCategory>();

  Object.entries(component.properties).forEach(([key, propertyConfig]: [string, any]) => {
    const type = inferPropertyType(propertyConfig);
    const category = categorizeProperty(key, type);

    categories.add(category);

    const property: DiscoveredProperty = {
      key,
      type,
      category,
      label: createLabel(key),
      description: propertyConfig.description,
      defaultValue: propertyConfig.default,
      isEditable: propertyConfig.editable !== false,
      isAdvanced: category === PropertyCategory.ADVANCED,
    };

    // Add options for select types
    if (propertyConfig.options) {
      property.options = propertyConfig.options.map((option: any) => ({
        value: option,
        label: typeof option === 'string' ? createLabel(option) : String(option)
      }));
    }

    // Add constraints for numeric types
    if (type === PropertyType.NUMBER || type === PropertyType.RANGE) {
      property.constraints = {
        min: propertyConfig.min,
        max: propertyConfig.max,
        step: propertyConfig.step || 1,
      };
    }

    discoveredProperties.push(property);
  });

  // Sort properties by category and then by label
  discoveredProperties.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.label.localeCompare(b.label);
  });

  return {
    componentType,
    componentName: component.name,
    properties: discoveredProperties,
    categories
  };
}

/**
 * Discovers all available component types and their properties
 */
export function discoverAllComponentProperties(): Map<string, ComponentPropertySchema> {
  const discovered = new Map<string, ComponentPropertySchema>();

  MODULAR_COMPONENTS.forEach(component => {
    const schema = discoverComponentProperties(component.type);
    if (schema) {
      discovered.set(component.type, schema);
    }
  });

  return discovered;
}

/**
 * Gets property schema for a specific component and property key
 */
export function getPropertySchema(componentType: string, propertyKey: string): DiscoveredProperty | null {
  const schema = discoverComponentProperties(componentType);
  if (!schema) return null;

  return schema.properties.find(p => p.key === propertyKey) || null;
}