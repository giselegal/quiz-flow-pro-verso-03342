/**
 * 🔍 NOCODE Property Discovery System
 * 
 * Automatically discovers and categorizes all properties from backend/code configurations
 * to ensure the NOCODE panel displays ALL available settings.
 */

import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';
import { mapComponentType } from './ComponentTypeMapping';
import { MODULAR_COMPONENTS } from '@/config/modularComponents';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { blockPropertySchemas } from '@/config/blockPropertySchemas';
import type { Block } from '@/types/editor';

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
 * Extracts real properties from quiz template blocks
 */
function extractPropertiesFromBlock(block: Block): DiscoveredProperty[] {
  const properties: DiscoveredProperty[] = [];

  // Extract properties from block.properties with REAL current values
  if (block.properties) {
    Object.entries(block.properties).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const type = inferPropertyType({ default: value });
        const category = categorizeProperty(key, type);

        properties.push({
          key,
          type,
          category,
          label: createLabel(key),
          description: `Propriedade real do bloco ${block.type}`,
          defaultValue: value, // Use REAL current value, not generic default
          isEditable: true,
          isAdvanced: category === PropertyCategory.ADVANCED,
        });
      }
    });
  }

  // Extract properties from block.content with REAL current values
  if (block.content) {
    Object.entries(block.content).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'children') {
        const type = inferPropertyType({ default: value });
        const category = categorizeProperty(key, type);

        properties.push({
          key: `content.${key}`,
          type,
          category,
          label: createLabel(`Content ${key}`),
          description: `Conteúdo real do bloco ${block.type}`,
          defaultValue: value, // Use REAL current value
          isEditable: true,
          isAdvanced: false,
        });
      }
    });
  }

  return properties;
}

/**
 * Discovers properties from quiz template steps
 */
function discoverQuizStepProperties(stepKey: string): ComponentPropertySchema | null {
  const stepBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey];

  if (!stepBlocks || stepBlocks.length === 0) {
    console.log(`⚠️ PropertyDiscovery: Nenhum bloco encontrado para ${stepKey}`);
    return null;
  }

  console.log(`🎯 PropertyDiscovery: Analisando ${stepKey} com ${stepBlocks.length} blocos`);

  const allProperties: DiscoveredProperty[] = [];
  const categories = new Set<PropertyCategory>();

  // Extract properties from all blocks in the step
  stepBlocks.forEach((block, index) => {
    console.log(`  📦 Bloco ${index + 1}: ${block.type} (ID: ${block.id})`);

    const blockProperties = extractPropertiesFromBlock(block);
    blockProperties.forEach(prop => {
      // Prefix property keys with block ID to avoid conflicts
      const prefixedProperty: DiscoveredProperty = {
        ...prop,
        key: `${block.id}.${prop.key}`,
        label: `${block.type} - ${prop.label}`,
        description: `${prop.description} (Bloco: ${block.id})`
      };

      allProperties.push(prefixedProperty);
      categories.add(prop.category);
    });
  });

  // Generate user-friendly name for the step
  const componentName = generateQuizStepName(stepKey);

  console.log(`✅ PropertyDiscovery: ${stepKey} descobriu ${allProperties.length} propriedades em ${categories.size} categorias`);

  return {
    componentType: stepKey,
    componentName,
    properties: allProperties,
    categories
  };
}

/**
 * Generates user-friendly names for quiz steps
 */
