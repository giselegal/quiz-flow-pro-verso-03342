// =====================================================================
// CLEAN BLOCK DEFINITIONS - ES7+ MODERN COMPONENTS
// Configuração moderna para sistema de blocos inline responsivos
// =====================================================================

import type { BlockDefinition as BaseBlockDefinition } from './blockDefinitions.ts';

// Interface para BlockDefinition com defaultProperties opcional
export interface BlockDefinition extends Omit<BaseBlockDefinition, 'defaultProperties'> {
  defaultProperties?: Record<string, any>;
}

// Interface para PropertySchema ES7+
export interface PropertySchema {
  key: string;
  label: string;
  type: 'text' | 'text-input' | 'textarea' | 'text-area' | 'select' | 'number' | 'number-input' | 
        'boolean' | 'boolean-switch' | 'image-url' | 'image-upload' | 'video-url' | 
        'array-editor' | 'json-editor' | 'color-picker' | 'color' | 'url' | 'datetime-local' |
        'font-size-slider' | 'font-weight-buttons' | 'text-style-buttons' | 'text-align-buttons' |
        'content-type-buttons' | 'color-palette' | 'array' | 'range-slider' | 'file-upload';
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: any;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  required?: boolean;
  description?: string;
  nestedPath?: string;
  itemSchema?: PropertySchema[];
  group?: 'content' | 'style' | 'layout' | 'advanced';
}

