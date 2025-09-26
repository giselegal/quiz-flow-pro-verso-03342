/**
 * 🤖 AI-ENHANCED HYBRID TEMPLATE SERVICE - IA + TEMPLATES UNIFICADOS
 * 
 * Hierarquia de prioridade:
 * 1. 🤖 AI-Generated Templates (quando habilitado)
 * 2. Override JSON específico (step-XX-template.json)
 * 3. Master JSON (quiz21-complete.json)
 * 4. TypeScript fallback (quiz21StepsComplete.ts)
 * 5. 🧠 AI Fallback (geração inteligente quando tudo falha)
 */

import { GitHubModelsAI } from './GitHubModelsAI';

// 🎯 INTERFACES EXPANDIDAS COM IA
export interface AIConfig {
    enabled: boolean;
    provider: 'github-models' | 'openai' | 'gemini';
    model?: string;
    fallbackEnabled: boolean;
    personalizationEnabled: boolean;
    optimizationEnabled: boolean;
    contentGenerationEnabled: boolean;
}

export interface StepBehaviorConfig {
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowBack: boolean;
    // 🤖 NOVOS: Configurações de IA
    aiOptimized?: boolean;
    aiPersonalized?: boolean;
    aiGeneratedContent?: boolean;
}

export interface StepValidationConfig {
    type: 'input' | 'selection' | 'none' | 'transition';
    required: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minLength?: number;
    message: string;
    // 🤖 NOVOS: Validações inteligentes
    aiValidation?: boolean;
    aiSuggestions?: string[];
}

export interface AIGeneratedContent {
    title?: string;
    description?: string;
    questions?: string[];
    options?: string[];
    personalizedText?: string;
    optimizedConfig?: Partial<StepTemplate>;
}

export interface StepTemplate {
    metadata: {
        name: string;
        description: string;
        type: string;
        category: string;
        // 🤖 NOVOS: Metadados de IA
        aiGenerated?: boolean;
        aiOptimized?: boolean;
        aiPersonalizationScore?: number;
        aiConfidence?: number;
    };
    behavior: StepBehaviorConfig;
    validation: StepValidationConfig;
    blocks?: any[];
    // 🤖 NOVO: Conteúdo gerado por IA
    aiContent?: AIGeneratedContent;
}

export interface MasterTemplate {
    templateVersion: string;
    metadata: any;
    globalConfig: {
        navigation: {
            autoAdvanceSteps: number[];
            manualAdvanceSteps: number[];
            autoAdvanceDelay: number;
        };
        validation: {
            rules: Record<string, any>;
        };
        // 🤖 NOVO: Configurações de IA globais
        ai?: AIConfig;
    };
    steps: Record<string, StepTemplate>;
}

// 🧠 CONTEXTO DE IA PARA PERSONALIZAÇÃO
export interface AIContext {
    userId?: string;
    userName?: string;
    previousAnswers?: Record<string, any>;
    userSegment?: string;
    sessionData?: Record<string, any>;
    performanceData?: {
        stepCompletionTimes: number[];
        dropOffPoints: number[];
        conversionRate: number;
    };
}

interface StepOverrideData {
    templateVersion: string;
    stepId: string;
    timestamp: string;
    aiEnhanced: boolean;
    overrides: Partial<StepTemplate>;
}

class AIEnhancedHybridTemplateService {
    private static masterTemplate: MasterTemplate | null = null;
    private static overrideCache = new Map<string, StepTemplate | StepOverrideData>();
    private static aiService: GitHubModelsAI | null = null;
    private static aiContext: AIContext = {};
    private static aiConfig: AIConfig = {
        enabled: true,
        provider: 'github-models',
        fallbackEnabled: true,
        personalizationEnabled: true,
        optimizationEnabled: true,
        contentGenerationEnabled: true,
    };

