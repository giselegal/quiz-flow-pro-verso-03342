/**
 * 🏗️ FUNNEL TEMPLATES HOOKS - REFATORADO
 * 
 * Hooks especializados para gerenciamento de templates de funis
 * USANDO FunnelUnifiedService para máxima consistência e cache
 */

import { useState, useCallback, useEffect } from 'react';
import { funnelUnifiedService, type UnifiedFunnelData } from '@/services/FunnelUnifiedService';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { FunnelTemplate } from '../types';
import { funnelTemplateService } from '@/services/templates';

// ============================================================================
// TYPES
// ============================================================================

export interface UseFunnelTemplatesOptions {
    category?: string;
    includeOfficial?: boolean;
    includeUserTemplates?: boolean;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    enableCache?: boolean;
    userId?: string;
}

export interface UseFunnelTemplatesReturn {
    templates: FunnelTemplate[];
    filteredTemplates: FunnelTemplate[];
    isLoading: boolean;
    error: Error | null;

    // Actions
    loadTemplates: () => Promise<void>;
    createTemplate: (template: Partial<FunnelTemplate>) => Promise<FunnelTemplate>;
    updateTemplate: (id: string, updates: Partial<FunnelTemplate>) => Promise<FunnelTemplate>;
    deleteTemplate: (id: string) => Promise<void>;
    duplicateTemplate: (id: string, newName?: string) => Promise<FunnelTemplate>;

    // ⭐ NEW: Create funnel from template integration
    createFunnelFromTemplate: (templateId: string, funnelName?: string, customizations?: any) => Promise<UnifiedFunnelData>;

    // Filters
    filterByCategory: (category: string) => void;
    filterBySearch: (query: string) => void;
    clearFilters: () => void;

