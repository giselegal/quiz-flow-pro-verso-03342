/**
 * 🎯 REGISTRY DE TIPOS DE FUNIS
 * 
 * Sistema centralizado para identificar e configurar diferentes tipos de funis
 * que podem ser editados no ModernUnifiedEditor
 */

import HybridTemplateService from './HybridTemplateService';

// ============================================================================
// INTERFACES
// ============================================================================

export interface FunnelType {
    id: string;
    name: string;
    description: string;
    category: 'quiz' | 'landing' | 'ecommerce' | 'lead-gen' | 'survey' | 'other';
    icon?: string;
    defaultSteps: number;
    supportsAI: boolean;
    hasCustomLogic: boolean;
    templateService?: any;
    editorConfig: {
        showStepNavigation: boolean;
        showProgressBar: boolean;
        allowReordering: boolean;
        supportsDragDrop: boolean;
        customComponents?: string[];
    };
}

export interface FunnelInstance {
    id: string;
    typeId: string;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'paused' | 'archived';
    createdAt: string;
    updatedAt: string;
    metadata?: Record<string, any>;
}

// ============================================================================
// REGISTRY DE TIPOS DE FUNIS
// ============================================================================

export const FUNNEL_TYPES: Record<string, FunnelType> = {
    // 🎨 QUIZ DE ESTILO PESSOAL - PRINCIPAL
    'quiz-estilo-21-steps': {
        id: 'quiz-estilo-21-steps',
        name: 'Quiz de Estilo Pessoal - 21 Etapas',
        description: 'Quiz completo para descoberta do estilo pessoal com 21 etapas interativas',
        category: 'quiz',
        icon: 'Target',
        defaultSteps: 21,
        supportsAI: true,
        hasCustomLogic: true,
        templateService: HybridTemplateService,
        editorConfig: {
            showStepNavigation: true,
            showProgressBar: true,
            allowReordering: false, // Ordem específica para lógica do quiz
            supportsDragDrop: true,
            customComponents: ['quiz-question', 'option-selector', 'result-display']
        }
    },

    // 🧪 QUIZ SIMPLES
    'quiz-simple': {
        id: 'quiz-simple',
        name: 'Quiz Simples',
        description: 'Quiz básico personalizável com perguntas e resultados',
        category: 'quiz',
        icon: 'HelpCircle',
        defaultSteps: 5,
        supportsAI: false,
        hasCustomLogic: false,
        editorConfig: {
            showStepNavigation: true,
            showProgressBar: true,
            allowReordering: true,
            supportsDragDrop: true
        }
    },

    // 📝 LANDING PAGE
    'landing-page': {
        id: 'landing-page',
        name: 'Landing Page',
        description: 'Página de captura ou conversão com formulário',
        category: 'landing',
        icon: 'FileText',
        defaultSteps: 3,
        supportsAI: true,
        hasCustomLogic: false,
        editorConfig: {
            showStepNavigation: false,
            showProgressBar: false,
            allowReordering: true,
            supportsDragDrop: true,
            customComponents: ['hero-section', 'form-capture', 'testimonials']
        }
    },

    // 🛒 FUNIL DE VENDAS
    'sales-funnel': {
        id: 'sales-funnel',
        name: 'Funil de Vendas',
        description: 'Funil completo com captura, apresentação e checkout',
        category: 'ecommerce',
        icon: 'ShoppingCart',
        defaultSteps: 7,
        supportsAI: true,
        hasCustomLogic: true,
        editorConfig: {
            showStepNavigation: true,
            showProgressBar: true,
            allowReordering: true,
            supportsDragDrop: true,
            customComponents: ['product-showcase', 'checkout-form', 'upsell-offer']
        }
    },

    // 📊 LEAD MAGNET
    'lead-magnet': {
        id: 'lead-magnet',
        name: 'Lead Magnet',
        description: 'Funil para captura de leads com material gratuito',
        category: 'lead-gen',
        icon: 'Users',
        defaultSteps: 4,
        supportsAI: false,
        hasCustomLogic: false,
        editorConfig: {
            showStepNavigation: true,
            showProgressBar: false,
            allowReordering: true,
            supportsDragDrop: true
        }
    }
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

/**
 * Obter tipo de funil por ID
 */
export function getFunnelType(typeId: string): FunnelType | null {
    return FUNNEL_TYPES[typeId] || null;
}

/**
 * Listar todos os tipos de funis disponíveis
 */
export function getAllFunnelTypes(): FunnelType[] {
    return Object.values(FUNNEL_TYPES);
}

/**
 * Listar tipos por categoria
 */
export function getFunnelTypesByCategory(category: FunnelType['category']): FunnelType[] {
    return Object.values(FUNNEL_TYPES).filter(type => type.category === category);
}

/**
 * Validar se um tipo de funil existe
 */
export function isValidFunnelType(typeId: string): boolean {
    return typeId in FUNNEL_TYPES;
}

/**
 * Gerar ID único para nova instância de funil
 */
export function generateFunnelInstanceId(typeId: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 4);
    return `${typeId}-${timestamp}-${randomSuffix}`;
}

