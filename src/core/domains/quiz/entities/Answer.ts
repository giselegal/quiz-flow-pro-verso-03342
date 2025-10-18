/**
 * 🎯 ANSWER ENTITY - Core Business Object
 * 
 * Representa uma resposta individual no domínio Quiz.
 * Contém todas as regras de negócio relacionadas a respostas.
 */

export type AnswerValue = string | number | (string | number)[] | boolean;

export interface AnswerMetadata {
  submittedAt: Date;
  timeSpent: number; // em segundos
  attemptNumber: number;
  deviceInfo?: {
    userAgent: string;
    viewport: { width: number; height: number };
    timestamp: Date;
  };
}

export class Answer {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly participantId: string,
    public readonly value: AnswerValue,
    public readonly metadata: AnswerMetadata
  ) {}

  // 🔍 Business Rules - Answer Validation
  isValid(): boolean {
    return (
      this.questionId.trim().length > 0 &&
      this.participantId.trim().length > 0 &&
      this.value !== null &&
      this.value !== undefined &&
      this.metadata.timeSpent >= 0
    );
  }

  /**
   * Valida a resposta contra as regras de uma pergunta específica
   * Retorna o mesmo contrato de Question.validateAnswer
   */
  validateAgainst(question: import('./Question').Question): { isValid: boolean; message?: string } {
    try {
      return question.validateAnswer(this.value as any);
    } catch {
      return { isValid: false, message: 'Falha ao validar resposta' };
    }
  }

  // 🔍 Business Rules - Answer Analysis
  getWeight(): number {
    // Se a resposta é um array de strings (múltipla escolha)
    if (Array.isArray(this.value)) {
      // Para múltipla escolha, retornar peso médio ou soma (depende da regra de negócio)
      return this.value.length; // Simplificado: quantidade de seleções
    }

    // Se é string ou número, tentar converter para número
    if (typeof this.value === 'number') {
      return this.value;
    }

    if (typeof this.value === 'string') {
      const numValue = parseFloat(this.value);
      return isNaN(numValue) ? 0 : numValue;
    }

    if (typeof this.value === 'boolean') {
      return this.value ? 1 : 0;
    }

    return 0;
  }

  // 🔍 Business Rules - Time Analysis
  wasAnsweredQuickly(): boolean {
    // Considerado "rápido" se respondido em menos de 3 segundos
    return this.metadata.timeSpent < 3;
  }

  wasAnsweredSlowly(): boolean {
    // Considerado "lento" se respondido em mais de 60 segundos
    return this.metadata.timeSpent > 60;
  }

  getEngagementScore(): number {
    // Score de engajamento baseado no tempo gasto
    // Ideal: entre 5-30 segundos = score máximo (1.0)
    const timeSpent = this.metadata.timeSpent;
    
    if (timeSpent < 2) return 0.3; // Muito rápido, baixo engajamento
    if (timeSpent >= 2 && timeSpent <= 5) return 0.7; // Rápido mas aceitável
    if (timeSpent > 5 && timeSpent <= 30) return 1.0; // Tempo ideal
    if (timeSpent > 30 && timeSpent <= 60) return 0.8; // Um pouco lento
    return 0.5; // Muito lento, possível distração
  }

  // 🔍 Business Rules - Answer Comparison
  matches(otherAnswer: Answer): boolean {
    if (this.questionId !== otherAnswer.questionId) return false;
    
    // Para arrays, comparar elementos
    if (Array.isArray(this.value) && Array.isArray(otherAnswer.value)) {
      if (this.value.length !== otherAnswer.value.length) return false;
      return this.value.every(val => (otherAnswer.value as any[]).includes(val));
    }
    
    return this.value === otherAnswer.value;
  }

  /**
   * Compara valores de forma semântica (ordem-insensível para arrays, case-insensitive para strings)
   */
  equalsSemantically(other: Answer): boolean {
    if (Array.isArray(this.value) && Array.isArray(other.value)) {
      const a = [...this.value].map(String).sort();
      const b = [...other.value].map(String).sort();
      if (a.length !== b.length) return false;
      return a.every((v, i) => v === b[i]);
    }
    if (typeof this.value === 'string' && typeof other.value === 'string') {
      return this.value.trim().toLowerCase() === other.value.trim().toLowerCase();
    }
    return this.value === other.value;
  }

  // 🔍 Business Rules - Answer Transformation
  normalizeValue(): string {
    if (Array.isArray(this.value)) {
      return this.value.sort().join(',');
    }
    
    if (typeof this.value === 'boolean') {
      return this.value ? 'true' : 'false';
    }
    
    return String(this.value).toLowerCase().trim();
  }

  /**
   * Normaliza para um array de strings (útil para scoring e comparação), mantendo ordem estável
   */
  normalizeToArray(): string[] {
    if (Array.isArray(this.value)) return [...this.value].map(String);
    if (typeof this.value === 'boolean') return [this.value ? 'true' : 'false'];
    return [String(this.value)];
  }

  /**
   * Indica se a resposta está vazia/inválida semanticamente
   */
  isEmpty(): boolean {
    if (this.value === null || this.value === undefined) return true;
    if (typeof this.value === 'string') return this.value.trim().length === 0;
    if (Array.isArray(this.value)) return this.value.length === 0;
    return false;
  }

  // 🔍 Business Rules - Answer Categorization
  getAnswerType(): 'single' | 'multiple' | 'text' | 'numeric' | 'boolean' {
    if (Array.isArray(this.value)) return 'multiple';
    if (typeof this.value === 'boolean') return 'boolean';
    if (typeof this.value === 'number') return 'numeric';
    
    // Tentar determinar se é numérico
    if (typeof this.value === 'string') {
      const numValue = parseFloat(this.value);
      if (!isNaN(numValue) && numValue.toString() === this.value) {
        return 'numeric';
      }
      return 'text';
    }
    
    return 'single';
  }

  // 🔍 Business Rules - Data Quality
  hasHighQuality(): boolean {
    // Resposta de alta qualidade:
    // - Não foi respondida muito rapidamente
    // - Não está vazia ou com valores padrão
    // - Tempo de resposta razoável
    
    if (this.wasAnsweredQuickly()) return false;
    
    if (this.value === '' || this.value === null || this.value === undefined) return false;
    
    // Para respostas de texto, verificar se não é apenas espaços
    if (typeof this.value === 'string' && this.value.trim().length === 0) return false;
    
    // Para arrays vazios
    if (Array.isArray(this.value) && this.value.length === 0) return false;
    
    return true;
  }

  /**
   * Calcula score ponderado com base nos pesos de opções de uma Question
   * - Para múltipla escolha: soma dos pesos
   * - Para escolha única: peso da opção
   * - Fallback: se peso ausente, usa 1 quando a opção existe (padrão) ou 0 se configuredFallback = 'zero'
   */
  getWeightedScore(question: import('./Question').Question, configuredFallback: 'one' | 'zero' = 'one'): number {
    try {
      const valueArray = this.normalizeToArray();
      const options = (question.options || []) as Array<{ id: string; weight?: number }>;
      const fallback = configuredFallback === 'one' ? 1 : 0;
      let total = 0;
      for (const v of valueArray) {
        const opt = options.find(o => String(o.id) === v);
        if (opt) {
          const w = typeof opt.weight === 'number' ? opt.weight! : fallback;
          total += Number(w) || 0;
        }
      }
      return total;
    } catch {
      return 0;
    }
  }

  /**
   * Estrutura padronizada para eventos de analytics desta resposta
   */
  toAnalytics(): Record<string, any> {
    return {
      event: 'answer_submitted',
      answerId: this.id,
      questionId: this.questionId,
      participantId: this.participantId,
      value: this.value,
      valueType: this.getAnswerType(),
      normalized: this.normalizeValue(),
      timeSpent: this.metadata.timeSpent,
      submittedAt: this.metadata.submittedAt?.toISOString?.() || this.metadata.submittedAt,
      attemptNumber: this.metadata.attemptNumber,
      device: this.metadata.deviceInfo ? {
        userAgent: this.metadata.deviceInfo.userAgent,
        viewport: this.metadata.deviceInfo.viewport,
        timestamp: this.metadata.deviceInfo.timestamp?.toISOString?.() || this.metadata.deviceInfo.timestamp,
      } : undefined,
    };
  }

  // 🔍 Utility Methods
  clone(newId?: string, newParticipantId?: string): Answer {
    const clonedValue: AnswerValue = Array.isArray(this.value) ? [...this.value] : this.value;
    
    return new Answer(
      newId || `${this.id}-copy`,
      this.questionId,
      newParticipantId || this.participantId,
      clonedValue,
      {
        ...this.metadata,
        submittedAt: new Date(),
        attemptNumber: this.metadata.attemptNumber + 1
      }
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      questionId: this.questionId,
      participantId: this.participantId,
      value: this.value,
      metadata: this.metadata
    };
  }

  static fromJSON(data: Record<string, any>): Answer {
    return new Answer(
      data.id,
      data.questionId,
      data.participantId,
      data.value,
      data.metadata
    );
  }

  // 🔍 Factory Methods
  static createTextAnswer(
    id: string,
    questionId: string,
    participantId: string,
    text: string,
    timeSpent: number
  ): Answer {
    return new Answer(
      id,
      questionId,
      participantId,
      text.trim(),
      {
        submittedAt: new Date(),
        timeSpent,
        attemptNumber: 1
      }
    );
  }

  static createChoiceAnswer(
    id: string,
    questionId: string,
    participantId: string,
    optionId: string,
    timeSpent: number
  ): Answer {
    return new Answer(
      id,
      questionId,
      participantId,
      optionId,
      {
        submittedAt: new Date(),
        timeSpent,
        attemptNumber: 1
      }
    );
  }

  static createMultipleChoiceAnswer(
    id: string,
    questionId: string,
    participantId: string,
    optionIds: string[],
    timeSpent: number
  ): Answer {
    return new Answer(
      id,
      questionId,
      participantId,
      [...optionIds], // Criar cópia do array
      {
        submittedAt: new Date(),
        timeSpent,
        attemptNumber: 1
      }
    );
  }

  static createRatingAnswer(
    id: string,
    questionId: string,
    participantId: string,
    rating: number,
    timeSpent: number
  ): Answer {
    return new Answer(
      id,
      questionId,
      participantId,
      rating,
      {
        submittedAt: new Date(),
        timeSpent,
        attemptNumber: 1
      }
    );
  }
}