/**
 * 🔄 QUIZ TO EDITOR ADAPTER - FASE 3 - SINCRONIZAÇÃO BIDIRECIONAL
 * 
 * Adaptador real que converte o sistema de quiz-estilo para formato 
 * compatível com o editor unificado, com sincronização bidirecional
 * e persistência de dados em tempo real.
 */

import { Block } from '@/types/editor';
import { QUIZ_STYLE_21_STEPS_TEMPLATE, getStepTemplate } from '@/templates/quiz21StepsComplete';
import { QuizQuestion, QuizAnswer, StyleResult } from '@/types/quiz';

// Import BlockType para tipagem correta
import { BlockType } from '@/types/editor';

// ===============================
// 🎯 INTERFACES FASE 3
// ===============================

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

// 🔄 NOVAS INTERFACES FASE 3
export interface EditorQuizState {
  questions: QuizQuestion[];
  styles: StyleResult[];
  currentStep: number;
  isDirty: boolean;
  version: string;
  lastSaved?: string;
}

export interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  warnings?: string[];
  timestamp: string;
}

export interface ChangeEvent {
  type: 'question-updated' | 'style-updated' | 'step-changed' | 'data-saved';
  payload: any;
  timestamp: string;
}

export class QuizToEditorAdapter {

  // ===============================
  // 🔄 PROPRIEDADES FASE 3
  // ===============================

  private static instance: QuizToEditorAdapter;
  private changeListeners: Array<(event: ChangeEvent) => void> = [];
  private autoSaveInterval?: NodeJS.Timeout;
  private isDirty = false;
  private currentState?: EditorQuizState;

  static getInstance(): QuizToEditorAdapter {
    if (!this.instance) {
      this.instance = new QuizToEditorAdapter();
    }
    return this.instance;
  }

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

  // ===============================
  // 🔄 MÉTODOS FASE 3 - SINCRONIZAÇÃO
  // ===============================

