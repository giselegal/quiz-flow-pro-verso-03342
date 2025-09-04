/**
 * 🔍 NOCODE Property Discovery System
 * 
 * Automatically discovers and categorizes all properties from backend/code configurations
 * to ensure the NOCODE panel displays ALL available settings.
 */

import { PropertyType, PropertyCategory } from '@/hooks/useUnifiedProperties';

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
 * Extracts properties generation logic from useUnifiedProperties
 * This allows us to reuse the same logic without calling the hook
 */
interface BlockConfig {
  [key: string]: any; // Replace with more specific properties if known
}

function getPropertiesForComponentType(blockType: string, currentBlock: BlockConfig): DiscoveredProperty[] {
  console.log('🔧 getPropertiesForComponentType called with:', { blockType, currentBlock: !!currentBlock });
  
  // This is adapted from the useUnifiedProperties hook logic
  const createProperty = (
    key: string,
    value: any,
    type: PropertyType,
    label: string,
    category: PropertyCategory,
    options?: any
  ) => ({
    key,
    value,
    type,
    label,
    category,
    defaultValue: value,
    description: options?.description,
    placeholder: options?.placeholder,
    required: options?.required,
    min: options?.min,
    max: options?.max,
    step: options?.step,
    unit: options?.unit,
    options: options?.options,
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
        createProperty('showLogo', currentBlock?.properties?.showLogo ?? true, PropertyType.SWITCH, 'Mostrar Logo', PropertyCategory.CONTENT),
        createProperty('logoUrl', currentBlock?.properties?.logoUrl || 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp', PropertyType.URL, 'URL do Logo', PropertyCategory.CONTENT),
        createProperty('logoAlt', currentBlock?.properties?.logoAlt || 'Logo', PropertyType.TEXT, 'Texto Alternativo do Logo', PropertyCategory.ACCESSIBILITY),
        createProperty('enableProgressBar', currentBlock?.properties?.enableProgressBar ?? false, PropertyType.SWITCH, 'Mostrar Barra de Progresso', PropertyCategory.BEHAVIOR),
        createProperty('progressValue', currentBlock?.properties?.progressValue || 0, PropertyType.RANGE, 'Porcentagem do Progresso', PropertyCategory.BEHAVIOR, { min: 0, max: 100, step: 1, unit: '%' }),
        createProperty('textColor', currentBlock?.properties?.textColor || BRAND_COLORS.text, PropertyType.COLOR, 'Cor do Texto', PropertyCategory.STYLE),
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
      console.log('✅ getPropertiesForComponentType: Found button-inline case for:', blockType);
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
        defaultValue: prop.defaultValue || prop.value,
        options: prop.options,
        constraints: {
          min: prop.min,
          max: prop.max,
          step: prop.step,
          required: prop.required,
        },
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
  const component = MODULAR_COMPONENTS.find(c => c.type === componentType);

  console.log('🎯 PropertyDiscovery: resultado da busca no MODULAR_COMPONENTS:', {
    componentType,
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