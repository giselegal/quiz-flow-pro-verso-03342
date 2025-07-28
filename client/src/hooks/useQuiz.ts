
import { useState, useEffect } from 'react';
import { QuizService, Quiz, QuizQuestion, QuizWithQuestions } from '../services/QuizService';

export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<QuizWithQuestions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await QuizService.getQuizById(id);
      setQuiz(quizData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (updates: Partial<Quiz>) => {
    if (!quiz) return;

    try {
      setLoading(true);
      const updatedQuiz = await QuizService.updateQuiz(quiz.id, updates);
      setQuiz(prev => prev ? { ...prev, ...updatedQuiz } : null);
      return updatedQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quiz,
    loading,
    error,
    loadQuiz,
    updateQuiz,
    setQuiz
  };
};

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const quizzesData = await QuizService.getQuizzes(userId);
      setQuizzes(quizzesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar quizzes');
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const newQuiz = await QuizService.createQuiz(quizData);
      setQuizzes(prev => [newQuiz, ...prev]);
      return newQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateQuiz = async (id: string) => {
    try {
      setLoading(true);
      const duplicatedQuiz = await QuizService.duplicateQuiz(id);
      setQuizzes(prev => [duplicatedQuiz, ...prev]);
      return duplicatedQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao duplicar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      setLoading(true);
      await QuizService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quizzes,
    loading,
    error,
    loadQuizzes,
    createQuiz,
    duplicateQuiz,
    deleteQuiz
  };
};

export const useQuizQuestions = (quizId: string) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const questionsData = await QuizService.getQuizQuestions(quizId);
      setQuestions(questionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perguntas');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (questionData: Partial<QuizQuestion>) => {
    try {
      setLoading(true);
      const newQuestion = await QuizService.addQuestion(quizId, questionData);
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (id: string, updates: Partial<QuizQuestion>) => {
    try {
      setLoading(true);
      const updatedQuestion = await QuizService.updateQuestion(id, updates);
      setQuestions(prev => prev.map(q => q.id === id ? updatedQuestion : q));
      return updatedQuestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      setLoading(true);
      await QuizService.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderQuestions = async (questionIds: string[]) => {
    try {
      setLoading(true);
      await QuizService.reorderQuestions(quizId, questionIds);
      // Update local state to reflect new order
      const reorderedQuestions = questionIds.map(id => 
        questions.find(q => q.id === id)!
      ).map((q, index) => ({ ...q, order_index: index }));
      setQuestions(reorderedQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao reordenar perguntas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPublicQuizzes = async () => {
    try {
      setLoading(true);
      const publicQuizzes = await QuizService.getPublicQuizzes();
      return publicQuizzes;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar quizzes públicos');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      loadQuestions();
    }
  }, [quizId]);

  return {
    questions,
    loading,
    error,
    loadQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    getPublicQuizzes
  };
};
