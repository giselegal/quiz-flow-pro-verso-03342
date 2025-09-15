/**
 * 🎯 RESULT PROFILE ENTITY - Core Business Object
 * 
 * Representa um perfil de resultado no domínio Quiz.
 * Contém todas as regras de negócio relacionadas aos resultados possíveis.
 */

export interface ResultCriteria {
  type: 'score-range' | 'answer-pattern' | 'weighted-score' | 'category-match';
  minScore?: number;
  maxScore?: number;
  requiredAnswers?: {
    questionId: string;
    expectedValue: any;
    weight?: number;
  }[];
  category?: string;
  priority: number; // Para resolver conflitos entre critérios
}

export interface ResultContent {
  title: string;
  description: string;
  detailedExplanation?: string;
  recommendations?: string[];
  resources?: {
    type: 'link' | 'download' | 'video';
    title: string;
    url: string;
    description?: string;
  }[];
}

export interface ResultVisuals {
  primaryColor: string;
  icon?: string;
  backgroundImage?: string;
  badge?: string;
  customCss?: string;
}

export interface ResultActions {
  primaryCta?: {
    text: string;
    url: string;
    type: 'button' | 'link';
    track?: string; // Analytics event name
  };
  secondaryCta?: {
    text: string;
    url: string;
    type: 'button' | 'link';
    track?: string;
  };
  shareEnabled: boolean;
  emailCapture: boolean;
  retakeAllowed: boolean;
}

export class ResultProfile {
  constructor(
    public readonly id: string,
    public name: string,
    public criteria: ResultCriteria,
    public content: ResultContent,
    public visuals: ResultVisuals,
    public actions: ResultActions,
    public metadata: {
      category: string;
      tags: string[];
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
  ) {}

  // 🔍 Business Rules - Result Matching
  matches(answers: Record<string, any>, totalScore?: number): boolean {
    switch (this.criteria.type) {
      case 'score-range':
        return this.matchesScoreRange(totalScore || 0);
      
      case 'answer-pattern':
        return this.matchesAnswerPattern(answers);
      
      case 'weighted-score':
        return this.matchesWeightedScore(answers);
      
      case 'category-match':
        return this.matchesCategoryScore(answers);
      
      default:
        return false;
    }
  }

  private matchesScoreRange(score: number): boolean {
    const { minScore = 0, maxScore = 100 } = this.criteria;
    return score >= minScore && score <= maxScore;
  }

  private matchesAnswerPattern(answers: Record<string, any>): boolean {
    if (!this.criteria.requiredAnswers) return false;
    
    return this.criteria.requiredAnswers.every(requirement => {
      const userAnswer = answers[requirement.questionId];
      
      if (Array.isArray(requirement.expectedValue)) {
        // Para múltipla escolha
        return Array.isArray(userAnswer) && 
               requirement.expectedValue.some(expected => userAnswer.includes(expected));
      }
      
      return userAnswer === requirement.expectedValue;
    });
  }

  private matchesWeightedScore(answers: Record<string, any>): boolean {
    if (!this.criteria.requiredAnswers) return false;
    
    const weightedScore = this.criteria.requiredAnswers.reduce((total, requirement) => {
      const userAnswer = answers[requirement.questionId];
      const weight = requirement.weight || 1;
      
      if (userAnswer === requirement.expectedValue) {
        return total + weight;
      }
      
      return total;
    }, 0);
    
    return this.matchesScoreRange(weightedScore);
  }

  private matchesCategoryScore(answers: Record<string, any>): boolean {
    if (!this.criteria.category || !this.criteria.requiredAnswers) return false;
    
    const categoryMatches = this.criteria.requiredAnswers.filter(requirement => {
      const userAnswer = answers[requirement.questionId];
      return userAnswer === requirement.expectedValue;
    }).length;
    
    // Pelo menos 50% das respostas da categoria devem coincidir
    const threshold = Math.ceil(this.criteria.requiredAnswers.length * 0.5);
    return categoryMatches >= threshold;
  }

  // 🔍 Business Rules - Result Validation
  isValid(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.content.title.trim().length > 0 &&
      this.content.description.trim().length > 0 &&
      this.criteria.priority >= 0 &&
      this.metadata.isActive
    );
  }

