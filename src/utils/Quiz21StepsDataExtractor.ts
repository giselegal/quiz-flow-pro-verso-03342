/**
 * 🔄 QUIZ 21 STEPS DATA EXTRACTOR - FIXED VERSION
 * 
 * Extrai dados dos templates de 21 etapas com tipagem correta
 */

export interface QuizStep {
  id: string;
  title: string;
  blocks: any[];
}

export interface QuizConfig {
  config: {
    globalConfig: {
      theme: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
      };
      navigation: {
        allowBack: boolean;
        showProgress: boolean;
      };
      analytics: {
        enabled: boolean;
        trackingId: string;
      };
    };
    seo: any;
    tracking: any;
  };
  steps: QuizStep[];
  [key: string]: any; // Index signature to allow dynamic access
}

export class Quiz21StepsDataExtractor {
  /**
   * Extrai dados de um template específico
   */
  static extractFromTemplate(templateData: QuizConfig): {
    steps: QuizStep[];
    totalSteps: number;
    config: any;
  } {
    try {
      const { config, steps } = templateData;
      
      // Processar steps com tipagem segura
      const processedSteps = (steps || []).map((step: any, index: number) => ({
        id: step.id || `step-${index + 1}`,
        title: step.title || `Etapa ${index + 1}`,
        blocks: (step.blocks || []).map((block: any) => ({
          ...block,
          id: block.id || `block-${Date.now()}-${Math.random()}`
        }))
      }));

      return {
        steps: processedSteps,
        totalSteps: processedSteps.length,
        config: config || {}
      };
    } catch (error) {
      console.error('❌ Erro ao extrair dados do template:', error);
      
      // Fallback seguro
      return {
        steps: Array.from({ length: 21 }, (_, i) => ({
          id: `step-${i + 1}`,
          title: `Etapa ${i + 1}`,
          blocks: []
        })),
        totalSteps: 21,
        config: {}
      };
    }
  }

  /**
   * Converte para formato de blocos por step
   */
  static convertToStepBlocks(templateData: QuizConfig): Record<string, any[]> {
    const { steps } = this.extractFromTemplate(templateData);
    const stepBlocks: Record<string, any[]> = {};

    steps.forEach((step: QuizStep) => {
      stepBlocks[step.id] = step.blocks || [];
    });

    return stepBlocks;
  }

  /**
   * Valida se os dados do template estão corretos
   */
  static validateTemplate(templateData: any): boolean {
    try {
      return !!(
        templateData &&
        typeof templateData === 'object' &&
        Array.isArray(templateData.steps) &&
        templateData.config &&
        typeof templateData.config === 'object'
      );
    } catch {
      return false;
    }
  }
}