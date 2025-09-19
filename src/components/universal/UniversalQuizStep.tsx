/**
 * 🎯 COMPONENTE UNIVERSAL DE QUIZ
 * 
 * Funciona automaticamente com qualquer funil:
 * - quiz21StepsComplete
 * - lead-magnet-fashion
 * - personal-branding-quiz
 * - com-que-roupa-eu-vou
 */

import React from 'react';
import { useStepConfig } from '@/hooks/useStepConfig';

interface UniversalQuizStepProps {
    funnelId: string;
    stepNumber: number;
    onNext: () => void;
    onBack: () => void;
    data: any; // Dados específicos do step (questões, opções, etc.)
}

const UniversalQuizStep: React.FC<UniversalQuizStepProps> = ({
    funnelId,
    stepNumber,
    onNext,
    onBack,
    data
}) => {
    const {
        config,
        isLoading,
        isValid,
        selectedOptions,
        inputValue,
        updateInput,
        toggleOption,
        canGoBack,
        shouldShowProgress,
        validationMessage,
        theme
    } = useStepConfig({
        funnelId,
        stepNumber,
        onAutoAdvance: onNext // Auto-avanço automático!
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                <p className="ml-4">Carregando configuração...</p>
            </div>
        );
    }

    if (!config) {
        return <div>Erro ao carregar configuração do step</div>;
    }

    return (
        <div className={`min-h-screen flex flex-col theme-${theme}`}>
            {/* Progress Bar Condicional */}
            {shouldShowProgress && (
                <div className="w-full bg-gray-200 h-2">
                    <div
                        className="bg-blue-600 h-2 transition-all duration-300"
                        style={{
                            width: `${(stepNumber / (data.totalSteps || 21)) * 100}%`
                        }}
                    />
                </div>
            )}

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    {/* Título */}
                    <h1 className="text-3xl font-bold text-center mb-6">
                        {data.title || config.metadata.name}
                    </h1>

                    {/* Descrição */}
                    {data.description && (
                        <p className="text-lg text-gray-600 text-center mb-8">
                            {data.description}
                        </p>
                    )}

                    {/* Renderização Baseada no Tipo de Validação */}
                    {config.validation.type === 'input' && (
                        <div className="mb-6">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => updateInput(e.target.value)}
                                placeholder={data.placeholder || "Digite sua resposta..."}
                                className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
                                maxLength={config.validation.maxLength}
                                minLength={config.validation.minLength}
                            />

                            {/* Contador de caracteres */}
                            {config.validation.maxLength && (
                                <div className="text-sm text-gray-500 mt-2 text-right">
                                    {inputValue.length}/{config.validation.maxLength}
                                </div>
                            )}
                        </div>
                    )}

                    {config.validation.type === 'selection' && data.options && (
                        <div className="mb-6">
                            {/* Layout baseado na configuração */}
                            <div className={`
                                ${config.ui?.layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}
                            `}>
                                {data.options.map((option: any, index: number) => {
                                    const isSelected = selectedOptions.some(item => item.id === option.id);

                                    return (
                                        <button
                                            key={option.id || index}
                                            onClick={() => toggleOption(option)}
                                            disabled={
                                                !isSelected &&
                                                selectedOptions.length >= (config.validation.maxSelections || Infinity)
                                            }
                                            className={`
                                                p-4 border-2 rounded-lg text-left transition-all duration-200
                                                ${isSelected
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-blue-300'
                                                }
                                                ${selectedOptions.length >= (config.validation.maxSelections || Infinity) && !isSelected
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'cursor-pointer hover:shadow-md'
                                                }
                                            `}
                                        >
                                            {/* Checkbox/Radio visual */}
                                            <div className="flex items-start gap-3">
                                                <div className={`
                                                    w-5 h-5 border-2 rounded-full flex items-center justify-center
                                                    ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                                                `}>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="font-medium">{option.text}</div>
                                                    {option.description && (
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {option.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Informação sobre seleções */}
                            <div className="text-sm text-gray-600 mt-4 text-center">
                                {config.validation.requiredSelections && config.validation.maxSelections ? (
                                    `Selecione ${config.validation.requiredSelections} opção${config.validation.requiredSelections > 1 ? 'ões' : ''} (${selectedOptions.length}/${config.validation.maxSelections})`
                                ) : config.validation.requiredSelections ? (
                                    `Selecione pelo menos ${config.validation.requiredSelections} opção${config.validation.requiredSelections > 1 ? 'ões' : ''}`
                                ) : (
                                    `${selectedOptions.length} opção${selectedOptions.length !== 1 ? 'ões' : ''} selecionada${selectedOptions.length !== 1 ? 's' : ''}`
                                )}
                            </div>
                        </div>
                    )}

                    {/* Mensagem de Validação */}
                    {!isValid && config.validation.required && (
                        <div className="text-red-500 text-center mb-4">
                            {validationMessage}
                        </div>
                    )}

                    {/* Botões de Navegação */}
                    <div className="flex justify-between items-center">
                        {/* Botão Voltar */}
                        {canGoBack && stepNumber > 1 ? (
                            <button
                                onClick={onBack}
                                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                            >
                                ← Voltar
                            </button>
                        ) : (
                            <div /> // Spacer
                        )}

                        {/* Botão Próximo - Só aparece se não tem auto-avanço */}
                        {!config.behavior.autoAdvance && (
                            <button
                                onClick={onNext}
                                disabled={!isValid}
                                className={`
                                    px-8 py-3 rounded-lg font-medium transition-all duration-200
                                    ${isValid
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }
                                `}
                            >
                                {stepNumber >= (data.totalSteps || 21) ? 'Finalizar' : 'Continuar →'}
                            </button>
                        )}
                    </div>

                    {/* Indicador de Auto-Avanço */}
                    {config.behavior.autoAdvance && isValid && (
                        <div className="text-center mt-4 text-green-600">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                Avançando automaticamente em {config.behavior.autoAdvanceDelay / 1000}s...
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Debug Info (só em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black text-white text-xs p-3 rounded max-w-sm">
                    <div><strong>Funil:</strong> {funnelId}</div>
                    <div><strong>Step:</strong> {stepNumber}</div>
                    <div><strong>Tipo:</strong> {config.metadata.type}</div>
                    <div><strong>Auto-avanço:</strong> {config.behavior.autoAdvance ? 'Sim' : 'Não'}</div>
                    <div><strong>Válido:</strong> {isValid ? 'Sim' : 'Não'}</div>
                    <div><strong>Theme:</strong> {theme}</div>
                </div>
            )}
        </div>
    );
};

export default UniversalQuizStep;