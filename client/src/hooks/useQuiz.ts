import { useState, useEffect, useCallback } from 'react';
import { QuizService, type QuizWithQuestions } from '../services/QuizService';
import type { Quiz, Question, InsertQuiz, InsertQuestion } from '../types/supabase';
import { useAuth } from '../context/AuthContext';

// ====================================
// HOOK FOR MANAGING A SINGLE QUIZ
// ====================================
export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadQuiz = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await QuizService.getQuizById(id);
      
      if (error) {
        setError(error);
      } else {
        setQuiz(data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId, loadQuiz]);

  const updateQuiz = useCallback(async (updates: Partial<Quiz>) => {
    if (!quiz) return { error: new Error('Quiz não carregado') };

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.updateQuiz(quiz.id, updates);
      
      if (error) {
        setError(error);
        return { error };
      }

      if (data) {
        setQuiz(prev => prev ? { ...prev, ...data } : null);
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [quiz]);

  const deleteQuiz = useCallback(async () => {
    if (!quiz) return { error: new Error('Quiz não carregado') };

    setLoading(true);
    setError(null);

    try {
      const { error } = await QuizService.deleteQuiz(quiz.id);
      
      if (error) {
        setError(error);
        return { error };
      }

      setQuiz(null);
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [quiz]);

  return {
    quiz,
    loading,
    error,
    loadQuiz,
    updateQuiz,
    deleteQuiz,
    refetch: () => quiz && loadQuiz(quiz.id)
  };
};

// ====================================
// HOOK FOR MANAGING USER'S QUIZZES
// ====================================
export const useUserQuizzes = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadUserQuizzes = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Verificar se está em modo mock
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      if (!supabaseUrl || supabaseUrl.includes('temporary-mock-url')) {
        // Mock data para desenvolvimento
        const mockQuizzes: Quiz[] = [
          {
            id: 'mock-quiz-1',
            title: 'Quiz de Conhecimentos Gerais',
            description: 'Teste seus conhecimentos em diversos assuntos',
            author_id: user.id,
            category: 'geral',
            difficulty: 'medium',
            time_limit: null,
            is_public: true,
            is_published: true,
            is_template: false,
            thumbnail_url: null,
            version: 1,
            slug: 'quiz-conhecimentos-gerais',
            tags: ['conhecimento', 'cultura'],
            settings: {
              allowRetake: true,
              showResults: true,
              shuffleQuestions: false,
              showProgressBar: true,
              passingScore: 60
            },
            view_count: 150,
            completion_count: 89,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'mock-quiz-2',
            title: 'Quiz de Tecnologia',
            description: 'Desafie-se com perguntas sobre tecnologia moderna',
            author_id: user.id,
            category: 'tecnologia',
            difficulty: 'hard',
            time_limit: 30,
            is_public: false,
            is_published: false,
            is_template: false,
            thumbnail_url: null,
            version: 1,
            slug: 'quiz-tecnologia',
            tags: ['tech', 'programação'],
            settings: {
              allowRetake: false,
              showResults: true,
              shuffleQuestions: true,
              showProgressBar: true,
              passingScore: 70
            },
            view_count: 45,
            completion_count: 23,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        // Simular carregamento
        await new Promise(resolve => setTimeout(resolve, 500));
        setQuizzes(mockQuizzes);
        return;
      }

      // Modo normal com Supabase
      const { data, error } = await QuizService.getUserQuizzes(user.id);
      
      if (error) {
        setError(error);
      } else {
        setQuizzes(data || []);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserQuizzes();
  }, [loadUserQuizzes]);

  const createQuiz = useCallback(async (quizData: InsertQuiz) => {
    if (!user) return { error: new Error('Usuário não autenticado') };

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.createQuiz({
        ...quizData,
        author_id: user.id
      });
      
      if (error) {
        setError(error);
        return { data: null, error };
      }

      if (data) {
        setQuizzes(prev => [data, ...prev]);
      }

      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const duplicateQuiz = useCallback(async (originalId: string, newTitle: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.duplicateQuiz(originalId, newTitle);
      
      if (error) {
        setError(error);
        return { error };
      }

      if (data) {
        setQuizzes(prev => [data, ...prev]);
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quizzes,
    loading,
    error,
    createQuiz,
    duplicateQuiz,
    refetch: loadUserQuizzes
  };
};

// ====================================
// HOOK FOR MANAGING QUESTIONS
// ====================================
export const useQuestions = (quizId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addQuestion = useCallback(async (questionData: Omit<InsertQuestion, 'quiz_id'>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.addQuestion({
        ...questionData,
        quiz_id: quizId
      });
      
      if (error) {
        setError(error);
        return { error };
      }

      if (data) {
        setQuestions(prev => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const updateQuestion = useCallback(async (questionId: string, updates: Partial<Question>) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.updateQuestion(questionId, updates);
      
      if (error) {
        setError(error);
        return { error };
      }

      if (data) {
        setQuestions(prev => prev.map(q => q.id === questionId ? data : q));
      }

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (questionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await QuizService.deleteQuestion(questionId);
      
      if (error) {
        setError(error);
        return { error };
      }

      setQuestions(prev => prev.filter(q => q.id !== questionId));
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderQuestions = useCallback(async (newOrder: { id: string; order_index: number }[]) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await QuizService.reorderQuestions(newOrder);
      
      if (error) {
        setError(error);
        return { error };
      }

      // Atualizar ordem local
      setQuestions(prev => {
        const updated = [...prev];
        newOrder.forEach(({ id, order_index }) => {
          const question = updated.find(q => q.id === id);
          if (question) {
            question.order_index = order_index;
          }
        });
        return updated.sort((a, b) => a.order_index - b.order_index);
      });

      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    questions,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    setQuestions
  };
};

// ====================================
// HOOK FOR PUBLIC QUIZZES
// ====================================
export const usePublicQuizzes = (limit = 20) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadQuizzes = useCallback(async (offset = 0, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await QuizService.getPublicQuizzes(limit, offset);
      
      if (error) {
        setError(error);
        return;
      }

      const newQuizzes = data || [];
      
      if (reset) {
        setQuizzes(newQuizzes);
      } else {
        setQuizzes(prev => [...prev, ...newQuizzes]);
      }

      setHasMore(newQuizzes.length === limit);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadQuizzes(0, true);
  }, [loadQuizzes]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadQuizzes(quizzes.length);
    }
  }, [loading, hasMore, quizzes.length, loadQuizzes]);

  const refetch = useCallback(() => {
    loadQuizzes(0, true);
  }, [loadQuizzes]);

  return {
    quizzes,
    loading,
    error,
    hasMore,
    loadMore,
    refetch
  };
};
