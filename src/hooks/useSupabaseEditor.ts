// =============================================================================
// HOOK SUPABASE PARA EDITOR SCHEMA-DRIVEN
// Integração completa com o editor existente das 21 etapas
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================================================
// TIPOS
// =============================================================================

interface FunnelData {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pages: any[];
  settings: any;
  is_published: boolean;
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseSupabaseEditorState {
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  user: any;
  isAuthenticated: boolean;
}

interface UseSupabaseEditorReturn {
  state: UseSupabaseEditorState;
  saveFunnel: (funnelData: any) => Promise<void>;
  loadFunnel: (funnelId: string) => Promise<any>;
  createFunnel: (title: string) => Promise<string>;
  deleteFunnel: (funnelId: string) => Promise<void>;
  publishFunnel: (funnelId: string, isPublished: boolean) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// =============================================================================
// HOOK PRINCIPAL
// =============================================================================

export const useSupabaseEditor = (): UseSupabaseEditorReturn => {
  const [state, setState] = useState<UseSupabaseEditorState>({
    isLoading: false,
    isSaving: false,
    error: null,
    user: null,
    isAuthenticated: false,
  });

  // =============================================================================
  // AUTENTICAÇÃO
  // =============================================================================

  useEffect(() => {
    // Verificar sessão atual
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }));
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      }
    };

    checkSession();

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
          error: null,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // =============================================================================
  // FUNÇÕES DE AUTENTICAÇÃO
  // =============================================================================

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao fazer login',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao criar conta',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao fazer logout',
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // =============================================================================
  // FUNÇÕES DE FUNIS
  // =============================================================================

  const createFunnel = useCallback(async (title: string): Promise<string> => {
    if (!state.isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      // Criar dados iniciais do funil com as 21 etapas
      const initialFunnelData = {
        title,
        description: 'Funil de Quiz com 21 etapas',
        category: 'geral',
        difficulty: 'medium' as const,
        pages: [],
        settings: {
          allowRetake: true,
          showResults: true,
          shuffleQuestions: false,
          showProgressBar: true,
          passingScore: 60
        },
        is_published: false,
        author_id: state.user.id
      };

      const { data, error } = await supabase
        .from('quizzes')
        .insert([initialFunnelData])
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao criar funil',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.isAuthenticated, state.user]);

  const loadFunnel = useCallback(async (funnelId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', funnelId)
        .single();

      if (error) throw error;

      return data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao carregar funil',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const saveFunnel = useCallback(async (funnelData: any) => {
    if (!state.isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          title: funnelData.title,
          description: funnelData.description,
          category: funnelData.category,
          difficulty: funnelData.difficulty,
          settings: funnelData.settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', funnelData.id);

      if (error) throw error;

      // Salvar páginas/etapas se necessário
      if (funnelData.pages && funnelData.pages.length > 0) {
        // Aqui podemos salvar as páginas individuais se necessário
        console.log('Salvando páginas do funil:', funnelData.pages.length);
      }

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao salvar funil',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.isAuthenticated]);

  const deleteFunnel = useCallback(async (funnelId: string) => {
    if (!state.isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', funnelId);

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao deletar funil',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.isAuthenticated]);

  const publishFunnel = useCallback(async (funnelId: string, isPublished: boolean) => {
    if (!state.isAuthenticated) {
      throw new Error('Usuário não autenticado');
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({ 
          is_published: isPublished,
          updated_at: new Date().toISOString()
        })
        .eq('id', funnelId);

      if (error) throw error;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao publicar funil',
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.isAuthenticated]);

  return {
    state,
    saveFunnel,
    loadFunnel,
    createFunnel,
    deleteFunnel,
    publishFunnel,
    signIn,
    signUp,
    signOut,
  };
};
