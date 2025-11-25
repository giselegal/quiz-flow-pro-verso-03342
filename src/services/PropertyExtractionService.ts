/**
 * 🎯 PROPERTY EXTRACTION SERVICE
 * 
 * Unified service for extracting, categorizing, and managing property fields
 * from block definitions. This replaces the PropertyField namespace pattern
 * with proper types and interfaces.
 * 
 * PHASE 4: Fix PropertyField namespace issues
 */

import type { Block } from '@/types/editor';
import { getPropertiesForComponentType } from '@/components/editor/properties/core/PropertyDiscovery';

// ============================================================================
// PROPERTY FIELD TYPES (replaces namespace)
// ============================================================================

/**
 * Property field type definitions
 */
export type PropertyFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'boolean'
  | 'switch'
  | 'select'
  | 'color'
  | 'array'
  | 'object'
  | 'url'
  | 'image'
  | 'video'
  | 'interpolated-text'
  | 'rich-text'
  | 'json';

/**
 * Property field interface - the canonical interface for all property fields
 */
export interface PropertyField {
  key: string;
  label: string;
  type: PropertyFieldType;
  value?: any;
  defaultValue?: any;
  description?: string;
  placeholder?: string;
  isRequired?: boolean;
  category?: string;
  
  // For number/range fields
  min?: number;
  max?: number;
  step?: number;
  
  // For select fields
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  
  // For interpolated-text fields
  availableVariables?: string[];
  
  // For array fields
  itemSchema?: PropertyField[];
  minItems?: number;
  maxItems?: number;
}

/**
 * Categorized properties structure
 */
export interface CategorizedProperties {
  [category: string]: PropertyField[];
}

// ============================================================================
// DYNAMIC VARIABLES
// ============================================================================

/**
 * Dynamic variable definition for interpolation
 */
export interface DynamicVariable {
  key: string;
  label: string;
  description: string;
  category: 'user' | 'quiz' | 'result' | 'system';
  example: string;
}

/**
 * Available variables for interpolation
 */
export const AVAILABLE_VARIABLES: DynamicVariable[] = [
  // User variables
  {
    key: 'userName',
    label: 'Nome do Usuário',
    description: 'Nome do usuário inserido no quiz',
    category: 'user',
    example: 'Maria',
  },
  {
    key: 'userEmail',
    label: 'Email do Usuário',
    description: 'Email do usuário (se coletado)',
    category: 'user',
    example: 'maria@email.com',
  },
  
  // Quiz variables
  {
    key: 'quizTitle',
    label: 'Título do Quiz',
    description: 'Título configurado para o quiz',
    category: 'quiz',
    example: 'Descubra Seu Estilo',
  },
  {
    key: 'currentStep',
    label: 'Etapa Atual',
    description: 'Número da etapa atual',
    category: 'quiz',
    example: '5',
  },
  {
    key: 'totalSteps',
    label: 'Total de Etapas',
    description: 'Número total de etapas',
    category: 'quiz',
    example: '21',
  },
  {
    key: 'progress',
    label: 'Progresso (%)',
    description: 'Porcentagem de progresso no quiz',
    category: 'quiz',
    example: '75%',
  },
  
  // Result variables
  {
    key: 'resultTitle',
    label: 'Título do Resultado',
    description: 'Título do resultado do quiz',
    category: 'result',
    example: 'Estilo Clássico',
  },
  {
    key: 'resultScore',
    label: 'Pontuação',
    description: 'Pontuação obtida no quiz',
    category: 'result',
    example: '85',
  },
  {
    key: 'resultDescription',
    label: 'Descrição do Resultado',
    description: 'Descrição do resultado',
    category: 'result',
    example: 'Você tem um estilo clássico e elegante!',
  },
  
  // System variables
  {
    key: 'currentDate',
    label: 'Data Atual',
    description: 'Data atual formatada',
    category: 'system',
    example: '15/11/2024',
  },
  {
    key: 'currentTime',
    label: 'Hora Atual',
    description: 'Hora atual formatada',
    category: 'system',
    example: '14:30',
  },
];

