/**
 * 📊 EDITOR DATA SERVICE
 * 
 * Serviço para conectar fontes de dados JSON com o painel de propriedades,
 * permitindo edição bi-direcional e sincronização em tempo real.
 */

import { QuizFunnelSchema, FunnelStep } from '../../../types/quiz-schema';

// ============================================================================
// CONFIGURAÇÃO DO SERVIÇO
// ============================================================================

interface EditorDataServiceConfig {
    autoSave: boolean;
    autoSaveInterval: number;
    enableCache: boolean;
    enableValidation: boolean;
}

interface DataChangeEvent {
    type: 'schema-updated' | 'step-updated' | 'global-settings-updated' | 'publication-updated';
    schemaId: string;
    timestamp: string;
    data?: any;
}

type DataChangeListener = (event: DataChangeEvent) => void;

interface SaveResult {
    success: boolean;
    location: 'localStorage' | 'supabase' | 'file';
    timestamp: string;
    error?: string;
}

// ============================================================================
// SERVIÇO PRINCIPAL
// ============================================================================

class EditorDataService {
    private static instance: EditorDataService;
    private config: EditorDataServiceConfig;
    private currentSchema: QuizFunnelSchema | null = null;
    private isDirty: boolean = false;
    private listeners: DataChangeListener[] = [];

    private constructor(config: EditorDataServiceConfig) {
        this.config = config;
    }

    public static getInstance(config: EditorDataServiceConfig): EditorDataService {
        if (!EditorDataService.instance) {
            EditorDataService.instance = new EditorDataService(config);
        }
        return EditorDataService.instance;
    }

    // ============================================================================
    // CARREGAMENTO DE DADOS JSON
    // ============================================================================

    public async loadSchemaFromJson(
        source: 'template' | 'saved' | 'file',
        schemaId: string
    ): Promise<QuizFunnelSchema> {
        console.log(`🔄 Carregando schema de ${source}: ${schemaId}`);

        let schema: QuizFunnelSchema;

        try {
            switch (source) {
                case 'template':
                    schema = await this.loadFromTemplate(schemaId);
                    break;
                case 'saved':
                    schema = await this.loadFromLocalStorage(schemaId);
                    break;
                case 'file':
                    schema = await this.loadFromFile(schemaId);
                    break;
                default:
                    throw new Error(`Fonte não suportada: ${source}`);
            }

            this.currentSchema = schema;
            this.isDirty = false;
            this.notifyListeners({
                type: 'schema-updated',
                schemaId: schema.id,
                timestamp: new Date().toISOString(),
                data: schema
            });

            console.log('✅ Schema carregado com sucesso via EditorDataService');
            return schema;

        } catch (error) {
            console.error('❌ Erro ao carregar schema:', error);
            throw error;
        }
    }

    // ============================================================================
    // SALVAMENTO DE DADOS
    // ============================================================================

