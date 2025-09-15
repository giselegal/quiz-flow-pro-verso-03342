/**
 * 🎯 CORE DOMAINS - Public API
 * 
 * Exporta todas as entidades e interfaces dos domínios principais.
 * Este é o ponto de entrada para usar as entidades de domínio.
 */

// Quiz Domain
export { Quiz } from './quiz/entities/Quiz';
export { Question } from './quiz/entities/Question';
export { Answer } from './quiz/entities/Answer';
export { ResultProfile } from './quiz/entities/ResultProfile';

export type {
  QuizMetadata,
  QuizSettings,
  QuizBranding
} from './quiz/entities/Quiz';

export type {
  QuestionType,
  QuestionMedia,
  QuestionOption,
  QuestionValidation,
  QuestionLogic
} from './quiz/entities/Question';

export type {
  AnswerValue,
  AnswerMetadata
} from './quiz/entities/Answer';

export type {
  ResultCriteria,
  ResultContent,
  ResultVisuals,
  ResultActions
} from './quiz/entities/ResultProfile';

// Quiz Repository Interfaces
export type {
  QuizRepository,
  QuestionRepository,
  AnswerRepository,
  ResultProfileRepository,
  QuizAggregateRepository,
  QuizFilters,
  QuizSortOptions,
  PaginationOptions,
  PaginatedResult
} from './quiz/repositories/QuizRepository';

// Funnel Domain
export { Funnel } from './funnel/entities/Funnel';
export { Page } from './funnel/entities/Page';
export { Block } from './funnel/entities/Block';

export type {
  FunnelMetadata,
  FunnelSettings,
  FunnelBranding,
  FunnelAnalytics
} from './funnel/entities/Funnel';

export type {
  PageType,
  PageSEO,
  PageTracking,
  PageSettings,
  PageAnalytics
} from './funnel/entities/Page';

export type {
  BlockType,
  BlockContent,
  BlockStyles,
  BlockSettings,
  BlockAnalytics
} from './funnel/entities/Block';

// Editor Domain
export { EditorState } from './editor/entities/EditorState';

export type {
  EditorSession,
  EditorValidation,
  EditorSettings,
  EditorHistory,
  EditorStateSnapshot
} from './editor/entities/EditorState';

// Domain Events (para futura implementação)
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  eventData: Record<string, any>;
  occurredAt: Date;
  version: number;
}

// Common Value Objects
export class EntityId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty');
    }
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static generate(): EntityId {
    return new EntityId(`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }
}

export class DateRange {
  constructor(
    public readonly start: Date,
    public readonly end: Date
  ) {
    if (start >= end) {
      throw new Error('Start date must be before end date');
    }
  }

  contains(date: Date): boolean {
    return date >= this.start && date <= this.end;
  }

  getDurationInDays(): number {
    return Math.ceil((this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24));
  }

  overlap(other: DateRange): DateRange | null {
    const start = new Date(Math.max(this.start.getTime(), other.start.getTime()));
    const end = new Date(Math.min(this.end.getTime(), other.end.getTime()));
    
    if (start < end) {
      return new DateRange(start, end);
    }
    
    return null;
  }
}

// Utility Types
export interface Repository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<boolean>;
}

export interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export interface DomainService {
  // Marker interface for domain services
}

// Common Errors
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', { resource, id });
    this.name = 'NotFoundError';
  }
}

export class BusinessRuleViolationError extends DomainError {
  constructor(rule: string, details?: Record<string, any>) {
    super(`Business rule violation: ${rule}`, 'BUSINESS_RULE_VIOLATION', details);
    this.name = 'BusinessRuleViolationError';
  }
}