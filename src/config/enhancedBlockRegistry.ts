/**
 * ✅ MIGRADO: Wrapper de compatibilidade para UnifiedBlockRegistry
 * 
 * Este arquivo mantém a API legada para código que ainda importa de @/config/enhancedBlockRegistry
 * mas delega tudo para o UnifiedBlockRegistry canônico.
 */
import { Heading, Image, Minus, MousePointer, Type } from 'lucide-react';
import React from 'react';
import type { BlockDefinition } from '../types/editor';
import { blockRegistry, getRegistryStats as getUnifiedStats } from '@/registry/UnifiedBlockRegistry';

// Criar proxy object para compatibilidade com código que acessa ENHANCED_BLOCK_REGISTRY[type]
export const ENHANCED_BLOCK_REGISTRY = new Proxy({} as Record<string, React.ComponentType<any>>, {
  get(_target, prop: string) {
    return blockRegistry.getComponent(prop);
  },
  has(_target, prop: string) {
    return blockRegistry.has(prop);
  },
  ownKeys() {
    return blockRegistry.getAllTypes();
  },
});

// Wrapper compatível
export const getBlockComponent = (type: string): React.ComponentType<any> | null => {
  return blockRegistry.getComponent(type);
};

export const getAvailableBlockTypes = (): string[] => blockRegistry.getAllTypes();
export const getAllBlockTypes = getAvailableBlockTypes;
export const blockTypeExists = (type: string): boolean => blockRegistry.has(type);

// Gerador simples de definições para sidebar (cobre os tipos base mais usados)
export const generateBlockDefinitions = (): BlockDefinition[] => {
  return [
    {
      type: 'text-inline',
      name: 'Texto',
      icon: Type,
      category: 'content',
      description: 'Adicionar texto formatado',
      component: blockRegistry.getComponent('text-inline')!,
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
      component: blockRegistry.getComponent('heading-inline')!,
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
      component: blockRegistry.getComponent('button-inline')!,
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
      component: blockRegistry.getComponent('image-inline') || blockRegistry.getComponent('image')!,
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
      component: blockRegistry.getComponent('decorative-bar-inline')!,
      label: 'Barra Decorativa',
      properties: {},
      defaultProps: {},
    },
    {
      type: 'sales-hero',
      name: 'Sales Hero',
      icon: Image,
      category: 'result',
      description: 'Seção Hero para páginas de venda',
      component: blockRegistry.getComponent('sales-hero')!,
      label: 'Sales Hero',
      properties: {},
      defaultProps: {},
    },
  ];
};

export const getBlockDefinition = (type: string) => {
  const definitions = generateBlockDefinitions();
  return definitions.find(def => def.type === type) || null;
};

export const getRegistryStats = () => getUnifiedStats();

export default ENHANCED_BLOCK_REGISTRY;
