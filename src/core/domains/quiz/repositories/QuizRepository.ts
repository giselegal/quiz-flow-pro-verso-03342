/**
 * 🎯 QUIZ REPOSITORY INTERFACE - Data Access Layer
 * 
 * Define o contrato para persistência de dados do domínio Quiz.
 * Implementações concretas ficam na camada de infraestrutura.
 */

import { Quiz } from '../entities/Quiz';
import { Question } from '../entities/Question';
import { Answer } from '../entities/Answer';
import { ResultProfile } from '../entities/ResultProfile';

export interface QuizFilters {
  isPublished?: boolean;
  category?: string;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
  difficulty?: 'easy' | 'medium' | 'hard';
  searchTerm?: string;
}

export interface QuizSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'category' | 'difficulty';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QuizRepository {
  // 🔍 Quiz CRUD Operations
  save(quiz: Quiz): Promise<Quiz>;
  findById(id: string): Promise<Quiz | null>;
  findAll(
    filters?: QuizFilters,
    sort?: QuizSortOptions,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Quiz>>;
  update(id: string, updates: Partial<Quiz>): Promise<Quiz>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;

  // 🔍 Quiz Business Operations
  publish(id: string): Promise<Quiz>;
  unpublish(id: string): Promise<Quiz>;
  clone(id: string, newTitle?: string): Promise<Quiz>;
  findByCategory(category: string): Promise<Quiz[]>;
  findByTags(tags: string[]): Promise<Quiz[]>;
  search(searchTerm: string): Promise<Quiz[]>;

  // 🔍 Question Management
  addQuestion(quizId: string, question: Question): Promise<Quiz>;
  removeQuestion(quizId: string, questionId: string): Promise<Quiz>;
  updateQuestion(quizId: string, questionId: string, updates: Partial<Question>): Promise<Question>;
  reorderQuestions(quizId: string, questionIds: string[]): Promise<Quiz>;
  findQuestionsByQuiz(quizId: string): Promise<Question[]>;

  // 🔍 Result Profile Management
  addResultProfile(quizId: string, resultProfile: ResultProfile): Promise<Quiz>;
  removeResultProfile(quizId: string, resultProfileId: string): Promise<Quiz>;
  updateResultProfile(quizId: string, resultProfileId: string, updates: Partial<ResultProfile>): Promise<ResultProfile>;
  findResultProfilesByQuiz(quizId: string): Promise<ResultProfile[]>;

  // 🔍 Analytics & Statistics
  getQuizStats(id: string): Promise<{
    totalParticipants: number;
    completionRate: number;
    averageScore: number;
    averageTimeSpent: number;
    mostSelectedAnswers: Record<string, string>;
    resultDistribution: Record<string, number>;
  }>;
  
  getMostPopularQuizzes(limit?: number): Promise<Quiz[]>;
  getRecentQuizzes(limit?: number): Promise<Quiz[]>;
  
  // 🔍 Bulk Operations
  bulkDelete(ids: string[]): Promise<boolean>;
  bulkPublish(ids: string[]): Promise<Quiz[]>;
  bulkUnpublish(ids: string[]): Promise<Quiz[]>;
  bulkUpdateCategory(ids: string[], category: string): Promise<Quiz[]>;
}

export interface QuestionRepository {
  // 🔍 Question CRUD Operations
  save(question: Question): Promise<Question>;
  findById(id: string): Promise<Question | null>;
  findAll(filters?: {
    type?: string;
    category?: string;
    tags?: string[];
  }): Promise<Question[]>;
  update(id: string, updates: Partial<Question>): Promise<Question>;
  delete(id: string): Promise<boolean>;

  // 🔍 Question Library Operations
  findByType(type: string): Promise<Question[]>;
  findReusableQuestions(): Promise<Question[]>;
  markAsReusable(id: string): Promise<Question>;
  findTemplateQuestions(): Promise<Question[]>;
}

export interface AnswerRepository {
  // 🔍 Answer CRUD Operations
  save(answer: Answer): Promise<Answer>;
  findById(id: string): Promise<Answer | null>;
  findByParticipant(participantId: string): Promise<Answer[]>;
  findByQuestion(questionId: string): Promise<Answer[]>;
  findByQuiz(quizId: string): Promise<Answer[]>;
  
  // 🔍 Answer Analytics
  getAnswerStats(questionId: string): Promise<{
    totalAnswers: number;
    uniqueParticipants: number;
    averageTimeSpent: number;
    answerDistribution: Record<string, number>;
    engagementScore: number;
  }>;
  
  findFastAnswers(threshold?: number): Promise<Answer[]>;
  findSlowAnswers(threshold?: number): Promise<Answer[]>;
  
  // 🔍 Data Quality
  findLowQualityAnswers(): Promise<Answer[]>;
  findIncompleteAnswers(quizId: string): Promise<Answer[]>;
  
  // 🔍 Bulk Operations
  bulkSave(answers: Answer[]): Promise<Answer[]>;
  deleteByParticipant(participantId: string): Promise<boolean>;
  deleteByQuiz(quizId: string): Promise<boolean>;
}

export interface ResultProfileRepository {
  // 🔍 Result Profile CRUD Operations
  save(resultProfile: ResultProfile): Promise<ResultProfile>;
  findById(id: string): Promise<ResultProfile | null>;
  findAll(filters?: {
    category?: string;
    isActive?: boolean;
  }): Promise<ResultProfile[]>;
  update(id: string, updates: Partial<ResultProfile>): Promise<ResultProfile>;
  delete(id: string): Promise<boolean>;

  // 🔍 Result Matching
  findMatchingProfiles(
    answers: Record<string, any>,
    totalScore?: number
  ): Promise<ResultProfile[]>;
  
  findBestMatch(
    answers: Record<string, any>,
    totalScore?: number
  ): Promise<ResultProfile | null>;

  // 🔍 Result Analytics
  getResultStats(id: string): Promise<{
    totalMatches: number;
    matchRate: number;
    averageEngagement: number;
    conversionRate: number;
  }>;
}

// 🔍 Aggregate Repository - Combina todas as operações relacionadas a Quiz
export interface QuizAggregateRepository {
  quiz: QuizRepository;
  question: QuestionRepository;
  answer: AnswerRepository;
  resultProfile: ResultProfileRepository;
  
  // 🔍 Cross-Domain Operations
  getCompleteQuiz(id: string): Promise<{
    quiz: Quiz;
    questions: Question[];
    resultProfiles: ResultProfile[];
  } | null>;
  
  saveCompleteQuiz(
    quiz: Quiz,
    questions: Question[],
    resultProfiles: ResultProfile[]
  ): Promise<{
    quiz: Quiz;
    questions: Question[];
    resultProfiles: ResultProfile[];
  }>;
  
  duplicateCompleteQuiz(id: string, newTitle?: string): Promise<{
    quiz: Quiz;
    questions: Question[];
    resultProfiles: ResultProfile[];
  }>;
}