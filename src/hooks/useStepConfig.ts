/**
 * 🎯 HOOK UNIVERSAL PARA CONFIGURAÇÃO DE STEPS
 * 
 * Funciona com qualquer funil automaticamente!
 */

import { useState, useEffect } from 'react';
import { masterTemplateService } from '@/services/templates/MasterTemplateService';

// TODO: Migrar para MasterTemplateService quando interface estiver pronta
type ScalableStepConfig = any;

export interface UseStepConfigOptions {
    funnelId: string;
    stepNumber: number;
    enableAutoAdvance?: boolean;
    onStepValid?: () => void;
    onAutoAdvance?: () => void;
}

export const useStepConfig = ({
    funnelId,
    stepNumber,
    enableAutoAdvance = true,
    onStepValid,
    onAutoAdvance
}: UseStepConfigOptions) => {
    const [config, setConfig] = useState<ScalableStepConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');

    // Carregar configuração do step
    useEffect(() => {
        let mounted = true;

        const loadConfig = async () => {
            try {
                setIsLoading(true);
                // TODO: Implementar getStepConfig no masterTemplateService
                const stepConfig = null; // await masterTemplateService.getStepConfig(funnelId, stepNumber);

                if (mounted) {
                    setConfig(stepConfig);
                    console.log(`✅ useStepConfig: ${funnelId} step ${stepNumber} carregado`, stepConfig);
                }
            } catch (error) {
                console.error(`❌ useStepConfig: Erro ao carregar ${funnelId} step ${stepNumber}:`, error);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadConfig();

        return () => {
            mounted = false;
        };
    }, [funnelId, stepNumber]);

    // Validação dinâmica baseada na configuração
    useEffect(() => {
        if (!config?.validation) return;

        const { validation } = config;
        let valid = false;

        switch (validation.type) {
            case 'input':
                valid = inputValue.length >= (validation.minLength || 1);
                if (validation.maxLength) {
                    valid = valid && inputValue.length <= validation.maxLength;
                }
                if (validation.pattern) {
                    valid = valid && new RegExp(validation.pattern).test(inputValue);
                }
                break;

            case 'selection':
                const selectedCount = selectedOptions.length;
                if (validation.required) {
                    valid = selectedCount >= (validation.requiredSelections || 1);
                }
                if (validation.maxSelections) {
                    valid = valid && selectedCount <= validation.maxSelections;
                }
                break;

            case 'none':
            default:
                valid = true;
                break;
        }

        setIsValid(valid);

        // Callback quando step fica válido
        if (valid && onStepValid) {
            onStepValid();
        }
    }, [config, inputValue, selectedOptions, onStepValid]);

    // Auto-avanço automático
    useEffect(() => {
        if (!enableAutoAdvance || !config?.behavior.autoAdvance || !isValid) {
            return;
        }

        const timer = setTimeout(() => {
            console.log(`⚡ Auto-avanço: ${funnelId} step ${stepNumber}`);
            if (onAutoAdvance) {
                onAutoAdvance();
            }
        }, config.behavior.autoAdvanceDelay);

        return () => clearTimeout(timer);
    }, [config, isValid, enableAutoAdvance, onAutoAdvance, funnelId, stepNumber]);

    // Analytics automático
    useEffect(() => {
        if (!config?.analytics.trackEvents) return;

        // Track page view
        if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as any).gtag('event', config.analytics.eventName || 'step_viewed', {
                funnel_id: funnelId,
                step_number: stepNumber,
                step_type: config.metadata.type,
                ...config.analytics.customProperties
            });
        }

        console.log(`📊 Analytics: ${config.analytics.eventName}`, {
            funnelId,
            stepNumber,
            type: config.metadata.type
        });
    }, [config, funnelId, stepNumber]);

    // Funções helper
    const updateInput = (value: string) => {
        setInputValue(value);
    };

    const toggleOption = (option: any) => {
        setSelectedOptions(prev => {
            const exists = prev.find(item => item.id === option.id);

            if (exists) {
                // Remover opção
                return prev.filter(item => item.id !== option.id);
            } else {
                // Adicionar opção
                const newOptions = [...prev, option];

                // Respeitar limite máximo
                if (config?.validation.maxSelections) {
                    return newOptions.slice(-config.validation.maxSelections);
                }

                return newOptions;
            }
        });
    };

    const resetStep = () => {
        setInputValue('');
        setSelectedOptions([]);
        setIsValid(false);
    };

    const saveOverride = async (changes: Partial<ScalableStepConfig>) => {
        // TODO: Implementar saveStepOverride no masterTemplateService
        console.warn('saveOverride: Funcionalidade temporariamente desabilitada');
        // await masterTemplateService.saveStepOverride(funnelId, stepNumber, changes);
        // const newConfig = await masterTemplateService.getStepConfig(funnelId, stepNumber);
        // setConfig(newConfig);
    };

    return {
        // Estado
        config,
        isLoading,
        isValid,
        selectedOptions,
        inputValue,

        // Actions
        updateInput,
        toggleOption,
        resetStep,
        saveOverride,

        // Helpers
        canGoBack: config?.behavior.allowBack ?? true,
        shouldShowProgress: config?.behavior.showProgress ?? true,
        validationMessage: config?.validation.message || '',
        theme: config?.ui.theme || 'default',
    };
};