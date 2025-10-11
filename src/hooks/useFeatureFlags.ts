// src/hooks/useFeatureFlags.ts

import { useState, useEffect } from 'react';

interface FeatureFlags {
    useJsonTemplates: boolean;
    enablePrefetch: boolean;
    enableAnalytics: boolean;
    // Adicionar outras flags conforme necessário
}

const DEFAULT_FLAGS: FeatureFlags = {
    useJsonTemplates: false, // Desabilitado por padrão
    enablePrefetch: true,
    enableAnalytics: true,
};

/**
 * Hook para gerenciar feature flags
 */
export function useFeatureFlags(): FeatureFlags {
    const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

    useEffect(() => {
        // 1. Carregar de variáveis de ambiente
        const envFlags: Partial<FeatureFlags> = {
            useJsonTemplates: import.meta.env.VITE_USE_JSON_TEMPLATES === 'true',
            enablePrefetch: import.meta.env.VITE_ENABLE_PREFETCH !== 'false',
            enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
        };

        // 2. Carregar de localStorage (para testes locais)
        const localFlags = loadFromLocalStorage();

        // 3. Rollout gradual (por usuário)
        const rolloutFlags = calculateRollout();

        // 4. Merge de todas as fontes
        setFlags({
            ...DEFAULT_FLAGS,
            ...envFlags,
            ...localFlags,
            ...rolloutFlags,
        });
    }, []);

    return flags;
}

/**
 * Carrega flags do localStorage
 */
function loadFromLocalStorage(): Partial<FeatureFlags> {
    try {
        const stored = localStorage.getItem('featureFlags');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.warn('Erro ao carregar feature flags do localStorage:', err);
    }
    return {};
}

/**
 * Calcula rollout gradual baseado em userId
 */
function calculateRollout(): Partial<FeatureFlags> {
    const rolloutPercentage = parseInt(import.meta.env.VITE_JSON_TEMPLATES_ROLLOUT || '0');

    if (rolloutPercentage === 0) {
        return { useJsonTemplates: false };
    }

    if (rolloutPercentage === 100) {
        return { useJsonTemplates: true };
    }

    // Hash simples baseado em sessionId para rollout consistente
    const sessionId = getOrCreateSessionId();
    const hash = simpleHash(sessionId);
    const shouldEnable = (hash % 100) < rolloutPercentage;

    return { useJsonTemplates: shouldEnable };
}

/**
 * Gera ou recupera sessionId
 */
function getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
        sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('sessionId', sessionId);
    }

    return sessionId;
}

/**
 * Hash simples para rollout consistente
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Utilitário para salvar flags manualmente (para testes)
 */
export function setFeatureFlag(flag: keyof FeatureFlags, value: boolean) {
    try {
        const stored = localStorage.getItem('featureFlags');
        const flags = stored ? JSON.parse(stored) : {};
        flags[flag] = value;
        localStorage.setItem('featureFlags', JSON.stringify(flags));
        console.log(`✅ Feature flag '${flag}' definida como ${value}`);
        window.location.reload(); // Reload para aplicar
    } catch (err) {
        console.error('Erro ao salvar feature flag:', err);
    }
}

/**
 * Utilitário para debug - mostrar flags atuais
 */
export function debugFeatureFlags() {
    const stored = localStorage.getItem('featureFlags');
    console.log('🚩 Feature Flags:');
    console.log('  - Env VITE_USE_JSON_TEMPLATES:', import.meta.env.VITE_USE_JSON_TEMPLATES);
    console.log('  - Env VITE_JSON_TEMPLATES_ROLLOUT:', import.meta.env.VITE_JSON_TEMPLATES_ROLLOUT);
    console.log('  - localStorage:', stored);
    console.log('\n💡 Para ativar manualmente:');
    console.log('  setFeatureFlag("useJsonTemplates", true)');
}

// Exportar para uso no console
if (typeof window !== 'undefined') {
    (window as any).setFeatureFlag = setFeatureFlag;
    (window as any).debugFeatureFlags = debugFeatureFlags;
}
