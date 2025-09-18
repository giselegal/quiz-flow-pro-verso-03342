// src/hooks/useQuizRulesConfig.ts
// 🎯 SOLUÇÃO: Hook inteligente que lê configuração JSON centralizada

import { useMemo } from 'react';

// ============================================================================
// INTERFACES PARA TIPAGEM FORTE
// ============================================================================

export interface StepValidation {
    type: 'input' | 'selection' | 'none';
    required: boolean | string[];
    minSelections?: number;
    maxSelections?: number;
    minLength?: number;
    maxLength?: number;
    message: string;
}

export interface StepBehavior {
    autoAdvance: boolean;
    autoAdvanceDelay?: number;
    showProgress: boolean;
    allowBack: boolean;
}

export interface StepScoring {
    enabled: boolean;
    pointsPerOption: number;
    categories: string[];
    weight: number;
}

export interface StepButton {
    text: string;
    activationRule: 'always' | 'requiresValidInput' | 'requiresValidSelection';
    style: 'primary' | 'secondary' | 'cta';
}

export interface StepRule {
    type: 'form' | 'quiz-question' | 'strategic-question' | 'transition' | 'result' | 'offer';
    category: 'intro' | 'normal' | 'strategic' | 'intermediate' | 'final' | 'result' | 'offer';
    validation: StepValidation;
    behavior: StepBehavior;
    scoring?: StepScoring;
    button: StepButton;
}

export interface QuizRulesConfig {
    meta: {
        name: string;
        version: string;
        description: string;
        lastUpdated: string;
    };
    stepRules: Record<string, StepRule>;
    globalScoringConfig: {
        categories: Array<{
            id: string;
            name: string;
            description: string;
            color: string;
            weight: number;
        }>;
        algorithm: {
            type: string;
            normalQuestionWeight: number;
            strategicQuestionWeight: number;
            minimumScoreDifference: number;
            tieBreaker: string;
        };
        resultCalculation: {
            primaryStyle: string;
            secondaryStyles: string;
            showPercentages: boolean;
            roundTo: number;
        };
    };
    validationMessages: {
        pt: {
            step1: Record<string, string>;
            quizQuestions: Record<string, string>;
            strategicQuestions: Record<string, string>;
            general: Record<string, string>;
        };
    };
    behaviorPresets: {
        autoAdvanceSteps: number[];
        manualAdvanceSteps: number[];
        scoringSteps: number[];
        validationRequiredSteps: number[];
    };
    uiConfig: {
        buttons: Record<string, Record<string, any>>;
        animations: Record<string, any>;
    };
}

// ============================================================================
// CONFIGURAÇÃO JSON IMPORTADA
// ============================================================================

// Importar o JSON diretamente (Vite suporta import de JSON)
import quizRulesConfigData from '@/config/quizRulesConfig';

// ============================================================================
// HOOK PRINCIPAL
// ============================================================================

