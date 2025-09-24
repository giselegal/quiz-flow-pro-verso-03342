/**
 * 🎯 REGISTRY CENTRAL DE TEMPLATES
 * 
 * Registro centralizado e otimizado de todos os templates de funil
 * Permite lazy loading, cache inteligente e estrutura consistente
 */

// ============================================================================
// TIPOS PARA TEMPLATES
// ============================================================================

export interface TemplateMetadata {
    id: string;
    name: string;
    description: string;
    category: 'quiz-complete' | 'lead-magnet' | 'webinar' | 'survey' | 'calculator';
    stepCount: number;
    thumbnail: string;
    isOfficial: boolean;
    usageCount: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface TemplateStep {
    stepNumber: number;
    type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
    title: string;
    subtitle?: string;
    blocks: any[];
    validation?: {
        required?: boolean;
        minSelections?: number;
        maxSelections?: number;
    };
    navigation?: {
        nextButton?: string;
        autoAdvance?: boolean;
        autoAdvanceDelay?: number;
    };
}

export interface TemplateConfig {
    globalConfig: {
        theme: {
            primaryColor: string;
            secondaryColor: string;
            accentColor?: string;
        };
        navigation: {
            allowBack: boolean;
            showProgress: boolean;
        };
        analytics?: {
            enabled: boolean;
            trackingId?: string;
        };
    };
    seo?: {
        title: string;
        description: string;
        keywords: string[];
    };
    tracking?: {
        googleAnalytics?: string;
        facebookPixel?: string;
        customEvents?: Record<string, any>;
    };
}

export interface FullTemplate extends TemplateMetadata {
    config: TemplateConfig;
    steps: TemplateStep[];
}

// ============================================================================
// CACHE INTELIGENTE
// ============================================================================

const templateCache = new Map<string, FullTemplate>();
const metadataCache = new Map<string, TemplateMetadata>();

// ============================================================================
// TEMPLATES DISPONÍVEIS - ENHANCED VERSION
// ============================================================================

// Interface estendida que mantém compatibilidade
export interface EnhancedTemplateMetadata extends TemplateMetadata {
    // 🔥 CAMPOS ADICIONAIS BASEADOS NOS INSIGHTS DE PROJETOS GITHUB
    version?: string;
    author?: string;
    difficulty?: 'básico' | 'intermediário' | 'avançado';
    estimatedTime?: number;
    features?: string[];
    loader: () => Promise<any>;

    // Novas funcionalidades
    eventHandlers?: string[];
    validationRules?: string[];
    requiredPlugins?: string[];
    optionalPlugins?: string[];

    // Configurações avançadas
    settings?: {
        allowCustomization?: boolean;
        supportsDragDrop?: boolean;
        supportsRealTimeValidation?: boolean;
        supportsPlugins?: boolean;
        cacheStrategy?: 'aggressive' | 'normal' | 'minimal';
    };

