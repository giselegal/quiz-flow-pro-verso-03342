import { useAuth } from '@/context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { QuizQuestion } from '@/types/quiz';
import { Funnel } from '../types/unified-schema';
import type { Json } from '@/integrations/supabase/types';
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
                  required: true,
                  options: block.properties?.options || [],
                  multiSelect: block.properties?.multiSelect || 1,
                  order: page.page_order || 0,
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
          version: (funnel as any).version || 1,
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
      // 1) Criar funil no schema unificado
      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .insert([
          {
            id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `funnel_${Date.now()}`) as string,
            name: metadata.title,
            description: metadata.description,
            user_id: user.id,
            is_published: false,
            version: 1,
            settings: {
              ...metadata.settings,
              category: metadata.category,
              difficulty: metadata.difficulty,
              timeLimit: metadata.timeLimit,
              isPublic: metadata.isPublic,
              showProgress: metadata.settings?.showProgress,
            },
          },
        ])
        .select()
        .single();

      if (funnelError) throw funnelError;
      const funnelId = funnelData.id;

      // 2) Criar páginas de pergunta no funil
      if (questions.length > 0) {
        const pagesToInsert = questions.map((q, idx) => ({
          funnel_id: funnelId,
          page_type: 'question',
          page_order: idx,
          title: q.title || q.question || q.text || `Pergunta ${idx + 1}`,
          blocks: ([
            {
              id: q.id || `q_${idx + 1}`,
              type: 'quiz-question',
              properties: {
                question: q.title || q.question || q.text,
                questionType: q.type === 'normal' ? 'multiple_choice' : q.type,
                options: q.options || [],
                multiSelect: q.multiSelect || 1,
              },
              order: 0,
            },
          ]) as unknown as Json,
          metadata: ({} as unknown) as Json,
          // Insert requires id per types
          id: crypto.randomUUID(),
        }));

        const { error: pagesError } = await supabase.from('funnel_pages').insert(pagesToInsert);
        if (pagesError) throw pagesError;
      }

      // 3) Recarregar lista de funis (formato compatível com quizzes)
      await loadUserQuizzes();

      toast({
        title: 'Sucesso!',
        description: `Quiz "${metadata.title}" salvo como funil com sucesso`,
      });

      return funnelId;
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
        .eq('id', quizId)
        .single();

      if (error) throw error;

      const questions: QuizQuestion[] = [];
      data.funnel_pages?.forEach((page: any) => {
        if (page.page_type === 'question' && page.blocks) {
          const blocks = Array.isArray(page.blocks) ? page.blocks : [];
          blocks.forEach((block: any) => {
            if (block.type === 'quiz-question' || block.type === 'question') {
              questions.push({
                id: block.id || `q_${page.id}`,
                title: block.properties?.question || page.title || '',
                question: block.properties?.question || page.title || '',
                text: block.properties?.question || page.title || '',
                type: block.properties?.questionType || 'normal',
                options: block.properties?.options || [],
                multiSelect: block.properties?.multiSelect || 1,
                order: page.page_order || 0,
              });
            }
          });
        }
      });

      const formattedQuiz: SavedQuiz = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        user_id: data.user_id || '',
        is_published: data.is_published || false,
        version: (data as any).version || 1,
        settings: data.settings || {},
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        questions,
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
      // Remover páginas do funil primeiro (caso não haja cascade)
      await supabase.from('funnel_pages').delete().eq('funnel_id', quizId);
      const { error } = await supabase.from('funnels').delete().eq('id', quizId);

      if (error) throw error;

      // Recarregar lista
      await loadUserQuizzes();

      toast({
        title: 'Sucesso',
        description: 'Quiz/funil excluído com sucesso',
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
      title: `${originalQuiz.name} (Cópia)`,
      description: originalQuiz.description || '',
      category: (originalQuiz as any).category || originalQuiz.settings?.category || 'geral',
      difficulty: (originalQuiz as any).difficulty || originalQuiz.settings?.difficulty || 'easy',
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
