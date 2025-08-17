import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/lib/supabase';

export type QuizResult = Database['public']['Tables']['quiz_results']['Row'];

/**
 * Busca um resultado específico pelo ID
 */
export async function getQuizResultById(resultId: string): Promise<QuizResult | null> {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('id', resultId)
    .single();

  if (error) {
    console.error('Erro ao buscar resultado:', error);
    return null;
  }

  return data;
}

/**
 * Busca informações do usuário associado à sessão do resultado
 */
export async function getUserBySessionId(sessionId: string) {
  const { data, error } = await supabase
    .from('quiz_users')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }

  return data;
}

/**
 * Busca a sessão de quiz relacionada ao resultado
 */
export async function getQuizSessionById(sessionId: string) {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Erro ao buscar sessão:', error);
    return null;
  }

  return data;
}

/**
 * Busca as respostas dos passos do quiz para a sessão
 */
export async function getStepResponses(sessionId: string) {
  const { data, error } = await supabase
    .from('quiz_step_responses')
    .select('*')
    .eq('session_id', sessionId)
    .order('step_number', { ascending: true });

  if (error) {
    console.error('Erro ao buscar respostas:', error);
    return [];
  }

  return data;
}