export function useQuizRulesConfig() {
    const config = useMemo(() => {
        return quizRulesConfigData as QuizRulesConfig;
    }, []);

    // ============================================================================
    // FUNÇÃO: Obter regras de uma etapa específica
    // ============================================================================
    const getStepRules = useMemo(() => {
        return (stepNumber: number): StepRule | null => {
            const stepKey = stepNumber.toString();
            const stepRule = config.stepRules[stepKey];

            if (!stepRule) {
                console.warn(`⚠️ useQuizRulesConfig: Regras não encontradas para step ${stepNumber}`);
                return null;
            }

            console.log(`✅ useQuizRulesConfig: Regras carregadas para step ${stepNumber}:`, {
                type: stepRule.type,
                validation: stepRule.validation,
                behavior: stepRule.behavior,
                hasScoring: !!stepRule.scoring
            });

            return stepRule;
        };
    }, [config]);

    // ============================================================================
    // FUNÇÃO: Verificar se step requer auto-advance
    // ============================================================================
    const shouldAutoAdvance = useMemo(() => {
        return (stepNumber: number): boolean => {
            return config.behaviorPresets.autoAdvanceSteps.includes(stepNumber);
        };
    }, [config]);

    // ============================================================================
    // FUNÇÃO: Obter delay do auto-advance
    // ============================================================================
    const getAutoAdvanceDelay = useMemo(() => {
        return (stepNumber: number): number => {
            const stepRule = getStepRules(stepNumber);
            return stepRule?.behavior.autoAdvanceDelay || config.uiConfig.animations.autoAdvanceDelay || 1000;
        };
    }, [config, getStepRules]);

    // ============================================================================
    // FUNÇÃO: Verificar se step tem pontuação
    // ============================================================================
    const hasScoring = useMemo(() => {
        return (stepNumber: number): boolean => {
            return config.behaviorPresets.scoringSteps.includes(stepNumber);
        };
    }, [config]);

    // ============================================================================
    // FUNÇÃO: Obter configuração de validação
    // ============================================================================
    const getValidationConfig = useMemo(() => {
        return (stepNumber: number): StepValidation | null => {
            const stepRule = getStepRules(stepNumber);
            return stepRule?.validation || null;
        };
    }, [getStepRules]);

    // ============================================================================
    // FUNÇÃO: Obter mensagem de validação
    // ============================================================================
    const getValidationMessage = useMemo(() => {
        return (stepNumber: number, messageType?: string): string => {
            const stepRule = getStepRules(stepNumber);

            if (stepRule?.validation.message) {
                return stepRule.validation.message;
            }

            // Fallback para mensagens por categoria
            const messages = config.validationMessages.pt;

            if (stepNumber === 1) {
                return messages.step1[messageType || 'emptyName'] || 'Digite seu nome para continuar';
            } else if (stepNumber >= 2 && stepNumber <= 11) {
                return messages.quizQuestions[messageType || 'noSelection'] || 'Selecione 3 opções para avançar';
            } else if (stepNumber >= 13 && stepNumber <= 18) {
                return messages.strategicQuestions[messageType || 'noSelection'] || 'Selecione uma opção para continuar';
            }

            return messages.general.error || 'Erro de validação';
        };
    }, [config, getStepRules]);

    // ============================================================================
    // FUNÇÃO: Obter configuração de botão
    // ============================================================================
    const getButtonConfig = useMemo(() => {
        return (stepNumber: number): StepButton | null => {
            const stepRule = getStepRules(stepNumber);
            return stepRule?.button || null;
        };
    }, [getStepRules]);

    // ============================================================================
    // FUNÇÃO: Obter configuração de pontuação
    // ============================================================================
    const getScoringConfig = useMemo(() => {
        return (stepNumber: number): StepScoring | null => {
            const stepRule = getStepRules(stepNumber);
            return stepRule?.scoring || null;
        };
    }, [getStepRules]);

    // ============================================================================
    // FUNÇÃO: Obter todas as categorias de estilo
    // ============================================================================
    const getStyleCategories = useMemo(() => {
        return () => {
            return config.globalScoringConfig.categories;
        };
    }, [config]);

    // ============================================================================
    // FUNÇÃO: Obter configuração global de algoritmo
    // ============================================================================
    const getAlgorithmConfig = useMemo(() => {
        return () => {
            return config.globalScoringConfig.algorithm;
        };
    }, [config]);

    // ============================================================================
    // FUNÇÃO: Debug - Log completo da configuração
    // ============================================================================
    const logConfiguration = useMemo(() => {
        return (stepNumber?: number) => {
            if (stepNumber) {
                const stepRule = getStepRules(stepNumber);
                console.group(`🔍 Quiz Rules Config - Step ${stepNumber}`);
                console.log('Step Rule:', stepRule);
                console.log('Should Auto Advance:', shouldAutoAdvance(stepNumber));
                console.log('Auto Advance Delay:', getAutoAdvanceDelay(stepNumber));
                console.log('Has Scoring:', hasScoring(stepNumber));
                console.log('Validation Config:', getValidationConfig(stepNumber));
                console.log('Button Config:', getButtonConfig(stepNumber));
                console.groupEnd();
            } else {
                console.group('🔍 Quiz Rules Config - Global');
                console.log('Full Config:', config);
                console.log('Auto Advance Steps:', config.behaviorPresets.autoAdvanceSteps);
                console.log('Scoring Steps:', config.behaviorPresets.scoringSteps);
                console.log('Style Categories:', config.globalScoringConfig.categories);
                console.groupEnd();
            }
        };
    }, [config, getStepRules, shouldAutoAdvance, getAutoAdvanceDelay, hasScoring, getValidationConfig, getButtonConfig]);

    // ============================================================================
    // RETORNO DO HOOK
    // ============================================================================
    return {
        // Configuração completa
        config,

        // Funções principais
        getStepRules,
        shouldAutoAdvance,
        getAutoAdvanceDelay,
        hasScoring,
        getValidationConfig,
        getValidationMessage,
        getButtonConfig,
        getScoringConfig,
        getStyleCategories,
        getAlgorithmConfig,

        // Debug
        logConfiguration,

        // Atalhos úteis
        autoAdvanceSteps: config.behaviorPresets.autoAdvanceSteps,
        scoringSteps: config.behaviorPresets.scoringSteps,
        validationRequiredSteps: config.behaviorPresets.validationRequiredSteps,
        styleCategories: config.globalScoringConfig.categories,

        // Metadados
        version: config.meta.version,
        lastUpdated: config.meta.lastUpdated
    };
}

// ============================================================================
// HOOK SIMPLIFICADO COMPATÍVEL COM O ANTERIOR
// ============================================================================

export function useStepValidation() {
    const { getStepRules } = useQuizRulesConfig();

    const getStepBehavior = useMemo(() => {
        return (currentStep: number) => {
            const stepRule = getStepRules(currentStep);

            if (!stepRule) {
                return {
                    requiresValidInput: false,
                    requiresValidSelection: false,
                    validationMessage: 'Erro: configuração não encontrada',
                    shouldAutoAdvance: false,
                    autoAdvanceDelay: 1000
                };
            }

            const requiresValidInput = stepRule.validation.type === 'input' && stepRule.validation.required;
            const requiresValidSelection = stepRule.validation.type === 'selection' && stepRule.validation.required;

            return {
                requiresValidInput,
                requiresValidSelection,
                validationMessage: stepRule.validation.message,
                shouldAutoAdvance: stepRule.behavior.autoAdvance,
                autoAdvanceDelay: stepRule.behavior.autoAdvanceDelay || 1000
            };
        };
    }, [getStepRules]);

    return {
        getStepBehavior
    };
}