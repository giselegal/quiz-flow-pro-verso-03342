/**
 * 🎯 FEATURE FLAGS SYSTEM
 * 
 * Sistema centralizado de feature flags para controlar rollout de features.
 * Flags persistidas em localStorage para testes locais.
 * 
 * BENEFÍCIOS:
 * - Rollout gradual de features
 * - A/B testing
 * - Rollback rápido sem deploy
 * - Testes de features em produção
 * 
 * @example
 * ```typescript
 * import { featureFlags, setFeatureFlag } from '@/core/utils/featureFlags';
 * 
 * // Verificar flag
 * if (featureFlags.useUnifiedEditor) {
 *   return <EditorUnified />;
 * }
 * 
 * // Ativar flag (dev/admin)
 * setFeatureFlag('useUnifiedEditor', true);
 * ```
 */

const STORAGE_KEY = 'featureFlags';

/**
 * Definição de todas as feature flags disponíveis
 */
export interface FeatureFlags {
    // Editor Architecture
    useUnifiedEditor: boolean;
    useUnifiedContext: boolean;
    useSinglePropertiesPanel: boolean;
    useCoreDraftHook: boolean;
    
    // Performance
    enableLazyLoading: boolean;
    enableAdvancedValidation: boolean;
    usePersistenceService: boolean;
    
    // Developer Experience
    enableErrorBoundaries: boolean;
    enablePerformanceMonitoring: boolean;
    enableDebugPanel: boolean;
    
    // Experimental
    enableExperimentalFeatures: boolean;
    useNewUIComponents: boolean;
    enableAccessibilityEnhancements: boolean;
}

/**
 * Valores padrão das flags
 * Em desenvolvimento, flags experimentais são habilitadas por padrão.
 */
const DEFAULT_FLAGS: FeatureFlags = {
    // Editor Architecture - Habilitadas em desenvolvimento
    useUnifiedEditor: import.meta.env.DEV,
    useUnifiedContext: import.meta.env.DEV,
    useSinglePropertiesPanel: import.meta.env.DEV,
    useCoreDraftHook: false, // Experimental - desabilitado por padrão
    
    // Performance - Sempre habilitadas
    enableLazyLoading: true,
    enableAdvancedValidation: true,
    usePersistenceService: true,
    
    // Developer Experience
    enableErrorBoundaries: true,
    enablePerformanceMonitoring: import.meta.env.DEV,
    enableDebugPanel: import.meta.env.DEV,
    
    // Experimental - Apenas em desenvolvimento
    enableExperimentalFeatures: import.meta.env.DEV,
    useNewUIComponents: import.meta.env.DEV,
    enableAccessibilityEnhancements: true,
};

/**
 * Cache em memória das flags
 */
let cachedFlags: FeatureFlags | null = null;

/**
 * Carrega flags do localStorage
 */
function loadFlags(): FeatureFlags {
    if (cachedFlags) {
        return cachedFlags;
    }
    
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const stored = localStorage.getItem(STORAGE_KEY);
            
            if (stored) {
                const parsed = JSON.parse(stored);
                
                if (typeof parsed === 'object' && parsed !== null) {
                    // Mesclar com defaults
                    const mergedFlags: FeatureFlags = { ...DEFAULT_FLAGS, ...parsed };
                    
                    // Garantir que valores são booleanos
                    (Object.keys(mergedFlags) as Array<keyof FeatureFlags>).forEach(key => {
                        if (typeof mergedFlags[key] !== 'boolean') {
                            mergedFlags[key] = DEFAULT_FLAGS[key];
                        }
                    });
                    
                    cachedFlags = mergedFlags;
                    return mergedFlags;
                }
            }
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('Failed to load feature flags:', error);
        }
    }
    
    cachedFlags = { ...DEFAULT_FLAGS };
    return cachedFlags;
}

/**
 * Persiste flags no localStorage
 */