    /**
     * 🤖 INICIALIZAR SERVIÇO DE IA
     */
    static initializeAI(config?: Partial<AIConfig>): void {
        this.aiConfig = { ...this.aiConfig, ...config };

        if (this.aiConfig.enabled) {
            try {
                // Disable AI for now to avoid environment issues in Lovable
                console.warn('⚠️ AI disabled temporarily - token management in progress');
                this.aiConfig.enabled = false;
                return;

                /* 
                this.aiService = new GitHubModelsAI({
                    token: '',
                    model: 'gpt-4o-mini',
                    maxTokens: 1000,
                    temperature: 0.7
                });
                console.log('🤖 AI Service initialized successfully');
                */
            } catch (error) {
                console.warn('⚠️ Failed to initialize AI service:', error);
                this.aiConfig.enabled = false;
            }
        }
    }

    /**
     * 🧠 DEFINIR CONTEXTO DE IA PARA PERSONALIZAÇÃO
     */
    static setAIContext(context: Partial<AIContext>): void {
        this.aiContext = { ...this.aiContext, ...context };
        console.log('🧠 AI Context updated:', Object.keys(context));
    }

    /**
     * 🏆 MÉTODO PRINCIPAL ENHANCED - Com IA integrada
     */
    static async getStepConfig(stepNumber: number, aiContext?: Partial<AIContext>): Promise<StepTemplate> {
        try {
            // Atualizar contexto se fornecido
            if (aiContext) {
                this.setAIContext(aiContext);
            }

            const stepId = `step-${stepNumber}`;

            // 1. 🤖 TENTAR GERAR COM IA (se habilitado)
            let aiGenerated: StepTemplate | null = null;
            if (this.aiConfig.enabled && this.aiConfig.contentGenerationEnabled) {
                aiGenerated = await this.generateStepWithAI(stepNumber);
            }

            // 2. Tentar carregar override específico
            const override = await this.loadStepOverride(stepId);

            // 3. Carregar master template se necessário
            if (!this.masterTemplate) {
                await this.loadMasterTemplate();
            }

            // 4. Obter configuração base do master
            const masterStep = this.masterTemplate?.steps[stepId];

            // 5. Aplicar regras globais baseadas no número da etapa
            const globalRules = this.getGlobalRules(stepNumber);

            // 6. 🧠 MERGEAR TUDO COM INTELIGÊNCIA DE IA
            const finalConfig: StepTemplate = await this.mergeConfigWithAI({
                globalRules,
                masterStep,
                override,
                aiGenerated,
                stepNumber
            });

            console.log(`✅ AI-Enhanced HybridTemplateService: Step ${stepNumber} configurado`, {
                hasOverride: !!override,
                hasMaster: !!masterStep,
                hasAI: !!aiGenerated,
                aiOptimized: finalConfig.behavior.aiOptimized,
                aiConfidence: finalConfig.metadata.aiConfidence,
                autoAdvance: finalConfig.behavior.autoAdvance,
                requiredSelections: finalConfig.validation.requiredSelections,
            });

            return finalConfig;

        } catch (error) {
            console.error(`❌ AI-Enhanced HybridTemplateService: Erro ao carregar step ${stepNumber}:`, error);
            return this.getFallbackConfig(stepNumber);
        }
    }

