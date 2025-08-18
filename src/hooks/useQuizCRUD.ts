// @ts-nocheck
import { useAuth } from '@/context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { QuizQuestion } from '@/types/quiz';
import { Funnel, FunnelPage } from '../types/unified-schema';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface QuizMetadata {
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  isPublic: boolean;
  settings: {
    showProgress: boolean;
    randomizeQuestions: boolean;
    allowRetake: boolean;
    passScore: number;
  };
}

// Use Funnel from unified schema instead of custom SavedQuiz
export interface SavedQuiz extends Omit<Funnel, 'settings'> {
  questions: QuizQuestion[];
  settings: any;
}

/**
 * 🎯 HOOK PARA OPERAÇÕES CRUD DE QUIZ COM SUPABASE
 *
 * Integra o Editor de Quiz com o banco Supabase:
 * - Salvar/carregar quizzes
 * - Gerenciar perguntas
 * - Sincronização automática
 * - Estado loading/error
 */
export const useQuizCRUD = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== CARREGAR QUIZZES DO USUÁRIO =====
  const loadUserQuizzes = async (): Promise<void> => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Use funnels table from unified schema instead of quizzes table
      const { data, error } = await supabase
        .from('funnels')
        .select(
          `
          id,
          name,
          description,
          user_id,
          is_published,
          settings,
          created_at,
          updated_at,
          funnel_pages (
            id,
            page_type,
            title,
            blocks,
            page_order
          )
        `
        )
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Convert funnel format to quiz format for backward compatibility
      const formattedQuizzes: SavedQuiz[] = (data || []).map(funnel => {
        // Extract questions from funnel pages
        const questions: QuizQuestion[] = [];

        funnel.funnel_pages?.forEach(page => {
          if (page.page_type === 'question' && page.blocks) {
            const blocks = Array.isArray(page.blocks) ? page.blocks : [];
            blocks.forEach((block: any) => {
              if (block.type === 'question' || block.type === 'quiz-question') {
                questions.push({
                  id: block.id || `q_${page.id}`,
                  title: block.properties?.question || page.title || '',
                  question: block.properties?.question || page.title || '',
                  text: block.properties?.question || page.title || '',
                  type: block.properties?.questionType || 'normal',
                  options: block.properties?.options || [],
                  multiSelect: block.properties?.multiSelect || 1,
                  order: page.page_order || 0,
                  points: block.properties?.points || 1,
                });
              }
            });
          }
        });

        return {
          id: funnel.id,
          name: funnel.name,
          description: funnel.description || '',
          user_id: funnel.user_id || '',
          is_published: funnel.is_published || false,
          version: funnel.version || 1,
          settings: funnel.settings || {},
          created_at: funnel.created_at || new Date().toISOString(),
          updated_at: funnel.updated_at || new Date().toISOString(),
          questions,
        };
      });

      setQuizzes(formattedQuizzes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar quizzes';
      setError(errorMessage);
      console.error('Erro ao carregar quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== SALVAR QUIZ COMPLETO =====
  const saveQuiz = async (
    metadata: QuizMetadata,
    questions: QuizQuestion[]
  ): Promise<string | null> => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para salvar',
        variant: 'destructive',
      });
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Salvar ou atualizar quiz principal
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .insert([
          {
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            difficulty: metadata.difficulty,
            time_limit: metadata.timeLimit,
            is_public: metadata.isPublic,
            author_id: user.id,
            settings: metadata.settings,
            is_published: false,
          },
        ])
        .select()
        .single();

      if (quizError) throw quizError;

      const quizId = quizData.id;

      // 2. Salvar perguntas
      if (questions.length > 0) {
        const questionsToInsert = questions.map((question, index) => ({
          quiz_id: quizId,
          question_text: question.title || question.question || question.text,
          question_type: question.type === 'normal' ? 'multiple_choice' : question.type,
          options: question.options || [],
          correct_answers: question.options?.slice(0, question.multiSelect).map((_, i) => i) || [0],
          points: question.points || 1,
          order_index: index,
          explanation: null,
          media_url: null,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      // 3. Recarregar lista
      await loadUserQuizzes();

      toast({
        title: 'Sucesso!',
        description: `Quiz "${metadata.title}" salvo com sucesso`,
      });

      return quizId;
    } catch (err) {
      console.error('Erro ao salvar quiz:', err);
      setError('Erro ao salvar quiz');
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o quiz',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===== CARREGAR QUIZ ESPECÍFICO =====
  const loadQuiz = async (quizId: string): Promise<SavedQuiz | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(
          `
          *,
          questions (*)
        `
        )
        .eq('id', quizId)
        .single();

      if (error) throw error;

      // Converter formato
      const formattedQuiz = {
        ...data,
        questions: data.questions.map((q: any) => ({
          id: q.id,
          title: q.question_text,
          question: q.question_text,
          text: q.question_text,
          type: q.question_type === 'multiple_choice' ? 'normal' : q.question_type,
          options: q.options || [],
          multiSelect: q.correct_answers?.length || 1,
          order: q.order_index,
          points: q.points || 1,
        })),
      };

      return formattedQuiz;
    } catch (err) {
      console.error('Erro ao carregar quiz:', err);
      setError('Erro ao carregar quiz');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ===== DELETAR QUIZ =====
  const deleteQuiz = async (quizId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('quizzes').delete().eq('id', quizId);

      if (error) throw error;

      // Recarregar lista
      await loadUserQuizzes();

      toast({
        title: 'Sucesso',
        description: 'Quiz excluído com sucesso',
      });

      return true;
    } catch (err) {
      console.error('Erro ao deletar quiz:', err);
      setError('Erro ao deletar quiz');
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o quiz',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ===== DUPLICAR QUIZ =====
  const duplicateQuiz = async (originalQuizId: string): Promise<string | null> => {
    const originalQuiz = await loadQuiz(originalQuizId);
    if (!originalQuiz) return null;

    const metadata: QuizMetadata = {
      title: `${originalQuiz.title} (Cópia)`,
      description: originalQuiz.description,
      category: originalQuiz.category,
      difficulty: originalQuiz.difficulty,
      timeLimit: undefined,
      isPublic: false,
      settings: originalQuiz.settings || {
        showProgress: true,
        randomizeQuestions: false,
        allowRetake: true,
        passScore: 70,
      },
    };

    return await saveQuiz(metadata, originalQuiz.questions);
  };

  // ===== AUTO-LOAD QUANDO USUÁRIO LOGAR =====
  useEffect(() => {
    if (user) {
      loadUserQuizzes();
    }
  }, [user]);

  return {
    // Estado
    quizzes,
    loading,
    error,

    // Operações
    saveQuiz,
    loadQuiz,
    deleteQuiz,
    duplicateQuiz,
    loadUserQuizzes,
  };
};
