/**
 * 🎯 QUIZ TO EDITOR ADAPTER - FASE 1
 * 
 * Adaptador que converte o sistema de quiz-estilo para formato 
 * compatível com o editor unificado, preservando toda a lógica
 * de negócio e funcionalidades do quiz original.
 */

import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getStepTemplate } from '@/templates/quiz21StepsComplete';

// Import BlockType para tipagem correta
import { BlockType } from '@/types/editor';

interface QuizStepData {
  type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'result' | 'offer';
  stepNumber: number;
  blocks: any[];
  metadata?: any;
}

interface EditorCompatibleData {
  stepBlocks: Record<string, Block[]>;
  totalSteps: number;
  quizMetadata: {
    styles: string[];
    scoringSystem: any;
    strategicQuestions: any[];
  };
}

export class QuizToEditorAdapter {
  
  /**
   * 🔄 MÉTODO PRINCIPAL: Converter quiz completo para editor
   */
  static async convertQuizToEditor(funnelId?: string): Promise<EditorCompatibleData> {
    console.log('🎯 Iniciando conversão Quiz → Editor', { funnelId });
    
    const stepBlocks: Record<string, Block[]> = {};
    const totalSteps = 21;
    
    // Converter cada etapa do quiz
    for (let stepNum = 1; stepNum <= totalSteps; stepNum++) {
      const stepId = `step-${stepNum}`;
      const stepTemplate = getStepTemplate(stepId);
      
      if (stepTemplate && Array.isArray(stepTemplate)) {
        stepBlocks[stepId] = this.convertStepToBlocks(stepTemplate, stepNum, funnelId);
      }
    }
    
    // Extrair metadados do quiz
    const quizMetadata = this.extractQuizMetadata();
    
    console.log(`✅ Conversão completa: ${Object.keys(stepBlocks).length} etapas convertidas`);
    
    return {
      stepBlocks,
      totalSteps,
      quizMetadata
    };
  }

  /**
   * 🧩 Converter uma etapa específica para blocos do editor
   */
  private static convertStepToBlocks(stepTemplate: any[], stepNumber: number, funnelId?: string): Block[] {
    if (!Array.isArray(stepTemplate)) {
      console.warn(`⚠️ Template da etapa ${stepNumber} não é um array`);
      return [];
    }

    return stepTemplate.map((quizBlock, index) => {
      const editorBlock: Block = {
        id: `${funnelId ? `${funnelId}-` : ''}step-${stepNumber}-block-${index + 1}`,
        type: this.mapQuizTypeToEditorType(quizBlock.type) as BlockType,
        order: index + 1,
        properties: this.convertQuizPropertiesToEditor(quizBlock, stepNumber) || {},
        content: quizBlock.content || {},
      };

      // Preservar dados específicos do quiz
      if (quizBlock.quizData && editorBlock.properties) {
        editorBlock.properties.quizData = quizBlock.quizData;
      }

      return editorBlock;
    });
  }

  /**
   * 🎨 Mapear tipos do quiz para tipos do editor
   */
  private static mapQuizTypeToEditorType(quizType: string): string {
    const typeMap: Record<string, string> = {
      // Headers e textos
      'quiz-intro-header': 'text-inline',
      'quiz-progress-header': 'progress-bar',
      'quiz-question-header': 'text-inline',
      
      // Componentes interativos
      'options-grid': 'quiz-options-grid',
      'strategic-options': 'quiz-strategic-options',
      'quiz-navigation': 'quiz-navigation-buttons',
      
      // Resultados e ofertas
      'quiz-result-display': 'quiz-result-component',
      'offer-section': 'offer-component',
      'cta-button': 'button-component',
      
      // Elementos visuais
      'image-display': 'image-component',
      'background-section': 'background-component',
      
      // Fallback
      'text-inline': 'text-inline'
    };

    return typeMap[quizType] || quizType;
  }

  /**
   * ⚙️ Converter propriedades do quiz para formato do editor
   */
  private static convertQuizPropertiesToEditor(quizBlock: any, stepNumber: number): any {
    const baseProperties = {
      ...quizBlock.properties,
      stepNumber,
      isQuizComponent: true,
      originalType: quizBlock.type
    };

    // Preservar configurações específicas baseadas no tipo
    switch (quizBlock.type) {
      case 'options-grid':
        return {
          ...baseProperties,
          options: quizBlock.options || [],
          selectionMode: quizBlock.selectionMode || 'multiple',
          maxSelections: quizBlock.maxSelections || 3,
          scoringData: quizBlock.scoring || {}
        };

      case 'strategic-options':
        return {
          ...baseProperties,
          strategicType: quizBlock.strategicType || 'single',
          offers: quizBlock.offers || [],
          triggerLogic: quizBlock.triggerLogic || {}
        };

      case 'quiz-result-display':
        return {
          ...baseProperties,
          resultCalculation: quizBlock.resultCalculation || {},
          styleMapping: quizBlock.styleMapping || {},
          dynamicContent: quizBlock.dynamicContent || true
        };

      default:
        return baseProperties;
    }
  }

