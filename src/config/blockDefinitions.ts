
import { BlockDefinition } from '@/types/editor';
import { Type, Image, AlignLeft, Square, Minus } from 'lucide-react';

// Import real components instead of placeholder
import TextInlineBlock from '@/components/editor/blocks/inline/TextInlineBlock';
import StyleCardInlineBlock from '@/components/editor/blocks/inline/StyleCardInlineBlock';
import BadgeInlineBlock from '@/components/editor/blocks/inline/BadgeInlineBlock';
import SpacerInlineBlock from '@/components/editor/blocks/inline/SpacerInlineBlock';

export const blockDefinitions: BlockDefinition[] = [
  {
    type: 'headline',
    name: 'Título',
    description: 'Título principal e subtítulo',
    category: 'Text',
    icon: Type,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      title: {
        type: 'string',
        default: 'Novo Título',
        label: 'Título',
        description: 'Título principal'
      },
      subtitle: {
        type: 'string',
        default: '',
        label: 'Subtítulo',
        description: 'Subtítulo opcional'
      },
      alignment: {
        type: 'select',
        default: 'left',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
          { value: 'justify', label: 'Justificado' }
        ]
      }
    },
    label: 'Título',
    defaultProps: {
      title: 'Novo Título',
      subtitle: '',
      alignment: 'left'
    }
  },
  {
    type: 'text',
    name: 'Texto',
    description: 'Parágrafo de texto simples',
    category: 'Text',
    icon: AlignLeft,
    component: TextInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: 'textarea',
        default: 'Digite seu texto aqui...',
        label: 'Texto',
        description: 'Conteúdo do texto'
      },
      fontSize: {
        type: 'select',
        default: '1rem',
        label: 'Tamanho da fonte',
        options: [
          { value: '0.875rem', label: 'Pequeno' },
          { value: '1rem', label: 'Normal' },
          { value: '1.125rem', label: 'Médio' },
          { value: '1.25rem', label: 'Grande' },
          { value: '1.5rem', label: 'Extra Grande' }
        ]
      },
      alignment: {
        type: 'select',
        default: 'left',
        label: 'Alinhamento',
        options: [
          { value: 'left', label: 'Esquerda' },
          { value: 'center', label: 'Centro' },
          { value: 'right', label: 'Direita' },
          { value: 'justify', label: 'Justificado' }
        ]
      }
    },
    label: 'Texto',
    defaultProps: {
      text: 'Digite seu texto aqui...',
      fontSize: '1rem',
      alignment: 'left'
    }
  },
  {
    type: 'image',
    name: 'Imagem',
    description: 'Componente de imagem',
    category: 'Media',
    icon: Image,
    component: StyleCardInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      url: {
        type: 'string',
        default: '',
        label: 'URL da imagem',
        description: 'Endereço da imagem'
      },
      alt: {
        type: 'string',
        default: 'Imagem',
        label: 'Texto alternativo',
        description: 'Descrição da imagem para acessibilidade'
      },
      width: {
        type: 'string',
        default: '100%',
        label: 'Largura',
        description: 'Largura da imagem'
      },
      height: {
        type: 'string',
        default: 'auto',
        label: 'Altura',
        description: 'Altura da imagem'
      },
      borderRadius: {
        type: 'string',
        default: '0.5rem',
        label: 'Borda arredondada',
        description: 'Raio da borda'
      },
      objectFit: {
        type: 'select',
        default: 'cover',
        label: 'Ajuste da imagem',
        options: [
          { value: 'cover', label: 'Cobrir' },
          { value: 'contain', label: 'Conter' },
          { value: 'fill', label: 'Preencher' },
          { value: 'none', label: 'Nenhum' },
          { value: 'scale-down', label: 'Reduzir' }
        ]
      }
    },
    label: 'Imagem',
    defaultProps: {
      url: '',
      alt: 'Imagem',
      width: '100%',
      height: 'auto',
      borderRadius: '0.5rem',
      objectFit: 'cover'
    }
  },
  {
    type: 'button',
    name: 'Botão',
    description: 'Botão de ação',
    category: 'Interactive',
    icon: Square,
    component: BadgeInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      text: {
        type: 'string',
        default: 'Clique aqui',
        label: 'Texto do botão',
        description: 'Texto exibido no botão'
      },
      url: {
        type: 'string',
        default: '#',
        label: 'URL de destino',
        description: 'Link para onde o botão deve levar'
      },
      style: {
        type: 'select',
        default: 'primary',
        label: 'Estilo',
        options: [
          { value: 'primary', label: 'Primário' },
          { value: 'secondary', label: 'Secundário' },
          { value: 'outline', label: 'Contorno' },
          { value: 'ghost', label: 'Fantasma' }
        ]
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
    description: 'Espaço em branco vertical',
    category: 'Layout',
    icon: Minus,
    component: SpacerInlineBlock, // ✅ CONECTADO ao componente real
    properties: {
      height: {
        type: 'number',
        default: 40,
        label: 'Altura (px)',
        description: 'Altura do espaçamento em pixels'
      }
    },
    label: 'Espaçador',
    defaultProps: {
      height: 40
    }
  }
];

export const getCategories = (): string[] => {
  const categories = new Set<string>();
  blockDefinitions.forEach(block => {
    categories.add(block.category);
  });
  return Array.from(categories);
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return blockDefinitions.filter(block => block.category === category);
};

export const getBlockByType = (type: string): BlockDefinition | undefined => {
  return blockDefinitions.find(block => block.type === type);
};
