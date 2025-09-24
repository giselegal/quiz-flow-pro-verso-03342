/**
 * Hook para controle de rate limiting
 * Fase 5: Security & Production Hardening
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RateLimitCheck {
  allowed: boolean;
  current?: number;
  limit?: number;
  window?: number;
  reset_time?: number;
  remaining?: number;
  retry_after?: number;
  error?: string;
}

export const useRateLimit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkRateLimit = useCallback(async (
    endpoint: string,
    identifier?: string,
    userId?: string
  ): Promise<RateLimitCheck> => {
    try {
      setIsLoading(true);
      setError(null);

      // Use IP como fallback para identifier
      const finalIdentifier = identifier || 
        (typeof window !== 'undefined' ? 'browser_session' : 'unknown');

      const { data, error } = await supabase.functions.invoke('rate-limiter/check', {
        body: {
          identifier: finalIdentifier,
          endpoint,
          user_id: userId
        }
      });

      if (error) {
        console.error('Rate limit check error:', error);
        // Fail open - permitir em caso de erro
        return { allowed: true, error: error.message };
      }

      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Rate limit check failed';
      setError(errorMessage);
      console.error('Rate limit error:', err);
      
      // Fail open para não quebrar funcionalidade
      return { allowed: true, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRateLimitStatus = useCallback(async (identifier?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (identifier) {
        params.append('identifier', identifier);
      }

      const { data, error } = await supabase.functions.invoke(
        `rate-limiter/status?${params.toString()}`
      );

      if (error) throw error;
      return data.rate_limits;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get rate limit status';
      setError(errorMessage);
      console.error('Rate limit status error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetRateLimit = useCallback(async (identifier: string, endpoint: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('rate-limiter/reset', {
        body: { identifier, endpoint }
      });

      if (error) throw error;
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset rate limit';
      setError(errorMessage);
      console.error('Rate limit reset error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRateLimitConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('rate-limiter/config');
      
      if (error) throw error;
      return data.rate_limits;

    } catch (err) {
      console.error('Failed to get rate limit config:', err);
      return {};
    }
  }, []);

  // Helper para aguardar reset do rate limit
  const waitForReset = useCallback((resetTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const waitTime = Math.max(0, resetTime - now);
    
    return new Promise(resolve => {
      setTimeout(resolve, waitTime * 1000);
    });
  }, []);

  // Helper para retry com backoff
  const retryWithBackoff = useCallback(async <T>(
    operation: () => Promise<T>,
    endpoint: string,
    identifier?: string,
    maxRetries = 3
  ): Promise<T> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Verificar rate limit antes de tentar
        const rateLimitCheck = await checkRateLimit(endpoint, identifier);
        
        if (!rateLimitCheck.allowed) {
          if (rateLimitCheck.retry_after) {
            await new Promise(resolve => 
              setTimeout(resolve, (rateLimitCheck.retry_after || 60) * 1000)
            );
            continue;
          }
          throw new Error(`Rate limit exceeded for ${endpoint}`);
        }

        return await operation();

      } catch (err) {
        if (attempt === maxRetries - 1) throw err;
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }, [checkRateLimit]);

  return {
    // State
    isLoading,
    error,

    // Actions
    checkRateLimit,
    getRateLimitStatus,
    resetRateLimit,
    getRateLimitConfig,

    // Helpers
    waitForReset,
    retryWithBackoff
  };
};