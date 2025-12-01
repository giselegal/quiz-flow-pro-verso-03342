/**
 * 🔄 usePersistence - Hook para persistência Supabase
 * 
 * Gerencia:
 * - Salvar quiz no Supabase
 * - Carregar quiz do Supabase
 * - Auto-save com debounce
 * - Status de salvamento (idle, saving, saved, error)
 * - Retry logic com exponential backoff
 * - Optimistic locking para edições concorrentes
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabaseSafe } from '@/lib/supabase-client-safe';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface PersistenceOptions {
  /** Delay para auto-save em milissegundos (padrão: 3000) */
  autoSaveDelay?: number;
  /** Máximo de tentativas de retry (padrão: 3) */
  maxRetries?: number;
  /** Exponential backoff base em ms (padrão: 1000) */
  retryBackoffMs?: number;
  /** Callback quando salvamento completa com sucesso */
  onSaveSuccess?: (quiz: QuizSchema) => void;
  /** Callback quando salvamento falha */
  onSaveError?: (error: Error) => void;
}

export interface UsePersistenceReturn {
  /** Status atual do salvamento */
  status: SaveStatus;
  /** Erro mais recente, se houver */
  error: Error | null;
  /** Timestamp do último salvamento bem-sucedido */
  lastSaved: Date | null;
  /** Salvar quiz manualmente */
  saveQuiz: (quiz: QuizSchema, quizId?: string) => Promise<void>;
  /** Carregar quiz do Supabase */
  loadQuiz: (quizId: string) => Promise<QuizSchema | null>;
  /** Limpar erro */
  clearError: () => void;
  /** Tentar novamente após erro */
  retry: () => Promise<void>;
}

