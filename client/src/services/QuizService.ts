
import { supabase } from '../lib/supabase';
import type { Quiz, QuizQuestion, QuizWithQuestions } from '../types/supabase';

export class QuizService {
  static async getQuizzes(userId: string): Promise<Quiz[]> {
    // Mock data for development
    const mockQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'Quiz Exemplo',
        description: 'Descrição do quiz',
        author_id: userId,
        category: 'general',
        difficulty: 'medium',
        time_limit: null,
        is_public: false,
        is_published: false,
        is_template: false,
        thumbnail_url: null,
        tags: [],
        view_count: 0,
        completion_rate: 0,
        average_score: 0,
        settings: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    return mockQuizzes;
  }

  static async getQuizById(id: string): Promise<QuizWithQuestions> {
    // Mock data for development
    const mockQuiz: QuizWithQuestions = {
      id,
      title: 'Quiz Exemplo',
      description: 'Descrição do quiz',
      author_id: 'user-1',
      category: 'general',
      difficulty: 'medium',
      time_limit: null,
      is_public: false,
      is_published: false,
      is_template: false,
      thumbnail_url: null,
      tags: [],
      view_count: 0,
      completion_rate: 0,
      average_score: 0,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      questions: []
    };
    
    return mockQuiz;
  }

  static async createQuiz(quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>): Promise<Quiz> {
    // Mock creation
    const newQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      ...quizData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return newQuiz;
  }

  static async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    // Mock update
    const updatedQuiz: Quiz = {
      id,
      title: 'Updated Quiz',
      description: 'Updated description',
      author_id: 'user-1',
      category: 'general',
      difficulty: 'medium',
      time_limit: null,
      is_public: false,
      is_published: false,
      is_template: false,
      thumbnail_url: null,
      tags: [],
      view_count: 0,
      completion_rate: 0,
      average_score: 0,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...updates
    };
    
    return updatedQuiz;
  }

  static async deleteQuiz(id: string): Promise<void> {
    // Mock deletion
    console.log(`Deleting quiz ${id}`);
  }

  static async duplicateQuiz(id: string): Promise<Quiz> {
    // Mock duplication
    const duplicatedQuiz: Quiz = {
      id: `quiz_${Date.now()}`,
      title: 'Quiz Duplicado',
      description: 'Descrição duplicada',
      author_id: 'user-1',
      category: 'general',
      difficulty: 'medium',
      time_limit: null,
      is_public: false,
      is_published: false,
      is_template: false,
      thumbnail_url: null,
      tags: [],
      view_count: 0,
      completion_rate: 0,
      average_score: 0,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return duplicatedQuiz;
  }

  static async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    // Mock questions
    return [];
  }

  static async addQuestion(quizId: string, questionData: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const newQuestion: QuizQuestion = {
      id: `question_${Date.now()}`,
      quiz_id: quizId,
      question_text: questionData.question_text || 'Nova pergunta',
      question_type: questionData.question_type || 'multiple_choice',
      options: questionData.options || [],
      correct_answers: questionData.correct_answers || [],
      points: questionData.points || 1,
      time_limit: questionData.time_limit || null,
      required: questionData.required || true,
      explanation: questionData.explanation || null,
      hint: questionData.hint || null,
      media_url: questionData.media_url || null,
      media_type: questionData.media_type || null,
      tags: questionData.tags || [],
      order_index: questionData.order_index || 0,
      created_at: new Date().toISOString()
    };
    
    return newQuestion;
  }

  static async updateQuestion(id: string, updates: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const updatedQuestion: QuizQuestion = {
      id,
      quiz_id: 'quiz-1',
      question_text: 'Updated question',
      question_type: 'multiple_choice',
      options: [],
      correct_answers: [],
      points: 1,
      time_limit: null,
      required: true,
      explanation: null,
      hint: null,
      media_url: null,
      media_type: null,
      tags: [],
      order_index: 0,
      created_at: new Date().toISOString(),
      ...updates
    };
    
    return updatedQuestion;
  }

  static async deleteQuestion(id: string): Promise<void> {
    console.log(`Deleting question ${id}`);
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<void> {
    console.log(`Reordering questions for quiz ${quizId}:`, questionIds);
  }

  static async getPublicQuizzes(): Promise<Quiz[]> {
    return [];
  }
}

export type { Quiz, QuizQuestion, QuizWithQuestions };