  /**
   * 📊 Extrair metadados do sistema de quiz
   */
  private static extractQuizMetadata() {
    return {
      styles: [
        'Natural', 'Clássico', 'Contemporâneo', 'Elegante', 
        'Romântico', 'Sexy', 'Dramático', 'Criativo'
      ],
      scoringSystem: {
        questionSteps: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        strategicSteps: [13, 14, 15, 16, 17, 18],
        resultStep: 20,
        offerStep: 21
      },
      strategicQuestions: [
        { step: 13, type: 'budget', offers: ['basic', 'premium'] },
        { step: 14, type: 'timeline', offers: ['immediate', 'planned'] },
        { step: 15, type: 'experience', offers: ['beginner', 'advanced'] },
        { step: 16, type: 'goals', offers: ['personal', 'professional'] },
        { step: 17, type: 'investment', offers: ['conservative', 'aggressive'] },
        { step: 18, type: 'support', offers: ['self-service', 'guided'] }
      ]
    };
  }

  /**
   * 🔄 MÉTODO REVERSO: Converter editor de volta para quiz
   */
  static async convertEditorToQuiz(stepBlocks: Record<string, Block[]>): Promise<any> {
    console.log('🔄 Convertendo Editor → Quiz');
    
    const quizTemplate: Record<string, any[]> = {};
    
    Object.entries(stepBlocks).forEach(([stepId, blocks]) => {
      quizTemplate[stepId] = blocks.map(block => ({
        id: block.id,
        type: this.mapEditorTypeToQuizType(block.type),
        properties: this.convertEditorPropertiesToQuiz(block.properties),
        content: block.content,
        order: block.order,
        // Preservar dados específicos do quiz
        ...(block.properties?.quizData && { quizData: block.properties.quizData })
      }));
    });
    
    return quizTemplate;
  }

  /**
   * 🎨 Mapear tipos do editor de volta para quiz
   */
  private static mapEditorTypeToQuizType(editorType: string): string {
    const reverseMap: Record<string, string> = {
      'quiz-options-grid': 'options-grid',
      'quiz-strategic-options': 'strategic-options',
      'quiz-navigation-buttons': 'quiz-navigation',
      'quiz-result-component': 'quiz-result-display',
      'offer-component': 'offer-section',
      'button-component': 'cta-button',
      'image-component': 'image-display',
      'background-component': 'background-section'
    };

    return reverseMap[editorType] || editorType;
  }

  /**
   * ⚙️ Converter propriedades do editor de volta para quiz
   */
  private static convertEditorPropertiesToQuiz(editorProperties: any): any {
    const { stepNumber, isQuizComponent, originalType, ...quizProperties } = editorProperties;
    return quizProperties;
  }

  /**
   * 🎯 Obter configuração específica para uma etapa
   */
  static async getStepConfiguration(stepNumber: number): Promise<QuizStepData | null> {
    const stepId = `step-${stepNumber}`;
    const template = getStepTemplate(stepId);
    
    if (!template) return null;

    // Determinar tipo da etapa baseado no número
    let type: QuizStepData['type'];
    if (stepNumber === 1) type = 'intro';
    else if (stepNumber >= 2 && stepNumber <= 11) type = 'question';
    else if (stepNumber === 12 || stepNumber === 19) type = 'transition';
    else if (stepNumber >= 13 && stepNumber <= 18) type = 'strategic-question';
    else if (stepNumber === 20) type = 'result';
    else if (stepNumber === 21) type = 'offer';
    else type = 'question';

    return {
      type,
      stepNumber,
      blocks: template,
      metadata: {
        isQuizStep: true,
        originalQuizStep: stepNumber
      }
    };
  }

  /**
   * 🧪 Validar compatibilidade dos dados
   */
  static validateQuizData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    const requiredKeys = ['stepBlocks', 'totalSteps', 'quizMetadata'];
    return requiredKeys.every(key => key in data);
  }
}

export default QuizToEditorAdapter;