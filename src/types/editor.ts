export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  order: number; // Changed from optional to required to match EditorBlock
  settings?: Record<string, any>;
  [key: string]: any;
}

export type BlockType = 
  | 'header'
  | 'headline'  
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'title'
  | 'subtitle'
  | 'text'
  | 'benefits'
  | 'pricing'
  | 'testimonials'
  | 'guarantee'
  | 'cta'
  | 'style-result'
  | 'secondary-styles'
  | 'spacer'
  | 'video'
  | 'two-column'
  | 'quiz-question'
  | 'styleResult'
  | 'testimonial'
  | 'carousel'
  | 'bonus'
  | string;

// Add missing EditorBlock type which was imported across many files
export interface EditorBlock extends Block {
  id: string;
  type: BlockType;
  content: EditableContent;
  order: number;
  settings?: Record<string, any>;
}

// Add missing EditableContent type
export interface EditableContent {
  title?: string;
  subtitle?: string;
  text?: string;
  imageUrl?: string;
  imageAlt?: string;
  caption?: string;
  buttonText?: string;
  buttonUrl?: string;
  description?: string;
  items?: any[];
  
  // Header properties
  logo?: string;
  logoAlt?: string;
  logoWidth?: string | number;
  logoHeight?: string | number;
  
  // Benefits properties
  benefits?: string[];
  
  // Pricing properties
  price?: string;
  regularPrice?: string;
  ctaText?: string;
  ctaUrl?: string;
  
  // Testimonials properties
  testimonials?: Array<{
    id: string;
    name: string;
    text: string;
    image?: string;
  }>;
  
  // Two column properties
  leftContent?: string;
  rightContent?: string;
  
  // Video properties
  videoUrl?: string;
  
  // Spacer properties
  height?: string;
  
  // Quiz Question properties
  question?: string;
  options?: Array<{ id: string; text: string; imageUrl?: string }>;
  multipleSelection?: boolean;
  showImages?: boolean;
  maxSelections?: number;
  minSelections?: number;
  progressPercent?: number;
  logoUrl?: string;
  showBackButton?: boolean;
  optionLayout?: 'vertical' | 'horizontal' | 'grid';
  alignment?: 'left' | 'center' | 'right';
  
  style?: {
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
    fontSize?: string;
    fontWeight?: string;
    fontFamily?: string;
    lineHeight?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    boxShadow?: string;
    letterSpacing?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    objectFit?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Add missing EditorConfig type
export interface EditorConfig {
  blocks: EditorBlock[];
  globalStyles?: {
    backgroundColor?: string;
    fontFamily?: string;
    textColor?: string;
    accentColor?: string;
    secondaryColor?: string;
    buttonStyle?: string;
    headingStyle?: string;
    spacing?: string;
    borderRadius?: string;
    [key: string]: any;
  };
  settings?: {
    showLogo?: boolean;
    showNavigation?: boolean;
    showFooter?: boolean;
    [key: string]: any;
  };
}

// Tipos para as propriedades de cada campo no painel de propriedades
export type PropertyType = 
  | 'text' 
  | 'number' 
  | 'color' 
  | 'select' 
  | 'boolean' 
  | 'url' 
  | 'array-of-objects' 
  | 'image' 
  | 'icon-select' 
  | 'textarea' 
  | 'text-area'
  | 'range'
  | 'image-upload'
  | 'font-size-slider'
  | 'font-weight-buttons'
  | 'text-style-buttons'
  | 'text-align-buttons'
  | 'content-type-buttons'
  | 'color-palette'
  | 'image-url'
  | 'video-url'
  | 'json-editor';

export interface PropertySchema {
  key: string; // Chave da propriedade (ex: 'text', 'fontSize')
  label: string; // Rótulo visível no painel
  type: string; // Tipo de controle - usando string para flexibilidade
  defaultValue?: any; // Valor padrão
  options?: string[] | { label: string; value: any }[]; // Para tipo 'select' - aceita ambos formatos
  nestedPath?: string; // Para propriedades aninhadas (ex: 'styles.backgroundColor')
  itemSchema?: PropertySchema[]; // Para 'array-of-objects', define o schema de cada item
  min?: number; // Para 'number' e 'range'
  max?: number; // Para 'number' e 'range'
  step?: number; // Para 'number' e 'range'
  placeholder?: string; // Para campos de texto
  helpText?: string; // Texto de ajuda
  description?: string; // Descrição adicional
  rows?: number; // Para textarea
  required?: boolean; // Campo obrigatório
}

// Interface para as opções de uma pergunta
export interface QuestionOption {
  id: string;
  text: string;
  imageUrl?: string; // Opcional, para opções com imagem
  value?: string; // Valor da opção para processamento
}

// Interface para pergunta do quiz
export interface QuizQuestion {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'text-input' | 'slider' | 'yes-no';
  title: string;
  description?: string;
  options?: QuestionOption[];
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

// Interface para resultado do quiz
export interface QuizResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  recommendations?: string[];
  nextSteps?: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  }[];
}

// Interface para o funil
export interface Funnel {
  id: string;
  name: string;
  pages: Page[];
  config: Record<string, any>; // Configurações globais do funil
  version: number;
  isPublished: boolean;
  theme?: FunnelTheme;
  metadata?: {
    description?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
  };
}

// Interface para uma página do funil
export interface Page {
  id: string;
  title: string;
  blocks: Block[];
  settings?: {
    backgroundColor?: string;
    padding?: string;
    maxWidth?: string;
  };
}

// Interface para tema do funil
export interface FunnelTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: string;
}

// Definição de um bloco completo com schema
export interface BlockDefinition {
  type: string;
  label: string;
  icon: React.ElementType;
  category: 'content' | 'quiz' | 'funnel' | 'layout';
  propertiesSchema: PropertySchema[];
  defaultProperties: Record<string, any>;
  preview?: string; // URL ou caminho para preview do bloco
}

// Interface estendida para blocos com schema
export interface SchemaBlock extends Block {
  properties: Record<string, any>; // Propriedades configuráveis via painel
  schema?: PropertySchema[]; // Schema para validação e UI do painel
}

// =====================================================================
