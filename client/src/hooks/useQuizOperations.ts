// =============================================================================
// HOOK PARA OPERAÇÕES COM QUIZ - SUPABASE INTEGRATION
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

import { useState, useCallback } from 'react';
import { supabase } from '@shared/lib/supabase';
import { Quiz, Question } from '@shared/types/supabase';

// =============================================================================
// TIPOS
// =============================================================================

export interface UseQuizOperationsReturn {
  // Estado
  loading: boolean;
  error: string | null;
  
  // Operações de Quiz
  createQuiz: (quizData: Partial<Quiz>) => Promise<Quiz | null>;
  updateQuiz: (quizId: string, updates: Partial<Quiz>) => Promise<Quiz | null>;
  deleteQuiz: (quizId: string) => Promise<boolean>;
  duplicateQuiz: (quizId: string) => Promise<Quiz | null>;
  getQuiz: (quizId: string) => Promise<Quiz | null>;
  getUserQuizzes: (userId?: string) => Promise<Quiz[]>;
  
  // Operações de Perguntas
  createQuestion: (questionData: Partial<Question>) => Promise<Question | null>;
  updateQuestion: (questionId: string, updates: Partial<Question>) => Promise<Question | null>;
  deleteQuestion: (questionId: string) => Promise<boolean>;
  getQuizQuestions: (quizId: string) => Promise<Question[]>;
  reorderQuestions: (quizId: string, questionIds: string[]) => Promise<boolean>;
  
  // Publicação
  publishQuiz: (quizId: string) => Promise<boolean>;
  unpublishQuiz: (quizId: string) => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
}

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export const useQuizOperations = (): UseQuizOperationsReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =============================================================================
  // OPERAÇÕES DE QUIZ
  // =============================================================================

  const createQuiz = useCallback(async (quizData: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('quizzes')
        .insert([{
          title: quizData.title || 'Novo Quiz',
          description: quizData.description || '',
          author_id: user.user.id,
          category: quizData.category || 'geral',
          difficulty: quizData.difficulty || 'medium',
          time_limit: quizData.time_limit || null,
          is_public: quizData.is_public ?? false,
          is_published: quizData.is_published ?? false,
          is_template: quizData.is_template ?? false,
          thumbnail_url: quizData.thumbnail_url || null,
          tags: quizData.tags || [],
          settings: quizData.settings || {
            allowRetake: true,
            showResults: true,
            shuffleQuestions: false,
            showProgressBar: true,
            passingScore: 60,
          },
          version: 1,
          slug: quizData.slug || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar quiz';
      setError(errorMessage);
      console.error('Erro ao criar quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuiz = useCallback(async (quizId: string, updates: Partial<Quiz>): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quizzes')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quizId)
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quiz';
      setError(errorMessage);
      console.error('Erro ao atualizar quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuiz = useCallback(async (quizId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) throw error;
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar quiz';
      setError(errorMessage);
      console.error('Erro ao deletar quiz:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateQuiz = useCallback(async (quizId: string): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      // Buscar quiz original
      const { data: originalQuiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      // Buscar perguntas do quiz original
      const { data: originalQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (questionsError) throw questionsError;

      // Criar cópia do quiz
      const newQuiz = await createQuiz({
        ...originalQuiz,
        title: `${originalQuiz.title} (Cópia)`,
        is_published: false,
        is_public: false,
      });

      if (!newQuiz) throw new Error('Erro ao duplicar quiz');

      // Duplicar perguntas
      if (originalQuestions && originalQuestions.length > 0) {
        const { error: questionsInsertError } = await supabase
          .from('questions')
          .insert(
            originalQuestions.map(question => ({
              quiz_id: newQuiz.id,
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options,
              correct_answers: question.correct_answers,
              points: question.points,
              time_limit: question.time_limit,
              required: question.required,
              explanation: question.explanation,
              hint: question.hint,
              media_url: question.media_url,
              media_type: question.media_type,
              order_index: question.order_index,
              tags: question.tags,
            }))
          );

        if (questionsInsertError) throw questionsInsertError;
      }

      return newQuiz;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao duplicar quiz';
      setError(errorMessage);
      console.error('Erro ao duplicar quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [createQuiz]);

  const getQuiz = useCallback(async (quizId: string): Promise<Quiz | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar quiz';
      setError(errorMessage);
      console.error('Erro ao buscar quiz:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserQuizzes = useCallback(async (userId?: string): Promise<Quiz[]> => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('quizzes').select('*');

      if (userId) {
        query = query.eq('author_id', userId);
      } else {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          query = query.eq('author_id', user.user.id);
        }
      }

      const { data, error } = await query.order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar quizzes';
      setError(errorMessage);
      console.error('Erro ao buscar quizzes:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================================================
  // OPERAÇÕES DE PERGUNTAS
  // =============================================================================

  const createQuestion = useCallback(async (questionData: Partial<Question>): Promise<Question | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('questions')
        .insert([{
          quiz_id: questionData.quiz_id!,
          question_text: questionData.question_text || '',
          question_type: questionData.question_type || 'multiple_choice',
          options: questionData.options || [],
          correct_answers: questionData.correct_answers || [],
          points: questionData.points || 1,
          time_limit: questionData.time_limit || null,
          required: questionData.required ?? true,
          explanation: questionData.explanation || null,
          hint: questionData.hint || null,
          media_url: questionData.media_url || null,
          media_type: questionData.media_type || null,
          order_index: questionData.order_index || 0,
          tags: questionData.tags || [],
        }])
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar pergunta';
      setError(errorMessage);
      console.error('Erro ao criar pergunta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuestion = useCallback(async (questionId: string, updates: Partial<Question>): Promise<Question | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar pergunta';
      setError(errorMessage);
      console.error('Erro ao atualizar pergunta:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuestion = useCallback(async (questionId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar pergunta';
      setError(errorMessage);
      console.error('Erro ao deletar pergunta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuizQuestions = useCallback(async (quizId: string): Promise<Question[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index');

      if (error) throw error;
      return data || [];

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar perguntas';
      setError(errorMessage);
      console.error('Erro ao buscar perguntas:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderQuestions = useCallback(async (quizId: string, questionIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Atualizar ordem das perguntas
      const updates = questionIds.map((questionId, index) => ({
        id: questionId,
        order_index: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('questions')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('quiz_id', quizId);

        if (error) throw error;
      }

      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reordenar perguntas';
      setError(errorMessage);
      console.error('Erro ao reordenar perguntas:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================================================
  // PUBLICAÇÃO
  // =============================================================================

  const publishQuiz = useCallback(async (quizId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('quizzes')
        .update({ 
          is_published: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quizId);

      if (error) throw error;
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao publicar quiz';
      setError(errorMessage);
      console.error('Erro ao publicar quiz:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpublishQuiz = useCallback(async (quizId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('quizzes')
        .update({ 
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', quizId);

      if (error) throw error;
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao despublicar quiz';
      setError(errorMessage);
      console.error('Erro ao despublicar quiz:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    loading,
    error,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    duplicateQuiz,
    getQuiz,
    getUserQuizzes,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuizQuestions,
    reorderQuestions,
    publishQuiz,
    unpublishQuiz,
    clearError,
  };
};
