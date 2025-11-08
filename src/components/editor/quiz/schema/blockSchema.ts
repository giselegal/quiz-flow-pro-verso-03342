// Block Property Schema Definitions
// Esta primeira versão define um contrato tipado para propriedades de blocos
// permitindo geração automática de forms, validação e defaults.

export type BlockPrimitiveType = 'string' | 'number' | 'range' | 'boolean' | 'select' | 'color' | 'enum' | 'richtext' | 'options-list';

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
      fontWeight: 'bold', 
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
      animationSpeed: 'normal', 
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
      textAlign: 'center', 
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
      height: 4, 
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
      variant: 'info', 
    },
    propertySchema: [
      { key: 'message', type: 'string', label: 'Mensagem', required: true, default: 'Preparando seus resultados...' },
      { key: 'icon', type: 'string', label: 'Ícone', required: false, default: 'info' },
      { key: 'variant', type: 'select', label: 'Variante', required: false, default: 'info', enumValues: ['info', 'success', 'warning'] },
    ],
  },

  // =====================================================================
  // BLOCOS ATÔMICOS DE RESULTADO (Step 20)
  // Migrados para SchemaAPI em src/config/schemas/blocks/result-blocks.ts
  // Mantemos sem fallback aqui para garantir uso do registro moderno.
  // =====================================================================

  // =====================================================================
  // 🆕 SCHEMAS FALTANTES - Correção G10 (Editor inutilizável para 79% dos blocos)
  // =====================================================================

  'intro-logo': {
    type: 'intro-logo',
    label: 'Logo de Introdução',
    icon: 'image',
    category: 'branding',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { logoUrl: '', logoWidth: 150, logoHeight: 150, altText: 'Logo', alignment: 'center' },
    propertySchema: [
      { key: 'logoUrl', type: 'string', label: 'URL da Logo', required: true, default: '', placeholder: 'https://exemplo.com/logo.png' },
      { key: 'logoWidth', type: 'number', label: 'Largura (px)', required: false, default: 150, min: 50, max: 500 },
      { key: 'logoHeight', type: 'number', label: 'Altura (px)', required: false, default: 150, min: 50, max: 500 },
      { key: 'altText', type: 'string', label: 'Texto Alternativo', required: false, default: 'Logo' },
      { key: 'alignment', type: 'select', label: 'Alinhamento', required: false, default: 'center', enumValues: ['left', 'center', 'right'] },
    ],
  },

  'form-container': {
    type: 'form-container',
    label: 'Container de Formulário',
    icon: 'file-text',
    category: 'forms',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      fields: [{ name: 'email', type: 'email', label: 'Email', required: true, placeholder: 'seu@email.com' }],
      submitText: 'Enviar',
      submitColor: '#3B82F6',
    },
    propertySchema: [
      { key: 'submitText', type: 'string', label: 'Texto do Botão', required: false, default: 'Enviar' },
      { key: 'submitColor', type: 'color', label: 'Cor do Botão', required: false, default: '#3B82F6' },
      { key: 'showLabels', type: 'boolean', label: 'Mostrar Labels', required: false, default: true },
      { key: 'inlineLayout', type: 'boolean', label: 'Layout Inline', required: false, default: false },
    ],
  },

  'progress-bar': {
    type: 'progress-bar',
    label: 'Barra de Progresso Genérica',
    icon: 'activity',
    category: 'navigation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      currentValue: 50, 
      maxValue: 100, 
      showLabel: true, 
      color: '#3B82F6', 
      backgroundColor: '#E5E7EB',
      height: 8,
      animated: true,
    },
    propertySchema: [
      { key: 'currentValue', type: 'number', label: 'Valor Atual', required: true, default: 50, min: 0 },
      { key: 'maxValue', type: 'number', label: 'Valor Máximo', required: true, default: 100, min: 1 },
      { key: 'showLabel', type: 'boolean', label: 'Mostrar Label', required: false, default: true },
      { key: 'color', type: 'color', label: 'Cor da Barra', required: false, default: '#3B82F6' },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, default: '#E5E7EB' },
      { key: 'height', type: 'number', label: 'Altura (px)', required: false, default: 8, min: 4, max: 20 },
      { key: 'animated', type: 'boolean', label: 'Animado', required: false, default: true },
    ],
  },

  'options-grid': {
    type: 'options-grid',
    label: 'Grade de Opções',
    icon: 'grid',
    category: 'interactive',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      options: [],
      columns: 2,
      gap: 16,
      allowMultiple: false,
      showImages: true,
      imageSize: 'medium',
    },
    propertySchema: [
      { key: 'columns', type: 'number', label: 'Número de Colunas', required: false, default: 2, min: 1, max: 4 },
      { key: 'gap', type: 'number', label: 'Espaçamento (px)', required: false, default: 16, min: 4, max: 48 },
      { key: 'allowMultiple', type: 'boolean', label: 'Seleção Múltipla', required: false, default: false },
      { key: 'showImages', type: 'boolean', label: 'Mostrar Imagens', required: false, default: true },
      { key: 'imageSize', type: 'select', label: 'Tamanho da Imagem', required: false, default: 'medium', enumValues: ['small', 'medium', 'large'] },
      { key: 'hoverEffect', type: 'boolean', label: 'Efeito Hover', required: false, default: true },
    ],
  },

  'navigation': {
    type: 'navigation',
    label: 'Navegação',
    icon: 'navigation',
    category: 'navigation',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      showBack: true,
      showNext: true,
      backText: 'Voltar',
      nextText: 'Próximo',
      alignment: 'space-between',
      variant: 'default',
    },
    propertySchema: [
      { key: 'showBack', type: 'boolean', label: 'Mostrar Voltar', required: false, default: true },
      { key: 'showNext', type: 'boolean', label: 'Mostrar Próximo', required: false, default: true },
      { key: 'backText', type: 'string', label: 'Texto Voltar', required: false, default: 'Voltar' },
      { key: 'nextText', type: 'string', label: 'Texto Próximo', required: false, default: 'Próximo' },
      { key: 'alignment', type: 'select', label: 'Alinhamento', required: false, default: 'space-between', enumValues: ['left', 'center', 'right', 'space-between'] },
      { key: 'variant', type: 'select', label: 'Variante', required: false, default: 'default', enumValues: ['default', 'outline', 'ghost', 'link'] },
    ],
  },

  'result-header-inline': {
    type: 'result-header-inline',
    label: 'Cabeçalho de Resultado Inline',
    icon: 'award',
    category: 'content',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Seu Resultado',
      showIcon: true,
      iconColor: '#10B981',
      textAlign: 'center',
      fontSize: 28,
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: true, default: 'Seu Resultado' },
      { key: 'showIcon', type: 'boolean', label: 'Mostrar Ícone', required: false, default: true },
      { key: 'iconColor', type: 'color', label: 'Cor do Ícone', required: false, default: '#10B981' },
      { key: 'textAlign', type: 'select', label: 'Alinhamento', required: false, default: 'center', enumValues: ['left', 'center', 'right'] },
      { key: 'fontSize', type: 'number', label: 'Tamanho da Fonte (px)', required: false, default: 28, min: 16, max: 48 },
    ],
  },

  'image-gallery': {
    type: 'image-gallery',
    label: 'Galeria de Imagens',
    icon: 'image',
    category: 'media',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      images: [],
      columns: 3,
      gap: 12,
      showCaptions: true,
      lightbox: true,
      aspectRatio: '1:1',
    },
    propertySchema: [
      { key: 'columns', type: 'number', label: 'Número de Colunas', required: false, default: 3, min: 1, max: 6 },
      { key: 'gap', type: 'number', label: 'Espaçamento (px)', required: false, default: 12, min: 0, max: 48 },
      { key: 'showCaptions', type: 'boolean', label: 'Mostrar Legendas', required: false, default: true },
      { key: 'lightbox', type: 'boolean', label: 'Lightbox', required: false, default: true },
      { key: 'aspectRatio', type: 'select', label: 'Proporção', required: false, default: '1:1', enumValues: ['1:1', '4:3', '16:9', 'auto'] },
      { key: 'borderRadius', type: 'number', label: 'Arredondamento (px)', required: false, default: 8, min: 0, max: 24 },
    ],
  },

  'secondary-styles': {
    type: 'secondary-styles',
    label: 'Estilos Secundários',
    icon: 'palette',
    category: 'styling',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      backgroundColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      shadow: 'sm',
    },
    propertySchema: [
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, default: '#F9FAFB' },
      { key: 'borderColor', type: 'color', label: 'Cor da Borda', required: false, default: '#E5E7EB' },
      { key: 'borderWidth', type: 'number', label: 'Largura da Borda (px)', required: false, default: 1, min: 0, max: 8 },
      { key: 'borderRadius', type: 'number', label: 'Arredondamento (px)', required: false, default: 8, min: 0, max: 48 },
      { key: 'padding', type: 'number', label: 'Padding (px)', required: false, default: 16, min: 0, max: 64 },
      { key: 'shadow', type: 'select', label: 'Sombra', required: false, default: 'sm', enumValues: ['none', 'sm', 'md', 'lg', 'xl'] },
    ],
  },

  'fashion-ai-generator': {
    type: 'fashion-ai-generator',
    label: 'Gerador de Estilo Fashion IA',
    icon: 'sparkles',
    category: 'interactive',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      prompt: 'Gere um look personalizado baseado no meu estilo',
      buttonText: 'Gerar Look',
      loading: false,
      showGallery: true,
      maxResults: 4,
    },
    propertySchema: [
      { key: 'prompt', type: 'string', label: 'Prompt', required: true, default: 'Gere um look personalizado baseado no meu estilo' },
      { key: 'buttonText', type: 'string', label: 'Texto do Botão', required: false, default: 'Gerar Look' },
      { key: 'showGallery', type: 'boolean', label: 'Mostrar Galeria', required: false, default: true },
      { key: 'maxResults', type: 'number', label: 'Máx. Resultados', required: false, default: 4, min: 1, max: 12 },
      { key: 'enableDownload', type: 'boolean', label: 'Permitir Download', required: false, default: true },
    ],
  },

  'cta-card': {
    type: 'cta-card',
    label: 'Card de Call-to-Action',
    icon: 'megaphone',
    category: 'conversion',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Aproveite esta Oferta!',
      description: 'Não perca esta oportunidade única',
      buttonText: 'Quero Aproveitar',
      buttonUrl: '#',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      showIcon: true,
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: true, default: 'Aproveite esta Oferta!' },
      { key: 'description', type: 'string', label: 'Descrição', required: false, default: 'Não perca esta oportunidade única' },
      { key: 'buttonText', type: 'string', label: 'Texto do Botão', required: true, default: 'Quero Aproveitar' },
      { key: 'buttonUrl', type: 'string', label: 'URL do Botão', required: false, default: '#' },
      { key: 'backgroundColor', type: 'color', label: 'Cor de Fundo', required: false, default: '#3B82F6' },
      { key: 'textColor', type: 'color', label: 'Cor do Texto', required: false, default: '#FFFFFF' },
      { key: 'showIcon', type: 'boolean', label: 'Mostrar Ícone', required: false, default: true },
    ],
  },

  'share-buttons': {
    type: 'share-buttons',
    label: 'Botões de Compartilhamento',
    icon: 'share-2',
    category: 'social',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    defaultData: { 
      title: 'Compartilhe seu resultado!',
      platforms: ['facebook', 'twitter', 'whatsapp', 'email'],
      showLabels: true,
      size: 'medium',
      alignment: 'center',
    },
    propertySchema: [
      { key: 'title', type: 'string', label: 'Título', required: false, default: 'Compartilhe seu resultado!' },
      { key: 'showLabels', type: 'boolean', label: 'Mostrar Labels', required: false, default: true },
      { key: 'size', type: 'select', label: 'Tamanho', required: false, default: 'medium', enumValues: ['small', 'medium', 'large'] },
      { key: 'alignment', type: 'select', label: 'Alinhamento', required: false, default: 'center', enumValues: ['left', 'center', 'right'] },
      { key: 'shareText', type: 'string', label: 'Texto Compartilhado', required: false, default: 'Confira meu resultado!' },
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
      properties: mapSchema.propertySchema,
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
  properties: Record<string, any>,
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
    errors,
  };
}
