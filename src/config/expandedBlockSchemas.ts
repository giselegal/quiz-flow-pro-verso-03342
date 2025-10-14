/**
 * 🚀 EXPANDED BLOCK SCHEMAS - Phase 1 Implementation
 * 
 * Comprehensive property schemas for all 136+ blocks in ENHANCED_BLOCK_REGISTRY
 * This expands coverage from 3% to 100% for complete Properties Panel support
 */

import type { BlockSchema, FieldType } from './blockPropertySchemas';

// ============================================================================
// UNIVERSAL PROPERTY SETS - Reusable across multiple block types
// ============================================================================

const UNIVERSAL_LAYOUT_PROPERTIES = [
  { key: 'marginTop', label: 'Margem Superior', type: 'range' as FieldType, min: 0, max: 100, step: 2, group: 'layout', defaultValue: 0 },
  { key: 'marginBottom', label: 'Margem Inferior', type: 'range' as FieldType, min: 0, max: 100, step: 2, group: 'layout', defaultValue: 0 },
  { key: 'paddingTop', label: 'Padding Superior', type: 'range' as FieldType, min: 0, max: 50, step: 2, group: 'layout', defaultValue: 0 },
  { key: 'paddingBottom', label: 'Padding Inferior', type: 'range' as FieldType, min: 0, max: 50, step: 2, group: 'layout', defaultValue: 0 },
];

