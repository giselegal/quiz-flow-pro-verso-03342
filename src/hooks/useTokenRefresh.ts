/**
 * 🔐 useTokenRefresh
 * 
 * Hook para refresh proativo de tokens de autenticação
 * 
 * @features
 * - Refresh automático a cada 45min (antes de expirar)
 * - Salva draft localmente se sessão expirar
 * - Notifica usuário sobre renovação
 * - Limpa timer no unmount
 * 
 * @usage
 * ```tsx
 * function QuizModularEditor() {
 *   useTokenRefresh({
 *     onSessionExpired: () => saveToLocalStorage(),
 *     onRefreshSuccess: () => console.log('Token renovado')
 *   });
 * }
 * ```
 */

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface UseTokenRefreshOptions {
  /**
   * Callback quando sessão expira (save draft local)
   */
  onSessionExpired?: () => void;
  
  /**
   * Callback quando refresh é bem-sucedido
   */
  onRefreshSuccess?: () => void;
  
  /**
   * Callback quando refresh falha
   */
  onRefreshError?: (error: Error) => void;
  
  /**
   * Intervalo de refresh em ms (default: 45min = 2700000ms)
   * Sessões Supabase expiram em 1h, fazemos refresh 15min antes
   */
  refreshInterval?: number;
}

/**
 * Hook para gerenciar refresh proativo de tokens
 */
export function useTokenRefresh({
  onSessionExpired,
  onRefreshSuccess,
  onRefreshError,
  refreshInterval = 45 * 60 * 1000, // 45 minutos
}: UseTokenRefreshOptions = {}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    async function refreshSession() {
      if (!isMountedRef.current) return;

      try {
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
          console.error('[useTokenRefresh] Erro ao renovar sessão:', error);
          onRefreshError?.(error);
          
          // Se sessão expirou, salva draft local
          if (error.message?.includes('session') || error.message?.includes('expired')) {
            onSessionExpired?.();
          }
          return;
        }

        if (data?.session) {
          console.log('[useTokenRefresh] ✅ Token renovado com sucesso');
          onRefreshSuccess?.();
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('[useTokenRefresh] Exception ao renovar:', error);
        onRefreshError?.(error);
      }
    }

    // Refresh inicial após 45min
    timerRef.current = setTimeout(() => {
      refreshSession();
      
      // Configura loop de refresh
      timerRef.current = setInterval(refreshSession, refreshInterval);
    }, refreshInterval);

    // Cleanup: limpa timers no unmount
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        clearInterval(timerRef.current);
      }
    };
  }, [refreshInterval, onSessionExpired, onRefreshSuccess, onRefreshError]);

  // Método para forçar refresh manual (útil para testes)
  const forceRefresh = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[useTokenRefresh] Erro no refresh manual:', error);
      throw error;
    }
  };

  return { forceRefresh };
}
