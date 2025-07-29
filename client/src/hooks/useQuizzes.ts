
import { useState, useEffect } from 'react';
import { Quiz } from '@/types/quiz';
import { QuizService } from '@/services/QuizService';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await QuizService.getUserQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: Partial<Quiz>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newQuiz = await QuizService.createQuiz(quizData);
      setQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  return {
    quizzes,
    loading,
    error,
    createQuiz,
    loadQuizzes
  };
};
