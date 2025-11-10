// src/hooks/useFeatureFlags.ts

import { useState, useEffect } from 'react';
import { StorageService } from '@/services/core/StorageService';
import { appLogger } from '@/lib/utils/appLogger';

interface FeatureFlags {
    useJsonTemplates: boolean;
    enablePrefetch: boolean;
    enableAnalytics: boolean;
    useModularEditor: boolean; // Nova flag para editor modular
    enableAutoSave: boolean;   // Auto-save no editor
    // Adicionar outras flags conforme necessário
}

const DEFAULT_FLAGS: FeatureFlags = {
    useJsonTemplates: false, // Desabilitado por padrão
    enablePrefetch: true,
    enableAnalytics: true,
    useModularEditor: false, // Editor monolítico por padrão
    enableAutoSave: false,   // Auto-save desabilitado por padrão
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
            useModularEditor: import.meta.env.VITE_USE_MODULAR_EDITOR === 'true',
            enableAutoSave: import.meta.env.VITE_ENABLE_AUTO_SAVE === 'true',
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
        const stored = StorageService.safeGetString('featureFlags');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        appLogger.warn('Erro ao carregar feature flags do localStorage:', { data: [err] });
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
        const stored = StorageService.safeGetString('featureFlags');
        const flags = stored ? JSON.parse(stored) : {};
        flags[flag] = value;
        StorageService.safeSetJSON('featureFlags', flags);
        appLogger.info(`✅ Feature flag '${flag}' definida como ${value}`);
        window.location.reload(); // Reload para aplicar
    } catch (err) {
        appLogger.error('Erro ao salvar feature flag:', { data: [err] });
    }
}

/**
 * Utilitário para debug - mostrar flags atuais
 */
export function debugFeatureFlags() {
    const stored = StorageService.safeGetString('featureFlags');
    appLogger.info('🚩 Feature Flags:');
    appLogger.info('  - Env VITE_USE_JSON_TEMPLATES:', { data: [import.meta.env.VITE_USE_JSON_TEMPLATES] });
    appLogger.info('  - Env VITE_JSON_TEMPLATES_ROLLOUT:', { data: [import.meta.env.VITE_JSON_TEMPLATES_ROLLOUT] });
    appLogger.info('  - localStorage:', { data: [stored] });
    appLogger.info('\n💡 Para ativar manualmente:');
    appLogger.info('  setFeatureFlag("useJsonTemplates", true)');
}

// Exportar para uso no console
if (typeof window !== 'undefined') {
    (window as any).setFeatureFlag = setFeatureFlag;
    (window as any).debugFeatureFlags = debugFeatureFlags;
}
