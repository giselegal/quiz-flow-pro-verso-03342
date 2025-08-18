// @ts-nocheck
import { QuizComponentData, QuizComponentType } from '@/types/quizBuilder';
import { generateId } from './idGenerator';

export interface ComponentTemplate {
  type: QuizComponentType;
  data: Record<string, any>;
  style?: Record<string, any>;
}

export const createComponent = (
  template: ComponentTemplate,
  stageId: string,
  order: number
): QuizComponentData => {
  return {
    id: generateId(),
    type: template.type,
    order,
    stageId,
    data: template.data,
    style: template.style || {
      paddingY: '16',
      paddingX: '16',
      backgroundColor: '',
      textColor: '',
      borderRadius: 0,
    },
  };
};

export const createStandardQuizTemplate = () => {
  // To be implemented - will create a standard set of stages and components
  // for a quiz similar to the current implementation
};

export const createEmptyQuiz = () => {
  // To be implemented - will create a minimal quiz structure with just a cover and result page
};
