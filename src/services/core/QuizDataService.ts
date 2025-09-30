// 📊 QUIZ DATA SERVICE
import { quizLegacyTemplateAdapter } from '@/services/legacy/QuizLegacyTemplateAdapter';

export class QuizDataService {
  /**
   * Buscar dados de uma etapa específica
   */
  static async getStepData(stepNumber: number) {
    const stepKey = `step-${stepNumber}`;
    return quizLegacyTemplateAdapter.getStep(stepKey);
  }

  /**
   * Buscar todas as etapas
   */
  static async getAllSteps() {
    return quizLegacyTemplateAdapter.getAll();
  }

  /**
   * Obter configuração de uma etapa
   */
  static async getStepConfig(stepNumber: number) {
    const blocks = await this.getStepData(stepNumber);

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
  static async validateStep(stepNumber: number) {
    const blocks = await this.getStepData(stepNumber);

    return {
      isValid: blocks.length > 0,
      hasContent: blocks.some(b => b.content && Object.keys(b.content).length > 0),
      hasProperties: blocks.some(b => b.properties && Object.keys(b.properties).length > 0),
      errors: [],
    };
  }
}
