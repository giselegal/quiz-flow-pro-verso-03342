
import { Quiz, Question, QuizWithQuestions } from '@/types/quiz';

// Mock data for development
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Quiz de Personalidade',
    description: 'Descubra mais sobre sua personalidade',
    author_id: 'user-1',
    category: 'personality',
    difficulty: 'easy',
    time_limit: null,
    is_public: true,
    is_published: true,
    is_template: false,
    thumbnail_url: null,
    tags: ['personalidade', 'autoconhecimento'],
    view_count: 150,
    average_score: 85,
    completion_count: 120,
    questions: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class QuizService {
  static async getQuizzes(userId: string): Promise<Quiz[]> {
    // Mock implementation
    return Promise.resolve(mockQuizzes.filter(quiz => quiz.author_id === userId));
  }

  static async getQuizById(id: string): Promise<QuizWithQuestions | null> {
    // Mock implementation
    const quiz = mockQuizzes.find(q => q.id === id);
    return Promise.resolve(quiz ? { ...quiz, questions: [] } : null);
  }

  static async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    // Mock implementation
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: quizData.title || 'Novo Quiz',
      description: quizData.description || null,
      author_id: quizData.author_id || 'user-1',
      category: quizData.category || 'general',
      difficulty: quizData.difficulty || null,
      time_limit: quizData.time_limit || null,
      is_public: quizData.is_public || false,
      is_published: quizData.is_published || false,
      is_template: quizData.is_template || false,
      thumbnail_url: quizData.thumbnail_url || null,
      tags: quizData.tags || [],
      view_count: 0,
      average_score: 0,
      completion_count: 0,
      questions: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockQuizzes.push(newQuiz);
    return Promise.resolve(newQuiz);
  }

  static async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    // Mock implementation
    const quizIndex = mockQuizzes.findIndex(q => q.id === id);
    if (quizIndex === -1) throw new Error('Quiz not found');
    
    mockQuizzes[quizIndex] = { ...mockQuizzes[quizIndex], ...updates };
    return Promise.resolve(mockQuizzes[quizIndex]);
  }

  static async deleteQuiz(id: string): Promise<void> {
    // Mock implementation
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index !== -1) {
      mockQuizzes.splice(index, 1);
    }
    return Promise.resolve();
  }

  static async duplicateQuiz(id: string): Promise<Quiz> {
    // Mock implementation
    const original = mockQuizzes.find(q => q.id === id);
    if (!original) throw new Error('Quiz not found');
    
    const duplicate: Quiz = {
      ...original,
      id: Date.now().toString(),
      title: `${original.title} (Cópia)`,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockQuizzes.push(duplicate);
    return Promise.resolve(duplicate);
  }

  static async addQuestion(quizId: string, question: Partial<Question>): Promise<Question> {
    // Mock implementation
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: question.title || 'Nova Pergunta',
      text: question.text || '',
      type: question.type || 'single_choice',
      options: question.options || [],
      required: question.required || false,
      hint: question.hint,
      tags: question.tags || []
    };
    
    return Promise.resolve(newQuestion);
  }

  static async updateQuestion(id: string, updates: Partial<Question>): Promise<Question> {
    // Mock implementation - would update question in database
    const updatedQuestion: Question = {
      id,
      title: updates.title || 'Pergunta',
      text: updates.text || '',
      type: updates.type || 'single_choice',
      options: updates.options || [],
      required: updates.required || false,
      hint: updates.hint,
      tags: updates.tags || []
    };
    
    return Promise.resolve(updatedQuestion);
  }

  static async deleteQuestion(id: string): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<void> {
    // Mock implementation
    return Promise.resolve();
  }

  static async getPublicQuizzes(): Promise<Quiz[]> {
    // Mock implementation
    return Promise.resolve(mockQuizzes.filter(quiz => quiz.is_public));
  }

  static async publishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: true });
  }

  static async unpublishQuiz(id: string): Promise<Quiz> {
    return this.updateQuiz(id, { is_published: false });
  }
}
