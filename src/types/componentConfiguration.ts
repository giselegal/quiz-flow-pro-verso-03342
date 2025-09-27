/**
 * 🎯 UNIFIED PROPERTY SCHEMA FOR API CONTROL
 * 
 * Definição unificada de todas as propriedades editáveis
 * que podem ser controladas via API no /editor
 */

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface ComponentPropertyDefinition {
  // Identificação
  key: string;
  label: string;
  description?: string;
  
  // Tipo e categoria
  type: PropertyType;
  category: PropertyCategory;
  
  // Configuração do editor
  editor: PropertyEditor;
  
  // Validação e valores
  validation?: PropertyValidation;
  defaultValue: any;
  
  // Dependências e condicionais
  dependencies?: string[];
  conditional?: {
    dependsOn: string;
    showWhen: any;
  };
  
  // Metadados para API
  apiConfig: {
    endpoint: string;
    syncRealTime: boolean;
    cacheable: boolean;
    versionable: boolean;
  };
}

export enum PropertyType {
  // Básicos
  TEXT = 'text',
  TEXTAREA = 'textarea', 
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  
  // Visuais
  COLOR = 'color',
  IMAGE_URL = 'image-url',
  FONT_FAMILY = 'font-family',
  
  // Layout
  SPACING = 'spacing',
  SIZE = 'size',
  POSITION = 'position',
  COLUMNS = 'columns',
  
  // Avançados
  JSON = 'json',
  ARRAY = 'array',
  RANGE = 'range',
  
  // Quiz específicos
  QUIZ_OPTIONS = 'quiz-options',
  STYLE_MAPPING = 'style-mapping',
  AUTO_ADVANCE = 'auto-advance',
}

export enum PropertyCategory {
  CONTENT = 'content',      // Textos, imagens, conteúdo
  LAYOUT = 'layout',        // Grid, colunas, espaçamento  
  VISUAL = 'visual',        // Cores, bordas, sombras
  BEHAVIOR = 'behavior',    // Auto-advance, validação
  ADVANCED = 'advanced',    // JSON, configurações técnicas
}

export interface PropertyEditor {
  component: string;        // Nome do componente editor
  props?: Record<string, any>; // Props específicas do editor
  preview?: boolean;        // Se tem preview em tempo real
  realTimeSync?: boolean;   // Sincronização em tempo real
}

// ============================================================================
// COMPONENT DEFINITIONS REGISTRY
// ============================================================================

export interface ComponentDefinition {
  // Identificação
  id: string;
  name: string;
  description: string;
  category: string;
  
  // Propriedades editáveis
  properties: ComponentPropertyDefinition[];
  
  // API Configuration
  apiEndpoint: string;
  defaultProperties: Record<string, any>;
  
  // Editor Integration
  editorConfig: {
    propertiesPanelTitle: string;
    previewComponent?: string;
    categories: PropertyCategory[];
  };
}

// ============================================================================
// QUIZ COMPONENTS DEFINITIONS
// ============================================================================

