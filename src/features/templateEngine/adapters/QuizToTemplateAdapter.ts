/**
 * Adapter: QUIZ_STEPS → TemplateDraft
 * Converte estrutura legada de quiz para o formato do Template Engine
 */

import { nanoid } from 'nanoid';
import type { TemplateDraftShared, StageShared, ComponentSharedBase, StageType } from '@/shared/templateEngineTypes';

export interface QuizStep {
  id?: string;
  type: string;
  nextStep?: string;
  questionText?: string;
  questionNumber?: string;
  options?: Array<{ id: string; text: string; image?: string }>;
  title?: string;
  text?: string;
  blocks?: Array<{ id: string; type: string; config?: any }>;
  [key: string]: any;
}

export class QuizToTemplateAdapter {
  /**
   * Converte Record de QUIZ_STEPS ou array para TemplateDraft
   */
  static convert(
    quizSteps: Record<string, QuizStep> | QuizStep[],
    stepOrder: string[],
    meta: { name: string; slug: string; description?: string }
  ): TemplateDraftShared {
    const stages: StageShared[] = [];
    const components: Record<string, ComponentSharedBase> = {};
    
    // Converter para array se for Record
    const stepsArray = Array.isArray(quizSteps)
      ? quizSteps
      : stepOrder.map(id => ({ ...quizSteps[id], id }));

    stepsArray.forEach((step, index) => {
      const stageId = `stage-${step.id}`;
      const componentIds: string[] = [];

      // Criar componente baseado no tipo de step
      const component = this.createComponentFromStep(step);
      if (component) {
        components[component.id] = component;
        componentIds.push(component.id);
      }

      // Criar stage
      stages.push({
        id: stageId,
        type: this.mapStepTypeToStageType(step.type),
        order: index,
        enabled: true,
        componentIds,
      });
    });

    return {
      id: nanoid(),
      schemaVersion: '1.0.0',
      meta,
      stages,
      components,
      logic: {
        scoring: { mode: 'sum', weights: {} },
        branching: [],
      },
      outcomes: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      draftVersion: 1,
    };
  }

  private static createComponentFromStep(step: QuizStep): ComponentSharedBase | null {
    const baseId = `comp-${step.id}`;

    switch (step.type) {
      case 'intro':
        return {
          id: baseId,
          kind: 'hero',
          props: {
            title: step.title || 'Bem-vindo',
            text: step.text || '',
          },
        };

      case 'question':
        return {
          id: baseId,
          kind: 'question',
          props: {
            questionText: step.questionText || '',
            questionNumber: step.questionNumber || 1,
            options: step.options || [],
          },
        };

      case 'result':
        return {
          id: baseId,
          kind: 'result',
          props: {
            title: step.title || 'Resultado',
            text: step.text || '',
          },
        };

      case 'form':
        return {
          id: baseId,
          kind: 'form',
          props: {
            fields: step.blocks || [],
          },
        };

      default:
        return {
          id: baseId,
          kind: 'custom',
          props: { ...step },
        };
    }
  }

  private static mapStepTypeToStageType(stepType: string): StageType {
    const mapping: Record<string, StageType> = {
      intro: 'intro',
      question: 'question',
      result: 'result',
      form: 'custom',
      transition: 'transition',
      'strategic-question': 'question',
      'transition-result': 'transition',
      offer: 'custom',
    };
    return mapping[stepType] || 'custom';
  }
}