    public async saveSchema(): Promise<SaveResult[]> {
        if (!this.currentSchema) {
            return [{ success: false, location: 'localStorage', timestamp: new Date().toISOString(), error: 'Nenhum schema ativo' }];
        }

        console.log('💾 Salvando schema...');

        const results: SaveResult[] = [];

        // Salvar no localStorage
        try {
            await this.saveToLocalStorage(this.currentSchema);
            results.push({
                success: true,
                location: 'localStorage',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            results.push({
                success: false,
                location: 'localStorage',
                timestamp: new Date().toISOString(),
                error: String(error)
            });
        }

        // Tentar salvar no Supabase se configurado
        try {
            await this.saveToSupabase(this.currentSchema);
            results.push({
                success: true,
                location: 'supabase',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.warn('⚠️ Falha ao salvar no Supabase (continuando...)', error);
        }

        this.isDirty = false;

        return results;
    }

    // ============================================================================
    // ATUALIZAÇÕES DE DADOS
    // ============================================================================

    public updateStep(stepId: string, updates: Partial<FunnelStep>): void {
        if (!this.currentSchema) return;

        const stepIndex = this.currentSchema.steps.findIndex(step => step.id === stepId);
        if (stepIndex === -1) return;

        // Aplicar as atualizações
        this.currentSchema.steps[stepIndex] = {
            ...this.currentSchema.steps[stepIndex],
            ...updates
        };

        this.markAsDirty();
        this.notifyListeners({
            type: 'step-updated',
            schemaId: this.currentSchema.id,
            timestamp: new Date().toISOString(),
            data: { stepId, updates }
        });
    }

    public updateGlobalSettings(updates: Partial<QuizFunnelSchema['settings']>): void {
        if (!this.currentSchema) return;

        this.currentSchema.settings = {
            ...this.currentSchema.settings,
            ...updates
        };

        this.markAsDirty();
        this.notifyListeners({
            type: 'global-settings-updated',
            schemaId: this.currentSchema.id,
            timestamp: new Date().toISOString(),
            data: updates
        });
    }

    public updatePublicationSettings(updates: Partial<QuizFunnelSchema['publication']>): void {
        if (!this.currentSchema) return;

        this.currentSchema.publication = {
            ...this.currentSchema.publication,
            ...updates
        };

        this.markAsDirty();
        this.notifyListeners({
            type: 'publication-updated',
            schemaId: this.currentSchema.id,
            timestamp: new Date().toISOString(),
            data: updates
        });
    }

    // ============================================================================
    // GESTÃO DE ESTADO
    // ============================================================================

    public getCurrentSchema(): QuizFunnelSchema | null {
        return this.currentSchema;
    }

    public isDirtySchema(): boolean {
        return this.isDirty;
    }

    public addChangeListener(listener: DataChangeListener): () => void {
        this.listeners.push(listener);

        // Retorna função para remover o listener
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    // ============================================================================
    // MÉTODOS PRIVADOS
    // ============================================================================

    private markAsDirty(): void {
        this.isDirty = true;
        if (this.currentSchema) {
            this.currentSchema.editorMeta.lastModified = new Date().toISOString();
        }
    }

    private notifyListeners(event: DataChangeEvent): void {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (error) {
                console.error('❌ Erro ao executar listener:', error);
            }
        });
    }

    // ============================================================================
    // CARREGAMENTO DE DADOS
    // ============================================================================

    private async loadFromTemplate(templateId: string): Promise<QuizFunnelSchema> {
        console.log(`📋 Carregando template: ${templateId}`);

        // Simular carregamento de template
        // Em implementação real, carregaria de arquivos JSON ou API
        const mockSchema: QuizFunnelSchema = {
            id: templateId,
            name: `Template ${templateId}`,
            description: 'Template carregado via EditorDataService',
            version: '1.0.0',
            category: 'quiz',
            templateType: 'quiz-complete',

            steps: [
                {
                    id: 'step-1',
                    name: 'Introdução',
                    description: 'Etapa inicial do quiz',
                    type: 'intro',
                    order: 1,
                    blocks: [],
                    settings: {
                        showProgress: true,
                        progressStyle: 'bar',
                        showBackButton: false,
                        showNextButton: true,
                        allowSkip: false,
                        trackTimeOnStep: true,
                        trackInteractions: true,
                        customEvents: []
                    },
                    navigation: {
                        nextButton: { text: 'Começar', visible: true, conditions: [] },
                        backButton: { text: 'Voltar', visible: false },
                        skipButton: { text: 'Pular', visible: false, conditions: [] }
                    },
                    validation: {
                        required: false,
                        rules: [],
                        errorMessages: {}
                    }
                }
            ],

            settings: {
                seo: {
                    title: `Template ${templateId}`,
                    description: 'Template carregado via EditorDataService',
                    keywords: ['template', 'quiz'],
                    robots: 'index,follow',
                    openGraph: {
                        title: `Template ${templateId}`,
                        description: 'Template carregado via EditorDataService',
                        image: '',
                        imageAlt: '',
                        type: 'website',
                        url: '',
                        siteName: 'Quiz Quest'
                    },
                    twitter: {
                        card: 'summary_large_image',
                        title: `Template ${templateId}`,
                        description: 'Template carregado via EditorDataService',
                        image: '',
                        creator: '@quizquest',
                        site: '@quizquest'
                    },
                    structuredData: {
                        '@type': 'Quiz',
                        name: `Template ${templateId}`,
                        description: 'Template carregado via EditorDataService',
                        provider: {
                            '@type': 'Organization',
                            name: 'Quiz Quest',
                            url: 'https://quizquest.com',
                            logo: 'https://quizquest.com/logo.png'
                        },
                        category: ['quiz', 'education'],
                        dateCreated: new Date().toISOString(),
                        dateModified: new Date().toISOString()
                    }
                },
                analytics: {
                    enabled: false,
                    googleAnalytics: {
                        measurementId: '',
                        enableEcommerce: false,
                        customEvents: []
                    }
                },
                branding: {
                    colors: {
                        primary: '#B89B7A',
                        secondary: '#D4C2A8',
                        accent: '#4CAF50',
                        background: '#F9F5F1',
                        surface: '#FFFFFF',
                        text: {
                            primary: '#333333',
                            secondary: '#666666',
                            disabled: '#CCCCCC'
                        },
                        error: '#F44336',
                        warning: '#FF9800',
                        success: '#4CAF50'
                    },
                    typography: {
                        fontFamily: {
                            primary: 'Inter, system-ui, sans-serif',
                            secondary: 'Poppins, sans-serif',
                            monospace: 'Monaco, Consolas, monospace'
                        },
                        fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem',
                            base: '1rem',
                            lg: '1.125rem',
                            xl: '1.25rem',
                            '2xl': '1.5rem'
                        }
                    },
                    brand: {
                        logo: {
                            primary: '',
                            secondary: '',
                            favicon: '',
                            appleTouchIcon: ''
                        }
                    },
                    spacing: {
                        xs: '0.5rem',
                        sm: '1rem',
                        md: '1.5rem',
                        lg: '2rem',
                        xl: '3rem',
                        '2xl': '4rem'
                    },
                    borderRadius: {
                        none: '0px',
                        sm: '0.25rem',
                        md: '0.5rem',
                        lg: '0.75rem',
                        xl: '1rem',
                        full: '50%'
                    },
                    shadows: {
                        sm: '0 1px 2px rgba(0,0,0,0.05)',
                        md: '0 4px 6px rgba(0,0,0,0.1)',
                        lg: '0 10px 15px rgba(0,0,0,0.1)',
                        xl: '0 20px 25px rgba(0,0,0,0.1)'
                    }
                },
                persistence: {
                    enabled: true,
                    storage: ['localStorage', 'supabase'],
                    autoSave: true,
                    autoSaveInterval: 30000,
                    compression: false,
                    encryption: false,
                    backupEnabled: true
                },
                integrations: {},
                performance: {
                    lazyLoading: true,
                    cacheEnabled: true,
                    compressionEnabled: false,
                    preloadNextStep: true
                },
                legal: {
                    privacyPolicyUrl: '',
                    termsOfServiceUrl: '',
                    cookieConsentRequired: false
                }
            },

            publication: {
                status: 'draft',
                baseUrl: '',
                slug: templateId,
                version: '1.0.0',
                accessControl: {
                    public: true,
                    password: undefined,
                    allowedDomains: [],
                    ipWhitelist: []
                },
                cdn: {
                    enabled: false
                },
                meta: {
                    publishedAt: undefined,
                    lastPublished: undefined,
                    version: '1.0.0'
                }
            },

            editorMeta: {
                version: '1.0.0',
                created: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                stats: {
                    totalBlocks: 1,
                    totalSteps: 1,
                    estimatedCompletionTime: 300,
                    lastTestRun: undefined
                }
            }
        };

        return mockSchema;
    }

    private async loadFromLocalStorage(schemaId: string): Promise<QuizFunnelSchema> {
        const stored = localStorage.getItem(`quiz-schema-${schemaId}`);
        if (!stored) {
            throw new Error(`Schema não encontrado no localStorage: ${schemaId}`);
        }

        return JSON.parse(stored);
    }

    private async loadFromFile(filePath: string): Promise<QuizFunnelSchema> {
        // Implementação para carregar de arquivo seria feita aqui
        throw new Error('Carregamento de arquivo não implementado ainda');
    }

    // ============================================================================
    // SALVAMENTO DE DADOS
    // ============================================================================

    private async saveToLocalStorage(schema: QuizFunnelSchema): Promise<void> {
        const key = `quiz-schema-${schema.id}`;
        localStorage.setItem(key, JSON.stringify(schema));
        console.log(`💾 Schema salvo no localStorage: ${key}`);
    }

    private async saveToSupabase(schema: QuizFunnelSchema): Promise<void> {
        // Implementação do Supabase seria feita aqui
        console.log('📤 Salvamento no Supabase ainda não implementado');
        throw new Error('Supabase não configurado');
    }
}

export default EditorDataService;