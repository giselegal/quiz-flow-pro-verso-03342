/**
 * 🚀 HOOK: FUNNEL PUBLICATION
 * 
 * Gerencia configurações técnicas de publicação
 * Integrado com a nova arquitetura core de funis
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
// import { useFunnel } from '@/core/funnel';
import type {
    FunnelPublicationSettings,
    ResultConfiguration,
    KeywordResultMapping
} from '@/components/editor/publication/FunnelPublicationPanel';
import { useOptionalFunnelFacade } from '@/editor/facade/FunnelFacadeContext';
import { FeatureFlagManager } from '@/utils/FeatureFlagManager';

// ============================================================================
// TYPES
// ============================================================================

export interface UseFunnelPublicationOptions {
    autoSave?: boolean;
    onPublish?: (settings: FunnelPublicationSettings) => Promise<void>;
    onSave?: (settings: FunnelPublicationSettings) => Promise<void>;
}

export interface UseFunnelPublicationReturn {
    // Estado
    settings: FunnelPublicationSettings;
    isLoading: boolean;
    isSaving: boolean;
    isPublishing: boolean;
    error: Error | null;

    // Ações principais
    updateSettings: (updates: Partial<FunnelPublicationSettings>) => void;
    saveSettings: () => Promise<void>;
    publishFunnel: () => Promise<void>;
    resetSettings: () => void;

    // Configurações específicas
    updateDomain: (domain: Partial<FunnelPublicationSettings['domain']>) => void;
    updateResults: (results: Partial<FunnelPublicationSettings['results']>) => void;
    updateSEO: (seo: Partial<FunnelPublicationSettings['seo']>) => void;
    updateTracking: (tracking: Partial<FunnelPublicationSettings['tracking']>) => void;
    updateSecurity: (security: Partial<FunnelPublicationSettings['security']>) => void;

    // Utilitários
    generatePreviewUrl: () => string;
    validateSettings: () => { isValid: boolean; errors: string[] };
    getPublicationStatus: () => 'draft' | 'published' | 'error';
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS: FunnelPublicationSettings = {
    domain: {
        slug: '',
        seoFriendlyUrl: true
    },
    results: {
        primary: {
            id: 'primary',
            username: '',
            title: '',
            description: '',
            percentage: 0,
            primaryFunction: '',
            images: {}
        },
        secondary: [],
        keywords: []
    },
    seo: {
        robots: 'index,follow'
    },
    tracking: {
        utmParameters: {}
    },
    security: {}
};

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useFunnelPublication(
    funnelId: string,
    options: UseFunnelPublicationOptions = {}
): UseFunnelPublicationReturn {

    const [settings, setSettings] = useState<FunnelPublicationSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // ============================================================================
    // LOAD SETTINGS
    // ============================================================================

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Integrar com o serviço de publicação
            // const savedSettings = await funnelPublicationService.getSettings(funnelId);

            // Mock para desenvolvimento
            const savedSettings = localStorage.getItem(`funnel_publication_${funnelId}`);
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            } else {
                setSettings({
                    ...DEFAULT_SETTINGS,
                    domain: {
                        ...DEFAULT_SETTINGS.domain,
                        slug: generateSlugFromFunnelId(funnelId)
                    }
                });
            }
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [funnelId]);

    // ============================================================================
    // UPDATE METHODS
    // ============================================================================

    const updateSettings = useCallback((updates: Partial<FunnelPublicationSettings>) => {
        setSettings(prev => ({
            ...prev,
            ...updates
        }));
    }, []);

    const updateDomain = useCallback((domain: Partial<FunnelPublicationSettings['domain']>) => {
        setSettings(prev => ({
            ...prev,
            domain: { ...prev.domain, ...domain }
        }));
    }, []);

    const updateResults = useCallback((results: Partial<FunnelPublicationSettings['results']>) => {
        setSettings(prev => ({
            ...prev,
            results: { ...prev.results, ...results }
        }));
    }, []);

    const updateSEO = useCallback((seo: Partial<FunnelPublicationSettings['seo']>) => {
        setSettings(prev => ({
            ...prev,
            seo: { ...prev.seo, ...seo }
        }));
    }, []);

    const updateTracking = useCallback((tracking: Partial<FunnelPublicationSettings['tracking']>) => {
        setSettings(prev => ({
            ...prev,
            tracking: { ...prev.tracking, ...tracking }
        }));
    }, []);

    const updateSecurity = useCallback((security: Partial<FunnelPublicationSettings['security']>) => {
        setSettings(prev => ({
            ...prev,
            security: { ...prev.security, ...security }
        }));
    }, []);

    // ============================================================================
    // SAVE & PUBLISH
    // ============================================================================

    const saveSettings = useCallback(async () => {
        setIsSaving(true);
        setError(null);

        try {
            // Salvar no serviço
            if (options.onSave) {
                await options.onSave(settings);
            } else {
                // Fallback para localStorage
                localStorage.setItem(`funnel_publication_${funnelId}`, JSON.stringify(settings));
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [settings, funnelId, options]);

    const publishFunnel = useCallback(async () => {
        setIsPublishing(true);
        setError(null);

        try {
            // Validar antes de publicar
            const validation = validateSettings();
            if (!validation.isValid) {
                throw new Error(`Erros de validação: ${validation.errors.join(', ')}`);
            }

            // Salvar primeiro
            await saveSettings();

            // Publicar
            if (options.onPublish) {
                await options.onPublish(settings);
            } else {
                // Mock de publicação
                console.log('🚀 Publicando funil:', {
                    funnelId,
                    url: generatePreviewUrl(),
                    settings
                });
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsPublishing(false);
        }
    }, [settings, saveSettings, options, funnelId]);

    const resetSettings = useCallback(() => {
        setSettings(DEFAULT_SETTINGS);
        setError(null);
    }, []);

    // ============================================================================
    // UTILITIES
    // ============================================================================

    const generatePreviewUrl = useCallback(() => {
        const { domain } = settings;

        if (domain.customDomain) {
            return `https://${domain.customDomain}/${domain.slug}`;
        }

        const subdomain = domain.subdomain || 'app';
        return `https://${subdomain}.quizquest.com/${domain.slug}`;
    }, [settings]);

    const validateSettings = useCallback(() => {
        const errors: string[] = [];

        // Validar domínio
        if (!settings.domain.slug) {
            errors.push('Slug do funil é obrigatório');
        }

        // Validar resultado principal
        if (!settings.results.primary.title) {
            errors.push('Título do resultado principal é obrigatório');
        }

        if (!settings.results.primary.description) {
            errors.push('Descrição do resultado principal é obrigatória');
        }

        // Validar SEO básico
        if (settings.seo.title && settings.seo.title.length > 60) {
            errors.push('Título SEO deve ter no máximo 60 caracteres');
        }

        if (settings.seo.description && settings.seo.description.length > 160) {
            errors.push('Meta description deve ter no máximo 160 caracteres');
        }

        // Validar tracking
        if (settings.tracking.googleAnalytics && !settings.tracking.googleAnalytics.startsWith('GA4-')) {
            errors.push('ID do Google Analytics deve começar com GA4-');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }, [settings]);

    const getPublicationStatus = useCallback(() => {
        if (error) return 'error';

        // Verificar se foi publicado (aqui você checaria com o serviço)
        const hasBasicSettings = settings.domain.slug && settings.results.primary.title;

        return hasBasicSettings ? 'published' : 'draft';
    }, [error, settings]);

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        if (options.autoSave && !isLoading) {
            const timeoutId = setTimeout(() => {
                saveSettings().catch(console.error);
            }, 2000); // Auto-save após 2 segundos de inatividade

            return () => clearTimeout(timeoutId);
        }
    }, [settings, options.autoSave, isLoading, saveSettings]);

    // ============================================================================
    // LOAD ON MOUNT
    // ============================================================================

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // Estado
        settings,
        isLoading,
        isSaving,
        isPublishing,
        error,

        // Ações principais
        updateSettings,
        saveSettings,
        publishFunnel,
        resetSettings,

        // Configurações específicas
        updateDomain,
        updateResults,
        updateSEO,
        updateTracking,
        updateSecurity,

        // Utilitários
        generatePreviewUrl,
        validateSettings,
        getPublicationStatus
    };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook para configuração de resultados
 */
