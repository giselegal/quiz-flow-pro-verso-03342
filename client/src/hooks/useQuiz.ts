
import { useState, useEffect } from 'react';
import { QuizService } from '@/services/QuizService';
import { Quiz, Question } from '@/types/quiz';

export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId]);

  const loadQuiz = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const quizData = await QuizService.getQuizById(id);
      if (quizData) {
        setQuiz(quizData);
        setQuestions(quizData.questions || []);
      } else {
        setError('Quiz não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar quiz');
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (updates: Partial<Quiz>) => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      const updatedQuiz = await QuizService.updateQuiz(quiz.id, updates);
      setQuiz(updatedQuiz);
      return updatedQuiz;
    } catch (err) {
      setError('Erro ao atualizar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (questionData: Partial<Question>) => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      const newQuestion = await QuizService.addQuestion(quiz.id, questionData);
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError('Erro ao adicionar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = async (questionId: string, updates: Partial<Question>) => {
    setLoading(true);
    try {
      const updatedQuestion = await QuizService.updateQuestion(questionId, updates);
      setQuestions(prev => prev.map(q => q.id === questionId ? updatedQuestion : q));
      return updatedQuestion;
    } catch (err) {
      setError('Erro ao atualizar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (questionId: string) => {
    setLoading(true);
    try {
      await QuizService.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      setError('Erro ao deletar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reorderQuestions = async (questionIds: string[]) => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      await QuizService.reorderQuestions(quiz.id, questionIds);
      const reorderedQuestions = questionIds.map(id => questions.find(q => q.id === id)!).filter(Boolean);
      setQuestions(reorderedQuestions);
    } catch (err) {
      setError('Erro ao reordenar perguntas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    quiz,
    questions,
    loading,
    error,
    loadQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions
  };
};

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuizzes = async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const quizzesData = await QuizService.getUserQuizzes(userId);
      setQuizzes(quizzesData);
    } catch (err) {
      setError('Erro ao carregar quizzes');
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData: Partial<Quiz>) => {
    setLoading(true);
    try {
      const newQuiz = await QuizService.createQuiz(quizData);
      setQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (err) {
      setError('Erro ao criar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateQuiz = async (quizId: string) => {
    setLoading(true);
    try {
      const duplicatedQuiz = await QuizService.duplicateQuiz(quizId);
      setQuizzes(prev => [...prev, duplicatedQuiz]);
      return duplicatedQuiz;
    } catch (err) {
      setError('Erro ao duplicar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    setLoading(true);
    try {
      await QuizService.deleteQuiz(quizId);
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    } catch (err) {
      setError('Erro ao deletar quiz');
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
