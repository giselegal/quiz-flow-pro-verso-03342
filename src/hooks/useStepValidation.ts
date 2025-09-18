import { useEffect, useState } from 'react';

export interface StepValidationConfig {
    requiresValidInput: boolean;
    requiresValidSelection: boolean;
    autoAdvance: boolean;
    autoAdvanceDelay?: number;
    validationMessage: string;
}

/**
 * Hook para gerenciar configurações de validação por etapa do quiz
 */
export const useStepValidation = (currentStep?: number): StepValidationConfig => {
    const [stepConfig, setStepConfig] = useState<StepValidationConfig>({
        requiresValidInput: false,
        requiresValidSelection: false,
        autoAdvance: false,
        validationMessage: ''
    });

    const getStepBehavior = (stepNumber: number): StepValidationConfig => {
        if (stepNumber === 1) {
            return {
                requiresValidInput: true, // Nome obrigatório
                requiresValidSelection: false,
                autoAdvance: false,
                validationMessage: 'Digite seu nome para continuar'
            };
        } else if (stepNumber >= 2 && stepNumber <= 11) {
            return {
                requiresValidInput: false,
                requiresValidSelection: true, // Seleções obrigatórias
                autoAdvance: true, // Auto-avanço ativado
                autoAdvanceDelay: 1000,
                validationMessage: 'Selecione pelo menos uma opção'
            };
        } else if (stepNumber >= 13 && stepNumber <= 18) {
            return {
                requiresValidInput: false,
                requiresValidSelection: true, // Seleções obrigatórias
                autoAdvance: false, // Sem auto-avanço
                validationMessage: 'Selecione pelo menos uma opção'
            };
        } else {
            return {
                requiresValidInput: false,
                requiresValidSelection: false,
                autoAdvance: false,
                validationMessage: ''
            };
        }
    };

    useEffect(() => {
        // Tentar obter o step atual de várias fontes
        const step = currentStep ??
            (window as any)?.__quizCurrentStep ??
            (parseInt(window.location.pathname.split('/').pop() || '1') || 1);

        const config = getStepBehavior(step);
        setStepConfig(config);

        // Escutar mudanças de etapa
        const handleStepChange = (event: CustomEvent) => {
            const newStep = event.detail?.stepId ?? event.detail?.step ?? step;
            const newConfig = getStepBehavior(newStep);
            setStepConfig(newConfig);
        };

        window.addEventListener('quiz-step-change', handleStepChange as EventListener);
        window.addEventListener('navigate-to-step', handleStepChange as EventListener);

        return () => {
            window.removeEventListener('quiz-step-change', handleStepChange as EventListener);
            window.removeEventListener('navigate-to-step', handleStepChange as EventListener);
        };
    }, [currentStep]);

    return stepConfig;
};

/**
 * Função auxiliar para aplicar configurações de validação a um bloco
 */
export const applyStepValidationToBlock = (
    blockType: string,
    currentStep?: number
): Partial<any> => {
    const config = useStepValidation(currentStep);

    if (blockType === 'button-inline') {
        return {
            requiresValidInput: config.requiresValidInput,
            requiresValidSelection: config.requiresValidSelection,
            autoAdvanceOnComplete: config.autoAdvance,
            autoAdvanceDelay: config.autoAdvanceDelay
        };
    }

    if (blockType === 'options-grid') {
        return {
            autoAdvance: config.autoAdvance,
            autoAdvanceDelay: config.autoAdvanceDelay,
            validationMessage: config.validationMessage
        };
    }

    return {};
};