function saveFlags(flags: FeatureFlags): void {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
        }
    } catch (error) {
        if (import.meta.env.DEV) {
            console.warn('Failed to save feature flags:', error);
        }
    }
}

/**
 * Obtém o valor de uma feature flag
 * 
 * @param flag Nome da feature flag
 * @returns Valor booleano da flag
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(
    flag: K
): FeatureFlags[K] {
    const flags = loadFlags();
    return flags[flag];
}

/**
 * Definir valor de uma flag
 */
export function setFeatureFlag<K extends keyof FeatureFlags>(
    key: K,
    value: FeatureFlags[K]
): void {
    const flags = loadFlags();
    flags[key] = value;
    cachedFlags = flags;
    saveFlags(flags);
    
    // Disparar evento para componentes reagirem
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('featureFlagChanged', {
            detail: { key, value }
        }));
    }
}

/**
 * Resetar uma flag para valor padrão
 */
export function resetFeatureFlag(key: keyof FeatureFlags): void {
    const flags = loadFlags();
    flags[key] = DEFAULT_FLAGS[key];
    cachedFlags = flags;
    saveFlags(flags);
    
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('featureFlagChanged', {
            detail: { key, value: DEFAULT_FLAGS[key] }
        }));
    }
}

/**
 * Resetar todas as flags para valores padrão
 */
export function resetAllFeatureFlags(): void {
    cachedFlags = { ...DEFAULT_FLAGS };
    saveFlags(cachedFlags);
    
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('featureFlagsReset'));
    }
}

/**
 * Alias para resetAllFeatureFlags (compatibilidade com testes)
 */
export function resetFeatureFlags(): void {
    resetAllFeatureFlags();
}

/**
 * Obter todas as flags atuais
 * 
 * @returns Objeto com todas as flags e seus valores
 */
export function getAllFeatureFlags(): FeatureFlags {
    return { ...loadFlags() };
}

/**
 * Proxy para acesso reativo às flags
 */
export const featureFlags = new Proxy({} as FeatureFlags, {
    get(_target, prop: keyof FeatureFlags) {
        return getFeatureFlag(prop);
    },
});

/**
 * Hook React para usar feature flags com reatividade
 */
import { useEffect, useState } from 'react';

export function useFeatureFlag(key: keyof FeatureFlags): boolean {
    const [value, setValue] = useState(() => getFeatureFlag(key));
    
    useEffect(() => {
        const handler = (e: Event) => {
            const event = e as CustomEvent<{ key: keyof FeatureFlags; value: boolean }>;
            if (event.detail.key === key) {
                setValue(event.detail.value);
            }
        };
        
        const resetHandler = () => {
            setValue(DEFAULT_FLAGS[key]);
        };
        
        window.addEventListener('featureFlagChanged', handler as EventListener);
        window.addEventListener('featureFlagsReset', resetHandler);
        
        return () => {
            window.removeEventListener('featureFlagChanged', handler as EventListener);
            window.removeEventListener('featureFlagsReset', resetHandler);
        };
    }, [key]);
    
    return value;
}

/**
 * Hook para obter todas as flags
 */
export function useFeatureFlags(): FeatureFlags {
    const [flags, setFlags] = useState(() => getAllFeatureFlags());
    
    useEffect(() => {
        const handler = () => {
            setFlags(getAllFeatureFlags());
        };
        
        window.addEventListener('featureFlagChanged', handler);
        window.addEventListener('featureFlagsReset', handler);
        
        return () => {
            window.removeEventListener('featureFlagChanged', handler);
            window.removeEventListener('featureFlagsReset', handler);
        };
    }, []);
    
    return flags;
}

/**
 * Painel de debug para feature flags (dev only)
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).featureFlags = {
        get: getAllFeatureFlags,
        set: setFeatureFlag,
        reset: resetFeatureFlag,
        resetAll: resetAllFeatureFlags,
        list: () => {
            console.table(getAllFeatureFlags());
        },
    };
    
    console.log('🚀 Feature Flags disponíveis no console: window.featureFlags');
}