export function useFunnelResults(funnelId: string) {
    const { settings, updateResults, saveSettings } = useFunnelPublication(funnelId);

    const addSecondaryResult = useCallback(() => {
        const newResult: ResultConfiguration = {
            id: `result_${Date.now()}`,
            username: '',
            title: '',
            description: '',
            percentage: 0,
            primaryFunction: '',
            images: {}
        };

        updateResults({
            secondary: [...(settings.results.secondary || []), newResult]
        });
    }, [settings.results.secondary, updateResults]);

    const removeSecondaryResult = useCallback((resultId: string) => {
        updateResults({
            secondary: settings.results.secondary?.filter(r => r.id !== resultId)
        });
    }, [settings.results.secondary, updateResults]);

    const updatePrimaryResult = useCallback((updates: Partial<ResultConfiguration>) => {
        updateResults({
            primary: { ...settings.results.primary, ...updates }
        });
    }, [settings.results.primary, updateResults]);

    const addKeywordMapping = useCallback((mapping: KeywordResultMapping) => {
        updateResults({
            keywords: [...settings.results.keywords, mapping]
        });
    }, [settings.results.keywords, updateResults]);

    return {
        results: settings.results,
        addSecondaryResult,
        removeSecondaryResult,
        updatePrimaryResult,
        addKeywordMapping,
        save: saveSettings
    };
}

/**
 * Hook para configuração de SEO
 */
export function useFunnelSEO(funnelId: string) {
    const { settings, updateSEO, saveSettings, generatePreviewUrl } = useFunnelPublication(funnelId);

    const generateAutoSEO = useCallback((funnelTitle: string) => {
        updateSEO({
            title: `${funnelTitle} - Quiz Personalizado`,
            description: `Descubra ${funnelTitle.toLowerCase()} com nosso quiz personalizado e gratuito.`,
            keywords: funnelTitle.toLowerCase().split(' ')
        });
    }, [updateSEO]);

    return {
        seo: settings.seo,
        updateSEO,
        generateAutoSEO,
        previewUrl: generatePreviewUrl(),
        save: saveSettings
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateSlugFromFunnelId(funnelId: string): string {
    return funnelId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);
}
