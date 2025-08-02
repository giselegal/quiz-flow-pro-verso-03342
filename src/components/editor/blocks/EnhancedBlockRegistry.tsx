
import React from 'react';
import { BlockData, BlockComponentProps } from '@/types/blocks';
import { BlockDefinition } from '@/types/editor';
import { Type, Heading1, Video } from 'lucide-react';
import VideoPlayerBlock from './VideoPlayerBlock';

// Enhanced block registry with complete definitions
const ENHANCED_BLOCK_REGISTRY: Record<string, BlockDefinition> = {
  'text-inline': {
    type: 'text-inline',
    name: 'Texto',
    description: 'Bloco de texto editável',
    category: 'content',
    icon: Type,
    component: ({ block, onClick }) => (
      <div className="p-4 border border-gray-200 rounded cursor-pointer" onClick={onClick}>
        <p>{block.properties?.text || 'Clique para editar o texto'}</p>
      </div>
    ),
    properties: {
      text: {
        type: 'textarea',
        label: 'Texto',
        default: 'Texto de exemplo'
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
    icon: Heading1,
    component: ({ block, onClick }) => (
      <div className="p-4 border border-gray-200 rounded cursor-pointer" onClick={onClick}>
        <h2 className="text-xl font-bold">{block.properties?.text || 'Título'}</h2>
      </div>
    ),
    properties: {
      text: {
        type: 'string',
        label: 'Título',
        default: 'Título'
      },
      level: {
        type: 'select',
        label: 'Nível',
        options: [
          { value: 'h1', label: 'H1' },
          { value: 'h2', label: 'H2' },
          { value: 'h3', label: 'H3' },
          { value: 'h4', label: 'H4' },
          { value: 'h5', label: 'H5' },
          { value: 'h6', label: 'H6' }
        ],
        default: 'h2'
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
    icon: Video,
    component: VideoPlayerBlock,
    properties: {
      videoUrl: {
        type: 'string',
        label: 'URL do Vídeo',
        default: ''
      },
      title: {
        type: 'string',
        label: 'Título',
        default: 'Vídeo'
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
    (block.tags && block.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)))
  );
};

export const getBlocksByCategory = (category: string): BlockDefinition[] => {
  return Object.values(ENHANCED_BLOCK_REGISTRY).filter(block => block.category === category);
};

// Export BlockDefinition for external use
export type { BlockDefinition } from '@/types/editor';

export default ENHANCED_BLOCK_REGISTRY;
