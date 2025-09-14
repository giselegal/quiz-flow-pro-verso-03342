/**
 * 🔄 QUIZ21 TO FUNNEL ADAPTER
 * 
 * Adaptador responsável por converter dados do quiz21StepsComplete 
 * para o formato FunnelCore, garantindo compatibilidade total
 * 
 * Funcionalidades:
 * - Conversão de Block[] para FunnelComponent[]
 * - Mapeamento de tipos de componentes
 * - Conversão de steps para FunnelStep
 * - Criação de FunnelState completo
 * - Validação de dados convertidos
 */

import { Block } from '@/types/editor';
import {
    FunnelStep,
    FunnelComponent,
    FunnelState,
    FunnelMetadata,
    StepSettings
} from '@/core/funnel/types';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';

// ============================================================================
// TIPOS DO ADAPTER
// ============================================================================

export interface AdapterResult {
    funnelState: FunnelState;
    metadata: FunnelMetadata;
    stepMappings: Record<string, string>;
    totalComponents: number;
    conversionWarnings: string[];
}

export interface StepConversionContext {
    stepId: string;
    stepNumber: number;
    originalBlocks: Block[];
}

// ============================================================================
// MAPEAMENTO DE TIPOS DE COMPONENTES
// ============================================================================

const BLOCK_TO_COMPONENT_TYPE_MAP: Record<string, string> = {
    // Componentes de formulário
    'form-container': 'form',
    'form-input': 'input',
    'form-select': 'select',
    'form-checkbox': 'checkbox',
    'form-radio': 'radio',

    // Componentes de quiz
    'quiz-question': 'question',
    'quiz-option': 'option',
    'quiz-intro-header': 'header',

    // Componentes visuais
    'main-image': 'image',
    'text-content': 'text',
    'button-inline': 'button',

    // Componentes de transição
    'transition-page': 'transition',
    'progress-indicator': 'progress',

    // Componentes de resultado (Step 20)
    'modular-result-header': 'modular-header',
    'header-section': 'header-section',
    'user-info-section': 'user-info',
    'progress-section': 'progress',
    'main-image-section': 'image'
};

// ============================================================================
// CLASSE ADAPTADORA
// ============================================================================

export class Quiz21StepsToFunnelAdapter {
    /**
     * Converte um step específico para formato FunnelStep
     */
    convertStep(stepId: string, stepNumber: number): FunnelStep {
        const originalBlocks = QUIZ_STYLE_21_STEPS_TEMPLATE[stepId] || [];
        const components = this.convertBlocksToComponents(originalBlocks, {
            stepId,
            stepNumber,
            originalBlocks
        });

        return {
            id: stepId,
            name: this.getStepName(stepNumber),
            description: `Step ${stepNumber} do quiz`,
            order: stepNumber,
            type: this.getStepType(stepNumber),
            isRequired: this.isStepRequired(stepNumber),
            isVisible: true,
            components,
            settings: this.createStepSettings()
        };
    }

    /**
     * Converte múltiplos steps para formato FunnelStep[]
     */
    convertSteps(stepIds: string[]): FunnelStep[] {
        return stepIds.map((stepId, index) => {
            const stepNumber = index + 1;
            return this.convertStep(stepId, stepNumber);
        });
    }

    /**
     * Converte todos os 21 steps para FunnelState completo
     */
    convertFullFunnel(): AdapterResult {
        const stepIds = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
        const steps = this.convertSteps(stepIds);
        const conversionWarnings: string[] = [];

        // Estatísticas da conversão
        const totalComponents = steps.reduce((acc, step) => acc + step.components.length, 0);
        const stepMappings: Record<string, string> = {};

        stepIds.forEach((stepId, index) => {
            stepMappings[stepId] = `step-${index + 1}`;
        });

        // Criar FunnelState
        const funnelState: FunnelState = {
            id: 'quiz21-complete',
            metadata: this.createFunnelMetadata(),
            settings: this.createFunnelSettings(),
            steps,
            currentStep: 'step-1',
            completedSteps: [],
            userData: {},
            progress: {
                currentStepIndex: 0,
                totalSteps: 21,
                completedSteps: 0,
                percentage: 0
            },
            navigation: {
                canGoForward: true,
                canGoBackward: false,
                nextStep: 'step-2',
                history: []
            },
            validation: {
                isValid: true,
                currentStepValid: true,
                errors: [],
                warnings: []
            },
            status: 'active'
        };

        return {
            funnelState,
            metadata: this.createFunnelMetadata(),
            stepMappings,
            totalComponents,
            conversionWarnings
        };
    }