    // Analytics e performance
    analytics?: {
        usage?: number;
        completionRate?: number;
        averageTime?: number;
        userRating?: number;
    };
}

// Templates disponíveis com funcionalidades avançadas
export const AVAILABLE_TEMPLATES: Record<string, EnhancedTemplateMetadata> = {
    testTemplate: {
        id: 'testTemplate',
        name: 'Template de Teste Enhanced',
        description: 'Template básico com sistema de eventos e validação dinâmica',
        category: 'survey',
        stepCount: 3,
        thumbnail: '/images/templates/test-template.jpg',
        isOfficial: true,
        usageCount: 150,
        tags: ['teste', 'desenvolvimento', 'eventos', 'validação'],
        createdAt: '2024-01-01',
        updatedAt: '2024-12-30',

        // Campos enhanced
        version: '2.0.0',
        author: 'Sistema Enhanced',
        difficulty: 'básico',
        estimatedTime: 5,
        features: ['validação dinâmica', 'sistema de eventos', 'plugins básicos'],
        loader: () => import('../testTemplate'),
        eventHandlers: ['template:basic'],
        validationRules: ['basic-validation'],
        settings: {
            allowCustomization: true,
            supportsDragDrop: false,
            supportsRealTimeValidation: true,
            supportsPlugins: true,
            cacheStrategy: 'normal'
        },
        analytics: {
            usage: 150,
            completionRate: 85,
            averageTime: 4.2,
            userRating: 4.1
        }
    },

    quiz21StepsComplete: {
        id: 'quiz21StepsComplete',
        name: 'Quiz 21 Etapas Pro',
        description: 'Template completo com sistema avançado de eventos, validação e plugins',
        category: 'quiz-complete',
        stepCount: 21,
        thumbnail: '/images/templates/quiz-21-complete.jpg',
        isOfficial: true,
        usageCount: 890,
        tags: ['quiz', 'completo', '21-etapas', 'pro', 'plugins'],
        createdAt: '2024-01-15',
        updatedAt: '2024-12-30',

        // Campos enhanced
        version: '3.0.0',
        author: 'QuizQuest Enhanced Team',
        difficulty: 'avançado',
        estimatedTime: 45,
        features: [
            'validação avançada',
            'progress tracking',
            'analytics',
            'múltiplos tipos de questão',
            'sistema de eventos completo',
            'plugins extensíveis',
            'drag & drop'
        ],
        loader: () => import('../quiz21StepsComplete'),
        eventHandlers: ['quiz:advanced', 'progress:tracking', 'analytics:collection'],
        validationRules: ['quiz-validation', 'step-validation', 'conditional-validation'],
        requiredPlugins: ['quiz-core', 'progress-tracker'],
        optionalPlugins: ['analytics', 'social-sharing', 'theme-customizer'],
        settings: {
            allowCustomization: true,
            supportsDragDrop: true,
            supportsRealTimeValidation: true,
            supportsPlugins: true,
            cacheStrategy: 'aggressive'
        },
        analytics: {
            usage: 890,
            completionRate: 78,
            averageTime: 42.5,
            userRating: 4.7
        }
    },
} as const;

// ============================================================================
// FUNÇÕES DO REGISTRY
// ============================================================================

/**
 * Obter lista de todos os templates disponíveis
 */
export function getAllTemplateMetadata(): TemplateMetadata[] {
    return Object.values(AVAILABLE_TEMPLATES);
}

/**
 * Obter metadados de um template específico
 */
export function getTemplateMetadata(templateId: string): TemplateMetadata | null {
    if (metadataCache.has(templateId)) {
        return metadataCache.get(templateId)!;
    }

    const metadata = AVAILABLE_TEMPLATES[templateId];
    if (metadata) {
        metadataCache.set(templateId, metadata);
    }

    return metadata || null;
}

/**
 * Filtrar templates por categoria
 */
export function getTemplatesByCategory(category: string): TemplateMetadata[] {
    return getAllTemplateMetadata().filter(template =>
        category === 'all' || template.category === category
    );
}

/**
 * Buscar templates por tags ou nome
 */
export function searchTemplates(query: string): TemplateMetadata[] {
    const lowerQuery = query.toLowerCase();
    return getAllTemplateMetadata().filter(template =>
        template.name.toLowerCase().includes(lowerQuery) ||
        template.description.toLowerCase().includes(lowerQuery) ||
        template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}

/**
 * 🚀 ENHANCED TEMPLATE LOADING com Sistema de Eventos
 * Carregamento inteligente com cache, eventos e validação
 */
export async function loadFullTemplate(templateId: string): Promise<FullTemplate | null> {
    try {
        // Verificar cache primeiro
        if (templateCache.has(templateId)) {
            const cachedTemplate = templateCache.get(templateId)!;

            // Emitir evento de carregamento do cache
            if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
                (window as any).templateEventSystem.emit('template:loaded', {
                    templateId,
                    source: 'cache',
                    loadTime: 0
                }, templateId);
            }

            return cachedTemplate;
        }

        // Obter metadados enhanced
        const enhancedMetadata = AVAILABLE_TEMPLATES[templateId] as EnhancedTemplateMetadata;
        if (!enhancedMetadata) {
            console.error(`Template ${templateId} não encontrado no registry enhanced`);
            return null;
        }

        // Registrar início do carregamento
        const loadStartTime = performance.now();

        if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
            (window as any).templateEventSystem.emit('template:loading', {
                templateId,
                source: 'dynamic-import'
            }, templateId);
        }

        // Carregar usando o loader dinâmico
        let templateModule;

        try {
            const moduleResult = await enhancedMetadata.loader();

            // Lidar com diferentes formatos de export
            if (moduleResult.default) {
                templateModule = moduleResult.default;
            } else if (moduleResult[`${templateId}Template`]) {
                templateModule = moduleResult[`${templateId}Template`];
            } else {
                templateModule = moduleResult;
            }

        } catch (importError) {
            console.error(`Erro ao carregar template ${templateId}:`, importError);

            // Emitir evento de erro
            if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
                (window as any).templateEventSystem.emit('template:error', {
                    templateId,
                    error: (importError as any)?.message || 'Erro de importação',
                    phase: 'import'
                }, templateId);
            }

            return null;
        }

