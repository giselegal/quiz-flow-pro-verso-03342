import React from 'react';
import { BlockDefinition } from "@/types/editor";
import {
  Heading,
  Image,
  MousePointer,
  Type,
} from "lucide-react";

// === IMPORTS BÁSICOS - APENAS COMPONENTES FUNCIONAIS ===

// Componentes Inline básicos que funcionam
import TextInline from '../components/blocks/inline/TextInline';
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';

// === REGISTRY PRINCIPAL - APENAS COMPONENTES BÁSICOS E FUNCIONAIS ===

/**
 * Enhanced Block Registry - Versão Simplificada
 * ✅ Apenas componentes que funcionam garantidamente
 * ✅ Sem dependências circulares
 * ✅ Sistema de fallbacks básico
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // Text and Content - BASE
  'text-inline': TextInline,
  'heading': HeadingBlock,
  'image-display-inline': ImageDisplayInlineBlockClean,

  // Interactive Elements
  'button-inline': ButtonInlineFixed,
};

/**
 * Obter componente por tipo - versão simplificada
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  if (!type) {
    console.warn('🚨 getBlockComponent: Tipo não fornecido');
    return null;
  }

  // Busca direta no registry
  const component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    console.log(`✅ Componente encontrado: ${type}`);
    return component;
  }

  // Fallback básico para TextInline
  console.warn(`🚨 Componente não encontrado: ${type}, usando fallback TextInline`);
  return TextInline;
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
      name: "TextInline",
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
      type: "image-display-inline",
      name: "ImageDisplayInlineBlockClean",
      label: "Imagem",
      category: "Mídia",
      description: "Exibição de imagens",
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY["image-display-inline"],
      properties: {},
      defaultProps: { src: "", alt: "Imagem" },
    },
    {
      type: "button-inline",
      name: "ButtonInlineFixed",
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

/**
 * Registry padrão para compatibilidade
 */
export default ENHANCED_BLOCK_REGISTRY;