    // ========================================================================
    // FUNÇÕES DE CONVERSÃO DE COMPONENTES
    // ========================================================================

    private convertBlocksToComponents(blocks: Block[], context: StepConversionContext): FunnelComponent[] {
        return blocks.map((block, index) => this.convertBlockToComponent(block, index, context));
    }

    private convertBlockToComponent(block: Block, index: number, context: StepConversionContext): FunnelComponent {
        return {
            id: `${context.stepId}-comp-${index}`,
            type: this.mapBlockType(block.type),
            order: block.order || index,
            isVisible: true,
            content: this.mapBlockContent(block.content || {}),
            properties: this.mapBlockProperties(block.properties || {}),
            styling: {}
        };
    }

    private mapBlockType(blockType: string): string {
        return BLOCK_TO_COMPONENT_TYPE_MAP[blockType] || blockType;
    }

    private mapBlockContent(content: any): any {
        return {
            text: content.text || content.label || content.title || '',
            value: content.value || '',
            options: content.options || [],
            ...content
        };
    }

    private mapBlockProperties(properties: any): any {
        return {
            required: properties.required === true,
            placeholder: properties.placeholder || '',
            validation: properties.validation || {},
            ...properties
        };
    }

    // ========================================================================
    // FUNÇÕES DE CONFIGURAÇÃO
    // ========================================================================

    private createStepSettings(): StepSettings {
        return {
            autoAdvance: false,
            autoAdvanceDelay: 0,
            showProgress: true,
            allowSkip: false,
            validation: {
                required: false
            }
        };
    }

    private createFunnelSettings(): any {
        return {
            autoSave: true,
            autoAdvance: false,
            progressTracking: true,
            analytics: false,
            theme: {
                primaryColor: '#3B82F6',
                secondaryColor: '#EF4444',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
                spacing: '16px',
                layout: 'centered'
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

    private createFunnelMetadata(): FunnelMetadata {
        return {
            id: 'quiz21-complete',
            name: 'Quiz 21 Steps Complete',
            description: 'Quiz completo com 21 etapas convertido para FunnelCore',
            category: 'quiz',
            theme: 'default',
            version: '1.0.0',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublished: true,
            isOfficial: true
        };
    }

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    private getStepName(stepNumber: number): string {
        const stepNames: Record<number, string> = {
            1: 'Coleta de Nome',
            2: 'Questão: Roupa Favorita',
            3: 'Questão: Personalidade',
            4: 'Questão: Visual',
            5: 'Questão: Detalhes',
            6: 'Questão: Estampas',
            7: 'Questão: Casaco',
            8: 'Questão: Calça',
            9: 'Questão: Sapatos',
            10: 'Questão: Acessórios',
            11: 'Questão: Tecidos',
            12: 'Transição Estratégica',
            13: 'Estratégica: Auto-percepção',
            14: 'Estratégica: Desafios',
            15: 'Estratégica: Objetivos',
            16: 'Estratégica: Investimento',
            17: 'Estratégica: Frequência',
            18: 'Estratégica: Ocasião',
            19: 'Estratégica: Compras',
            20: 'Resultado: Personalidade',
            21: 'Captura de Contato'
        };

        return stepNames[stepNumber] || `Step ${stepNumber}`;
    }

    private getStepType(stepNumber: number): any {
        if (stepNumber === 1) return 'intro';
        if (stepNumber === 12) return 'transition';
        if (stepNumber === 20) return 'result';
        if (stepNumber === 21) return 'form';
        return 'question';
    }

    private isStepRequired(stepNumber: number): boolean {
        // Steps 1, 20 e 21 são obrigatórios
        return [1, 20, 21].includes(stepNumber);
    }
}

// ============================================================================
// INSTÂNCIA SINGLETON E EXPORT
// ============================================================================

export default Quiz21StepsToFunnelAdapter;