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
    label: 'Grade de Opções',
    fields: [
      // === CONFIGURAÇÃO VISUAL PRINCIPAL ===
      { key: 'options', label: 'Lista de Opções', type: 'options-list' },

      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { label: 'Grade', value: 'grid' },
          { label: 'Lista', value: 'list' },
        ],
      },
      {
        key: 'columns',
        label: 'Número de Colunas',
        type: 'select',
        options: [
          { label: '1 Coluna', value: 1 },
          { label: '2 Colunas', value: 2 },
          { label: '3 Colunas', value: 3 },
          { label: '4 Colunas', value: 4 },
        ],
      },
      {
        key: 'layoutOrientation',
        label: 'Direção do Layout',
        type: 'select',
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
        ],
      },
      {
        key: 'contentType',
        label: 'Tipo de Conteúdo',
        type: 'select',
        options: [
          { label: 'Imagem + Texto', value: 'text-and-image' },
          { label: 'Apenas Imagem', value: 'image-only' },
          { label: 'Apenas Texto', value: 'text-only' },
        ],
      },

      // === CONFIGURAÇÃO DE IMAGENS ===
      { key: 'showImages', label: 'Mostrar Imagens', type: 'boolean' },
      {
        key: 'imagePosition',
        label: 'Posição da Imagem',
        type: 'select',
        options: [
          { label: 'Acima do Texto', value: 'top' },
          { label: 'À Esquerda', value: 'left' },
          { label: 'À Direita', value: 'right' },
          { label: 'Como Fundo', value: 'background' },
        ],
      },
      { key: 'imageSize', label: 'Tamanho da Imagem (px)', type: 'number' },
      {
        key: 'imageAspect',
        label: 'Proporção da Imagem',
        type: 'select',
        options: [
          { label: '1:1 (Quadrado)', value: '1:1' },
          { label: '4:3 (Paisagem)', value: '4:3' },
          { label: '16:9 (Widescreen)', value: '16:9' },
        ],
      },

      // === COMPORTAMENTO DE SELEÇÃO ===
      { key: 'multipleSelection', label: 'Seleção Múltipla', type: 'boolean' },
      { key: 'minSelections', label: 'Mínimo de Seleções', type: 'number' },
      { key: 'maxSelections', label: 'Máximo de Seleções', type: 'number' },
      { key: 'allowDeselect', label: 'Permitir Desmarcar', type: 'boolean' },
      { key: 'showCheckmark', label: 'Mostrar Marcador', type: 'boolean' },

      // === ESTILO VISUAL ===
      { key: 'gap', label: 'Espaçamento entre Itens (px)', type: 'number' },
      { key: 'cardRadius', label: 'Arredondamento (px)', type: 'number' },
      { key: 'borderColor', label: 'Cor da Borda', type: 'color' },
      { key: 'selectedBorderColor', label: 'Cor da Borda Selecionada', type: 'color' },
      { key: 'hoverColor', label: 'Cor de Hover', type: 'color' },
      {
        key: 'labelPosition',
        label: 'Posição do Rótulo',
        type: 'select',
        options: [
          { label: 'Abaixo da Imagem', value: 'bottom' },
          { label: 'À Direita da Imagem', value: 'right' },
          { label: 'Sobreposto', value: 'overlay' },
        ],
      },

      // === CONFIGURAÇÃO AVANÇADA ===
      { key: 'showBorders', label: 'Mostrar Bordas', type: 'boolean' },
      { key: 'showShadows', label: 'Mostrar Sombras', type: 'boolean' },
      { key: 'responsiveColumns', label: 'Colunas Responsivas', type: 'boolean' },
      {
        key: 'scale',
        label: 'Escala do Componente (%)',
        type: 'range',
        min: 50,
        max: 200,
        step: 1,
        description: 'Zoom do componente de grid como um todo. 100% = padrão.',
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
        defaultValue: 'Juliana Estilo',
      },
      {
        key: 'mentorTitle',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Consultora de Imagem e Estilo',
      },
      { key: 'mentorImage', label: 'URL da Imagem', type: 'text', group: 'content' },
      { key: 'mentorBio', label: 'Bio', type: 'textarea', group: 'content' },
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
};
