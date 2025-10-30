/**
 * 🎯 FASE 3.3: OPTIMIZATIONS PARA QUIZAPPCONNECTED
 * 
 * Otimizações implementadas:
 * 1. Eliminar carregamentos duplicados
 * 2. Implementar prefetch inteligente do próximo step
 * 3. Memoizar configurações mescladas
 * 4. Garantir preview 100% offline (sem fetches)
 * 
 * META: -60% re-renders, 100% preview offline
 */

import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import type { QuizConfig } from '@/types/quiz-config';
import { blockRegistry } from '@/registry/UnifiedBlockRegistry';
import { getPreloadBlocks } from '@/registry/blockCategories';
import { appLogger } from '@/utils/logger';

// ============================================================================
// HOOK: MEMOIZED MERGED CONFIG
// ============================================================================

/**
 * ✅ FASE 3.3: Memoização de configurações mescladas
 * 
 * Evita re-renders ao mesclar globalConfig + themeConfig + stepConfig
 * Apenas re-calcula quando configs realmente mudam
 */
export function useMemoizedMergedConfig(
    globalConfig?: any,
    themeConfig?: any,
    stepConfig?: any,
) {
    return useMemo(() => {
        const merged = {
            // Global configs (lowest priority)
            ...(globalConfig || {}),
            
            // Theme configs (medium priority)
            ...(themeConfig || {}),
            
            // Step-specific configs (highest priority)
            ...(stepConfig || {}),
            
            // Metadata
            _mergedAt: Date.now(),
            _sources: {
                hasGlobal: !!globalConfig,
                hasTheme: !!themeConfig,
                hasStep: !!stepConfig,
            },
        };

        appLogger.debug('[useMemoizedMergedConfig] Config merged', {
            globalKeys: Object.keys(globalConfig || {}).length,
            themeKeys: Object.keys(themeConfig || {}).length,
            stepKeys: Object.keys(stepConfig || {}).length,
            mergedKeys: Object.keys(merged).length,
        });

        return merged;
    }, [globalConfig, themeConfig, stepConfig]);
}

// ============================================================================
// HOOK: INTELLIGENT PREFETCH
// ============================================================================

/**
 * ✅ FASE 3.3: Prefetch inteligente do próximo step
 * 
 * Pré-carrega blocos do próximo step de forma não-bloqueante
 * quando usuário está próximo de avançar
 */
