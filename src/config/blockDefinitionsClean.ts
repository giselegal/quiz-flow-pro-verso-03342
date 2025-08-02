import { BlockDefinition } from '@/types/blocks';

export const blockDefinitions: BlockDefinition[] = [
  // ===== COMPONENTES BÁSICOS =====
  
  // Texto Inline - Enhanced
  {
    type: 'text-inline',
    name: 'Texto',
    icon: '📝',
    category: 'basic',
    description: 'Bloco de texto simples e editável',
    properties: [
      { 
        key: 'content', 
        label: 'Conteúdo', 
        type: 'text-area', 
        defaultValue: 'Digite seu texto aqui...', 
        rows: 3,
        group: 'content',
        description: 'O texto que será exibido' 
      },
      { 
        key: 'fontSize', 
        label: 'Tamanho da Fonte', 
        type: 'range-slider', 
        defaultValue: 16, 
        min: 12, 
        max: 48, 
        step: 1, 
        unit: 'px',
        group: 'style' 
      },
      { 
        key: 'fontWeight', 
        label: 'Peso da Fonte', 
        type: 'select', 
        defaultValue: 'normal', 
        options: [
          { label: 'Normal', value: 'normal' },
          { label: 'Médio', value: '500' },
          { label: 'Negrito', value: 'bold' }
        ],
        group: 'style' 
      },
      { 
        key: 'textAlign', 
        label: 'Alinhamento', 
        type: 'text-align-buttons', 
        defaultValue: 'left',
        group: 'style' 
      },
      { 
        key: 'color', 
        label: 'Cor do Texto', 
        type: 'color-picker', 
        defaultValue: '#432818',
        group: 'style' 
      },
      { 
        key: 'maxWidth', 
        label: 'Largura Máxima', 
        type: 'text-input', 
        defaultValue: '100%',
        group: 'layout' 
      },
      { 
        key: 'lineHeight', 
        label: 'Altura da Linha', 
        type: 'range-slider', 
        defaultValue: 1.5, 
        min: 1, 
        max: 3, 
        step: 0.1,
        group: 'style' 
      }
    ]
  },

  // Cabeçalho - Enhanced
  {
    type: 'heading-inline',
    name: 'Cabeçalho',
    icon: '📰',
    category: 'basic',
    description: 'Título com diferentes níveis de hierarquia',
    properties: [
      { 
        key: 'title', 
        label: 'Título', 
        type: 'text-input', 
        defaultValue: 'Novo Título',
        group: 'content',
        required: true 
      },
      { 
        key: 'level', 
        label: 'Nível do Título', 
        type: 'select', 
        defaultValue: 'h2', 
        options: [
          { label: 'H1 - Principal', value: 'h1' },
          { label: 'H2 - Secundário', value: 'h2' },
          { label: 'H3 - Terciário', value: 'h3' },
          { label: 'H4 - Menor', value: 'h4' }
        ],
        group: 'content' 
      },
      { 
        key: 'fontSize', 
        label: 'Tamanho da Fonte', 
        type: 'range-slider', 
        defaultValue: 24, 
        min: 16, 
        max: 64, 
        step: 2, 
        unit: 'px',
        group: 'style' 
      },
      { 
        key: 'fontWeight', 
        label: 'Peso da Fonte', 
        type: 'font-weight-buttons', 
        defaultValue: 'bold',
        group: 'style' 
      },
      { 
        key: 'textAlign', 
        label: 'Alinhamento', 
        type: 'text-align-buttons', 
        defaultValue: 'center',
        group: 'style' 
      },
      { 
        key: 'color', 
        label: 'Cor do Texto', 
        type: 'color-picker', 
        defaultValue: '#432818',
        group: 'style' 
      },
      { 
        key: 'marginBottom', 
        label: 'Margem Inferior', 
        type: 'range-slider', 
        defaultValue: 16, 
        min: 0, 
        max: 64, 
        step: 4, 
        unit: 'px',
        group: 'layout' 
      }
    ]
  },

  // Imagem - New Implementation
  {
    type: 'image-display-inline',
    name: 'Imagem',
    icon: '🖼️',
    category: 'basic',
    description: 'Exibição de imagens com controles avançados',
    properties: [
      { 
        key: 'imageUrl', 
        label: 'URL da Imagem', 
        type: 'image-url', 
        defaultValue: '',
        group: 'content',
        required: true,
        description: 'URL da imagem a ser exibida'
      },
      { 
        key: 'imageUpload', 
        label: 'Upload de Imagem', 
        type: 'file-upload', 
        group: 'content',
        description: 'Envie uma imagem do seu computador'
      },
      { 
        key: 'alt', 
        label: 'Texto Alternativo', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content',
        description: 'Descrição da imagem para acessibilidade'
      },
      { 
        key: 'width', 
        label: 'Largura', 
        type: 'text-input', 
        defaultValue: '100%',
        group: 'layout'
      },
      { 
        key: 'height', 
        label: 'Altura', 
        type: 'text-input', 
        defaultValue: 'auto',
        group: 'layout'
      },
      { 
        key: 'borderRadius', 
        label: 'Borda Arredondada', 
        type: 'range-slider', 
        defaultValue: 8, 
        min: 0, 
        max: 50, 
        step: 2, 
        unit: 'px',
        group: 'style'
      },
      { 
        key: 'objectFit', 
        label: 'Ajuste da Imagem', 
        type: 'select', 
        defaultValue: 'cover', 
        options: [
          { label: 'Cobrir', value: 'cover' },
          { label: 'Conter', value: 'contain' },
          { label: 'Preencher', value: 'fill' },
          { label: 'Nenhum', value: 'none' }
        ],
        group: 'style'
      }
    ]
  },

  // Botão - Enhanced
  {
    type: 'button-inline',
    name: 'Botão',
    icon: '🔘',
    category: 'basic',
    description: 'Botão interativo com múltiplas opções de estilo',
    properties: [
      { 
        key: 'text', 
        label: 'Texto do Botão', 
        type: 'text-input', 
        defaultValue: 'Clique aqui',
        group: 'content',
        required: true
      },
      { 
        key: 'url', 
        label: 'Link de Destino', 
        type: 'url', 
        defaultValue: '#',
        group: 'content'
      },
      { 
        key: 'variant', 
        label: 'Variante', 
        type: 'select', 
        defaultValue: 'primary', 
        options: [
          { label: 'Primário', value: 'primary' },
          { label: 'Secundário', value: 'secondary' },
          { label: 'Contorno', value: 'outline' },
          { label: 'Fantasma', value: 'ghost' }
        ],
        group: 'style'
      },
      { 
        key: 'size', 
        label: 'Tamanho', 
        type: 'select', 
        defaultValue: 'md', 
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' }
        ],
        group: 'style'
      },
      { 
        key: 'fullWidth', 
        label: 'Largura Total', 
        type: 'boolean-switch', 
        defaultValue: false,
        group: 'layout'
      },
      { 
        key: 'disabled', 
        label: 'Desabilitado', 
        type: 'boolean-switch', 
        defaultValue: false,
        group: 'advanced'
      }
    ]
  },

  // ===== COMPONENTES DE INTERFACE =====

  // Badge - New Implementation
  {
    type: 'badge-inline',
    name: 'Badge',
    icon: '🏷️',
    category: 'interface',
    description: 'Etiqueta pequena para destacar informações',
    properties: [
      { 
        key: 'text', 
        label: 'Texto', 
        type: 'text-input', 
        defaultValue: 'Novo',
        group: 'content',
        required: true
      },
      { 
        key: 'variant', 
        label: 'Variante', 
        type: 'select', 
        defaultValue: 'default', 
        options: [
          { label: 'Padrão', value: 'default' },
          { label: 'Sucesso', value: 'success' },
          { label: 'Aviso', value: 'warning' },
          { label: 'Erro', value: 'error' },
          { label: 'Info', value: 'info' }
        ],
        group: 'style'
      },
      { 
        key: 'size', 
        label: 'Tamanho', 
        type: 'select', 
        defaultValue: 'sm', 
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' }
        ],
        group: 'style'
      },
      { 
        key: 'shape', 
        label: 'Formato', 
        type: 'select', 
        defaultValue: 'rounded', 
        options: [
          { label: 'Arredondado', value: 'rounded' },
          { label: 'Pill', value: 'pill' },
          { label: 'Quadrado', value: 'square' }
        ],
        group: 'style'
      }
    ]
  },

  // Progresso - New Implementation
  {
    type: 'progress-inline',
    name: 'Progresso',
    icon: '📊',
    category: 'interface',
    description: 'Barra de progresso animada',
    properties: [
      { 
        key: 'value', 
        label: 'Valor Atual', 
        type: 'number-input', 
        defaultValue: 50, 
        min: 0, 
        max: 100,
        group: 'content'
      },
      { 
        key: 'max', 
        label: 'Valor Máximo', 
        type: 'number-input', 
        defaultValue: 100, 
        min: 1,
        group: 'content'
      },
      { 
        key: 'showValue', 
        label: 'Mostrar Valor', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'label', 
        label: 'Rótulo', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'color', 
        label: 'Cor da Barra', 
        type: 'color-picker', 
        defaultValue: '#B89B7A',
        group: 'style'
      },
      { 
        key: 'height', 
        label: 'Altura', 
        type: 'range-slider', 
        defaultValue: 8, 
        min: 4, 
        max: 24, 
        step: 2, 
        unit: 'px',
        group: 'style'
      },
      { 
        key: 'animated', 
        label: 'Animado', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'advanced'
      }
    ]
  },

  // Estatística - New Implementation
  {
    type: 'stat-inline',
    name: 'Estatística',
    icon: '📈',
    category: 'interface',
    description: 'Exibição de números e estatísticas importantes',
    properties: [
      { 
        key: 'value', 
        label: 'Valor', 
        type: 'text-input', 
        defaultValue: '1,234',
        group: 'content',
        required: true
      },
      { 
        key: 'label', 
        label: 'Rótulo', 
        type: 'text-input', 
        defaultValue: 'Estatística',
        group: 'content',
        required: true
      },
      { 
        key: 'prefix', 
        label: 'Prefixo', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'suffix', 
        label: 'Sufixo', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'icon', 
        label: 'Ícone', 
        type: 'text-input', 
        defaultValue: '',
        group: 'style',
        description: 'Nome do ícone Lucide (ex: TrendingUp)'
      },
      { 
        key: 'highlightColor', 
        label: 'Cor de Destaque', 
        type: 'color-picker', 
        defaultValue: '#B89B7A',
        group: 'style'
      },
      { 
        key: 'size', 
        label: 'Tamanho', 
        type: 'select', 
        defaultValue: 'md', 
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' }
        ],
        group: 'style'
      }
    ]
  },

  // Contador - New Implementation
  {
    type: 'countdown-inline',
    name: 'Contador',
    icon: '⏰',
    category: 'interface',
    description: 'Contador regressivo animado',
    properties: [
      { 
        key: 'targetDate', 
        label: 'Data Alvo', 
        type: 'datetime-local', 
        defaultValue: '',
        group: 'content',
        required: true
      },
      { 
        key: 'format', 
        label: 'Formato', 
        type: 'select', 
        defaultValue: 'full', 
        options: [
          { label: 'Completo (Dias, Horas, Min, Seg)', value: 'full' },
          { label: 'Horas e Minutos', value: 'hours' },
          { label: 'Apenas Minutos', value: 'minutes' }
        ],
        group: 'content'
      },
      { 
        key: 'expiredMessage', 
        label: 'Mensagem de Expiração', 
        type: 'text-input', 
        defaultValue: 'Tempo esgotado!',
        group: 'content'
      },
      { 
        key: 'size', 
        label: 'Tamanho', 
        type: 'select', 
        defaultValue: 'md', 
        options: [
          { label: 'Pequeno', value: 'sm' },
          { label: 'Médio', value: 'md' },
          { label: 'Grande', value: 'lg' }
        ],
        group: 'style'
      },
      { 
        key: 'theme', 
        label: 'Tema', 
        type: 'select', 
        defaultValue: 'default', 
        options: [
          { label: 'Padrão', value: 'default' },
          { label: 'Urgência', value: 'urgent' },
          { label: 'Elegante', value: 'elegant' }
        ],
        group: 'style'
      }
    ]
  },

  // ===== COMPONENTES DE DESIGN =====

  // Card de Estilo - Enhanced
  {
    type: 'style-card-inline',
    name: 'Card de Estilo',
    icon: '🎨',
    category: 'design',
    description: 'Card para exibir estilos e categorias',
    properties: [
      { 
        key: 'title', 
        label: 'Título', 
        type: 'text-input', 
        defaultValue: 'Estilo',
        group: 'content',
        required: true
      },
      { 
        key: 'description', 
        label: 'Descrição', 
        type: 'text-area', 
        defaultValue: 'Descrição do estilo...',
        rows: 3,
        group: 'content'
      },
      { 
        key: 'imageUrl', 
        label: 'Imagem', 
        type: 'image-url', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'themeColor', 
        label: 'Cor do Tema', 
        type: 'color-picker', 
        defaultValue: '#B89B7A',
        group: 'style'
      },
      { 
        key: 'percentage', 
        label: 'Percentual', 
        type: 'number-input', 
        defaultValue: 0, 
        min: 0, 
        max: 100,
        group: 'content'
      },
      { 
        key: 'isSelected', 
        label: 'Selecionado', 
        type: 'boolean-switch', 
        defaultValue: false,
        group: 'advanced'
      },
      { 
        key: 'layout', 
        label: 'Layout', 
        type: 'select', 
        defaultValue: 'vertical', 
        options: [
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Compacto', value: 'compact' }
        ],
        group: 'layout'
      }
    ]
  },

  // Card de Resultado - New Implementation
  {
    type: 'result-card-inline',
    name: 'Card de Resultado',
    icon: '🏆',
    category: 'design',
    description: 'Card para exibir resultados de quiz',
    properties: [
      { 
        key: 'title', 
        label: 'Título', 
        type: 'text-input', 
        defaultValue: 'Seu Resultado',
        group: 'content',
        required: true
      },
      { 
        key: 'description', 
        label: 'Descrição', 
        type: 'text-area', 
        defaultValue: 'Descrição do resultado...',
        rows: 4,
        group: 'content'
      },
      { 
        key: 'percentage', 
        label: 'Percentual', 
        type: 'number-input', 
        defaultValue: 85, 
        min: 0, 
        max: 100,
        group: 'content'
      },
      { 
        key: 'category', 
        label: 'Categoria', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'color', 
        label: 'Cor Principal', 
        type: 'color-picker', 
        defaultValue: '#B89B7A',
        group: 'style'
      },
      { 
        key: 'showPercentage', 
        label: 'Mostrar Percentual', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'style', 
        label: 'Estilo Visual', 
        type: 'select', 
        defaultValue: 'modern', 
        options: [
          { label: 'Moderno', value: 'modern' },
          { label: 'Clássico', value: 'classic' },
          { label: 'Minimalista', value: 'minimal' }
        ],
        group: 'style'
      }
    ]
  },

  // Preços - New Implementation
  {
    type: 'pricing-card-inline',
    name: 'Preços',
    icon: '💰',
    category: 'design',
    description: 'Card de preços com destaque promocional',
    properties: [
      { 
        key: 'title', 
        label: 'Título', 
        type: 'text-input', 
        defaultValue: 'Plano Premium',
        group: 'content'
      },
      { 
        key: 'price', 
        label: 'Preço Principal', 
        type: 'text-input', 
        defaultValue: '39,00',
        group: 'content',
        required: true
      },
      { 
        key: 'originalPrice', 
        label: 'Preço Original', 
        type: 'text-input', 
        defaultValue: '97,00',
        group: 'content'
      },
      { 
        key: 'currency', 
        label: 'Moeda', 
        type: 'text-input', 
        defaultValue: 'R$',
        group: 'content'
      },
      { 
        key: 'period', 
        label: 'Período', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'highlight', 
        label: 'Destacar', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'style'
      },
      { 
        key: 'features', 
        label: 'Recursos', 
        type: 'array-editor', 
        defaultValue: ['Recurso 1', 'Recurso 2', 'Recurso 3'],
        group: 'content',
        itemSchema: [
          { key: 'text', label: 'Texto', type: 'text-input', defaultValue: '' }
        ]
      },
      { 
        key: 'ctaText', 
        label: 'Texto do Botão', 
        type: 'text-input', 
        defaultValue: 'Comprar Agora',
        group: 'content'
      },
      { 
        key: 'ctaUrl', 
        label: 'URL do Botão', 
        type: 'url', 
        defaultValue: '#',
        group: 'content'
      }
    ]
  },

  // Depoimentos - Enhanced
  {
    type: 'testimonial-card-inline',
    name: 'Depoimentos',
    icon: '💭',
    category: 'design',
    description: 'Card de depoimento de cliente',
    properties: [
      { 
        key: 'text', 
        label: 'Depoimento', 
        type: 'text-area', 
        defaultValue: 'Este produto mudou minha vida...',
        rows: 4,
        group: 'content',
        required: true
      },
      { 
        key: 'name', 
        label: 'Nome', 
        type: 'text-input', 
        defaultValue: 'Cliente Satisfeito',
        group: 'content',
        required: true
      },
      { 
        key: 'role', 
        label: 'Cargo/Função', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'avatar', 
        label: 'Foto de Perfil', 
        type: 'image-url', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'rating', 
        label: 'Avaliação', 
        type: 'number-input', 
        defaultValue: 5, 
        min: 1, 
        max: 5,
        group: 'content'
      },
      { 
        key: 'location', 
        label: 'Localização', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'showRating', 
        label: 'Mostrar Avaliação', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'layout', 
        label: 'Layout', 
        type: 'select', 
        defaultValue: 'card', 
        options: [
          { label: 'Card', value: 'card' },
          { label: 'Inline', value: 'inline' },
          { label: 'Destacado', value: 'featured' }
        ],
        group: 'layout'
      }
    ]
  },

  // ===== COMPONENTES ESPECÍFICOS DO QUIZ =====

  // Página Inicial do Quiz - Enhanced
  {
    type: 'quiz-start-page-inline',
    name: 'Página Inicial',
    icon: '🚀',
    category: 'quiz',
    description: 'Página de abertura do quiz com boas-vindas',
    properties: [
      { 
        key: 'title', 
        label: 'Título Principal', 
        type: 'text-input', 
        defaultValue: 'Descubra Seu Estilo',
        group: 'content',
        required: true
      },
      { 
        key: 'subtitle', 
        label: 'Subtítulo', 
        type: 'text-area', 
        defaultValue: 'Responda algumas perguntas rápidas...',
        rows: 2,
        group: 'content'
      },
      { 
        key: 'heroImage', 
        label: 'Imagem Principal', 
        type: 'image-url', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'ctaText', 
        label: 'Texto do Botão', 
        type: 'text-input', 
        defaultValue: 'Começar Quiz',
        group: 'content'
      },
      { 
        key: 'features', 
        label: 'Características', 
        type: 'array-editor', 
        defaultValue: ['Rápido (2 min)', 'Personalizado', 'Gratuito'],
        group: 'content',
        itemSchema: [
          { key: 'text', label: 'Texto', type: 'text-input', defaultValue: '' }
        ]
      },
      { 
        key: 'showProgress', 
        label: 'Mostrar Progresso', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      }
    ]
  },

  // Questão do Quiz - Enhanced  
  {
    type: 'quiz-question-inline',
    name: 'Questão',
    icon: '❓',
    category: 'quiz',
    description: 'Questão de múltipla escolha para quiz',
    properties: [
      { 
        key: 'question', 
        label: 'Pergunta', 
        type: 'text-area', 
        defaultValue: 'Qual é sua preferência?',
        rows: 3,
        group: 'content',
        required: true
      },
      { 
        key: 'subtitle', 
        label: 'Subtítulo/Instrução', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'multiSelect', 
        label: 'Múltipla Escolha', 
        type: 'number-input', 
        defaultValue: 0, 
        min: 0, 
        max: 10,
        group: 'content',
        description: '0 = escolha única, 1+ = múltipla escolha'
      },
      { 
        key: 'options', 
        label: 'Opções de Resposta', 
        type: 'array-editor', 
        defaultValue: [
          { text: 'Opção 1', category: 'Natural', points: 10 },
          { text: 'Opção 2', category: 'Clássico', points: 10 }
        ],
        group: 'content',
        itemSchema: [
          { key: 'text', label: 'Texto', type: 'text-area', defaultValue: '', rows: 2 },
          { key: 'category', label: 'Categoria', type: 'select', defaultValue: 'Natural', 
            options: [
              { label: 'Natural', value: 'Natural' },
              { label: 'Clássico', value: 'Clássico' },
              { label: 'Contemporâneo', value: 'Contemporâneo' },
              { label: 'Elegante', value: 'Elegante' },
              { label: 'Romântico', value: 'Romântico' },
              { label: 'Sexy', value: 'Sexy' },
              { label: 'Dramático', value: 'Dramático' },
              { label: 'Criativo', value: 'Criativo' }
            ]
          },
          { key: 'points', label: 'Pontos', type: 'number-input', defaultValue: 10, min: 0, max: 100 }
        ]
      },
      { 
        key: 'displayType', 
        label: 'Tipo de Exibição', 
        type: 'select', 
        defaultValue: 'text', 
        options: [
          { label: 'Apenas Texto', value: 'text' },
          { label: 'Texto com Imagem', value: 'image' },
          { label: 'Cards', value: 'cards' }
        ],
        group: 'layout'
      },
      { 
        key: 'required', 
        label: 'Obrigatória', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'advanced'
      }
    ]
  },

  // Resultado do Quiz - Enhanced
  {
    type: 'quiz-result-inline',
    name: 'Resultado',
    icon: '🏁',
    category: 'quiz',
    description: 'Página de resultado final do quiz',
    properties: [
      { 
        key: 'title', 
        label: 'Título do Resultado', 
        type: 'text-input', 
        defaultValue: 'Seu Estilo Predominante é:',
        group: 'content',
        required: true
      },
      { 
        key: 'showPrimaryStyle', 
        label: 'Mostrar Estilo Principal', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'showSecondaryStyles', 
        label: 'Mostrar Estilos Secundários', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'showPercentages', 
        label: 'Mostrar Percentuais', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'showDescriptions', 
        label: 'Mostrar Descrições', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'showOfferSection', 
        label: 'Mostrar Seção de Oferta', 
        type: 'boolean-switch', 
        defaultValue: true,
        group: 'content'
      },
      { 
        key: 'resultLayout', 
        label: 'Layout do Resultado', 
        type: 'select', 
        defaultValue: 'modern', 
        options: [
          { label: 'Moderno', value: 'modern' },
          { label: 'Clássico', value: 'classic' },
          { label: 'Minimalista', value: 'minimal' }
        ],
        group: 'layout'
      }
    ]
  },

  // Call to Action - New Implementation
  {
    type: 'quiz-offer-cta-inline',
    name: 'Call to Action',
    icon: '🎯',
    category: 'quiz',
    description: 'Chamada para ação com oferta especial',
    properties: [
      { 
        key: 'title', 
        label: 'Título Principal', 
        type: 'text-input', 
        defaultValue: 'Oferta Especial!',
        group: 'content',
        required: true
      },
      { 
        key: 'subtitle', 
        label: 'Subtítulo', 
        type: 'text-area', 
        defaultValue: 'Aproveitae este desconto exclusivo...',
        rows: 2,
        group: 'content'
      },
      { 
        key: 'description', 
        label: 'Descrição', 
        type: 'text-area', 
        defaultValue: '',
        rows: 3,
        group: 'content'
      },
      { 
        key: 'primaryCTA', 
        label: 'Botão Principal', 
        type: 'text-input', 
        defaultValue: 'Quero Aproveitar',
        group: 'content'
      },
      { 
        key: 'primaryURL', 
        label: 'URL Botão Principal', 
        type: 'url', 
        defaultValue: '#',
        group: 'content'
      },
      { 
        key: 'secondaryCTA', 
        label: 'Botão Secundário', 
        type: 'text-input', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'secondaryURL', 
        label: 'URL Botão Secundário', 
        type: 'url', 
        defaultValue: '#',
        group: 'content'
      },
      { 
        key: 'urgencyText', 
        label: 'Texto de Urgência', 
        type: 'text-input', 
        defaultValue: 'Por tempo limitado!',
        group: 'content'
      },
      { 
        key: 'showCountdown', 
        label: 'Mostrar Contador', 
        type: 'boolean-switch', 
        defaultValue: false,
        group: 'content'
      },
      { 
        key: 'countdownDate', 
        label: 'Data do Contador', 
        type: 'datetime-local', 
        defaultValue: '',
        group: 'content'
      },
      { 
        key: 'bgColor', 
        label: 'Cor de Fundo', 
        type: 'color-picker', 
        defaultValue: '#B89B7A',
        group: 'style'
      },
      { 
        key: 'textColor', 
        label: 'Cor do Texto', 
        type: 'color-picker', 
        defaultValue: '#FFFFFF',
        group: 'style'
      }
    ]
  }
];
