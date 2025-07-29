
import { useState, useEffect } from 'react';
import { Quiz } from '@/types/quiz';
import { QuizService } from '../services/QuizService';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, use a mock user ID - in a real app this would come from auth
      const userId = 'current-user-id';
      const data = await QuizService.getQuizzes(userId);
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
      // Add required fields
      const quizToCreate = {
        ...quizData,
        author_id: 'current-user-id', // In a real app this would come from auth
        title: quizData.title || 'Novo Quiz',
        description: quizData.description || null,
        category: quizData.category || 'general',
        difficulty: quizData.difficulty || null,
        time_limit: quizData.time_limit || null,
        is_public: quizData.is_public || false,
        is_published: quizData.is_published || false
      };
      
      const newQuiz = await QuizService.createQuiz(quizToCreate);
      
      // Format the quiz to match our Quiz type
      const formattedQuiz: Quiz = {
        id: newQuiz.id,
        title: newQuiz.title,
        description: newQuiz.description,
        author_id: newQuiz.author_id,
        category: newQuiz.category,
        difficulty: newQuiz.difficulty,
        time_limit: newQuiz.time_limit,
        is_public: newQuiz.is_public,
        is_published: newQuiz.is_published,
        is_template: false,
        thumbnail_url: null,
        tags: [],
        view_count: 0,
        average_score: 0,
        completion_count: 0,
        questions: [],
        created_at: newQuiz.created_at,
        updated_at: newQuiz.updated_at
      };
      
      setQuizzes(prev => [...prev, formattedQuiz]);
      return formattedQuiz;
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
