/**
 * 🏆 RESULT STEP ADAPTER
 * 
 * Adaptador para isolar ResultStep de produção do editor.
 * Este é especialmente importante pois ResultStep tem 480 linhas 
 * de lógica complexa de cálculo de resultados.
 */

import React from 'react';
import { createAdapter } from './ComponentAdapterRegistry';
import type { EditorStep } from '../types/EditorStepTypes';
import ResultStep from '../../quiz/ResultStep';

// 🎯 Props do componente de produção
interface ResultStepProps {
  data: any;
  quizAnswers: Record<string, string[]>;
  onResult: (result: any) => void;
  onRestart: () => void;
}

// 🔧 Adaptador para ResultStep
export const resultStepAdapter = createAdapter<ResultStepProps>({
  type: 'result',
  component: ResultStep,
  
  // 🔄 Transformar dados do editor para props de produção
  transformProps: (step: EditorStep) => ({
    data: step.data,
    quizAnswers: {}, // Mock de respostas para preview
    onResult: () => {},
    onRestart: () => {}
  }),
  
  // 🎭 Mocks para callbacks de produção
  mockCallbacks: (step: EditorStep) => ({
    onResult: (result: any) => {
      console.log(`[EDITOR MOCK] ResultStep.onResult called with:`, result);
      // Simular cálculo de resultado sem efeitos colaterais
    },
    onRestart: () => {
      console.log(`[EDITOR MOCK] ResultStep.onRestart called`);
      // Simular reinício do quiz
    }
  }),
  
  // ✅ Validação específica do tipo
  validateProps: (step: EditorStep) => {
    const errors: string[] = [];
    
    if (!step.data.title) {
      errors.push('Título do resultado é obrigatório');
    }
    
    if (!step.data.description) {
      errors.push('Descrição do resultado é obrigatória');
    }
    
    if (!step.data.resultTypes || step.data.resultTypes.length === 0) {
      errors.push('Pelo menos um tipo de resultado deve ser definido');
    }
    
    // Validar cada tipo de resultado
    if (step.data.resultTypes) {
      step.data.resultTypes.forEach((resultType: any, index: number) => {
        if (!resultType.title) {
          errors.push(`Tipo de resultado ${index + 1}: Título é obrigatório`);
        }
        if (!resultType.description) {
          errors.push(`Tipo de resultado ${index + 1}: Descrição é obrigatória`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // 📤 Extrair dados para produção
  extractData: (props: ResultStepProps) => ({
    title: props.data.title,
    description: props.data.description,
    resultTypes: props.data.resultTypes,
    calculationMethod: props.data.calculationMethod || 'score',
    showRestart: props.data.showRestart || true,
    showShare: props.data.showShare || false
  })
});