    /**
     * 🤖 GERAR TEMPLATE COM IA
     */
    private static async generateStepWithAI(stepNumber: number): Promise<StepTemplate | null> {
        if (!this.aiService || !this.aiConfig.contentGenerationEnabled) {
            console.warn('⚠️ AI service not available or content generation disabled');
            return null;
        }

        try {
            const prompt = this.buildAIPrompt(stepNumber);
            
            if (!this.aiService.generateContent) {
                console.warn('⚠️ AI service generateContent method not available');
                return null;
            }

            const aiResponse = await this.aiService.generateContent({
                messages: [
                    {
                        role: 'system',
                        content: `Você é um especialista em UX e templates de quiz. 
                        Gere configurações otimizadas para etapas de quiz baseadas no contexto fornecido.
                        Responda sempre em JSON válido seguindo a estrutura StepTemplate.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                maxTokens: 800,
                temperature: 0.7
            });

            if (!aiResponse?.content) {
                console.warn('⚠️ AI service returned empty response');
                return null;
            }

            const aiConfig = JSON.parse(aiResponse.content);

            // Validar e estruturar a resposta da IA
            const aiTemplate: StepTemplate = {
                metadata: {
                    name: aiConfig.metadata?.name || `AI Step ${stepNumber}`,
                    description: aiConfig.metadata?.description || `IA-generated step ${stepNumber}`,
                    type: this.inferStepType(stepNumber),
                    category: 'quiz',
                    aiGenerated: true,
                    aiConfidence: aiConfig.confidence || 0.8,
                    aiOptimized: true
                },
                behavior: {
                    ...this.getGlobalRules(stepNumber).behavior,
                    ...aiConfig.behavior,
                    aiOptimized: true,
                    aiPersonalized: this.aiConfig.personalizationEnabled
                },
                validation: {
                    ...this.getGlobalRules(stepNumber).validation,
                    ...aiConfig.validation,
                    aiValidation: true,
                    aiSuggestions: aiConfig.suggestions || []
                },
                blocks: aiConfig.blocks || [],
                aiContent: {
                    title: aiConfig.aiContent?.title,
                    description: aiConfig.aiContent?.description,
                    questions: aiConfig.aiContent?.questions,
                    options: aiConfig.aiContent?.options,
                    personalizedText: aiConfig.aiContent?.personalizedText
                }
            };

            console.log(`🤖 Template gerado por IA para step ${stepNumber}:`, {
                confidence: aiTemplate.metadata.aiConfidence,
                hasPersonalization: !!aiTemplate.aiContent?.personalizedText
            });

            return aiTemplate;

        } catch (error) {
            console.warn(`⚠️ Erro ao gerar template com IA para step ${stepNumber}:`, error);
            return null;
        }
    }

    /**
     * 🧠 CONSTRUIR PROMPT PARA IA
     */
    private static buildAIPrompt(stepNumber: number): string {
        const stepType = this.inferStepType(stepNumber);
        const globalRules = this.getGlobalRules(stepNumber);

        return `
Gere uma configuração otimizada para um quiz de descoberta de estilo pessoal:

CONTEXTO:
- Etapa: ${stepNumber}/21
- Tipo: ${stepType}
- Usuário: ${this.aiContext.userName || 'Anônimo'}
- Respostas anteriores: ${JSON.stringify(this.aiContext.previousAnswers || {})}
- Segmento: ${this.aiContext.userSegment || 'Não definido'}

REGRAS GLOBAIS ATUAIS:
- Auto-advance: ${globalRules.behavior.autoAdvance}
- Tipo de validação: ${globalRules.validation.type}
- Seleções obrigatórias: ${globalRules.validation.requiredSelections || 'N/A'}

OBJETIVOS:
1. Otimizar a experiência do usuário
2. Aumentar a taxa de conversão
3. Personalizar baseado no contexto
4. Manter consistência com o fluxo

Responda com JSON contendo:
{
  "metadata": {
    "name": "Nome da etapa",
    "description": "Descrição otimizada"
  },
  "behavior": {
    "autoAdvanceDelay": number (otimizado),
    "aiOptimizations": ["lista de otimizações aplicadas"]
  },
  "validation": {
    "message": "Mensagem personalizada",
    "aiSuggestions": ["sugestões inteligentes"]
  },
  "aiContent": {
    "title": "Título personalizado",
    "description": "Descrição personalizada",
    "personalizedText": "Texto baseado no contexto do usuário"
  },
  "confidence": 0.8,
  "reasoning": "Por que essas configurações são otimais"
}`;
    }

    /**
     * 🧠 MERGEAR CONFIGURAÇÕES COM INTELIGÊNCIA DE IA
     */
    private static async mergeConfigWithAI({
        globalRules,
        masterStep,
        override,
        aiGenerated,
        stepNumber
    }: {
        globalRules: { behavior: StepBehaviorConfig; validation: StepValidationConfig };
        masterStep?: StepTemplate;
        override?: any;
        aiGenerated?: StepTemplate | null;
        stepNumber: number;
    }): Promise<StepTemplate> {

        // Configuração base
        let finalConfig: StepTemplate = {
            metadata: {
                name: `Step ${stepNumber}`,
                description: `Etapa ${stepNumber}`,
                type: this.inferStepType(stepNumber),
                category: 'quiz',
                ...masterStep?.metadata,
                ...override?.metadata,
            },
            behavior: {
                ...globalRules.behavior,
                ...masterStep?.behavior,
                ...override?.behavior,
            },
            validation: {
                ...globalRules.validation,
                ...masterStep?.validation,
                ...override?.validation,
            },
            blocks: override?.blocks || masterStep?.blocks || [],
        };

        // 🤖 APLICAR MELHORIAS DA IA
        if (aiGenerated && this.aiConfig.enabled) {
            // Mergear metadados com informações da IA
            finalConfig.metadata = {
                ...finalConfig.metadata,
                aiGenerated: true,
                aiOptimized: true,
                aiPersonalizationScore: aiGenerated.metadata.aiConfidence || 0.8,
                aiConfidence: aiGenerated.metadata.aiConfidence || 0.8
            };

            // 🧠 OTIMIZAÇÃO INTELIGENTE DO COMPORTAMENTO
            if (this.aiConfig.optimizationEnabled && aiGenerated.behavior) {
                finalConfig.behavior = {
                    ...finalConfig.behavior,
                    ...aiGenerated.behavior,
                    aiOptimized: true,
                    aiPersonalized: this.aiConfig.personalizationEnabled
                };
            }

            // 🎯 PERSONALIZAÇÃO INTELIGENTE DA VALIDAÇÃO
            if (aiGenerated.validation) {
                finalConfig.validation = {
                    ...finalConfig.validation,
                    message: aiGenerated.validation.message || finalConfig.validation.message,
                    aiValidation: true,
                    aiSuggestions: aiGenerated.validation.aiSuggestions || []
                };
            }

            // 📝 CONTEÚDO GERADO POR IA
            if (aiGenerated.aiContent) {
                finalConfig.aiContent = aiGenerated.aiContent;
            }

            // 🎨 BLOCOS OTIMIZADOS PELA IA (se disponível)
            if (aiGenerated.blocks && aiGenerated.blocks.length > 0) {
                finalConfig.blocks = this.mergeBlocks(finalConfig.blocks || [], aiGenerated.blocks);
            }
        }

        // 🚀 APLICAR OTIMIZAÇÕES BASEADAS EM PERFORMANCE
        if (this.aiConfig.optimizationEnabled && this.aiContext.performanceData) {
            finalConfig = await this.applyPerformanceOptimizations(finalConfig, stepNumber);
        }

        return finalConfig;
    }

    /**
     * 🚀 APLICAR OTIMIZAÇÕES BASEADAS EM PERFORMANCE
     */
    private static async applyPerformanceOptimizations(
        config: StepTemplate,
        stepNumber: number
    ): Promise<StepTemplate> {
        const perfData = this.aiContext.performanceData;
        if (!perfData) return config;

        // 📊 Análise de performance para otimizações
        const avgCompletionTime = perfData.stepCompletionTimes[stepNumber - 1] || 0;
        const isDropOffPoint = perfData.dropOffPoints.includes(stepNumber);
        const conversionRate = perfData.conversionRate;

        // 🎯 OTIMIZAÇÕES BASEADAS EM DADOS
        if (avgCompletionTime > 30000) { // Mais de 30 segundos
            config.behavior.autoAdvanceDelay = Math.max(1000, config.behavior.autoAdvanceDelay - 500);
            config.metadata.aiOptimized = true;
        }

        if (isDropOffPoint) {
            config.validation.message = config.aiContent?.personalizedText ||
                "Você está indo muito bem! Continue descobrindo seu estilo único.";
            config.behavior.aiPersonalized = true;
        }

        if (conversionRate < 0.5) { // Taxa de conversão baixa
            config.behavior.autoAdvance = false; // Dar mais controle ao usuário
            config.validation.aiSuggestions?.push("Dica: Suas escolhas ajudam a criar seu perfil único!");
        }

        return config;
    }

    /**
     * 📦 MERGE INTELIGENTE DE BLOCOS
     */
    private static mergeBlocks(existingBlocks: any[], aiBlocks: any[]): any[] {
        if (aiBlocks.length === 0) return existingBlocks;
        if (existingBlocks.length === 0) return aiBlocks;

        // Estratégia: Manter blocos essenciais, adicionar melhorias da IA
        const merged = [...existingBlocks];

        aiBlocks.forEach(aiBlock => {
            if (aiBlock.type === 'ai-enhancement' || aiBlock.type === 'personalization') {
                merged.push(aiBlock);
            }
        });

        return merged;
    }

    /**
     * 🤖 PERSONALIZAR CONTEÚDO COM IA
     */
    static async personalizeContent(
        content: string,
        context: AIContext = {}
    ): Promise<string> {
        if (!this.aiService || !this.aiConfig.personalizationEnabled) {
            return content;
        }

        try {
            const personalizedResponse = await this.aiService.improveText(
                content,
                `Personalizar para usuário: ${context.userName || 'usuário'}, 
                 Segmento: ${context.userSegment || 'geral'}, 
                 Contexto: Quiz de descoberta de estilo pessoal`
            );

            return personalizedResponse || content;
        } catch (error) {
            console.warn('⚠️ Erro na personalização de conteúdo:', error);
            return content;
        }
    }

    /**
     * 🧠 ANÁLISE PREDITIVA DE PERFORMANCE
     */
    static async predictStepPerformance(stepNumber: number): Promise<{
        predictedCompletionTime: number;
        predictedDropOffRate: number;
        predictedEngagement: number;
        recommendations: string[];
    }> {
        if (!this.aiService) {
            return {
                predictedCompletionTime: 15000,
                predictedDropOffRate: 0.1,
                predictedEngagement: 0.8,
                recommendations: ['Análise preditiva não disponível - IA desabilitada']
            };
        }

        try {
            const analysisPrompt = `
Analise a performance prevista para a etapa ${stepNumber} de um quiz de 21 etapas:

CONTEXTO:
- Tipo de etapa: ${this.inferStepType(stepNumber)}
- Dados históricos: ${JSON.stringify(this.aiContext.performanceData)}
- Configurações atuais: ${JSON.stringify(this.getGlobalRules(stepNumber))}

Forneça previsões e recomendações em JSON:
{
  "predictedCompletionTime": number (em ms),
  "predictedDropOffRate": number (0-1),
  "predictedEngagement": number (0-1),
  "recommendations": ["lista de recomendações específicas"]
}`;

            const response = await this.aiService.generateContent({
                messages: [
                    { role: 'system', content: 'Você é um especialista em UX Analytics e Performance Prediction.' },
                    { role: 'user', content: analysisPrompt }
                ]
            });

            return JSON.parse(response.content);
        } catch (error) {
            console.warn('⚠️ Erro na análise preditiva:', error);
            return {
                predictedCompletionTime: 15000,
                predictedDropOffRate: 0.15,
                predictedEngagement: 0.75,
                recommendations: ['Erro na análise - usar configurações padrão']
            };
        }
    }

    // 🔄 MÉTODOS HERDADOS (mantidos para compatibilidade)
    private static async loadMasterTemplate(): Promise<void> {
        try {
            const response = await fetch('/templates/quiz21-complete.json');
            if (response.ok) {
                this.masterTemplate = await response.json();

                // 🤖 CONFIGURAR IA SE DEFINIDA NO MASTER
                if (this.masterTemplate?.globalConfig?.ai) {
                    this.initializeAI(this.masterTemplate.globalConfig.ai);
                }

                console.log('✅ Master template carregado:', this.masterTemplate?.metadata?.id);
            }
        } catch (error) {
            console.warn('⚠️ Falha ao carregar master template:', error);
        }
    }

    private static async loadStepOverride(stepId: string): Promise<any | null> {
        try {
            if (this.overrideCache.has(stepId)) {
                return this.overrideCache.get(stepId);
            }

            const normalizedStepId = this.normalizeStepId(stepId);
            const templatePath = `/templates/${normalizedStepId}-template.json`;

            const response = await fetch(templatePath);
            if (response.ok) {
                const override = await response.json();
                this.overrideCache.set(stepId, override);
                console.log(`✅ Override carregado para ${stepId}`);
                return override;
            }

            if (response.status === 404) {
                console.log(`⚠️ Template ${templatePath} não encontrado (404)`);

                // 🤖 TENTAR GERAR COM IA COMO FALLBACK
                if (this.aiConfig.enabled && this.aiConfig.fallbackEnabled) {
                    const aiTemplate = await this.generateStepWithAI(
                        parseInt(stepId.replace(/\D/g, ''), 10)
                    );
                    if (aiTemplate) {
                        this.overrideCache.set(stepId, aiTemplate);
                        console.log(`🤖 Template gerado por IA para ${stepId}`);
                        return aiTemplate;
                    }
                }

                const defaultTemplate = this.createDefaultTemplate(normalizedStepId);
                this.overrideCache.set(stepId, defaultTemplate);
                return defaultTemplate;
            }

            return null;
        } catch (error) {
            console.warn(`⚠️ Falha ao carregar override para ${stepId}:`, error);
            return null;
        }
    }

    private static normalizeStepId(stepId: string): string {
        if (stepId.match(/^step-\d{2}$/)) {
            return stepId;
        }

        const stepNumber = parseInt(stepId.replace(/\D/g, ''), 10);
        if (!isNaN(stepNumber)) {
            return `step-${stepNumber.toString().padStart(2, '0')}`;
        }

        return stepId;
    }

    private static createDefaultTemplate(stepId: string): StepTemplate {
        const stepNumber = parseInt(stepId.replace(/\D/g, ''), 10) || 1;
        const globalRules = this.getGlobalRules(stepNumber);

        return {
            metadata: {
                name: `Template padrão - ${stepId}`,
                description: `Template padrão gerado para ${stepId}`,
                type: this.inferStepType(stepNumber),
                category: 'quiz',
                aiGenerated: false
            },
            behavior: globalRules.behavior,
            validation: globalRules.validation,
            blocks: [],
        };
    }

    private static getGlobalRules(stepNumber: number): { behavior: StepBehaviorConfig; validation: StepValidationConfig } {
        // Mesma lógica do HybridTemplateService original
        if (stepNumber === 1) {
            return {
                behavior: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: false,
                    allowBack: false,
                },
                validation: {
                    type: 'input',
                    required: true,
                    minLength: 2,
                    message: 'Digite seu nome para continuar',
                },
            };
        }

        if (stepNumber >= 2 && stepNumber <= 11) {
            return {
                behavior: {
                    autoAdvance: true,
                    autoAdvanceDelay: 1500,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 3,
                    maxSelections: 3,
                    message: 'Selecione 3 opções para continuar',
                },
            };
        }

        if (stepNumber === 12 || stepNumber === 19) {
            return {
                behavior: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'transition',
                    required: false,
                    message: 'Clique em "Continuar" para prosseguir',
                },
            };
        }

        if (stepNumber >= 13 && stepNumber <= 18) {
            return {
                behavior: {
                    autoAdvance: false,
                    autoAdvanceDelay: 0,
                    showProgress: true,
                    allowBack: true,
                },
                validation: {
                    type: 'selection',
                    required: true,
                    requiredSelections: 1,
                    maxSelections: 1,
                    message: 'Selecione uma opção para continuar',
                },
            };
        }

        return {
            behavior: {
                autoAdvance: false,
                autoAdvanceDelay: 0,
                showProgress: true,
                allowBack: stepNumber < 21,
            },
            validation: {
                type: 'none',
                required: false,
                message: '',
            },
        };
    }

    private static inferStepType(stepNumber: number): string {
        if (stepNumber === 1) return 'intro';
        if (stepNumber >= 2 && stepNumber <= 11) return 'question';
        if (stepNumber === 12 || stepNumber === 19) return 'transition';
        if (stepNumber >= 13 && stepNumber <= 18) return 'strategic';
        if (stepNumber === 20) return 'result';
        if (stepNumber === 21) return 'offer';
        return 'other';
    }

    private static getFallbackConfig(stepNumber: number): StepTemplate {
        const globalRules = this.getGlobalRules(stepNumber);
        return {
            metadata: {
                name: `Fallback Step ${stepNumber}`,
                description: `Configuração fallback para etapa ${stepNumber}`,
                type: this.inferStepType(stepNumber),
                category: 'fallback',
                aiGenerated: false
            },
            behavior: globalRules.behavior,
            validation: globalRules.validation,
            blocks: [],
        };
    }

    // 🤖 MÉTODOS PÚBLICOS DE IA
    static async saveStepOverride(stepNumber: number, changes: Partial<StepTemplate>): Promise<void> {
        const stepId = `step-${stepNumber}`;

        // 🧠 OTIMIZAR MUDANÇAS COM IA
        if (this.aiConfig.enabled && this.aiConfig.optimizationEnabled) {
            const optimizedChanges = await this.optimizeConfigWithAI(changes, stepNumber);
            changes = { ...changes, ...optimizedChanges };
        }

        const overrideData = {
            templateVersion: '2.0',
            stepId,
            timestamp: new Date().toISOString(),
            aiEnhanced: this.aiConfig.enabled,
            overrides: changes,
        };

        this.overrideCache.set(stepId, overrideData);
        console.log(`💾 AI-Enhanced Override salvo para ${stepId}:`, changes);
    }

    private static async optimizeConfigWithAI(
        changes: Partial<StepTemplate>,
        stepNumber: number
    ): Promise<Partial<StepTemplate>> {
        if (!this.aiService) return {};

        try {
            const optimizationPrompt = `
Otimize as seguintes configurações para a etapa ${stepNumber}:
${JSON.stringify(changes, null, 2)}

Contexto do usuário: ${JSON.stringify(this.aiContext)}
Tipo de etapa: ${this.inferStepType(stepNumber)}

Retorne apenas as otimizações sugeridas em JSON.`;

            const response = await this.aiService.generateContent({
                messages: [
                    { role: 'system', content: 'Você é um especialista em otimização de UX para quizzes.' },
                    { role: 'user', content: optimizationPrompt }
                ]
            });

            return JSON.parse(response.content);
        } catch (error) {
            console.warn('⚠️ Erro na otimização com IA:', error);
            return {};
        }
    }

    static clearCache(): void {
        this.masterTemplate = null;
        this.overrideCache.clear();
        this.aiContext = {};
        console.log('🔄 Cache limpo (incluindo contexto IA)');
    }

    // 🤖 MÉTODO PARA OBTER STATUS DA IA
    static getAIStatus(): {
        enabled: boolean;
        provider: string;
        features: string[];
        contextualized: boolean;
        cacheSize: number;
    } {
        return {
            enabled: this.aiConfig.enabled,
            provider: this.aiConfig.provider,
            features: [
                this.aiConfig.contentGenerationEnabled ? 'content-generation' : '',
                this.aiConfig.personalizationEnabled ? 'personalization' : '',
                this.aiConfig.optimizationEnabled ? 'optimization' : '',
                this.aiConfig.fallbackEnabled ? 'ai-fallback' : ''
            ].filter(Boolean),
            contextualized: Object.keys(this.aiContext).length > 0,
            cacheSize: this.overrideCache.size
        };
    }
}

export default AIEnhancedHybridTemplateService;