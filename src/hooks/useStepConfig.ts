/**
 * 🎯 HOOK UNIVERSAL PARA CONFIGURAÇÃO DE STEPS
 * 
 * Funciona com qualquer funil automaticamente!
 */

import { useState, useEffect } from 'react';
import { masterTemplateService } from '@/services/templates/MasterTemplateService';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

// Interface para configuração de step (adaptada do HybridTemplateService)
interface StepConfig {
    metadata: {
        type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
        stepNumber: number;
    };
    behavior: {
        autoAdvance: boolean;
        autoAdvanceDelay: number;
        showProgress: boolean;
        allowBack: boolean;
    };
    validation: {
        type: 'input' | 'selection' | 'none';
        required: boolean;
        requiredSelections?: number;
        minSelections?: number;
        maxSelections?: number;
        message: string;
        // Propriedades adicionais para validação de input
        minLength?: number;
        maxLength?: number;
        pattern?: string;
    };
    ui: {
        theme: string;
    };
    analytics: {
        trackEvents: boolean;
        eventName?: string;
        customProperties?: Record<string, any>;
    };
}

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
    onAutoAdvance,
}: UseStepConfigOptions) => {
    const [config, setConfig] = useState<StepConfig | null>(null);
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
                
                // Derivar comportamento por tipo de etapa (evita importar bundle canônico)
                const stepId = `step-${String(stepNumber).padStart(2, '0')}`;
                // Tentar obter blocks canônicos via TemplateService (não obrigatório)
                let components: any[] = [];
                try {
                    const stepData = await templateService.lazyLoadStep(stepId, false);
                    components = Array.isArray(stepData?.blocks) ? stepData.blocks : [];
                } catch { /* noop */ }

                // Determinar o tipo de step baseado no índice
                const getStepType = (index: number) => {
                    if (index === 1) return 'intro';
                    if (index >= 2 && index <= 11) return 'question';
                    if (index === 12) return 'transition';
                    if (index >= 13 && index <= 18) return 'strategic-question';
                    if (index === 19) return 'transition-result';
                    if (index === 20) return 'result';
                    return 'offer'; // index === 21
                };
                
                // Encontrar grids de opções para determinar validação
                const optionsGrid = (Array.isArray(components) ? components : []).find((block: any) => {
                    const t = String(block?.type || '').toLowerCase();
                    return t === 'options-grid' || t === 'options grid' || t.includes('options');
                });

                // Extrair propriedades de validação a partir do grid
                const requiredSelections =
                    optionsGrid?.properties?.requiredSelections ??
                    optionsGrid?.minSelections ??
                    optionsGrid?.properties?.minSelections ??
                    1;

                const minSelections =
                    optionsGrid?.properties?.minSelections ??
                    optionsGrid?.minSelections ??
                    1;

                const maxSelections =
                    optionsGrid?.properties?.maxSelections ??
                    optionsGrid?.maxSelections ??
                    1;
                
                // Construir configuração do step
                const stepConfig: StepConfig = {
                    metadata: {
                        type: getStepType(stepNumber) as any,
                        stepNumber,
                    },
                    behavior: {
                        autoAdvance: stepNumber >= 2 && stepNumber <= 11, // Etapas 2-11 têm auto-avanço
                        autoAdvanceDelay: 1500,
                        showProgress: true,
                        allowBack: stepNumber > 1, // Não permitir voltar na primeira etapa
                    },
                    validation: (() => {
                        // Regras por tipo quando não conseguir extrair grid
                        const type = getStepType(stepNumber);
                        const byType = {
                            'intro': { type: 'input', required: true, requiredSelections: 0, minSelections: 0, maxSelections: 0 },
                            'question': { type: 'selection', required: true, requiredSelections: 1, minSelections: 1, maxSelections: 3 },
                            'strategic-question': { type: 'selection', required: true, requiredSelections: 1, minSelections: 1, maxSelections: 1 },
                            'transition': { type: 'none', required: false, requiredSelections: 0, minSelections: 0, maxSelections: 0 },
                            'transition-result': { type: 'none', required: false, requiredSelections: 0, minSelections: 0, maxSelections: 0 },
                            'result': { type: 'none', required: false, requiredSelections: 0, minSelections: 0, maxSelections: 0 },
                            'offer': { type: 'none', required: false, requiredSelections: 0, minSelections: 0, maxSelections: 0 },
                        } as any;
                        const fallback = byType[type] || byType['offer'];
                        return {
                            type: optionsGrid ? 'selection' : fallback.type,
                            required: optionsGrid ? true : fallback.required,
                            requiredSelections: optionsGrid ? requiredSelections : fallback.requiredSelections,
                            minSelections: optionsGrid ? minSelections : fallback.minSelections,
                            maxSelections: optionsGrid ? maxSelections : fallback.maxSelections,
                            message: 'Por favor, complete esta etapa para continuar',
                        };
                    })(),
                    ui: {
                        theme: 'default',
                    },
                    analytics: {
                        trackEvents: true,
                        eventName: `step_${stepNumber}_view`,
                    },
                };

                if (mounted) {
                    setConfig(stepConfig);
                    appLogger.info(`✅ useStepConfig: ${funnelId} step ${stepNumber} carregado`, { data: [stepConfig] });
                }
            } catch (error) {
                appLogger.error(`❌ useStepConfig: Erro ao carregar ${funnelId} step ${stepNumber}:`, { data: [error] });
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
            appLogger.info(`⚡ Auto-avanço: ${funnelId} step ${stepNumber}`);
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
                ...config.analytics.customProperties,
            });
        }

        appLogger.info(`📊 Analytics: ${config.analytics.eventName}`, { data: [{
                    funnelId,
                    stepNumber,
                    type: config.metadata.type,
                }] });
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

    const saveOverride = async (changes: Partial<StepConfig>) => {
        // TODO: Implementar saveStepOverride no masterTemplateService
        appLogger.warn('saveOverride: Funcionalidade temporariamente desabilitada');
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