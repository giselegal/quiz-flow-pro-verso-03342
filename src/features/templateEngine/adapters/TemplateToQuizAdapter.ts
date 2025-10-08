/**
 * Adapter: TemplateDraft → QUIZ_STEPS
 * Converte formato do Template Engine de volta para estrutura legada de quiz
 */

import type { TemplateDraftShared, StageShared, ComponentSharedBase } from '@/shared/templateEngineTypes';
import type { QuizStep } from './QuizToTemplateAdapter';

export class TemplateToQuizAdapter {
  /**
   * Converte TemplateDraft de volta para array de QUIZ_STEPS
   */
  static convert(draft: TemplateDraftShared): QuizStep[] {
    const sortedStages = [...draft.stages].sort((a, b) => a.order - b.order);

    return sortedStages.map((stage, index) => {
      const component = stage.componentIds[0] 
        ? draft.components[stage.componentIds[0]] 
        : null;

      return this.createStepFromStage(stage, component, index);
    });
  }

  private static createStepFromStage(
    stage: StageShared,
    component: ComponentSharedBase | null,
    index: number
  ): QuizStep {
    const stepId = stage.id.replace('stage-', '');
    const kind = component?.kind || component?.type || 'custom';

    const baseStep: QuizStep = {
      id: stepId,
      type: this.mapStageTypeToStepType(stage.type),
    };

    if (!component) return baseStep;

    // Mapear props do componente de volta para step
    switch (kind) {
      case 'hero':
        return {
          ...baseStep,
          type: 'intro',
          title: component.props.title || '',
          text: component.props.text || '',
        };

      case 'question':
        return {
          ...baseStep,
          type: 'question',
          questionText: component.props.questionText || '',
          questionNumber: component.props.questionNumber || index + 1,
          options: component.props.options || [],
        };

      case 'result':
        return {
          ...baseStep,
          type: 'result',
          title: component.props.title || '',
          text: component.props.text || '',
        };

      case 'form':
        return {
          ...baseStep,
          type: 'form',
          blocks: component.props.fields || [],
        };

      default:
        return {
          ...baseStep,
          ...component.props,
        };
    }
  }

  private static mapStageTypeToStepType(stageType: string): string {
    const mapping: Record<string, string> = {
      intro: 'intro',
      question: 'question',
      result: 'result',
      custom: 'form',
      transition: 'transition',
    };
    return mapping[stageType] || 'custom';
  }
}
