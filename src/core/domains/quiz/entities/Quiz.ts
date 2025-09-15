/**
 * 🎯 QUIZ ENTITY - Core Business Object
 * 
 * Representa a entidade principal Quiz no domínio de negócio.
 * Contém todas as regras de negócio relacionadas a um quiz.
 */

export interface QuizMetadata {
  title: string;
  description?: string;
  category: string;
  tags: string[];
  estimatedDuration: number; // em minutos
  difficulty: 'easy' | 'medium' | 'hard';
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizSettings {
  allowRestart: boolean;
  showProgress: boolean;
  shuffleQuestions: boolean;
  timeLimit?: number; // em segundos
  passingScore?: number; // percentual
  maxAttempts?: number;
  collectEmail: boolean;
  collectPhone: boolean;
}

export interface QuizBranding {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl?: string;
  backgroundImage?: string;
  customCss?: string;
}

export class Quiz {
  constructor(
    public readonly id: string,
    public metadata: QuizMetadata,
    public settings: QuizSettings,
    public branding: QuizBranding,
    public questionIds: string[] = [],
    public resultProfileIds: string[] = []
  ) {}

  // 🔍 Business Rules - Quiz Validation
  isValid(): boolean {
    return (
      this.metadata.title.trim().length > 0 &&
      this.questionIds.length > 0 &&
      this.resultProfileIds.length > 0
    );
  }

  // 🔍 Business Rules - Publishing
  canPublish(): boolean {
    return (
      this.isValid() &&
      this.questionIds.length >= 2 && // Mínimo 2 perguntas
      this.resultProfileIds.length >= 1 // Pelo menos 1 resultado
    );
  }

  // 🔍 Business Rules - Quiz Duration
  getEstimatedDuration(): number {
    // Base: 30 segundos por pergunta + 1 minuto para resultado
    const baseTime = (this.questionIds.length * 0.5) + 1;
    return Math.max(baseTime, this.metadata.estimatedDuration);
  }

  // 🔍 Business Rules - Difficulty Calculation
  calculateDifficulty(): 'easy' | 'medium' | 'hard' {
    const questionCount = this.questionIds.length;
    const hasTimeLimit = !!this.settings.timeLimit;
    const hasPassingScore = !!this.settings.passingScore;

    if (questionCount <= 5 && !hasTimeLimit && !hasPassingScore) {
      return 'easy';
    } else if (questionCount <= 10 && (!hasTimeLimit || !hasPassingScore)) {
      return 'medium';
    } else {
      return 'hard';
    }
  }

  // 🔍 Business Rules - Quiz State Management
  publish(): Quiz {
    if (!this.canPublish()) {
      throw new Error('Quiz não pode ser publicado: validação falhou');
    }

    return new Quiz(
      this.id,
      {
        ...this.metadata,
        isPublished: true,
        publishedAt: new Date()
      },
      this.settings,
      this.branding,
      this.questionIds,
      this.resultProfileIds
    );
  }

  unpublish(): Quiz {
    return new Quiz(
      this.id,
      {
        ...this.metadata,
        isPublished: false,
        publishedAt: undefined
      },
      this.settings,
      this.branding,
      this.questionIds,
      this.resultProfileIds
    );
  }

  // 🔍 Business Rules - Content Management
  addQuestion(questionId: string): Quiz {
    if (this.questionIds.includes(questionId)) {
      throw new Error('Pergunta já existe no quiz');
    }

    return new Quiz(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      [...this.questionIds, questionId],
      this.resultProfileIds
    );
  }

  removeQuestion(questionId: string): Quiz {
    const newQuestionIds = this.questionIds.filter(id => id !== questionId);
    
    if (newQuestionIds.length === this.questionIds.length) {
      throw new Error('Pergunta não encontrada no quiz');
    }

    return new Quiz(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      newQuestionIds,
      this.resultProfileIds
    );
  }

  // 🔍 Business Rules - Result Management
  addResultProfile(resultProfileId: string): Quiz {
    if (this.resultProfileIds.includes(resultProfileId)) {
      throw new Error('Perfil de resultado já existe no quiz');
    }

    return new Quiz(
      this.id,
      { ...this.metadata, updatedAt: new Date() },
      this.settings,
      this.branding,
      this.questionIds,
      [...this.resultProfileIds, resultProfileId]
    );
  }

  // 🔍 Utility Methods
  clone(newId?: string): Quiz {
    return new Quiz(
      newId || `${this.id}-copy`,
      {
        ...this.metadata,
        title: `${this.metadata.title} (Cópia)`,
        isPublished: false,
        publishedAt: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { ...this.settings },
      { ...this.branding },
      [...this.questionIds],
      [...this.resultProfileIds]
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      metadata: this.metadata,
      settings: this.settings,
      branding: this.branding,
      questionIds: this.questionIds,
      resultProfileIds: this.resultProfileIds
    };
  }

  static fromJSON(data: Record<string, any>): Quiz {
    return new Quiz(
      data.id,
      data.metadata,
      data.settings,
      data.branding,
      data.questionIds || [],
      data.resultProfileIds || []
    );
  }
}