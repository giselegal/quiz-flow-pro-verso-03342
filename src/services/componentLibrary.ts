/**
 * 🧩 SISTEMA DE COMPONENTES REUTILIZÁVEIS
 * Component Library System para Templates Escaláveis
 * 
 * Permite criar templates através de composição de componentes,
 * facilitando manutenção e reutilização em larga escala.
 * 
 * Fase 2: Sistema de Componentes - Roadmap de Escalabilidade
 */

import { getLogger } from '@/utils/logging';

const logger = getLogger();

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface ComponentMetadata {
    id: string;
    name: string;
    description: string;
    category: ComponentCategory;
    version: string;
    compatibility: CompatibilityInfo;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    organizationId?: string;
}

export interface Component extends ComponentMetadata {
    type: ComponentType;
    properties: ComponentProperties;
    variants: ComponentVariant[];
    dependencies: ComponentDependency[];
    usage: ComponentUsage;
    theme: ThemeConfiguration;
}

export interface ComponentVariant {
    id: string;
    name: string;
    description: string;
    overrides: PropertyOverride[];
    conditions?: VariantCondition[];
}

export interface ComponentProperties {
    schema: PropertySchema;
    defaults: Record<string, any>;
    required: string[];
    validation: ValidationRule[];
}

export interface PropertyOverride {
    propertyPath: string;
    value: any;
    condition?: string;
}

export interface VariantCondition {
    type: 'device' | 'theme' | 'ab_test' | 'user_segment';
    value: any;
}

export interface ComponentDependency {
    componentId: string;
    version: string;
    required: boolean;
}

export interface ComponentUsage {
    timesUsed: number;
    lastUsed: string;
    popularIn: string[]; // template IDs
    performance: PerformanceMetrics;
}

export interface CompatibilityInfo {
    minVersion: string;
    maxVersion?: string;
    supportedDevices: string[];
    supportedBrowsers: string[];
}

export interface ThemeConfiguration {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: number;
    spacing: SpacingConfiguration;
    shadows: ShadowConfiguration;
}

export interface SpacingConfiguration {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface ShadowConfiguration {
    sm: string;
    md: string;
    lg: string;
}

export interface PropertySchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'array' | 'object';
        description: string;
        defaultValue?: any;
        options?: any[];
        validation?: ValidationRule;
    };
}

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => boolean | string;
}

export interface PerformanceMetrics {
    loadTime: number;
    renderTime: number;
    bundleSize: number;
    cacheHitRate: number;
}

export type ComponentCategory =
    | 'header'
    | 'navigation'
    | 'content'
    | 'form'
    | 'cta'
    | 'social'
    | 'media'
    | 'footer'
    | 'layout'
    | 'widget';

export type ComponentType =
    | 'quiz-header'
    | 'quiz-question'
    | 'options-grid'
    | 'progress-bar'
    | 'form-container'
    | 'button-cta'
    | 'result-display'
    | 'social-proof'
    | 'testimonials'
    | 'timer-urgency'
    | 'footer-links'
    | 'hero-section'
    | 'pricing-table'
    | 'feature-grid';

// ============================================================================
// BIBLIOTECA DE COMPONENTES PRÉ-DEFINIDOS
// ============================================================================

export class ComponentLibrary {
    private components = new Map<string, Component>();
    private categories = new Map<ComponentCategory, Component[]>();
    constructor() {
        // Logger available if needed
        console.log('ComponentLibrary initialized');
        this.initializeBuiltInComponents();
    }

    // ============================================================================
    // COMPONENTES PRÉ-DEFINIDOS
    // ============================================================================

