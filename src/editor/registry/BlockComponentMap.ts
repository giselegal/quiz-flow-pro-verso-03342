/**
 * 🎯 BLOCK COMPONENT MAP - Mapeamento de Componentes
 * 
 * Mapa que associa nomes de componentes aos componentes React.
 * Usado pelo BlockRenderer para renderizar blocos dinamicamente.
 */

import React from 'react';
import { BlockComponentMap } from '@/types/blockTypes';

// Importar componentes de bloco
import TitleBlock from '@/editor/components/blocks/TitleBlock';
import FormInputBlock from '@/editor/components/blocks/FormInputBlock';
import ButtonBlockModular from '@/editor/components/blocks/ButtonBlockModular';
import QuestionTextBlock from '@/editor/components/blocks/QuestionTextBlock';
import OptionsBlock from '@/editor/components/blocks/OptionsBlock';
import ImageBlock from '@/editor/components/blocks/ImageBlock';

/**
 * Mapa de componentes de bloco
 */
export const BLOCK_COMPONENT_MAP: BlockComponentMap = {
  // Blocos básicos
  'TitleBlock': TitleBlock,
  'ImageBlock': ImageBlock,
  'FormInputBlock': FormInputBlock,
  'ButtonBlock': ButtonBlockModular,
  
  // Blocos de pergunta
  'QuestionTextBlock': QuestionTextBlock,
  'OptionsBlock': OptionsBlock,
  
  // Aliases para compatibilidade
  'title': TitleBlock,
  'image': ImageBlock,
  'form-input': FormInputBlock,
  'button': ButtonBlockModular,
  'question-text': QuestionTextBlock,
  'options': OptionsBlock,
};

/**
 * Obtém componente do registry
 */
export function getBlockComponent(componentName: string): React.ComponentType<any> | undefined {
  return BLOCK_COMPONENT_MAP[componentName];
}

/**
 * Registra novo componente no registry
 */
export function registerBlockComponent(name: string, component: React.ComponentType<any>): void {
  BLOCK_COMPONENT_MAP[name] = component;
}

/**
 * Lista todos os componentes registrados
 */
export function listRegisteredComponents(): string[] {
  return Object.keys(BLOCK_COMPONENT_MAP);
}

/**
 * Verifica se componente está registrado
 */
export function isComponentRegistered(componentName: string): boolean {
  return componentName in BLOCK_COMPONENT_MAP;
}

export default BLOCK_COMPONENT_MAP;