  // 🔍 Business Rules - Result Scoring
  getMatchStrength(answers: Record<string, any>, totalScore?: number): number {
    if (!this.matches(answers, totalScore)) return 0;
    
    let strength = this.criteria.priority / 10; // Base strength from priority
    
    switch (this.criteria.type) {
      case 'answer-pattern':
        if (this.criteria.requiredAnswers) {
          const matchCount = this.criteria.requiredAnswers.filter(req => 
            answers[req.questionId] === req.expectedValue
          ).length;
          strength += (matchCount / this.criteria.requiredAnswers.length) * 0.5;
        }
        break;
      
      case 'score-range':
        if (totalScore !== undefined) {
          const { minScore = 0, maxScore = 100 } = this.criteria;
          const range = maxScore - minScore;
          const distanceFromMin = totalScore - minScore;
          strength += (distanceFromMin / range) * 0.3;
        }
        break;
    }
    
    return Math.min(strength, 1.0);
  }

  // 🔍 Business Rules - Content Personalization
  getPersonalizedContent(_answers: Record<string, any>): ResultContent {
    // Por enquanto retorna conteúdo estático, mas pode ser expandido
    // para personalização baseada nas respostas
    return { ...this.content };
  }

  // 🔍 Business Rules - Action Availability
  canPerformAction(actionType: 'share' | 'email' | 'retake' | 'primary' | 'secondary'): boolean {
    switch (actionType) {
      case 'share':
        return this.actions.shareEnabled;
      case 'email':
        return this.actions.emailCapture;
      case 'retake':
        return this.actions.retakeAllowed;
      case 'primary':
        return !!this.actions.primaryCta;
      case 'secondary':
        return !!this.actions.secondaryCta;
      default:
        return false;
    }
  }

  // 🔍 Business Rules - Result Analytics
  shouldTrackEvent(actionType: string): string | null {
    switch (actionType) {
      case 'primary':
        return this.actions.primaryCta?.track || null;
      case 'secondary':
        return this.actions.secondaryCta?.track || null;
      default:
        return null;
    }
  }

  // 🔍 Utility Methods
  clone(newId?: string): ResultProfile {
    return new ResultProfile(
      newId || `${this.id}-copy`,
      `${this.name} (Cópia)`,
      { ...this.criteria },
      { ...this.content },
      { ...this.visuals },
      { ...this.actions },
      {
        ...this.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }

  activate(): ResultProfile {
    return new ResultProfile(
      this.id,
      this.name,
      this.criteria,
      this.content,
      this.visuals,
      this.actions,
      {
        ...this.metadata,
        isActive: true,
        updatedAt: new Date()
      }
    );
  }

  deactivate(): ResultProfile {
    return new ResultProfile(
      this.id,
      this.name,
      this.criteria,
      this.content,
      this.visuals,
      this.actions,
      {
        ...this.metadata,
        isActive: false,
        updatedAt: new Date()
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      criteria: this.criteria,
      content: this.content,
      visuals: this.visuals,
      actions: this.actions,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): ResultProfile {
    return new ResultProfile(
      data.id,
      data.name,
      data.criteria,
      data.content,
      data.visuals,
      data.actions,
      data.metadata
    );
  }

  // 🔍 Factory Methods
  static createBasicResult(
    id: string,
    name: string,
    title: string,
    description: string,
    minScore: number,
    maxScore: number
  ): ResultProfile {
    return new ResultProfile(
      id,
      name,
      {
        type: 'score-range',
        minScore,
        maxScore,
        priority: 1
      },
      {
        title,
        description,
        recommendations: []
      },
      {
        primaryColor: '#3B82F6',
        icon: 'star'
      },
      {
        shareEnabled: true,
        emailCapture: false,
        retakeAllowed: true
      },
      {
        category: 'basic',
        tags: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }
}