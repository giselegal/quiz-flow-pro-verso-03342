
import { Quiz, Question } from '@/types/quiz';

// Mock data for development
const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Quiz de Exemplo',
    description: 'Um quiz de demonstração',
    author_id: 'user-1',
    category: 'general',
    difficulty: 'medium',
    time_limit: null,
    is_public: false,
    is_published: false,
    is_template: false,
    thumbnail_url: null,
    tags: ['exemplo', 'demo'],
    view_count: 0,
    average_score: 0,
    completion_count: 0,
    questions: [
      {
        id: 'q1',
        title: 'Qual é sua cor favorita?',
        text: 'Escolha a cor que mais gosta',
        type: 'multiple_choice',
        options: [
          { id: 'o1', text: 'Azul', isCorrect: false },
          { id: 'o2', text: 'Verde', isCorrect: false },
          { id: 'o3', text: 'Vermelho', isCorrect: false }
        ],
        required: true,
        tags: []
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export class QuizService {
  static async getUserQuizzes(userId: string): Promise<Quiz[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockQuizzes.filter(quiz => quiz.author_id === userId);
  }

  static async getQuizById(id: string): Promise<Quiz | null> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockQuizzes.find(quiz => quiz.id === id) || null;
  }

  static async createQuiz(quizData: Partial<Quiz>): Promise<Quiz> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: quizData.title || 'Novo Quiz',
      description: quizData.description || '',
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
    return newQuiz;
  }

  static async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quizIndex = mockQuizzes.findIndex(quiz => quiz.id === id);
    if (quizIndex === -1) {
      throw new Error('Quiz não encontrado');
    }
    
    mockQuizzes[quizIndex] = {
      ...mockQuizzes[quizIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return mockQuizzes[quizIndex];
  }

  static async deleteQuiz(id: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quizIndex = mockQuizzes.findIndex(quiz => quiz.id === id);
    if (quizIndex !== -1) {
      mockQuizzes.splice(quizIndex, 1);
    }
  }

  static async duplicateQuiz(id: string): Promise<Quiz> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const originalQuiz = mockQuizzes.find(quiz => quiz.id === id);
    if (!originalQuiz) {
      throw new Error('Quiz não encontrado');
    }
    
    const duplicatedQuiz: Quiz = {
      ...originalQuiz,
      id: Date.now().toString(),
      title: `${originalQuiz.title} (Cópia)`,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockQuizzes.push(duplicatedQuiz);
    return duplicatedQuiz;
  }

  static async addQuestion(quizId: string, questionData: Partial<Question>): Promise<Question> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }
    
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: questionData.title || 'Nova pergunta',
      text: questionData.text || '',
      type: questionData.type || 'multiple_choice',
      options: questionData.options || [],
      required: questionData.required || true,
      hint: questionData.hint,
      tags: questionData.tags || []
    };
    
    quiz.questions.push(newQuestion);
    return newQuestion;
  }

  static async updateQuestion(questionId: string, updates: Partial<Question>): Promise<Question> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const quiz of mockQuizzes) {
      const questionIndex = quiz.questions.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        quiz.questions[questionIndex] = {
          ...quiz.questions[questionIndex],
          ...updates
        };
        return quiz.questions[questionIndex];
      }
    }
    
    throw new Error('Pergunta não encontrada');
  }

  static async deleteQuestion(questionId: string): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const quiz of mockQuizzes) {
      const questionIndex = quiz.questions.findIndex(q => q.id === questionId);
      if (questionIndex !== -1) {
        quiz.questions.splice(questionIndex, 1);
        return;
      }
    }
  }

  static async reorderQuestions(quizId: string, questionIds: string[]): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const quiz = mockQuizzes.find(q => q.id === quizId);
    if (!quiz) {
      throw new Error('Quiz não encontrado');
    }
    
    const reorderedQuestions = questionIds.map(id => 
      quiz.questions.find(q => q.id === id)
    ).filter(Boolean) as Question[];
    
    quiz.questions = reorderedQuestions;
  }
}
