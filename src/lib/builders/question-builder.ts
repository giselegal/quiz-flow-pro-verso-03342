/**
 * 🏗️ QUESTION BUILDER API
 * 
 * Helper functions para criar steps e blocks de forma programática.
 * Inspirado em Formbricks e SurveyJS.
 */

import { QuizStepSchemaZ, QuizBlockSchemaZ } from '@/schemas/quiz-schema.zod';
import { z } from 'zod';

type QuizStep = z.infer<typeof QuizStepSchemaZ>;
type QuizBlock = z.infer<typeof QuizBlockSchemaZ>;

/**
 * Builder para criar steps de question
 */
export class QuestionBuilder {
  private step: Partial<QuizStep>;
  private blockCounter: number = 0;

  constructor(id: string, order: number) {
    this.step = {
      id,
      order,
      type: 'question',
      blocks: [],
      navigation: {
        nextStep: null,
        conditions: []
      },
      validation: {
        required: false
      }
    };
  }

  /**
   * Adiciona barra de progresso
   */
  withProgress(stepNumber: number, totalSteps: number): this {
    const block: QuizBlock = {
      id: `${this.step.id}-progress`,
      type: 'question-progress',
      order: this.blockCounter++,
      properties: { padding: 8 },
      content: {
        stepNumber,
        totalSteps,
        showPercentage: true,
        barColor: '#B89B7A',
        backgroundColor: '#e5e7eb'
      },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Adiciona título da pergunta
   */
  withTitle(text: string, subtitle?: string): this {
    const block: QuizBlock = {
      id: `${this.step.id}-title`,
      type: 'question-title',
      order: this.blockCounter++,
      properties: {
        backgroundColor: 'transparent',
        padding: 16
      },
      content: {
        text,
        ...(subtitle && { subtitle })
      },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Adiciona texto explicativo
   */
  withInstruction(text: string): this {
    const block: QuizBlock = {
      id: `${this.step.id}-instruction`,
      type: 'text-inline',
      order: this.blockCounter++,
      properties: {
        fontSize: '14px',
        color: '#666',
        padding: 8
      },
      content: { text },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Adiciona grid de opções
   */
  withOptionsGrid(options: Array<{
    id: string;
    text: string;
    image?: string;
    scores?: Record<string, number>;
  }>, config?: {
    columns?: number;
    gap?: number;
    minSelections?: number;
    maxSelections?: number;
  }): this {
    const block: QuizBlock = {
      id: `${this.step.id}-options`,
      type: 'options-grid',
      order: this.blockCounter++,
      properties: {
        backgroundColor: 'transparent',
        padding: 16,
        columns: config?.columns || 2,
        gap: config?.gap || 16
      },
      content: {
        options,
        columns: config?.columns || 2,
        multipleSelection: true,
        minSelections: config?.minSelections || 3,
        maxSelections: config?.maxSelections || 3,
        showImages: true
      },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Adiciona campo de input
   */
  withInput(placeholder: string, label?: string): this {
    const block: QuizBlock = {
      id: `${this.step.id}-input`,
      type: 'form-input',
      order: this.blockCounter++,
      properties: {
        padding: 16
      },
      content: {
        placeholder,
        ...(label && { label })
      },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Adiciona navegação (botões voltar/avançar)
   */
  withNavigation(config?: {
    showBack?: boolean;
    showNext?: boolean;
    backLabel?: string;
    nextLabel?: string;
  }): this {
    const block: QuizBlock = {
      id: `${this.step.id}-navigation`,
      type: 'question-navigation',
      order: this.blockCounter++,
      properties: {
        showBack: config?.showBack ?? true,
        showNext: config?.showNext ?? true,
        padding: 16
      },
      content: {
        backLabel: config?.backLabel || 'Voltar',
        nextLabel: config?.nextLabel || 'Avançar',
        backVariant: 'outline',
        nextVariant: 'default'
      },
      parentId: null
    };
    this.step.blocks!.push(block);
    return this;
  }

  /**
   * Define regras de validação
   */
  withValidation(required: boolean = true, min?: number, max?: number): this {
    this.step.validation = {
      required,
      ...(min || max ? {
        rules: {
          selectedOptions: {
            ...(min && { minItems: min }),
            ...(max && { maxItems: max }),
            errorMessage: min === max 
              ? `Selecione exatamente ${min} opções`
              : `Selecione entre ${min || 0} e ${max || 'infinitas'} opções`
          }
        }
      } : {})
    };
    return this;
  }

  /**
   * Define navegação para próximo step
   */
  goTo(nextStepId: string): this {
    this.step.navigation!.nextStep = nextStepId;
    return this;
  }

  /**
   * Adiciona condição de navegação
   */
  withCondition(condition: any): this {
    this.step.navigation!.conditions!.push(condition);
    return this;
  }

  /**
   * Constrói e retorna o step
   */
  build(): QuizStep {
    // Validar com Zod
    return QuizStepSchemaZ.parse(this.step) as QuizStep;
  }
}

/**
 * Builder para steps de introdução
 */
export class IntroBuilder extends QuestionBuilder {
  constructor(id: string, order: number) {
    super(id, order);
    (this as any).step.type = 'intro';
  }
}

/**
 * Builder para steps de transição
 */
export class TransitionBuilder extends QuestionBuilder {
  constructor(id: string, order: number) {
    super(id, order);
    (this as any).step.type = 'transition';
  }
}

/**
 * Builder para steps de resultado
 */
export class ResultBuilder extends QuestionBuilder {
  constructor(id: string, order: number) {
    super(id, order);
    (this as any).step.type = 'result';
  }
}

/**
 * Funções helper para criar steps rapidamente
 */
export const builders = {
  /**
   * Cria step de introdução
   */
  intro: (id: string, order: number) => new IntroBuilder(id, order),

  /**
   * Cria step de pergunta
   */
  question: (id: string, order: number) => new QuestionBuilder(id, order),

  /**
   * Cria step de transição
   */
  transition: (id: string, order: number) => new TransitionBuilder(id, order),

  /**
   * Cria step de resultado
   */
  result: (id: string, order: number) => new ResultBuilder(id, order),
};

/**
 * Exemplo de uso:
 * 
 * const step = builders.question('step-02', 2)
 *   .withProgress(2, 21)
 *   .withTitle('Qual seu estilo preferido?')
 *   .withOptionsGrid([
 *     { id: 'natural', text: 'Natural', scores: { natural: 10 } },
 *     { id: 'classico', text: 'Clássico', scores: { classico: 10 } }
 *   ])
 *   .withValidation(true, 3, 3)
 *   .goTo('step-03')
 *   .build();
 */
