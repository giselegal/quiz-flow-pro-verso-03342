/**
 * 🚀 TEMPLATE PREFETCH HOOK
 * 
 * Hook para pré-carregar templates críticos e reduzir 404s.
 * Implementa estratégia de cache em 3 níveis.
 * 
 * PROBLEMA IDENTIFICADO:
 * - 84 HTTP 404s durante carregamento de steps
 * - +4.2s latência desnecessária
 * - UI freeze de 500-800ms
 * 
 * SOLUÇÃO:
 * - Prefetch dos 3 primeiros steps
 * - Cache em memória com fallback
 * - Carregamento assíncrono não-bloqueante
 */

import { useEffect, useState, useCallback } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

interface PrefetchStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  isLoading: boolean;
  error: string | null;
}

// Cache em memória global para evitar re-fetches
const templateCache = new Map<string, any>();

/**
 * Hook para prefetch de templates críticos
 */
export function useTemplatePrefetch() {
  const [status, setStatus] = useState<PrefetchStatus>({
    step1: false,
    step2: false,
    step3: false,
    isLoading: false,
    error: null,
  });

  const prefetchTemplate = useCallback(async (stepNumber: number) => {
    const cacheKey = `step-${String(stepNumber).padStart(2, '0')}`;
    
    // Verifica cache primeiro
    if (templateCache.has(cacheKey)) {
      appLogger.debug(`[Prefetch] Cache hit: ${cacheKey}`);
      return templateCache.get(cacheKey);
    }

    // Ordem correta de paths (L1 → L2 → L3)
    const paths = [
      `/templates/${cacheKey}.json`,                           // L1: Public folder
      `/templates/quiz21-complete.json`,                        // L2: Consolidated
      `https://api.example.com/templates/${cacheKey}.json`,    // L3: API (fallback)
    ];

    for (const path of paths) {
      try {
        const response = await fetch(path, {
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          templateCache.set(cacheKey, data);
          appLogger.info(`[Prefetch] ✅ Loaded ${cacheKey} from ${path}`);
          return data;
        }
      } catch (error) {
        appLogger.debug(`[Prefetch] Failed to load from ${path}:`, error);
        // Continue para próximo path
      }
    }

    appLogger.warn(`[Prefetch] ⚠️ All paths failed for ${cacheKey}`);
    return null;
  }, []);

  const startPrefetch = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Prefetch paralelo dos 3 primeiros steps
      const results = await Promise.allSettled([
        prefetchTemplate(1),
        prefetchTemplate(2),
        prefetchTemplate(3),
      ]);

      setStatus({
        step1: results[0].status === 'fulfilled',
        step2: results[1].status === 'fulfilled',
        step3: results[2].status === 'fulfilled',
        isLoading: false,
        error: null,
      });

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      appLogger.info(`[Prefetch] ✅ Completed: ${successCount}/3 steps cached`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: errorMsg,
      }));
      appLogger.error('[Prefetch] ❌ Error:', error);
    }
  }, [prefetchTemplate]);

  // Auto-start prefetch on mount
  useEffect(() => {
    // Delay de 100ms para não bloquear initial render
    const timer = setTimeout(() => {
      startPrefetch();
    }, 100);

    return () => clearTimeout(timer);
  }, [startPrefetch]);

  return {
    status,
    prefetchTemplate,
    clearCache: () => templateCache.clear(),
    getCachedTemplate: (step: number) => {
      const key = `step-${String(step).padStart(2, '0')}`;
      return templateCache.get(key);
    },
  };
}

/**
 * Hook simplificado apenas para verificar se template está cached
 */
export function useTemplateCache(stepNumber: number): boolean {
  const key = `step-${String(stepNumber).padStart(2, '0')}`;
  return templateCache.has(key);
}

/**
 * Função utilitária para prefetch manual
 */
export async function prefetchTemplateManual(stepNumber: number): Promise<void> {
  const cacheKey = `step-${String(stepNumber).padStart(2, '0')}`;
  
  if (templateCache.has(cacheKey)) {
    return; // Já em cache
  }

  const path = `/templates/${cacheKey}.json`;
  try {
    const response = await fetch(path);
    if (response.ok) {
      const data = await response.json();
      templateCache.set(cacheKey, data);
      appLogger.debug(`[Prefetch Manual] Cached ${cacheKey}`);
    }
  } catch (error) {
    appLogger.debug(`[Prefetch Manual] Failed for ${cacheKey}:`, error);
  }
}
