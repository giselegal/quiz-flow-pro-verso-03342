// ✅ CONFIGURAÇÃO LIMPA DAS 21 ETAPAS SEM DUPLICAÇÃO
// Arquivo criado para resolver problemas de etapas repetidas no editor
// Integração com configuração completa e avançada + templates JSON

import {
  ADVANCED_21_STEPS,
  COMPLETE_21_STEPS_CONFIG,
  getStepConfig,
  getStepsStatistics,
  type AdvancedStepConfig,
} from "./complete21StepsConfig";

// 🎯 INTEGRAÇÃO COM TEMPLATES JSON
import { getTemplateByStep } from "./stepTemplatesMapping";

export interface CleanStepConfig {
  stepNumber: number;
  id: string;
  name: string;
  description: string;
  type: "intro" | "question" | "transition" | "processing" | "result" | "lead" | "offer";
  category: "start" | "questions" | "strategic" | "results" | "conversion";
  // 🎯 NOVOS CAMPOS PARA JSON INTEGRATION
  hasJsonTemplate?: boolean;
  templateFunction?: () => any[];
  components?: string[];
}

// 🎯 CONFIGURAÇÃO DAS 21 ETAPAS ÚNICAS COM TEMPLATES JSON
// Baseada na configuração avançada + mapeamento de templates JSON
export const CLEAN_21_STEPS: CleanStepConfig[] = ADVANCED_21_STEPS.map(step => {
  const template = getTemplateByStep(step.stepNumber);

  return {
    stepNumber: step.stepNumber,
    id: step.id,
    name: step.name,
    description: step.description,
    type: step.type,
    category: step.category,
    // 🎯 INTEGRAÇÃO JSON
    hasJsonTemplate: !!template,
    templateFunction: template?.templateFunction,
    components: template ? [`${step.id}-template`] : undefined,
  };
});

// 🔄 EXPORTAÇÃO DAS CONFIGURAÇÕES AVANÇADAS PARA COMPATIBILIDADE
export {
  ADVANCED_21_STEPS,
  COMPLETE_21_STEPS_CONFIG,
  getStepConfig,
  getStepsStatistics,
  type AdvancedStepConfig,
};

// 📊 UTILITÁRIOS PARA ANÁLISE DAS ETAPAS (MANTIDOS PARA COMPATIBILIDADE)
export const getStepsByCategory = (category: string) => {
  return CLEAN_21_STEPS.filter(step => step.category === category);
};

export const getStepById = (id: string) => {
  return CLEAN_21_STEPS.find(step => step.id === id);
};

export const getStepByNumber = (stepNumber: number) => {
  return CLEAN_21_STEPS.find(step => step.stepNumber === stepNumber);
};

export const validateSteps = () => {
  const allSteps = CLEAN_21_STEPS;
  const stepNumbers = allSteps.map(s => s.stepNumber).sort((a, b) => a - b);
  const expectedNumbers = Array.from({ length: 21 }, (_, i) => i + 1);

  return {
    totalSteps: allSteps.length,
    isComplete: allSteps.length === 21,
    hasAllNumbers: JSON.stringify(stepNumbers) === JSON.stringify(expectedNumbers),
    statistics: getStepsStatistics(),
  };
};