function generateQuizStepName(stepKey: string): string {
  const stepTitles: Record<string, string> = {
    'step-1': 'Quiz Etapa 1: Coleta do Nome',
    'step-2': 'Quiz Etapa 2: Tipo de Roupa Favorita',
    'step-3': 'Quiz Etapa 3: Personalidade',
    'step-4': 'Quiz Etapa 4: Visual de Identificação',
    'step-5': 'Quiz Etapa 5: Detalhes Preferidos',
    'step-6': 'Quiz Etapa 6: Estampas Favoritas',
    'step-7': 'Quiz Etapa 7: Casaco Favorito',
    'step-8': 'Quiz Etapa 8: Sapatos Favoritos',
    'step-9': 'Quiz Etapa 9: Cores Preferidas',
    'step-10': 'Quiz Etapa 10: Acessórios',
    'step-11': 'Quiz Etapa 11: Ocasião de Uso',
    'step-12': 'Quiz Etapa 12: Transição Estratégica',
    'step-13': 'Quiz Etapa 13: Orçamento',
    'step-14': 'Quiz Etapa 14: Frequência de Compras',
    'step-15': 'Quiz Etapa 15: Influências',
    'step-16': 'Quiz Etapa 16: Desafios de Estilo',
    'step-17': 'Quiz Etapa 17: Objetivo de Imagem',
    'step-18': 'Quiz Etapa 18: Confiança no Estilo',
    'step-19': 'Quiz Etapa 19: Transição para Resultado',
    'step-20': 'Quiz Etapa 20: Página de Resultado',
    'step-21': 'Quiz Etapa 21: Página de Oferta',
  };

  return stepTitles[stepKey] || `Quiz ${stepKey.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
}

/**
 * Discovers all quiz step properties for global discovery
 */
function discoverAllQuizStepProperties(): Map<string, ComponentPropertySchema> {
  const discovered = new Map<string, ComponentPropertySchema>();

  // Discover properties for all quiz steps
  Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(stepKey => {
    const schema = discoverQuizStepProperties(stepKey);
    if (schema) {
      discovered.set(stepKey, schema);
    }
  });

  console.log(`🎯 PropertyDiscovery: Descobriu ${discovered.size} etapas do quiz com propriedades`);

  return discovered;
}

/**
 * Extracts properties generation logic from useUnifiedProperties
 * This allows us to reuse the same logic without calling the hook
 */
interface BlockConfig {
  id?: string;
  type?: string;
  properties?: any;
  content?: any;
  [key: string]: any; // Replace with more specific properties if known
}

// Helper functions
const createProperty = (
  key: string,
  value: any,
  type: PropertyType,
  label: string,
  category: PropertyCategory,
  options?: any
): DiscoveredProperty => ({
  key,
  type,
  label,
  category,
  defaultValue: value,
  description: options?.description,
  options: options?.options,
  constraints: {
    min: options?.min,
    max: options?.max,
    step: options?.step,
    required: options?.required,
  },
  isEditable: true, // All properties are editable by default
  isAdvanced: options?.isAdvanced || false,
});

const BRAND_COLORS = {
  primary: '#B89B7A',
  secondary: '#D4C2A8',
  accent: '#F3E8D3',
  text: '#432818',
  textPrimary: '#2c1810',
  textSecondary: '#8F7A6A',
};

// Mapping functions
function mapFieldTypeToPropertyType(fieldType: any): PropertyType {
  switch (fieldType) {
    case 'text': return PropertyType.TEXT;
    case 'textarea': return PropertyType.TEXTAREA;
    case 'number': return PropertyType.NUMBER;
    case 'range': return PropertyType.RANGE;
    case 'boolean': return PropertyType.SWITCH;
    case 'color': return PropertyType.COLOR;
    case 'select': return PropertyType.SELECT;
    case 'options-list': return PropertyType.SELECT;
    default: return PropertyType.TEXT;
  }
}

function mapGroupToCategory(group?: string): PropertyCategory {
  switch (group) {
    case 'content': return PropertyCategory.CONTENT;
    case 'style': return PropertyCategory.STYLE;
    case 'layout': return PropertyCategory.LAYOUT;
    case 'behavior': return PropertyCategory.BEHAVIOR;
    case 'transform': return PropertyCategory.ADVANCED;
    default: return PropertyCategory.CONTENT;
  }
}

export function getPropertiesForComponentType(blockType: string, currentBlock: BlockConfig): DiscoveredProperty[] {
  console.log('🔧 getPropertiesForComponentType called with:', { blockType, currentBlock: !!currentBlock });

  // PRIORIDADE 1: Se temos um bloco atual com dados reais, extrair deles
  if (currentBlock && (currentBlock.properties || currentBlock.content)) {
    console.log('🎯 Using REAL data from current block:', currentBlock);
    const realProperties = extractPropertiesFromBlock(currentBlock as any);

    if (realProperties.length > 0) {
      console.log('✅ Found REAL properties from current block:', realProperties.length);
      return [...getUniversalPropertiesForBlock(currentBlock), ...realProperties];
    }
  }

  // PRIORIDADE 2: Usar schemas específicos do blockPropertySchemas
  if (blockPropertySchemas[blockType]) {
    console.log('✅ Using blockPropertySchemas for:', blockType);
    const schema = blockPropertySchemas[blockType];
    const schemaProperties = schema.fields.map(field => createProperty(
      field.key,
      currentBlock?.properties?.[field.key] || currentBlock?.content?.[field.key] || field.defaultValue,
      mapFieldTypeToPropertyType(field.type),
      field.label,
      mapGroupToCategory(field.group),
      {
        description: field.description,
        options: field.options,
        min: field.min,
        max: field.max,
        step: field.step,
        required: field.required,
      }
    ));

    return [...getUniversalPropertiesForBlock(currentBlock), ...schemaProperties];
  }

  // PRIORIDADE 3: Fallback para definições hardcoded por tipo
  return getHardcodedPropertiesForType(blockType, currentBlock);
}

// Função auxiliar para propriedades universais que considera o bloco atual
function getUniversalPropertiesForBlock(currentBlock?: BlockConfig) {
  return [
    createProperty('marginTop', currentBlock?.properties?.marginTop || 0, PropertyType.RANGE, 'Margem Superior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('marginBottom', currentBlock?.properties?.marginBottom || 0, PropertyType.RANGE, 'Margem Inferior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('paddingTop', currentBlock?.properties?.paddingTop || 0, PropertyType.RANGE, 'Padding Superior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('paddingBottom', currentBlock?.properties?.paddingBottom || 0, PropertyType.RANGE, 'Padding Inferior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('backgroundColor', currentBlock?.properties?.backgroundColor || 'transparent', PropertyType.COLOR, 'Cor de Fundo', PropertyCategory.STYLE),
  ];
}

// Função para definições hardcoded por tipo (como fallback)
function getHardcodedPropertiesForType(blockType: string, currentBlock?: BlockConfig): DiscoveredProperty[] {

  // This is adapted from the useUnifiedProperties hook logic
  const createProperty = (
    key: string,
    value: any,
    type: PropertyType,
    label: string,
    category: PropertyCategory,
    options?: any
  ): DiscoveredProperty => ({
    key,
    type,
    label,
    category,
    defaultValue: value,
    description: options?.description,
    options: options?.options,
    constraints: {
      min: options?.min,
      max: options?.max,
      step: options?.step,
      required: options?.required,
    },
    isEditable: true, // All properties are editable by default
    isAdvanced: options?.isAdvanced || false,
  });

  const BRAND_COLORS = {
    primary: '#B89B7A',
    secondary: '#D4C2A8',
    accent: '#F3E8D3',
    text: '#432818',
    textPrimary: '#2c1810',
    textSecondary: '#8F7A6A',
  };

  // Universal properties that apply to all components
  const getUniversalProperties = () => [
    createProperty('marginTop', 0, PropertyType.RANGE, 'Margem Superior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('marginBottom', 0, PropertyType.RANGE, 'Margem Inferior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('paddingTop', 0, PropertyType.RANGE, 'Padding Superior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('paddingBottom', 0, PropertyType.RANGE, 'Padding Inferior', PropertyCategory.LAYOUT, {
      min: 0, max: 100, step: 2, unit: 'px'
    }),
    createProperty('backgroundColor', 'transparent', PropertyType.COLOR, 'Cor de Fundo', PropertyCategory.STYLE),
  ];

  // Component-specific properties based on type
  console.log('🎯 getPropertiesForComponentType: Checking switch case for:', blockType);
  switch (blockType) {
    case 'header':
    case 'quiz-intro-header':
    case 'quiz-result-header':
    case 'unified-header':
      console.log('✅ getPropertiesForComponentType: Found header case for:', blockType);
      return [
        ...getUniversalProperties(),
        // === CONTENT PROPERTIES ===
        createProperty('showLogo', currentBlock?.properties?.showLogo ?? true, PropertyType.SWITCH, 'Mostrar Logo', PropertyCategory.CONTENT),
        createProperty('logoUrl', currentBlock?.properties?.logoUrl || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp', PropertyType.URL, 'URL do Logo', PropertyCategory.CONTENT),
        createProperty('logoAlt', currentBlock?.properties?.logoAlt || 'Logo', PropertyType.TEXT, 'Texto Alternativo do Logo', PropertyCategory.ACCESSIBILITY),
        createProperty('title', currentBlock?.properties?.title || '', PropertyType.TEXT, 'Título do Cabeçalho', PropertyCategory.CONTENT),
        createProperty('subtitle', currentBlock?.properties?.subtitle || '', PropertyType.TEXT, 'Subtítulo', PropertyCategory.CONTENT),

        // === LAYOUT PROPERTIES ===
        createProperty('logoWidth', currentBlock?.properties?.logoWidth || 120, PropertyType.RANGE, 'Largura do Logo', PropertyCategory.LAYOUT, { min: 50, max: 300, step: 10, unit: 'px' }),
        createProperty('logoHeight', currentBlock?.properties?.logoHeight || 40, PropertyType.RANGE, 'Altura do Logo', PropertyCategory.LAYOUT, { min: 20, max: 150, step: 5, unit: 'px' }),
        createProperty('containerWidth', currentBlock?.properties?.containerWidth || '100%', PropertyType.SELECT, 'Largura do Container', PropertyCategory.LAYOUT, {
          options: [
            { value: '100%', label: 'Largura Total' },
            { value: 'max-w-4xl', label: 'Container Médio' },
            { value: 'max-w-6xl', label: 'Container Grande' },
            { value: 'max-w-full', label: 'Sem Limite' }
          ]
        }),
        createProperty('alignment', currentBlock?.properties?.alignment || 'center', PropertyType.SELECT, 'Alinhamento', PropertyCategory.LAYOUT, {
          options: [
            { value: 'left', label: 'Esquerda' },
            { value: 'center', label: 'Centro' },
            { value: 'right', label: 'Direita' }
          ]
        }),
        createProperty('spacing', currentBlock?.properties?.spacing || 'normal', PropertyType.SELECT, 'Espaçamento Interno', PropertyCategory.LAYOUT, {
          options: [
            { value: 'compact', label: 'Compacto' },
            { value: 'normal', label: 'Normal' },
            { value: 'spacious', label: 'Espaçoso' }
          ]
        }),

        // === BEHAVIOR PROPERTIES ===
        createProperty('enableProgressBar', currentBlock?.properties?.enableProgressBar ?? false, PropertyType.SWITCH, 'Mostrar Barra de Progresso', PropertyCategory.BEHAVIOR),
        createProperty('progressValue', currentBlock?.properties?.progressValue || 0, PropertyType.RANGE, 'Porcentagem do Progresso', PropertyCategory.BEHAVIOR, { min: 0, max: 100, step: 1, unit: '%' }),
        createProperty('progressMax', currentBlock?.properties?.progressMax || 100, PropertyType.RANGE, 'Valor Máximo do Progresso', PropertyCategory.BEHAVIOR, { min: 1, max: 21, step: 1 }),
        createProperty('showBackButton', currentBlock?.properties?.showBackButton ?? false, PropertyType.SWITCH, 'Mostrar Botão Voltar', PropertyCategory.BEHAVIOR),

        // === STYLE PROPERTIES ===
        createProperty('textColor', currentBlock?.properties?.textColor || BRAND_COLORS.text, PropertyType.COLOR, 'Cor do Texto', PropertyCategory.STYLE),
        createProperty('progressBarColor', currentBlock?.properties?.progressBarColor || BRAND_COLORS.primary, PropertyType.COLOR, 'Cor da Barra de Progresso', PropertyCategory.STYLE),
        createProperty('progressBackgroundColor', currentBlock?.properties?.progressBackgroundColor || '#E5E7EB', PropertyType.COLOR, 'Cor de Fundo da Barra', PropertyCategory.STYLE),

        // === ADVANCED PROPERTIES ===
        createProperty('scale', currentBlock?.properties?.scale || 100, PropertyType.RANGE, 'Escala do Cabeçalho', PropertyCategory.ADVANCED, { min: 50, max: 200, step: 5, unit: '%' }),
        createProperty('scaleOrigin', currentBlock?.properties?.scaleOrigin || 'center', PropertyType.SELECT, 'Origem da Escala', PropertyCategory.ADVANCED, {
          options: [
            { value: 'center', label: 'Centro' },
            { value: 'top center', label: 'Topo Centro' },
            { value: 'bottom center', label: 'Base Centro' }
          ]
        }),
      ];

    case 'text-inline':
      console.log('✅ getPropertiesForComponentType: Found text-inline case for:', blockType);
      return [
        ...getUniversalProperties(),
        createProperty('content', currentBlock?.properties?.content ?? currentBlock?.content?.text ?? 'Digite seu texto aqui...', PropertyType.TEXTAREA, 'Conteúdo', PropertyCategory.CONTENT),
        createProperty('fontSize', currentBlock?.properties?.fontSize ?? 'medium', PropertyType.SELECT, 'Tamanho da Fonte', PropertyCategory.STYLE, {
          options: [
            { value: 'xs', label: 'XS' },
            { value: 'sm', label: 'SM' },
            { value: 'medium', label: 'Médio' },
            { value: 'lg', label: 'LG' },
            { value: 'xl', label: 'XL' },
            { value: '2xl', label: '2XL' },
          ]
        }),
        createProperty('fontWeight', currentBlock?.properties?.fontWeight ?? 'normal', PropertyType.SELECT, 'Peso da Fonte', PropertyCategory.STYLE, {
          options: [
            { value: 'light', label: 'Leve' },
            { value: 'normal', label: 'Normal' },
            { value: 'medium', label: 'Médio' },
            { value: 'semibold', label: 'Semi-negrito' },
            { value: 'bold', label: 'Negrito' },
          ]
        }),
        createProperty('textColor', currentBlock?.properties?.textColor ?? BRAND_COLORS.text, PropertyType.COLOR, 'Cor do Texto', PropertyCategory.STYLE),
        createProperty('alignment', currentBlock?.properties?.alignment ?? 'center', PropertyType.SELECT, 'Alinhamento', PropertyCategory.LAYOUT, {
          options: [
            { value: 'left', label: 'Esquerda' },
            { value: 'center', label: 'Centro' },
            { value: 'right', label: 'Direita' },
          ]
        }),
      ];

    case 'heading-inline':
      return [
        ...getUniversalProperties(),
        createProperty('content', currentBlock?.properties?.content ?? 'Seu título aqui', PropertyType.TEXT, 'Título', PropertyCategory.CONTENT),
        createProperty('level', currentBlock?.properties?.level ?? 'h2', PropertyType.SELECT, 'Nível do Título', PropertyCategory.CONTENT, {
          options: [
            { value: 'h1', label: 'H1 - Principal' },
            { value: 'h2', label: 'H2 - Seção' },
            { value: 'h3', label: 'H3 - Subseção' },
            { value: 'h4', label: 'H4 - Menor' },
          ]
        }),
        createProperty('fontSize', currentBlock?.properties?.fontSize ?? 'xl', PropertyType.SELECT, 'Tamanho da Fonte', PropertyCategory.STYLE, {
          options: [
            { value: 'lg', label: 'Grande' },
            { value: 'xl', label: 'Extra Grande' },
            { value: '2xl', label: '2X Grande' },
            { value: '3xl', label: '3X Grande' },
          ]
        }),
        createProperty('fontWeight', currentBlock?.properties?.fontWeight ?? 'bold', PropertyType.SELECT, 'Peso da Fonte', PropertyCategory.STYLE, {
          options: [
            { value: 'normal', label: 'Normal' },
            { value: 'medium', label: 'Médio' },
            { value: 'semibold', label: 'Semi-negrito' },
            { value: 'bold', label: 'Negrito' },
          ]
        }),
        createProperty('textColor', currentBlock?.properties?.textColor ?? BRAND_COLORS.text, PropertyType.COLOR, 'Cor do Texto', PropertyCategory.STYLE),
        createProperty('textAlign', currentBlock?.properties?.textAlign ?? 'center', PropertyType.SELECT, 'Alinhamento', PropertyCategory.LAYOUT, {
          options: [
            { value: 'left', label: 'Esquerda' },
            { value: 'center', label: 'Centro' },
            { value: 'right', label: 'Direita' },
          ]
        }),
      ];

    case 'button-inline':
      if (process.env.DEBUG) {
        console.log('✅ getPropertiesForComponentType: Found button-inline case for:', blockType);
      }
      return [
        ...getUniversalProperties(),
        createProperty('text', currentBlock?.properties?.text ?? 'Clique aqui', PropertyType.TEXT, 'Texto do Botão', PropertyCategory.CONTENT),
        createProperty('style', currentBlock?.properties?.style ?? 'primary', PropertyType.SELECT, 'Estilo do Botão', PropertyCategory.STYLE, {
          options: [
            { value: 'primary', label: 'Primário' },
            { value: 'secondary', label: 'Secundário' },
            { value: 'outline', label: 'Contorno' },
            { value: 'ghost', label: 'Fantasma' },
          ]
        }),
        createProperty('size', currentBlock?.properties?.size ?? 'medium', PropertyType.SELECT, 'Tamanho', PropertyCategory.LAYOUT, {
          options: [
            { value: 'small', label: 'Pequeno' },
            { value: 'medium', label: 'Médio' },
            { value: 'large', label: 'Grande' },
          ]
        }),
        createProperty('backgroundColor', currentBlock?.properties?.backgroundColor ?? BRAND_COLORS.primary, PropertyType.COLOR, 'Cor de Fundo', PropertyCategory.STYLE),
        createProperty('textColor', currentBlock?.properties?.textColor ?? '#FFFFFF', PropertyType.COLOR, 'Cor do Texto', PropertyCategory.STYLE),
        createProperty('fullWidth', currentBlock?.properties?.fullWidth ?? false, PropertyType.SWITCH, 'Largura Total', PropertyCategory.LAYOUT),
      ];

    case 'form-input':
      return [
        ...getUniversalProperties(),
        createProperty('label', currentBlock?.properties?.label ?? 'Campo', PropertyType.TEXT, 'Rótulo', PropertyCategory.CONTENT),
        createProperty('placeholder', currentBlock?.properties?.placeholder ?? 'Digite aqui...', PropertyType.TEXT, 'Placeholder', PropertyCategory.CONTENT),
        createProperty('required', currentBlock?.properties?.required ?? false, PropertyType.SWITCH, 'Campo Obrigatório', PropertyCategory.BEHAVIOR),
        createProperty('type', currentBlock?.properties?.type ?? 'text', PropertyType.SELECT, 'Tipo do Campo', PropertyCategory.BEHAVIOR, {
          options: [
            { value: 'text', label: 'Texto' },
            { value: 'email', label: 'Email' },
            { value: 'tel', label: 'Telefone' },
            { value: 'number', label: 'Número' },
          ]
        }),
        createProperty('borderColor', currentBlock?.properties?.borderColor ?? BRAND_COLORS.primary, PropertyType.COLOR, 'Cor da Borda', PropertyCategory.STYLE),
      ];

    case 'decorative-bar-inline':
      return [
        ...getUniversalProperties(),
        createProperty('height', currentBlock?.properties?.height ?? 4, PropertyType.RANGE, 'Altura', PropertyCategory.LAYOUT, { min: 1, max: 20, step: 1, unit: 'px' }),
        createProperty('color', currentBlock?.properties?.color ?? BRAND_COLORS.primary, PropertyType.COLOR, 'Cor', PropertyCategory.STYLE),
        createProperty('width', currentBlock?.properties?.width ?? '100%', PropertyType.SELECT, 'Largura', PropertyCategory.LAYOUT, {
          options: [
            { value: '25%', label: '25%' },
            { value: '50%', label: '50%' },
            { value: '75%', label: '75%' },
            { value: '100%', label: '100%' },
          ]
        }),
      ];

    case 'options-grid':
      console.log('✅ getPropertiesForComponentType: Found options-grid case, using full schema');
      // Use the complete schema from blockPropertySchemas for options-grid
      const optionsGridSchema = blockPropertySchemas['options-grid'];
      console.log('📋 optionsGridSchema:', optionsGridSchema);
      if (optionsGridSchema && optionsGridSchema.fields) {
        console.log('🔢 Total fields in schema:', optionsGridSchema.fields.length);
        const propertiesFromSchema: DiscoveredProperty[] = optionsGridSchema.fields.map(field => {
          // Map field types to PropertyType enum
          let propertyType: PropertyType;
          switch (field.type) {
            case 'boolean': propertyType = PropertyType.SWITCH; break;
            case 'color': propertyType = PropertyType.COLOR; break;
            case 'number': propertyType = PropertyType.NUMBER; break;
            case 'range': propertyType = PropertyType.RANGE; break;
            case 'select': propertyType = PropertyType.SELECT; break;
            case 'textarea': propertyType = PropertyType.TEXTAREA; break;
            case 'options-list': propertyType = PropertyType.ARRAY; break; // Map options-list to ARRAY
            case 'json': propertyType = PropertyType.JSON; break;
            default: propertyType = PropertyType.TEXT; break;
          }

          // Map field group to PropertyCategory
          let category: PropertyCategory;
          switch (field.group) {
            case 'content': category = PropertyCategory.CONTENT; break;
            case 'layout': category = PropertyCategory.LAYOUT; break;
            case 'images': category = PropertyCategory.STYLE; break;
            case 'behavior': category = PropertyCategory.BEHAVIOR; break;
            case 'style': category = PropertyCategory.STYLE; break;
            case 'scoring': category = PropertyCategory.ADVANCED; break;
            case 'rules': category = PropertyCategory.BEHAVIOR; break;
            case 'validation': category = PropertyCategory.BEHAVIOR; break;
            case 'advanced': category = PropertyCategory.ADVANCED; break;
            default: category = PropertyCategory.CONTENT; break;
          }

          return createProperty(
            field.key,
            currentBlock?.properties?.[field.key] ?? field.defaultValue,
            propertyType,
            field.label,
            category,
            {
              min: field.min,
              max: field.max,
              step: field.step,
              options: field.options,
              required: field.required,
              description: field.description
            }
          );
        });

        console.log('🎯 Options-grid properties loaded:', propertiesFromSchema.length, 'properties');
        console.log('📊 Sample properties:', propertiesFromSchema.slice(0, 5).map(p => p.key));
        const finalResult = [...getUniversalProperties(), ...propertiesFromSchema];
        console.log('🏁 Final result total:', finalResult.length, 'properties');
        return finalResult;
      }
      // Fallback if schema not found
      return [
        ...getUniversalProperties(),
        createProperty('title', currentBlock?.properties?.title ?? 'Escolha uma opção:', PropertyType.TEXT, 'Título/Questão', PropertyCategory.CONTENT),
        createProperty('columns', currentBlock?.properties?.columns ?? 2, PropertyType.RANGE, 'Número de Colunas', PropertyCategory.LAYOUT, { min: 1, max: 4, step: 1 }),
        createProperty('multipleSelection', currentBlock?.properties?.multipleSelection ?? false, PropertyType.SWITCH, 'Seleção Múltipla', PropertyCategory.BEHAVIOR),
      ];

    default:
      console.log('⚠️ getPropertiesForComponentType: Using default case for:', blockType);
      // For unknown component types, return universal properties
      return getUniversalProperties();
  }
}

/**
 * Discovers all properties from a component using useUnifiedProperties or fallback to modular components
 */
export function discoverComponentProperties(componentType: string): ComponentPropertySchema | null {
  console.log('🔍 PropertyDiscovery: buscando componente:', componentType);

  // Check if this is a quiz step (step-1, step-2, etc.)
  if (componentType.startsWith('step-') && QUIZ_STYLE_21_STEPS_TEMPLATE[componentType]) {
    console.log('🎯 PropertyDiscovery: Detectado como etapa do quiz:', componentType);
    return discoverQuizStepProperties(componentType);
  }

  // First, try to get properties from useUnifiedProperties hook (primary source for 21-step components)
  try {
    // Create a mock block to pass to the property generation function
    const mockBlock = { id: 'temp', type: componentType, properties: {}, content: {} };

    // Call our property generation function directly
    const unifiedPropsResult = getPropertiesForComponentType(componentType, mockBlock);

    console.log('🧪 PropertyDiscovery: resultado direto do getPropertiesForComponentType:', {
      componentType,
      hasResult: !!unifiedPropsResult,
      resultLength: unifiedPropsResult?.length || 0,
      resultType: Array.isArray(unifiedPropsResult) ? 'array' : typeof unifiedPropsResult
    });

    if (unifiedPropsResult && Array.isArray(unifiedPropsResult) && unifiedPropsResult.length > 0) {
      console.log('🎯 PropertyDiscovery: propriedades encontradas via useUnifiedProperties:', {
        componentType,
        totalProperties: unifiedPropsResult.length,
        firstFewProperties: unifiedPropsResult.slice(0, 3).map(p => ({
          key: p.key,
          type: p.type,
          category: p.category,
          label: p.label
        }))
      });

      const discoveredProperties: DiscoveredProperty[] = unifiedPropsResult.map(prop => ({
        key: prop.key,
        type: prop.type,
        category: prop.category as PropertyCategory,
        label: prop.label,
        description: prop.description,
        defaultValue: prop.defaultValue,
        options: prop.options,
        constraints: prop.constraints || {},
        isEditable: true,
        isAdvanced: prop.category === PropertyCategory.ADVANCED,
      }));

      const categories = new Set<PropertyCategory>();
      discoveredProperties.forEach(prop => categories.add(prop.category));

      // Generate a user-friendly component name
      const componentName = generateComponentName(componentType);

      console.log('✅ PropertyDiscovery: returning schema:', {
        componentType,
        componentName,
        propertiesCount: discoveredProperties.length,
        categoriesCount: categories.size
      });

      return {
        componentType,
        componentName,
        properties: discoveredProperties,
        categories
      };
    } else {
      console.log('⚠️ PropertyDiscovery: nenhuma propriedade retornada por getPropertiesForComponentType');
    }
  } catch (error) {
    console.log('⚠️ PropertyDiscovery: erro ao usar useUnifiedProperties:', error);
    console.error('Error details:', error);
  }

  // Fallback to MODULAR_COMPONENTS (for backwards compatibility)
  console.log('🔄 PropertyDiscovery: Tentando fallback para MODULAR_COMPONENTS...');

  // 🔗 Aplicar mapeamento de tipos para compatibilidade
  const mappedType = mapComponentType(componentType);
  console.log('🔗 Tipo mapeado:', componentType, '->', mappedType);

  const component = MODULAR_COMPONENTS.find(c => c.type === mappedType);

  console.log('🎯 PropertyDiscovery: resultado da busca no MODULAR_COMPONENTS:', {
    componentType,
    mappedType,
    encontrado: !!component,
    totalComponentes: MODULAR_COMPONENTS.length,
    tiposDisponiveis: MODULAR_COMPONENTS.slice(0, 5).map(c => c.type)
  });

  if (!component || !component.properties) {
    console.log('❌ PropertyDiscovery: componente não encontrado ou sem propriedades - retornando null');
    return null;
  }

  const discoveredProperties: DiscoveredProperty[] = [];
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

  // Add all quiz steps
  const quizStepSchemas = discoverAllQuizStepProperties();
  quizStepSchemas.forEach((schema, stepKey) => {
    discovered.set(stepKey, schema);
  });

  // Add modular components
  MODULAR_COMPONENTS.forEach(component => {
    const schema = discoverComponentProperties(component.type);
    if (schema) {
      discovered.set(component.type, schema);
    }
  });

  console.log(`🎯 PropertyDiscovery: Total discovered components: ${discovered.size} (${quizStepSchemas.size} quiz steps + ${MODULAR_COMPONENTS.length} modular components)`);

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

/**
 * Generates a user-friendly component name from the component type
 */
function generateComponentName(componentType: string): string {
  // Map common component types to user-friendly names
  const componentNames: Record<string, string> = {
    'quiz-intro-header': 'Cabeçalho do Quiz',
    'text-inline': 'Texto Simples',
    'heading-inline': 'Título',
    'button-inline': 'Botão',
    'form-input': 'Campo de Entrada',
    'decorative-bar-inline': 'Barra Decorativa',
    'quiz-question': 'Pergunta do Quiz',
    'quiz-result': 'Resultado do Quiz',
    'quiz-transition': 'Transição',
    'quiz-offer': 'Oferta',
    'quiz-loading': 'Carregamento',
    'quiz-strategic': 'Estratégico',
    'header': 'Cabeçalho',
    'footer': 'Rodapé',
  };

  if (componentNames[componentType]) {
    return componentNames[componentType];
  }

  // Generate from type name if not in map
  return componentType
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}