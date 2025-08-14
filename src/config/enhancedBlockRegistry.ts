import React from 'react';
import { BlockDefinition } from "@/types/editor";
import {
  Heading,
  Image,
  MousePointer,
  Type,
} from "lucide-react";

// === IMPORTS EXPANDIDOS - COMPONENTES PARA STEP01 E 21 ETAPAS ===

// Componentes Inline básicos que funcionam
import TextInline from '../components/blocks/inline/TextInline';
import ButtonInlineFixed from '../components/blocks/inline/ButtonInlineFixed';
import HeadingBlock from '../components/blocks/inline/HeadingBlock';
import ImageDisplayInlineBlockClean from '../components/blocks/inline/ImageDisplayInlineBlock.clean';

// Componentes Editor Blocks necessários para Step01
import QuizIntroHeaderBlock from '../components/editor/blocks/QuizIntroHeaderBlock';
import DecorativeBarInlineBlock from '../components/editor/blocks/DecorativeBarInlineBlock';
import FormInputBlock from '../components/editor/blocks/FormInputBlock';
import FormContainerBlock from '../components/editor/blocks/FormContainerBlock';
import TextInlineBlock from '../components/editor/blocks/TextInlineBlock';
import HeadingInlineBlock from '../components/editor/blocks/HeadingInlineBlock';

// === REGISTRY PRINCIPAL - APENAS COMPONENTES BÁSICOS E FUNCIONAIS ===

/**
 * Enhanced Block Registry - Versão Expandida para Step01 e 21 Etapas
 * ✅ Componentes essenciais do Step01 JSON
 * ✅ Sem dependências circulares
 * ✅ Sistema de fallbacks robusto
 */
export const ENHANCED_BLOCK_REGISTRY: Record<string, React.ComponentType<any>> = {
  // ===== COMPONENTES STEP01TEMPLATE - BASEADOS NO TYPESCRIPT =====
  
  // Componentes específicos do getStep01Template()
  'quiz-intro-header': QuizIntroHeaderBlock, // ✅ Cabeçalho com logo e progresso
  'decorative-bar-inline': DecorativeBarInlineBlock, // ✅ Barra decorativa colorida
  'text-inline': TextInlineBlock, // ✅ Texto formatado avançado (usado 2x)
  'image-display-inline': ImageDisplayInlineBlockClean, // ✅ Imagem com estilos
  'form-container': FormContainerBlock, // ✅ Container de formulário
  'form-input': FormInputBlock, // ✅ Input de formulário
  'button-inline': ButtonInlineFixed, // ✅ Botão interativo
  
  // ===== ALIASES E COMPATIBILIDADE =====
  
  // Aliases comuns
  'decorative-bar': DecorativeBarInlineBlock,
  'text': TextInlineBlock,
  'image': ImageDisplayInlineBlockClean,
  'button': ButtonInlineFixed,
  'form': FormInputBlock,
  
  // Componentes básicos - BASE
  'heading': HeadingBlock,
  'heading-inline': HeadingInlineBlock,
};

/**
 * Obter componente por tipo - versão expandida com fallbacks robustos
 */
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  if (!type) {
    console.warn('🚨 getBlockComponent: Tipo não fornecido');
    return null;
  }

  console.log(`🔍 Buscando componente para tipo: "${type}"`);

  // Busca direta no registry
  let component = ENHANCED_BLOCK_REGISTRY[type];
  if (component) {
    console.log(`✅ Componente encontrado diretamente: ${type}`);
    return component;
  }

  // ===== FALLBACKS INTELIGENTES - STEP01 ESPECÍFICOS =====
  
  const step01Fallbacks: Record<string, string> = {
    // Aliases e variações → tipos do registry
    'text-inline': 'text',
    'heading-inline': 'heading-inline',
    'image-display-inline': 'image-display-inline', 
    'button-inline': 'button-inline',
    'decorative-bar': 'decorative-bar-inline',
    
    // Fallbacks para tipos em português
    'cabeçalho-introdução-do-questionário': 'quiz-intro-header',
    'texto-embutido': 'text',
    'imagem-em-linha': 'image-display-inline',
    'formulário-de-chumbo': 'form-input',
  };

  const fallbackType = step01Fallbacks[type];
  if (fallbackType && ENHANCED_BLOCK_REGISTRY[fallbackType]) {
    component = ENHANCED_BLOCK_REGISTRY[fallbackType];
    console.log(`🔄 Fallback Step01: ${type} → ${fallbackType}`);
    return component;
  }

  // ===== FALLBACKS POR CATEGORIA =====
  
  if (type.includes('text') || type.includes('title') || type.includes('content')) {
    console.log(`📝 Fallback genérico: ${type} → text`);
    return ENHANCED_BLOCK_REGISTRY['text'] || ENHANCED_BLOCK_REGISTRY['text-inline'];
  }

  if (type.includes('button') || type.includes('cta') || type.includes('action')) {
    console.log(`🔘 Fallback genérico: ${type} → button`);
    return ENHANCED_BLOCK_REGISTRY['button'] || ENHANCED_BLOCK_REGISTRY['button-inline'];
  }

  if (type.includes('image') || type.includes('photo') || type.includes('picture')) {
    console.log(`🖼️ Fallback genérico: ${type} → image-display-inline`);
    return ENHANCED_BLOCK_REGISTRY['image-display-inline'] || ENHANCED_BLOCK_REGISTRY['image'];
  }

  if (type.includes('form') || type.includes('input') || type.includes('field')) {
    console.log(`📝 Fallback genérico: ${type} → form-input`);
    return ENHANCED_BLOCK_REGISTRY['form-input'];
  }

  if (type.includes('header') || type.includes('intro') || type.includes('quiz')) {
    console.log(`🎯 Fallback genérico: ${type} → quiz-intro-header`);
    return ENHANCED_BLOCK_REGISTRY['quiz-intro-header'];
  }

  // ===== FALLBACK FINAL =====
  console.warn(`⚠️ Componente não encontrado, usando fallback final: ${type} → text`);
  console.log('📋 Componentes disponíveis:', Object.keys(ENHANCED_BLOCK_REGISTRY));
  return ENHANCED_BLOCK_REGISTRY['text'] || ENHANCED_BLOCK_REGISTRY['text-inline'] || null;

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