    // Utils
    getTemplate: (id: string) => FunnelTemplate | undefined;
    getTemplatesByCategory: (category: string) => FunnelTemplate[];
    getOfficialTemplates: () => FunnelTemplate[];
    getUserTemplates: () => FunnelTemplate[];
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useFunnelTemplates(
    options: UseFunnelTemplatesOptions = {}
): UseFunnelTemplatesReturn {
    const {
        category = '',
        includeOfficial = true,
        includeUserTemplates = true,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        userId
    } = options;

    const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<FunnelTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState({
        category: category,
        search: ''
    });

    // ============================================================================
    // LOAD TEMPLATES
    // ============================================================================

    const loadTemplates = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🏗️ useFunnelTemplates: Carregando templates...');

            // Buscar do serviço com fallback
            const serviceTemplates = await funnelTemplateService.getTemplates();

            // Adaptar para o tipo do core
            const adapted: FunnelTemplate[] = (serviceTemplates || []).map((t: any) => ({
                id: String(t.id),
                name: String(t.name || 'Template'),
                description: String(t.description || ''),
                category: String(t.category || 'custom'),
                theme: String(t.theme || 'default'),
                stepCount: Number(t.stepCount || 0),
                isOfficial: Boolean(t.isOfficial),
                usageCount: Number(t.usageCount || 0),
                tags: Array.isArray(t.tags) ? t.tags : [],
                thumbnailUrl: t.thumbnailUrl,
                templateData: t.templateData && t.templateData.metadata && t.templateData.settings
                    ? t.templateData
                    : {
                        metadata: {
                            name: String(t.name || 'Template'),
                            description: String(t.description || ''),
                            category: String(t.category || 'custom'),
                            theme: String(t.theme || 'default'),
                            version: '1.0.0',
                            isPublished: true,
                            isOfficial: Boolean(t.isOfficial)
                        },
                        settings: getDefaultSettings(),
                        steps: []
                    },
                components: Array.isArray(t.components) ? t.components : [],
                createdAt: t.createdAt || new Date().toISOString(),
                updatedAt: t.updatedAt || new Date().toISOString()
            }));

            setTemplates(adapted);
            console.log(`✅ Templates carregados: ${adapted.length}`);

        } catch (err) {
            console.error('❌ Erro ao carregar templates:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ============================================================================
    // TEMPLATE MANAGEMENT
    // ============================================================================

    const createTemplate = useCallback(async (template: Partial<FunnelTemplate>): Promise<FunnelTemplate> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('➕ useFunnelTemplates: Criando template', template.name);

            const newTemplate: FunnelTemplate = {
                id: generateTemplateId(),
                name: template.name || 'Novo Template',
                description: template.description || '',
                category: template.category || 'custom',
                theme: 'modern',
                isOfficial: false,
                stepCount: 0,
                usageCount: 0,
                tags: [],
                templateData: template.templateData || {
                    metadata: {
                        name: template.name || 'Novo Template',
                        description: template.description || '',
                        category: template.category || 'custom',
                        theme: 'modern',
                        version: '1.0.0',
                        isPublished: false,
                        isOfficial: false
                    },
                    settings: getDefaultSettings(),
                    steps: []
                },
                components: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // TODO: Integrar com funnelTemplateService.createTemplate
            // await funnelTemplateService.createTemplate(newTemplate);

            setTemplates(prev => [...prev, newTemplate]);
            console.log('✅ Template criado:', newTemplate.id);

            return newTemplate;
        } catch (err) {
            console.error('❌ Erro ao criar template:', err);
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (id: string, updates: Partial<FunnelTemplate>): Promise<FunnelTemplate> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('✏️ useFunnelTemplates: Atualizando template', id);

            const existingTemplate = templates.find(t => t.id === id);
            if (!existingTemplate) {
                throw new Error(`Template ${id} não encontrado`);
            }

            const updatedTemplate = {
                ...existingTemplate,
                ...updates,
                updatedAt: new Date().toISOString()
            } as FunnelTemplate;

            // TODO: Integrar com funnelTemplateService.updateTemplate
            // await funnelTemplateService.updateTemplate(id, updatedTemplate);

            setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
            console.log('✅ Template atualizado:', id);

            return updatedTemplate;
        } catch (err) {
            console.error('❌ Erro ao atualizar template:', err);
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [templates]);

    const deleteTemplate = useCallback(async (id: string): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🗑️ useFunnelTemplates: Deletando template', id);

            // TODO: Integrar com funnelTemplateService.deleteTemplate
            // await funnelTemplateService.deleteTemplate(id);

            setTemplates(prev => prev.filter(t => t.id !== id));
            console.log('✅ Template deletado:', id);

        } catch (err) {
            console.error('❌ Erro ao deletar template:', err);
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (id: string, newName?: string): Promise<FunnelTemplate> => {
        console.log('🔄 useFunnelTemplates: Duplicando template', id);

        const original = templates.find(t => t.id === id);
        if (!original) {
            throw new Error(`Template ${id} não encontrado`);
        }

        const duplicated: Partial<FunnelTemplate> = {
            ...original,
            id: undefined, // Será gerado um novo
            name: newName || `${original.name} (Cópia)`,
            isOfficial: false, // Cópias nunca são oficiais
            usageCount: 0, // Reset usage count
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return createTemplate(duplicated);
    }, [templates, createTemplate]);

    // ============================================================================
    // ⭐ NEW: CREATE FUNNEL FROM TEMPLATE
    // ============================================================================

    const createFunnelFromTemplate = useCallback(async (
        templateId: string,
        funnelName?: string,
        customizations: any = {}
    ): Promise<UnifiedFunnelData> => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('🎯 useFunnelTemplates: Criando funil do template', templateId);

            // Buscar template
            const template = templates.find(t => t.id === templateId);
            if (!template) {
                throw new Error(`Template ${templateId} não encontrado`);
            }

            // Usar FunnelUnifiedService para criar funil
            const funnelData = {
                name: funnelName || `${template.name} - ${new Date().toLocaleDateString()}`,
                description: template.description,
                category: template.category,
                theme: template.theme,
                templateId,
                context: FunnelContext.TEMPLATES, // ⭐ Context obrigatório
                settings: {
                    ...template.templateData.settings,
                    ...customizations.settings
                },
                metadata: {
                    ...template.templateData.metadata,
                    templateId,
                    templateName: template.name,
                    templateVersion: template.templateData.metadata.version,
                    customizations
                },
                steps: template.templateData.steps || [],
                analytics: customizations.analytics || {},
                userId
            };

            const newFunnel = await funnelUnifiedService.createFunnel(funnelData);

            // Incrementar contador de uso do template
            if (template) {
                await updateTemplate(templateId, {
                    usageCount: (template.usageCount || 0) + 1,
                    updatedAt: new Date().toISOString()
                });
            }

            console.log('✅ Funil criado do template:', newFunnel.id);
            return newFunnel;

        } catch (err) {
            console.error('❌ Erro ao criar funil do template:', err);
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [templates, updateTemplate, userId]);

    // ============================================================================
    // FILTERING
    // ============================================================================

    const filterByCategory = useCallback((category: string) => {
        setFilters(prev => ({ ...prev, category }));
    }, []);

    const filterBySearch = useCallback((query: string) => {
        setFilters(prev => ({ ...prev, search: query }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ category: '', search: '' });
    }, []);

    // Apply filters effect
    useEffect(() => {
        let filtered = templates;

        // Filter by category
        if (filters.category) {
            filtered = filtered.filter(t => t.category === filters.category);
        }

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(searchLower) ||
                t.description.toLowerCase().includes(searchLower) ||
                t.category.toLowerCase().includes(searchLower) ||
                (t.tags && t.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
        }

        // Apply options filters
        if (!includeOfficial) {
            filtered = filtered.filter(t => !t.isOfficial);
        }

        if (!includeUserTemplates) {
            filtered = filtered.filter(t => t.isOfficial);
        }

        // Sort
        if (sortBy) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (sortBy) {
                    case 'name':
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt);
                        bValue = new Date(b.createdAt);
                        break;
                    case 'updatedAt':
                        aValue = new Date(a.updatedAt);
                        bValue = new Date(b.updatedAt);
                        break;
                    case 'popularity':
                        aValue = a.usageCount || 0;
                        bValue = b.usageCount || 0;
                        break;
                    default:
                        return 0;
                }

                if (sortOrder === 'desc') {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                } else {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                }
            });
        }

        setFilteredTemplates(filtered);
    }, [templates, filters, includeOfficial, includeUserTemplates, sortBy, sortOrder]);

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    const getTemplate = useCallback((id: string) => {
        return templates.find(t => t.id === id);
    }, [templates]);