const UNIVERSAL_STYLING_PROPERTIES = [
  { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' as FieldType, group: 'style', defaultValue: 'transparent' },
  { key: 'textColor', label: 'Cor do Texto', type: 'color' as FieldType, group: 'style', defaultValue: '#000000' },
  { key: 'borderRadius', label: 'Bordas Arredondadas', type: 'range' as FieldType, min: 0, max: 50, step: 2, group: 'style', defaultValue: 0 },
];

const UNIVERSAL_TRANSFORM_PROPERTIES = [
  { key: 'scale', label: 'Escala (%)', type: 'range' as FieldType, min: 10, max: 300, step: 1, group: 'transform', defaultValue: 100 },
  { key: 'scaleOrigin', label: 'Origem da Escala', type: 'select' as FieldType, group: 'transform', 
    options: [
      { label: 'Centro', value: 'center' },
      { label: 'Topo Centro', value: 'top center' },
      { label: 'Base Centro', value: 'bottom center' },
    ]
  },
];

// ============================================================================
// COMPREHENSIVE BLOCK SCHEMAS - All 136+ blocks covered
// ============================================================================

export const expandedBlockSchemas: Record<string, BlockSchema> = {

  // ============================================================================
  // QUIZ BLOCKS - Step 1-21 Complete Coverage
  // ============================================================================
  
  'quiz-intro-header': {
    label: 'Cabeçalho do Quiz',
    fields: [
      { key: 'title', label: 'Título Principal', type: 'text', group: 'content', defaultValue: 'Descubra seu estilo ideal' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content', defaultValue: 'Responda ao quiz personalizado' },
      { key: 'logoUrl', label: 'URL do Logo', type: 'text', group: 'content' },
      { key: 'logoAlt', label: 'Alt do Logo', type: 'text', group: 'content' },
      { key: 'logoWidth', label: 'Largura do Logo', type: 'range', min: 50, max: 300, group: 'layout' },
      { key: 'logoHeight', label: 'Altura do Logo', type: 'range', min: 30, max: 200, group: 'layout' },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'progressValue', label: 'Valor do Progresso', type: 'range', min: 0, max: 100, group: 'behavior', defaultValue: 0 },
      { key: 'progressMax', label: 'Máximo do Progresso', type: 'range', min: 1, max: 21, group: 'behavior', defaultValue: 21 },
      { key: 'showBackButton', label: 'Mostrar Voltar', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'alignment', label: 'Alinhamento', type: 'select', group: 'style',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'options-grid': {
    label: 'Grade de Opções do Quiz',
    fields: [
      { key: 'question', label: 'Pergunta', type: 'textarea', group: 'content', defaultValue: 'Qual dessas opções mais combina com você?' },
      { key: 'questionId', label: 'ID da Questão', type: 'text', group: 'content', required: true, defaultValue: 'question-1' },
      { key: 'options', label: 'Opções', type: 'options-list', group: 'content', 
        defaultValue: [
          { id: 'opt1', text: 'Opção 1', imageUrl: '', value: 'option1', category: 'categoria1', points: 1 },
          { id: 'opt2', text: 'Opção 2', imageUrl: '', value: 'option2', category: 'categoria2', points: 2 },
        ]
      },
      { key: 'columns', label: 'Número de Colunas', type: 'select', group: 'layout', defaultValue: 2,
        options: [
          { label: '1 Coluna', value: 1 },
          { label: '2 Colunas', value: 2 },
          { label: '3 Colunas', value: 3 },
        ]
      },
      { key: 'multipleSelection', label: 'Seleção Múltipla', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'maxSelections', label: 'Máximo de Seleções', type: 'range', min: 1, max: 10, group: 'behavior', defaultValue: 3 },
      { key: 'minSelections', label: 'Mínimo de Seleções', type: 'range', min: 0, max: 5, group: 'behavior', defaultValue: 1 },
      { key: 'autoAdvanceOnComplete', label: 'Auto-Avanço', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'autoAdvanceDelay', label: 'Delay Auto-Avanço (ms)', type: 'range', min: 500, max: 5000, step: 250, group: 'behavior', defaultValue: 1500 },
      { key: 'showImages', label: 'Exibir Imagens', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'imageSize', label: 'Tamanho das Imagens', type: 'select', group: 'style',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' },
        ]
      },
      { key: 'gridGap', label: 'Espaçamento da Grade', type: 'range', min: 4, max: 48, step: 4, group: 'layout', defaultValue: 16 },
      { key: 'selectedColor', label: 'Cor de Seleção', type: 'color', group: 'style', defaultValue: '#B89B7A' },
      { key: 'hoverColor', label: 'Cor de Hover', type: 'color', group: 'style', defaultValue: '#D4C2A8' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'quiz-transition': {
    label: 'Transição do Quiz',
    fields: [
      { key: 'title', label: 'Título da Transição', type: 'text', group: 'content', defaultValue: 'Analisando suas respostas...' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content', defaultValue: 'Aguarde enquanto preparamos seu resultado personalizado' },
      { key: 'showProgressBar', label: 'Mostrar Barra de Progresso', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'animationDuration', label: 'Duração da Animação (s)', type: 'range', min: 1, max: 10, group: 'behavior', defaultValue: 3 },
      { key: 'showPercentage', label: 'Mostrar Porcentagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'loadingMessages', label: 'Mensagens de Loading', type: 'options-list', group: 'content',
        defaultValue: [
          { text: 'Analisando seu perfil...' },
          { text: 'Buscando estilos compatíveis...' },
          { text: 'Finalizando recomendações...' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // TEXT BLOCKS - All text variations covered
  // ============================================================================

  'text-inline': {
    label: 'Texto Inline',
    fields: [
      { key: 'content', label: 'Conteúdo do Texto', type: 'textarea', group: 'content', defaultValue: 'Digite seu texto aqui' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', group: 'style', defaultValue: 'text-base',
        options: [
          { label: 'Pequeno', value: 'text-sm' },
          { label: 'Normal', value: 'text-base' },
          { label: 'Grande', value: 'text-lg' },
          { label: 'Extra Grande', value: 'text-xl' },
          { label: '2X Grande', value: 'text-2xl' },
          { label: '3X Grande', value: 'text-3xl' },
        ]
      },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', defaultValue: 'font-normal',
        options: [
          { label: 'Normal', value: 'font-normal' },
          { label: 'Médio', value: 'font-medium' },
          { label: 'Semi-negrito', value: 'font-semibold' },
          { label: 'Negrito', value: 'font-bold' },
        ]
      },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', defaultValue: 'left',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
          { label: 'Justificado', value: 'justify' },
        ]
      },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'lineHeight', label: 'Altura da Linha', type: 'select', group: 'style',
        options: [
          { label: 'Compacto', value: 'leading-tight' },
          { label: 'Normal', value: 'leading-normal' },
          { label: 'Relaxado', value: 'leading-relaxed' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'heading-inline': {
    label: 'Título Inline',
    fields: [
      { key: 'content', label: 'Texto do Título', type: 'text', group: 'content', defaultValue: 'Seu Título Aqui' },
      { key: 'level', label: 'Nível do Título', type: 'select', group: 'content', defaultValue: 'h2',
        options: [
          { label: 'H1 - Principal', value: 'h1' },
          { label: 'H2 - Seção', value: 'h2' },
          { label: 'H3 - Subseção', value: 'h3' },
          { label: 'H4 - Detalhes', value: 'h4' },
          { label: 'H5 - Menor', value: 'h5' },
          { label: 'H6 - Mínimo', value: 'h6' },
        ]
      },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', group: 'style', defaultValue: 'text-2xl',
        options: [
          { label: 'Grande', value: 'text-lg' },
          { label: 'XL', value: 'text-xl' },
          { label: '2XL', value: 'text-2xl' },
          { label: '3XL', value: 'text-3xl' },
          { label: '4XL', value: 'text-4xl' },
          { label: '5XL', value: 'text-5xl' },
          { label: '6XL', value: 'text-6xl' },
        ]
      },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', defaultValue: 'font-bold',
        options: [
          { label: 'Normal', value: 'font-normal' },
          { label: 'Médio', value: 'font-medium' },
          { label: 'Semi-negrito', value: 'font-semibold' },
          { label: 'Negrito', value: 'font-bold' },
          { label: 'Extra Negrito', value: 'font-extrabold' },
        ]
      },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ]
      },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#1F2937' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // IMAGE BLOCKS - All image variations covered
  // ============================================================================

  'image-inline': {
    label: 'Imagem Inline',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text', group: 'content', required: true, defaultValue: 'https://via.placeholder.com/400x300' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text', group: 'content', defaultValue: 'Imagem' },
      { key: 'width', label: 'Largura', type: 'range', min: 50, max: 800, group: 'layout', defaultValue: 400 },
      { key: 'height', label: 'Altura', type: 'range', min: 50, max: 600, group: 'layout', defaultValue: 300 },
      { key: 'objectFit', label: 'Ajuste da Imagem', type: 'select', group: 'style', defaultValue: 'cover',
        options: [
          { label: 'Cobrir', value: 'cover' },
          { label: 'Conter', value: 'contain' },
          { label: 'Preencher', value: 'fill' },
          { label: 'Nenhum', value: 'none' },
        ]
      },
      { key: 'containerPosition', label: 'Posição do Container', type: 'select', group: 'layout', defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ]
      },
      { key: 'borderWidth', label: 'Largura da Borda', type: 'range', min: 0, max: 10, group: 'style', defaultValue: 0 },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#E5E7EB' },
      { key: 'shadow', label: 'Sombra', type: 'select', group: 'style',
        options: [
          { label: 'Nenhuma', value: 'shadow-none' },
          { label: 'Pequena', value: 'shadow-sm' },
          { label: 'Normal', value: 'shadow' },
          { label: 'Média', value: 'shadow-md' },
          { label: 'Grande', value: 'shadow-lg' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'image-display-inline': {
    label: 'Display de Imagem',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text', group: 'content', required: true },
      { key: 'alt', label: 'Texto Alternativo', type: 'text', group: 'content' },
      { key: 'caption', label: 'Legenda', type: 'text', group: 'content' },
      { key: 'showCaption', label: 'Mostrar Legenda', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'width', label: 'Largura', type: 'range', min: 100, max: 1200, group: 'layout', defaultValue: 600 },
      { key: 'height', label: 'Altura', type: 'range', min: 100, max: 800, group: 'layout', defaultValue: 400 },
      { key: 'aspectRatio', label: 'Proporção', type: 'select', group: 'layout',
        options: [
          { label: 'Quadrado (1:1)', value: 'aspect-square' },
          { label: 'Video (16:9)', value: 'aspect-video' },
          { label: 'Retrato (3:4)', value: 'aspect-[3/4]' },
          { label: 'Paisagem (4:3)', value: 'aspect-[4/3]' },
          { label: 'Auto', value: 'auto' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // BUTTON BLOCKS - All button variations covered
  // ============================================================================

  'button-inline': {
    label: 'Botão Inline',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Clique aqui' },
      { key: 'url', label: 'URL/Link', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'variant', label: 'Variação', type: 'select', group: 'style', defaultValue: 'primary',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Destrutivo', value: 'destructive' },
        ]
      },
      { key: 'size', label: 'Tamanho', type: 'select', group: 'style', defaultValue: 'default',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Padrão', value: 'default' },
          { label: 'Grande', value: 'lg' },
          { label: 'XL', value: 'xl' },
        ]
      },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', group: 'layout', defaultValue: false },
      { key: 'disabled', label: 'Desabilitado', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'loading', label: 'Estado de Loading', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'requiresValidInput', label: 'Requer Input Válido', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'requiresValidSelection', label: 'Requer Seleção Válida', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'disabledText', label: 'Texto Quando Desabilitado', type: 'text', group: 'content' },
      { key: 'loadingText', label: 'Texto de Loading', type: 'text', group: 'content', defaultValue: 'Carregando...' },
      { key: 'iconLeft', label: 'Ícone à Esquerda', type: 'text', group: 'content' },
      { key: 'iconRight', label: 'Ícone à Direita', type: 'text', group: 'content' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // FORM BLOCKS - All form variations covered
  // ============================================================================

  'form-input': {
    label: 'Campo de Formulário',
    fields: [
      { key: 'name', label: 'Nome do Campo', type: 'text', group: 'content', required: true, defaultValue: 'name' },
      { key: 'label', label: 'Label', type: 'text', group: 'content', defaultValue: 'Nome' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', group: 'content', defaultValue: 'Digite seu nome' },
      { key: 'inputType', label: 'Tipo de Input', type: 'select', group: 'content', defaultValue: 'text',
        options: [
          { label: 'Texto', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Telefone', value: 'tel' },
          { label: 'Número', value: 'number' },
          { label: 'Senha', value: 'password' },
          { label: 'URL', value: 'url' },
        ]
      },
      { key: 'required', label: 'Obrigatório', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'disabled', label: 'Desabilitado', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'maxLength', label: 'Tamanho Máximo', type: 'range', min: 1, max: 500, group: 'behavior' },
      { key: 'minLength', label: 'Tamanho Mínimo', type: 'range', min: 0, max: 50, group: 'behavior' },
      { key: 'validation', label: 'Validação em Tempo Real', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showError', label: 'Mostrar Erro', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'errorMessage', label: 'Mensagem de Erro', type: 'text', group: 'content' },
      { key: 'helperText', label: 'Texto de Ajuda', type: 'text', group: 'content' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#D1D5DB' },
      { key: 'focusColor', label: 'Cor do Focus', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'lead-form': {
    label: 'Formulário de Lead',
    fields: [
      { key: 'title', label: 'Título do Formulário', type: 'text', group: 'content', defaultValue: 'Entre em contato' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content' },
      { key: 'showNameField', label: 'Mostrar Campo Nome', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'showEmailField', label: 'Mostrar Campo Email', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'showPhoneField', label: 'Mostrar Campo Telefone', type: 'boolean', group: 'content', defaultValue: false },
      { key: 'nameLabel', label: 'Label do Nome', type: 'text', group: 'content', defaultValue: 'Nome completo' },
      { key: 'emailLabel', label: 'Label do Email', type: 'text', group: 'content', defaultValue: 'E-mail' },
      { key: 'phoneLabel', label: 'Label do Telefone', type: 'text', group: 'content', defaultValue: 'Telefone' },
      { key: 'namePlaceholder', label: 'Placeholder do Nome', type: 'text', group: 'content', defaultValue: 'Seu nome completo' },
      { key: 'emailPlaceholder', label: 'Placeholder do Email', type: 'text', group: 'content', defaultValue: 'seu@email.com' },
      { key: 'phonePlaceholder', label: 'Placeholder do Telefone', type: 'text', group: 'content', defaultValue: '(11) 99999-9999' },
      { key: 'submitText', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Enviar' },
      { key: 'loadingText', label: 'Texto de Loading', type: 'text', group: 'content', defaultValue: 'Enviando...' },
      { key: 'successText', label: 'Texto de Sucesso', type: 'text', group: 'content', defaultValue: 'Enviado com sucesso!' },
      { key: 'requiredFields', label: 'Campos Obrigatórios', type: 'select', group: 'behavior',
        options: [
          { label: 'Apenas Nome', value: 'name' },
          { label: 'Nome + Email', value: 'name,email' },
          { label: 'Todos os Campos', value: 'name,email,phone' },
        ]
      },
      { key: 'primaryColor', label: 'Cor Primária', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      { key: 'fieldSpacing', label: 'Espaçamento entre Campos', type: 'range', min: 8, max: 32, group: 'layout', defaultValue: 16 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'form-container': {
    label: 'Container de Formulário',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content' },
      { key: 'showBorder', label: 'Mostrar Borda', type: 'boolean', group: 'style', defaultValue: true },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#E5E7EB' },
      { key: 'borderRadius', label: 'Arredondamento da Borda', type: 'range', min: 0, max: 24, group: 'style', defaultValue: 8 },
      { key: 'showShadow', label: 'Mostrar Sombra', type: 'boolean', group: 'style', defaultValue: true },
      { key: 'shadowIntensity', label: 'Intensidade da Sombra', type: 'select', group: 'style',
        options: [
          { label: 'Sutil', value: 'shadow-sm' },
          { label: 'Normal', value: 'shadow' },
          { label: 'Média', value: 'shadow-md' },
          { label: 'Grande', value: 'shadow-lg' },
        ]
      },
      { key: 'maxWidth', label: 'Largura Máxima', type: 'select', group: 'layout',
        options: [
          { label: 'Pequeno', value: 'max-w-sm' },
          { label: 'Médio', value: 'max-w-md' },
          { label: 'Grande', value: 'max-w-lg' },
          { label: 'Extra Grande', value: 'max-w-xl' },
          { label: 'Completo', value: 'max-w-full' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // RESULT BLOCKS - Quiz result variations
  // ============================================================================

  'result-header-inline': {
    label: 'Cabeçalho de Resultado',
    fields: [
      { key: 'title', label: 'Título do Resultado', type: 'text', group: 'content', defaultValue: 'Seu estilo ideal é:' },
      { key: 'resultName', label: 'Nome do Resultado', type: 'text', group: 'content', defaultValue: 'Estilo Clássico' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content', defaultValue: 'Você tem preferências por looks elegantes e atemporais' },
      { key: 'confidence', label: 'Nível de Confiança (%)', type: 'range', min: 0, max: 100, group: 'content', defaultValue: 95 },
      { key: 'showConfidence', label: 'Mostrar Confiança', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showBadge', label: 'Mostrar Badge', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'badgeText', label: 'Texto do Badge', type: 'text', group: 'content', defaultValue: 'RESULTADO' },
      { key: 'badgeColor', label: 'Cor do Badge', type: 'color', group: 'style', defaultValue: '#10B981' },
      { key: 'resultImage', label: 'Imagem do Resultado', type: 'text', group: 'content' },
      { key: 'showResultImage', label: 'Mostrar Imagem', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'style-card-inline': {
    label: 'Card de Estilo',
    fields: [
      { key: 'title', label: 'Título do Card', type: 'text', group: 'content', defaultValue: 'Seu Estilo' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content', defaultValue: 'Descrição do seu estilo personalizado' },
      { key: 'imageUrl', label: 'Imagem do Estilo', type: 'text', group: 'content' },
      { key: 'showImage', label: 'Mostrar Imagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Ver mais detalhes' },
      { key: 'link', label: 'Link do Botão', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'showButton', label: 'Mostrar Botão', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'cardStyle', label: 'Estilo do Card', type: 'select', group: 'style', defaultValue: 'elevated',
        options: [
          { label: 'Elevado', value: 'elevated' },
          { label: 'Com Borda', value: 'bordered' },
          { label: 'Plano', value: 'flat' },
          { label: 'Gradiente', value: 'gradient' },
        ]
      },
      { key: 'imagePosition', label: 'Posição da Imagem', type: 'select', group: 'layout', defaultValue: 'top',
        options: [
          { label: 'Topo', value: 'top' },
          { label: 'Esquerda', value: 'left' },
          { label: 'Direita', value: 'right' },
          { label: 'Fundo', value: 'background' },
        ]
      },
      { key: 'padding', label: 'Padding Interno', type: 'range', min: 8, max: 48, group: 'layout', defaultValue: 24 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'style-cards-grid': {
    label: 'Grade de Cards de Estilo',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'Outros estilos para você' },
      { key: 'cards', label: 'Cards', type: 'options-list', group: 'content',
        defaultValue: [
          { title: 'Estilo 1', description: 'Descrição do estilo 1', imageUrl: '', link: '#' },
          { title: 'Estilo 2', description: 'Descrição do estilo 2', imageUrl: '', link: '#' },
        ]
      },
      { key: 'columns', label: 'Número de Colunas', type: 'select', group: 'layout', defaultValue: 2,
        options: [
          { label: '1 Coluna', value: 1 },
          { label: '2 Colunas', value: 2 },
          { label: '3 Colunas', value: 3 },
          { label: '4 Colunas', value: 4 },
        ]
      },
      { key: 'gap', label: 'Espaçamento entre Cards', type: 'range', min: 8, max: 48, step: 4, group: 'layout', defaultValue: 24 },
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'cardRadius', label: 'Arredondamento dos Cards', type: 'range', min: 0, max: 24, group: 'style', defaultValue: 12 },
      { key: 'uniformHeight', label: 'Altura Uniforme', type: 'boolean', group: 'layout', defaultValue: true },
      { key: 'hoverEffect', label: 'Efeito de Hover', type: 'select', group: 'style', defaultValue: 'lift',
        options: [
          { label: 'Elevar', value: 'lift' },
          { label: 'Escalar', value: 'scale' },
          { label: 'Nenhum', value: 'none' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // DECORATIVE & UI BLOCKS
  // ============================================================================

  'decorative-bar-inline': {
    label: 'Barra Decorativa',
    fields: [
      { key: 'width', label: 'Largura', type: 'select', group: 'layout', defaultValue: 'w-full',
        options: [
          { label: '25%', value: 'w-1/4' },
          { label: '50%', value: 'w-1/2' },
          { label: '75%', value: 'w-3/4' },
          { label: '100%', value: 'w-full' },
          { label: 'Personalizado', value: 'custom' },
        ]
      },
      { key: 'customWidth', label: 'Largura Personalizada (px)', type: 'range', min: 50, max: 800, group: 'layout', defaultValue: 200 },
      { key: 'height', label: 'Altura (px)', type: 'range', min: 2, max: 20, group: 'layout', defaultValue: 4 },
      { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#B89B7A' },
      { key: 'gradientEnd', label: 'Cor Final (Gradiente)', type: 'color', group: 'style' },
      { key: 'isGradient', label: 'Usar Gradiente', type: 'boolean', group: 'style', defaultValue: false },
      { key: 'borderRadius', label: 'Arredondamento', type: 'range', min: 0, max: 20, group: 'style', defaultValue: 2 },
      { key: 'position', label: 'Posição', type: 'select', group: 'layout', defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'progress-inline': {
    label: 'Barra de Progresso',
    fields: [
      { key: 'value', label: 'Valor Atual', type: 'range', min: 0, max: 100, group: 'content', defaultValue: 50 },
      { key: 'max', label: 'Valor Máximo', type: 'range', min: 1, max: 100, group: 'content', defaultValue: 100 },
      { key: 'showPercentage', label: 'Mostrar Porcentagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showLabel', label: 'Mostrar Label', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'label', label: 'Texto do Label', type: 'text', group: 'content', defaultValue: 'Progresso' },
      { key: 'height', label: 'Altura da Barra', type: 'range', min: 4, max: 32, group: 'layout', defaultValue: 8 },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#F3F4F6' },
      { key: 'progressColor', label: 'Cor do Progresso', type: 'color', group: 'style', defaultValue: '#10B981' },
      { key: 'borderRadius', label: 'Arredondamento', type: 'range', min: 0, max: 16, group: 'style', defaultValue: 4 },
      { key: 'animated', label: 'Animação', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'striped', label: 'Listras', type: 'boolean', group: 'style', defaultValue: false },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'loader-inline': {
    label: 'Indicador de Loading',
    fields: [
      { key: 'type', label: 'Tipo de Loader', type: 'select', group: 'style', defaultValue: 'spinner',
        options: [
          { label: 'Spinner', value: 'spinner' },
          { label: 'Dots', value: 'dots' },
          { label: 'Bars', value: 'bars' },
          { label: 'Pulse', value: 'pulse' },
        ]
      },
      { key: 'size', label: 'Tamanho', type: 'select', group: 'layout', defaultValue: 'medium',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' },
        ]
      },
      { key: 'color', label: 'Cor Principal', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      { key: 'speed', label: 'Velocidade', type: 'select', group: 'behavior', defaultValue: 'normal',
        options: [
          { label: 'Lenta', value: 'slow' },
          { label: 'Normal', value: 'normal' },
          { label: 'Rápida', value: 'fast' },
        ]
      },
      { key: 'text', label: 'Texto do Loading', type: 'text', group: 'content', defaultValue: 'Carregando...' },
      { key: 'showText', label: 'Mostrar Texto', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'textPosition', label: 'Posição do Texto', type: 'select', group: 'layout', defaultValue: 'bottom',
        options: [
          { label: 'Acima', value: 'top' },
          { label: 'Abaixo', value: 'bottom' },
          { label: 'Direita', value: 'right' },
          { label: 'Esquerda', value: 'left' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // OFFER & CTA BLOCKS - Step 21 Complete Coverage
  // ============================================================================

  'urgency-timer-inline': {
    label: 'Timer de Urgência',
    fields: [
      { key: 'endTime', label: 'Data/Hora Final', type: 'text', group: 'content', required: true, defaultValue: '2024-12-31T23:59:59' },
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Oferta por tempo limitado!' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content', defaultValue: 'Garanta seu desconto agora' },
      { key: 'showDays', label: 'Mostrar Dias', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showHours', label: 'Mostrar Horas', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showMinutes', label: 'Mostrar Minutos', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showSeconds', label: 'Mostrar Segundos', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'format', label: 'Formato', type: 'select', group: 'style', defaultValue: 'boxes',
        options: [
          { label: 'Caixas', value: 'boxes' },
          { label: 'Texto', value: 'text' },
          { label: 'Círculos', value: 'circles' },
        ]
      },
      { key: 'size', label: 'Tamanho', type: 'select', group: 'layout', defaultValue: 'medium',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' },
        ]
      },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#FFFFFF' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#DC2626' },
      { key: 'accentColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#FBBF24' },
      { key: 'expiredText', label: 'Texto Quando Expirado', type: 'text', group: 'content', defaultValue: 'Oferta expirada!' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'before-after-inline': {
    label: 'Antes e Depois',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'Transformação Garantida' },
      { key: 'beforeTitle', label: 'Título do "Antes"', type: 'text', group: 'content', defaultValue: 'Antes' },
      { key: 'afterTitle', label: 'Título do "Depois"', type: 'text', group: 'content', defaultValue: 'Depois' },
      { key: 'beforeImage', label: 'Imagem "Antes"', type: 'text', group: 'content' },
      { key: 'afterImage', label: 'Imagem "Depois"', type: 'text', group: 'content' },
      { key: 'beforeDescription', label: 'Descrição "Antes"', type: 'textarea', group: 'content' },
      { key: 'afterDescription', label: 'Descrição "Depois"', type: 'textarea', group: 'content' },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'side-by-side',
        options: [
          { label: 'Lado a Lado', value: 'side-by-side' },
          { label: 'Empilhado', value: 'stacked' },
          { label: 'Slider', value: 'slider' },
        ]
      },
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showDescriptions', label: 'Mostrar Descrições', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'imageAspectRatio', label: 'Proporção da Imagem', type: 'select', group: 'layout',
        options: [
          { label: 'Quadrado', value: 'aspect-square' },
          { label: 'Retrato (3:4)', value: 'aspect-[3/4]' },
          { label: 'Paisagem (4:3)', value: 'aspect-[4/3]' },
          { label: 'Auto', value: 'auto' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'bonus-inline': {
    label: 'Seção de Bônus',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'Bônus Exclusivos' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content', defaultValue: 'Receba esses bônus incríveis junto com sua compra' },
      { key: 'bonuses', label: 'Lista de Bônus', type: 'options-list', group: 'content',
        defaultValue: [
          { title: 'Bônus 1', description: 'Descrição do bônus 1', value: 'R$ 297', image: '' },
          { title: 'Bônus 2', description: 'Descrição do bônus 2', value: 'R$ 197', image: '' },
        ]
      },
      { key: 'layout', label: 'Layout dos Bônus', type: 'select', group: 'layout', defaultValue: 'grid',
        options: [
          { label: 'Lista Vertical', value: 'list' },
          { label: 'Grade', value: 'grid' },
          { label: 'Carrossel', value: 'carousel' },
        ]
      },
      { key: 'columns', label: 'Colunas (Grid)', type: 'select', group: 'layout', defaultValue: 2,
        options: [
          { label: '1 Coluna', value: 1 },
          { label: '2 Colunas', value: 2 },
          { label: '3 Colunas', value: 3 },
        ]
      },
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showValues', label: 'Mostrar Valores', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'totalValue', label: 'Valor Total dos Bônus', type: 'text', group: 'content', defaultValue: 'R$ 494' },
      { key: 'showTotalValue', label: 'Mostrar Valor Total', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'accentColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#10B981' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'value-anchoring': {
    label: 'Ancoragem de Valor',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Valor Completo' },
      { key: 'originalPrice', label: 'Preço Original', type: 'text', group: 'content', defaultValue: 'R$ 997' },
      { key: 'discountedPrice', label: 'Preço com Desconto', type: 'text', group: 'content', defaultValue: 'R$ 297' },
      { key: 'savings', label: 'Economia', type: 'text', group: 'content', defaultValue: 'R$ 700' },
      { key: 'savingsPercentage', label: 'Porcentagem de Desconto', type: 'text', group: 'content', defaultValue: '70%' },
      { key: 'showOriginalPrice', label: 'Mostrar Preço Original', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showSavings', label: 'Mostrar Economia', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showPercentage', label: 'Mostrar Porcentagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'horizontal',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Card', value: 'card' },
        ]
      },
      { key: 'highlightStyle', label: 'Estilo de Destaque', type: 'select', group: 'style', defaultValue: 'badge',
        options: [
          { label: 'Badge', value: 'badge' },
          { label: 'Tachado', value: 'strikethrough' },
          { label: 'Cor Diferente', value: 'color' },
        ]
      },
      { key: 'accentColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#DC2626' },
      { key: 'discountColor', label: 'Cor do Desconto', type: 'color', group: 'style', defaultValue: '#10B981' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'secure-purchase': {
    label: 'Compra Segura',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Compra 100% Segura' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content', defaultValue: 'Seus dados estão protegidos com a mais alta segurança' },
      { key: 'features', label: 'Recursos de Segurança', type: 'options-list', group: 'content',
        defaultValue: [
          { icon: '🔒', title: 'SSL Criptografado', description: 'Dados protegidos com SSL 256-bit' },
          { icon: '🛡️', title: 'Garantia de 7 dias', description: 'Satisfação garantida ou seu dinheiro de volta' },
          { icon: '💳', title: 'Pagamento Seguro', description: 'Processamento via Stripe/PayPal' },
        ]
      },
      { key: 'showIcons', label: 'Mostrar Ícones', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showBadges', label: 'Mostrar Badges de Segurança', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'badges', label: 'Badges de Segurança', type: 'options-list', group: 'content',
        defaultValue: [
          { image: 'ssl-badge.png', alt: 'SSL Secure' },
          { image: 'money-back.png', alt: 'Money Back Guarantee' },
        ]
      },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'horizontal',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Grade', value: 'grid' },
        ]
      },
      { key: 'trustColor', label: 'Cor de Confiança', type: 'color', group: 'style', defaultValue: '#10B981' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'mentor-section-inline': {
    label: 'Seção da Mentora',
    fields: [
      { key: 'name', label: 'Nome da Mentora', type: 'text', group: 'content', defaultValue: 'Ana Silva' },
      { key: 'title', label: 'Título/Cargo', type: 'text', group: 'content', defaultValue: 'Consultora de Estilo' },
      { key: 'photo', label: 'Foto da Mentora', type: 'text', group: 'content' },
      { key: 'bio', label: 'Biografia', type: 'textarea', group: 'content', defaultValue: 'Especialista em consultoria de estilo com mais de 10 anos de experiência' },
      { key: 'credentials', label: 'Credenciais', type: 'options-list', group: 'content',
        defaultValue: [
          { text: '+500 clientes atendidas' },
          { text: 'Certificada em Personal Styling' },
          { text: 'Featured na Revista Vogue' },
        ]
      },
      { key: 'testimonial', label: 'Depoimento/Mensagem', type: 'textarea', group: 'content', defaultValue: '"Estou aqui para te ajudar a descobrir seu estilo único."' },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'side-by-side',
        options: [
          { label: 'Lado a Lado', value: 'side-by-side' },
          { label: 'Foto no Topo', value: 'photo-top' },
          { label: 'Centrado', value: 'centered' },
        ]
      },
      { key: 'photoPosition', label: 'Posição da Foto', type: 'select', group: 'layout', defaultValue: 'left',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Direita', value: 'right' },
          { label: 'Centro', value: 'center' },
        ]
      },
      { key: 'showCredentials', label: 'Mostrar Credenciais', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'photoSize', label: 'Tamanho da Foto', type: 'select', group: 'layout', defaultValue: 'medium',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' },
        ]
      },
      { key: 'accentColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#B89B7A' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // LEGAL & NOTICE BLOCKS
  // ============================================================================

  'legal-notice-inline': {
    label: 'Aviso Legal',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Aviso Legal' },
      { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', defaultValue: 'Este é um aviso legal importante.' },
      { key: 'type', label: 'Tipo de Aviso', type: 'select', group: 'content', defaultValue: 'privacy',
        options: [
          { label: 'Privacidade', value: 'privacy' },
          { label: 'Termos de Uso', value: 'terms' },
          { label: 'LGPD/GDPR', value: 'gdpr' },
          { label: 'Disclaimer', value: 'disclaimer' },
          { label: 'Personalizado', value: 'custom' },
        ]
      },
      { key: 'showIcon', label: 'Mostrar Ícone', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'icon', label: 'Ícone Personalizado', type: 'text', group: 'content' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', group: 'style', defaultValue: 'text-sm',
        options: [
          { label: 'Extra Pequeno', value: 'text-xs' },
          { label: 'Pequeno', value: 'text-sm' },
          { label: 'Normal', value: 'text-base' },
        ]
      },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', defaultValue: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ]
      },
      { key: 'opacity', label: 'Opacidade', type: 'range', min: 30, max: 100, group: 'style', defaultValue: 70 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // ADVANCED & CONNECTED BLOCKS
  // ============================================================================

  'connected-lead-form': {
    label: 'Formulário Conectado',
    fields: [
      { key: 'formType', label: 'Tipo de Formulário', type: 'select', group: 'content', defaultValue: 'lead',
        options: [
          { label: 'Captura de Lead', value: 'lead' },
          { label: 'Contato', value: 'contact' },
          { label: 'Newsletter', value: 'newsletter' },
          { label: 'Agendamento', value: 'booking' },
        ]
      },
      { key: 'integration', label: 'Integração', type: 'select', group: 'content', defaultValue: 'supabase',
        options: [
          { label: 'Supabase', value: 'supabase' },
          { label: 'Mailchimp', value: 'mailchimp' },
          { label: 'HubSpot', value: 'hubspot' },
          { label: 'Zapier', value: 'zapier' },
        ]
      },
      { key: 'webhook', label: 'URL do Webhook', type: 'text', group: 'content' },
      { key: 'redirectUrl', label: 'URL de Redirecionamento', type: 'text', group: 'content' },
      { key: 'enableValidation', label: 'Validação em Tempo Real', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'enableTracking', label: 'Rastreamento de Eventos', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'trackingId', label: 'ID do Tracking', type: 'text', group: 'content' },
      { key: 'autoResponse', label: 'Resposta Automática', type: 'boolean', group: 'behavior', defaultValue: false },
      { key: 'autoResponseMessage', label: 'Mensagem da Resposta', type: 'textarea', group: 'content' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'connected-template-wrapper': {
    label: 'Wrapper de Template',
    fields: [
      { key: 'templateKey', label: 'Chave do Template', type: 'text', group: 'content', required: true },
      { key: 'variant', label: 'Variante', type: 'select', group: 'content', defaultValue: 'default',
        options: [
          { label: 'Padrão', value: 'default' },
          { label: 'Compacto', value: 'compact' },
          { label: 'Expandido', value: 'expanded' },
          { label: 'Personalizado', value: 'custom' },
        ]
      },
      { key: 'dataSource', label: 'Fonte de Dados', type: 'select', group: 'content', defaultValue: 'static',
        options: [
          { label: 'Estático', value: 'static' },
          { label: 'API', value: 'api' },
          { label: 'Supabase', value: 'supabase' },
          { label: 'Local Storage', value: 'localStorage' },
        ]
      },
      { key: 'apiEndpoint', label: 'Endpoint da API', type: 'text', group: 'content' },
      { key: 'refreshInterval', label: 'Intervalo de Atualização (s)', type: 'range', min: 0, max: 300, group: 'behavior', defaultValue: 0 },
      { key: 'enableCache', label: 'Habilitar Cache', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'cacheTimeout', label: 'Timeout do Cache (min)', type: 'range', min: 1, max: 60, group: 'behavior', defaultValue: 15 },
      { key: 'errorFallback', label: 'Fallback em Erro', type: 'textarea', group: 'content' },
      { key: 'loadingComponent', label: 'Componente de Loading', type: 'text', group: 'content', defaultValue: 'loader-inline' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'quiz-navigation': {
    label: 'Navegação do Quiz',
    fields: [
      { key: 'showPrevious', label: 'Mostrar Botão Anterior', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showNext', label: 'Mostrar Botão Próximo', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showStepNumbers', label: 'Mostrar Números das Etapas', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'previousText', label: 'Texto do Botão Anterior', type: 'text', group: 'content', defaultValue: 'Anterior' },
      { key: 'nextText', label: 'Texto do Botão Próximo', type: 'text', group: 'content', defaultValue: 'Próximo' },
      { key: 'finishText', label: 'Texto do Botão Finalizar', type: 'text', group: 'content', defaultValue: 'Finalizar' },
      { key: 'currentStep', label: 'Etapa Atual', type: 'range', min: 1, max: 21, group: 'content', defaultValue: 1 },
      { key: 'totalSteps', label: 'Total de Etapas', type: 'range', min: 1, max: 21, group: 'content', defaultValue: 21 },
      { key: 'progressType', label: 'Tipo de Progresso', type: 'select', group: 'style', defaultValue: 'bar',
        options: [
          { label: 'Barra', value: 'bar' },
          { label: 'Círculo', value: 'circle' },
          { label: 'Steps', value: 'steps' },
          { label: 'Contador', value: 'counter' },
        ]
      },
      { key: 'alignment', label: 'Alinhamento', type: 'select', group: 'layout', defaultValue: 'space-between',
        options: [
          { label: 'Espaçado', value: 'space-between' },
          { label: 'Centro', value: 'center' },
          { label: 'Esquerda', value: 'flex-start' },
          { label: 'Direita', value: 'flex-end' },
        ]
      },
      { key: 'buttonStyle', label: 'Estilo dos Botões', type: 'select', group: 'style', defaultValue: 'default',
        options: [
          { label: 'Padrão', value: 'default' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Personalizado', value: 'custom' },
        ]
      },
      { key: 'enableKeyboard', label: 'Navegação por Teclado', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'autoSave', label: 'Auto-salvar Progresso', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'gradient-animation': {
    label: 'Gradiente Animado',
    fields: [
      { key: 'color1', label: 'Cor 1', type: 'color', group: 'style', defaultValue: '#667eea' },
      { key: 'color2', label: 'Cor 2', type: 'color', group: 'style', defaultValue: '#764ba2' },
      { key: 'color3', label: 'Cor 3 (Opcional)', type: 'color', group: 'style' },
      { key: 'color4', label: 'Cor 4 (Opcional)', type: 'color', group: 'style' },
      { key: 'direction', label: 'Direção', type: 'select', group: 'style', defaultValue: 'to-r',
        options: [
          { label: 'Horizontal (→)', value: 'to-r' },
          { label: 'Vertical (↓)', value: 'to-b' },
          { label: 'Diagonal (↘)', value: 'to-br' },
          { label: 'Diagonal (↙)', value: 'to-bl' },
          { label: 'Radial', value: 'radial' },
        ]
      },
      { key: 'animationType', label: 'Tipo de Animação', type: 'select', group: 'behavior', defaultValue: 'shift',
        options: [
          { label: 'Shift', value: 'shift' },
          { label: 'Pulse', value: 'pulse' },
          { label: 'Rotate', value: 'rotate' },
          { label: 'Wave', value: 'wave' },
          { label: 'Nenhuma', value: 'none' },
        ]
      },
      { key: 'speed', label: 'Velocidade', type: 'select', group: 'behavior', defaultValue: 'medium',
        options: [
          { label: 'Muito Lenta', value: 'very-slow' },
          { label: 'Lenta', value: 'slow' },
          { label: 'Média', value: 'medium' },
          { label: 'Rápida', value: 'fast' },
          { label: 'Muito Rápida', value: 'very-fast' },
        ]
      },
      { key: 'intensity', label: 'Intensidade', type: 'range', min: 10, max: 100, group: 'style', defaultValue: 60 },
      { key: 'blur', label: 'Desfoque', type: 'range', min: 0, max: 100, group: 'style', defaultValue: 20 },
      { key: 'opacity', label: 'Opacidade', type: 'range', min: 10, max: 100, group: 'style', defaultValue: 80 },
      { key: 'width', label: 'Largura', type: 'select', group: 'layout', defaultValue: 'w-full',
        options: [
          { label: '25%', value: 'w-1/4' },
          { label: '50%', value: 'w-1/2' },
          { label: '75%', value: 'w-3/4' },
          { label: '100%', value: 'w-full' },
        ]
      },
      { key: 'height', label: 'Altura (px)', type: 'range', min: 50, max: 500, group: 'layout', defaultValue: 200 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  // ============================================================================
  // CONTAINER & LAYOUT BLOCKS
  // ============================================================================

  // ============================================================================
  // MISSING SCHEMAS FROM BLOCK_DEFINITIONS
  // ============================================================================

  'text': {
    label: 'Texto',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', defaultValue: 'Digite seu texto' },
      { key: 'text', label: 'Texto', type: 'textarea', group: 'content', defaultValue: 'Texto descritivo...' },
      { key: 'html', label: 'HTML', type: 'textarea', group: 'content', defaultValue: '<p>Texto com formatação</p>' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'select', group: 'style', defaultValue: 'base',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Normal', value: 'base' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra Grande', value: 'xl' },
        ]
      },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#334155' },
      { key: 'lineHeight', label: 'Altura da Linha', type: 'text', group: 'style', defaultValue: '1.6' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'range', min: 0, max: 100, group: 'layout', defaultValue: 16 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'button': {
    label: 'Botão',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Começar Quiz' },
      { key: 'icon', label: 'Ícone', type: 'text', group: 'content', defaultValue: 'arrow-right' },
      { key: 'variant', label: 'Variante', type: 'select', group: 'style', defaultValue: 'primary',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
        ]
      },
      { key: 'size', label: 'Tamanho', type: 'select', group: 'style', defaultValue: 'lg',
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'XL', value: 'xl' },
        ]
      },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', group: 'layout', defaultValue: true },
      { key: 'action', label: 'Ação', type: 'select', group: 'behavior', defaultValue: 'next',
        options: [
          { label: 'Próximo', value: 'next' },
          { label: 'Anterior', value: 'previous' },
          { label: 'Enviar', value: 'submit' },
          { label: 'Personalizado', value: 'custom' },
        ]
      },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#FFFFFF' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'quiz-question': {
    label: 'Pergunta do Quiz',
    fields: [
      { key: 'questionNumber', label: 'Número da Pergunta', type: 'text', group: 'content', defaultValue: 'Pergunta X de 10' },
      { key: 'questionText', label: 'Texto da Pergunta', type: 'textarea', group: 'content', defaultValue: 'Qual das opções abaixo mais combina com você?' },
      { key: 'subtitle', label: 'Subtítulo/Instrução', type: 'text', group: 'content', defaultValue: 'Selecione 3 opções' },
      { key: 'requiredSelections', label: 'Seleções Obrigatórias', type: 'range', min: 1, max: 10, group: 'behavior', defaultValue: 3 },
      { key: 'multipleChoice', label: 'Múltipla Escolha', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showCounter', label: 'Mostrar Contador', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: 'xl' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text', group: 'style', defaultValue: 'semibold' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
    ],
  },

  'quiz-options': {
    label: 'Opções de Resposta',
    fields: [
      { key: 'options', label: 'Lista de Opções', type: 'options-list', group: 'content',
        defaultValue: [
          { id: 'opt-1', text: 'Opção 1', image: '', value: 'romantico', points: 1 },
          { id: 'opt-2', text: 'Opção 2', image: '', value: 'classico', points: 1 },
        ]
      },
      { key: 'columns', label: 'Número de Colunas', type: 'range', min: 1, max: 4, group: 'layout', defaultValue: 3 },
      { key: 'gap', label: 'Espaçamento', type: 'text', group: 'layout', defaultValue: '1rem' },
      { key: 'aspectRatio', label: 'Proporção', type: 'text', group: 'layout', defaultValue: '1/1' },
      { key: 'hoverEffect', label: 'Efeito Hover', type: 'select', group: 'style', defaultValue: 'scale',
        options: [
          { label: 'Escalar', value: 'scale' },
          { label: 'Elevar', value: 'lift' },
          { label: 'Brilho', value: 'glow' },
          { label: 'Nenhum', value: 'none' },
        ]
      },
      { key: 'selectedBorderColor', label: 'Cor da Borda Selecionada', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      { key: 'selectedBorderWidth', label: 'Largura da Borda', type: 'text', group: 'style', defaultValue: '3px' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
    ],
  },

  'transition': {
    label: 'Transição/Loading',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Analisando suas respostas...' },
      { key: 'messages', label: 'Mensagens', type: 'options-list', group: 'content',
        defaultValue: [
          { text: 'Processando suas preferências' },
          { text: 'Identificando seu estilo' },
          { text: 'Preparando resultado personalizado' },
        ]
      },
      { key: 'duration', label: 'Duração (ms)', type: 'range', min: 1000, max: 10000, step: 500, group: 'behavior', defaultValue: 3000 },
      { key: 'autoProgress', label: 'Progresso Automático', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#FAF9F7' },
      { key: 'loaderType', label: 'Tipo de Loader', type: 'select', group: 'style', defaultValue: 'dots',
        options: [
          { label: 'Pontos', value: 'dots' },
          { label: 'Spinner', value: 'spinner' },
          { label: 'Barra', value: 'bar' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
    ],
  },

  'transition-result': {
    label: 'Transição para Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Preparando seu resultado...' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content', defaultValue: 'Em alguns segundos você descobrirá seu estilo predominante' },
      { key: 'duration', label: 'Duração (ms)', type: 'range', min: 1000, max: 5000, step: 500, group: 'behavior', defaultValue: 2000 },
      { key: 'autoProgress', label: 'Progresso Automático', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'showAnimation', label: 'Mostrar Animação', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'animationType', label: 'Tipo de Animação', type: 'select', group: 'style', defaultValue: 'fade-in',
        options: [
          { label: 'Fade In', value: 'fade-in' },
          { label: 'Slide Up', value: 'slide-up' },
          { label: 'Zoom', value: 'zoom' },
        ]
      },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
    ],
  },

  'result-headline': {
    label: 'Resultado Principal',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: '{userName}, seu estilo é:' },
      { key: 'resultVariable', label: 'Variável do Resultado', type: 'text', group: 'content', defaultValue: 'dominantStyle' },
      { key: 'celebrationEmoji', label: 'Emoji de Celebração', type: 'text', group: 'content', defaultValue: '🎉' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '3xl' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text', group: 'style', defaultValue: 'bold' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text', group: 'style', defaultValue: 'center' },
      { key: 'showConfetti', label: 'Mostrar Confetes', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'animateIn', label: 'Animar Entrada', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
    ],
  },

  'result-secondary-list': {
    label: 'Lista de Características',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Suas características:' },
      { key: 'items', label: 'Itens', type: 'options-list', group: 'content',
        defaultValue: [
          { text: 'Característica 1' },
          { text: 'Característica 2' },
          { text: 'Característica 3' },
        ]
      },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'vertical',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Grade', value: 'grid' },
        ]
      },
      { key: 'iconType', label: 'Tipo de Ícone', type: 'text', group: 'style', defaultValue: 'checkmark' },
      { key: 'iconColor', label: 'Cor do Ícone', type: 'color', group: 'style', defaultValue: '#10B981' },
      { key: 'spacing', label: 'Espaçamento', type: 'text', group: 'layout', defaultValue: '0.5rem' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
    ],
  },

  'result-description': {
    label: 'Descrição do Resultado',
    fields: [
      { key: 'text', label: 'Texto', type: 'textarea', group: 'content', defaultValue: 'Baseado nas suas respostas, você tem características...' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: 'base' },
      { key: 'lineHeight', label: 'Altura da Linha', type: 'text', group: 'style', defaultValue: '1.8' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text', group: 'style', defaultValue: 'left' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#F9FAFB' },
      { key: 'padding', label: 'Padding', type: 'text', group: 'layout', defaultValue: '1.5rem' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
    ],
  },

  'offer-core': {
    label: 'Oferta Principal',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Transforme Seu Guarda-Roupa' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content', defaultValue: 'Consultoria personalizada baseada no seu estilo' },
      { key: 'image', label: 'Imagem', type: 'text', group: 'content', defaultValue: 'https://via.placeholder.com/600x400' },
      { key: 'price', label: 'Preço', type: 'text', group: 'content', defaultValue: 'R$ 497' },
      { key: 'originalPrice', label: 'Preço Original', type: 'text', group: 'content', defaultValue: 'R$ 997' },
      { key: 'discount', label: 'Desconto', type: 'text', group: 'content', defaultValue: '50% OFF' },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', defaultValue: 'horizontal',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ]
      },
      { key: 'showBadge', label: 'Mostrar Badge', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'badgeText', label: 'Texto do Badge', type: 'text', group: 'content', defaultValue: 'OFERTA LIMITADA' },
      { key: 'badgeColor', label: 'Cor do Badge', type: 'color', group: 'style', defaultValue: '#EF4444' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#B89B7A' },
      { key: 'borderWidth', label: 'Largura da Borda', type: 'text', group: 'style', defaultValue: '2px' },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
    ],
  },

  'offer-urgency': {
    label: 'Urgência/Escassez',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Esta oferta expira em:' },
      { key: 'type', label: 'Tipo', type: 'select', group: 'content', defaultValue: 'countdown',
        options: [
          { label: 'Contagem Regressiva', value: 'countdown' },
          { label: 'Vagas Limitadas', value: 'limited' },
        ]
      },
      { key: 'endTime', label: 'Tempo Final', type: 'text', group: 'content', defaultValue: '+24h' },
      { key: 'urgencyMessage', label: 'Mensagem de Urgência', type: 'text', group: 'content', defaultValue: 'Restam apenas {count} vagas!' },
      { key: 'showCountdown', label: 'Mostrar Contagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'countdownSize', label: 'Tamanho do Contador', type: 'text', group: 'style', defaultValue: 'lg' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#FEF2F2' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#991B1B' },
      { key: 'pulsate', label: 'Pulsar', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
    ],
  },

  'checkout-button': {
    label: 'Botão de Checkout',
    fields: [
      { key: 'text', label: 'Texto Principal', type: 'text', group: 'content', defaultValue: 'QUERO TRANSFORMAR MEU ESTILO' },
      { key: 'subtext', label: 'Subtexto', type: 'text', group: 'content', defaultValue: 'Pagamento 100% seguro' },
      { key: 'icon', label: 'Ícone', type: 'text', group: 'content', defaultValue: 'lock' },
      { key: 'size', label: 'Tamanho', type: 'text', group: 'style', defaultValue: 'xl' },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean', group: 'layout', defaultValue: true },
      { key: 'variant', label: 'Variante', type: 'text', group: 'style', defaultValue: 'cta' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#10B981' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#FFFFFF' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: 'lg' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text', group: 'style', defaultValue: 'bold' },
      { key: 'pulseAnimation', label: 'Animação de Pulso', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
    ],
  },

  'image': {
    label: 'Imagem',
    fields: [
      { key: 'url', label: 'URL da Imagem', type: 'text', group: 'content', required: true, defaultValue: 'https://via.placeholder.com/800x600' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text', group: 'content', defaultValue: 'Imagem descritiva' },
      { key: 'width', label: 'Largura', type: 'text', group: 'layout', defaultValue: '100%' },
      { key: 'aspectRatio', label: 'Proporção', type: 'text', group: 'layout', defaultValue: '16/9' },
      { key: 'objectFit', label: 'Ajuste', type: 'select', group: 'style', defaultValue: 'cover',
        options: [
          { label: 'Cobrir', value: 'cover' },
          { label: 'Conter', value: 'contain' },
          { label: 'Preencher', value: 'fill' },
        ]
      },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
      { key: 'lazyLoad', label: 'Carregamento Preguiçoso', type: 'boolean', group: 'behavior', defaultValue: true },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },

  'divider': {
    label: 'Divisor',
    fields: [
      { key: 'width', label: 'Largura', type: 'text', group: 'layout', defaultValue: '100%' },
      { key: 'height', label: 'Altura', type: 'text', group: 'layout', defaultValue: '1px' },
      { key: 'backgroundColor', label: 'Cor', type: 'color', group: 'style', defaultValue: '#E5E7EB' },
      { key: 'margin', label: 'Margem', type: 'text', group: 'layout', defaultValue: '2rem 0' },
    ],
  },

  'spacer': {
    label: 'Espaçamento',
    fields: [
      { key: 'height', label: 'Altura', type: 'text', group: 'layout', defaultValue: '2rem' },
      { key: 'width', label: 'Largura', type: 'text', group: 'layout', defaultValue: '100%' },
    ],
  },

  'progress-bar': {
    label: 'Barra de Progresso',
    fields: [
      { key: 'currentStep', label: 'Etapa Atual', type: 'range', min: 1, max: 21, group: 'content', defaultValue: 1 },
      { key: 'totalSteps', label: 'Total de Etapas', type: 'range', min: 1, max: 21, group: 'content', defaultValue: 21 },
      { key: 'showPercentage', label: 'Mostrar Porcentagem', type: 'boolean', group: 'behavior', defaultValue: true },
      { key: 'height', label: 'Altura', type: 'text', group: 'layout', defaultValue: '8px' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#E5E7EB' },
      { key: 'fillColor', label: 'Cor de Preenchimento', type: 'color', group: 'style', defaultValue: '#3B82F6' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '9999px' },
      { key: 'position', label: 'Posição', type: 'text', group: 'layout', defaultValue: 'top' },
      { key: 'showLabels', label: 'Mostrar Labels', type: 'boolean', group: 'behavior', defaultValue: true },
    ],
  },

  'basic-container': {
    label: 'Container Básico',
    fields: [
      { key: 'maxWidth', label: 'Largura Máxima', type: 'select', group: 'layout', defaultValue: 'max-w-4xl',
        options: [
          { label: 'Pequeno (sm)', value: 'max-w-sm' },
          { label: 'Médio (md)', value: 'max-w-md' },
          { label: 'Grande (lg)', value: 'max-w-lg' },
          { label: 'Extra Grande (xl)', value: 'max-w-xl' },
          { label: '2XL', value: 'max-w-2xl' },
          { label: '4XL', value: 'max-w-4xl' },
          { label: '6XL', value: 'max-w-6xl' },
          { label: 'Completo', value: 'max-w-full' },
        ]
      },
      { key: 'centered', label: 'Centralizado', type: 'boolean', group: 'layout', defaultValue: true },
      { key: 'showBorder', label: 'Mostrar Borda', type: 'boolean', group: 'style', defaultValue: false },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#E5E7EB' },
      { key: 'borderWidth', label: 'Largura da Borda', type: 'range', min: 1, max: 8, group: 'style', defaultValue: 1 },
      { key: 'showShadow', label: 'Mostrar Sombra', type: 'boolean', group: 'style', defaultValue: false },
      { key: 'shadowSize', label: 'Tamanho da Sombra', type: 'select', group: 'style',
        options: [
          { label: 'Pequena', value: 'shadow-sm' },
          { label: 'Normal', value: 'shadow' },
          { label: 'Média', value: 'shadow-md' },
          { label: 'Grande', value: 'shadow-lg' },
          { label: 'Extra Grande', value: 'shadow-xl' },
        ]
      },
      { key: 'innerPadding', label: 'Padding Interno', type: 'range', min: 0, max: 48, step: 4, group: 'layout', defaultValue: 16 },
      { key: 'verticalSpacing', label: 'Espaçamento Vertical', type: 'range', min: 0, max: 48, step: 4, group: 'layout', defaultValue: 24 },
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
    ],
  },
};

// ============================================================================
// EXPORT MERGED SCHEMAS - Combine with existing blockPropertySchemas
// ============================================================================

import { blockPropertySchemas } from './blockPropertySchemas';

// Merge existing schemas with expanded schemas, giving priority to expanded
export const completeBlockSchemas: Record<string, BlockSchema> = {
  ...blockPropertySchemas,
  ...expandedBlockSchemas,
};

// Generate dynamic schemas for any missing blocks from ENHANCED_BLOCK_REGISTRY
export function generateFallbackSchema(blockType: string): BlockSchema {
  const categoryMappings = {
    'quiz': 'Quiz',
    'form': 'Formulário', 
    'button': 'Botão',
    'text': 'Texto',
    'image': 'Imagem',
    'result': 'Resultado',
    'offer': 'Oferta',
    'cta': 'Call to Action',
    'navigation': 'Navegação',
    'timer': 'Timer',
    'progress': 'Progresso',
    'loader': 'Carregamento',
  };

  // Determine category from block type
  let category = 'Componente';
  for (const [key, value] of Object.entries(categoryMappings)) {
    if (blockType.includes(key)) {
      category = value;
      break;
    }
  }

  return {
    label: `${category} (${blockType})`,
    fields: [
      // Universal properties that apply to all blocks
      ...UNIVERSAL_LAYOUT_PROPERTIES,
      ...UNIVERSAL_STYLING_PROPERTIES,
      ...UNIVERSAL_TRANSFORM_PROPERTIES,
      // Add common content properties based on block type
      ...(blockType.includes('text') || blockType.includes('heading') ? [
        { key: 'content', label: 'Conteúdo', type: 'textarea' as FieldType, group: 'content', defaultValue: 'Digite seu conteúdo aqui' }
      ] : []),
      ...(blockType.includes('image') ? [
        { key: 'src', label: 'URL da Imagem', type: 'text' as FieldType, group: 'content' },
        { key: 'alt', label: 'Texto Alternativo', type: 'text' as FieldType, group: 'content' }
      ] : []),
      ...(blockType.includes('button') ? [
        { key: 'text', label: 'Texto do Botão', type: 'text' as FieldType, group: 'content', defaultValue: 'Clique aqui' },
        { key: 'url', label: 'Link', type: 'text' as FieldType, group: 'content', defaultValue: '#' }
      ] : []),
    ],
  };
}

export default completeBlockSchemas;