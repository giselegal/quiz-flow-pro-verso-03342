/**
 * 🚀 HOOK: FUNNEL PUBLICATION (Refatorado)
 * 
 * Gerencia configurações técnicas de publicação usando serviços canonical.
 * 
 * ARQUITETURA:
 * - Hook: Apenas React state management
 * - Services: Business logic (FunnelSettingsService, PublicationService)
 * - Components: UI rendering
 * 
 * Integrado com arquitetura canonical:
 * - FunnelSettingsService: CRUD de settings
 * - PublicationService: Validação e publicação
 * - Zod schemas: Validação de dados
 */

import { useState, useCallback, useEffect } from 'react';
import { FunnelSettingsService } from '@/services/canonical/data/FunnelSettingsService';
import { PublicationService } from '@/services/canonical/PublicationService';
import type {
    PublicationSettings,
    DomainSettings,
    ResultsSettings,
    SEOSettings,
    TrackingSettings,
    SecuritySettings,
} from '@/services/canonical/data/FunnelSettingsService';

// Re-export types para compatibilidade
export type FunnelPublicationSettings = PublicationSettings;
export type ResultConfiguration = ResultsSettings['primary'];
export type KeywordResultMapping = ResultsSettings['keywords'][number];

// ============================================================================
// HOOK OPTIONS & RETURN
// ============================================================================

export interface UseFunnelPublicationOptions {
    autoSave?: boolean;
    autoSaveDelay?: number; // Default: 1000ms
}

export interface UseFunnelPublicationReturn {
    // Estado
    settings: PublicationSettings;
    isLoading: boolean;
    isSaving: boolean;
    isPublishing: boolean;
    error: Error | null;

    // Ações principais
    updateSettings: (updates: Partial<PublicationSettings>) => void;
    saveSettings: () => Promise<void>;
    publishFunnel: () => Promise<void>;
    unpublishFunnel: () => Promise<void>;
    resetSettings: () => void;

    // Configurações específicas (por seção)
    updateDomain: (domain: Partial<DomainSettings>) => void;
    updateResults: (results: Partial<ResultsSettings>) => void;
    updateSEO: (seo: Partial<SEOSettings>) => void;
    updateTracking: (tracking: Partial<TrackingSettings>) => void;
    updateSecurity: (security: Partial<SecuritySettings>) => void;

    // Utilitários
    generatePreviewUrl: () => string | null;
    validateSettings: () => Promise<{ isValid: boolean; errors: string[]; warnings: string[] }>;
    getPublicationStatus: () => 'draft' | 'published' | 'error';
}

// ============================================================================
// SERVICE INSTANCES
// ============================================================================