export const QUIZ_COMPONENTS_DEFINITIONS: Record<string, ComponentDefinition> = {
  'quiz-options-grid': {
    id: 'quiz-options-grid',
    name: 'Grid de Opções Quiz',
    description: 'Grid responsivo de opções com detecção automática',
    category: 'quiz',
    apiEndpoint: '/api/components/quiz-options-grid/configuration',
    
    properties: [
      // LAYOUT PROPERTIES
      {
        key: 'columns',
        label: 'Colunas',
        description: 'Número de colunas ou detecção automática',
        type: PropertyType.SELECT,
        category: PropertyCategory.LAYOUT,
        editor: {
          component: 'SelectEditor',
          props: {
            options: [
              { label: 'Auto (detecta imagens)', value: 'auto' },
              { label: '1 Coluna', value: 1 },
              { label: '2 Colunas', value: 2 },
              { label: '3 Colunas', value: 3 }
            ]
          }
        },
        defaultValue: 'auto',
        apiConfig: {
          endpoint: '/api/quiz-options-grid/columns',
          syncRealTime: true,
          cacheable: true,
          versionable: true
        }
      },
      {
        key: 'imageSize',
        label: 'Tamanho da Imagem',
        description: 'Tamanho das imagens em pixels',
        type: PropertyType.RANGE,
        category: PropertyCategory.LAYOUT,
        editor: {
          component: 'RangeEditor',
          props: { min: 100, max: 500, step: 8, unit: 'px' },
          preview: true,
          realTimeSync: true
        },
        validation: { min: 100, max: 500 },
        defaultValue: 256,
        apiConfig: {
          endpoint: '/api/quiz-options-grid/image-size',
          syncRealTime: true,
          cacheable: true,
          versionable: true
        }
      },
      {
        key: 'gridGap',
        label: 'Espaçamento Grid',
        description: 'Espaçamento entre os items do grid',
        type: PropertyType.RANGE,
        category: PropertyCategory.LAYOUT,
        editor: {
          component: 'RangeEditor',
          props: { min: 0, max: 32, step: 2, unit: 'px' },
          preview: true,
          realTimeSync: true
        },
        defaultValue: 8,
        apiConfig: {
          endpoint: '/api/quiz-options-grid/grid-gap',
          syncRealTime: true,
          cacheable: true,
          versionable: true
        }
      },
      
      // CONTENT PROPERTIES
      {
        key: 'question',
        label: 'Pergunta',
        description: 'Texto da pergunta principal',
        type: PropertyType.TEXT,
        category: PropertyCategory.CONTENT,
        editor: {
          component: 'TextEditor',
          props: { placeholder: 'Digite sua pergunta aqui' }
        },
        defaultValue: 'Qual opção você prefere?',
        apiConfig: {
          endpoint: '/api/quiz-options-grid/question',
          syncRealTime: false,
          cacheable: true,
          versionable: true
        }
      },
      {
        key: 'options',
        label: 'Opções do Quiz',
        description: 'Lista de opções com textos, imagens e pontuações',
        type: PropertyType.QUIZ_OPTIONS,
        category: PropertyCategory.CONTENT,
        editor: {
          component: 'QuizOptionsEditor',
          props: {
            allowImages: true,
            allowScoring: true,
            minOptions: 2,
            maxOptions: 8
          }
        },
        defaultValue: [],
        apiConfig: {
          endpoint: '/api/quiz-options-grid/options',
          syncRealTime: false,
          cacheable: true,
          versionable: true
        }
      },
      
      // VISUAL PROPERTIES
      {
        key: 'primaryColor',
        label: 'Cor Principal',
        description: 'Cor principal dos elementos',
        type: PropertyType.COLOR,
        category: PropertyCategory.VISUAL,
        editor: {
          component: 'ColorEditor',
          preview: true,
          realTimeSync: true
        },
        defaultValue: '#B89B7A',
        apiConfig: {
          endpoint: '/api/quiz-options-grid/primary-color',
          syncRealTime: true,
          cacheable: true,
          versionable: true
        }
      },
      {
        key: 'selectedColor',
        label: 'Cor Selecionado',
        description: 'Cor quando opção está selecionada',
        type: PropertyType.COLOR,
        category: PropertyCategory.VISUAL,
        editor: {
          component: 'ColorEditor',
          preview: true,
          realTimeSync: true
        },
        defaultValue: '#432818',
        apiConfig: {
          endpoint: '/api/quiz-options-grid/selected-color',
          syncRealTime: true,
          cacheable: true,
          versionable: true
        }
      },
      
      // BEHAVIOR PROPERTIES  
      {
        key: 'multipleSelection',
        label: 'Seleção Múltipla',
        description: 'Permitir seleção de múltiplas opções',
        type: PropertyType.BOOLEAN,
        category: PropertyCategory.BEHAVIOR,
        editor: {
          component: 'BooleanEditor'
        },
        defaultValue: false,
        apiConfig: {
          endpoint: '/api/quiz-options-grid/multiple-selection',
          syncRealTime: true,
          cacheable: true,
          versionable: false
        }
      },
      {
        key: 'autoAdvance',
        label: 'Avançar Automaticamente',
        description: 'Avançar para próxima etapa automaticamente',
        type: PropertyType.AUTO_ADVANCE,
        category: PropertyCategory.BEHAVIOR,
        editor: {
          component: 'AutoAdvanceEditor',
          props: {
            showDelayOption: true,
            delayRange: { min: 500, max: 5000 }
          }
        },
        defaultValue: { enabled: true, delay: 1500 },
        apiConfig: {
          endpoint: '/api/quiz-options-grid/auto-advance',
          syncRealTime: true,
          cacheable: true,
          versionable: false
        }
      }
    ],
    
    defaultProperties: {
      columns: 'auto',
      imageSize: 256,
      gridGap: 8,
      question: 'Qual opção você prefere?',
      options: [],
      primaryColor: '#B89B7A',
      selectedColor: '#432818',
      multipleSelection: false,
      autoAdvance: { enabled: true, delay: 1500 }
    },
    
    editorConfig: {
      propertiesPanelTitle: 'Configurações do Grid',
      previewComponent: 'QuizOptionsGridPreview',
      categories: [
        PropertyCategory.CONTENT,
        PropertyCategory.LAYOUT, 
        PropertyCategory.VISUAL,
        PropertyCategory.BEHAVIOR
      ]
    }
  },
  
  // Adicionar outros componentes...
  'quiz-intro-header': {
    id: 'quiz-intro-header',
    name: 'Cabeçalho do Quiz',
    description: 'Cabeçalho introdutório com logo e título',
    category: 'quiz',
    apiEndpoint: '/api/components/quiz-intro-header/configuration',
    properties: [
      {
        key: 'title',
        label: 'Título',
        type: PropertyType.TEXT,
        category: PropertyCategory.CONTENT,
        editor: { component: 'TextEditor' },
        defaultValue: 'Descubra Seu Estilo',
        apiConfig: {
          endpoint: '/api/quiz-intro-header/title',
          syncRealTime: false,
          cacheable: true,
          versionable: true
        }
      },
      {
        key: 'logo',
        label: 'Logo',
        type: PropertyType.IMAGE_URL,
        category: PropertyCategory.CONTENT,
        editor: { component: 'ImageUploadEditor' },
        defaultValue: '',
        apiConfig: {
          endpoint: '/api/quiz-intro-header/logo',
          syncRealTime: false,
          cacheable: true,
          versionable: true
        }
      }
    ],
    defaultProperties: {
      title: 'Descubra Seu Estilo',
      logo: ''
    },
    editorConfig: {
      propertiesPanelTitle: 'Configurações do Cabeçalho',
      categories: [PropertyCategory.CONTENT, PropertyCategory.VISUAL]
    }
  }
};

// ============================================================================
// API INTEGRATION TYPES
// ============================================================================

export interface ComponentConfigurationAPI {
  // GET /api/components/{componentId}/configuration
  getConfiguration(componentId: string, funnelId?: string): Promise<Record<string, any>>;
  
  // PUT /api/components/{componentId}/configuration  
  updateConfiguration(componentId: string, properties: Record<string, any>, funnelId?: string): Promise<void>;
  
  // POST /api/components/{componentId}/properties/{propertyKey}
  updateProperty(componentId: string, propertyKey: string, value: any, funnelId?: string): Promise<void>;
  
  // GET /api/components/{componentId}/definition
  getComponentDefinition(componentId: string): Promise<ComponentDefinition>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    property: string;
    message: string;
  }>;
}

export interface PropertyValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}