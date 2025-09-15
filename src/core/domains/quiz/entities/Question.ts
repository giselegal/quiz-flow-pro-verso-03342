/**
 * 🎯 QUESTION ENTITY - Core Business Object
 * 
 * Representa uma pergunta individual no domínio Quiz.
 * Contém todas as regras de negócio relacionadas a perguntas.
 */

export type QuestionType = 
  | 'multiple-choice' 
  | 'single-choice' 
  | 'text-input' 
  | 'rating-scale' 
  | 'yes-no' 
  | 'image-choice' 
  | 'ranking';

export interface QuestionMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt?: string;
  caption?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string | number;
  weight?: number; // Para cálculo de resultados
  image?: string;
  isCorrect?: boolean; // Para quizzes com respostas certas
}

export interface QuestionValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface QuestionLogic {
  showIf?: {
    questionId: string;
    operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than';
    value: any;
  };
  skipTo?: {
    questionId: string;
    condition: {
      optionId: string;
    };
  };
}

export class Question {
  constructor(
    public readonly id: string,
    public readonly type: QuestionType,
    public title: string,
    public description?: string,
    public options: QuestionOption[] = [],
    public media?: QuestionMedia,
    public validation: QuestionValidation = { required: true },
    public logic?: QuestionLogic,
    public metadata: {
      order: number;
      category?: string;
      tags?: string[];
      createdAt: Date;
      updatedAt: Date;
    } = {
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ) {}

  // 🔍 Business Rules - Question Validation
  isValid(): boolean {
    if (!this.title.trim()) return false;
    
    switch (this.type) {
      case 'multiple-choice':
      case 'single-choice':
      case 'image-choice':
        return this.options.length >= 2;
      
      case 'rating-scale':
        return this.options.length >= 2 && this.options.length <= 10;
      
      case 'ranking':
        return this.options.length >= 2 && this.options.length <= 8;
      
      case 'yes-no':
        return this.options.length === 2;
      
      case 'text-input':
        return true; // Sempre válido se tem título
      
      default:
        return false;
    }
  }

  // 🔍 Business Rules - Option Management
  canAddOption(): boolean {
    switch (this.type) {
      case 'multiple-choice':
      case 'single-choice':
      case 'image-choice':
        return this.options.length < 6; // Máximo 6 opções
      
      case 'rating-scale':
        return this.options.length < 10;
      
      case 'ranking':
        return this.options.length < 8;
      
      case 'yes-no':
        return false; // Sempre 2 opções fixas
      
      case 'text-input':
        return false; // Não tem opções
      
      default:
        return false;
    }
  }

  addOption(text: string, value?: string | number, weight?: number): Question {
    if (!this.canAddOption()) {
      throw new Error('Não é possível adicionar mais opções para este tipo de pergunta');
    }

    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: text.trim(),
      value: value ?? text.trim(),
      weight
    };

    return new Question(
      this.id,
      this.type,
      this.title,
      this.description,
      [...this.options, newOption],
      this.media,
      this.validation,
      this.logic,
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  removeOption(optionId: string): Question {
    const newOptions = this.options.filter(opt => opt.id !== optionId);
    
    if (newOptions.length === this.options.length) {
      throw new Error('Opção não encontrada');
    }

    // Verificar se ainda tem opções suficientes
    if (this.type === 'yes-no' || 
        ((['multiple-choice', 'single-choice', 'image-choice', 'rating-scale', 'ranking'].includes(this.type)) && newOptions.length < 2)) {
      throw new Error('Não é possível remover esta opção: número mínimo de opções seria violado');
    }

    return new Question(
      this.id,
      this.type,
      this.title,
      this.description,
      newOptions,
      this.media,
      this.validation,
      this.logic,
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  updateOption(optionId: string, updates: Partial<QuestionOption>): Question {
    const optionIndex = this.options.findIndex(opt => opt.id === optionId);
    if (optionIndex === -1) {
      throw new Error('Opção não encontrada');
    }

    const newOptions = [...this.options];
    newOptions[optionIndex] = { ...newOptions[optionIndex], ...updates };

    return new Question(
      this.id,
      this.type,
      this.title,
      this.description,
      newOptions,
      this.media,
      this.validation,
      this.logic,
      { ...this.metadata, updatedAt: new Date() }
    );
  }

  // 🔍 Business Rules - Question Logic
  shouldShow(previousAnswers: Record<string, any>): boolean {
    if (!this.logic?.showIf) return true;

    const { questionId, operator, value } = this.logic.showIf;
    const previousAnswer = previousAnswers[questionId];

    if (previousAnswer === undefined) return false;

    switch (operator) {
      case 'equals':
        return previousAnswer === value;
      case 'not-equals':
        return previousAnswer !== value;
      case 'contains':
        return Array.isArray(previousAnswer) ? previousAnswer.includes(value) : false;
      case 'greater-than':
        return Number(previousAnswer) > Number(value);
      case 'less-than':
        return Number(previousAnswer) < Number(value);
      default:
        return true;
    }
  }

  getNextQuestionId(selectedOptionId?: string): string | null {
    if (!this.logic?.skipTo || !selectedOptionId) return null;
    
    if (this.logic.skipTo.condition.optionId === selectedOptionId) {
      return this.logic.skipTo.questionId;
    }
    
    return null;
  }

  // 🔍 Business Rules - Answer Validation
  validateAnswer(answer: any): { isValid: boolean; message?: string } {
    if (this.validation.required && (answer === null || answer === undefined || answer === '')) {
      return { isValid: false, message: this.validation.customMessage || 'Esta pergunta é obrigatória' };
    }

    switch (this.type) {
      case 'text-input':
        if (typeof answer !== 'string') {
          return { isValid: false, message: 'Resposta deve ser um texto' };
        }
        
        if (this.validation.minLength && answer.length < this.validation.minLength) {
          return { isValid: false, message: `Mínimo ${this.validation.minLength} caracteres` };
        }
        
        if (this.validation.maxLength && answer.length > this.validation.maxLength) {
          return { isValid: false, message: `Máximo ${this.validation.maxLength} caracteres` };
        }
        
        if (this.validation.pattern && !new RegExp(this.validation.pattern).test(answer)) {
          return { isValid: false, message: this.validation.customMessage || 'Formato inválido' };
        }
        break;

      case 'single-choice':
      case 'yes-no':
      case 'image-choice':
        if (!this.options.some(opt => opt.id === answer)) {
          return { isValid: false, message: 'Opção inválida' };
        }
        break;

      case 'multiple-choice':
        if (!Array.isArray(answer) || answer.some(id => !this.options.some(opt => opt.id === id))) {
          return { isValid: false, message: 'Uma ou mais opções são inválidas' };
        }
        break;

      case 'rating-scale':
        const rating = Number(answer);
        if (isNaN(rating) || rating < 1 || rating > this.options.length) {
          return { isValid: false, message: 'Avaliação fora do intervalo válido' };
        }
        break;

      case 'ranking':
        if (!Array.isArray(answer) || answer.length !== this.options.length) {
          return { isValid: false, message: 'Todas as opções devem ser ordenadas' };
        }
        break;
    }

    return { isValid: true };
  }

  // 🔍 Utility Methods
  clone(newId?: string): Question {
    return new Question(
      newId || `${this.id}-copy`,
      this.type,
      `${this.title} (Cópia)`,
      this.description,
      this.options.map(opt => ({ ...opt, id: `${opt.id}-copy` })),
      this.media ? { ...this.media } : undefined,
      { ...this.validation },
      this.logic ? { ...this.logic } : undefined,
      {
        ...this.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      description: this.description,
      options: this.options,
      media: this.media,
      validation: this.validation,
      logic: this.logic,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): Question {
    return new Question(
      data.id,
      data.type,
      data.title,
      data.description,
      data.options || [],
      data.media,
      data.validation || { required: true },
      data.logic,
      data.metadata || {
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }
}