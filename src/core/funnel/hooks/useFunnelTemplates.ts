/**
 * 🏗️ FUNNEL TEMPLATES HOOKS
 * 
 * Hooks especializados para gerenciamento de templates de funis
 */

import { useState, useCallback, useEffect } from 'react';
import { FunnelTemplate } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface UseFunnelTemplatesOptions {
    category?: string;
    includeOfficial?: boolean;
    includeUserTemplates?: boolean;
    sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'popularity';
    sortOrder?: 'asc' | 'desc';
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
    const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<FunnelTemplate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [filters, setFilters] = useState({
        category: options.category || '',
        search: ''
    });

    // ============================================================================
    // LOAD TEMPLATES
    // ============================================================================

    const loadTemplates = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Aqui você integraria com o serviço real
            // const response = await funnelTemplateService.getAllTemplates();

            // Mock data para desenvolvimento
            const mockTemplates: FunnelTemplate[] = [
                {
                    id: 'quiz-style-template',
                    name: 'Quiz de Estilo Pessoal',
                    description: 'Template para descobrir estilo pessoal do usuário',
                    category: 'lifestyle',
                    theme: 'modern',
                    stepCount: 0,
                    isOfficial: true,
                    usageCount: 0,
                    tags: [],
                    templateData: {
                        metadata: {
                            name: 'Quiz de Estilo Pessoal',
                            description: 'Template para descobrir estilo pessoal do usuário',
                            category: 'lifestyle',
                            theme: 'modern',
                            version: '1.0.0',
                            isPublished: true,
                            isOfficial: true
                        },
                        settings: getDefaultSettings(),
                        steps: []
                    },
                    components: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    thumbnailUrl: undefined
                },
                // Adicionar mais templates conforme necessário
            ];

            setTemplates(mockTemplates);
            setFilteredTemplates(mockTemplates);
        } catch (err) {
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

            // Aqui você salvaria no serviço real
            // await funnelTemplateService.createTemplate(newTemplate);

            setTemplates(prev => [...prev, newTemplate]);
            setFilteredTemplates(prev => [...prev, newTemplate]);

            return newTemplate;
        } catch (err) {
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
            const updatedTemplate = {
                ...templates.find(t => t.id === id),
                ...updates,
                updatedAt: new Date().toISOString()
            } as FunnelTemplate;

            // Aqui você atualizaria no serviço real
            // await funnelTemplateService.updateTemplate(id, updatedTemplate);

            setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
            setFilteredTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));

            return updatedTemplate;
        } catch (err) {
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
            // Aqui você deletaria no serviço real
            // await funnelTemplateService.deleteTemplate(id);

            setTemplates(prev => prev.filter(t => t.id !== id));
            setFilteredTemplates(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const duplicateTemplate = useCallback(async (id: string, newName?: string): Promise<FunnelTemplate> => {
        const original = templates.find(t => t.id === id);
        if (!original) {
            throw new Error(`Template ${id} não encontrado`);
        }

        const duplicated: Partial<FunnelTemplate> = {
            ...original,
            id: undefined, // Será gerado um novo
            name: newName || `${original.name} (Cópia)`,
            isOfficial: false, // Cópias nunca são oficiais
            updatedAt: new Date().toISOString()
        };

        return createTemplate(duplicated);
    }, [templates, createTemplate]);

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
                t.category.toLowerCase().includes(searchLower)
            );
        }

        // Apply options filters
        if (options.includeOfficial === false) {
            filtered = filtered.filter(t => !t.isOfficial);
        }

        if (options.includeUserTemplates === false) {
            filtered = filtered.filter(t => t.isOfficial);
        }

        // Sort
        if (options.sortBy) {
            filtered.sort((a, b) => {
                let aValue: any;
                let bValue: any;

                switch (options.sortBy) {
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
                    default:
                        return 0;
                }

                if (options.sortOrder === 'desc') {
                    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
                } else {
                    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
                }
            });
        }

        setFilteredTemplates(filtered);
    }, [templates, filters, options]);

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
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook para criar funil a partir de template
 */
export function useCreateFunnelFromTemplate() {
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createFromTemplate = useCallback(async (templateId: string, customizations?: Record<string, any>) => {
        setIsCreating(true);
        setError(null);

        try {
            // Aqui você integraria com o serviço de criação
            // const funnel = await funnelService.createFromTemplate(templateId, customizations);

            // Mock implementation
            const mockFunnel = {
                id: `funnel-${Date.now()}`,
                templateId,
                name: `Novo Funil - ${Date.now()}`,
                customizations: customizations || {}
            };

            return mockFunnel;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsCreating(false);
        }
    }, []);

    return {
        createFromTemplate,
        isCreating,
        error
    };
}

/**
 * Hook para preview de template
 */
export function useFunnelTemplatePreview(templateId: string) {
    const [preview, setPreview] = useState<{ steps: any[]; sampleData: Record<string, any>; estimatedTime: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadPreview = useCallback(async () => {
        if (!templateId) return;

        setIsLoading(true);
        setError(null);

        try {
            // Aqui você carregaria o preview do template
            // const previewData = await funnelTemplateService.getPreview(templateId);

            // Mock preview
            const mockPreview = {
                steps: [],
                sampleData: {},
                estimatedTime: '5 minutos'
            };

            setPreview(mockPreview);
        } catch (err) {
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
