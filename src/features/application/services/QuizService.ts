/**
 * 🎯 QUIZ SERVICE - Application Layer
 * 
 * Orchestrates quiz operations, encapsulating business logic.
 */

import { Quiz, type QuizMetadata, type QuizSettings, type QuizBranding } from '@/core/domains/quiz/entities/Quiz';
import { Question, type QuestionType, type QuestionOption } from '@/core/domains/quiz/entities/Question';
import { ResultProfile, type ResultCriteria, type ResultContent, type ResultVisuals, type ResultActions } from '@/core/domains/quiz/entities/ResultProfile';

export interface QuizAnalytics {
  totalAttempts: number;
  completionRate: number;
  averageScore: number;
  averageCompletionTime: number;
  dropOffPoints: { questionIndex: number; dropOffRate: number }[];
  popularAnswers: Record<string, Record<string, number>>;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId?: string;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  score: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
  isCompleted: boolean;
}

export class QuizService {
  // TODO: integrar com repositórios reais na camada de infraestrutura
  // Por enquanto, este serviço funciona como fachada em memória/
  // stub para não quebrar a checagem de tipos.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  private quizRepository: {
    findById: (id: string) => Promise<Quiz | null>;
    delete: (id: string) => Promise<boolean>;
    clone: (id: string, newName?: string) => Promise<Quiz>;
    findQuestionById: (quizId: string, questionId: string) => Promise<Question | null>;
    findResultProfileById: (quizId: string, resultProfileId: string) => Promise<ResultProfile | null>;
  };

  constructor() {
    this.quizRepository = {
      findById: async () => null,
      delete: async () => true,
      clone: async (id: string, newName?: string) => {
        const now = new Date();
        const metadata: QuizMetadata = {
          title: newName || 'Quiz clonável',
          description: '',
          category: 'quiz',
          tags: [],
          estimatedDuration: 5,
          difficulty: 'easy',
          isPublished: false,
          createdAt: now,
          updatedAt: now,
        };
        const settings: QuizSettings = {
          allowRestart: true,
          showProgress: true,
          shuffleQuestions: false,
          collectEmail: false,
          collectPhone: false,
        };
        const branding: QuizBranding = {
          primaryColor: '#000000',
          secondaryColor: '#FFFFFF',
          fontFamily: 'system-ui',
        };
        return new Quiz(id, metadata, settings, branding);
      },
      findQuestionById: async () => null,
      findResultProfileById: async () => null,
    };
  }

  async createQuiz(name: string, description: string, options: any = {}): Promise<Quiz> {
    const now = new Date();
    const metadata: QuizMetadata = {
      title: name,
      description,
      category: options.category ?? 'quiz',
      tags: options.tags ?? [],
      estimatedDuration: options.estimatedDuration ?? 5,
      difficulty: options.difficulty ?? 'easy',
      isPublished: false,
      createdAt: now,
      updatedAt: now,
    };

    const settings: QuizSettings = {
      allowRestart: options.allowRestart ?? true,
      showProgress: options.showProgress ?? true,
      shuffleQuestions: options.shuffleQuestions ?? false,
      timeLimit: options.timeLimit,
      passingScore: options.passingScore,
      maxAttempts: options.maxAttempts,
      collectEmail: options.collectEmail ?? false,
      collectPhone: options.collectPhone ?? false,
    };

    const branding: QuizBranding = {
      primaryColor: options.primaryColor ?? '#000000',
      secondaryColor: options.secondaryColor ?? '#FFFFFF',
      fontFamily: options.fontFamily ?? 'system-ui',
      logoUrl: options.logoUrl,
      backgroundImage: options.backgroundImage,
      customCss: options.customCss,
    };

    return new Quiz('temp-id', metadata, settings, branding);
  }

  async getQuiz(id: string): Promise<Quiz | null> {
    return this.quizRepository.findById(id);
  }

  async updateQuiz(id: string, updates: any): Promise<Quiz> {
    const quiz = await this.getQuiz(id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }

  async deleteQuiz(id: string): Promise<boolean> {
    return this.quizRepository.delete(id);
  }

  async cloneQuiz(id: string, newName?: string): Promise<Quiz> {
    return this.quizRepository.clone(id, newName);
  }

  async publishQuiz(id: string): Promise<Quiz> {
    const quiz = await this.getQuiz(id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }

  async unpublishQuiz(id: string): Promise<Quiz> {
    const quiz = await this.getQuiz(id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  }

  async addQuestion(quizId: string, type: string, text: string, options: Array<Record<string, any>>): Promise<Question> {
    const now = new Date();
    const questionType = type as QuestionType;
    const mappedOptions: QuestionOption[] = options.map((answer, index) => ({
      id: `opt-${index}`,
      text: String((answer as any).text ?? (answer as any).label ?? ''),
      value: (answer as any).value ?? index,
    }));

    return new Question('temp-id', questionType, text, undefined, mappedOptions, undefined, {
      required: true,
    }, undefined, {
      order: 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateQuestion(quizId: string, questionId: string, updates: Partial<Question>): Promise<Question> {
    const question = await this.quizRepository.findQuestionById(quizId, questionId);
    if (!question) throw new Error('Question not found');
    return { ...question, ...updates } as Question;
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<boolean> {
    return true;
  }

  async getQuestions(quizId: string): Promise<Question[]> {
    return [];
  }

  async addResultProfile(quizId: string, title: string, description: string, scoreRange: any): Promise<ResultProfile> {
    const now = new Date();
    const criteria: ResultCriteria = {
      type: 'score-range',
      minScore: scoreRange?.min ?? 0,
      maxScore: scoreRange?.max ?? 100,
      priority: 1,
    };

    const content: ResultContent = {
      title,
      description,
    };

    const visuals: ResultVisuals = {
      primaryColor: '#3B82F6',
    };

    const actions: ResultActions = {
      shareEnabled: true,
      emailCapture: false,
      retakeAllowed: true,
    };

    return new ResultProfile('temp-id', title, criteria, content, visuals, actions, {
      category: 'default',
      tags: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateResultProfile(quizId: string, resultProfileId: string, updates: Partial<ResultProfile>): Promise<ResultProfile> {
    const profile = await this.quizRepository.findResultProfileById(quizId, resultProfileId);
    if (!profile) throw new Error('Result profile not found');
    return { ...profile, ...updates } as ResultProfile;
  }

  async deleteResultProfile(quizId: string, resultProfileId: string): Promise<boolean> {
    return true;
  }

  async getResultProfiles(quizId: string): Promise<ResultProfile[]> {
    return [];
  }

  async startQuizSession(quizId: string, userId?: string): Promise<QuizSession> {
    return {
      id: crypto.randomUUID(),
      quizId,
      userId,
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      startedAt: new Date(),
      timeSpent: 0,
      isCompleted: false,
    };
  }

  async updateQuizSession(sessionId: string, updates: any): Promise<QuizSession> {
    return {
      id: sessionId,
      quizId: 'temp',
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      startedAt: new Date(),
      timeSpent: 0,
      isCompleted: false,
    };
  }

  async submitAnswer(sessionId: string, questionId: string, answer: any): Promise<QuizSession> {
    return this.updateQuizSession(sessionId, {});
  }

  async completeQuizSession(sessionId: string): Promise<QuizSession> {
    return this.updateQuizSession(sessionId, {});
  }

  async getQuizSession(sessionId: string): Promise<QuizSession | null> {
    return null;
  }

  async getQuizAnalytics(quizId: string): Promise<QuizAnalytics> {
    return {
      totalAttempts: 0,
      completionRate: 0,
      averageScore: 0,
      averageCompletionTime: 0,
      dropOffPoints: [],
      popularAnswers: {},
      deviceBreakdown: {},
      locationBreakdown: {},
    };
  }

  async getUserQuizzes(userId: string): Promise<Quiz[]> {
    return [];
  }

  async getPublishedQuizzes(): Promise<Quiz[]> {
    return [];
  }

  async validateQuiz(quizId: string): Promise<{ isValid: boolean; errors: string[] }> {
    return { isValid: true, errors: [] };
  }
}