    const getTemplatesByCategory = useCallback((category: string) => {
        return templates.filter(t => t.category === category);
    }, [templates]);

    const getOfficialTemplates = useCallback(() => {
        return templates.filter(t => t.isOfficial);
    }, [templates]);

    const getUserTemplates = useCallback(() => {
        return templates.filter(t => !t.isOfficial);
    }, [templates]);

    // ============================================================================
    // LOAD ON MOUNT
    // ============================================================================

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        templates,
        filteredTemplates,
        isLoading,
        error,

        // Actions
        loadTemplates,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,

        // ⭐ NEW: Integration with FunnelUnifiedService
        createFunnelFromTemplate,

        // Filters
        filterByCategory,
        filterBySearch,
        clearFilters,

        // Utils
        getTemplate,
        getTemplatesByCategory,
        getOfficialTemplates,
        getUserTemplates
    };
}

// ============================================================================
// SPECIALIZED HOOKS - REFACTORED
// ============================================================================

/**
 * Hook para criar funil a partir de template (agora integrado com FunnelUnifiedService)
 */
export function useCreateFunnelFromTemplate(userId?: string) {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createFromTemplate = useCallback(async (
        templateId: string,
        funnelName?: string,
        customizations: any = {}
    ): Promise<UnifiedFunnelData> => {
        setIsCreating(true);
        setError(null);

        try {
            console.log('🎯 useCreateFunnelFromTemplate: Criando funil', templateId);

            // Buscar template do serviço
            const templates = await funnelTemplateService.getTemplates();
            const template = templates.find((t: any) => t.id === templateId);

            if (!template) {
                throw new Error(`Template ${templateId} não encontrado`);
            }

            // Criar funil usando FunnelUnifiedService
            const funnelData = {
                name: funnelName || `${template.name} - ${new Date().toLocaleDateString()}`,
                description: template.description || '',
                context: FunnelContext.TEMPLATES, // ⭐ Context obrigatório
                templateId,
                settings: {
                    ...getDefaultSettings(),
                    ...template.templateData?.settings,
                    ...customizations.settings
                },
                metadata: {
                    templateId,
                    templateName: template.name,
                    templateVersion: template.templateData?.metadata?.version || '1.0.0',
                    customizations
                },
                userId
            };

            const funnel = await funnelUnifiedService.createFunnel(funnelData);
            console.log('✅ Funil criado do template:', funnel.id);

            return funnel;

        } catch (err) {
            console.error('❌ Erro ao criar funil do template:', err);
            setError(err as Error);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, [userId]);

    return {
        createFromTemplate,
        isCreating,
        error,
        clearError: () => setError(null)
    };
}

/**
 * Hook para preview de template
 */
export function useFunnelTemplatePreview(templateId: string) {
    const [preview, setPreview] = useState<{
        steps: any[];
        sampleData: Record<string, any>;
        estimatedTime: string;
        previewFunnel?: UnifiedFunnelData;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadPreview = useCallback(async () => {
        if (!templateId) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log('👁️ useFunnelTemplatePreview: Carregando preview', templateId);

            // Buscar template
            const templates = await funnelTemplateService.getTemplates();
            const template = templates.find((t: any) => t.id === templateId);

            if (!template) {
                throw new Error(`Template ${templateId} não encontrado`);
            }

            // Criar um preview simulado
            const mockPreview = {
                steps: template.templateData?.steps || [],
                sampleData: {
                    totalSteps: template.stepCount || 0,
                    category: template.category,
                    theme: template.theme,
                    components: template.components?.length || 0
                },
                estimatedTime: calculateEstimatedTime(template.stepCount || 0),
                previewFunnel: {
                    id: `preview-${templateId}`,
                    name: `Preview: ${template.name}`,
                    description: template.description,
                    context: FunnelContext.PREVIEW,
                    userId: 'preview',
                    templateId,
                    isPreview: true,
                    isPublished: false,
                    version: 1,
                    settings: template.templateData?.settings || getDefaultSettings(),
                    metadata: template.templateData?.metadata || {},
                    steps: template.templateData?.steps || [],
                    pages: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                } as UnifiedFunnelData
            };

            setPreview(mockPreview);
            console.log('✅ Preview carregado');

        } catch (err) {
            console.error('❌ Erro ao carregar preview:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [templateId]);

    useEffect(() => {
        loadPreview();
    }, [loadPreview]);

    return {
        preview,
        isLoading,
        error,
        reload: loadPreview
    };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function generateTemplateId(): string {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getDefaultSettings() {
    return {
        autoSave: true,
        autoAdvance: false,
        progressTracking: true,
        analytics: true,
        theme: {
            primaryColor: '#3B82F6',
            secondaryColor: '#64748B',
            fontFamily: 'Inter',
            borderRadius: '8px',
            spacing: '16px',
            layout: 'centered' as const
        },
        navigation: {
            showProgress: true,
            showStepNumbers: true,
            allowBackward: true,
            showNavigationButtons: true,
            autoAdvanceDelay: 0
        },
        validation: {
            strictMode: false,
            requiredFields: [],
            customValidators: {}
        }
    };
}

function calculateEstimatedTime(stepCount: number): string {
    const baseTime = 2; // 2 minutos base
    const timePerStep = 1.5; // 1.5 minutos por step
    const totalMinutes = baseTime + (stepCount * timePerStep);

    if (totalMinutes < 5) return '3-5 minutos';
    if (totalMinutes < 10) return '5-10 minutos';
    if (totalMinutes < 15) return '10-15 minutos';
    if (totalMinutes < 30) return '15-30 minutos';
    return '30+ minutos';
}

export default useFunnelTemplates;
