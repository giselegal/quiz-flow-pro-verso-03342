
import React from 'react';
import { BlockData, BlockComponentProps } from '@/types/blocks';
import { BlockDefinition } from '@/types/editor';
import VideoPlayerBlock from './VideoPlayerBlock';

// Export BlockDefinition type for other components
export type { BlockDefinition } from '@/types/editor';

// Enhanced block registry with complete definitions
const ENHANCED_BLOCK_REGISTRY: Record<string, BlockDefinition> = {
  'text-inline': {
    type: 'text-inline',
    name: 'Texto',
    description: 'Bloco de texto editável',
    category: 'content',
    icon: 'Type',
    component: ({ block, onClick }) => (
      <div className="p-4 border border-gray-200 rounded cursor-pointer" onClick={onClick}>
        <p>{block.properties?.text || 'Clique para editar o texto'}</p>
      </div>
    ),
    properties: {
      text: {
        type: 'textarea',
        label: 'Texto',
        defaultValue: 'Texto de exemplo'
      }
    },
    label: 'Texto',
    defaultProps: {
      text: 'Texto de exemplo'
    },
    tags: ['text', 'content']
  },
  'heading-inline': {
    type: 'heading-inline',
    name: 'Título',
    description: 'Título ou cabeçalho',
    category: 'content',
    icon: 'Heading1',
    component: ({ block, onClick }) => (
      <div className="p-4 border border-gray-200 rounded cursor-pointer" onClick={onClick}>
        <h2 className="text-xl font-bold">{block.properties?.text || 'Título'}</h2>
      </div>
    ),
    properties: {
      text: {
        type: 'text',
        label: 'Título',
        defaultValue: 'Título'
      },
      level: {
        type: 'select',
        label: 'Nível',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        defaultValue: 'h2'
      }
    },
    label: 'Título',
    defaultProps: {
      text: 'Título',
      level: 'h2'
    },
    tags: ['heading', 'title']
  },
  'video-player': {
    type: 'video-player',
    name: 'Player de Vídeo',
    description: 'Reprodutor de vídeo incorporado',
    category: 'media',
    icon: 'Video',
    component: VideoPlayerBlock,
    properties: {
      videoUrl: {
        type: 'text',
        label: 'URL do Vídeo',
        defaultValue: ''
      },
      title: {
        type: 'text',
        label: 'Título',
        defaultValue: 'Vídeo'
      }
    },
    label: 'Player de Vídeo',
    defaultProps: {
      videoUrl: '',
      title: 'Vídeo'
    },
    tags: ['video', 'media']
  }
};

// Block categories with proper structure
export const BLOCK_CATEGORIES = [
  {
    title: 'Conteúdo',
    color: 'blue',
    components: ['text-inline', 'heading-inline'],
    description: 'Elementos de texto e conteúdo',
    icon: 'Type',
    name: 'Conteúdo'
  },
  {
    title: 'Mídia',
    color: 'green',
    components: ['video-player'],
    description: 'Elementos de mídia e vídeo',
    icon: 'Video', 
    name: 'Mídia'
  }
];

// Utility functions
export const getAllBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

export const getBlockDefinition = (type: string): BlockDefinition | undefined => {
  return ENHANCED_BLOCK_REGISTRY[type];
};

export const searchBlocks = (query: string): BlockDefinition[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(ENHANCED_BLOCK_REGISTRY).filter(block => 
    block.name.toLowerCase().includes(lowerQuery) ||
    block.description.toLowerCase().includes(lowerQuery) ||
    block.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return Object.values(ENHANCED_BLOCK_REGISTRY).filter(block => block.category === category);
};

export default ENHANCED_BLOCK_REGISTRY;
