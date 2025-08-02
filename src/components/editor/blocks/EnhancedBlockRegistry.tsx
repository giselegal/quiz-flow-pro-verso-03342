
import React, { lazy, Suspense, ComponentType } from 'react';
import { BlockDefinition } from '@/types/editor';
import { BlockComponentProps } from '@/types/blocks';

// Import existing blocks that we know are available
const TextInlineBlock = lazy(() => import('./inline/TextInlineBlock'));
const ImageDisplayInlineBlock = lazy(() => import('./inline/ImageDisplayInlineBlock'));
const ButtonInlineBlock = lazy(() => import('./inline/ButtonInlineBlock'));
const HeadingInlineBlock = lazy(() => import('./inline/HeadingInlineBlock'));
const SpacerBlock = lazy(() => import('./SpacerBlock'));
const VideoPlayerBlock = lazy(() => import('./VideoPlayerBlock').then(module => ({ default: module.default || module.VideoPlayerBlock })));

// Enhanced fallback component for missing blocks
const EnhancedFallbackBlock = lazy(() => Promise.resolve({
  default: ({ block, blockType = 'unknown' }: BlockComponentProps & { blockType?: string }) => (
    <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <div className="text-gray-600 text-sm">
        <div className="font-medium mb-1">Bloco: {blockType}</div>
        <div className="text-xs text-gray-500">Componente não encontrado</div>
      </div>
    </div>
  )
}));

// Registry of available blocks - only including blocks that actually exist
const BLOCK_REGISTRY: Record<string, React.LazyExoticComponent<ComponentType<any>>> = {
  // Text blocks
  'text': TextInlineBlock,
  'text-inline': TextInlineBlock,
  'heading': HeadingInlineBlock,
  'heading-inline': HeadingInlineBlock,
  
  // Media blocks
  'image': ImageDisplayInlineBlock,
  'image-display-inline': ImageDisplayInlineBlock,
  'video': VideoPlayerBlock,
  'video-player': VideoPlayerBlock,
  
  // Interactive blocks
  'button': ButtonInlineBlock,
  'button-inline': ButtonInlineBlock,
  
  // Layout blocks
  'spacer': SpacerBlock,
  
  // Fallback for unknown blocks
  'enhanced-fallback': EnhancedFallbackBlock,
};

// Block definitions with properties and labels
export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  'text': {
    type: 'text',
    name: 'Texto',
    description: 'Bloco de texto simples',
    category: 'content',
    icon: 'Type',
    component: TextInlineBlock,
    label: 'Texto',
    properties: {
      text: {
        type: 'textarea',
        label: 'Conteúdo do texto',
        defaultValue: 'Digite seu texto aqui...'
      }
    },
    defaultProps: {
      text: 'Digite seu texto aqui...'
    }
  },
  'heading': {
    type: 'heading',
    name: 'Título',
    description: 'Bloco de título/cabeçalho',
    category: 'content',
    icon: 'Heading1',
    component: HeadingInlineBlock,
    label: 'Título',
    properties: {
      text: {
        type: 'text',
        label: 'Texto do título',
        defaultValue: 'Novo título'
      },
      level: {
        type: 'select',
        label: 'Nível do título',
        defaultValue: 'h2',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
      }
    },
    defaultProps: {
      text: 'Novo título',
      level: 'h2'
    }
  },
  'image': {
    type: 'image',
    name: 'Imagem',
    description: 'Bloco de imagem',
    category: 'media',
    icon: 'Image',
    component: ImageDisplayInlineBlock,
    label: 'Imagem',
    properties: {
      imageUrl: {
        type: 'image',
        label: 'URL da imagem',
        defaultValue: ''
      },
      alt: {
        type: 'text',
        label: 'Texto alternativo',
        defaultValue: 'Imagem'
      }
    },
    defaultProps: {
      imageUrl: '',
      alt: 'Imagem'
    }
  },
  'button': {
    type: 'button',
    name: 'Botão',
    description: 'Bloco de botão clicável',
    category: 'interactive',
    icon: 'MousePointer',
    component: ButtonInlineBlock,
    label: 'Botão',
    properties: {
      text: {
        type: 'text',
        label: 'Texto do botão',
        defaultValue: 'Clique aqui'
      },
      url: {
        type: 'text',
        label: 'URL de destino',
        defaultValue: '#'
      }
    },
    defaultProps: {
      text: 'Clique aqui',
      url: '#'
    }
  },
  'spacer': {
    type: 'spacer',
    name: 'Espaçador',
    description: 'Espaço em branco para layout',
    category: 'layout',
    icon: 'Minus',
    component: SpacerBlock,
    label: 'Espaçador',
    properties: {
      height: {
        type: 'number',
        label: 'Altura (px)',
        defaultValue: 40
      }
    },
    defaultProps: {
      height: 40
    }
  }
};

// Get block component with fallback
export const getBlockComponent = (blockType: string): React.LazyExoticComponent<ComponentType<any>> => {
  const component = BLOCK_REGISTRY[blockType];
  if (!component) {
    console.warn(`Block type "${blockType}" not found, using fallback`);
    return BLOCK_REGISTRY['enhanced-fallback'];
  }
  return component;
};

// Get block definition with proper typing
export const getBlockDefinition = (blockType: string): BlockDefinition | null => {
  return BLOCK_DEFINITIONS[blockType] || null;
};

// Get all available block types
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(BLOCK_DEFINITIONS);
};

// Enhanced block renderer with error boundaries
export const renderBlock = (
  blockType: string, 
  props: BlockComponentProps,
  fallbackProps?: { blockType?: string }
) => {
  const Component = getBlockComponent(blockType);
  
  return (
    <Suspense fallback={
      <div className="animate-pulse bg-gray-100 h-20 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">Carregando...</span>
      </div>
    }>
      <Component {...props} {...(fallbackProps || {})} />
    </Suspense>
  );
};

export default BLOCK_REGISTRY;