export function usePersistence(options: PersistenceOptions = {}): UsePersistenceReturn {
  const {
    autoSaveDelay = 3000,
    maxRetries = 3,
    retryBackoffMs = 1000,
    onSaveSuccess,
    onSaveError,
  } = options;

  // Estado
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Refs para retry
  const lastQuizRef = useRef<QuizSchema | null>(null);
  const lastQuizIdRef = useRef<string | undefined>(undefined);
  const retryCountRef = useRef(0);

  /**
   * Salvar quiz no Supabase
   */
  const saveQuiz = useCallback(async (quiz: QuizSchema, quizId?: string) => {
    // Guardar para retry
    lastQuizRef.current = quiz;
    lastQuizIdRef.current = quizId;

    setStatus('saving');
    setError(null);

    try {
      // Verificar se é update ou insert
      const isUpdate = !!quizId;

      if (isUpdate) {
        // UPDATE: verificar versão para optimistic locking
        const { data: existing, error: fetchError } = await supabaseSafe
          .from('quiz_drafts')
          .select('version, updated_at')
          .eq('id', quizId)
          .single();

        if (fetchError) {
          throw new Error(`Erro ao buscar draft: ${fetchError.message}`);
        }

        // Incrementar versão
        const newVersion = (existing?.version ?? 0) + 1;

        // Atualizar com version check
        const slug = quiz.metadata?.name?.toLowerCase().replace(/\s+/g, '-') || `quiz-${Date.now()}`;
        const funnel_id = quiz.metadata?.id || quizId;
        
        const { error: updateError } = await supabaseSafe
          .from('quiz_drafts')
          .update({
            name: quiz.metadata?.name || 'Quiz sem título',
            slug,
            funnel_id,
            content: {
              steps: quiz.steps || [],
              metadata: quiz.metadata || {},
              theme: quiz.theme || {},
              settings: quiz.settings || {},
            },
            version: newVersion,
            updated_at: new Date().toISOString(),
          })
          .eq('id', quizId)
          .eq('version', existing?.version ?? 0); // Optimistic lock

        if (updateError) {
          // Checar se foi conflito de versão
          if (updateError.message.includes('version') || updateError.code === '23505') {
            throw new Error('Conflito de edição: outro usuário modificou este quiz. Recarregue a página.');
          }
          throw new Error(`Erro ao atualizar: ${updateError.message}`);
        }

        console.log(`✅ Draft ${quizId} atualizado (v${newVersion})`);
      } else {
        // INSERT: novo draft (UUID gerado automaticamente pelo Supabase)
        const slug = quiz.metadata?.name?.toLowerCase().replace(/\s+/g, '-') || `quiz-${Date.now()}`;
        const funnel_id = quiz.metadata?.id || `funnel-${Date.now()}`;
        
        // Obter user_id do Supabase auth (se disponível)
        const { data: { user } } = await supabaseSafe.auth.getUser();
        
        if (!user) {
          throw new Error('Usuário não autenticado. Faça login para salvar o quiz.');
        }
        
        const { data, error: insertError } = await supabaseSafe
          .from('quiz_drafts')
          .insert({
            user_id: user.id,
            funnel_id,
            name: quiz.metadata?.name || 'Quiz sem título',
            slug,
            content: {
              steps: quiz.steps || [],
              metadata: quiz.metadata || {},
              theme: quiz.theme || {},
              settings: quiz.settings || {},
            },
            version: 1,
            status: 'draft',
          })
          .select()
          .single();

        if (insertError) {
          throw new Error(`Erro ao criar draft: ${insertError.message}`);
        }

        console.log(`✅ Novo draft criado: ${data.id}`);
        lastQuizIdRef.current = data.id;
      }

      // Sucesso
      setStatus('saved');
      setLastSaved(new Date());
      retryCountRef.current = 0;
      
      if (onSaveSuccess) {
        onSaveSuccess(quiz);
      }

      // Voltar para idle após 2 segundos
      setTimeout(() => {
        setStatus('idle');
      }, 2000);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido ao salvar');
      console.error('❌ Erro ao salvar quiz:', error);

      setStatus('error');
      setError(error);

      if (onSaveError) {
        onSaveError(error);
      }

      // Tentar retry automático com exponential backoff
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        const delay = retryBackoffMs * Math.pow(2, retryCountRef.current - 1);
        
        console.log(`⏳ Tentando novamente em ${delay}ms (tentativa ${retryCountRef.current}/${maxRetries})`);
        
        setTimeout(() => {
          if (lastQuizRef.current) {
            saveQuiz(lastQuizRef.current, lastQuizIdRef.current);
          }
        }, delay);
      }
    }
  }, [maxRetries, retryBackoffMs, onSaveSuccess, onSaveError]);

  /**
   * Carregar quiz do Supabase
   */
  const loadQuiz = useCallback(async (quizId: string): Promise<QuizSchema | null> => {
    try {
      const { data, error: fetchError } = await supabaseSafe
        .from('quiz_drafts')
        .select('id, name, slug, content, version, updated_at')
        .eq('id', quizId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao carregar draft: ${fetchError.message}`);
      }

      console.log(`✅ Draft ${quizId} carregado (v${data.version})`);
      
      // Extrair dados do content JSONB
      const content = data.content as any || {};
      
      // Converter de quiz_drafts para QuizSchema
      const quizSchema: QuizSchema = {
        version: '1.0.0',
        schemaVersion: '4.0',
        metadata: {
          id: data.id,
          name: data.name,
          description: content.metadata?.description || '',
          author: content.metadata?.author || '',
          createdAt: content.metadata?.createdAt || new Date().toISOString(),
          updatedAt: data.updated_at || new Date().toISOString(),
          ...content.metadata,
        },
        theme: content.theme || {
          colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            background: '#FFFFFF',
            text: '#1F2937',
            border: '#E5E7EB',
          },
          fonts: {
            heading: 'Inter',
            body: 'Inter',
          },
          spacing: {},
          borderRadius: {},
        },
        settings: content.settings || {
          scoring: { 
            enabled: false, 
            method: 'sum' as const 
          },
          navigation: { 
            allowBack: true, 
            autoAdvance: false, 
            showProgress: true 
          },
          validation: { 
            required: true, 
            strictMode: false 
          },
        },
        steps: content.steps || [],
      };

      return quizSchema;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido ao carregar');
      console.error('❌ Erro ao carregar draft:', error);
      setError(error);
      return null;
    }
  }, []);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setError(null);
    if (status === 'error') {
      setStatus('idle');
    }
  }, [status]);

  /**
   * Retry manual
   */
  const retry = useCallback(async () => {
    if (lastQuizRef.current) {
      retryCountRef.current = 0; // Reset para retry manual
      await saveQuiz(lastQuizRef.current, lastQuizIdRef.current);
    }
  }, [saveQuiz]);

  return {
    status,
    error,
    lastSaved,
    saveQuiz,
    loadQuiz,
    clearError,
    retry,
  };
}

/**
 * Hook auxiliar para auto-save
 */
export function useAutoSave(
  quiz: QuizSchema | null,
  isDirty: boolean,
  persistence: UsePersistenceReturn,
  delay = 3000
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpar timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Só agendar se tiver quiz, estiver dirty e não estiver salvando
    if (quiz && isDirty && persistence.status !== 'saving') {
      timerRef.current = setTimeout(() => {
        console.log('💾 Auto-save disparado...');
        persistence.saveQuiz(quiz);
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [quiz, isDirty, persistence, delay]);
}
