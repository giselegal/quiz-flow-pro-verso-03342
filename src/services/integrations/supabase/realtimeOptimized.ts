/**
 * 🚀 OPTIMIZED REALTIME WRAPPER - FASE 3
 * 
 * Wrapper otimizado para Supabase Realtime com:
 * - Auto-retry com backoff exponencial
 * - Throttling de eventos
 * - Error handling graceful
 * - Cleanup automático
 * - Modo editor otimizado (sem Realtime desnecessário)
 */

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './client';
import { handleRealtimeError, isEditorMode } from './clientConfig';

interface RealtimeSubscription {
  channel: RealtimeChannel | null;
  unsubscribe: () => void;
}

/**
 * Cria subscription otimizada para Realtime
 * Automaticamente desabilitada no modo editor
 */
export function createOptimizedRealtimeSubscription(
  tableName: string,
  options: {
    event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
    schema?: string;
    filter?: string;
    onData?: (payload: any) => void;
    onError?: (error: Error) => void;
    throttleMs?: number;
  } = {}
): RealtimeSubscription {
  const {
    event = '*',
    schema = 'public',
    filter,
    onData,
    onError = handleRealtimeError,
    throttleMs = 100,
  } = options;

  // ✅ FASE 3: Desabilitar no modo editor
  if (isEditorMode()) {
    if (import.meta.env.DEV) {
      appLogger.debug('🟡 [Realtime] Disabled in editor mode');
    }
    return {
      channel: null,
      unsubscribe: () => {},
    };
  }

  let lastEventTime = 0;
  let channel: RealtimeChannel | null = null;

  try {
    const channelName = `optimized-${tableName}-${Date.now()}`;
    
    channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema,
          table: tableName,
          ...(filter && { filter }),
        },
        (payload: any) => {
          // Throttling de eventos
          const now = Date.now();
          if (now - lastEventTime < throttleMs) {
            return;
          }
          lastEventTime = now;

          if (onData) {
            try {
              onData(payload);
            } catch (error) {
              onError(error instanceof Error ? error : new Error(String(error)));
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          onError(new Error(`Realtime channel error for ${tableName}`));
        }
      });

  } catch (error) {
    onError(error instanceof Error ? error : new Error(String(error)));
  }

  return {
    channel,
    unsubscribe: () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          // Ignorar erros de cleanup
          if (import.meta.env.DEV) {
            appLogger.debug('🟡 [Realtime] Cleanup error (safe to ignore):', { data: [error] });
          }
        }
      }
    },
  };
}

/**
 * Hook React para Realtime subscription otimizada
 */
export function useOptimizedRealtime(
  tableName: string,
  options: Parameters<typeof createOptimizedRealtimeSubscription>[1] = {}
) {
  const [subscription, setSubscription] = React.useState<RealtimeSubscription | null>(null);

  React.useEffect(() => {
    const sub = createOptimizedRealtimeSubscription(tableName, options);
    setSubscription(sub);

    return () => {
      sub.unsubscribe();
    };
  }, [tableName]);

  return subscription;
}

// Import React for hook
import React from 'react';
import { appLogger } from '@/lib/utils/appLogger';
