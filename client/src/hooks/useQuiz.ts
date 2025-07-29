
import { useState, useCallback } from 'react';
import { Quiz, Question } from '@/types/quiz';
import { QuizService } from '@/services/QuizService';

export const useQuiz = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const quizData = await QuizService.getQuiz(id);
      if (quizData) {
        setQuiz(quizData);
        const questionsData = await QuizService.getQuizQuestions(id);
        setQuestions(questionsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar quiz');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveQuiz = useCallback(async (quizData: Partial<Quiz>) => {
    try {
      setLoading(true);
      setError(null);
      
      const processedData = {
        ...quizData,
        author_id: quizData.author_id || 'default-author',
        title: quizData.title || 'Untitled Quiz',
        description: quizData.description || undefined,
        category: quizData.category || 'general',
        difficulty: quizData.difficulty || undefined,
        time_limit: quizData.time_limit === null ? undefined : quizData.time_limit,
        is_public: quizData.is_public === null ? undefined : quizData.is_public,
        is_published: quizData.is_published === null ? undefined : quizData.is_published
      };

      const savedQuiz = await QuizService.createQuiz(processedData);
      setQuiz(savedQuiz);
      return savedQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuiz = useCallback(async (updates: Partial<Quiz>) => {
    if (!quiz) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const processedUpdates = {
        ...updates,
        description: updates.description || undefined,
        difficulty: updates.difficulty || undefined,
        time_limit: updates.time_limit === null ? undefined : updates.time_limit,
        is_public: updates.is_public === null ? undefined : updates.is_public,
        is_published: updates.is_published === null ? undefined : updates.is_published
      };
      
      const updatedQuiz = await QuizService.updateQuiz(quiz.id, processedUpdates);
      setQuiz(updatedQuiz);
      return updatedQuiz;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar quiz');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quiz]);

  const addQuestion = useCallback(async (questionData: Partial<Question>) => {
    if (!quiz) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const question = await QuizService.createQuestions([{
        quiz_id: quiz.id,
        question_text: questionData.text || '',
        question_type: questionData.type || 'text',
        options: questionData.options || {},
        correct_answers: {},
        points: 1,
        tags: questionData.tags || [],
        order_index: questions.length
      }]);
      
      const newQuestion = question[0];
      setQuestions(prev => [...prev, newQuestion]);
      return newQuestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quiz, questions.length]);

  const updateQuestion = useCallback(async (questionId: string, updates: Partial<Question>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedQuestion = await QuizService.updateQuestion(questionId, updates);
      setQuestions(prev => prev.map(q => q.id === questionId ? updatedQuestion : q));
      return updatedQuestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (questionId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await QuizService.deleteQuestion(questionId);
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar pergunta');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    quiz,
    questions,
    loading,
    error,
    loadQuiz,
    saveQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion
  };
};
