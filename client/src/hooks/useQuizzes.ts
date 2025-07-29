
import { useState, useCallback } from 'react';
import { Quiz } from '@/types/quiz';
import { QuizService } from '@/services/QuizService';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await QuizService.getQuizzes('default-author');
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuiz = useCallback(async (quizData: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);
      
      const processedData = {
        author_id: quizData.author_id || 'default-author',
        title: quizData.title || 'Untitled Quiz',
        description: quizData.description || undefined,
        category: quizData.category || 'general',
        difficulty: quizData.difficulty || undefined,
        time_limit: quizData.time_limit === null ? undefined : quizData.time_limit,
        is_public: quizData.is_public || false,
        is_published: quizData.is_published || false
      };

      const newQuiz = await QuizService.createQuiz(processedData);
      setQuizzes(prev => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuiz = useCallback(async (id: string, updates: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);
      
      const processedUpdates = {
        ...updates,
        description: updates.description || undefined,
        difficulty: updates.difficulty || undefined,
        time_limit: updates.time_limit === null ? undefined : updates.time_limit
      };
      
      const updatedQuiz = await QuizService.updateQuiz(id, processedUpdates);
      setQuizzes(prev => prev.map(quiz => quiz.id === id ? updatedQuiz : quiz));
      return updatedQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await QuizService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quizzes,
    loading,
    error,
    loadQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
};
