
import { BlockDefinition, PropertySchema } from '@/types/editor';
import { Type, Heading1, Image, MousePointer, Square, Star, Layers, DollarSign, Shield, MessageSquare, Video, BarChart, Gift, Palette } from 'lucide-react';

// Mock component for blocks that don't have actual components yet
const MockBlockComponent = ({ block }: { block: any }) => (
  <div className="p-4 border border-dashed border-gray-300 rounded">
    <p className="text-sm text-gray-500">{block.type} block</p>
  </div>
);

export const blockDefinitions: BlockDefinition[] = [
  {
    type: 'heading',
    name: 'Título',
    description: 'Adiciona títulos e subtítulos',
    category: 'Básicos',
    icon: Heading1,
    component: MockBlockComponent,
    properties: {
      title: {
        type: 'text',
        label: 'Título',
        default: 'Seu título aqui'
      },
      subtitle: {
        type: 'text',
        label: 'Subtítulo',
        default: ''
      },
      alignment: {
        type: 'select',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
          { value: 'justify', label: 'Justificado' }
        ],
        default: 'left'
      }
    },
    label: 'Título',
    defaultProps: {
      title: 'Seu título aqui',
      subtitle: '',
      alignment: 'left'
    }
  },

  {
    type: 'paragraph',
    name: 'Texto',
    description: 'Adiciona parágrafos de texto',
    category: 'Básicos',
    icon: Type,
    component: MockBlockComponent,
    properties: {
      text: {
        type: 'textarea',
        label: 'Texto',
        default: 'Digite seu texto aqui...'
      },
      fontSize: {
        type: 'select',
        label: 'Tamanho da fonte',
        options: [
          { value: 'text-sm', label: 'Pequeno' },
          { value: 'text-base', label: 'Normal' },
          { value: 'text-lg', label: 'Grande' },
          { value: 'text-xl', label: 'Extra Grande' },
          { value: 'text-2xl', label: 'Muito Grande' }
        ],
        default: 'text-base'
      },
      alignment: {
        type: 'select',
        label: 'Alinhamento',
        options: [
          { value: 'text-left', label: 'Esquerda' },
          { value: 'text-center', label: 'Centro' },
          { value: 'text-right', label: 'Direita' },
          { value: 'text-justify', label: 'Justificado' }
        ],
        default: 'text-left'
      }
    },
    label: 'Texto',
    defaultProps: {
      text: 'Digite seu texto aqui...',
      fontSize: 'text-base',
      alignment: 'text-left'
    }
  },

  {
    type: 'image',
    name: 'Imagem',
    description: 'Adiciona imagens com legenda',
    category: 'Básicos',
    icon: Image,
    component: MockBlockComponent,
    properties: {
      url: {
        type: 'text',
        label: 'URL da Imagem',
        default: ''
      },
      alt: {
        type: 'text',
        label: 'Texto Alternativo',
        default: 'Imagem'
      },
      width: {
        type: 'text',
        label: 'Largura',
        default: '100%'
      },
      height: {
        type: 'text',
        label: 'Altura',
        default: 'auto'
      },
      borderRadius: {
        type: 'text',
        label: 'Borda Arredondada',
        default: '0px'
      },
      objectFit: {
        type: 'select',
        label: 'Ajuste da Imagem',
        options: [
          { value: 'cover', label: 'Cobrir' },
          { value: 'contain', label: 'Conter' },
          { value: 'fill', label: 'Preencher' },
          { value: 'none', label: 'Nenhum' },
          { value: 'scale-down', label: 'Reduzir' }
        ],
        default: 'cover'
      }
    },
    label: 'Imagem',
    defaultProps: {
      url: '',
      alt: 'Imagem',
      width: '100%',
      height: 'auto',
      borderRadius: '0px',
      objectFit: 'cover'
    }
  },

  {
    type: 'button',
    name: 'Botão',
    description: 'Adiciona botões de ação',
    category: 'Básicos',
    icon: MousePointer,
    component: MockBlockComponent,
    properties: {
      text: {
        type: 'text',
        label: 'Texto do Botão',
        default: 'Clique aqui'
      },
      url: {
        type: 'text',
        label: 'URL de Destino',
        default: '#'
      },
      style: {
        type: 'select',
        label: 'Estilo do Botão',
        options: [
          { value: 'primary', label: 'Primário' },
          { value: 'secondary', label: 'Secundário' },
          { value: 'outline', label: 'Contorno' },
          { value: 'ghost', label: 'Fantasma' },
          { value: 'link', label: 'Link' }
        ],
        default: 'primary'
      }
    },
    label: 'Botão',
    defaultProps: {
      text: 'Clique aqui',
      url: '#',
      style: 'primary'
    }
  },

  {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Adiciona espaço em branco',
    category: 'Básicos',
    icon: Square,
    component: MockBlockComponent,
    properties: {
      height: {
        type: 'text',
        label: 'Altura (px)',
        default: '40'
      }
    },
    label: 'Espaçador',
    defaultProps: {
      height: 40
    }
  },

  {
    type: 'style-result',
    name: 'Resultado do Estilo',
    description: 'Mostra o resultado principal do quiz de estilo',
    category: 'Quiz',
    icon: Star,
    component: MockBlockComponent,
    properties: {
      category: {
        type: 'text',
        label: 'Categoria do Estilo',
        default: ''
      },
      score: {
        type: 'text',
        label: 'Pontuação',
        default: '0'
      },
      percentage: {
        type: 'text',
        label: 'Porcentagem',
        default: '0'
      },
      style: {
        type: 'object',
        label: 'Estilos CSS',
        default: {}
      },
      points: {
        type: 'text',
        label: 'Pontos',
        default: '0'
      },
      rank: {
        type: 'text',
        label: 'Classificação',
        default: '1'
      }
    },
    label: 'Resultado do Estilo',
    defaultProps: {
      category: '',
      score: 0,
      percentage: 0,
      style: {},
      points: 0,
      rank: 1
    }
  },

  {
    type: 'secondary-styles',
    name: 'Estilos Secundários',
    description: 'Mostra estilos complementares',
    category: 'Quiz',
    icon: Layers,
    component: MockBlockComponent,
    properties: {
      styles: {
        type: 'array',
        label: 'Lista de Estilos',
        default: []
      }
    },
    label: 'Estilos Secundários',
    defaultProps: {
      styles: []
    }
  },

  {
    type: 'pricing',
    name: 'Preço',
    description: 'Seção de preços do produto',
    category: 'Vendas',
    icon: DollarSign,
    component: MockBlockComponent,
    properties: {
      salePrice: {
        type: 'text',
        label: 'Preço de Venda',
        default: '0'
      },
      regularPrice: {
        type: 'text',
        label: 'Preço Regular',
        default: '0'
      },
      style: {
        type: 'object',
        label: 'Estilos CSS',
        default: {}
      }
    },
    label: 'Preço',
    defaultProps: {
      salePrice: '0',
      regularPrice: '0',
      style: {}
    }
  },

  {
    type: 'guarantee',
    name: 'Garantia',
    description: 'Seção de garantia do produto',
    category: 'Vendas',
    icon: Shield,
    component: MockBlockComponent,
    properties: {
      text: {
        type: 'textarea',
        label: 'Texto da Garantia',
        default: 'Garantia de 30 dias'
      },
      style: {
        type: 'object',
        label: 'Estilos CSS',
        default: {}
      }
    },
    label: 'Garantia',
    defaultProps: {
      text: 'Garantia de 30 dias',
      style: {}
    }
  },

  {
    type: 'testimonials',
    name: 'Depoimentos',
    description: 'Seção de depoimentos de clientes',
    category: 'Vendas',
    icon: MessageSquare,
    component: MockBlockComponent,
    properties: {
      testimonials: {
        type: 'array',
        label: 'Lista de Depoimentos',
        default: []
      },
      style: {
        type: 'object',
        label: 'Estilos CSS',
        default: {}
      }
    },
    label: 'Depoimentos',
    defaultProps: {
      testimonials: [],
      style: {}
    }
  },

  {
    type: 'cta',
    name: 'Chamada para Ação',
    description: 'Botão principal de conversão',
    category: 'Vendas',
    icon: MousePointer,
    component: MockBlockComponent,
    properties: {
      text: {
        type: 'text',
        label: 'Texto do CTA',
        default: 'Comprar Agora'
      },
      url: {
        type: 'text',
        label: 'URL de Destino',
        default: '#'
      },
      style: {
        type: 'object',
        label: 'Estilos CSS',
        default: {}
      }
    },
    label: 'Chamada para Ação',
    defaultProps: {
      text: 'Comprar Agora',
      url: '#',
      style: {}
    }
  },

  {
    type: 'video',
    name: 'Vídeo',
    description: 'Player de vídeo',
    category: 'Avançado',
    icon: Video,
    component: MockBlockComponent,
    properties: {
      url: {
        type: 'text',
        label: 'URL do Vídeo',
        default: ''
      },
      autoplay: {
        type: 'boolean',
        label: 'Reprodução Automática',
        default: false
      },
      controls: {
        type: 'boolean',
        label: 'Mostrar Controles',
        default: true
      },
      loop: {
        type: 'boolean',
        label: 'Reproduzir em Loop',
        default: false
      }
    },
    label: 'Vídeo',
    defaultProps: {
      url: '',
      autoplay: false,
      controls: true,
      loop: false
    }
  },

  {
    type: 'two-column',
    name: 'Duas Colunas',
    description: 'Layout de duas colunas',
    category: 'Avançado',
    icon: BarChart,
    component: MockBlockComponent,
    properties: {
      leftContent: {
        type: 'textarea',
        label: 'Conteúdo Esquerda',
        default: 'Conteúdo da coluna esquerda'
      },
      rightContent: {
        type: 'textarea',
        label: 'Conteúdo Direita',
        default: 'Conteúdo da coluna direita'
      },
      gap: {
        type: 'text',
        label: 'Espaçamento entre colunas',
        default: '2rem'
      }
    },
    label: 'Duas Colunas',
    defaultProps: {
      leftContent: 'Conteúdo da coluna esquerda',
      rightContent: 'Conteúdo da coluna direita',
      gap: '2rem'
    }
  },

  {
    type: 'carousel',
    name: 'Carrossel',
    description: 'Carrossel de conteúdo',
    category: 'Avançado',
    icon: Gift,
    component: MockBlockComponent,
    properties: {
      items: {
        type: 'array',
        label: 'Itens do Carrossel',
        default: []
      },
      autoplay: {
        type: 'boolean',
        label: 'Reprodução Automática',
        default: false
      },
      interval: {
        type: 'text',
        label: 'Intervalo (ms)',
        default: '5000'
      }
    },
    label: 'Carrossel',
    defaultProps: {
      items: [],
      autoplay: false,
      interval: 5000
    }
  },

  {
    type: 'custom-code',
    name: 'Código Customizado',
    description: 'HTML/CSS personalizado',
    category: 'Avançado',
    icon: Palette,
    component: MockBlockComponent,
    properties: {
      html: {
        type: 'textarea',
        label: 'HTML',
        default: '<div>Seu código HTML aqui</div>'
      },
      css: {
        type: 'textarea',
        label: 'CSS',
        default: ''
      }
    },
    label: 'Código Customizado',
    defaultProps: {
      html: '<div>Seu código HTML aqui</div>',
      css: ''
    }
  }
];

// Utility functions for working with block definitions
export const getCategories = (): string[] => {
  const categories = new Set(blockDefinitions.map(block => block.category));
  return Array.from(categories);
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return blockDefinitions.filter(block => block.category === category);
};

export const getBlockDefinition = (type: string): BlockDefinition | undefined => {
  return blockDefinitions.find(block => block.type === type);
};

export default blockDefinitions;
