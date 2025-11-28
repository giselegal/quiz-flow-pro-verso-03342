/**
 * Type definitions for Quiz de Estilo Pessoal - 21 Etapas
 * Auto-generated from modular template build
 * 
 * @version 4.0.0
 * @generated 2025-11-28T01:39:37.278Z
 */

export interface Quiz21StepsTemplate {
  templateId: 'quiz21StepsComplete';
  name: 'Quiz de Estilo Pessoal - 21 Etapas';
  version: '4.0.0';
  steps: {
    'step-01': StepDefinition;
    'step-02': StepDefinition;
    'step-03': StepDefinition;
    'step-04': StepDefinition;
    'step-05': StepDefinition;
    'step-06': StepDefinition;
    'step-07': StepDefinition;
    'step-08': StepDefinition;
    'step-09': StepDefinition;
    'step-10': StepDefinition;
    'step-11': StepDefinition;
    'step-12': StepDefinition;
    'step-13': StepDefinition;
    'step-14': StepDefinition;
    'step-15': StepDefinition;
    'step-16': StepDefinition;
    'step-17': StepDefinition;
    'step-18': StepDefinition;
    'step-19': StepDefinition;
    'step-20': StepDefinition;
    'step-21': StepDefinition;
  };
}

export interface StepDefinition {
  templateVersion: string;
  metadata: StepMetadata;
  blocks: BlockDefinition[];
  navigation?: NavigationConfig;
}

export interface StepMetadata {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
}

export interface BlockDefinition {
  id: string;
  type: string;
  order?: number;
  content?: any;
  properties?: any;
  style?: any;
}

export interface NavigationConfig {
  nextButton?: string;
  prevButton?: string;
  skipButton?: boolean;
}

export const quiz21StepsTemplate: Quiz21StepsTemplate;