        // Combinar metadados com conteúdo do template
        const fullTemplate: FullTemplate = {
            ...enhancedMetadata,
            config: templateModule.config || {},
            steps: templateModule.steps || []
        };

        // Cache inteligente baseado na estratégia
        const cacheStrategy = enhancedMetadata.settings?.cacheStrategy || 'normal';

        switch (cacheStrategy) {
            case 'aggressive':
                templateCache.set(templateId, fullTemplate);
                break;
            case 'normal':
                if (templateCache.size < 5) { // Limitar cache
                    templateCache.set(templateId, fullTemplate);
                }
                break;
            case 'minimal':
                // Não fazer cache
                break;
        }

        // Incrementar uso
        enhancedMetadata.usageCount++;

        // Registrar tempo de carregamento
        const loadTime = performance.now() - loadStartTime;

        // Emitir evento de sucesso
        if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
            (window as any).templateEventSystem.emit('template:loaded', {
                templateId,
                source: 'dynamic-import',
                loadTime,
                cacheStrategy,
                hasPlugins: !!(enhancedMetadata.requiredPlugins?.length || enhancedMetadata.optionalPlugins?.length),
                hasValidation: !!(enhancedMetadata.validationRules?.length),
                hasEventHandlers: !!(enhancedMetadata.eventHandlers?.length)
            }, templateId);
        }

        console.log(`✅ Template ${templateId} carregado com sucesso em ${loadTime.toFixed(2)}ms`);
        return fullTemplate;

    } catch (error: any) {
        console.error(`❌ Erro crítico ao carregar template ${templateId}:`, error);

        // Emitir evento de erro crítico
        if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
            (window as any).templateEventSystem.emit('template:error', {
                templateId,
                error: error?.message || 'Erro desconhecido',
                phase: 'critical'
            }, templateId);
        }

        return null;
    }
}

/**
 * 🔥 ENHANCED TEMPLATE SYSTEM INITIALIZATION
 * Inicializar sistemas de eventos, validação e plugins
 */
export function initializeTemplateSystem(): void {
    // Disponibilizar sistemas globalmente para compatibilidade
    if (typeof window !== 'undefined') {
        // Sistema de eventos
        import('../events/TemplateEventSystem').then(({ templateEventSystem }) => {
            (window as any).templateEventSystem = templateEventSystem;
            console.log('🎯 Sistema de eventos de template inicializado');
        }).catch(() => {
            console.log('⚠️ Sistema de eventos não disponível');
        });

        // Sistema de validação
        import('../validation/DynamicValidationSystem').then(({ dynamicValidationSystem }) => {
            (window as any).dynamicValidationSystem = dynamicValidationSystem;
            console.log('✅ Sistema de validação dinâmica inicializado');
        }).catch(() => {
            console.log('⚠️ Sistema de validação não disponível');
        });

        // Sistema de plugins
        import('../plugins/PluginSystem').then(({ pluginSystem }) => {
            (window as any).pluginSystem = pluginSystem;
            console.log('🧩 Sistema de plugins inicializado');
        }).catch(() => {
            console.log('⚠️ Sistema de plugins não disponível');
        });
    }
}

