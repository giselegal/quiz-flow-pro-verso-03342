import React from 'react';
import { Users, Circle, Calculator, ArrowRight, Trophy, Gift } from 'lucide-react';

export type StepCategory = 'intro' | 'questions' | 'strategic' | 'transitions' | 'result' | 'offer';
export type StepType = 'form' | 'question' | 'transition' | 'result' | 'offer';

export const getStepCategory = (step: number): StepCategory => {
  if (step === 1) return 'intro';
  if (step >= 2 && step <= 11) return 'questions';
  if (step >= 12 && step <= 13) return 'transitions';
  if (step >= 14 && step <= 18) return 'strategic';
  if (step === 19) return 'transitions';
  if (step === 20) return 'result';
  if (step === 21) return 'offer';
  return 'questions';
};

export const getStepType = (step: number): StepType => {
  if (step === 1) return 'form';
  if (step === 12 || step === 19) return 'transition';
  if (step === 20) return 'result';
  if (step === 21) return 'offer';
  return 'question';
};

export const getStepTitle = (step: number): string => {
  if (step === 1) return 'Introdução';
  if (step >= 2 && step <= 11) return `Questão ${step - 1}`;
  if (step === 12) return 'Transição Principal';
  if (step >= 13 && step <= 18) return `Estratégica ${step - 12}`;
  if (step === 19) return 'Calculando Resultado';
  if (step === 20) return 'Resultado Final';
  if (step === 21) return 'Oferta Final';
  return `Etapa ${step}`;
};

export const getStepDescription = (step: number): string => {
  if (step === 1) return 'Coleta nome e apresentação';
  if (step >= 2 && step <= 11) return 'Questões de personalidade';
  if (step === 12) return 'Ponte entre seções';
  if (step >= 13 && step <= 18) return 'Questões estratégicas';
  if (step === 19) return 'Processamento de dados';
  if (step === 20) return 'Exibição do resultado';
  if (step === 21) return 'Call to action final';
  return 'Etapa do quiz';
};

export const getStepIcon = (step: number): React.ComponentType<any> => {
  const category = getStepCategory(step);
  switch (category) {
    case 'intro':
      return Users;
    case 'questions':
      return Circle;
    case 'strategic':
      return Calculator;
    case 'transitions':
      return ArrowRight;
    case 'result':
      return Trophy;
    case 'offer':
      return Gift;
    default:
      return Circle;
  }
};

export interface StepMetaSummary {
  step: number;
  category: StepCategory;
  type: StepType;
  title: string;
  description: string;
  Icon: React.ComponentType<any>;
}

export const buildStepMeta = (step: number): StepMetaSummary => ({
  step,
  category: getStepCategory(step),
  type: getStepType(step),
  title: getStepTitle(step),
  description: getStepDescription(step),
  Icon: getStepIcon(step),
});

export const ALL_STEP_META: StepMetaSummary[] = Array.from({ length: 21 }, (_, i) => buildStepMeta(i + 1));
