/**
 * 🎯 COMPONENT REGISTRY - REGISTRY ÚNICO DE COMPONENTES
 * 
 * Sistema centralizado que substitui toda fragmentação de componentes:
 * - Todos os blocks registrados em um local
 * - Type-safe component loading
 * - Lazy loading inteligente
 * - Categorização automática
 * - Search e filtering
 * 
 * FUNCIONALIDADES:
 * ✅ Registry unificado
 * ✅ Lazy loading otimizado
 * ✅ Type safety completa
 * ✅ Categorização automática
 * ✅ Search/filter capabilities
 * ✅ Component metadata
 */

import React from 'react';
import { BlockType } from '@/types/editor';

// 🎯 COMPONENT METADATA INTERFACE
export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  tags: string[];
  icon?: string;
  preview?: string;
  isNew?: boolean;
  isPro?: boolean;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  // Component specific
  type: BlockType;
  defaultProps?: Record<string, any>;
  requiredProps?: string[];
  
  // Loading
  component: () => Promise<{ default: React.ComponentType<any> }>;
}

// 🎯 COMPONENT CATEGORIES
export type ComponentCategory = 
  | 'quiz'
  | 'form'
  | 'content'
  | 'media'
  | 'navigation'
  | 'layout'
  | 'interactive'
  | 'conversion'
  | 'social'
  | 'advanced';

// 🎯 COMPONENT REGISTRY MAP
export const COMPONENT_REGISTRY: Record<string, ComponentMetadata> = {
  // Quiz Components
  'quiz-question-inline': {
    id: 'quiz-question-inline',
    name: 'Pergunta de Quiz',
    description: 'Pergunta interativa com múltiplas opções',
    category: 'quiz',
    tags: ['quiz', 'question', 'interactive', 'multiple-choice'],
    icon: '❓',
    type: 'quiz-question-inline',
    difficulty: 'beginner',
    defaultProps: {
      question: 'Qual é a sua pergunta?',
      options: [
        { id: '1', text: 'Opção 1', score: 10 },
        { id: '2', text: 'Opção 2', score: 20 }
      ],
      multipleSelection: false,
      required: true
    },
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  'options-grid': {
    id: 'options-grid',
    name: 'Grid de Opções',
    description: 'Grid responsivo de opções com imagens',
    category: 'quiz',
    tags: ['quiz', 'options', 'grid', 'images', 'responsive'],
    icon: '🔲',
    type: 'options-grid',
    difficulty: 'intermediate',
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  'multiple-choice': {
    id: 'multiple-choice',
    name: 'Múltipla Escolha',
    description: 'Pergunta de múltipla escolha tradicional',
    category: 'quiz',
    tags: ['quiz', 'multiple-choice', 'question'],
    icon: '☑️',
    type: 'multiple-choice',
    difficulty: 'beginner',
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  'quiz-navigation': {
    id: 'quiz-navigation',
    name: 'Navegação do Quiz',
    description: 'Botões de navegação entre etapas',
    category: 'navigation',
    tags: ['navigation', 'quiz', 'buttons'],
    icon: '⏭️',
    type: 'quiz-navigation',
    difficulty: 'beginner',
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  // Content Components
  'text': {
    id: 'text',
    name: 'Bloco de Texto',
    description: 'Texto simples com formatação',
    category: 'content',
    tags: ['text', 'content', 'basic'],
    icon: '📝',
    type: 'text',
    difficulty: 'beginner',
    defaultProps: {
      content: 'Digite seu texto aqui...',
      textAlign: 'left',
      fontSize: 'md'
    },
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  'image': {
    id: 'image',
    name: 'Imagem',
    description: 'Imagem responsiva com caption',
    category: 'media',
    tags: ['image', 'media', 'responsive'],
    icon: '🖼️',
    type: 'image',
    difficulty: 'beginner',
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  // Interactive Components
  'button': {
    id: 'button',
    name: 'Botão',
    description: 'Botão interativo customizável',
    category: 'interactive',
    tags: ['button', 'interactive', 'cta', 'action'],
    icon: '🔘',
    type: 'button',
    difficulty: 'beginner',
    defaultProps: {
      text: 'Clique aqui',
      variant: 'primary',
      size: 'md'
    },
    component: () => import('@/components/blocks/inline/ButtonInline')
  },

  'testimonial': {
    id: 'testimonial',
    name: 'Depoimento',
    description: 'Card de depoimento com foto e rating',
    category: 'social',
    tags: ['testimonial', 'social-proof', 'card'],
    icon: '⭐',
    type: 'testimonial',
    difficulty: 'intermediate',
    component: () => import('@/components/blocks/inline/TestimonialCardInlineBlock')
  }
};

// 🎯 REGISTRY UTILITIES

/**
 * 🔍 GET COMPONENT BY ID
 */
export const getComponent = (id: string): ComponentMetadata | undefined => {
  return COMPONENT_REGISTRY[id];
};

/**
 * 🔍 GET COMPONENTS BY CATEGORY
 */
export const getComponentsByCategory = (category: ComponentCategory): ComponentMetadata[] => {
  return Object.values(COMPONENT_REGISTRY)
    .filter(component => component.category === category);
};

/**
 * 🔍 SEARCH COMPONENTS
 */
export const searchComponents = (query: string): ComponentMetadata[] => {
  const searchTerm = query.toLowerCase();
  return Object.values(COMPONENT_REGISTRY)
    .filter(component => 
      component.name.toLowerCase().includes(searchTerm) ||
      component.description.toLowerCase().includes(searchTerm) ||
      component.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
};

/**
 * 🔍 GET ALL CATEGORIES
 */
export const getAllCategories = (): ComponentCategory[] => {
  const categories = new Set<ComponentCategory>();
  Object.values(COMPONENT_REGISTRY).forEach(component => {
    categories.add(component.category);
  });
  return Array.from(categories);
};

/**
 * 🔍 GET COMPONENTS BY DIFFICULTY
 */
export const getComponentsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): ComponentMetadata[] => {
  return Object.values(COMPONENT_REGISTRY)
    .filter(component => component.difficulty === difficulty);
};

/**
 * 🔍 GET NEW COMPONENTS
 */
export const getNewComponents = (): ComponentMetadata[] => {
  return Object.values(COMPONENT_REGISTRY)
    .filter(component => component.isNew === true);
};

/**
 * 🔍 GET PRO COMPONENTS
 */
export const getProComponents = (): ComponentMetadata[] => {
  return Object.values(COMPONENT_REGISTRY)
    .filter(component => component.isPro === true);
};

// 🎯 GROUPED COMPONENTS FOR UI
export const getGroupedComponents = (): Record<ComponentCategory, ComponentMetadata[]> => {
  const grouped: Record<ComponentCategory, ComponentMetadata[]> = {} as any;
  
  getAllCategories().forEach(category => {
    grouped[category] = getComponentsByCategory(category);
  });
  
  return grouped;
};

// 🎯 COMPONENT REGISTRY STATS
export const getRegistryStats = () => {
  const components = Object.values(COMPONENT_REGISTRY);
  return {
    total: components.length,
    byCategory: getAllCategories().reduce((acc, category) => {
      acc[category] = getComponentsByCategory(category).length;
      return acc;
    }, {} as Record<ComponentCategory, number>),
    byDifficulty: {
      beginner: getComponentsByDifficulty('beginner').length,
      intermediate: getComponentsByDifficulty('intermediate').length,
      advanced: getComponentsByDifficulty('advanced').length
    },
    newComponents: getNewComponents().length,
    proComponents: getProComponents().length
  };
};

export default COMPONENT_REGISTRY;