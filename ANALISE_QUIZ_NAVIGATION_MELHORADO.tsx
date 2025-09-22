// 🔧 VERSÃO MELHORADA DO QuizNavigation
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';

interface QuizNavigationProps {
    canProceed: boolean;
    onNext: () => void;
    onPrevious?: () => void;
    currentQuestionType: 'normal' | 'strategic';
    selectedOptionsCount: number;
    isLastQuestion?: boolean;
    // 🆕 Props para configuração
    autoAdvanceDelay?: number;
    showVisualFeedback?: boolean;
}

// 🎯 Configurações padrão baseadas no template
const NAVIGATION_CONFIG = {
    autoAdvance: {
        normal: 1500,      // Quiz: 1.5s (conforme template)
        strategic: 1200,   // Estratégicas: 1.2s (conforme template)
    },
    visualFeedback: {
        duration: 2000,    // Duração do efeito visual
        enabled: true,     // Habilitar feedback visual
    },
    colors: {
        // 🎨 Paleta dourada consistente
        primary: 'amber-500',
        primaryHover: 'amber-600',
        secondary: 'amber-600',
        disabled: 'gray-300',
        text: 'amber-800',
    }
};

const QuizNavigation: React.FC<QuizNavigationProps> = ({
    canProceed,
    onNext,
    onPrevious,
    currentQuestionType,
    selectedOptionsCount,
    isLastQuestion = false,
    autoAdvanceDelay,
    showVisualFeedback = true,
}) => {
    const [showActivationEffect, setShowActivationEffect] = useState(false);
    const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

    // 🎯 Determina delay baseado no tipo de questão
    const getAutoAdvanceDelay = useCallback((): number => {
        if (autoAdvanceDelay) return autoAdvanceDelay;

        return currentQuestionType === 'normal'
            ? NAVIGATION_CONFIG.autoAdvance.normal
            : NAVIGATION_CONFIG.autoAdvance.strategic;
    }, [currentQuestionType, autoAdvanceDelay]);

    // 🧠 Lógica de auto-avanço melhorada
    const shouldAutoAdvance = useCallback((): boolean => {
        if (!canProceed) return false;

        const requiredSelections = currentQuestionType === 'normal' ? 3 : 1;
        return selectedOptionsCount >= requiredSelections;
    }, [canProceed, currentQuestionType, selectedOptionsCount]);

    useEffect(() => {
        // 🧹 Limpa timer anterior
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
            setAutoAdvanceTimer(null);
        }

        if (canProceed) {
            // ✨ Efeito visual de ativação
            if (showVisualFeedback) {
                setShowActivationEffect(true);
                const visualTimer = setTimeout(() => {
                    setShowActivationEffect(false);
                }, NAVIGATION_CONFIG.visualFeedback.duration);

                // 🧹 Cleanup do timer visual
                setTimeout(() => clearTimeout(visualTimer), NAVIGATION_CONFIG.visualFeedback.duration + 100);
            }

            // 🚀 Auto-avanço com delay configurável
            if (shouldAutoAdvance()) {
                const delay = getAutoAdvanceDelay();
                console.log(`⏰ Configurando auto-avanço em ${delay}ms (${currentQuestionType})`);

                const newTimer = setTimeout(() => {
                    console.log(`🚀 Executando auto-avanço (${currentQuestionType})`);
                    onNext();
                }, delay);

                setAutoAdvanceTimer(newTimer);
            }
        } else {
            setShowActivationEffect(false);
        }

        // 🧹 Cleanup
        return () => {
            if (autoAdvanceTimer) {
                clearTimeout(autoAdvanceTimer);
            }
        };
    }, [canProceed, onNext, shouldAutoAdvance, currentQuestionType, getAutoAdvanceDelay, showVisualFeedback]);

    // 💬 Mensagens de ajuda baseadas no tipo
    const getHelperText = useCallback((): string => {
        if (!canProceed) {
            const required = currentQuestionType === 'strategic' ? 1 : 3;
            const current = selectedOptionsCount;
            return `Selecione ${required} opção${required > 1 ? 'ões' : ''} para continuar (${current}/${required})`;
        }
        return '';
    }, [canProceed, currentQuestionType, selectedOptionsCount]);

    const nextButtonText = isLastQuestion ? 'Ver Resultado' : 'Avançar';
    const { colors } = NAVIGATION_CONFIG;

    return (
        <div className="mt-6 w-full px-4 md:px-0">
            <div className="flex flex-col items-center w-full">
                {/* 💬 Helper Text Melhorado */}
                {!canProceed && (
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className={`h-4 w-4 text-${colors.secondary}`} />
                        <p className={`text-sm text-${colors.text}`}>{getHelperText()}</p>
                    </div>
                )}

                {/* ✅ Indicador de Progresso quando Completo */}
                {canProceed && showVisualFeedback && (
                    <div className="flex items-center gap-2 mb-3">
                        <Check className={`h-4 w-4 text-${colors.primary}`} />
                        <p className={`text-sm text-${colors.text} font-medium`}>
                            {currentQuestionType === 'strategic' ? 'Resposta registrada!' : 'Seleção completa!'}
                        </p>
                    </div>
                )}

                <div className="flex justify-center items-center w-full gap-3">
                    {/* 👈 Botão Voltar */}
                    {onPrevious && (
                        <Button
                            variant="outline"
                            onClick={onPrevious}
                            className={`text-${colors.secondary} border-${colors.secondary} hover:bg-${colors.primary}/10 hover:text-${colors.primaryHover} py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-${colors.primary} focus:ring-opacity-50`}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    )}

                    {/* 👉 Botão Avançar/Ver Resultado */}
                    <Button
                        onClick={onNext}
                        disabled={!canProceed}
                        variant={canProceed ? "default" : "outline"}
                        className={`text-lg px-6 py-3 flex items-center transition-all duration-300 ease-in-out rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors.primary}
              ${canProceed
                                ? `bg-${colors.primary} text-white hover:bg-${colors.primaryHover} border-${colors.primary} ${showActivationEffect ? 'scale-105 shadow-lg ring-2 ring-amber-300/50' : ''
                                }`
                                : `bg-${colors.disabled} text-gray-500 cursor-not-allowed border-${colors.disabled}`
                            }`}
                        aria-label={nextButtonText}
                        aria-disabled={!canProceed}
                    >
                        {nextButtonText}
                        {isLastQuestion ? <Check className="ml-2 h-5 w-5" /> : <ChevronRight className="ml-2 h-5 w-5" />}
                    </Button>
                </div>

                {/* 🔄 Indicador de Auto-avanço */}
                {canProceed && shouldAutoAdvance() && showVisualFeedback && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <div className={`w-2 h-2 bg-${colors.primary} rounded-full animate-pulse`}></div>
                        <span>Avançando automaticamente...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizNavigation;