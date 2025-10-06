/**
 * 🎯 BLOCK COMPONENT MAP - Mapeamento de Componentes
 * 
 * Mapa que associa nomes de componentes aos componentes React.
 * Usado pelo BlockRenderer para renderizar blocos dinamicamente.
 */

import React from 'react';
import { BlockComponentMap } from '@/types/blockTypes';

// Importar componentes de bloco
import { TitleBlock } from '../components/blocks/TitleBlock';
import { ImageBlock } from '../components/blocks/ImageBlock';
import { ButtonBlockModular } from '../components/blocks/ButtonBlockModular';
import { QuestionTextBlock } from '../components/blocks/QuestionTextBlock';
import { OptionsBlock } from '../components/blocks/OptionsBlock';
import { FormInputBlock } from '../components/blocks/FormInputBlock';
import { TransitionBlock } from '../components/blocks/TransitionBlock';
import { ResultBlock } from '../components/blocks/ResultBlock';
import { OfferBlock } from '../components/blocks/OfferBlock';

/**
 * Mapa de componentes de blocos
 */
export const BLOCK_COMPONENT_MAP: Record<string, React.ComponentType<BlockComponentProps>> = {
  // Blocos básicos
  'TitleBlock': TitleBlock,
  'ImageBlock': ImageBlock,
  'FormInputBlock': FormInputBlock,
  'ButtonBlock': ButtonBlockModular,
  
  // Blocos de questões
  'QuestionTextBlock': QuestionTextBlock,
  'OptionsBlock': OptionsBlock,
  
  // Blocos de transição e resultado
  'TransitionBlock': TransitionBlock,
  'ResultBlock': ResultBlock,
  'OfferBlock': OfferBlock,
  
  // Aliases
  'title': TitleBlock,
  'image': ImageBlock,
  'form-input': FormInputBlock,
  'button': ButtonBlockModular,
  'question-text': QuestionTextBlock,
  'options': OptionsBlock,
  'transition': TransitionBlock,
  'result': ResultBlock,
  'offer': OfferBlock,
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