// ============================================================================
// PROPERTY EXTRACTION SERVICE
// ============================================================================

/**
 * Service for extracting and managing property fields from blocks
 */
class PropertyExtractionServiceClass {
  /**
   * Extract all editable properties from a block
   */
  extractAllProperties(block: Block): PropertyField[] {
    if (!block) return [];
    
    // Use the PropertyDiscovery system to get properties
    const discoveredProps = getPropertiesForComponentType(block.type, block);
    
    // Convert to PropertyField format
    return discoveredProps.map((prop: any) => ({
      key: prop.key,
      label: prop.label || prop.key,
      type: this.normalizeType(prop.type),
      value: this.getPropertyValue(block, prop.key),
      defaultValue: prop.defaultValue,
      description: prop.description,
      placeholder: prop.placeholder,
      isRequired: prop.required || prop.isRequired,
      category: prop.category || 'content',
      min: prop.min || prop.constraints?.min,
      max: prop.max || prop.constraints?.max,
      step: prop.step || prop.constraints?.step,
      options: prop.options,
    }));
  }
  
  /**
   * Identify fields that support interpolation (dynamic variables)
   */
  identifyInterpolationFields(properties: PropertyField[]): PropertyField[] {
    return properties.map(prop => {
      // Text and textarea fields can support interpolation
      if (prop.type === 'text' || prop.type === 'textarea') {
        const hasInterpolation = typeof prop.value === 'string' && 
          (prop.value.includes('{{') || prop.value.includes('{{')); 
        
        if (hasInterpolation || this.isLikelyInterpolatable(prop.key)) {
          return {
            ...prop,
            type: 'interpolated-text' as PropertyFieldType,
            availableVariables: AVAILABLE_VARIABLES.map(v => v.key),
          };
        }
      }
      return prop;
    });
  }
  
  /**
   * Categorize properties by their category field
   */
  categorizeProperties(properties: PropertyField[]): CategorizedProperties {
    const categories: CategorizedProperties = {};
    
    for (const prop of properties) {
      const category = prop.category || 'content';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(prop);
    }
    
    return categories;
  }
  
  /**
   * Normalize property type to our enum
   */
  private normalizeType(type: string): PropertyFieldType {
    const typeMap: Record<string, PropertyFieldType> = {
      'string': 'text',
      'text-input': 'text',
      'number-input': 'number',
      'boolean-switch': 'switch',
      'color-picker': 'color',
      'image-url': 'url',
      'video-url': 'url',
      'array-editor': 'array',
      'json-editor': 'json',
      'options-list': 'array',
    };
    
    return typeMap[type] || (type as PropertyFieldType) || 'text';
  }
  
  /**
   * Get property value from block
   */
  private getPropertyValue(block: Block, key: string): any {
    // Check in properties first
    if (block.properties && block.properties[key] !== undefined) {
      return block.properties[key];
    }
    
    // Check in content
    if (block.content && block.content[key] !== undefined) {
      return block.content[key];
    }
    
    // Check nested content path
    if (key.startsWith('content.') && block.content) {
      const contentKey = key.substring(8);
      return block.content[contentKey];
    }
    
    return undefined;
  }
  
  /**
   * Check if a field key is likely to support interpolation
   */
  private isLikelyInterpolatable(key: string): boolean {
    const interpolatableFields = [
      'title',
      'subtitle',
      'heading',
      'text',
      'content',
      'description',
      'message',
      'greeting',
      'label',
      'buttonText',
      'ctaText',
    ];
    
    return interpolatableFields.some(field => 
      key.toLowerCase().includes(field.toLowerCase())
    );
  }
}

// Export singleton instance
export const propertyExtractionService = new PropertyExtractionServiceClass();

// Default export
export default propertyExtractionService;
