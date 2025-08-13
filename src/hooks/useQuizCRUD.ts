import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { QuizQuestion } from '@/types/quiz';
import { useEffect, useState } from 'react';

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

export interface SavedQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  author_id: string;
  questions: QuizQuestion[];
  settings: any;
  is_published: boolean;
  created_at: string;
  updated_at: string;
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
  const loadUserQuizzes = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(
          `
          id,
          title,
          description,
          category,
          difficulty,
          author_id,
          settings,
          is_published,
          created_at,
          updated_at,
          questions (
            id,
            question_text,
            question_type,
            options,
            correct_answers,
            points,
            order_index
          )
        `
        )
        .eq('author_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Converter formato Supabase para formato interno
      const formattedQuizzes = data.map(quiz => ({
        ...quiz,
        questions: quiz.questions.map((q: any) => ({
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
      }));

      setQuizzes(formattedQuizzes);
    } catch (err) {
      console.error('Erro ao carregar quizzes:', err);
      setError('Erro ao carregar seus quizzes');
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seus quizzes',
        variant: 'destructive',
      });
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