export const blockDefinitions: BlockDefinition[] = [
  // =====================================================================
  // COMPONENTES ESSENCIAIS DO QUIZ (Header com Logo + Progresso)
  // =====================================================================
  {
    type: 'quiz-intro-header',
    name: 'Header Quiz (Logo + Progresso)',
    description: 'Cabeçalho elegante com logotipo e barra de progresso para todas as etapas',
    icon: 'Crown',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'logoSrc',
        label: 'URL do Logo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        description: 'Logo da marca (formato recomendado: PNG/SVG)'
      },
      {
        key: 'logoAlt',
        label: 'Texto Alternativo',
        type: 'text-input',
        defaultValue: 'Logo Gisele Galvão',
        placeholder: 'Descrição do logo para acessibilidade'
      },
      {
        key: 'logoWidth',
        label: 'Largura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 50,
        max: 200
      },
      {
        key: 'logoHeight',
        label: 'Altura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 50,
        max: 200
      },
      {
        key: 'progressValue',
        label: 'Progresso (%)',
        type: 'number-input',
        defaultValue: 0,
        min: 0,
        max: 100,
        description: 'Valor atual do progresso do quiz'
      },
      {
        key: 'progressMax',
        label: 'Progresso Máximo',
        type: 'number-input',
        defaultValue: 100,
        min: 1,
        max: 100,
        description: 'Valor máximo do progresso'
      },
      {
        key: 'showBackButton',
        label: 'Mostrar Botão Voltar',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'showProgressBar',
        label: 'Mostrar Barra de Progresso',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'containerWidth',
        label: 'Largura do Container',
        type: 'select',
        defaultValue: 'full',
        options: [
          { label: 'Largura Total', value: 'full' },
          { label: 'Máximo 4xl', value: 'max-4xl' },
          { label: 'Máximo 2xl', value: 'max-2xl' }
        ]
      },
      {
        key: 'gap',
        label: 'Espaçamento Interno',
        type: 'select',
        defaultValue: '4',
        options: [
          { label: 'Pequeno (2)', value: '2' },
          { label: 'Médio (4)', value: '4' },
          { label: 'Grande (6)', value: '6' },
          { label: 'Extra Grande (8)', value: '8' }
        ]
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: '#ffffff',
        description: 'Cor de fundo do cabeçalho'
      }
    ]
  },

  // =====================================================================
  // CABEÇALHO UNIVERSAL PARA ETAPAS DO QUIZ
  // =====================================================================
  {
    type: 'vertical-canvas-header',
    name: 'Cabeçalho Vertical',
    description: 'Cabeçalho universal com logo, progresso e botão voltar para todas as etapas',
    icon: 'Layout',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'logoSrc',
        label: 'URL do Logo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.png',
        description: 'Logo da marca (recomendado: PNG/SVG quadrado)'
      },
      {
        key: 'logoAlt',
        label: 'Texto Alternativo do Logo',
        type: 'text-input',
        defaultValue: 'Logo',
        placeholder: 'Descrição do logo para acessibilidade'
      },
      {
        key: 'logoWidth',
        label: 'Largura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 48,
        max: 200,
        description: 'Largura em pixels (recomendado: 96px)'
      },
      {
        key: 'logoHeight',
        label: 'Altura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 48,
        max: 200,
        description: 'Altura em pixels (recomendado: 96px)'
      },
      {
        key: 'progressValue',
        label: 'Progresso Atual (%)',
        type: 'number-input',
        defaultValue: 7.14,
        min: 0,
        max: 100,
        description: 'Porcentagem atual do progresso'
      },
      {
        key: 'progressMax',
        label: 'Progresso Máximo',
        type: 'number-input',
        defaultValue: 100,
        min: 1,
        max: 100,
        description: 'Valor máximo do progresso'
      },
      {
        key: 'showProgress',
        label: 'Mostrar Barra de Progresso',
        type: 'boolean-switch',
        defaultValue: true,
        description: 'Exibir ou ocultar a barra de progresso'
      },
      {
        key: 'showBackButton',
        label: 'Mostrar Botão Voltar',
        type: 'boolean-switch',
        defaultValue: true,
        description: 'Exibir botão de navegação para etapa anterior'
      },
      {
        key: 'containerWidth',
        label: 'Largura do Container',
        type: 'select',
        options: [
          { label: 'Largura Total', value: 'w-full' },
          { label: 'Largura Customizada', value: 'customizable-width' },
          { label: 'Máximo 2XL', value: 'w-full max-w-2xl' },
          { label: 'Máximo XL', value: 'w-full max-w-xl' }
        ],
        defaultValue: 'w-full',
        description: 'Controla a largura do container principal'
      },
      {
        key: 'gap',
        label: 'Espaçamento Interno',
        type: 'select',
        options: [
          { label: 'Pequeno (2)', value: 'gap-2' },
          { label: 'Médio (4)', value: 'gap-4' },
          { label: 'Grande (6)', value: 'gap-6' },
          { label: 'Extra Grande (8)', value: 'gap-8' }
        ],
        defaultValue: 'gap-4',
        description: 'Espaçamento entre elementos do cabeçalho'
      }
    ]
  },

  // =====================================================================
  // COMPONENTES INLINE BÁSICOS MODERNOS
  // =====================================================================
  {
    type: 'text-inline',
    name: 'Texto Moderno',
    description: 'Texto responsivo com tipografia Playfair Display para títulos',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Conteúdo',
        type: 'textarea',
        defaultValue: 'Texto editável com formatação elegante.',
        rows: 3,
        description: 'Suporte a HTML e palavras destacadas'
      },
      {
        key: 'fontFamily',
        label: 'Família da Fonte',
        type: 'select',
        options: [
          { label: 'Playfair Display (Títulos)', value: 'Playfair Display' },
          { label: 'Inter (Texto)', value: 'Inter' },
          { label: 'System UI', value: 'system-ui' }
        ],
        defaultValue: 'Inter'
      },
      {
        key: 'fontSize',
        label: 'Tamanho',
        type: 'select',
        options: [
          { label: 'Pequeno (14px)', value: 'text-sm' },
          { label: 'Normal (16px)', value: 'text-base' },
          { label: 'Grande (18px)', value: 'text-lg' },
          { label: 'Título (24px)', value: 'text-2xl' },
          { label: 'Hero (32px)', value: 'text-3xl' }
        ],
        defaultValue: 'text-base'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'text-left' },
          { label: 'Centro', value: 'text-center' },
          { label: 'Direita', value: 'text-right' }
        ],
        defaultValue: 'text-left'
      },
      {
        key: 'color',
        label: 'Cor do Texto',
        type: 'color-picker',
        defaultValue: '#432818'
      }
    ]
  },

  {
    type: 'heading-inline',
    name: 'Título Elegante',
    description: 'Títulos com Playfair Display e destaque de palavras estratégicas',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'content',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Título Principal',
        description: 'Use <span class="text-brand"> para destacar palavras'
      },
      {
        key: 'level',
        label: 'Nível',
        type: 'select',
        options: [
          { label: 'H1 (Hero)', value: 'h1' },
          { label: 'H2 (Seção)', value: 'h2' },
          { label: 'H3 (Subseção)', value: 'h3' },
          { label: 'H4 (Pequeno)', value: 'h4' }
        ],
        defaultValue: 'h2'
      },
      {
        key: 'fontWeight',
        label: 'Peso da Fonte',
        type: 'select',
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Médio', value: 'medium' },
          { label: 'Semi-Negrito', value: 'semibold' },
          { label: 'Negrito', value: 'bold' },
          { label: 'Extra Negrito', value: 'extrabold' }
        ],
        defaultValue: 'bold'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ],
        defaultValue: 'center'
      },
      {
        key: 'color',
        label: 'Cor do Texto',
        type: 'color-picker',
        defaultValue: '#1f2937'
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: 'transparent'
      },
      {
        key: 'maxWidth',
        label: 'Largura Máxima',
        type: 'select',
        options: [
          { label: 'Pequena', value: 'sm' },
          { label: 'Média', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra Grande', value: 'xl' },
          { label: 'Completa', value: 'full' }
        ],
        defaultValue: 'full'
      }
    ]
  },

  {
    type: 'button-inline',
    name: 'Botão Elegante',
    description: 'Botão responsivo com design moderno e elegante',
    icon: 'Play',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text-input',
        defaultValue: 'Clique Aqui',
        placeholder: 'Ex: QUERO DESCOBRIR MEU ESTILO'
      },
      {
        key: 'href',
        label: 'Link/Ação',
        type: 'text-input',
        defaultValue: '#',
        placeholder: 'URL ou ação JavaScript'
      },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
          { label: 'Fantasma', value: 'ghost' },
          { label: 'Destrutivo', value: 'destructive' }
        ],
        defaultValue: 'primary'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' }
        ],
        defaultValue: 'medium'
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: [
          { label: 'Nenhum', value: 'none' },
          { label: 'Seta Direita', value: 'arrow-right' },
          { label: 'Download', value: 'download' },
          { label: 'Play', value: 'play' },
          { label: 'Estrela', value: 'star' }
        ],
        defaultValue: 'none'
      },
      {
        key: 'iconPosition',
        label: 'Posição do Ícone',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Direita', value: 'right' }
        ],
        defaultValue: 'right'
      },
      {
        key: 'fullWidth',
        label: 'Largura Total',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'disabled',
        label: 'Desabilitado',
        type: 'boolean-switch',
        defaultValue: false
      }
    ]
  },

  // =====================================================================
  // COMPONENTES ESPECÍFICOS DO QUIZ
  // =====================================================================
  {
    type: 'options-grid',
    name: 'Grade de Opções',
    description: 'Grid responsivo para opções do quiz com imagens',
    icon: 'Rows3',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'options',
        label: 'Opções',
        type: 'array-editor',
        defaultValue: [
          { text: 'Opção 1', value: 'opt1', imageUrl: '' },
          { text: 'Opção 2', value: 'opt2', imageUrl: '' },
          { text: 'Opção 3', value: 'opt3', imageUrl: '' },
          { text: 'Opção 4', value: 'opt4', imageUrl: '' }
        ],
        description: 'Cada opção pode ter texto e imagem'
      },
      {
        key: 'columns',
        label: 'Colunas (Desktop)',
        type: 'select',
        options: [
          { label: '1 Coluna', value: '1' },
          { label: '2 Colunas', value: '2' },
          { label: '3 Colunas', value: '3' },
          { label: '4 Colunas', value: '4' }
        ],
        defaultValue: '2'
      },
      {
        key: 'allowMultiple',
        label: 'Seleção Múltipla',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'showImages',
        label: 'Mostrar Imagens',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  // =====================================================================
  // COMPONENTES PARA QUESTÕES ESTRATÉGICAS COM IMAGENS
  // =====================================================================
  {
    type: 'strategic-question-image',
    name: 'Imagem Questão Estratégica',
    description: 'Imagem contextual para questões estratégicas',
    icon: 'Image',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'src',
        label: 'URL da Imagem',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838072/20250509_2109_Conselho_de_Estilo_simple_compose_01jtvtxygfnwkz71wpgpe08e20_qnhfuq.webp',
        description: 'Imagem das questões estratégicas 13-18'
      },
      {
        key: 'alt',
        label: 'Texto Alternativo',
        type: 'text-input',
        defaultValue: 'Questão estratégica',
        placeholder: 'Descrição da imagem'
      },
      {
        key: 'aspectRatio',
        label: 'Proporção',
        type: 'select',
        options: [
          { label: '16:9 (Landscape)', value: '16/9' },
          { label: '4:3 (Clássico)', value: '4/3' },
          { label: '3:2 (Foto)', value: '3/2' }
        ],
        defaultValue: '16/9'
      }
    ]
  },

  {
    type: 'progress-inline',
    name: 'Barra de Progresso Elegante',
    description: 'Progresso visual com design sofisticado',
    icon: 'TrendingUp',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'value',
        label: 'Valor (%)',
        type: 'number-input',
        defaultValue: 50,
        min: 0,
        max: 100
      },
      {
        key: 'showLabel',
        label: 'Mostrar Percentual',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Elegante (Gradiente Marrom)', value: 'elegant' },
          { label: 'Minimalista', value: 'minimal' },
          { label: 'Decorativo', value: 'decorative' }
        ],
        defaultValue: 'elegant'
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      }
    ]
  },

  {
    type: 'loading-animation',
    name: 'Animação de Carregamento',
    description: 'Loading elegante para transições',
    icon: 'RotateCw',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'type',
        label: 'Tipo',
        type: 'select',
        options: [
          { label: 'Spinner Elegante', value: 'elegant-spinner' },
          { label: 'Dots Animados', value: 'dots' },
          { label: 'Pulse Suave', value: 'pulse' },
          { label: 'Barra de Progresso', value: 'progress' }
        ],
        defaultValue: 'elegant-spinner'
      },
      {
        key: 'message',
        label: 'Mensagem',
        type: 'text-input',
        defaultValue: 'Analisando suas respostas...',
        placeholder: 'Texto durante o carregamento'
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      }
    ]
  },

  {
    type: 'image-display-inline',
    name: 'Imagem Responsiva',
    description: 'Exibição elegante de imagens com lazy loading',
    icon: 'Image',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'src',
        label: 'URL da Imagem',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/600x400',
        description: 'Recomendado: WebP ou JPEG otimizado'
      },
      {
        key: 'alt',
        label: 'Texto Alternativo',
        type: 'text-input',
        defaultValue: 'Imagem',
        placeholder: 'Descrição para acessibilidade'
      },
      {
        key: 'aspectRatio',
        label: 'Proporção',
        type: 'select',
        options: [
          { label: '16:9 (Landscape)', value: '16/9' },
          { label: '4:3 (Clássico)', value: '4/3' },
          { label: '1:1 (Quadrado)', value: '1/1' },
          { label: '3:4 (Retrato)', value: '3/4' }
        ],
        defaultValue: '16/9'
      },
      {
        key: 'borderRadius',
        label: 'Borda Arredondada',
        type: 'select',
        options: [
          { label: 'Nenhuma', value: 'none' },
          { label: 'Pequena', value: 'sm' },
          { label: 'Média', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'Completa', value: 'full' }
        ],
        defaultValue: 'lg'
      },
      {
        key: 'shadow',
        label: 'Sombra',
        type: 'select',
        options: [
          { label: 'Nenhuma', value: 'none' },
          { label: 'Suave', value: 'sm' },
          { label: 'Média', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'Elegante', value: 'elegant' }
        ],
        defaultValue: 'elegant'
      }
    ]
  },

  // =====================================================================
  // COMPONENTES DA ETAPA 20 (RESULTADO) - SEÇÕES ORGANIZADAS
  // =====================================================================
  {
    type: 'result-header-inline',
    name: 'Header de Resultado',
    description: 'Cabeçalho personalizado com nome do usuário',
    icon: 'Award',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'logoUrl',
        label: 'Logo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
      },
      {
        key: 'userName',
        label: 'Nome do Usuário',
        type: 'text-input',
        defaultValue: '{{userName}}',
        description: 'Variável dinâmica preenchida automaticamente'
      },
      {
        key: 'welcomeMessage',
        label: 'Mensagem de Boas-vindas',
        type: 'text-input',
        defaultValue: 'Parabéns, {{userName}}! Seu resultado está pronto.',
        placeholder: 'Use {{userName}} para personalizar'
      },
      {
        key: 'titleFont',
        label: 'Fonte do Título',
        type: 'select',
        options: [
          { label: 'Playfair Display (Elegante)', value: 'playfair' },
          { label: 'Inter (Moderna)', value: 'inter' },
          { label: 'System Font', value: 'system' }
        ],
        defaultValue: 'playfair'
      },
      {
        key: 'textColor',
        label: 'Cor do Texto',
        type: 'color-picker',
        defaultValue: '#4A4A4A'
      }
    ]
  },

  {
    type: 'result-card-inline',
    name: 'Card de Resultado',
    description: 'Card elegante para exibir o resultado do quiz',
    icon: 'Star',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'resultType',
        label: 'Tipo de Resultado',
        type: 'select',
        options: [
          { label: 'Romântico', value: 'romantic' },
          { label: 'Clássico', value: 'classic' },
          { label: 'Boho Chic', value: 'boho' },
          { label: 'Moderno', value: 'modern' },
          { label: 'Minimalista', value: 'minimal' },
          { label: 'Dramático', value: 'dramatic' }
        ],
        defaultValue: 'romantic'
      },
      {
        key: 'title',
        label: 'Título do Resultado',
        type: 'text-input',
        defaultValue: 'Seu Estilo: Romântico',
        placeholder: 'Ex: Seu Estilo: Romântico'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Você possui uma alma romântica e delicada, que se expressa através de peças femininas e detalhes únicos...',
        placeholder: 'Descrição detalhada do estilo'
      },
      {
        key: 'imageUrl',
        label: 'Imagem do Resultado',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838072/20250509_2109_Conselho_de_Estilo_simple_compose_01jtvtxygfnwkz71wpgpe08e20_qnhfuq.webp'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number-input',
        defaultValue: 85,
        min: 0,
        max: 100
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: '#FFFFFF'
      },
      {
        key: 'borderColor',
        label: 'Cor da Borda',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      }
    ]
  },

  {
    type: 'style-card-inline',
    name: 'Card de Estilo',
    description: 'Card para exibir estilos secundários/complementares',
    icon: 'Shirt',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text-input',
        defaultValue: 'Clássico',
        placeholder: 'Ex: Clássico, Boho, Moderno'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number-input',
        defaultValue: 15,
        min: 0,
        max: 100
      },
      {
        key: 'description',
        label: 'Descrição Breve',
        type: 'text-input',
        defaultValue: 'Elementos sofisticados e atemporais',
        placeholder: 'Breve descrição do estilo'
      },
      {
        key: 'imageUrl',
        label: 'Imagem do Estilo',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/200x200'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' }
        ],
        defaultValue: 'medium'
      }
    ]
  },

  {
    type: 'before-after-inline',
    name: 'Antes & Depois',
    description: 'Comparação visual de transformação',
    icon: 'ArrowLeftRight',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'beforeImage',
        label: 'Imagem "Antes"',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/300x400'
      },
      {
        key: 'afterImage',
        label: 'Imagem "Depois"',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/300x400'
      },
      {
        key: 'beforeLabel',
        label: 'Rótulo "Antes"',
        type: 'text-input',
        defaultValue: 'Antes'
      },
      {
        key: 'afterLabel',
        label: 'Rótulo "Depois"',
        type: 'text-input',
        defaultValue: 'Depois'
      },
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Sua Transformação',
        placeholder: 'Título da seção'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Veja como você pode elevar seu estilo...',
        placeholder: 'Descrição da transformação'
      }
    ]
  },

  // =====================================================================
  // COMPONENTES MODULARES INDEPENDENTES PARA ETAPA 21 (ES7+)
  // Cada componente é autônomo e pode ser usado individualmente
  // =====================================================================
  
  {
    type: 'hero-badge-inline',
    name: 'Badge de Credibilidade',
    description: 'Badge independente com ícone e texto de credibilidade',
    icon: 'Award',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: [
          { label: 'Award', value: 'Award' },
          { label: 'Users', value: 'Users' },
          { label: 'Star', value: 'Star' },
          { label: 'CheckCircle', value: 'CheckCircle' }
        ],
        defaultValue: 'Award'
      },
      {
        key: 'text',
        label: 'Texto',
        type: 'text-input',
        defaultValue: '3000+ mulheres transformadas'
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: '#dcfce7'
      },
      {
        key: 'borderColor',
        label: 'Cor da Borda',
        type: 'color-picker',
        defaultValue: '#bbf7d0'
      },
      {
        key: 'textColor',
        label: 'Cor do Texto',
        type: 'color-picker',
        defaultValue: '#15803d'
      }
    ]
  },

  {
    type: 'hero-title-inline',
    name: 'Título Hero',
    description: 'Título principal com destaque e formatação elegante',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'mainText',
        label: 'Texto Principal',
        type: 'textarea',
        defaultValue: 'Etapa 21: Oferta Exclusiva Para Seu Estilo!',
        rows: 2
      },
      {
        key: 'highlightText',
        label: 'Texto em Destaque',
        type: 'text-input',
        defaultValue: 'Oferta Exclusiva',
        description: 'Parte do texto que será destacada em cor diferente'
      },
      {
        key: 'fontSize',
        label: 'Tamanho da Fonte',
        type: 'select',
        options: [
          { label: 'Grande (2xl)', value: 'text-2xl' },
          { label: 'Extra Grande (3xl)', value: 'text-3xl' },
          { label: 'Hero (4xl)', value: 'text-4xl' },
          { label: 'Gigante (5xl)', value: 'text-5xl' }
        ],
        defaultValue: 'text-4xl'
      },
      {
        key: 'fontFamily',
        label: 'Família da Fonte',
        type: 'select',
        options: [
          { label: 'Playfair Display', value: 'Playfair Display' },
          { label: 'Inter', value: 'Inter' }
        ],
        defaultValue: 'Playfair Display'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Esquerda', value: 'left' },
          { label: 'Direita', value: 'right' }
        ],
        defaultValue: 'center'
      }
    ]
  },

  {
    type: 'problem-list-inline',
    name: 'Lista de Problemas',
    description: 'Lista independente de problemas/dores do cliente',
    icon: 'Target',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Você se identifica com isso?'
      },
      {
        key: 'problems',
        label: 'Lista de Problemas',
        type: 'array-editor',
        defaultValue: [
          'Guarda-roupa cheio mas nunca tem o que vestir?',
          'Compra peças que nunca combinam com nada?',
          'Sente que "nada fica bom" em você?'
        ]
      },
      {
        key: 'listStyle',
        label: 'Estilo da Lista',
        type: 'select',
        options: [
          { label: 'Marcadores', value: 'bullets' },
          { label: 'Ícones X', value: 'x-icons' },
          { label: 'Números', value: 'numbers' }
        ],
        defaultValue: 'bullets'
      },
      {
        key: 'spacing',
        label: 'Espaçamento',
        type: 'select',
        options: [
          { label: 'Compacto', value: 'compact' },
          { label: 'Normal', value: 'normal' },
          { label: 'Amplo', value: 'wide' }
        ],
        defaultValue: 'normal'
      }
    ]
  },

  {
    type: 'highlight-box-inline',
    name: 'Caixa de Destaque',
    description: 'Caixa independente para destacar informações importantes',
    icon: 'Info',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto',
        type: 'textarea',
        defaultValue: 'Isso acontece porque você ainda não descobriu seu estilo predominante.',
        rows: 2
      },
      {
        key: 'style',
        label: 'Estilo da Caixa',
        type: 'select',
        options: [
          { label: 'Informativo (Azul)', value: 'info' },
          { label: 'Atenção (Laranja)', value: 'warning' },
          { label: 'Sucesso (Verde)', value: 'success' },
          { label: 'Erro (Vermelho)', value: 'error' }
        ],
        defaultValue: 'warning'
      },
      {
        key: 'showIcon',
        label: 'Mostrar Ícone',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'borderPosition',
        label: 'Posição da Borda',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Completa', value: 'full' },
          { label: 'Topo', value: 'top' }
        ],
        defaultValue: 'left'
      }
    ]
  },

  {
    type: 'product-card-inline',
    name: 'Card de Produto',
    description: 'Card independente para exibir um produto',
    icon: 'Gift',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'productName',
        label: 'Nome do Produto',
        type: 'text-input',
        defaultValue: 'Guia Personalizado'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'text-input',
        defaultValue: 'Para seu estilo específico'
      },
      {
        key: 'imageUrl',
        label: 'Imagem',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071347/MOCKUP_TABLETE_-_GUIA_DE_IMAGEM_E_ESTILO_ncctzi.webp'
      },
      {
        key: 'aspectRatio',
        label: 'Proporção da Imagem',
        type: 'select',
        options: [
          { label: '4:5 (Retrato)', value: '4/5' },
          { label: '1:1 (Quadrado)', value: '1/1' },
          { label: '16:9 (Landscape)', value: '16/9' }
        ],
        defaultValue: '4/5'
      },
      {
        key: 'showBorder',
        label: 'Mostrar Borda',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'textAlign',
        label: 'Alinhamento do Texto',
        type: 'select',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Esquerda', value: 'left' }
        ],
        defaultValue: 'center'
      }
    ]
  },

  {
    type: 'price-highlight-inline',
    name: 'Destaque de Preço',
    description: 'Bloco independente para destacar preços com gradiente',
    icon: 'CircleDollarSign',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'topLabel',
        label: 'Label Superior',
        type: 'text-input',
        defaultValue: 'Oferta por tempo limitado'
      },
      {
        key: 'installments',
        label: 'Parcelas',
        type: 'text-input',
        defaultValue: '5x de'
      },
      {
        key: 'installmentValue',
        label: 'Valor da Parcela',
        type: 'text-input',
        defaultValue: 'R$ 8,83'
      },
      {
        key: 'totalPrice',
        label: 'Preço Total',
        type: 'text-input',
        defaultValue: 'ou à vista R$ 39,90'
      },
      {
        key: 'discountInfo',
        label: 'Info do Desconto',
        type: 'text-input',
        defaultValue: '77% OFF - Economia de R$ 135,10'
      },
      {
        key: 'gradientFrom',
        label: 'Cor Inicial do Gradiente',
        type: 'color-picker',
        defaultValue: '#22c55e'
      },
      {
        key: 'gradientTo',
        label: 'Cor Final do Gradiente',
        type: 'color-picker',
        defaultValue: '#16a34a'
      }
    ]
  },

  {
    type: 'cta-button-inline',
    name: 'Botão CTA',
    description: 'Botão de call-to-action independente e configurável',
    icon: 'ArrowRight',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto do Botão',
        type: 'text-input',
        defaultValue: 'Garantir Minha Transformação'
      },
      {
        key: 'url',
        label: 'URL de Destino',
        type: 'text-input',
        defaultValue: 'https://pay.hotmart.com/W98977034C?checkoutMode=10&bid=1744967466912'
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: [
          { label: 'Seta Direita', value: 'ArrowRight' },
          { label: 'Carrinho', value: 'ShoppingCart' },
          { label: 'Sacola', value: 'ShoppingBag' },
          { label: 'Nenhum', value: 'none' }
        ],
        defaultValue: 'ArrowRight'
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' }
        ],
        defaultValue: 'large'
      },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Primário Verde', value: 'primary-green' },
          { label: 'Elegante Marrom', value: 'elegant-brown' },
          { label: 'Gradiente', value: 'gradient' }
        ],
        defaultValue: 'primary-green'
      },
      {
        key: 'fullWidth',
        label: 'Largura Completa',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'pulse',
        label: 'Animação Pulse',
        type: 'boolean-switch',
        defaultValue: false
      }
    ]
  },

  {
    type: 'trust-elements-inline',
    name: 'Elementos de Confiança',
    description: 'Lista horizontal de elementos que transmitem confiança',
    icon: 'Shield',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'elements',
        label: 'Elementos',
        type: 'array-editor',
        defaultValue: [
          { icon: 'Lock', text: '100% Seguro' },
          { icon: 'Shield', text: '7 Dias Garantia' }
        ]
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' }
        ],
        defaultValue: 'horizontal'
      },
      {
        key: 'iconColor',
        label: 'Cor dos Ícones',
        type: 'color-picker',
        defaultValue: '#22c55e'
      },
      {
        key: 'textSize',
        label: 'Tamanho do Texto',
        type: 'select',
        options: [
          { label: 'Pequeno', value: 'text-sm' },
          { label: 'Normal', value: 'text-base' },
          { label: 'Grande', value: 'text-lg' }
        ],
        defaultValue: 'text-sm'
      }
    ]
  },

  {
    type: 'countdown-timer-inline',
    name: 'Contador Regressivo',
    description: 'Timer independente de contagem regressiva',
    icon: 'Clock',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Esta oferta expira em:'
      },
      {
        key: 'hours',
        label: 'Horas Iniciais',
        type: 'number-input',
        defaultValue: 1,
        min: 0,
        max: 23
      },
      {
        key: 'minutes',
        label: 'Minutos Iniciais',
        type: 'number-input',
        defaultValue: 59,
        min: 0,
        max: 59
      },
      {
        key: 'seconds',
        label: 'Segundos Iniciais',
        type: 'number-input',
        defaultValue: 59,
        min: 0,
        max: 59
      },
      {
        key: 'autoRestart',
        label: 'Reiniciar Automaticamente',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'style',
        label: 'Estilo Visual',
        type: 'select',
        options: [
          { label: 'Elegante', value: 'elegant' },
          { label: 'Minimalista', value: 'minimal' },
          { label: 'Dramático', value: 'dramatic' }
        ],
        defaultValue: 'elegant'
      }
    ]
  },

  {
    type: 'guarantee-seal-inline',
    name: 'Selo de Garantia',
    description: 'Componente independente para mostrar garantias',
    icon: 'Shield',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: '7 Dias de Garantia'
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Se não ficar satisfeita, devolvemos 100% do seu dinheiro. Sem perguntas.',
        rows: 2
      },
      {
        key: 'imageUrl',
        label: 'Imagem da Garantia',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744916216/C%C3%B3pia_de_01._P%C3%A1gina_-_Produto_de_Entrada_2_hamaox.webp'
      },
      {
        key: 'imageSize',
        label: 'Tamanho da Imagem',
        type: 'select',
        options: [
          { label: 'Pequeno (150px)', value: 'small' },
          { label: 'Médio (200px)', value: 'medium' },
          { label: 'Grande (250px)', value: 'large' }
        ],
        defaultValue: 'medium'
      },
      {
        key: 'layout',
        label: 'Layout',
        type: 'select',
        options: [
          { label: 'Vertical (Imagem acima)', value: 'vertical' },
          { label: 'Horizontal (Lado a lado)', value: 'horizontal' }
        ],
        defaultValue: 'vertical'
      }
    ]
  },

  {
    type: 'faq-item-inline',
    name: 'Item de FAQ',
    description: 'Item individual de pergunta e resposta',
    icon: 'HelpCircle',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'question',
        label: 'Pergunta',
        type: 'text-input',
        defaultValue: 'Quanto tempo leva para fazer o quiz?'
      },
      {
        key: 'answer',
        label: 'Resposta',
        type: 'textarea',
        defaultValue: 'O quiz leva apenas alguns minutos para ser completado. São perguntas simples e objetivas sobre suas preferências e estilo de vida.',
        rows: 3
      },
      {
        key: 'openByDefault',
        label: 'Abrir por Padrão',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Minimalista', value: 'minimal' },
          { label: 'Com Borda', value: 'bordered' },
          { label: 'Com Sombra', value: 'shadowed' }
        ],
        defaultValue: 'minimal'
      }
    ]
  },

  {
    type: 'section-header-inline',
    name: 'Cabeçalho de Seção',
    description: 'Título e subtítulo independente para seções',
    icon: 'Type',
    category: 'Inline',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Transformação Completa'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text-input',
        defaultValue: 'Tudo que você precisa para descobrir e aplicar seu estilo'
      },
      {
        key: 'titleSize',
        label: 'Tamanho do Título',
        type: 'select',
        options: [
          { label: 'Grande (text-2xl)', value: 'text-2xl' },
          { label: 'Extra Grande (text-3xl)', value: 'text-3xl' },
          { label: 'Hero (text-4xl)', value: 'text-4xl' }
        ],
        defaultValue: 'text-2xl'
      },
      {
        key: 'textAlign',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Centro', value: 'center' },
          { label: 'Esquerda', value: 'left' },
          { label: 'Direita', value: 'right' }
        ],
        defaultValue: 'center'
      },
      {
        key: 'spacing',
        label: 'Espaçamento',
        type: 'select',
        options: [
          { label: 'Compacto', value: 'compact' },
          { label: 'Normal', value: 'normal' },
          { label: 'Amplo', value: 'wide' }
        ],
        defaultValue: 'normal'
      }
    ]
  },

  {
    type: 'sticky-header-inline',
    name: 'Header Fixo',
    description: 'Cabeçalho fixo independente com logo',
    icon: 'Crown',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'logoUrl',
        label: 'URL do Logo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
      },
      {
        key: 'logoAlt',
        label: 'Alt do Logo',
        type: 'text-input',
        defaultValue: 'Logo Gisele Galvão'
      },
      {
        key: 'logoWidth',
        label: 'Largura do Logo',
        type: 'number-input',
        defaultValue: 180,
        min: 100,
        max: 300
      },
      {
        key: 'logoHeight',
        label: 'Altura do Logo',
        type: 'number-input',
        defaultValue: 80,
        min: 50,
        max: 150
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: '#FFFFFF'
      },
      {
        key: 'blur',
        label: 'Efeito Blur',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'shadow',
        label: 'Sombra',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  // =====================================================================
  // COMPONENTES UTILITÁRIOS E ESTRUTURAIS
  // =====================================================================
  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço flexível para organizar layout',
    icon: 'Image',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'height',
        label: 'Altura (Desktop)',
        type: 'select',
        options: [
          { label: 'Extra Pequeno (8px)', value: 'xs' },
          { label: 'Pequeno (16px)', value: 'sm' },
          { label: 'Médio (32px)', value: 'md' },
          { label: 'Grande (64px)', value: 'lg' },
          { label: 'Extra Grande (128px)', value: 'xl' },
          { label: 'Personalizado', value: 'custom' }
        ],
        defaultValue: 'md'
      },
      {
        key: 'mobileHeight',
        label: 'Altura (Mobile)',
        type: 'select',
        options: [
          { label: 'Extra Pequeno (4px)', value: 'xs' },
          { label: 'Pequeno (8px)', value: 'sm' },
          { label: 'Médio (16px)', value: 'md' },
          { label: 'Grande (32px)', value: 'lg' },
          { label: 'Extra Grande (64px)', value: 'xl' }
        ],
        defaultValue: 'sm'
      },
      {
        key: 'customHeight',
        label: 'Altura Personalizada (px)',
        type: 'number-input',
        defaultValue: 32,
        min: 0,
        max: 500,
        description: 'Usado quando altura = "custom"'
      }
    ]
  },

  {
    type: 'form-input',
    name: 'Campo de Formulário',
    description: 'Input elegante para captura de dados',
    icon: 'Type',
    category: 'Formulário',
    propertiesSchema: [
      {
        key: 'type',
        label: 'Tipo de Campo',
        type: 'select',
        options: [
          { label: 'Texto', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Telefone', value: 'tel' },
          { label: 'Nome', value: 'text' },
          { label: 'WhatsApp', value: 'tel' }
        ],
        defaultValue: 'text'
      },
      {
        key: 'label',
        label: 'Rótulo',
        type: 'text-input',
        defaultValue: 'Seu nome',
        placeholder: 'Ex: Seu nome, Email, WhatsApp'
      },
      {
        key: 'placeholder',
        label: 'Placeholder',
        type: 'text-input',
        defaultValue: 'Digite seu nome...',
        placeholder: 'Texto de exemplo no campo'
      },
      {
        key: 'required',
        label: 'Campo Obrigatório',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'validation',
        label: 'Validação',
        type: 'select',
        options: [
          { label: 'Nenhuma', value: 'none' },
          { label: 'Email válido', value: 'email' },
          { label: 'WhatsApp brasileiro', value: 'whatsapp' },
          { label: 'Nome completo', value: 'fullname' }
        ],
        defaultValue: 'none'
      }
    ]
  },

  {
    type: 'divider-inline',
    name: 'Divisor Elegante',
    description: 'Linha decorativa para separar seções',
    icon: 'Type',
    category: 'Layout',
    propertiesSchema: [
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Linha Simples', value: 'simple' },
          { label: 'Decorativa', value: 'decorative' },
          { label: 'Pontilhada', value: 'dotted' },
          { label: 'Gradiente', value: 'gradient' }
        ],
        defaultValue: 'decorative'
      },
      {
        key: 'width',
        label: 'Largura',
        type: 'select',
        options: [
          { label: '25%', value: '25' },
          { label: '50%', value: '50' },
          { label: '75%', value: '75' },
          { label: '100%', value: '100' }
        ],
        defaultValue: '50'
      },
      {
        key: 'color',
        label: 'Cor',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      },
      {
        key: 'thickness',
        label: 'Espessura',
        type: 'select',
        options: [
          { label: 'Fina (1px)', value: 'thin' },
          { label: 'Média (2px)', value: 'medium' },
          { label: 'Grossa (4px)', value: 'thick' }
        ],
        defaultValue: 'medium'
      }
    ]
  },

  {
    type: 'result-card-inline',
    name: 'Card de Resultado Principal',
    description: 'Card principal com estilo predominante e porcentagem',
    icon: 'Award',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Seu Estilo Predominante'
      },
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text-input',
        defaultValue: '{{predominantStyle}}',
        description: 'Será preenchido dinamicamente'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number-input',
        defaultValue: 85,
        min: 0,
        max: 100
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Baseado nas suas respostas, identificamos que você tem características predominantes...',
        rows: 3
      },
      {
        key: 'imageUrl',
        label: 'Imagem do Estilo',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'
      },
      {
        key: 'guideImageUrl',
        label: 'Imagem do Guia',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp'
      },
      {
        key: 'showAnimation',
        label: 'Animação de Revelação',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  {
    type: 'style-card-inline',
    name: 'Card de Estilo Secundário',
    description: 'Cards para estilos complementares com progresso',
    icon: 'Layers',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text-input',
        defaultValue: 'Moderno'
      },
      {
        key: 'percentage',
        label: 'Porcentagem',
        type: 'number-input',
        defaultValue: 20,
        min: 0,
        max: 100
      },
      {
        key: 'description',
        label: 'Descrição Breve',
        type: 'textarea',
        defaultValue: 'Traços modernos na sua personalidade',
        rows: 2
      },
      {
        key: 'imageUrl',
        label: 'Imagem',
        type: 'image-url',
        defaultValue: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_moderno.webp'
      },
      {
        key: 'compact',
        label: 'Modo Compacto',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'showProgressBar',
        label: 'Mostrar Barra de Progresso',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  {
    type: 'before-after-inline',
    name: 'Bloco Transformação',
    description: 'Seção antes e depois com design elegante',
    icon: 'ArrowRightLeft',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Sua Transformação'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text-input',
        defaultValue: 'Veja como você pode transformar seu visual'
      },
      {
        key: 'beforeImage',
        label: 'Imagem Antes',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/300x400'
      },
      {
        key: 'afterImage',
        label: 'Imagem Depois',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/300x400'
      },
      {
        key: 'beforeText',
        label: 'Texto Antes',
        type: 'text-input',
        defaultValue: 'Antes'
      },
      {
        key: 'afterText',
        label: 'Texto Depois',
        type: 'text-input',
        defaultValue: 'Depois'
      }
    ]
  },

  // =====================================================================
  // COMPONENTES DA ETAPA 21 (OFERTA) - SEÇÕES ORGANIZADAS
  // =====================================================================
  {
    type: 'quiz-offer-pricing-inline',
    name: 'Preços da Oferta',
    description: 'Bloco de preços otimizado para conversão',
    icon: 'CircleDollarSign',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Oferta Especial Para Você'
      },
      {
        key: 'originalPrice',
        label: 'Preço Original',
        type: 'number-input',
        defaultValue: 497
      },
      {
        key: 'discountedPrice',
        label: 'Preço com Desconto',
        type: 'number-input',
        defaultValue: 197
      },
      {
        key: 'currency',
        label: 'Moeda',
        type: 'select',
        options: [
          { label: 'Real (R$)', value: 'BRL' },
          { label: 'Dólar ($)', value: 'USD' },
          { label: 'Euro (€)', value: 'EUR' }
        ],
        defaultValue: 'BRL'
      },
      {
        key: 'installments',
        label: 'Parcelas',
        type: 'text-input',
        defaultValue: '12x de R$ 16,41',
        placeholder: 'Ex: 12x de R$ 16,41'
      },
      {
        key: 'features',
        label: 'Benefícios Inclusos',
        type: 'array-editor',
        defaultValue: [
          'Guia Completo do Seu Estilo',
          'Análise Personalizada Detalhada', 
          'Dicas de Combinações',
          'Lista de Compras Estratégicas',
          'Suporte por 30 dias'
        ]
      },
      {
        key: 'highlighted',
        label: 'Destacado',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  {
    type: 'countdown-inline',
    name: 'Timer de Urgência',
    description: 'Contador regressivo elegante',
    icon: 'Clock',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Esta oferta expira em:'
      },
      {
        key: 'targetMinutes',
        label: 'Minutos',
        type: 'number-input',
        defaultValue: 15,
        min: 1,
        max: 60
      },
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Elegante (Marrom)', value: 'elegant' },
          { label: 'Urgência (Vermelho)', value: 'urgent' },
          { label: 'Minimalista', value: 'minimal' }
        ],
        defaultValue: 'elegant'
      },
      {
        key: 'showLabels',
        label: 'Mostrar Labels',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'urgencyColor',
        label: 'Cor de Urgência',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      }
    ]
  },

  {
    type: 'testimonial-card-inline',
    name: 'Depoimento Elegante',
    description: 'Card de depoimento com design sofisticado',
    icon: 'Quote',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'name',
        label: 'Nome',
        type: 'text-input',
        defaultValue: 'Maria Silva'
      },
      {
        key: 'role',
        label: 'Profissão/Cargo',
        type: 'text-input',
        defaultValue: 'Executiva',
        placeholder: 'Ex: Advogada, Empresária'
      },
      {
        key: 'text',
        label: 'Depoimento',
        type: 'textarea',
        defaultValue: 'A consultoria transformou completamente meu guarda-roupa e minha confiança!',
        rows: 3
      },
      {
        key: 'rating',
        label: 'Avaliação (estrelas)',
        type: 'number-input',
        defaultValue: 5,
        min: 1,
        max: 5
      },
      {
        key: 'avatarUrl',
        label: 'Foto',
        type: 'image-url',
        defaultValue: 'https://via.placeholder.com/80x80'
      },
      {
        key: 'verified',
        label: 'Verificado',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  {
    type: 'badge-inline',
    name: 'Selo/Badge',
    description: 'Selos de garantia e credibilidade',
    icon: 'Shield',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'text',
        label: 'Texto',
        type: 'text-input',
        defaultValue: 'Garantia 30 dias'
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: [
          { label: 'Escudo', value: 'shield' },
          { label: 'Verificado', value: 'verified' },
          { label: 'Estrela', value: 'star' },
          { label: 'Troféu', value: 'trophy' },
          { label: 'Segurança', value: 'security' }
        ],
        defaultValue: 'shield'
      },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Sucesso', value: 'success' },
          { label: 'Premium', value: 'premium' },
          { label: 'Garantia', value: 'guarantee' },
          { label: 'Elegante', value: 'elegant' }
        ],
        defaultValue: 'elegant'
      }
    ]
  },

  {
    type: 'bonus-list-inline',
    name: 'Lista de Bônus',
    description: 'Lista elegante de benefícios e bônus',
    icon: 'Gift',
    category: 'Oferta',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Bônus Exclusivos'
      },
      {
        key: 'bonuses',
        label: 'Lista de Bônus',
        type: 'array-editor',
        defaultValue: [
          'E-book: Guia de Combinações',
          'Checklist de Compras',
          'Acesso ao Grupo VIP',
          'Consultoria Express (30 min)'
        ]
      },
      {
        key: 'showIcons',
        label: 'Mostrar Ícones',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'iconColor',
        label: 'Cor dos Ícones',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      }
    ]
  },

  // =====================================================================
  // COMPONENTES BÁSICOS FUNCIONAIS
  // =====================================================================
  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço em branco responsivo',
    icon: 'RectangleHorizontal',
    category: 'Básico',
    propertiesSchema: [
      {
        key: 'height',
        label: 'Altura (px)',
        type: 'number-input',
        defaultValue: 40,
        min: 10,
        max: 200
      },
      {
        key: 'responsive',
        label: 'Responsivo',
        type: 'boolean-switch',
        defaultValue: true,
        description: 'Ajusta automaticamente no mobile'
      }
    ]
  },

  {
    type: 'form-input',
    name: 'Campo de Formulário',
    description: 'Input elegante para captura de dados',
    icon: 'Type',
    category: 'Formulário',
    propertiesSchema: [
      {
        key: 'label',
        label: 'Label',
        type: 'text-input',
        defaultValue: 'Nome'
      },
      {
        key: 'placeholder',
        label: 'Placeholder',
        type: 'text-input',
        defaultValue: 'Digite seu nome...'
      },
      {
        key: 'inputType',
        label: 'Tipo',
        type: 'select',
        options: [
          { label: 'Texto', value: 'text' },
          { label: 'Email', value: 'email' },
          { label: 'Telefone', value: 'tel' },
          { label: 'Número', value: 'number' }
        ],
        defaultValue: 'text'
      },
      {
        key: 'required',
        label: 'Obrigatório',
        type: 'boolean-switch',
        defaultValue: false
      },
      {
        key: 'style',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Elegante', value: 'elegant' },
          { label: 'Minimalista', value: 'minimal' },
          { label: 'Moderno', value: 'modern' }
        ],
        defaultValue: 'elegant'
      }
    ]
  },

  // =====================================================================
  // NOVOS COMPONENTES INLINE MODERNOS CRIADOS
  // =====================================================================
  {
    type: 'result-header-inline',
    name: 'Cabeçalho de Resultado',
    description: 'Cabeçalho elegante para página de resultado com ícone',
    icon: 'Award',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título Principal',
        type: 'text-input',
        defaultValue: 'Seu Estilo',
        placeholder: 'Ex: Seu Estilo Elegante'
      },
      {
        key: 'subtitle',
        label: 'Subtítulo',
        type: 'text-input',
        defaultValue: 'Resultado Personalizado',
        placeholder: 'Ex: Baseado em suas respostas'
      },
      {
        key: 'icon',
        label: 'Ícone',
        type: 'select',
        options: [
          { label: 'Prêmio', value: 'award' },
          { label: 'Coroa', value: 'crown' },
          { label: 'Estrela', value: 'star' }
        ],
        defaultValue: 'award'
      },
      {
        key: 'iconColor',
        label: 'Cor do Ícone',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      },
      {
        key: 'centered',
        label: 'Centralizado',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'showDecorations',
        label: 'Mostrar Decorações',
        type: 'boolean-switch',
        defaultValue: true
      }
    ]
  },

  {
    type: 'result-card-inline',
    name: 'Card de Resultado',
    description: 'Card compacto para mostrar resultado do quiz',
    icon: 'CreditCard',
    category: 'Resultado',
    propertiesSchema: [
      {
        key: 'styleName',
        label: 'Nome do Estilo',
        type: 'text-input',
        defaultValue: 'Elegante',
        placeholder: 'Ex: Romântico, Clássico'
      },
      {
        key: 'percentage',
        label: 'Percentual (%)',
        type: 'number-input',
        defaultValue: 85,
        min: 0,
        max: 100
      },
      {
        key: 'description',
        label: 'Descrição',
        type: 'textarea',
        defaultValue: 'Você valoriza sofisticação e refinamento',
        rows: 3
      },
      {
        key: 'showProgress',
        label: 'Mostrar Progresso',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'showIcon',
        label: 'Mostrar Ícone',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'size',
        label: 'Tamanho',
        type: 'select',
        options: [
          { label: 'Pequeno', value: 'small' },
          { label: 'Médio', value: 'medium' },
          { label: 'Grande', value: 'large' }
        ],
        defaultValue: 'medium'
      }
    ]
  },

  {
    type: 'bonus-list-inline',
    name: 'Lista de Bônus',
    description: 'Lista de bônus e benefícios inclusos',
    icon: 'Gift',
    category: 'Vendas',
    propertiesSchema: [
      {
        key: 'title',
        label: 'Título',
        type: 'text-input',
        defaultValue: 'Bônus Exclusivos',
        placeholder: 'Ex: Bônus Limitados'
      },
      {
        key: 'showValues',
        label: 'Mostrar Valores',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'totalValue',
        label: 'Valor Total',
        type: 'text-input',
        defaultValue: 'R$ 171',
        placeholder: 'Ex: R$ 297'
      },
      {
        key: 'highlightColor',
        label: 'Cor de Destaque',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      },
      {
        key: 'variant',
        label: 'Estilo',
        type: 'select',
        options: [
          { label: 'Card', value: 'card' },
          { label: 'Lista', value: 'list' },
          { label: 'Minimalista', value: 'minimal' }
        ],
        defaultValue: 'card'
      }
    ]
  },

  {
    type: 'step-header-inline',
    name: 'Cabeçalho de Etapa',
    description: 'Cabeçalho com logo e barra de progresso para etapas do quiz',
    icon: 'Navigation',
    category: 'Quiz',
    propertiesSchema: [
      {
        key: 'logoUrl',
        label: 'URL do Logo',
        type: 'image-url',
        defaultValue: 'https://cakto-quiz-br01.b-cdn.net/uploads/47fd613e-91a9-48cf-bd52-a9d4e180d5ab.png'
      },
      {
        key: 'logoWidth',
        label: 'Largura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 40,
        max: 200
      },
      {
        key: 'logoHeight',
        label: 'Altura do Logo (px)',
        type: 'number-input',
        defaultValue: 96,
        min: 40,
        max: 200
      },
      {
        key: 'logoAlt',
        label: 'Texto Alternativo do Logo',
        type: 'text-input',
        defaultValue: 'Logo',
        placeholder: 'Ex: Logo da empresa'
      },
      {
        key: 'progressValue',
        label: 'Valor do Progresso (%)',
        type: 'number-input',
        defaultValue: 0,
        min: 0,
        max: 100
      },
      {
        key: 'progressMax',
        label: 'Valor Máximo do Progresso',
        type: 'number-input',
        defaultValue: 100,
        min: 1,
        max: 100
      },
      {
        key: 'showProgress',
        label: 'Mostrar Barra de Progresso',
        type: 'boolean-switch',
        defaultValue: true
      },
      {
        key: 'progressColor',
        label: 'Cor da Barra de Progresso',
        type: 'color-picker',
        defaultValue: '#B89B7A'
      },
      {
        key: 'containerWidth',
        label: 'Largura do Container',
        type: 'select',
        options: [
          { label: 'Completa', value: 'full' },
          { label: 'Pequena', value: 'sm' },
          { label: 'Média', value: 'md' },
          { label: 'Grande', value: 'lg' },
          { label: 'Extra Grande', value: 'xl' }
        ],
        defaultValue: 'full'
      },
      {
        key: 'alignment',
        label: 'Alinhamento',
        type: 'select',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ],
        defaultValue: 'center'
      },
      {
        key: 'spacing',
        label: 'Espaçamento entre Elementos',
        type: 'select',
        options: [
          { label: 'Pequeno (2)', value: 2 },
          { label: 'Médio (4)', value: 4 },
          { label: 'Grande (6)', value: 6 }
        ],
        defaultValue: 4
      },
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color-picker',
        defaultValue: 'transparent'
      }
    ]
  }
];

// Funções auxiliares ES7+
export const getCategories = (): string[] => {
  const categorySet = new Set(blockDefinitions.map(block => block.category));
  const categories = Array.from(categorySet);
  return categories.sort();
};

export const getBlocksByCategory = (category: string) => 
  blockDefinitions.filter(block => block.category === category);

export const getBlockDefinition = (type: string) => 
  blockDefinitions.find(block => block.type === type);

export const getBlockSchema = (type: string) => 
  getBlockDefinition(type)?.propertiesSchema ?? [];

// Exportação padrão para compatibilidade
export default blockDefinitions;