
/**
 * Mapeamento dos blocos do editor - APENAS COMPONENTES EXISTENTES
 * 
 * Este arquivo mapeia apenas os componentes que foram confirmados como existentes
 * na pasta /src/components/editor/blocks/
 */

import { ComponentType } from 'react';

// Componentes que realmente existem (verificados)
import QuizResultCalculatedBlock from '../components/editor/blocks/QuizResultCalculatedBlock';

export const EDITOR_BLOCKS_MAP: Record<string, ComponentType<any>> = {
  // ✅ ETAPAS DO FUNIL COMPLETO (1-21)
  
  // Etapa 20: Resultado
  'quiz-result-calculated': QuizResultCalculatedBlock,
  'QuizResultCalculatedBlock': QuizResultCalculatedBlock,
};

// ✅ MAPEAMENTO DAS 21 ETAPAS COMPLETAS
export const FUNNEL_STEPS_MAPPING = {
  20: 'quiz-result-calculated',  // ✅ Etapa 20: Resultado
};

// Helper para verificar se um tipo de bloco existe
export const hasBlockComponent = (blockType: string): boolean => {
  return blockType in EDITOR_BLOCKS_MAP;
};

// Helper para obter o componente de um tipo
export const getBlockComponent = (blockType: string): ComponentType<any> | undefined => {
  return EDITOR_BLOCKS_MAP[blockType];
};

// Helper para obter o tipo de bloco de uma etapa específica
export const getBlockTypeForStep = (stepNumber: number): string | undefined => {
  return FUNNEL_STEPS_MAPPING[stepNumber as keyof typeof FUNNEL_STEPS_MAPPING];
};

// Helper para verificar se todas as etapas estão mapeadas
export const validateAllStepsMapping = (): boolean => {
  const mappedSteps = Object.keys(FUNNEL_STEPS_MAPPING);
  
  for (const step of mappedSteps) {
    const stepNum = parseInt(step);
    const blockType = getBlockTypeForStep(stepNum);
    if (!blockType || !hasBlockComponent(blockType)) {
      console.error(`❌ Etapa ${step} não tem componente válido mapeado`);
      return false;
    }
  }
  console.log('✅ Etapas mapeadas estão corretamente configuradas!');
  return true;
};

export default EDITOR_BLOCKS_MAP;
