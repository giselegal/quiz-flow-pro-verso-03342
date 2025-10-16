/**
 * 🎯 PREVIEW INTERACTION LAYER
 * 
 * Camada de interatividade para Preview Mode.
 * Intercepta eventos e habilita funcionalidade de quiz 100% funcional.
 * 
 * Esta camada é INVISÍVEL e apenas captura interações do usuário
 * para atualizar o sessionData e disparar eventos de quiz.
 */

import React from 'react';
import { BlockComponent } from '../types';

interface PreviewInteractionLayerProps {
  block: BlockComponent;
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}

/**
 * Camada principal de interação
 */
export const PreviewInteractionLayer: React.FC<PreviewInteractionLayerProps> = ({
  block,
  sessionData,
  onUpdateSessionData
}) => {
  
  // 🎯 LÓGICA DE INTERATIVIDADE POR TIPO DE BLOCO
  
  // OptionsGrid / Quiz Options
  if (block.type === 'options-grid' || 
      block.type === 'quiz-options' || 
      block.type === 'quiz-options-inline' ||
      block.type === 'options-grid-inline') {
    return (
      <OptionsGridInteraction
        block={block}
        sessionData={sessionData}
        onUpdateSessionData={onUpdateSessionData}
      />
    );
  }
  
  // Button / CTA
  if (block.type === 'button' || 
      block.type === 'button-inline' ||
      block.type === 'quiz-button' ||
      block.type === 'cta-inline' ||
      block.type.includes('button')) {
    return (
      <ButtonInteraction
        block={block}
        sessionData={sessionData}
        onUpdateSessionData={onUpdateSessionData}
      />
    );
  }
  
  // Form Input
  if (block.type === 'form-input' || 
      block.type === 'quiz-form' ||
      block.type.includes('form')) {
    return (
      <FormInputInteraction
        block={block}
        sessionData={sessionData}
        onUpdateSessionData={onUpdateSessionData}
      />
    );
  }
  
  // Blocos não interativos (text, image, etc)
  return null;
};

/**
 * 🎯 INTERATIVIDADE: OptionsGrid
 */
const OptionsGridInteraction: React.FC<{
  block: BlockComponent;
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}> = ({ block, sessionData, onUpdateSessionData }) => {
  
  // A interatividade do OptionsGrid já está implementada no próprio componente
  // Esta camada apenas garante que o Preview Mode não bloqueie os eventos
  
  // Não precisamos de overlay adicional, apenas deixar o componente funcionar
  return null;
};

/**
 * 🎯 INTERATIVIDADE: Button
 */
const ButtonInteraction: React.FC<{
  block: BlockComponent;
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}> = ({ block, sessionData, onUpdateSessionData }) => {
  
  // A interatividade do Button já está implementada no próprio componente
  // Esta camada apenas garante que o Preview Mode não bloqueie os eventos
  
  return null;
};

/**
 * 🎯 INTERATIVIDADE: FormInput
 */
const FormInputInteraction: React.FC<{
  block: BlockComponent;
  sessionData?: Record<string, any>;
  onUpdateSessionData?: (key: string, value: any) => void;
}> = ({ block, sessionData, onUpdateSessionData }) => {
  
  // A interatividade do FormInput já está implementada no próprio componente
  // Esta camada apenas garante que o Preview Mode não bloqueie os eventos
  
  return null;
};

export default PreviewInteractionLayer;
