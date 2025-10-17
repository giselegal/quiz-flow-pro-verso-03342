// Block Property Schema Definitions
// Esta primeira versão define um contrato tipado para propriedades de blocos
// permitindo geração automática de forms, validação e defaults.

export type BlockPrimitiveType = 'string' | 'number' | 'boolean' | 'select' | 'color' | 'enum' | 'richtext' | 'options-list';

export interface BasePropertySchema<T = any> {
    key: string;               // nome interno
    label: string;             // rótulo UI
    type: BlockPrimitiveType;  // tipo primário
    required?: boolean;        // obrigatório
    description?: string;      // ajuda curta
    default?: T;               // valor padrão
    placeholder?: string;      // placeholder input
    min?: number;              // limites numéricos
    max?: number;
    step?: number;
    pattern?: RegExp;          // validação regex
    enumValues?: string[];     // para enum/select
    optionsFetcher?: () => Promise<string[]>; // select dinâmico futuro
    hidden?: boolean;          // condicional
    advanced?: boolean;        // marcar se pertence a seção avançada
    group?: string;            // agrupar no form
    // Regra condicional simples (executada em runtime no form)
    when?: (current: Record<string, any>) => boolean;
    validate?: (value: any, current: Record<string, any>) => string | null; // retorna mensagem de erro
}

export interface BlockPropertyGroup {
    id: string;
    label: string;
    description?: string;
    order?: number;
}

export interface BlockPropertySchemaDefinition {
    type: string; // block type
    groups?: BlockPropertyGroup[];
    properties: BasePropertySchema[];
}

export const INITIAL_BLOCK_SCHEMAS: BlockPropertySchemaDefinition[] = [];