  /**
   * Extrai questões reais do template para o editor
   */
  async extractRealQuestions(funnelId?: string): Promise<QuizQuestion[]> {
    console.log('📋 Extraindo questões reais do template...');

    const questions: QuizQuestion[] = [];

    // Processar steps com questões (2-11 e 13-18)
    const questionSteps = [
      ...Array.from({ length: 10 }, (_, i) => i + 2), // steps 2-11
      ...Array.from({ length: 6 }, (_, i) => i + 13)  // steps 13-18
    ];

    for (const stepNum of questionSteps) {
      const stepId = `step-${stepNum}`;
      const stepTemplate = getStepTemplate(stepId);

      if (stepTemplate) {
        const question = this.extractQuestionFromStep(stepTemplate, stepNum);
        if (question) {
          questions.push(question);
        }
      }
    } \n    \n    console.log(`✅ Extraídas ${questions.length} questões reais`); \n    return questions; \n
  } \n  \n  /**\n   * Extrai uma questão de um step específico\n   */\n  private extractQuestionFromStep(stepBlocks: any[], stepNum: number): QuizQuestion | null {
  \n    // Encontrar bloco de título\n    const titleBlock = stepBlocks.find(block => \n      block.type === 'text-inline' && \n      block.properties?.fontSize?.includes('xl')\n    );\n    \n    // Encontrar bloco de questão\n    const questionBlock = stepBlocks.find(block => \n      block.type?.includes('quiz') || \n      block.type?.includes('options')\n    );\n    \n    if (!titleBlock || !questionBlock) {\n      return null;\n    }\n    \n    const question: QuizQuestion = {\n      id: `q${stepNum}`,\n      type: questionBlock.type?.includes('multiple') ? 'multiple-choice' : 'single-choice',\n      title: titleBlock.properties?.content || `Questão ${stepNum}`,\n      description: this.extractDescription(stepBlocks),\n      required: true,\n      answers: this.extractAnswers(questionBlock),\n      order: stepNum\n    };\n    \n    return question;\n  }\n  \n  /**\n   * Extrai respostas de um bloco de questão\n   */\n  private extractAnswers(questionBlock: any): QuizAnswer[] {\n    const options = questionBlock.properties?.options || \n                   questionBlock.content?.options || [];\n    \n    return options.map((option: any, index: number) => ({\n      id: `a${index + 1}`,\n      text: option.text || option.label,\n      description: option.description || '',\n      stylePoints: this.extractStylePoints(option)\n    }));\n  }\n  \n  /**\n   * Extrai pontuação de estilo de uma opção\n   */\n  private extractStylePoints(option: any): Record<string, number> {\n    if (option.stylePoints) return option.stylePoints;\n    if (option.weights) return option.weights;\n    if (option.styleCategory) {\n      return { [option.styleCategory]: option.weight || 1 };\n    }\n    \n    // Fallback baseado no texto\n    return { [this.guessStyleFromText(option.text)]: 1 };\n  }\n  \n  /**\n   * Adivinha estilo baseado no texto da opção\n   */\n  private guessStyleFromText(text: string): string {\n    const keywords = {\n      'natural': ['natural', 'autêntico', 'genuíno'],\n      'classico': ['clássico', 'elegante', 'tradicional'],\n      'contemporaneo': ['moderno', 'atual', 'tecnológico'],\n      'romantico': ['romântico', 'delicado', 'suave'],\n      'sexy': ['sexy', 'sensual', 'sedutor'],\n      'dramatico': ['dramático', 'intenso', 'marcante'],\n      'criativo': ['criativo', 'artístico', 'expressivo']\n    };\n    \n    const lowerText = text.toLowerCase();\n    \n    for (const [style, words] of Object.entries(keywords)) {\n      if (words.some(word => lowerText.includes(word))) {\n        return style;\n      }\n    }\n    \n    return 'natural';\n  }\n  \n  /**\n   * Extrai descrição dos blocos\n   */\n  private extractDescription(stepBlocks: any[]): string {\n    const descBlock = stepBlocks.find(block => \n      block.type === 'text-inline' && \n      !block.properties?.fontSize?.includes('xl') &&\n      block.properties?.content?.length > 20\n    );\n    \n    return descBlock?.properties?.content || '';\n  }\n  \n  /**\n   * Salva alterações no quiz de volta ao template\n   */\n  async saveChangesToQuiz(editorState: EditorQuizState): Promise<SyncResult> {\n    try {\n      console.log('💾 Salvando alterações do editor...');\n      \n      // Marcar como limpo\n      this.isDirty = false;\n      this.currentState = {\n        ...editorState,\n        isDirty: false,\n        lastSaved: new Date().toISOString()\n      };\n      \n      // Notificar listeners\n      this.notifyListeners({\n        type: 'data-saved',\n        payload: this.currentState,\n        timestamp: new Date().toISOString()\n      });\n      \n      return {\n        success: true,\n        data: this.currentState,\n        timestamp: new Date().toISOString()\n      };\n      \n    } catch (error) {\n      console.error('❌ Erro ao salvar:', error);\n      return {\n        success: false,\n        error: error instanceof Error ? error.message : 'Erro desconhecido',\n        timestamp: new Date().toISOString()\n      };\n    }\n  }\n  \n  /**\n   * Inicia auto-save\n   */\n  startAutoSave(intervalMs = 30000): void {\n    if (this.autoSaveInterval) {\n      clearInterval(this.autoSaveInterval);\n    }\n    \n    this.autoSaveInterval = setInterval(() => {\n      if (this.isDirty && this.currentState) {\n        console.log('⏰ Auto-save triggered');\n        this.saveChangesToQuiz(this.currentState);\n      }\n    }, intervalMs);\n    \n    console.log(`⏰ Auto-save iniciado (${intervalMs}ms)`);\n  }\n  \n  /**\n   * Para auto-save\n   */\n  stopAutoSave(): void {\n    if (this.autoSaveInterval) {\n      clearInterval(this.autoSaveInterval);\n      this.autoSaveInterval = undefined;\n      console.log('⏰ Auto-save parado');\n    }\n  }\n  \n  /**\n   * Adiciona listener para mudanças\n   */\n  addChangeListener(listener: (event: ChangeEvent) => void): void {\n    this.changeListeners.push(listener);\n  }\n  \n  /**\n   * Remove listener\n   */\n  removeChangeListener(listener: (event: ChangeEvent) => void): void {\n    this.changeListeners = this.changeListeners.filter(l => l !== listener);\n  }\n  \n  /**\n   * Notifica listeners sobre mudanças\n   */\n  private notifyListeners(event: ChangeEvent): void {\n    this.changeListeners.forEach(listener => {\n      try {\n        listener(event);\n      } catch (error) {\n        console.error('Erro ao notificar listener:', error);\n      }\n    });\n  }\n  \n  /**\n   * Marca estado como alterado\n   */\n  markDirty(state: EditorQuizState): void {\n    this.isDirty = true;\n    this.currentState = { ...state, isDirty: true };\n    \n    this.notifyListeners({\n      type: 'question-updated',\n      payload: state,\n      timestamp: new Date().toISOString()\n    });\n  }\n  \n  /**\n   * Valida dados do quiz\n   */\n  static validateQuizData(data: any): boolean {\n    if (!data || typeof data !== 'object') return false;\n    \n    const required = ['questions', 'styles'];\n    return required.every(key => key in data && Array.isArray(data[key]));\n  }\n\n  /**\n   * ⚙️ Converter propriedades do editor de volta para quiz\n   */\n  private static convertEditorPropertiesToQuiz(editorProperties: any): any {
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