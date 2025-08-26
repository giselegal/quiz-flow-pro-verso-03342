// Canonical re-export shim for the block registry
import { Heading, Image, Minus, MousePointer, Type } from 'lucide-react';
import React from 'react';
import type { BlockDefinition } from '../types/editor';

// Importar o registry canônico do editor
import {
  ENHANCED_BLOCK_REGISTRY as CANONICAL_REGISTRY,
  getRegistryStats as getCanonicalRegistryStats,
  getEnhancedBlockComponent,
} from '../components/editor/blocks/enhancedBlockRegistry';

// Reexportar o map canônico
export const ENHANCED_BLOCK_REGISTRY = CANONICAL_REGISTRY as Record<
  string,
  React.ComponentType<any>
>;

// Wrapper compatível
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return getEnhancedBlockComponent(type) as unknown as React.ComponentType<any>;
};

export const getAvailableBlockTypes = (): string[] => Object.keys(ENHANCED_BLOCK_REGISTRY);
export const getAllBlockTypes = getAvailableBlockTypes;
export const blockTypeExists = (type: string): boolean => type in ENHANCED_BLOCK_REGISTRY;

// Gerador simples de definições para sidebar (cobre os tipos base mais usados)
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: 'text-inline',
      name: 'Texto',
      icon: Type,
      category: 'content',
      description: 'Adicionar texto formatado',
      component: ENHANCED_BLOCK_REGISTRY['text-inline'],
      label: 'Texto',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'heading-inline',
      name: 'Título',
      icon: Heading,
      category: 'content',
      description: 'Adicionar título',
      component: ENHANCED_BLOCK_REGISTRY['heading-inline'],
      label: 'Título',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'button-inline',
      name: 'Botão',
      icon: MousePointer,
      category: 'interactive',
      description: 'Botão clicável',
      component: ENHANCED_BLOCK_REGISTRY['button-inline'],
      label: 'Botão',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'image-inline',
      name: 'Imagem',
      icon: Image,
      category: 'media',
      description: 'Exibir imagem',
      component: ENHANCED_BLOCK_REGISTRY['image-inline'] || ENHANCED_BLOCK_REGISTRY['image'],
      label: 'Imagem',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'decorative-bar-inline',
      name: 'Barra Decorativa',
      icon: Minus,
      category: 'design',
      description: 'Barra decorativa colorida',
      component: ENHANCED_BLOCK_REGISTRY['decorative-bar-inline'],
      label: 'Barra Decorativa',
      properties: {},
      defaultProps: {},
    },
  ];
};

export const getBlockDefinition = (type: string) => {
  const definitions = generateBlockDefinitions();
  return definitions.find(def => def.type === type) || null;
};

export const getRegistryStats = () => getCanonicalRegistryStats();

export default ENHANCED_BLOCK_REGISTRY;