/**
 * Criar nova instância de funil
 */
export function createFunnelInstance(
    typeId: string,
    name: string,
    description?: string
): FunnelInstance | null {
    const funnelType = getFunnelType(typeId);
    if (!funnelType) return null;

    return {
        id: generateFunnelInstanceId(typeId),
        typeId,
        name,
        description: description || funnelType.description,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
            stepCount: funnelType.defaultSteps,
            supportsAI: funnelType.supportsAI,
            hasCustomLogic: funnelType.hasCustomLogic
        }
    };
}

// ============================================================================
// INTEGRAÇÃO COM HYBRID TEMPLATE SERVICE
// ============================================================================

/**
 * Carregar configuração de funil usando service apropriado
 */
export async function loadFunnelConfig(funnelId: string, typeId: string) {
    const funnelType = getFunnelType(typeId);

    if (!funnelType) {
        throw new Error(`Tipo de funil inválido: ${typeId}`);
    }

    // Para o quiz de estilo, usar HybridTemplateService
    if (typeId === 'quiz-estilo-21-steps' && funnelType.templateService) {
        console.log('🎯 Carregando quiz usando HybridTemplateService...');

        try {
            // Carregar todas as etapas do quiz
            const steps = [];
            for (let i = 1; i <= 21; i++) {
                const stepConfig = await funnelType.templateService.getStepConfig(i);
                steps.push({
                    stepNumber: i,
                    ...stepConfig
                });
            }

            // Carregar configurações globais
            const globalConfig = funnelType.templateService.getGlobalConfig();

            return {
                id: funnelId,
                type: typeId,
                name: `Quiz de Estilo - ${funnelId}`,
                steps,
                globalConfig,
                totalSteps: 21,
                isQuiz: true
            };
        } catch (error) {
            console.error('Erro ao carregar quiz:', error);
            throw error;
        }
    }

    // Para outros tipos de funil, usar configuração padrão
    return {
        id: funnelId,
        type: typeId,
        name: `${funnelType.name} - ${funnelId}`,
        steps: Array.from({ length: funnelType.defaultSteps }, (_, i) => ({
            stepNumber: i + 1,
            name: `Etapa ${i + 1}`,
            blocks: []
        })),
        globalConfig: {},
        totalSteps: funnelType.defaultSteps
    };
}

/**
 * Salvar configuração de funil
 */
export async function saveFunnelConfig(funnelId: string, typeId: string, config: any) {
    const funnelType = getFunnelType(typeId);

    if (!funnelType) {
        throw new Error(`Tipo de funil inválido: ${typeId}`);
    }

    // Para o quiz de estilo, usar HybridTemplateService
    if (typeId === 'quiz-estilo-21-steps' && funnelType.templateService) {
        console.log('💾 Salvando quiz usando HybridTemplateService...');

        try {
            // Salvar cada step modificado
            if (config.steps) {
                for (const step of config.steps) {
                    if (step.modified) {
                        await funnelType.templateService.saveStepOverride(
                            step.stepNumber,
                            step
                        );
                    }
                }
            }

            return {
                success: true,
                message: `Quiz ${funnelId} salvo com sucesso`,
                savedSteps: config.steps?.filter((s: any) => s.modified)?.length || 0
            };
        } catch (error) {
            console.error('Erro ao salvar quiz:', error);
            throw error;
        }
    }

    // Para outros tipos, salvar configuração genérica
    console.log(`💾 Salvando funil ${typeId}:`, config);
    return {
        success: true,
        message: `Funil ${funnelId} salvo com sucesso`
    };
}

// ============================================================================
// CONFIGURAÇÕES PREDEFINIDAS
// ============================================================================

/**
 * IDs de funis predefinidos para desenvolvimento/teste
 */
export const PREDEFINED_FUNNELS: Record<string, { typeId: string; name: string }> = {
    'quiz-estilo-demo': {
        typeId: 'quiz-estilo-21-steps',
        name: 'Quiz de Estilo - Demo'
    },
    'landing-demo': {
        typeId: 'landing-page',
        name: 'Landing Page - Demo'
    },
    'sales-demo': {
        typeId: 'sales-funnel',
        name: 'Funil de Vendas - Demo'
    }
};

/**
 * Verificar se é um funil predefinido
 */
export function isPredefinedFunnel(funnelId: string): boolean {
    return funnelId in PREDEFINED_FUNNELS;
}

/**
 * Obter configuração de funil predefinido
 */
export function getPredefinedFunnelConfig(funnelId: string) {
    return PREDEFINED_FUNNELS[funnelId] || null;
}

export default FUNNEL_TYPES;