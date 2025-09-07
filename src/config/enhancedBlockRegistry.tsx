// Shim: reexportar o registry canônico e utilitários compatíveis
import { Heading, Image, Minus, MousePointer, Type } from 'lucide-react';
import React from 'react';
import {
  ENHANCED_BLOCK_REGISTRY as CANONICAL_REGISTRY,
  getEnhancedBlockComponent,
} from '../components/editor/blocks/enhancedBlockRegistry';
import type { BlockDefinition } from '../types/editor';

export const ENHANCED_BLOCK_REGISTRY = CANONICAL_REGISTRY as Record<
  string,
  React.ComponentType<any>
>;

export function getBlockComponent(type: string): React.ComponentType<any> | null {
  return getEnhancedBlockComponent(type) as unknown as React.ComponentType<any>;
}

export function generateBlockDefinitions(): BlockDefinition[] {
  return [
    {
      type: 'text-inline',
      name: 'Texto Simples',
      label: 'Texto',
      category: 'Conteúdo',
      description: 'Adicionar texto',
      icon: Type,
      component: ENHANCED_BLOCK_REGISTRY['text-inline'],
      defaultProps: { content: 'Digite seu texto aqui...' },
      properties: {},
    },
    {
      type: 'heading-inline',
      name: 'Título',
      label: 'Título',
      category: 'Conteúdo',
      description: 'Adicionar título',
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY['heading-inline'],
      defaultProps: { text: 'Seu título aqui', level: 'h2' },
      properties: {},
    },
    {
      type: 'image-inline',
      name: 'Imagem',
      label: 'Imagem',
      category: 'Mídia',
      description: 'Exibir imagem',
      icon: Image,
      component: ENHANCED_BLOCK_REGISTRY['image-inline'] || ENHANCED_BLOCK_REGISTRY['image'],
      defaultProps: { src: '', alt: 'Imagem' },
      properties: {},
    },
    {
      type: 'button-inline',
      name: 'Botão',
      label: 'Botão',
      category: 'Interativo',
      description: 'Botão clicável',
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY['button-inline'],
      defaultProps: { text: 'Clique aqui', variant: 'primary' },
      properties: {},
    },
    {
      type: 'decorative-bar-inline',
      name: 'Barra Decorativa',
      label: 'Barra',
      category: 'Visual',
      description: 'Barra decorativa colorida',
      icon: Minus,
      component: ENHANCED_BLOCK_REGISTRY['decorative-bar-inline'],
      defaultProps: {},
      properties: {},
    },
    // --- Itens de Quiz e Conteúdo ampliados para a coluna de componentes ---
    {
      type: 'quiz-intro-header',
      name: 'Cabeçalho do Quiz',
      label: 'Cabeçalho do Quiz',
      category: 'Quiz',
      description: 'Seção de introdução do quiz',
      icon: Heading,
      component: ENHANCED_BLOCK_REGISTRY['quiz-intro-header'],
      defaultProps: {},
      properties: {},
    },
    {
      type: 'options-grid',
      name: 'Pergunta (Opções em Grid)',
      label: 'Opções em Grid',
      category: 'Quiz',
      description: 'Perguntas com opções clicáveis (texto/imagem)',
      icon: MousePointer,
      component: ENHANCED_BLOCK_REGISTRY['options-grid'],
      defaultProps: { options: [] },
      properties: {},
    },
  ];
}

export const getAvailableBlockTypes = (): string[] => Object.keys(ENHANCED_BLOCK_REGISTRY);
export const blockTypeExists = (type: string): boolean => type in ENHANCED_BLOCK_REGISTRY;
export default ENHANCED_BLOCK_REGISTRY;