/**
 * Converter template para formato do editor
 */
export function convertTemplateToEditorFormat(template: FullTemplate): any {
    return {
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        theme: 'default',
        stepCount: template.stepCount,
        isOfficial: template.isOfficial,
        usageCount: template.usageCount,
        tags: template.tags,
        thumbnailUrl: template.thumbnail,
        templateData: {
            globalConfig: template.config.globalConfig,
            steps: template.steps
        },
        components: template.steps.flatMap(step => step.blocks || []),
        createdAt: template.createdAt,
        updatedAt: template.updatedAt
    };
}

/**
 * Incrementar contador de uso do template com analytics enhanced
 */
export function incrementTemplateUsage(templateId: string): void {
    const template = AVAILABLE_TEMPLATES[templateId] as EnhancedTemplateMetadata;
    if (template) {
        template.usageCount++;

        // Atualizar analytics enhanced
        if (template.analytics) {
            template.analytics.usage = (template.analytics.usage || 0) + 1;
        }

        // Limpar cache para forçar recarregamento
        metadataCache.delete(templateId);
        templateCache.delete(templateId);

        // Emitir evento
        if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
            (window as any).templateEventSystem.emit('template:usage_incremented', {
                templateId,
                newCount: template.usageCount
            }, templateId);
        }
    }
}

/**
 * Limpar cache (útil para desenvolvimento)
 */
export function clearTemplateCache(): void {
    templateCache.clear();
    metadataCache.clear();

    // Emitir evento
    if (typeof window !== 'undefined' && (window as any).templateEventSystem) {
        (window as any).templateEventSystem.emit('cache:cleared', {
            timestamp: Date.now()
        }, 'system');
    }

    console.log('🧹 Cache de templates limpo');
}

/**
 * 🎯 ENHANCED ANALYTICS
 * Obter estatísticas dos templates
 */
export function getTemplateAnalytics(): any {
    const templates = Object.values(AVAILABLE_TEMPLATES) as EnhancedTemplateMetadata[];

    return {
        totalTemplates: templates.length,
        totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0),
        averageRating: templates
            .filter(t => t.analytics?.userRating)
            .reduce((sum, t, _, arr) => sum + ((t.analytics?.userRating || 0) / arr.length), 0),
        categoriesStats: templates.reduce((stats, template) => {
            stats[template.category] = (stats[template.category] || 0) + 1;
            return stats;
        }, {} as Record<string, number>),
        featuresStats: templates.reduce((stats, template) => {
            template.features?.forEach(feature => {
                stats[feature] = (stats[feature] || 0) + 1;
            });
            return stats;
        }, {} as Record<string, number>),
        pluginsStats: {
            templatesWithPlugins: templates.filter(t =>
                t.requiredPlugins?.length || t.optionalPlugins?.length
            ).length,
            totalRequiredPlugins: templates.reduce((sum, t) =>
                sum + (t.requiredPlugins?.length || 0), 0
            ),
            totalOptionalPlugins: templates.reduce((sum, t) =>
                sum + (t.optionalPlugins?.length || 0), 0
            )
        }
    };
}

// ============================================================================
// EXPORT DEFAULT ENHANCED
// ============================================================================

export default {
    getAllTemplateMetadata,
    getTemplateMetadata,
    getTemplatesByCategory,
    searchTemplates,
    loadFullTemplate,
    convertTemplateToEditorFormat,
    incrementTemplateUsage,
    clearTemplateCache,
    initializeTemplateSystem, // 🔥 Nova função
    getTemplateAnalytics, // 🔥 Nova função
    AVAILABLE_TEMPLATES
};