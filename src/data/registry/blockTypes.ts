/**
 * 🎯 BLOCK TYPES REGISTRY
 * 
 * Registro centralizado de todos os tipos de blocos disponíveis.
 * Substitui: componentDefinitions.ts (parcial)
 * 
 * SPRINT 4 - Consolidação de dados
 */

import type { BlockType } from '@/types/editor';

// ============================================================================
// BLOCK TYPE DEFINITIONS
// ============================================================================

export interface BlockTypeDefinition {
  type: BlockType;
  name: string;
  category: 'layout' | 'content' | 'interactive' | 'media' | 'quiz';
  icon?: string;
  description?: string;
  defaultProperties?: Record<string, any>;
}

// ============================================================================
// REGISTRY
// ============================================================================

export const BLOCK_TYPES_REGISTRY: BlockTypeDefinition[] = [
  // Layout
  {
    type: 'header',
    name: 'Cabeçalho',
    category: 'layout',
    icon: 'Heading',
    description: 'Cabeçalho com título e subtítulo',
    defaultProperties: {
      title: 'Título',
      subtitle: '',
      align: 'center',
    },
  },
  // {
  //   type: 'footer',
  //   name: 'Rodapé',
  //   category: 'layout',
  //   icon: 'AlignBottom',
  //   description: 'Rodapé da página',
  // },

  // Content
  {
    type: 'text',
    name: 'Texto',
    category: 'content',
    icon: 'Type',
    description: 'Bloco de texto formatado',
    defaultProperties: {
      content: 'Digite seu texto aqui',
      align: 'left',
    },
  },
  // {
  //   type: 'paragraph',
  //   name: 'Parágrafo',
  //   category: 'content',
  //   icon: 'AlignLeft',
  //   description: 'Parágrafo de texto',
  //   defaultProperties: {
  //     text: 'Digite seu parágrafo',
  //   },
  // },

  // Interactive
  {
    type: 'button',
    name: 'Botão',
    category: 'interactive',
    icon: 'MousePointerClick',
    description: 'Botão de ação',
    defaultProperties: {
      text: 'Clique aqui',
      variant: 'primary',
      action: 'next',
    },
  },
  // {
  //   type: 'input',
  //   name: 'Campo de entrada',
  //   category: 'interactive',
  //   icon: 'TextCursor',
  //   description: 'Campo de entrada de texto',
  //   defaultProperties: {
  //     label: 'Digite aqui',
  //     placeholder: '',
  //     required: false,
  //   },
  // },

  // Media
  {
    type: 'image',
    name: 'Imagem',
    category: 'media',
    icon: 'Image',
    description: 'Imagem com caption',
    defaultProperties: {
      src: '',
      alt: '',
      caption: '',
    },
  },
  {
    type: 'video',
    name: 'Vídeo',
    category: 'media',
    icon: 'Video',
    description: 'Vídeo embed',
    defaultProperties: {
      url: '',
      autoplay: false,
    },
  },

  // Quiz
  // {
  //   type: 'quiz-question',
  //   name: 'Pergunta de Quiz',
  //   category: 'quiz',
  //   icon: 'HelpCircle',
  //   description: 'Pergunta com múltiplas opções',
  //   defaultProperties: {
  //     question: 'Sua pergunta aqui',
  //     options: [],
  //     multipleSelection: false,
  //   },
  // },
  // {
  //   type: 'quiz-option',
  //   name: 'Opção de Quiz',
  //   category: 'quiz',
  //   icon: 'CheckSquare',
  //   description: 'Opção de resposta',
  //   defaultProperties: {
  //     text: 'Opção',
  //     value: '',
  //   },
  // },
  // {
  //   type: 'progress',
  //   name: 'Barra de Progresso',
  //   category: 'quiz',
  //   icon: 'BarChart',
  //   description: 'Indicador de progresso',
  //   defaultProperties: {
  //     current: 1,
  //     total: 10,
  //     showPercentage: true,
  //   },
  // },
];

// ============================================================================
// HELPERS
// ============================================================================

export function getBlockTypeDefinition(type: BlockType): BlockTypeDefinition | undefined {
  return BLOCK_TYPES_REGISTRY.find((def) => def.type === type);
}

export function getBlockTypesByCategory(category: string): BlockTypeDefinition[] {
  return BLOCK_TYPES_REGISTRY.filter((def) => def.category === category);
}

export function getAllBlockTypes(): BlockType[] {
  return BLOCK_TYPES_REGISTRY.map((def) => def.type);
}

export function getDefaultProperties(type: BlockType): Record<string, any> {
  const definition = getBlockTypeDefinition(type);
  return definition?.defaultProperties || {};
}

// ============================================================================
// EXPORT
// ============================================================================

export default BLOCK_TYPES_REGISTRY;
