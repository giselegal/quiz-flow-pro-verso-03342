// 📊 QUIZ DATA SERVICE
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

export class QuizDataService {
  /**
   * Buscar dados de uma etapa específica
   */
  static getStepData(stepNumber: number) {
    const stepKey = `step-${stepNumber}`;
    return QUIZ_STYLE_21_STEPS_TEMPLATE[stepKey] || [];
  }

  /**
   * Buscar todas as etapas
   */
  static getAllSteps() {
    return QUIZ_STYLE_21_STEPS_TEMPLATE;
  }

  /**
   * Obter configuração de uma etapa
   */
  static getStepConfig(stepNumber: number) {
    const blocks = this.getStepData(stepNumber);

    return {
      stepNumber,
      totalBlocks: blocks.length,
      hasForm: blocks.some(b => b.type === 'form-container'),
      hasQuestion: blocks.some(b => b.type === 'options-grid'),
      hasTransition: blocks.some(b => b.type === 'hero'),
      blockTypes: [...new Set(blocks.map(b => b.type))],
    };
  }

  /**
   * Validar estrutura de uma etapa
   */
  static validateStep(stepNumber: number) {
    const blocks = this.getStepData(stepNumber);

    return {
      isValid: blocks.length > 0,
      hasContent: blocks.some(b => b.content && Object.keys(b.content).length > 0),
      hasProperties: blocks.some(b => b.properties && Object.keys(b.properties).length > 0),
      errors: [],
    };
  }
}