const funnelSettingsService = FunnelSettingsService.getInstance();
const publicationService = PublicationService.getInstance();

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useFunnelPublication(
    funnelId: string,
    options: UseFunnelPublicationOptions = {},
): UseFunnelPublicationReturn {

    const [settings, setSettings] = useState<PublicationSettings>({
        domain: { slug: '', seoFriendlyUrl: true },
        results: {
            calculationType: 'weighted',
            primary: {
                id: 'primary',
                username: '',
                title: '',
                description: '',
                percentage: 0,
                primaryFunction: '',
                images: {},
            },
            secondary: [],
            keywords: [],
        },
        seo: { robots: 'index,follow' },
        tracking: { utmParameters: {} },
        security: {},
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // ============================================================================
    // LOAD SETTINGS (usando FunnelSettingsService)
    // ============================================================================

    const loadSettings = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await funnelSettingsService.getSettings(funnelId);
            
            if (result.success && result.data) {
                setSettings(result.data);
            } else {
                console.warn('Failed to load settings:', result.success ? 'No data' : result.error.message);
                // Manter settings padrão
            }
        } catch (err) {
            setError(err as Error);
            console.error('Error loading settings:', err);
        } finally {
            setIsLoading(false);
        }
    }, [funnelId]);

    // ============================================================================
    // UPDATE METHODS (apenas state management React)
    // ============================================================================

    const updateSettings = useCallback((updates: Partial<PublicationSettings>) => {
        setSettings(prev => ({
            ...prev,
            ...updates,
        }));
    }, []);

    const updateDomain = useCallback((domain: Partial<DomainSettings>) => {
        setSettings(prev => ({
            ...prev,
            domain: { ...prev.domain, ...domain },
        }));
    }, []);

    const updateResults = useCallback((results: Partial<ResultsSettings>) => {
        setSettings(prev => ({
            ...prev,
            results: { ...prev.results, ...results },
        }));
    }, []);

    const updateSEO = useCallback((seo: Partial<SEOSettings>) => {
        setSettings(prev => ({
            ...prev,
            seo: { ...prev.seo, ...seo },
        }));
    }, []);

    const updateTracking = useCallback((tracking: Partial<TrackingSettings>) => {
        setSettings(prev => ({
            ...prev,
            tracking: { ...prev.tracking, ...tracking },
        }));
    }, []);

    const updateSecurity = useCallback((security: Partial<SecuritySettings>) => {
        setSettings(prev => ({
            ...prev,
            security: { ...prev.security, ...security },
        }));
    }, []);

    // ============================================================================
    // SAVE & PUBLISH (usando PublicationService)
    // ============================================================================

    const saveSettings = useCallback(async () => {
        setIsSaving(true);
        setError(null);

        try {
            const result = await funnelSettingsService.updateSettings(funnelId, settings);
            
            if (!result.success) {
                throw result.error;
            }
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [settings, funnelId]);

    const publishFunnel = useCallback(async () => {
        setIsPublishing(true);
        setError(null);

        try {
            const result = await publicationService.publish(funnelId, { force: false });
            
            if (!result.success) {
                throw result.error;
            }

            console.log('✅ Funnel published:', result.data);
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsPublishing(false);
        }
    }, [funnelId]);

    const unpublishFunnel = useCallback(async () => {
        setIsPublishing(true);
        setError(null);

        try {
            const result = await publicationService.unpublish(funnelId);
            
            if (!result.success) {
                throw result.error;
            }

            console.log('✅ Funnel unpublished');
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsPublishing(false);
        }
    }, [funnelId]);

    const resetSettings = useCallback(async () => {
        try {
            await loadSettings();
            setError(null);
        } catch (err) {
            console.error('Failed to reset settings:', err);
        }
    }, [loadSettings]);

    // ============================================================================
    // UTILITIES (usando PublicationService)
    // ============================================================================

    const generatePreviewUrl = useCallback(() => {
        const { domain } = settings;

        if (domain.customDomain) {
            return `https://${domain.customDomain}/${domain.slug}`;
        }

        const subdomain = domain.subdomain || 'app';
        return `https://${subdomain}.quizflowpro.com/${domain.slug}`;
    }, [settings]);

    const validateSettings = useCallback(async () => {
        const result = await publicationService.validate(settings);
        
        if (!result.success || !result.data) {
            return {
                isValid: false,
                errors: ['Validation failed'],
                warnings: [],
            };
        }

        const { isValid, errors, warnings } = result.data;
        
        return {
            isValid,
            errors: errors.map(e => e.message),
            warnings: warnings.map(w => w.message),
        };
    }, [settings]);

    const getPublicationStatus = useCallback((): 'draft' | 'published' | 'error' => {
        if (error) return 'error';
        
        // Verificar se tem configurações mínimas
        const hasBasicSettings = settings.domain.slug && settings.results.primary.title;
        
        return hasBasicSettings ? 'published' : 'draft';
    }, [error, settings]);

    // ============================================================================
    // AUTO-SAVE EFFECT
    // ============================================================================

    useEffect(() => {
        if (options.autoSave && !isLoading && !isSaving) {
            const delay = options.autoSaveDelay || 1000;
            const timeoutId = setTimeout(() => {
                saveSettings().catch(console.error);
            }, delay);

            return () => clearTimeout(timeoutId);
        }
    }, [settings, options.autoSave, options.autoSaveDelay, isLoading, isSaving, saveSettings]);

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
        unpublishFunnel,
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
        getPublicationStatus,
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
            images: {},
        };

        updateResults({
            secondary: [...(settings.results.secondary || []), newResult],
        });
    }, [settings.results.secondary, updateResults]);

    const removeSecondaryResult = useCallback((resultId: string) => {
        updateResults({
            secondary: settings.results.secondary?.filter(r => r.id !== resultId),
        });
    }, [settings.results.secondary, updateResults]);

    const updatePrimaryResult = useCallback((updates: Partial<ResultConfiguration>) => {
        updateResults({
            primary: { ...settings.results.primary, ...updates },
        });
    }, [settings.results.primary, updateResults]);

    const addKeywordMapping = useCallback((mapping: KeywordResultMapping) => {
        updateResults({
            keywords: [...settings.results.keywords, mapping],
        });
    }, [settings.results.keywords, updateResults]);

    return {
        results: settings.results,
        addSecondaryResult,
        removeSecondaryResult,
        updatePrimaryResult,
        addKeywordMapping,
        save: saveSettings,
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
            keywords: funnelTitle.toLowerCase().split(' '),
        });
    }, [updateSEO]);

    return {
        seo: settings.seo,
        updateSEO,
        generateAutoSEO,
        previewUrl: generatePreviewUrl(),
        save: saveSettings,
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
