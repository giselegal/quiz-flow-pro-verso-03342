/**
 * 🔄 RETRY WITH EXPONENTIAL BACKOFF
 * 
 * Fase 2.3 - Utilitário para retry com backoff exponencial
 * Usado para adicionar resiliência a operações Supabase
 */

export interface RetryOptions {
  /** Número máximo de tentativas (default: 3) */
  maxAttempts?: number;
  
  /** Delay base em ms (default: 1000) */
  baseDelayMs?: number;
  
  /** Delay máximo em ms (default: 5000) */
  maxDelayMs?: number;
  
  /** Callback chamado a cada tentativa (opcional) */
  onRetry?: (attempt: number, error: Error) => void;
  
  /** Função para determinar se deve fazer retry (default: sempre true) */
  shouldRetry?: (error: Error) => boolean;
}

/**
 * Executa uma função assíncrona com retry e exponential backoff
 * 
 * @example
 * ```ts
 * const result = await retryWithBackoff(
 *   () => funnelComponentsService.getComponents({ funnelId }),
 *   {
 *     maxAttempts: 3,
 *     baseDelayMs: 1000,
 *     onRetry: (attempt, error) => console.warn(`Retry ${attempt}:`, error)
 *   }
 * );
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 1000,
    maxDelayMs = 5000,
    onRetry,
    shouldRetry = () => true,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Se for a última tentativa ou não deve fazer retry, throw
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }

      // Calcular delay com exponential backoff: baseDelay * 2^(attempt-1)
      const exponentialDelay = baseDelayMs * Math.pow(2, attempt - 1);
      const delay = Math.min(exponentialDelay, maxDelayMs);

      // Chamar callback de retry (se fornecido)
      if (onRetry) {
        onRetry(attempt, lastError);
      }

      // Aguardar antes da próxima tentativa
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Nunca deve chegar aqui (throw acima garante isso), mas TypeScript precisa
  throw lastError || new Error('Retry failed');
}

/**
 * Verifica se um erro é de rede (conexão, timeout, etc)
 * Útil para decidir se vale a pena fazer retry
 */
export function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('connection') ||
    message.includes('fetch') ||
    message.includes('econnrefused') ||
    message.includes('enotfound')
  );
}

/**
 * Verifica se um erro é de Supabase (API)
 */
export function isSupabaseError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('supabase') ||
    message.includes('postgrest') ||
    message.includes('jwt') ||
    message.includes('auth')
  );
}
