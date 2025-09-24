import { useState, useCallback, useEffect } from 'react';
import { templateEventSystem, TemplateEventType } from '../events/TemplateEventSystem';

// Interface simplificada para metadados enhanced
export interface EnhancedTemplateMetadata {
    name: string;
    description: string;
    category: string;
    difficulty: 'Fácil' | 'Intermediário' | 'Avançado';
    tags: string[];
    premium: boolean;

    // Analytics
    analytics: {
        views: number;
        completions: number;
        conversionRate: number;
        avgCompletionTime: number;
        bounceRate: number;
        lastUsed: string;
    };

    // Performance
    performance: {
        loadTime: number;
        renderTime: number;
        cacheStatus: 'cached' | 'fresh' | 'expired';
        optimizationScore: number;
    };

    // Carregamento dinâmico
    loader: () => Promise<any>;

    // Versioning
    version: string;
    lastModified: string;

    // Customização
    customizations: Record<string, any>;

    // Plugin compatibility
    supportedPlugins: string[];
    requiredPlugins: string[];
}

/**
 * Hook para gerenciar templates enhanced com sistema de eventos
 */
export function useEnhancedTemplate(templateId: string, initialData?: any) {
    const [template, setTemplate] = useState<EnhancedTemplateMetadata | null>(null);
    const [formData, setFormData] = useState(initialData || {});
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<any[]>([]);
    const [validationResult, setValidationResult] = useState({ isValid: true, errors: [] });

    // Carregar template
    useEffect(() => {
        if (templateId) {
            setIsLoading(true);

            // Simular carregamento do template
            const loadTemplate = async () => {
                try {
                    const mockTemplate: EnhancedTemplateMetadata = {
                        name: `Template ${templateId}`,
                        description: 'Template description',
                        category: 'quiz',
                        difficulty: 'Fácil',
                        tags: ['quiz', 'interativo'],
                        premium: false,
                        analytics: {
                            views: 100,
                            completions: 85,
                            conversionRate: 85,
                            avgCompletionTime: 180,
                            bounceRate: 15,
                            lastUsed: new Date().toISOString()
                        },
                        performance: {
                            loadTime: 150,
                            renderTime: 50,
                            cacheStatus: 'fresh' as const,
                            optimizationScore: 95
                        },
                        loader: async () => ({}),
                        version: '1.0.0',
                        lastModified: new Date().toISOString(),
                        customizations: {},
                        supportedPlugins: ['quiz-analytics'],
                        requiredPlugins: []
                    };

                    setTemplate(mockTemplate);

                    // Disparar evento de carregamento
                    templateEventSystem.emit('template_loaded' as TemplateEventType, mockTemplate, templateId);

                } catch (error) {
                    console.error('Erro ao carregar template:', error);
                    setErrors([error]);
                } finally {
                    setIsLoading(false);
                }
            };

            loadTemplate();
        }
    }, [templateId]);

    // Setup dos event listeners
    useEffect(() => {
        const listeners: (() => void)[] = [
            // Listener para mudanças nos dados do formulário
            templateEventSystem.addEventListener('form_data_changed' as TemplateEventType, (event: any) => {
                const { path, value } = event.payload;
                setFormData((prev: any) => ({
                    ...prev,
                    [path]: value
                }));
            }),

            // Listener para mudanças de step
            templateEventSystem.addEventListener('step_changed' as TemplateEventType, (event: any) => {
                if (event.templateId === templateId) {
                    setCurrentStep(event.payload.stepIndex);
                }
            }),

            // Listener para resultados de validação
            templateEventSystem.addEventListener('validation_completed' as TemplateEventType, (event: any) => {
                if (event.templateId === templateId) {
                    setValidationResult(event.payload.result);
                }
            }),

            // Listener para erros
            templateEventSystem.addEventListener('error_occurred' as TemplateEventType, (event: any) => {
                if (event.templateId === templateId) {
                    setErrors((prev: any) => [...prev, event.payload.error]);
                }
            })
        ];

        return () => {
            listeners.forEach(cleanup => cleanup());
        };
    }, [templateId]);

    // Função para atualizar dados do formulário
    const updateFormData = useCallback((path: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [path]: value
        }));

        // Disparar evento de mudança
        templateEventSystem.emit('form_data_changed' as TemplateEventType, { path, value }, templateId);
    }, [templateId]);

    // Função para navegar entre steps
    const navigateToStep = useCallback((stepIndex: number) => {
        setCurrentStep(stepIndex);

        templateEventSystem.emit('step_changed' as TemplateEventType, { stepIndex }, templateId);
    }, [templateId]);

    // Função para validar template
    const validateTemplate = useCallback(async () => {
        if (!template) return { isValid: false, errors: ['Template não carregado'] };

        const result = { isValid: true, errors: [] };
        setValidationResult(result);

        templateEventSystem.emit('validation_completed' as TemplateEventType, { result }, templateId);

        return result;
    }, [template, templateId]);

    // Função para salvar template
    const saveTemplate = useCallback(async () => {
        const validation = await validateTemplate();

        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }

        templateEventSystem.emit('template_save_requested' as TemplateEventType, { formData }, templateId);

        return { success: true, data: formData };
    }, [formData, templateId, validateTemplate]);

    return {
        // Estados
        template,
        formData,
        currentStep,
        isLoading,
        errors,
        validationResult,

        // Ações
        updateFormData,
        navigateToStep,
        validateTemplate,
        saveTemplate,

        // Utilitários
        isValid: validationResult.isValid,
        canSave: validationResult.isValid && !isLoading,
        progress: template ? (currentStep / (template.tags?.length || 1)) * 100 : 0
    };
}

/**
 * Hook para gerenciar plugins do template
 */
export function useTemplatePlugins(templateId: string) {
    const [plugins, setPlugins] = useState<any[]>([]);
    const [activePlugins, setActivePlugins] = useState<string[]>([]);

    useEffect(() => {
        // Mock de plugins disponíveis
        const availablePlugins = [
            { id: 'quiz-analytics', name: 'Quiz Analytics', version: '1.0.0' }
        ];
        setPlugins(availablePlugins);
        setActivePlugins(['quiz-analytics']);
    }, [templateId]);

    const activatePlugin = useCallback(async (pluginId: string) => {
        setActivePlugins(prev => [...prev, pluginId]);
    }, []);

    const deactivatePlugin = useCallback(async (pluginId: string) => {
        setActivePlugins(prev => prev.filter(id => id !== pluginId));
    }, []);

    return {
        plugins,
        activePlugins,
        activatePlugin,
        deactivatePlugin,
        isPluginActive: (pluginId: string) => activePlugins.includes(pluginId)
    };
}

/**
 * Hook para analytics do template
 */
export function useTemplateAnalytics(templateId: string) {
    const [analytics, setAnalytics] = useState<any>({
        views: 0,
        completions: 0,
        conversionRate: 0,
        avgTime: 0
    });

    useEffect(() => {
        // Simular carregamento de analytics
        setAnalytics({
            views: Math.floor(Math.random() * 1000),
            completions: Math.floor(Math.random() * 800),
            conversionRate: Math.floor(Math.random() * 100),
            avgTime: Math.floor(Math.random() * 300)
        });
    }, [templateId]);

    return analytics;
}

export default useEnhancedTemplate;