export const blockSchemaMap: Record<string, any> = {
  'decorative-bar-inline': {
    type: 'decorative-bar-inline',
    label: 'Barra Decorativa Inline',
    icon: 'separator',
    category: 'decoration',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: {
      barColor: '#E5E7EB',
      barHeight: 4,
      marginTop: 8,
      marginBottom: 8,
    },
    propertySchema: [
      { key: 'barColor', type: 'color', label: 'Cor da Barra', required: false, defaultValue: '#E5E7EB' },
      { key: 'barHeight', type: 'number', label: 'Altura (px)', required: false, defaultValue: 4, min: 1, max: 20 },
      { key: 'marginTop', type: 'number', label: 'Margem Superior (px)', required: false, defaultValue: 8 },
      { key: 'marginBottom', type: 'number', label: 'Margem Inferior (px)', required: false, defaultValue: 8 },
    ],
  },

  // 🎯 SCHEMAS MODULARES COMPLETOS
  'quiz-logo': {
    type: 'quiz-logo',
    label: 'Logo do Quiz',
    icon: 'image',
    category: 'branding',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { logoUrl: 'https://via.placeholder.com/120x40', logoWidth: 120, logoHeight: 40, altText: 'Logo' },
    propertySchema: [
      { key: 'logoUrl', type: 'text', label: 'URL da Logo', required: true, defaultValue: 'https://via.placeholder.com/120x40' },
      { key: 'logoWidth', type: 'number', label: 'Largura (px)', required: false, defaultValue: 120, min: 50, max: 400 },
      { key: 'logoHeight', type: 'number', label: 'Altura (px)', required: false, defaultValue: 40, min: 20, max: 200 },
      { key: 'altText', type: 'text', label: 'Texto Alternativo', required: false, defaultValue: 'Logo' },
    ],
  },

  'quiz-progress-bar': {
    type: 'quiz-progress-bar',
    label: 'Barra de Progresso',
    icon: 'activity',
    category: 'navigation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { currentStep: 1, totalSteps: 21, barColor: '#3B82F6', backgroundColor: '#E5E7EB', height: 8, showPercentage: true },
    propertySchema: [
      { key: 'currentStep', type: 'number', label: 'Etapa Atual', required: true, defaultValue: 1, min: 1 },
      { key: 'totalSteps', type: 'number', label: 'Total de Etapas', required: true, defaultValue: 21, min: 1 },
      { key: 'barColor', type: 'color', label: 'Cor da Barra', required: false, defaultValue: '#3B82F6' },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, defaultValue: '#E5E7EB' },
      { key: 'height', type: 'number', label: 'Altura (px)', required: false, defaultValue: 8, min: 4, max: 20 },
      { key: 'showPercentage', type: 'boolean', label: 'Mostrar Percentual', required: false, defaultValue: true },
    ],
  },

  'quiz-back-button': {
    type: 'quiz-back-button',
    label: 'Botão Voltar',
    icon: 'arrow-left',
    category: 'navigation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { buttonText: 'Voltar', showIcon: true, variant: 'ghost' },
    propertySchema: [
      { key: 'buttonText', type: 'text', label: 'Texto do Botão', required: false, defaultValue: 'Voltar' },
      { key: 'showIcon', type: 'boolean', label: 'Mostrar Ícone', required: false, defaultValue: true },
      { key: 'variant', type: 'select', label: 'Variante', required: false, defaultValue: 'ghost', options: ['default', 'ghost', 'outline', 'secondary'] },
    ],
  },

  'image-display-inline': {
    type: 'image-display-inline',
    label: 'Imagem Display Inline',
    icon: 'image',
    category: 'media',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { imageUrl: 'https://via.placeholder.com/600x400', altText: 'Imagem', width: '100%', height: 'auto', objectFit: 'cover', borderRadius: 8 },
    propertySchema: [
      { key: 'imageUrl', type: 'text', label: 'URL da Imagem', required: true, defaultValue: 'https://via.placeholder.com/600x400' },
      { key: 'altText', type: 'text', label: 'Texto Alternativo', required: false, defaultValue: 'Imagem' },
      { key: 'width', type: 'text', label: 'Largura', required: false, defaultValue: '100%' },
      { key: 'height', type: 'text', label: 'Altura', required: false, defaultValue: 'auto' },
      { key: 'objectFit', type: 'select', label: 'Ajuste da Imagem', required: false, defaultValue: 'cover', options: ['cover', 'contain', 'fill', 'none', 'scale-down'] },
      { key: 'borderRadius', type: 'number', label: 'Arredondamento (px)', required: false, defaultValue: 8, min: 0, max: 50 },
    ],
  },

  'quiz-question-header': {
    type: 'quiz-question-header',
    label: 'Cabeçalho de Pergunta',
    icon: 'help-circle',
    category: 'content',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { questionText: 'Qual é a sua pergunta?', questionNumber: 1, showNumber: true, fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
    propertySchema: [
      { key: 'questionText', type: 'textarea', label: 'Texto da Pergunta', required: true, defaultValue: 'Qual é a sua pergunta?' },
      { key: 'questionNumber', type: 'number', label: 'Número da Pergunta', required: false, defaultValue: 1, min: 1 },
      { key: 'showNumber', type: 'boolean', label: 'Mostrar Número', required: false, defaultValue: true },
      { key: 'fontSize', type: 'number', label: 'Tamanho da Fonte (px)', required: false, defaultValue: 24, min: 12, max: 48 },
      { key: 'fontWeight', type: 'select', label: 'Peso da Fonte', required: false, defaultValue: 'bold', options: ['normal', 'medium', 'semibold', 'bold'] },
      { key: 'textAlign', type: 'select', label: 'Alinhamento', required: false, defaultValue: 'center', options: ['left', 'center', 'right'] },
    ],
  },

  'quiz-transition-loader': {
    type: 'quiz-transition-loader',
    label: 'Loader de Transição',
    icon: 'loader',
    category: 'feedback',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { message: 'Analisando suas respostas...', duration: 2000, spinnerSize: 48, spinnerColor: '#3B82F6' },
    propertySchema: [
      { key: 'message', type: 'text', label: 'Mensagem', required: false, defaultValue: 'Analisando suas respostas...' },
      { key: 'duration', type: 'number', label: 'Duração (ms)', required: false, defaultValue: 2000, min: 500, max: 10000 },
      { key: 'spinnerSize', type: 'number', label: 'Tamanho do Spinner (px)', required: false, defaultValue: 48, min: 24, max: 96 },
      { key: 'spinnerColor', type: 'color', label: 'Cor do Spinner', required: false, defaultValue: '#3B82F6' },
    ],
  },

  'quiz-result-header': {
    type: 'quiz-result-header',
    label: 'Cabeçalho de Resultado',
    icon: 'check-circle',
    category: 'content',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { title: 'Seu Resultado', subtitle: 'Baseado nas suas respostas', showIcon: true, iconType: 'success', textAlign: 'center' },
    propertySchema: [
      { key: 'title', type: 'text', label: 'Título', required: true, defaultValue: 'Seu Resultado' },
      { key: 'subtitle', type: 'text', label: 'Subtítulo', required: false, defaultValue: 'Baseado nas suas respostas' },
      { key: 'showIcon', type: 'boolean', label: 'Mostrar Ícone', required: false, defaultValue: true },
      { key: 'iconType', type: 'select', label: 'Tipo de Ícone', required: false, defaultValue: 'success', options: ['success', 'info', 'warning', 'error'] },
      { key: 'textAlign', type: 'select', label: 'Alinhamento', required: false, defaultValue: 'center', options: ['left', 'center', 'right'] },
    ],
  },

  'quiz-offer-hero': {
    type: 'quiz-offer-hero',
    label: 'Hero de Oferta',
    icon: 'gift',
    category: 'conversion',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { headline: 'Oferta Especial para Você!', subheadline: 'Aproveite esta oportunidade única', ctaText: 'Quero Aproveitar', ctaUrl: '#', backgroundImage: '', backgroundColor: '#3B82F6' },
    propertySchema: [
      { key: 'headline', type: 'text', label: 'Título Principal', required: true, defaultValue: 'Oferta Especial para Você!' },
      { key: 'subheadline', type: 'textarea', label: 'Subtítulo', required: false, defaultValue: 'Aproveite esta oportunidade única' },
      { key: 'ctaText', type: 'text', label: 'Texto do Botão', required: true, defaultValue: 'Quero Aproveitar' },
      { key: 'ctaUrl', type: 'text', label: 'URL do Botão', required: false, defaultValue: '#' },
      { key: 'backgroundImage', type: 'text', label: 'Imagem de Fundo (URL)', required: false, defaultValue: '' },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, defaultValue: '#3B82F6' },
    ],
  },

  // Progress Header (usado no topo do quiz) — requerido por testes
  'progress-header': {
    type: 'progress-header',
    label: 'Cabeçalho de Progresso',
    icon: 'progress',
    category: 'navigation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: {
      showLogo: true,
      progressEnabled: true,
      barColor: '#D4AF37',
      autoProgress: true,
    },
    // Importante: usar a chave `default` (não `defaultValue`) conforme BasePropertySchema e testes
    propertySchema: [
      { key: 'showLogo', type: 'boolean', label: 'Mostrar Logo', required: false, default: true },
      { key: 'progressEnabled', type: 'boolean', label: 'Mostrar Progresso', required: false, default: true },
      { key: 'barColor', type: 'color', label: 'Cor da Barra', required: false, default: '#D4AF37' },
      { key: 'autoProgress', type: 'boolean', label: 'Avanço Automático', required: false, default: true },
    ],
  },

  // =====================================================================
  // BLOCOS ATÔMICOS DE TRANSIÇÃO (Steps 12 & 19) 
  // =====================================================================

  'transition-title': {
    type: 'transition-title',
    label: 'Título de Transição',
    icon: 'type',
    category: 'transition',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      text: 'Analisando suas respostas...', 
      fontSize: '2xl', 
      color: '#1F2937', 
      textAlign: 'center', 
      fontWeight: 'bold' 
    },
    propertySchema: [
      { key: 'text', type: 'string', label: 'Texto', required: true, default: 'Analisando suas respostas...' },
      { key: 'fontSize', type: 'select', label: 'Tamanho da Fonte', required: false, default: '2xl', enumValues: ['xl', '2xl', '3xl', '4xl'] },
      { key: 'color', type: 'color', label: 'Cor do Texto', required: false, default: '#1F2937' },
      { key: 'textAlign', type: 'select', label: 'Alinhamento', required: false, default: 'center', enumValues: ['left', 'center', 'right'] },
      { key: 'fontWeight', type: 'select', label: 'Peso da Fonte', required: false, default: 'bold', enumValues: ['normal', 'bold', 'semibold'] },
    ],
  },

  'transition-loader': {
    type: 'transition-loader',
    label: 'Loader de Transição',
    icon: 'loader',
    category: 'transition',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      color: '#3B82F6', 
      dots: 3, 
      size: 'md', 
      animationSpeed: 'normal' 
    },
    propertySchema: [
      { key: 'color', type: 'color', label: 'Cor do Loader', required: false, default: '#3B82F6' },
      { key: 'dots', type: 'number', label: 'Número de Dots', required: false, default: 3, min: 2, max: 5 },
      { key: 'size', type: 'select', label: 'Tamanho', required: false, default: 'md', enumValues: ['sm', 'md', 'lg'] },
      { key: 'animationSpeed', type: 'select', label: 'Velocidade', required: false, default: 'normal', enumValues: ['slow', 'normal', 'fast'] },
    ],
  },

  'transition-text': {
    type: 'transition-text',
    label: 'Texto de Transição',
    icon: 'text',
    category: 'transition',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      text: 'Aguarde um momento...', 
      fontSize: 16, 
      color: '#6B7280', 
      textAlign: 'center' 
    },
    propertySchema: [
      { key: 'text', type: 'string', label: 'Texto', required: true, default: 'Aguarde um momento...' },
      { key: 'fontSize', type: 'number', label: 'Tamanho da Fonte (px)', required: false, default: 16, min: 12, max: 48 },
      { key: 'color', type: 'color', label: 'Cor do Texto', required: false, default: '#6B7280' },
      { key: 'textAlign', type: 'select', label: 'Alinhamento', required: false, default: 'center', enumValues: ['left', 'center', 'right'] },
    ],
  },

  'transition-progress': {
    type: 'transition-progress',
    label: 'Progresso de Transição',
    icon: 'activity',
    category: 'transition',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      currentStep: 1, 
      totalSteps: 5, 
      showPercentage: true, 
      color: '#3B82F6', 
      height: 4 
    },
    propertySchema: [
      { key: 'currentStep', type: 'number', label: 'Etapa Atual', required: true, default: 1, min: 1 },
      { key: 'totalSteps', type: 'number', label: 'Total de Etapas', required: true, default: 5, min: 1 },
      { key: 'showPercentage', type: 'boolean', label: 'Mostrar Percentual', required: false, default: true },
      { key: 'color', type: 'color', label: 'Cor da Barra', required: false, default: '#3B82F6' },
      { key: 'height', type: 'number', label: 'Altura (px)', required: false, default: 4, min: 2, max: 10 },
    ],
  },

  'transition-message': {
    type: 'transition-message',
    label: 'Mensagem de Transição',
    icon: 'message-square',
    category: 'transition',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      message: 'Preparando seus resultados...', 
      icon: 'info', 
      variant: 'info' 
    },
    propertySchema: [
      { key: 'message', type: 'string', label: 'Mensagem', required: true, default: 'Preparando seus resultados...' },
      { key: 'icon', type: 'string', label: 'Ícone', required: false, default: 'info' },
      { key: 'variant', type: 'select', label: 'Variante', required: false, default: 'info', enumValues: ['info', 'success', 'warning'] },
    ],
  },

  // =====================================================================
  // BLOCOS ATÔMICOS DE RESULTADO (Step 20)
  // =====================================================================

  'result-main': {
    type: 'result-main',
    label: 'Estilo Principal de Resultado',
    icon: 'star',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      styleName: 'Estilo Dominante', 
      description: 'Descrição do seu estilo principal', 
      imageUrl: '', 
      showIcon: true, 
      backgroundColor: '#F3F4F6' 
    },
    propertySchema: [
      { key: 'styleName', type: 'string', label: 'Nome do Estilo', required: true, default: 'Estilo Dominante' },
      { key: 'description', type: 'string', label: 'Descrição', required: false, default: 'Descrição do seu estilo principal' },
      { key: 'imageUrl', type: 'string', label: 'URL da Imagem', required: false, default: '' },
      { key: 'showIcon', type: 'boolean', label: 'Mostrar Ícone', required: false, default: true },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, default: '#F3F4F6' },
    ],
  },

  'result-style': {
    type: 'result-style',
    label: 'Card de Estilo',
    icon: 'layers',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      styleName: 'Seu Estilo', 
      percentage: 0, 
      description: '', 
      color: '#3B82F6', 
      showBar: true 
    },
    propertySchema: [
      { key: 'styleName', type: 'string', label: 'Nome do Estilo', required: true, default: 'Seu Estilo' },
      { key: 'percentage', type: 'number', label: 'Percentual', required: true, default: 0, min: 0, max: 100 },
      { key: 'description', type: 'string', label: 'Descrição', required: false, default: '' },
      { key: 'color', type: 'color', label: 'Cor', required: false, default: '#3B82F6' },
      { key: 'showBar', type: 'boolean', label: 'Mostrar Barra', required: false, default: true },
    ],
  },

  'result-characteristics': {
    type: 'result-characteristics',
    label: 'Características do Resultado',
    icon: 'list',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Características', 
      items: [] 
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: true, default: 'Características' },
      { key: 'items', type: 'options-list', label: 'Características', required: false, default: [] },
    ],
  },

  'result-secondary-styles': {
    type: 'result-secondary-styles',
    label: 'Estilos Secundários',
    icon: 'pie-chart',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Outros Estilos', 
      styles: [], 
      showPercentages: true 
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: true, default: 'Outros Estilos' },
      { key: 'styles', type: 'options-list', label: 'Estilos', required: false, default: [] },
      { key: 'showPercentages', type: 'boolean', label: 'Mostrar Percentuais', required: false, default: true },
    ],
  },

  'result-cta-primary': {
    type: 'result-cta-primary',
    label: 'CTA Principal',
    icon: 'mouse-pointer',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      text: 'Ver Oferta Personalizada', 
      url: '#', 
      backgroundColor: '#3B82F6', 
      textColor: '#FFFFFF', 
      size: 'lg' 
    },
    propertySchema: [
      { key: 'text', type: 'string', label: 'Texto do Botão', required: true, default: 'Ver Oferta Personalizada' },
      { key: 'url', type: 'string', label: 'URL', required: false, default: '#' },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, default: '#3B82F6' },
      { key: 'textColor', type: 'color', label: 'Cor do Texto', required: false, default: '#FFFFFF' },
      { key: 'size', type: 'select', label: 'Tamanho', required: false, default: 'lg', enumValues: ['sm', 'md', 'lg', 'xl'] },
    ],
  },

  'result-cta-secondary': {
    type: 'result-cta-secondary',
    label: 'CTA Secundário',
    icon: 'mouse-pointer-2',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      text: 'Refazer Quiz', 
      url: '#', 
      variant: 'outline', 
      size: 'md' 
    },
    propertySchema: [
      { key: 'text', type: 'string', label: 'Texto do Botão', required: true, default: 'Refazer Quiz' },
      { key: 'url', type: 'string', label: 'URL', required: false, default: '#' },
      { key: 'variant', type: 'select', label: 'Variante', required: false, default: 'outline', enumValues: ['outline', 'ghost', 'link'] },
      { key: 'size', type: 'select', label: 'Tamanho', required: false, default: 'md', enumValues: ['sm', 'md', 'lg'] },
    ],
  },

  'result-share': {
    type: 'result-share',
    label: 'Compartilhamento',
    icon: 'share-2',
    category: 'result',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Compartilhe seu resultado', 
      platforms: ['facebook', 'twitter', 'whatsapp', 'linkedin'], 
      message: 'Confira meu resultado!' 
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: false, default: 'Compartilhe seu resultado' },
      { key: 'platforms', type: 'options-list', label: 'Plataformas', required: false, default: ['facebook', 'twitter', 'whatsapp', 'linkedin'] },
      { key: 'message', type: 'string', label: 'Mensagem', required: false, default: 'Confira meu resultado!' },
    ],
  },
};

