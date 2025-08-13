import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface QuizData {
  id?: string;
  title: string;
  description: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswers: number[];
    type: 'single' | 'multiple';
  }>;
  settings: {
    timeLimit: number;
    randomizeQuestions: boolean;
    showCorrectAnswers: boolean;
  };
  author_id?: string;
}

export interface SavedQuiz {
  id: string;
  title: string;
  description: string;
  created_at: string;
  questions_count: number;
}

export const useSupabaseQuizEditor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Testar conexão com Supabase
  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('checking');
      
      // Tentar fazer uma query simples para testar a conexão
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        console.error('Erro de conexão:', error);
        setConnectionStatus('error');
        return false;
      }
      
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error('Erro inesperado:', error);
      setConnectionStatus('error');
      return false;
    }
  }, []);

  // Salvar quiz usando uma abordagem personalizada
  const saveQuiz = useCallback(async (quizData: QuizData): Promise<string | null> => {
    setIsSaving(true);
    
    try {
      // Como não temos acesso direto às tabelas de quiz, vamos usar uma tabela genérica
      // ou criar um registro na tabela de profiles com metadata
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error('Usuário não autenticado');
      }

      // Usar uma abordagem de armazenamento alternativa
      // Por exemplo, salvar no localStorage com sincronização via profiles
      const quizId = quizData.id || `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const fullQuizData = {
        ...quizData,
        id: quizId,
        author_id: user.user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Salvar no localStorage como backup
      const existingQuizzes = JSON.parse(localStorage.getItem('saved_quizzes') || '[]');
      const updatedQuizzes = existingQuizzes.filter((q: any) => q.id !== quizId);
      updatedQuizzes.push(fullQuizData);
      localStorage.setItem('saved_quizzes', JSON.stringify(updatedQuizzes));

      toast({
        title: "Quiz salvo com sucesso!",
        description: `Quiz "${quizData.title}" foi salvo localmente.`,
      });

      return quizId;
    } catch (error) {
      console.error('Erro ao salvar quiz:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o quiz.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Carregar quiz específico
  const loadQuiz = useCallback(async (quizId: string): Promise<QuizData | null> => {
    setIsLoading(true);
    
    try {
      // Carregar do localStorage
      const savedQuizzes = JSON.parse(localStorage.getItem('saved_quizzes') || '[]');
      const quiz = savedQuizzes.find((q: any) => q.id === quizId);
      
      if (!quiz) {
        throw new Error('Quiz não encontrado');
      }

      return quiz;
    } catch (error) {
      console.error('Erro ao carregar quiz:', error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar o quiz.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listar todos os quizzes salvos
  const loadAllQuizzes = useCallback(async (): Promise<SavedQuiz[]> => {
    try {
      // Carregar do localStorage
      const savedQuizzes = JSON.parse(localStorage.getItem('saved_quizzes') || '[]');
      
      return savedQuizzes.map((quiz: any) => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        created_at: quiz.created_at,
        questions_count: quiz.questions?.length || 0
      }));
    } catch (error) {
      console.error('Erro ao carregar lista de quizzes:', error);
      return [];
    }
  }, []);

  // Deletar quiz
  const deleteQuiz = useCallback(async (quizId: string): Promise<boolean> => {
    try {
      const savedQuizzes = JSON.parse(localStorage.getItem('saved_quizzes') || '[]');
      const updatedQuizzes = savedQuizzes.filter((q: any) => q.id !== quizId);
      localStorage.setItem('saved_quizzes', JSON.stringify(updatedQuizzes));

      toast({
        title: "Quiz removido",
        description: "Quiz foi removido com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar quiz:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o quiz.",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  return {
    isLoading,
    isSaving,
    connectionStatus,
    testConnection,
    saveQuiz,
    loadQuiz,
    loadAllQuizzes,
    deleteQuiz
  };
};
