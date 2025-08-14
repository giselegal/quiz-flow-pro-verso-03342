import React from 'react';
import { BlockDefinition } from '@/types/editor';
import { Type, MousePointer, Heading } from 'lucide-react';

// === IMPORTS DE COMPONENTES EXISTENTES ===

// Componentes que existem nos caminhos corretos
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';
import ButtonInlineBlock from '../components/editor/blocks/ButtonInlineBlock';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';

// === REGISTRY PRINCIPAL (APENAS COMPONENTES EXISTENTES) ===

export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content
  "text-inline": TextInlineBlock,
  "heading": HeadingBlock,

  // Interactive Elements
  "button-inline": ButtonInlineBlock,
};

/**
 * Obter componente por tipo
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return ENHANCED_BLOCK_REGISTRY[type] || null;
};

/**
 * Listar todos os tipos disponíveis
 */
export const getAvailableBlockTypes = (): string[] => {
  return Object.keys(ENHANCED_BLOCK_REGISTRY);
};

/**
 * Verificar se um tipo de bloco existe
 */
export const blockTypeExists = (type: string): boolean => {
  return type in ENHANCED_BLOCK_REGISTRY;
};

/**
 * Gerar definições de blocos para o sidebar
 */
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: "text-inline",
      name: "TextInlineBlock",
      label: "Texto",
      category: "Conteúdo",
      description: "Bloco de texto editável",
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY["text-inline"],
      properties: {},
      defaultProps: { content: "Digite seu texto aqui..." },
    },
    {
      type: "heading",
      name: "HeadingBlock",
      label: "Título",
      category: "Conteúdo",
      description: "Título com diferentes tamanhos",
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY["heading"],
      properties: {},
      defaultProps: { text: "Seu título aqui", level: "h2" },
    },
    {
      type: "button-inline",
      name: "ButtonInlineBlock",
      label: "Botão",
      category: "Interativo",
      description: "Botão clicável",
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY["button-inline"],
      properties: {},
      defaultProps: { text: "Clique aqui", variant: "primary" },
    },
  ];
};

/**
 * Obter estatísticas do registry
 */
export const getRegistryStats = () => {
  const stats = {
    totalComponents: Object.keys(ENHANCED_BLOCK_REGISTRY).length,
    categories: new Set<string>(),
    componentsByCategory: {} as Record<string, number>,
  };

  generateBlockDefinitions().forEach(def => {
    stats.categories.add(def.category);
    stats.componentsByCategory[def.category] = 
      (stats.componentsByCategory[def.category] || 0) + 1;
  });

  return {
    ...stats,
    categories: Array.from(stats.categories),
  };
};

export default ENHANCED_BLOCK_REGISTRY;