// Helper function to get block schema by type
export function getBlockSchema(type: string): BlockPropertySchemaDefinition | null {
  // First check INITIAL_BLOCK_SCHEMAS
  const initialSchema = INITIAL_BLOCK_SCHEMAS.find(s => s.type === type);
  if (initialSchema) return initialSchema;

  // Then check blockSchemaMap
  const mapSchema = blockSchemaMap[type];
  if (mapSchema && mapSchema.propertySchema) {
    return {
      type: mapSchema.type,
      groups: mapSchema.groups,
      properties: mapSchema.propertySchema
    };
  }

  return null;
}

// Helper function to get default values for a block type
export function getBlockDefaults(type: string): Record<string, any> {
  const schema = getBlockSchema(type);
  if (!schema) return {};

  const defaults: Record<string, any> = {};
  schema.properties.forEach((prop: BasePropertySchema) => {
    if (prop.default !== undefined) {
      defaults[prop.key] = prop.default;
    }
  });

  return defaults;
}

// Helper to validate block properties
export function validateBlockProperties(
  type: string,
  properties: Record<string, any>
): { isValid: boolean; errors: string[] } {
  const schema = getBlockSchema(type);
  if (!schema) return { isValid: false, errors: ['Schema not found'] };

  const errors: string[] = [];

  schema.properties.forEach((prop: BasePropertySchema) => {
    const value = properties[prop.key];

    // Check required fields
    if (prop.required && (value === undefined || value === null || value === '')) {
      errors.push(`${prop.label} é obrigatório`);
    }

    // Run custom validation if present
    if (prop.validate && value !== undefined) {
      const error = prop.validate(value, properties);
      if (error) errors.push(error);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