export function useIntelligentPrefetch(
    currentStepId: string,
    nextStepId?: string,
    currentStepNumber?: number,
) {
    const hasPrefetched = useRef<Set<string>>(new Set());

    useEffect(() => {
        // Evitar prefetch duplicado
        if (!nextStepId || hasPrefetched.current.has(nextStepId)) {
            return;
        }

        // Delay para não bloquear interação atual
        const timer = setTimeout(() => {
            appLogger.info('[useIntelligentPrefetch] Prefetching next step', {
                current: currentStepId,
                next: nextStepId,
            });

            // Marcar como prefetchado
            hasPrefetched.current.add(nextStepId);

            // Prefetch baseado em estratégias (Step 15+ = result blocks, etc)
            if (currentStepNumber) {
                const preloadBlocks = getPreloadBlocks(currentStepNumber);
                
                if (preloadBlocks.length > 0) {
                    blockRegistry.prefetchBatch(preloadBlocks);
                    
                    appLogger.debug('[useIntelligentPrefetch] Strategy-based prefetch', {
                        stepNumber: currentStepNumber,
                        blocks: preloadBlocks,
                    });
                }
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentStepId, nextStepId, currentStepNumber]);
}

// ============================================================================
// HOOK: PREVENT DUPLICATE LOADS
// ============================================================================

/**
 * ✅ FASE 3.3: Prevenir carregamentos duplicados
 * 
 * Rastreia chamadas de load/fetch e previne duplicatas
 * Útil quando múltiplos hooks tentam carregar a mesma config
 */
export function useLoadingDeduplication() {
    const loadingRef = useRef<Map<string, Promise<any>>>(new Map());

    const load = useCallback(async <T,>(
        key: string,
        loader: () => Promise<T>,
    ): Promise<T> => {
        // Verificar se já está carregando
        const existing = loadingRef.current.get(key);
        if (existing) {
            appLogger.debug('[useLoadingDeduplication] Reusing existing load', { key });
            return existing as Promise<T>;
        }

        // Iniciar novo carregamento
        const promise = loader()
            .finally(() => {
                // Remover da lista após completar
                loadingRef.current.delete(key);
            });

        loadingRef.current.set(key, promise);
        
        appLogger.debug('[useLoadingDeduplication] Starting new load', { key });
        
        return promise;
    }, []);

    const isLoading = useCallback((key: string) => {
        return loadingRef.current.has(key);
    }, []);

    const clearCache = useCallback(() => {
        loadingRef.current.clear();
        appLogger.debug('[useLoadingDeduplication] Cache cleared');
    }, []);

    return useMemo(() => ({
        load,
        isLoading,
        clearCache,
    }), [load, isLoading, clearCache]);
}

// ============================================================================
// HOOK: OFFLINE-FIRST CONFIG
// ============================================================================

/**
 * ✅ FASE 3.3: Configuração offline-first para preview
 * 
 * Em modo preview, usa initialConfig sem fazer fetches
 * Em produção, faz fetch normal
 */
export function useOfflineFirstConfig(
    previewMode: boolean,
    initialConfig?: any,
    onlineFetcher?: () => Promise<any>,
) {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadConfig() {
            // ✅ Preview mode: usar initialConfig (100% offline)
            if (previewMode) {
                if (initialConfig) {
                    appLogger.info('[useOfflineFirstConfig] Using initialConfig (offline)', {
                        keys: Object.keys(initialConfig).length,
                    });
                    setConfig(initialConfig);
                    setIsLoading(false);
                    setError(null);
                } else {
                    appLogger.warn('[useOfflineFirstConfig] Preview mode but no initialConfig');
                    setConfig(null);
                    setIsLoading(false);
                }
                return;
            }

            // ✅ Production mode: fetch online
            if (!onlineFetcher) {
                setConfig(null);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                
                appLogger.info('[useOfflineFirstConfig] Fetching online config');
                const data = await onlineFetcher();
                
                if (!cancelled) {
                    setConfig(data);
                    setIsLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    appLogger.error('[useOfflineFirstConfig] Fetch failed', err);
                    setError(err as Error);
                    setIsLoading(false);
                }
            }
        }

        loadConfig();

        return () => {
            cancelled = true;
        };
    }, [previewMode, initialConfig, onlineFetcher]);

    return useMemo(() => ({
        config,
        isLoading,
        error,
    }), [config, isLoading, error]);
}

// ============================================================================
// HOOK: MEMOIZED CALLBACKS
// ============================================================================

/**
 * ✅ FASE 3.3: Callbacks memoizados para prevenir re-renders
 * 
 * Wrapper para useCallback que inclui logging e tracking
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: React.DependencyList,
    debugName?: string,
): T {
    const callCount = useRef(0);

    return useCallback((...args: Parameters<T>) => {
        callCount.current++;
        
        if (debugName && callCount.current % 10 === 0) {
            appLogger.debug(`[useMemoizedCallback] ${debugName} called ${callCount.current} times`);
        }
        
        return callback(...args);
    }, deps) as T;
}

// ============================================================================
// HOOK: STEP CACHE
// ============================================================================

/**
 * ✅ FASE 3.3: Cache de steps para evitar re-fetches
 * 
 * Mantém steps carregados em memória por tempo determinado
 */
export function useStepCache(ttl: number = 5 * 60 * 1000) {
    const cache = useRef<Map<string, {
        data: any;
        timestamp: number;
    }>>(new Map());

    const get = useCallback((stepId: string) => {
        const entry = cache.current.get(stepId);
        if (!entry) return null;

        // Verificar TTL
        if (Date.now() - entry.timestamp > ttl) {
            cache.current.delete(stepId);
            return null;
        }

        appLogger.debug('[useStepCache] Cache hit', { stepId });
        return entry.data;
    }, [ttl]);

    const set = useCallback((stepId: string, data: any) => {
        cache.current.set(stepId, {
            data,
            timestamp: Date.now(),
        });
        appLogger.debug('[useStepCache] Cache set', { stepId });
    }, []);

    const clear = useCallback(() => {
        cache.current.clear();
        appLogger.debug('[useStepCache] Cache cleared');
    }, []);

    const has = useCallback((stepId: string) => {
        const entry = cache.current.get(stepId);
        if (!entry) return false;
        
        // Verificar TTL
        if (Date.now() - entry.timestamp > ttl) {
            cache.current.delete(stepId);
            return false;
        }
        
        return true;
    }, [ttl]);

    return useMemo(() => ({
        get,
        set,
        clear,
        has,
        size: () => cache.current.size,
    }), [get, set, clear, has]);
}

// ============================================================================
// EXPORTS
// ============================================================================
