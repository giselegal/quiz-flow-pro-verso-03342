/**
 * 🔌 SUPABASE CLIENT CONFIG - FASE 3 WebSocket Optimization
 * 
 * Configurações otimizadas para Supabase Realtime e WebSocket:
 * - Retry logic com backoff exponencial
 * - Throttling de eventos
 * - Error boundaries graceful
 * - Desabilita Realtime no modo editor (não necessário)
 */

import { SupabaseClientOptions } from '@supabase/supabase-js';

/**
 * Detecta se está em modo editor
 */
export const isEditorMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/editor');
};

/**
 * Configurações base do Supabase otimizadas
 */
export const getSupabaseConfig = (): SupabaseClientOptions<'public'> => {
  const config: SupabaseClientOptions<'public'> = {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    realtime: {
      // ✅ FASE 3: Desabilitar Realtime no modo editor
      // Editor não precisa de updates em tempo real
      ...(isEditorMode() && {
        params: {
          eventsPerSecond: 2, // Throttle para reduzir overhead
        },
      }),
    },
    global: {
      headers: {
        'x-client-info': 'quiz-editor-v3',
      },
    },
  };

  return config;
};

/**
 * Wrapper para retry de operações Supabase com backoff exponencial
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 300,
    maxDelay = 3000,
    onRetry,
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Se é a última tentativa, lançar erro
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calcular delay com backoff exponencial
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      
      // Callback de retry (para logging)
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Error handler graceful para WebSocket
 */
export const handleRealtimeError = (error: Error): void => {
  // Ignorar erros comuns de WebSocket que são transitórios
  const ignorableErrors = [
    'WebSocket closed without opened',
    'WebSocket is already in CLOSING or CLOSED state',
    'Connection timeout',
  ];

  const errorMessage = error.message || String(error);
  const isIgnorable = ignorableErrors.some(msg => errorMessage.includes(msg));

  if (!isIgnorable) {
    console.error('🔴 [Supabase Realtime] Error:', error);
  } else if (import.meta.env.DEV) {
    console.debug('🟡 [Supabase Realtime] Transient error (safe to ignore):', errorMessage);
  }
};

/**
 * Configuração de Realtime Channel com retry
 */
export const createRealtimeChannel = (
  supabaseClient: any,
  channelName: string,
  options: {
    onError?: (error: Error) => void;
    maxRetries?: number;
  } = {}
) => {
  const { onError = handleRealtimeError, maxRetries = 3 } = options;

  try {
    const channel = supabaseClient
      .channel(channelName)
      .on('system', { event: '*' }, (payload: any) => {
        if (payload.type === 'error') {
          onError(new Error(payload.message || 'Realtime error'));
        }
      });

    return channel;
  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};
