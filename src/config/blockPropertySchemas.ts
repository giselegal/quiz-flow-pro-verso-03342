export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'range'
  | 'boolean'
  | 'color'
  | 'options-list'
  | 'select'
  | 'json';

export interface BlockFieldSchema {
  key: string;
  label: string;
  type: FieldType;
  options?: Array<{ label: string; value: string | number }>; // para selects
  min?: number;
  max?: number;
  step?: number;
  group?: string; // categoria/aba sugerida
  defaultValue?: any;
  required?: boolean;
  hidden?: boolean;
  showIf?: string; // expressão simples, ex: "showDescription === true"
  description?: string;
}

export interface BlockSchema {
  label: string;
  fields: BlockFieldSchema[];
}

export const blockPropertySchemas: Record<string, BlockSchema> = {
  // Schema universal aplicável a qualquer bloco (usado como extensão/aditivo)
  'universal-default': {
    label: 'Propriedades Universais',
    fields: [
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
        description:
          'Tamanho uniforme do bloco. 100% = tamanho natural. Use os presets para ajustes rápidos.',
      },
      {
        key: 'scaleX',
        label: 'Escala X (fator)',
        type: 'range',
        min: 0.1,
        max: 3,
        step: 0.01,
        group: 'transform',
        description:
          'Fator de escala apenas no eixo X (largura). Deixe vazio para usar a escala uniforme.',
      },
      {
        key: 'scaleY',
        label: 'Escala Y (fator)',
        type: 'range',
        min: 0.1,
        max: 3,
        step: 0.01,
        group: 'transform',
        description:
          'Fator de escala apenas no eixo Y (altura). Deixe vazio para usar a escala uniforme.',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo', value: 'top' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Topo Esquerda', value: 'top left' },
          { label: 'Topo Direita', value: 'top right' },
          { label: 'Centro Esquerda', value: 'center left' },
          { label: 'Centro Direita', value: 'center right' },
          { label: 'Base', value: 'bottom' },
          { label: 'Base Centro', value: 'bottom center' },
          { label: 'Base Esquerda', value: 'bottom left' },
          { label: 'Base Direita', value: 'bottom right' },
        ],
        group: 'transform',
      },
      {
        key: 'scaleClass',
        label: 'Classe Tailwind de Escala',
        type: 'text',
        group: 'transform',
        description: 'Opcional: ex. scale-95 md:scale-100',
      },
    ],
  },
  'quiz-intro-header': {
    label: 'Cabeçalho do Quiz',
    fields: [
      { key: 'logoUrl', label: 'Logo', type: 'text' },
      { key: 'logoAlt', label: 'Texto Alternativo', type: 'text' },
      { key: 'logoWidth', label: 'Largura do Logo', type: 'number' },
      { key: 'logoHeight', label: 'Altura do Logo', type: 'number' },
      { key: 'progressValue', label: 'Valor do Progresso', type: 'number' },
      { key: 'progressMax', label: 'Máximo do Progresso', type: 'number' },
      { key: 'showBackButton', label: 'Mostrar Voltar', type: 'boolean' },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean' },
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'alignment', label: 'Alinhamento', type: 'text' },
      { key: 'type', label: 'Tipo', type: 'text' },
      // Propriedades de container e layout
      { key: 'containerWidth', label: 'Largura do Container', type: 'text' },
      { key: 'containerPosition', label: 'Posição do Container', type: 'text' },
      { key: 'spacing', label: 'Espaçamento Interno', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      // Transformação universal
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
        description: 'Ajuste fino do tamanho do cabeçalho. 100% = padrão.',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  'decorative-bar-inline': {
    label: 'Barra Decorativa',
    fields: [
      { key: 'width', label: 'Largura', type: 'text' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
        description: 'Escala a barra como um todo sem distorcer proporções.',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  'text-inline': {
    label: 'Texto',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'text' },
      { key: 'textAlign', label: 'Alinhamento', type: 'text' },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
        description: 'Ajusta a escala do bloco de texto (não altera o font-size diretamente).',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  'image-display-inline': {
    label: 'Imagem',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text' },
      { key: 'width', label: 'Largura', type: 'number' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'containerPosition', label: 'Posição', type: 'text' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        description: 'Ajuste o tamanho visual da imagem. 100% = tamanho base do bloco.',
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  // Versão inline básica da imagem (alias comum do editor)
  'image-inline': {
    label: 'Imagem (Inline)',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text' },
      { key: 'alt', label: 'Texto Alternativo', type: 'text' },
      { key: 'width', label: 'Largura', type: 'number' },
      { key: 'height', label: 'Altura', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  'form-container': {
    label: 'Formulário',
    fields: [
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      { key: 'paddingTop', label: 'Padding Superior', type: 'number' },
      { key: 'paddingBottom', label: 'Padding Inferior', type: 'number' },
      {
        key: 'requireNameToEnableButton',
        label: 'Requer Nome para Habilitar Botão',
        type: 'boolean',
      },
      { key: 'targetButtonId', label: 'ID do Botão', type: 'text' },
      { key: 'visuallyDisableButton', label: 'Desabilitar Botão Visualmente', type: 'boolean' },
    ],
  },
  'form-input': {
    label: 'Campo de Formulário',
    fields: [
      { key: 'inputType', label: 'Tipo de Input', type: 'text' },
      { key: 'placeholder', label: 'Placeholder', type: 'text' },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'required', label: 'Obrigatório', type: 'boolean' },
      { key: 'name', label: 'Nome Campo', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
    ],
  },
  // Alias avançado do lead-form com configuração JSON exportável
  'connected-lead-form': {
    label: 'Formulário Conectado',
    fields: [
      { key: 'className', label: 'Classe CSS', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'padding', label: 'Padding (classes)', type: 'text' },
      {
        key: 'formConfig',
        label: 'Configuração do Formulário (JSON)',
        type: 'json',
        description:
          'Config avançada: enableValidation, realTimeValidation, requiredFields, submitButtonText, labelText, successMessage, errorMessage, nextStep, trackingEnabled',
      },
    ],
  },
  'lead-form': {
    label: 'Formulário de Lead',
    fields: [
      // === CONFIGURAÇÃO DE CAMPOS ===
      {
        key: 'showNameField',
        label: 'Mostrar Campo Nome',
        type: 'boolean',
      },
      {
        key: 'showEmailField',
        label: 'Mostrar Campo Email',
        type: 'boolean',
      },
      {
        key: 'showPhoneField',
        label: 'Mostrar Campo Telefone',
        type: 'boolean',
      },

      // === LABELS PERSONALIZÁVEIS ===
      { key: 'nameLabel', label: 'Label do Nome', type: 'text' },
      { key: 'namePlaceholder', label: 'Placeholder do Nome', type: 'text' },
      { key: 'emailLabel', label: 'Label do Email', type: 'text' },
      { key: 'emailPlaceholder', label: 'Placeholder do Email', type: 'text' },
      { key: 'phoneLabel', label: 'Label do Telefone', type: 'text' },
      { key: 'phonePlaceholder', label: 'Placeholder do Telefone', type: 'text' },

      // === CONFIGURAÇÕES DO BOTÃO ===
      { key: 'submitText', label: 'Texto do Botão', type: 'text' },
      { key: 'loadingText', label: 'Texto de Loading', type: 'text' },
      { key: 'successText', label: 'Texto de Sucesso', type: 'text' },

      // === VALIDAÇÃO ===
      {
        key: 'requiredFields',
        label: 'Campos Obrigatórios',
        type: 'select',
        options: [
          { label: 'Apenas Nome', value: 'name' },
          { label: 'Nome + Email', value: 'name,email' },
          { label: 'Todos os Campos', value: 'name,email,phone' },
        ],
      },

      // === APARÊNCIA ===
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color' },
      { key: 'primaryColor', label: 'Cor Primária', type: 'color' },

      // === ESPAÇAMENTO ===
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      { key: 'fieldSpacing', label: 'Espaçamento entre Campos', type: 'number' },
    ],
  },
  // Título inline
  'heading-inline': {
    label: 'Título (Inline)',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'text' },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        options: [
          { label: 'H1', value: 'h1' },
          { label: 'H2', value: 'h2' },
          { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' },
        ],
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ],
      },
      { key: 'color', label: 'Cor', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },
  // Cartão de estilo único (usado em resultado/estilo)
  'style-card-inline': {
    label: 'Card de Estilo',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      { key: 'description', label: 'Descrição', type: 'textarea' },
      { key: 'imageUrl', label: 'Imagem', type: 'text' },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text' },
      { key: 'link', label: 'Link', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color' },
      { key: 'borderRadius', label: 'Raio da Borda (px)', type: 'number' },
      { key: 'padding', label: 'Padding (px)', type: 'number' },
    ],
  },
  // Grade de cards de estilo
  'style-cards-grid': {
    label: 'Grade de Cards de Estilo',
    fields: [
      { key: 'cards', label: 'Cards (lista)', type: 'options-list' },
      {
        key: 'columns',
        label: 'Colunas',
        type: 'select',
        options: [
          { label: '1 Coluna', value: 1 },
          { label: '2 Colunas', value: 2 },
        ],
        defaultValue: 2,
      },
      { key: 'gap', label: 'Espaçamento (px)', type: 'number' },
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean' },
      { key: 'cardRadius', label: 'Arredondamento (px)', type: 'number' },
    ],
  },
  // Wrapper conectado de template
  'connected-template-wrapper': {
    label: 'Wrapper de Template Conectado',
    fields: [
      { key: 'templateKey', label: 'Chave do Template', type: 'text' },
      { key: 'variant', label: 'Variante', type: 'text' },
      { key: 'padding', label: 'Padding (classes)', type: 'text' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'number' },
    ],
  },
  'button-inline': {
    label: 'Botão',
    fields: [
      { key: 'text', label: 'Texto', type: 'text' },
      { key: 'variant', label: 'Variante', type: 'text' },
      { key: 'size', label: 'Tamanho', type: 'text' },
      { key: 'fullWidth', label: 'Largura Total', type: 'boolean' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color' },
      { key: 'requiresValidInput', label: 'Requer Input Válido', type: 'boolean' },
      { key: 'requiresValidSelection', label: 'Requer Seleção Válida', type: 'boolean' },
      { key: 'disabledText', label: 'Texto Desabilitado', type: 'text' },
      { key: 'showDisabledState', label: 'Mostrar Estado Desabilitado', type: 'boolean' },
      { key: 'disabledOpacity', label: 'Opacidade Desabilitado', type: 'number' },

      // === VALIDAÇÃO BASEADA EM OPTIONS-GRID ===
      { key: 'requiresGridSelection', label: 'Requer Seleção do Grid', type: 'boolean' },
      { key: 'watchGridId', label: 'ID do Grid a Monitorar', type: 'text' },
      { key: 'minRequiredSelections', label: 'Mín. Seleções Obrigatórias', type: 'number' },

      { key: 'marginTop', label: 'Margem Superior', type: 'number' },
    ],
  },
  'options-grid': {
    label: 'Grade de Opções - Configuração Completa',
    fields: [
      // === CONTEÚDO PRINCIPAL ===
      {
        key: 'title',
        label: 'Título/Questão',
        type: 'text',
        group: 'content',
        defaultValue: 'Escolha uma opção:',
        required: true,
        description: 'Título ou pergunta que aparece acima das opções'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo/Instrução',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'Texto complementar ou instrução adicional'
      },
      {
        key: 'description',
        label: 'Descrição Detalhada',
        type: 'textarea',
        group: 'content',
        defaultValue: '',
        description: 'Texto explicativo mais longo, se necessário'
      },

      // === OPÇÕES INDIVIDUAIS ===
      {
        key: 'options',
        label: 'Opções da Questão',
        type: 'options-list',
        group: 'content',
        description: 'Configure as opções disponíveis - texto, imagem, pontuação e categoria'
      },
      {
        key: 'option1Text',
        label: 'Texto da Opção 1',
        type: 'text',
        group: 'content',
        defaultValue: 'Primeira opção',
        description: 'Texto que aparece na primeira opção'
      },
      {
        key: 'option1Image',
        label: 'Imagem da Opção 1',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'URL da imagem para a primeira opção'
      },
      {
        key: 'option1Score',
        label: 'Pontuação da Opção 1',
        type: 'number',
        group: 'content',
        defaultValue: 1,
        description: 'Pontos atribuídos ao selecionar esta opção'
      },
      {
        key: 'option1Category',
        label: 'Categoria da Opção 1',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'Categoria para agrupamento de resultados'
      },
      {
        key: 'option2Text',
        label: 'Texto da Opção 2',
        type: 'text',
        group: 'content',
        defaultValue: 'Segunda opção',
        description: 'Texto que aparece na segunda opção'
      },
      {
        key: 'option2Image',
        label: 'Imagem da Opção 2',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'URL da imagem para a segunda opção'
      },
      {
        key: 'option2Score',
        label: 'Pontuação da Opção 2',
        type: 'number',
        group: 'content',
        defaultValue: 2,
        description: 'Pontos atribuídos ao selecionar esta opção'
      },
      {
        key: 'option2Category',
        label: 'Categoria da Opção 2',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'Categoria para agrupamento de resultados'
      },
      {
        key: 'option3Text',
        label: 'Texto da Opção 3',
        type: 'text',
        group: 'content',
        defaultValue: 'Terceira opção',
        description: 'Texto que aparece na terceira opção'
      },
      {
        key: 'option3Image',
        label: 'Imagem da Opção 3',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'URL da imagem para a terceira opção'
      },
      {
        key: 'option3Score',
        label: 'Pontuação da Opção 3',
        type: 'number',
        group: 'content',
        defaultValue: 3,
        description: 'Pontos atribuídos ao selecionar esta opção'
      },
      {
        key: 'option3Category',
        label: 'Categoria da Opção 3',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'Categoria para agrupamento de resultados'
      },
      {
        key: 'option4Text',
        label: 'Texto da Opção 4',
        type: 'text',
        group: 'content',
        defaultValue: 'Quarta opção',
        description: 'Texto que aparece na quarta opção'
      },
      {
        key: 'option4Image',
        label: 'Imagem da Opção 4',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'URL da imagem para a quarta opção'
      },
      {
        key: 'option4Score',
        label: 'Pontuação da Opção 4',
        type: 'number',
        group: 'content',
        defaultValue: 4,
        description: 'Pontos atribuídos ao selecionar esta opção'
      },
      {
        key: 'option4Category',
        label: 'Categoria da Opção 4',
        type: 'text',
        group: 'content',
        defaultValue: '',
        description: 'Categoria para agrupamento de resultados'
      },

      // === LAYOUT ===
      {
        key: 'columns',
        label: 'Número de Colunas',
        type: 'range',
        min: 1,
        max: 4,
        step: 1,
        group: 'layout',
        defaultValue: 2,
        description: 'Quantas colunas terá o grid de opções'
      },
      {
        key: 'gridGap',
        label: 'Espaçamento entre Opções (px)',
        type: 'range',
        min: 0,
        max: 48,
        step: 2,
        group: 'layout',
        defaultValue: 16,
        description: 'Espaço entre as opções no grid'
      },
      {
        key: 'responsiveColumns',
        label: 'Colunas Responsivas',
        type: 'boolean',
        group: 'layout',
        defaultValue: true,
        description: 'Ajusta automaticamente o número de colunas em diferentes telas'
      },
      {
        key: 'padding',
        label: 'Padding Interno (px)',
        type: 'range',
        min: 0,
        max: 48,
        step: 2,
        group: 'layout',
        defaultValue: 16,
        description: 'Espaçamento interno de cada opção'
      },

      // === IMAGENS ===
      {
        key: 'showImages',
        label: 'Mostrar Imagens',
        type: 'boolean',
        group: 'images',
        defaultValue: true,
        description: 'Exibir ou ocultar imagens nas opções'
      },
      {
        key: 'imageSize',
        label: 'Tamanho das Imagens',
        type: 'select',
        group: 'images',
        defaultValue: 'medium',
        options: [
          { label: 'Pequena (200px)', value: 'small' },
          { label: 'Média (256px)', value: 'medium' },
          { label: 'Grande (300px)', value: 'large' },
          { label: 'Personalizado', value: 'custom' },
        ],
        description: 'Tamanho padrão das imagens'
      },
      {
        key: 'imageWidth',
        label: 'Largura da Imagem (px)',
        type: 'range',
        min: 100,
        max: 500,
        step: 10,
        group: 'images',
        defaultValue: 256,
        showIf: 'imageSize === "custom"',
        description: 'Largura personalizada das imagens'
      },
      {
        key: 'imageHeight',
        label: 'Altura da Imagem (px)',
        type: 'range',
        min: 100,
        max: 500,
        step: 10,
        group: 'images',
        defaultValue: 256,
        showIf: 'imageSize === "custom"',
        description: 'Altura personalizada das imagens'
      },
      {
        key: 'imagePosition',
        label: 'Posição da Imagem',
        type: 'select',
        group: 'images',
        defaultValue: 'top',
        options: [
          { label: 'Acima do Texto', value: 'top' },
          { label: 'À Esquerda', value: 'left' },
          { label: 'À Direita', value: 'right' },
          { label: 'Abaixo do Texto', value: 'bottom' },
        ],
        description: 'Onde a imagem aparece em relação ao texto'
      },
      {
        key: 'imageLayout',
        label: 'Layout da Opção',
        type: 'select',
        group: 'images',
        defaultValue: 'vertical',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
        ],
        description: 'Orientação geral de cada opção'
      },

      // === COMPORTAMENTO ===
      {
        key: 'multipleSelection',
        label: 'Permitir Seleção Múltipla',
        type: 'boolean',
        group: 'behavior',
        defaultValue: false,
        description: 'Permite selecionar mais de uma opção'
      },
      {
        key: 'minSelections',
        label: 'Mínimo de Seleções',
        type: 'range',
        min: 0,
        max: 10,
        step: 1,
        group: 'behavior',
        defaultValue: 1,
        description: 'Número mínimo de opções que devem ser selecionadas'
      },
      {
        key: 'maxSelections',
        label: 'Máximo de Seleções',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        group: 'behavior',
        defaultValue: 1,
        description: 'Número máximo de opções que podem ser selecionadas'
      },
      {
        key: 'requiredSelections',
        label: 'Seleções Obrigatórias',
        type: 'range',
        min: 0,
        max: 10,
        step: 1,
        group: 'behavior',
        defaultValue: 1,
        description: 'Quantas seleções são necessárias para prosseguir'
      },
      {
        key: 'allowDeselection',
        label: 'Permitir Desmarcar',
        type: 'boolean',
        group: 'behavior',
        defaultValue: true,
        description: 'Permite clicar novamente para desmarcar uma opção'
      },
      {
        key: 'showSelectionCount',
        label: 'Mostrar Contador de Seleção',
        type: 'boolean',
        group: 'behavior',
        defaultValue: true,
        description: 'Exibe quantas opções foram selecionadas'
      },
      {
        key: 'autoAdvanceOnComplete',
        label: 'Auto Avançar ao Completar',
        type: 'boolean',
        group: 'behavior',
        defaultValue: false,
        description: 'Avança automaticamente quando atingir o número de seleções'
      },
      {
        key: 'autoAdvanceDelay',
        label: 'Atraso do Auto Avanço (ms)',
        type: 'range',
        min: 0,
        max: 5000,
        step: 100,
        group: 'behavior',
        defaultValue: 0,
        showIf: 'autoAdvanceOnComplete === true',
        description: 'Tempo de espera antes de avançar automaticamente'
      },

      // === SISTEMA DE PONTUAÇÃO ===
      {
        key: 'enableScoring',
        label: 'Ativar Sistema de Pontuação',
        type: 'boolean',
        group: 'scoring',
        defaultValue: true,
        description: 'Habilita ou desabilita o sistema de pontuação'
      },
      {
        key: 'scoringType',
        label: 'Tipo de Pontuação',
        type: 'select',
        group: 'scoring',
        defaultValue: 'points',
        options: [
          { label: 'Pontos Numéricos', value: 'points' },
          { label: 'Categorias', value: 'categories' },
          { label: 'Pesos Personalizados', value: 'weights' },
        ],
        description: 'Método de cálculo da pontuação'
      },
      {
        key: 'pointsMultiplier',
        label: 'Multiplicador de Pontos',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        group: 'scoring',
        defaultValue: 1,
        description: 'Multiplica os pontos base por este valor'
      },
      {
        key: 'bonusPoints',
        label: 'Pontos Bônus',
        type: 'number',
        group: 'scoring',
        defaultValue: 0,
        description: 'Pontos extras adicionados a esta questão'
      },
      {
        key: 'penaltyPoints',
        label: 'Pontos de Penalidade',
        type: 'number',
        group: 'scoring',
        defaultValue: 0,
        description: 'Pontos subtraídos por resposta incorreta'
      },

      // === REGRAS DE SELEÇÃO AVANÇADAS ===
      {
        key: 'selectionRules',
        label: 'Regras de Seleção',
        type: 'select',
        group: 'rules',
        defaultValue: 'free',
        options: [
          { label: 'Seleção Livre', value: 'free' },
          { label: 'Exatamente N opções', value: 'exact' },
          { label: 'Pelo menos N opções', value: 'minimum' },
          { label: 'No máximo N opções', value: 'maximum' },
          { label: 'Entre X e Y opções', value: 'range' },
        ],
        description: 'Define as regras de quantas opções podem ser selecionadas'
      },
      {
        key: 'forcedChoices',
        label: 'Opções Obrigatórias',
        type: 'text',
        group: 'rules',
        defaultValue: '',
        description: 'IDs das opções que devem ser selecionadas (separadas por vírgula)'
      },
      {
        key: 'blockedChoices',
        label: 'Opções Bloqueadas',
        type: 'text',
        group: 'rules',
        defaultValue: '',
        description: 'IDs das opções que não podem ser selecionadas juntas'
      },
      {
        key: 'exclusiveGroups',
        label: 'Grupos Exclusivos',
        type: 'text',
        group: 'rules',
        defaultValue: '',
        description: 'Configuração de grupos mutuamente exclusivos (JSON)'
      },
      {
        key: 'enableTimeLimit',
        label: 'Ativar Limite de Tempo',
        type: 'boolean',
        group: 'rules',
        defaultValue: false,
        description: 'Define um tempo limite para esta questão'
      },
      {
        key: 'timeLimitSeconds',
        label: 'Tempo Limite (segundos)',
        type: 'range',
        min: 5,
        max: 300,
        step: 5,
        group: 'rules',
        defaultValue: 30,
        showIf: 'enableTimeLimit === true',
        description: 'Tempo disponível para responder esta questão'
      },
      {
        key: 'showTimeRemaining',
        label: 'Mostrar Tempo Restante',
        type: 'boolean',
        group: 'rules',
        defaultValue: true,
        showIf: 'enableTimeLimit === true',
        description: 'Exibe um contador regressivo'
      },

      // === ESTILO VISUAL ===
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color',
        group: 'style',
        defaultValue: '#FFFFFF',
        description: 'Cor de fundo de cada opção'
      },
      {
        key: 'selectedColor',
        label: 'Cor da Seleção',
        type: 'color',
        group: 'style',
        defaultValue: '#B89B7A',
        description: 'Cor quando a opção está selecionada'
      },
      {
        key: 'hoverColor',
        label: 'Cor no Hover',
        type: 'color',
        group: 'style',
        defaultValue: '#D4C2A8',
        description: 'Cor quando o mouse passa sobre a opção'
      },
      {
        key: 'borderRadius',
        label: 'Arredondamento das Bordas (px)',
        type: 'range',
        min: 0,
        max: 32,
        step: 1,
        group: 'style',
        defaultValue: 8,
        description: 'Quão arredondadas são as bordas das opções'
      },
      {
        key: 'selectionStyle',
        label: 'Estilo de Seleção',
        type: 'select',
        group: 'style',
        defaultValue: 'border',
        options: [
          { label: 'Borda', value: 'border' },
          { label: 'Fundo', value: 'background' },
          { label: 'Brilho', value: 'glow' },
          { label: 'Escala', value: 'scale' },
        ],
        description: 'Como destacar visualmente a opção selecionada'
      },

      // === VALIDAÇÃO E FEEDBACK ===
      {
        key: 'enableButtonOnlyWhenValid',
        label: 'Botão Ativo Apenas se Válido',
        type: 'boolean',
        group: 'validation',
        defaultValue: true,
        description: 'Só ativa o botão continuar quando as seleções estão corretas'
      },
      {
        key: 'showValidationFeedback',
        label: 'Mostrar Feedback de Validação',
        type: 'boolean',
        group: 'validation',
        defaultValue: true,
        description: 'Mostra mensagens de erro ou sucesso'
      },
      {
        key: 'validationMessage',
        label: 'Mensagem de Validação',
        type: 'text',
        group: 'validation',
        defaultValue: 'Selecione uma opção para continuar',
        description: 'Mensagem mostrada quando a validação falha'
      },

      // === CONFIGURAÇÕES AVANÇADAS ===
      {
        key: 'scale',
        label: 'Escala do Componente (%)',
        type: 'range',
        min: 50,
        max: 200,
        step: 5,
        group: 'advanced',
        defaultValue: 100,
        description: 'Controle de zoom geral do componente inteiro'
      },
      {
        key: 'scoreValues',
        label: 'Pontuação por Opção (JSON)',
        type: 'json',
        group: 'advanced',
        defaultValue: {},
        description: 'Configuração avançada de pontuação personalizada'
      },
    ],
  },
  // ==========================
  // RESULT/OFFER (Step 20)
  // ==========================
  'urgency-timer-inline': {
    label: 'Timer de Urgência',
    fields: [
      {
        key: 'initialMinutes',
        label: 'Minutos Iniciais',
        type: 'number',
        group: 'content',
        defaultValue: 15,
      },
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: '⚡ OFERTA EXPIRA EM:',
      },
      {
        key: 'urgencyMessage',
        label: 'Mensagem de Urgência',
        type: 'text',
        group: 'content',
        defaultValue: 'Restam apenas alguns minutos!',
      },

      {
        key: 'spacing',
        label: 'Espaçamento Interno',
        type: 'select',
        group: 'layout',
        defaultValue: 'md',
        options: [
          { label: 'Nenhum', value: 'none' },
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra', value: 'xl' },
        ],
      },

      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color',
        group: 'style',
        defaultValue: '#dc2626',
      },
      {
        key: 'textColor',
        label: 'Cor do Texto',
        type: 'color',
        group: 'style',
        defaultValue: '#ffffff',
      },
      {
        key: 'pulseColor',
        label: 'Cor de Destaque',
        type: 'color',
        group: 'style',
        defaultValue: '#fbbf24',
      },
      {
        key: 'showAlert',
        label: 'Mostrar Alerta',
        type: 'boolean',
        group: 'style',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'before-after-inline': {
    label: 'Antes e Depois (Inline)',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Sua Transformação',
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'textarea',
        group: 'content',
        defaultValue: 'Veja o antes e depois da sua nova imagem',
      },
      { key: 'beforeImage', label: 'URL Imagem Antes', type: 'text', group: 'content' },
      { key: 'afterImage', label: 'URL Imagem Depois', type: 'text', group: 'content' },
      {
        key: 'beforeLabel',
        label: 'Rótulo Antes',
        type: 'text',
        group: 'content',
        defaultValue: 'ANTES',
      },
      {
        key: 'afterLabel',
        label: 'Rótulo Depois',
        type: 'text',
        group: 'content',
        defaultValue: 'DEPOIS',
      },

      {
        key: 'layoutStyle',
        label: 'Layout',
        type: 'select',
        group: 'layout',
        defaultValue: 'side-by-side',
        options: [
          { label: 'Lado a Lado', value: 'side-by-side' },
          { label: 'Com Troca (Toggle)', value: 'toggle' },
        ],
      },
      {
        key: 'showComparison',
        label: 'Mostrar Comparação',
        type: 'boolean',
        group: 'layout',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  // Cabeçalho de resultado (Step 20)
  'result-header-inline': {
    label: 'Cabeçalho de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text' },
      {
        key: 'alignment',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
        ],
      },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color' },
      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number' },
      {
        key: 'scale',
        label: 'Escala (%)',
        type: 'range',
        min: 10,
        max: 300,
        step: 1,
        group: 'transform',
        defaultValue: 100,
      },
      {
        key: 'scaleOrigin',
        label: 'Origem da Escala',
        type: 'select',
        group: 'transform',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Topo Centro', value: 'top center' },
          { label: 'Base Centro', value: 'bottom center' },
        ],
      },
    ],
  },

  bonus: {
    label: 'Bônus (Seção)',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Bônus Exclusivos para Você',
      },
      {
        key: 'showImages',
        label: 'Mostrar Imagens',
        type: 'boolean',
        group: 'content',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  testimonials: {
    label: 'Depoimentos',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Transformações Reais',
      },
      {
        key: 'showRatings',
        label: 'Mostrar Estrelas',
        type: 'boolean',
        group: 'content',
        defaultValue: true,
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        group: 'layout',
        defaultValue: 'grid',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'Carrossel', value: 'carousel' },
        ],
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'value-anchoring': {
    label: 'Ancoragem de Valor',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'O Que Você Recebe Hoje',
      },
      {
        key: 'showPricing',
        label: 'Mostrar Preço',
        type: 'boolean',
        group: 'content',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'secure-purchase': {
    label: 'Compra Segura',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Compra 100% Segura e Protegida',
      },
      {
        key: 'showFeatures',
        label: 'Mostrar Itens de Segurança',
        type: 'boolean',
        group: 'content',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'mentor-section-inline': {
    label: 'Seção da Mentora (Inline)',
    fields: [
      {
        key: 'mentorName',
        label: 'Nome',
        type: 'text',
        group: 'content',
        defaultValue: 'Gisele Galvão',
      },
      {
        key: 'mentorTitle',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Consultora de Imagem e Estilo, Personal Branding',
      },
      {
        key: 'mentorImage',
        label: 'URL da Imagem',
        type: 'text',
        group: 'content',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745347467/GISELE-GALV%C3%83O-POSE-ACESSIBILIDADE_i23qvj.webp',
      },
      {
        key: 'mentorBio',
        label: 'Bio',
        type: 'textarea',
        group: 'content',
        defaultValue: 'Advogada de formação, mãe e esposa. Apaixonada por ajudar mulheres a descobrirem seu estilo autêntico e transformarem sua relação com a imagem pessoal. Especialista em coloração pessoal com certificação internacional.',
      },
      {
        key: 'achievements',
        label: 'Conquistas (array)',
        type: 'json',
        group: 'content',
        description: 'Lista de textos (ex.: ["+ 5.000 clientes transformadas"])',
      },
      {
        key: 'credentials',
        label: 'Credenciais (array)',
        type: 'json',
        group: 'content',
        description: 'Lista de textos (ex.: ["Certificação em Personal Styling"])',
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'testimonial-card-inline': {
    label: 'Card de Depoimento',
    fields: [
      {
        key: 'testimonialType',
        label: 'Tipo de Depoimento',
        type: 'select',
        group: 'content',
        options: [
          { value: 'mariangela', label: 'Mariangela Santos (Empresária)' },
          { value: 'sonia', label: 'Sonia Spier (Advogada)' },
          { value: 'ana', label: 'Ana Carolina (Médica)' },
          { value: 'patricia', label: 'Patrícia Lima (Marketing)' },
          { value: 'custom', label: 'Personalizado' },
        ],
        defaultValue: 'mariangela',
      },
      {
        key: 'clientName',
        label: 'Nome do Cliente (Custom)',
        type: 'text',
        group: 'content',
        defaultValue: 'Cliente Satisfeita',
      },
      {
        key: 'clientRole',
        label: 'Profissão (Custom)',
        type: 'text',
        group: 'content',
        defaultValue: 'Cliente',
      },
      {
        key: 'clientTestimonial',
        label: 'Depoimento (Custom)',
        type: 'textarea',
        group: 'content',
        defaultValue: 'Excelente trabalho!',
      },
      {
        key: 'clientResult',
        label: 'Resultado (Custom)',
        type: 'text',
        group: 'content',
        defaultValue: 'Resultado transformador',
      },
      {
        key: 'cardStyle',
        label: 'Estilo do Card',
        type: 'select',
        group: 'design',
        options: [
          { value: 'elegant', label: 'Elegante' },
          { value: 'modern', label: 'Moderno' },
          { value: 'minimal', label: 'Minimalista' },
          { value: 'luxury', label: 'Luxo' },
        ],
        defaultValue: 'elegant',
      },
      {
        key: 'showPhoto',
        label: 'Mostrar Foto',
        type: 'boolean',
        group: 'visibility',
        defaultValue: true,
      },
      {
        key: 'showRating',
        label: 'Mostrar Avaliação',
        type: 'boolean',
        group: 'visibility',
        defaultValue: true,
      },
      {
        key: 'showResult',
        label: 'Mostrar Resultado',
        type: 'boolean',
        group: 'visibility',
        defaultValue: true,
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color',
        group: 'design',
        defaultValue: '#FFFFFF',
      },
      {
        key: 'accentColor',
        label: 'Cor de Destaque',
        type: 'color',
        group: 'design',
        defaultValue: '#B89B7A',
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  'testimonials-carousel-inline': {
    label: 'Carrossel de Depoimentos',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'O que nossas clientes dizem',
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text',
        group: 'content',
        defaultValue: 'Transformações reais de mulheres que descobriram seu estilo',
      },
      {
        key: 'itemsPerView',
        label: 'Itens por Visualização',
        type: 'select',
        group: 'layout',
        options: [
          { value: 1, label: '1 item' },
          { value: 2, label: '2 itens' },
          { value: 3, label: '3 itens' },
        ],
        defaultValue: 1,
      },
      {
        key: 'showNavigationArrows',
        label: 'Mostrar Setas',
        type: 'boolean',
        group: 'navigation',
        defaultValue: true,
      },
      {
        key: 'showDots',
        label: 'Mostrar Pontos',
        type: 'boolean',
        group: 'navigation',
        defaultValue: true,
      },
      {
        key: 'autoPlay',
        label: 'Reprodução Automática',
        type: 'boolean',
        group: 'behavior',
        defaultValue: false,
      },
      {
        key: 'autoPlayInterval',
        label: 'Intervalo (ms)',
        type: 'number',
        group: 'behavior',
        defaultValue: 5000,
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        group: 'layout',
        options: [
          { value: 'cards', label: 'Cards' },
          { value: 'list', label: 'Lista' },
          { value: 'grid', label: 'Grid' },
        ],
        defaultValue: 'cards',
      },
      {
        key: 'showHeader',
        label: 'Mostrar Cabeçalho',
        type: 'boolean',
        group: 'visibility',
        defaultValue: true,
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color',
        group: 'design',
        defaultValue: '#FAF9F7',
      },
      {
        key: 'accentColor',
        label: 'Cor de Destaque',
        type: 'color',
        group: 'design',
        defaultValue: '#B89B7A',
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  guarantee: {
    label: 'Garantia',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Garantia Incondicional',
      },
      {
        key: 'guaranteePeriod',
        label: 'Período da Garantia',
        type: 'text',
        group: 'content',
        defaultValue: '7 dias',
      },
      {
        key: 'showIcon',
        label: 'Mostrar Ícone',
        type: 'boolean',
        group: 'style',
        defaultValue: true,
      },

      { key: 'marginTop', label: 'Margem Superior (px)', type: 'number', group: 'spacing' },
      { key: 'marginBottom', label: 'Margem Inferior (px)', type: 'number', group: 'spacing' },
      { key: 'marginLeft', label: 'Margem Esquerda (px)', type: 'number', group: 'spacing' },
      { key: 'marginRight', label: 'Margem Direita (px)', type: 'number', group: 'spacing' },
    ],
  },

  // ============================================================================
  // 🤖 SCHEMAS GERADOS AUTOMATICAMENTE - 52 COMPONENTES
  // Data: 2025-10-13 - Adicionados schemas para componentes sem configuração
  // ============================================================================

  'container': {
    label: 'Container',
    fields: [
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
      { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'section': {
    label: 'Section',
    fields: [
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
      { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'box': {
    label: 'Box',
    fields: [
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'layout', defaultValue: '1rem' },
      { key: 'maxWidth', label: 'Largura Máxima', type: 'text', group: 'layout', defaultValue: '1200px' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'legal-notice': {
    label: 'Aviso Legal',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '0.875rem' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{ label: 'Normal', value: 'normal' }, { label: 'Negrito', value: 'bold' }], defaultValue: 'normal' },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#6b7280' },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{ label: 'Esquerda', value: 'left' }, { label: 'Centro', value: 'center' }, { label: 'Direita', value: 'right' }], defaultValue: 'center' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'legal-notice-inline': {
    label: 'Aviso Legal Inline',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '0.875rem' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{ label: 'Normal', value: 'normal' }, { label: 'Negrito', value: 'bold' }], defaultValue: 'normal' },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#6b7280' },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{ label: 'Esquerda', value: 'left' }, { label: 'Centro', value: 'center' }, { label: 'Direita', value: 'right' }], defaultValue: 'center' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'headline-inline': {
    label: 'Título Inline',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'text', group: 'content', required: true },
      { key: 'level', label: 'Nível', type: 'select', group: 'content', options: [{ label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' }], defaultValue: 'h2' },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '2rem' },
      { key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [{ label: 'Normal', value: 'normal' }, { label: 'Negrito', value: 'bold' }], defaultValue: 'bold' },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{ label: 'Esquerda', value: 'left' }, { label: 'Centro', value: 'center' }, { label: 'Direita', value: 'right' }], defaultValue: 'left' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'button-inline-fixed': {
    label: 'Botão Inline Fixo',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
      { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'cta-inline': {
    label: 'CTA Inline',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
      { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-offer-cta-inline': {
    label: 'CTA de Oferta Quiz',
    fields: [
      { key: 'text', label: 'Texto do Botão', type: 'text', group: 'content', required: true, defaultValue: 'Clique aqui' },
      { key: 'url', label: 'URL de Destino', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'borderRadius', label: 'Borda Arredondada', type: 'text', group: 'style', defaultValue: '0.5rem' },
      { key: 'padding', label: 'Espaçamento Interno', type: 'text', group: 'style', defaultValue: '0.75rem 1.5rem' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-navigation': {
    label: 'Navegação do Quiz',
    fields: [
      { key: 'showProgressBar', label: 'Mostrar Barra de Progresso', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'showStepNumber', label: 'Mostrar Número do Step', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'backButtonText', label: 'Texto Botão Voltar', type: 'text', group: 'content', defaultValue: 'Voltar' },
      { key: 'nextButtonText', label: 'Texto Botão Avançar', type: 'text', group: 'content', defaultValue: 'Próximo' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'progress-bar': {
    label: 'Barra de Progresso',
    fields: [
      { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
      { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
      { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'progress-inline': {
    label: 'Progresso Inline',
    fields: [
      { key: 'value', label: 'Valor (%)', type: 'range', group: 'content', min: 0, max: 100, defaultValue: 0 },
      { key: 'showLabel', label: 'Mostrar Rótulo', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'color', label: 'Cor da Barra', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
      { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '8px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'loader-inline': {
    label: 'Carregamento Inline',
    fields: [
      { key: 'size', label: 'Tamanho', type: 'select', group: 'style', options: [{ label: 'Pequeno', value: 'sm' }, { label: 'Médio', value: 'md' }, { label: 'Grande', value: 'lg' }], defaultValue: 'md' },
      { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'text', label: 'Texto de Carregamento', type: 'text', group: 'content', defaultValue: 'Carregando...' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'loading-animation': {
    label: 'Animação de Carregamento',
    fields: [
      { key: 'type', label: 'Tipo de Animação', type: 'select', group: 'style', options: [{ label: 'Spinner', value: 'spinner' }, { label: 'Dots', value: 'dots' }, { label: 'Pulse', value: 'pulse' }], defaultValue: 'spinner' },
      { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'text', label: 'Texto', type: 'text', group: 'content', defaultValue: 'Carregando...' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'decorative-bar': {
    label: 'Barra Decorativa',
    fields: [
      { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'height', label: 'Altura', type: 'text', group: 'style', defaultValue: '4px' },
      { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' },
      { key: 'opacity', label: 'Opacidade', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 100 },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'guarantee-badge': {
    label: 'Selo de Garantia',
    fields: [
      { key: 'text', label: 'Texto', type: 'text', group: 'content', defaultValue: 'Garantia' },
      { key: 'days', label: 'Dias de Garantia', type: 'number', group: 'content', defaultValue: 7 },
      { key: 'color', label: 'Cor', type: 'color', group: 'style', defaultValue: '#10b981' },
      { key: 'size', label: 'Tamanho', type: 'select', group: 'style', options: [{ label: 'Pequeno', value: 'sm' }, { label: 'Médio', value: 'md' }, { label: 'Grande', value: 'lg' }], defaultValue: 'md' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'gradient-animation': {
    label: 'Gradiente Animado',
    fields: [
      { key: 'colorStart', label: 'Cor Inicial', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'colorEnd', label: 'Cor Final', type: 'color', group: 'style', defaultValue: '#8b5cf6' },
      { key: 'direction', label: 'Direção', type: 'select', group: 'style', options: [{ label: 'Horizontal', value: 'horizontal' }, { label: 'Vertical', value: 'vertical' }, { label: 'Diagonal', value: 'diagonal' }], defaultValue: 'horizontal' },
      { key: 'speed', label: 'Velocidade', type: 'select', group: 'style', options: [{ label: 'Lenta', value: 'slow' }, { label: 'Normal', value: 'normal' }, { label: 'Rápida', value: 'fast' }], defaultValue: 'normal' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Quiz Components (18 tipos)
  'quiz-advanced-question': {
    label: 'Pergunta Avançada do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-button': {
    label: 'Botão do Quiz',
    fields: [
      { key: 'text', label: 'Texto', type: 'text', group: 'content', defaultValue: 'Continuar' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#3b82f6' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-form': {
    label: 'Formulário do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'placeholder', label: 'Placeholder', type: 'text', group: 'content', defaultValue: 'Digite aqui...' },
      { key: 'required', label: 'Campo Obrigatório', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-image': {
    label: 'Imagem do Quiz',
    fields: [
      { key: 'src', label: 'URL da Imagem', type: 'text', group: 'content', required: true },
      { key: 'alt', label: 'Texto Alternativo', type: 'text', group: 'content', defaultValue: 'Imagem' },
      { key: 'width', label: 'Largura', type: 'text', group: 'style', defaultValue: '100%' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-intro': {
    label: 'Introdução do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-options-inline': {
    label: 'Opções do Quiz Inline',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'columns', label: 'Colunas', type: 'select', group: 'layout', options: [{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }], defaultValue: 2 },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-personal-info-inline': {
    label: 'Informações Pessoais Inline',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Suas Informações' },
      { key: 'fields', label: 'Campos', type: 'json', group: 'content', description: 'Array de campos do formulário' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-processing': {
    label: 'Processamento do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Processando suas respostas...' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-progress': {
    label: 'Progresso do Quiz',
    fields: [
      { key: 'currentStep', label: 'Step Atual', type: 'number', group: 'content', defaultValue: 1 },
      { key: 'totalSteps', label: 'Total de Steps', type: 'number', group: 'content', defaultValue: 21 },
      { key: 'showPercentage', label: 'Mostrar Percentual', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-question-inline': {
    label: 'Pergunta Inline',
    fields: [
      { key: 'question', label: 'Pergunta', type: 'text', group: 'content', required: true },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-header': {
    label: 'Cabeçalho de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-secondary': {
    label: 'Resultado Secundário',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'items', label: 'Itens', type: 'json', group: 'content', description: 'Array de itens secundários' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-result-style': {
    label: 'Estilo de Resultado',
    fields: [
      { key: 'styleName', label: 'Nome do Estilo', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'image', label: 'Imagem', type: 'text', group: 'content', description: 'URL da imagem' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-results': {
    label: 'Resultados do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Seus Resultados' },
      { key: 'results', label: 'Resultados', type: 'json', group: 'content', description: 'Array de resultados' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-start-page-inline': {
    label: 'Página Inicial Inline',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Bem-vindo!' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Começar' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-style-question': {
    label: 'Pergunta de Estilo',
    fields: [
      { key: 'question', label: 'Pergunta', type: 'text', group: 'content', required: true },
      { key: 'styles', label: 'Estilos', type: 'json', group: 'content', description: 'Array de opções de estilo' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-text': {
    label: 'Texto do Quiz',
    fields: [
      { key: 'content', label: 'Conteúdo', type: 'textarea', group: 'content', required: true },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '1rem' },
      { key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [{ label: 'Esquerda', value: 'left' }, { label: 'Centro', value: 'center' }, { label: 'Direita', value: 'right' }], defaultValue: 'left' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'quiz-transition': {
    label: 'Transição do Quiz',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Analisando suas respostas...' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'duration', label: 'Duração (ms)', type: 'number', group: 'behavior', defaultValue: 3000 },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Result & Sales Components
  'modular-result-header': {
    label: 'Cabeçalho Modular de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
      { key: 'userName', label: 'Nome do Usuário', type: 'text', group: 'content', description: 'Variável: {{userName}}' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'result-card': {
    label: 'Card de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'image', label: 'Imagem', type: 'text', group: 'content', description: 'URL da imagem' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'style-results': {
    label: 'Resultados de Estilo',
    fields: [
      { key: 'mainStyle', label: 'Estilo Principal', type: 'text', group: 'content' },
      { key: 'secondaryStyles', label: 'Estilos Secundários', type: 'json', group: 'content', description: 'Array de estilos' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'options-grid-inline': {
    label: 'Grid de Opções Inline',
    fields: [
      { key: 'options', label: 'Opções', type: 'json', group: 'content', description: 'Array de opções', required: true },
      { key: 'columns', label: 'Colunas', type: 'select', group: 'layout', options: [{ label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }], defaultValue: 3 },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'benefits-list': {
    label: 'Lista de Benefícios',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Benefícios' },
      { key: 'benefits', label: 'Benefícios', type: 'json', group: 'content', description: 'Array de benefícios', required: true },
      { key: 'iconColor', label: 'Cor do Ícone', type: 'color', group: 'style', defaultValue: '#10b981' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'bonus-inline': {
    label: 'Bônus Inline',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'value', label: 'Valor', type: 'text', group: 'content', description: 'Ex: R$ 197' },
      { key: 'image', label: 'Imagem', type: 'text', group: 'content', description: 'URL da imagem' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'personalized-hook-inline': {
    label: 'Gancho Personalizado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'message', label: 'Mensagem', type: 'textarea', group: 'content' },
      { key: 'userName', label: 'Nome do Usuário', type: 'text', group: 'content', description: 'Variável: {{userName}}' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'final-value-proposition-inline': {
    label: 'Proposta de Valor Final',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Por que escolher?' },
      { key: 'reasons', label: 'Razões', type: 'json', group: 'content', description: 'Array de razões' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'testimonials-grid': {
    label: 'Grid de Depoimentos',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Depoimentos' },
      { key: 'testimonials', label: 'Depoimentos', type: 'json', group: 'content', description: 'Array de depoimentos', required: true },
      { key: 'columns', label: 'Colunas', type: 'select', group: 'layout', options: [{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }], defaultValue: 2 },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Step 20 Modular Blocks (7 tipos)
  'step20-compatibility': {
    label: 'Step 20 - Compatibilidade',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Compatibilidade de Estilos' },
      { key: 'mainStyle', label: 'Estilo Principal', type: 'text', group: 'content' },
      { key: 'compatibleStyles', label: 'Estilos Compatíveis', type: 'json', group: 'content', description: 'Array de estilos' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-complete-template': {
    label: 'Step 20 - Template Completo',
    fields: [
      { key: 'sections', label: 'Seções', type: 'json', group: 'content', description: 'Array de seções do template' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-personalized-offer': {
    label: 'Step 20 - Oferta Personalizada',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Oferta Especial Para Você' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'price', label: 'Preço', type: 'text', group: 'content', defaultValue: 'R$ 197' },
      { key: 'discount', label: 'Desconto', type: 'text', group: 'content', description: 'Ex: 50% OFF' },
      { key: 'ctaText', label: 'Texto do CTA', type: 'text', group: 'content', defaultValue: 'Quero garantir' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-result-header': {
    label: 'Step 20 - Cabeçalho de Resultado',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content' },
      { key: 'userName', label: 'Nome do Usuário', type: 'text', group: 'content', description: 'Variável: {{userName}}' },
      { key: 'mainStyle', label: 'Estilo Principal', type: 'text', group: 'content', description: 'Variável: {{mainStyle}}' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-secondary-styles': {
    label: 'Step 20 - Estilos Secundários',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Estilos Complementares' },
      { key: 'styles', label: 'Estilos', type: 'json', group: 'content', description: 'Array de estilos secundários' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-style-reveal': {
    label: 'Step 20 - Revelação de Estilo',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Seu Estilo é...' },
      { key: 'styleName', label: 'Nome do Estilo', type: 'text', group: 'content' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'image', label: 'Imagem', type: 'text', group: 'content', description: 'URL da imagem' },
      { key: 'animationDuration', label: 'Duração da Animação (ms)', type: 'number', group: 'behavior', defaultValue: 2000 },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'step20-user-greeting': {
    label: 'Step 20 - Saudação ao Usuário',
    fields: [
      { key: 'greeting', label: 'Saudação', type: 'text', group: 'content', defaultValue: 'Olá, {{userName}}!' },
      { key: 'message', label: 'Mensagem', type: 'textarea', group: 'content' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // AI Components
  'fashion-ai-generator': {
    label: 'Gerador de IA Fashion',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Gerador de Looks com IA' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'buttonText', label: 'Texto do Botão', type: 'text', group: 'content', defaultValue: 'Gerar Look com IA' },
      { key: 'apiEndpoint', label: 'Endpoint da API', type: 'text', group: 'config', description: 'URL do endpoint de IA' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Sales & Marketing Components
  'sales-hero': {
    label: 'Hero de Vendas',
    fields: [
      { key: 'headline', label: 'Headline Principal', type: 'text', group: 'content', required: true, defaultValue: 'Transforme Seu Estilo' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', group: 'content', defaultValue: 'Descubra o método comprovado' },
      { key: 'ctaText', label: 'Texto do CTA', type: 'text', group: 'content', defaultValue: 'Quero começar agora' },
      { key: 'ctaUrl', label: 'URL do CTA', type: 'text', group: 'content', defaultValue: '#' },
      { key: 'backgroundImage', label: 'Imagem de Fundo', type: 'text', group: 'style', description: 'URL da imagem de fundo' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'overlay', label: 'Overlay', type: 'boolean', group: 'style', defaultValue: true, description: 'Adicionar overlay escuro sobre a imagem' },
      { key: 'overlayOpacity', label: 'Opacidade do Overlay', type: 'range', group: 'style', min: 0, max: 100, defaultValue: 50 },
      { key: 'minHeight', label: 'Altura Mínima', type: 'text', group: 'layout', defaultValue: '600px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'secondary-styles': {
    label: 'Estilos Secundários',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', defaultValue: 'Outros Estilos Para Você' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content' },
      { key: 'styles', label: 'Lista de Estilos', type: 'json', group: 'content', description: 'Array com [{name, description, image, compatibility}]', required: true },
      { key: 'showCompatibility', label: 'Mostrar Compatibilidade', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'columns', label: 'Colunas', type: 'select', group: 'layout', options: [{ label: '2 Colunas', value: 2 }, { label: '3 Colunas', value: 3 }, { label: '4 Colunas', value: 4 }], defaultValue: 3 },
      { key: 'cardBackgroundColor', label: 'Cor de Fundo dos Cards', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'cardBorderColor', label: 'Cor da Borda dos Cards', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // ============================================================================
  // 🆕 NOVOS SCHEMAS - Cobertura 100% do Editor
  // ============================================================================

  // Content Components
  'heading': {
    label: 'Título (H1-H6)',
    fields: [
      { key: 'text', label: 'Texto do Título', type: 'text', group: 'content', required: true, defaultValue: 'Título' },
      {
        key: 'level', label: 'Nível (H1-H6)', type: 'select', group: 'content', options: [
          { label: 'H1 - Principal', value: 1 },
          { label: 'H2 - Seção', value: 2 },
          { label: 'H3 - Subtítulo', value: 3 },
          { label: 'H4 - Menor', value: 4 },
          { label: 'H5 - Micro', value: 5 },
          { label: 'H6 - Mínimo', value: 6 }
        ], defaultValue: 2
      },
      { key: 'fontSize', label: 'Tamanho da Fonte', type: 'text', group: 'style', defaultValue: '24px', description: 'Ex: 24px, 2rem, 1.5em' },
      {
        key: 'fontWeight', label: 'Peso da Fonte', type: 'select', group: 'style', options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Médio', value: '500' },
          { label: 'Semi-bold', value: '600' },
          { label: 'Bold', value: 'bold' },
          { label: 'Extra Bold', value: '800' }
        ], defaultValue: 'bold'
      },
      { key: 'color', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#432818' },
      {
        key: 'textAlign', label: 'Alinhamento', type: 'select', group: 'style', options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' },
          { label: 'Justificado', value: 'justify' }
        ], defaultValue: 'center'
      },
      { key: 'marginTop', label: 'Margem Superior', type: 'text', group: 'layout', defaultValue: '0px' },
      { key: 'marginBottom', label: 'Margem Inferior', type: 'text', group: 'layout', defaultValue: '16px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Quiz Components
  'question-hero': {
    label: 'Hero de Pergunta',
    fields: [
      { key: 'title', label: 'Título da Pergunta', type: 'text', group: 'content', required: true, defaultValue: 'Qual é a sua pergunta?' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content', description: 'Texto complementar abaixo do título' },
      { key: 'backgroundImage', label: 'Imagem de Fundo', type: 'text', group: 'style', description: 'URL da imagem de fundo' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#f8f9fa' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'overlay', label: 'Overlay Escuro', type: 'boolean', group: 'style', defaultValue: false },
      { key: 'minHeight', label: 'Altura Mínima', type: 'text', group: 'layout', defaultValue: '300px' },
      { key: 'padding', label: 'Padding', type: 'text', group: 'layout', defaultValue: '48px 24px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'strategic-question': {
    label: 'Pergunta Estratégica',
    fields: [
      { key: 'question', label: 'Pergunta', type: 'text', group: 'content', required: true, defaultValue: 'Esta é uma pergunta estratégica...' },
      { key: 'description', label: 'Descrição/Contexto', type: 'textarea', group: 'content', description: 'Texto explicativo adicional' },
      { key: 'highlightColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#b3a26a' },
      { key: 'icon', label: 'Ícone', type: 'text', group: 'content', description: 'Nome do ícone Lucide ou URL' },
      { key: 'showProgress', label: 'Mostrar Progresso', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'required', label: 'Resposta Obrigatória', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'transition-hero': {
    label: 'Hero de Transição',
    fields: [
      { key: 'title', label: 'Título da Transição', type: 'text', group: 'content', required: true, defaultValue: 'Processando suas respostas...' },
      { key: 'subtitle', label: 'Subtítulo', type: 'text', group: 'content', defaultValue: 'Aguarde enquanto calculamos seu resultado' },
      { key: 'showLoader', label: 'Mostrar Animação', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'autoAdvance', label: 'Avançar Automaticamente', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'delay', label: 'Tempo de Espera (ms)', type: 'number', group: 'content', min: 0, max: 10000, defaultValue: 2000, description: 'Tempo antes de avançar automaticamente' },
      { key: 'backgroundImage', label: 'Imagem de Fundo', type: 'text', group: 'style' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'minHeight', label: 'Altura Mínima', type: 'text', group: 'layout', defaultValue: '400px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  // Offer/Sales Components
  'offer-hero': {
    label: 'Hero de Oferta',
    fields: [
      { key: 'headline', label: 'Headline Principal', type: 'text', group: 'content', required: true, defaultValue: 'Oferta Especial' },
      { key: 'subheadline', label: 'Subheadline', type: 'textarea', group: 'content', defaultValue: 'Aproveite esta oportunidade única' },
      { key: 'price', label: 'Preço', type: 'text', group: 'content', defaultValue: 'R$ 297,00' },
      { key: 'oldPrice', label: 'Preço Antigo', type: 'text', group: 'content', description: 'Preço riscado (opcional)' },
      { key: 'ctaText', label: 'Texto do CTA', type: 'text', group: 'content', defaultValue: 'Quero garantir minha vaga' },
      { key: 'ctaUrl', label: 'URL do CTA', type: 'text', group: 'content', defaultValue: '#checkout' },
      { key: 'badgeText', label: 'Badge/Selo', type: 'text', group: 'content', description: 'Ex: "Desconto de 50%"' },
      { key: 'backgroundImage', label: 'Imagem de Fundo', type: 'text', group: 'style' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#f8f9fa' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#000000' },
      { key: 'ctaBackgroundColor', label: 'Cor do Botão', type: 'color', group: 'style', defaultValue: '#b3a26a' },
      { key: 'minHeight', label: 'Altura Mínima', type: 'text', group: 'layout', defaultValue: '500px' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style', description: 'Classes Tailwind personalizadas' }
    ]
  },

  'bonus': {
    label: 'Seção de Bônus',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'Bônus Exclusivos' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content' },
      { key: 'bonusList', label: 'Lista de Bônus', type: 'json', group: 'content', required: true, description: 'Array com [{title, description, value, image}]' },
      { key: 'showValues', label: 'Mostrar Valores', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'totalValue', label: 'Valor Total', type: 'text', group: 'content' },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', options: [{ label: 'Lista', value: 'list' }, { label: 'Grade 2 Colunas', value: 'grid-2' }, { label: 'Grade 3 Colunas', value: 'grid-3' }], defaultValue: 'list' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'accentColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#b3a26a' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style' }
    ]
  },

  'testimonials': {
    label: 'Grade de Depoimentos',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'Depoimentos' },
      { key: 'testimonialsList', label: 'Lista de Depoimentos', type: 'json', group: 'content', required: true, description: 'Array com [{name, photo, text, rating, location}]' },
      { key: 'columns', label: 'Colunas', type: 'select', group: 'layout', options: [{ label: '1 Coluna', value: 1 }, { label: '2 Colunas', value: 2 }, { label: '3 Colunas', value: 3 }], defaultValue: 3 },
      { key: 'showRatings', label: 'Mostrar Avaliações', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'showPhotos', label: 'Mostrar Fotos', type: 'boolean', group: 'content', defaultValue: true },
      { key: 'cardBackgroundColor', label: 'Cor de Fundo dos Cards', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'cardBorderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#e5e7eb' },
      { key: 'starColor', label: 'Cor das Estrelas', type: 'color', group: 'style', defaultValue: '#fbbf24' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style' }
    ]
  },

  'guarantee': {
    label: 'Seção de Garantia',
    fields: [
      { key: 'title', label: 'Título', type: 'text', group: 'content', required: true, defaultValue: 'Garantia Incondicional de 30 Dias' },
      { key: 'description', label: 'Descrição', type: 'textarea', group: 'content', required: true, defaultValue: 'Se você não ficar satisfeito, devolvemos 100% do seu dinheiro.' },
      { key: 'guaranteePeriod', label: 'Período de Garantia', type: 'text', group: 'content', defaultValue: '30 dias' },
      { key: 'icon', label: 'Ícone', type: 'text', group: 'content' },
      { key: 'badgeText', label: 'Texto do Selo', type: 'text', group: 'content', defaultValue: '100% Garantido' },
      { key: 'highlightColor', label: 'Cor de Destaque', type: 'color', group: 'style', defaultValue: '#10b981' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ecfdf5' },
      { key: 'textColor', label: 'Cor do Texto', type: 'color', group: 'style', defaultValue: '#065f46' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color', group: 'style', defaultValue: '#10b981' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style' }
    ]
  },

  'benefits': {
    label: 'Lista de Benefícios',
    fields: [
      { key: 'title', label: 'Título da Seção', type: 'text', group: 'content', defaultValue: 'O Que Você Vai Receber' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', group: 'content' },
      { key: 'benefitsList', label: 'Lista de Benefícios', type: 'json', group: 'content', required: true, description: 'Array com [{title, description, icon}]' },
      { key: 'layout', label: 'Layout', type: 'select', group: 'layout', options: [{ label: 'Lista', value: 'list' }, { label: 'Grade 2 Colunas', value: 'grid-2' }, { label: 'Grade 3 Colunas', value: 'grid-3' }], defaultValue: 'grid-2' },
      { key: 'iconStyle', label: 'Estilo do Ícone', type: 'select', group: 'style', options: [{ label: 'Check Simples', value: 'check' }, { label: 'Check Circulado', value: 'check-circle' }, { label: 'Estrela', value: 'star' }, { label: 'Customizado', value: 'custom' }], defaultValue: 'check-circle' },
      { key: 'iconColor', label: 'Cor do Ícone', type: 'color', group: 'style', defaultValue: '#10b981' },
      { key: 'backgroundColor', label: 'Cor de Fundo', type: 'color', group: 'style', defaultValue: '#ffffff' },
      { key: 'className', label: 'Classes CSS', type: 'text', group: 'style' }
    ]
  },

};
