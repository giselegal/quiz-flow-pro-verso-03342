
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
      const quizData = await QuizService.getQuiz(id);
      if (quizData) {
        setQuiz(quizData);
        const questionsData = await QuizService.getQuizQuestions(id);
        setQuestions(questionsData || []);
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

  const saveQuiz = async (quizData?: Partial<Quiz>) => {
    if (!quiz) return;
    
    const dataToSave = quizData || quiz;
    return await updateQuiz(dataToSave);
  };

  const addQuestion = async (questionData: Partial<Question>) => {
    if (!quiz) return;
    
    setLoading(true);
    try {
      const questionToCreate = {
        quiz_id: quiz.id,
        question_text: questionData.text || '',
        question_type: questionData.type || 'single_choice',
        options: questionData.options || [],
        correct_answers: [],
        points: 1,
        order_index: questions.length,
        tags: questionData.tags || []
      };
      
      const newQuestion = await QuizService.createQuestions([questionToCreate]);
      if (newQuestion && newQuestion.length > 0) {
        const question = newQuestion[0];
        const formattedQuestion: Question = {
          id: question.id,
          title: question.question_text,
          text: question.question_text,
          type: question.question_type as any,
          options: question.options || [],
          required: question.required || false,
          hint: question.hint,
          tags: question.tags || []
        };
        setQuestions(prev => [...prev, formattedQuestion]);
        return formattedQuestion;
      }
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
      const updateData = {
        question_text: updates.text,
        question_type: updates.type,
        options: updates.options,
        hint: updates.hint,
        tags: updates.tags
      };
      
      const updatedQuestion = await QuizService.updateQuestion(questionId, updateData);
      const formattedQuestion: Question = {
        id: updatedQuestion.id,
        title: updatedQuestion.question_text,
        text: updatedQuestion.question_text,
        type: updatedQuestion.question_type as any,
        options: updatedQuestion.options || [],
        required: updatedQuestion.required || false,
        hint: updatedQuestion.hint,
        tags: updatedQuestion.tags || []
      };
      
      setQuestions(prev => prev.map(q => q.id === questionId ? formattedQuestion : q));
      return formattedQuestion;
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
      // For now, just reorder locally
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
    saveQuiz,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions
  };
};
