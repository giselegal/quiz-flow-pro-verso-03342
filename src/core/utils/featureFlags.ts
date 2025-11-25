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

const STORAGE_PREFIX = 'feature:';

/**
 * Definição de todas as feature flags disponíveis
 */
export interface FeatureFlags {
    // Editor
    useUnifiedEditor: boolean;
    useUnifiedContext: boolean;
    useSinglePropertiesPanel: boolean;
    useUnifiedPersistence: boolean;
    
    // Performance
    enableLazyLoading: boolean;
    enableCodeSplitting: boolean;
    enableMemoization: boolean;
    
    // Experimental
    enableRealTimeCollaboration: boolean;
    enableVersioning: boolean;
    enableAutoSave: boolean;
    
    // Debug
    enableDebugLogs: boolean;
    enablePerformanceMonitoring: boolean;
}

/**
 * Valores padrão das flags (produção)
 */
const DEFAULT_FLAGS: FeatureFlags = {
    // Editor
    useUnifiedEditor: false, // Gradual rollout
    useUnifiedContext: true, // Já está estável
    useSinglePropertiesPanel: true, // Já está estável
    useUnifiedPersistence: false, // Em desenvolvimento
    
    // Performance
    enableLazyLoading: true,
    enableCodeSplitting: true,
    enableMemoization: true,
    
    // Experimental
    enableRealTimeCollaboration: false,
    enableVersioning: false,
    enableAutoSave: true,
    
    // Debug
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enablePerformanceMonitoring: false,
};

/**
 * Obter valor de uma flag
 */
function getFlag(key: keyof FeatureFlags): boolean {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    const stored = localStorage.getItem(storageKey);
    
    if (stored !== null) {
        return stored === 'true';
    }
    
    return DEFAULT_FLAGS[key];
}

/**
 * Definir valor de uma flag
 */
export function setFeatureFlag(key: keyof FeatureFlags, value: boolean): void {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.setItem(storageKey, String(value));
    
    // Disparar evento para componentes reagirem
    window.dispatchEvent(new CustomEvent('featureFlagChanged', {
        detail: { key, value }
    }));
}

/**
 * Resetar uma flag para valor padrão
 */
export function resetFeatureFlag(key: keyof FeatureFlags): void {
    const storageKey = `${STORAGE_PREFIX}${key}`;
    localStorage.removeItem(storageKey);
    
    window.dispatchEvent(new CustomEvent('featureFlagChanged', {
        detail: { key, value: DEFAULT_FLAGS[key] }
    }));
}

/**
 * Resetar todas as flags
 */
export function resetAllFeatureFlags(): void {
    Object.keys(DEFAULT_FLAGS).forEach(key => {
        localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    });
    
    window.dispatchEvent(new CustomEvent('featureFlagsReset'));
}

/**
 * Obter todas as flags atuais
 */
export function getAllFeatureFlags(): FeatureFlags {
    return Object.keys(DEFAULT_FLAGS).reduce((acc, key) => {
        acc[key as keyof FeatureFlags] = getFlag(key as keyof FeatureFlags);
        return acc;
    }, {} as FeatureFlags);
}

/**
 * Proxy para acesso reativo às flags
 */
export const featureFlags = new Proxy({} as FeatureFlags, {
    get(_target, prop: keyof FeatureFlags) {
        return getFlag(prop);
    },
});

/**
 * Hook React para usar feature flags com reatividade
 */
import { useEffect, useState } from 'react';

export function useFeatureFlag(key: keyof FeatureFlags): boolean {
    const [value, setValue] = useState(() => getFlag(key));
    
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