    private initializeBuiltInComponents(): void {
        // 📝 HEADER COMPONENT
        this.registerComponent({
            id: 'quiz-header-standard',
            name: 'Quiz Header Standard',
            description: 'Cabeçalho padrão para quiz com logo, progresso e navegação',
            category: 'header',
            type: 'quiz-header',
            version: '1.0.0',
            compatibility: {
                minVersion: '1.0.0',
                supportedDevices: ['desktop', 'mobile', 'tablet'],
                supportedBrowsers: ['chrome', 'firefox', 'safari', 'edge']
            },
            tags: ['quiz', 'header', 'navigation', 'standard'],
            properties: {
                schema: {
                    showLogo: {
                        type: 'boolean',
                        description: 'Mostrar logo da marca',
                        defaultValue: true
                    },
                    showProgress: {
                        type: 'boolean',
                        description: 'Mostrar barra de progresso',
                        defaultValue: true
                    },
                    title: {
                        type: 'string',
                        description: 'Título do cabeçalho',
                        defaultValue: ''
                    },
                    subtitle: {
                        type: 'string',
                        description: 'Subtítulo do cabeçalho',
                        defaultValue: ''
                    },
                    backgroundColor: {
                        type: 'string',
                        description: 'Cor de fundo',
                        defaultValue: '#F8F9FA'
                    }
                },
                defaults: {
                    showLogo: true,
                    showProgress: true,
                    title: 'Quiz de Estilo',
                    subtitle: 'Descubra seu estilo pessoal',
                    backgroundColor: '#F8F9FA'
                },
                required: ['title'],
                validation: [
                    {
                        required: true,
                        minLength: 3,
                        maxLength: 100
                    }
                ]
            },
            variants: [
                {
                    id: 'minimalist',
                    name: 'Minimalista',
                    description: 'Versão simplificada sem elementos extras',
                    overrides: [
                        {
                            propertyPath: 'showProgress',
                            value: false
                        },
                        {
                            propertyPath: 'backgroundColor',
                            value: '#FFFFFF'
                        }
                    ]
                },
                {
                    id: 'branded',
                    name: 'Com Marca',
                    description: 'Versão com elementos de branding destacados',
                    overrides: [
                        {
                            propertyPath: 'showLogo',
                            value: true
                        },
                        {
                            propertyPath: 'backgroundColor',
                            value: '#B89B7A'
                        }
                    ]
                }
            ],
            dependencies: [],
            usage: {
                timesUsed: 0,
                lastUsed: new Date().toISOString(),
                popularIn: [],
                performance: {
                    loadTime: 150,
                    renderTime: 50,
                    bundleSize: 1200,
                    cacheHitRate: 0.85
                }
            },
            theme: {
                primaryColor: '#B89B7A',
                secondaryColor: '#432818',
                fontFamily: 'Inter, sans-serif',
                borderRadius: 8,
                spacing: {
                    xs: 4,
                    sm: 8,
                    md: 16,
                    lg: 24,
                    xl: 32
                },
                shadows: {
                    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system'
        });

        // 📋 QUIZ QUESTION COMPONENT
        this.registerComponent({
            id: 'quiz-question-grid',
            name: 'Quiz Question Grid',
            description: 'Grid de opções para questões de quiz com múltipla seleção',
            category: 'content',
            type: 'quiz-question',
            version: '1.2.0',
            compatibility: {
                minVersion: '1.0.0',
                supportedDevices: ['desktop', 'mobile', 'tablet'],
                supportedBrowsers: ['chrome', 'firefox', 'safari', 'edge']
            },
            tags: ['quiz', 'question', 'options', 'grid', 'interactive'],
            properties: {
                schema: {
                    question: {
                        type: 'string',
                        description: 'Pergunta a ser exibida',
                        defaultValue: ''
                    },
                    options: {
                        type: 'array',
                        description: 'Lista de opções disponíveis',
                        defaultValue: []
                    },
                    multipleSelection: {
                        type: 'boolean',
                        description: 'Permite seleção múltipla',
                        defaultValue: true
                    },
                    requiredSelections: {
                        type: 'number',
                        description: 'Número mínimo de seleções obrigatórias',
                        defaultValue: 1
                    },
                    maxSelections: {
                        type: 'number',
                        description: 'Número máximo de seleções permitidas',
                        defaultValue: 3
                    },
                    columns: {
                        type: 'number',
                        description: 'Número de colunas no grid',
                        defaultValue: 2
                    },
                    showImages: {
                        type: 'boolean',
                        description: 'Mostrar imagens nas opções',
                        defaultValue: true
                    }
                },
                defaults: {
                    question: 'Selecione suas opções favoritas:',
                    options: [],
                    multipleSelection: true,
                    requiredSelections: 1,
                    maxSelections: 3,
                    columns: 2,
                    showImages: true
                },
                required: ['question', 'options'],
                validation: [
                    {
                        required: true,
                        minLength: 10
                    }
                ]
            },
            variants: [
                {
                    id: 'single-choice',
                    name: 'Escolha Única',
                    description: 'Permite apenas uma seleção',
                    overrides: [
                        {
                            propertyPath: 'multipleSelection',
                            value: false
                        },
                        {
                            propertyPath: 'maxSelections',
                            value: 1
                        }
                    ]
                },
                {
                    id: 'text-only',
                    name: 'Apenas Texto',
                    description: 'Opções apenas com texto, sem imagens',
                    overrides: [
                        {
                            propertyPath: 'showImages',
                            value: false
                        },
                        {
                            propertyPath: 'columns',
                            value: 1
                        }
                    ]
                }
            ],
            dependencies: [],
            usage: {
                timesUsed: 0,
                lastUsed: new Date().toISOString(),
                popularIn: [],
                performance: {
                    loadTime: 200,
                    renderTime: 75,
                    bundleSize: 2100,
                    cacheHitRate: 0.78
                }
            },
            theme: {
                primaryColor: '#3B82F6',
                secondaryColor: '#1E40AF',
                fontFamily: 'Inter, sans-serif',
                borderRadius: 12,
                spacing: {
                    xs: 4,
                    sm: 8,
                    md: 16,
                    lg: 24,
                    xl: 32
                },
                shadows: {
                    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system'
        });

        // 🎯 CTA BUTTON COMPONENT
        this.registerComponent({
            id: 'cta-button-primary',
            name: 'CTA Button Primary',
            description: 'Botão de call-to-action principal otimizado para conversão',
            category: 'cta',
            type: 'button-cta',
            version: '2.1.0',
            compatibility: {
                minVersion: '1.0.0',
                supportedDevices: ['desktop', 'mobile', 'tablet'],
                supportedBrowsers: ['chrome', 'firefox', 'safari', 'edge']
            },
            tags: ['cta', 'button', 'conversion', 'primary'],
            properties: {
                schema: {
                    text: {
                        type: 'string',
                        description: 'Texto do botão',
                        defaultValue: 'Clique aqui'
                    },
                    size: {
                        type: 'string',
                        description: 'Tamanho do botão',
                        defaultValue: 'medium',
                        options: ['small', 'medium', 'large']
                    },
                    backgroundColor: {
                        type: 'string',
                        description: 'Cor de fundo',
                        defaultValue: '#B89B7A'
                    },
                    textColor: {
                        type: 'string',
                        description: 'Cor do texto',
                        defaultValue: '#FFFFFF'
                    },
                    action: {
                        type: 'string',
                        description: 'Ação a ser executada',
                        defaultValue: 'next-step',
                        options: ['next-step', 'submit', 'external-link', 'custom']
                    },
                    fullWidth: {
                        type: 'boolean',
                        description: 'Botão ocupa toda a largura',
                        defaultValue: false
                    }
                },
                defaults: {
                    text: 'Continuar',
                    size: 'medium',
                    backgroundColor: '#B89B7A',
                    textColor: '#FFFFFF',
                    action: 'next-step',
                    fullWidth: false
                },
                required: ['text', 'action'],
                validation: [
                    {
                        required: true,
                        minLength: 2,
                        maxLength: 50
                    }
                ]
            },
            variants: [
                {
                    id: 'urgent',
                    name: 'Urgência',
                    description: 'Botão com elementos visuais de urgência',
                    overrides: [
                        {
                            propertyPath: 'backgroundColor',
                            value: '#DC2626'
                        },
                        {
                            propertyPath: 'size',
                            value: 'large'
                        }
                    ]
                },
                {
                    id: 'subtle',
                    name: 'Sutil',
                    description: 'Botão com aparência mais discreta',
                    overrides: [
                        {
                            propertyPath: 'backgroundColor',
                            value: '#6B7280'
                        },
                        {
                            propertyPath: 'size',
                            value: 'small'
                        }
                    ]
                }
            ],
            dependencies: [],
            usage: {
                timesUsed: 0,
                lastUsed: new Date().toISOString(),
                popularIn: [],
                performance: {
                    loadTime: 50,
                    renderTime: 25,
                    bundleSize: 800,
                    cacheHitRate: 0.92
                }
            },
            theme: {
                primaryColor: '#B89B7A',
                secondaryColor: '#432818',
                fontFamily: 'Inter, sans-serif',
                borderRadius: 8,
                spacing: {
                    xs: 4,
                    sm: 8,
                    md: 16,
                    lg: 24,
                    xl: 32
                },
                shadows: {
                    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system'
        });

        logger.info('component-library', 'Built-in components initialized', {
            componentsCount: this.components.size
        });
    }

    // ============================================================================
    // MÉTODOS PÚBLICOS - GERENCIAMENTO DE COMPONENTES
    // ============================================================================

    registerComponent(component: Component): void {
        // Validar componente
        if (!this.validateComponent(component)) {
            throw new Error(`Invalid component: ${component.id}`);
        }

        this.components.set(component.id, component);

        // Organizar por categoria
        if (!this.categories.has(component.category)) {
            this.categories.set(component.category, []);
        }
        this.categories.get(component.category)!.push(component);

        logger.info('component-library', 'Component registered', {
            componentId: component.id,
            category: component.category,
            version: component.version
        });
    }

    getComponent(id: string): Component | null {
        return this.components.get(id) || null;
    }

    getComponentsByCategory(category: ComponentCategory): Component[] {
        return this.categories.get(category) || [];
    }

    getAllComponents(): Component[] {
        return Array.from(this.components.values());
    }

    searchComponents(query: string): Component[] {
        const searchTerm = query.toLowerCase();
        return this.getAllComponents().filter(component =>
            component.name.toLowerCase().includes(searchTerm) ||
            component.description.toLowerCase().includes(searchTerm) ||
            component.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // ============================================================================
    // COMPOSIÇÃO DE TEMPLATES
    // ============================================================================

    composeTemplate(
        templateId: string,
        composition: ComponentComposition
    ): ComposedTemplate {
        logger.info('component-library', 'Composing template', {
            templateId,
            componentsCount: composition.components.length
        });

        const composedComponents = composition.components.map(componentRef => {
            const component = this.getComponent(componentRef.componentId);
            if (!component) {
                throw new Error(`Component not found: ${componentRef.componentId}`);
            }

            // Aplicar overrides se existirem
            const finalProperties = this.applyOverrides(
                component.properties.defaults,
                componentRef.overrides || []
            );

            // Aplicar variante se especificada
            if (componentRef.variantId) {
                const variant = component.variants.find(v => v.id === componentRef.variantId);
                if (variant) {
                    Object.assign(finalProperties, this.applyOverrides(finalProperties, variant.overrides));
                }
            }

            return {
                componentId: component.id,
                type: component.type,
                properties: finalProperties,
                order: componentRef.order,
                stepId: componentRef.stepId
            };
        });

        return {
            templateId,
            name: composition.name,
            description: composition.description,
            components: composedComponents,
            layout: composition.layout,
            theme: composition.theme || this.getDefaultTheme(),
            createdAt: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // ============================================================================
    // MÉTODOS PRIVADOS
    // ============================================================================

    private validateComponent(component: Component): boolean {
        // Validações básicas
        if (!component.id || !component.name || !component.type) {
            return false;
        }

        // Validar ID único
        if (this.components.has(component.id)) {
            return false;
        }

        // Validar versioning semântico
        const versionRegex = /^\d+\.\d+\.\d+$/;
        if (!versionRegex.test(component.version)) {
            return false;
        }

        return true;
    }

    private applyOverrides(
        baseProperties: Record<string, any>,
        overrides: PropertyOverride[]
    ): Record<string, any> {
        const result = { ...baseProperties };

        overrides.forEach(override => {
            // Aplicar override usando dot notation
            this.setPropertyByPath(result, override.propertyPath, override.value);
        });

        return result;
    }

    private setPropertyByPath(obj: any, path: string, value: any): void {
        const keys = path.split('.');
        const lastKey = keys.pop()!;
        const target = keys.reduce((current, key) => {
            if (!(key in current)) {
                current[key] = {};
            }
            return current[key];
        }, obj);
        target[lastKey] = value;
    }

    private getDefaultTheme(): ThemeConfiguration {
        return {
            primaryColor: '#B89B7A',
            secondaryColor: '#432818',
            fontFamily: 'Inter, sans-serif',
            borderRadius: 8,
            spacing: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }
        };
    }
}

// ============================================================================
// INTERFACES PARA COMPOSIÇÃO
// ============================================================================

export interface ComponentReference {
    componentId: string;
    variantId?: string;
    overrides?: PropertyOverride[];
    order: number;
    stepId: string;
}

export interface ComponentComposition {
    name: string;
    description: string;
    components: ComponentReference[];
    layout: LayoutConfiguration;
    theme?: ThemeConfiguration;
}

export interface LayoutConfiguration {
    maxWidth: string;
    padding: string;
    margin: string;
    gap: string;
    alignment: 'left' | 'center' | 'right';
}

export interface ComposedTemplate {
    templateId: string;
    name: string;
    description: string;
    components: ComposedComponent[];
    layout: LayoutConfiguration;
    theme: ThemeConfiguration;
    createdAt: string;
    version: string;
}

export interface ComposedComponent {
    componentId: string;
    type: ComponentType;
    properties: Record<string, any>;
    order: number;
    stepId: string;
}

// ============================================================================
// EXPORTAR INSTÂNCIA SINGLETON
// ============================================================================

export const componentLibrary = new ComponentLibrary();

export default componentLibrary;