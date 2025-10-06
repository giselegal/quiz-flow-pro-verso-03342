'use client';

import { useQuizState } from '../../hooks/useQuizState';

// 🎯 FASE 3: Sistema Unificado de Renderização
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';
import { useEffect } from 'react';

/**
 * 🎯 COMPONENTE PRINCIPAL DO QUIZ - GISELE GALVÃO
 * 
 * Este é o componente principal que gerencia todo o fluxo do quiz:
 * - Renderiza a etapa atual baseada no estado
 * - Coordena a navegação entre as 21 etapas
 * - Aplica o design e funcionalidades do HTML original
 * - Suporte a templates personalizados via funnelId
 */

interface QuizAppProps {
    funnelId?: string;
}

export default function QuizApp({ funnelId }: QuizAppProps) {
    // 🎯 FASE 3: Registrar steps de produção no stepRegistry (uma vez)
    useEffect(() => {
        registerProductionSteps();
    }, []);

    const {
        state,
        currentStepData,
        progress,
        nextStep,
        setUserName,
        addAnswer,
        addStrategicAnswer,
        getOfferKey,
    } = useQuizState(funnelId);

    // 🎯 FASE 3: Mapear step atual para stepId do registry
    const getStepIdFromCurrentStep = (currentStep: string): string => {
        // Novo: suportar ambos formatos. Normalizar para formato com zero padding apenas se existir no registry
        // Mantém compatibilidade se registry foi registrado com step-01...
        const numeric = currentStep.replace('step-', '');
        const padded = `step-${numeric.padStart(2, '0')}`; // step-01
        const plain = `step-${numeric}`; // step-1
        // Preferir padded porque registry usa step-01, step-02, etc.
        return padded;
    };

    const currentStepId = getStepIdFromCurrentStep(state.currentStep);

    // Preparar quiz state para UnifiedStepRenderer
    const unifiedQuizState = {
        currentStep: parseInt(state.currentStep.replace('step-', '')) || 1,
        userName: state.userProfile.userName,
        answers: state.answers,
        strategicAnswers: state.userProfile.strategicAnswers,
        resultStyle: state.userProfile.resultStyle,
        secondaryStyles: state.userProfile.secondaryStyles
    };

    if (!currentStepData) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center text-red-500">
                    Etapa não encontrada: {state.currentStep}
                </div>
            </div>
        );
    }

    // Renderizar barra de progresso (exceto para intro e transições)
    const showProgress = !['intro', 'transition', 'transition-result'].includes(currentStepData.type);

    return (
        <div className="min-h-screen">
            <div className="quiz-container mx-auto">

                {/* Barra de Progresso */}
                {showProgress && (
                    <div className="mb-6 max-w-6xl mx-auto px-4 py-8">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div
                                className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-center mb-4">Progresso: {progress}%</p>
                    </div>
                )}

                {/* 🎯 FASE 3: Renderização Unificada */}
                <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        <UnifiedStepRenderer
                            stepId={currentStepId}
                            mode="production"
                            stepProps={currentStepData}
                            quizState={unifiedQuizState}
                            onStepUpdate={(stepId, updates) => {
                                // Processar atualizações específicas por tipo
                                if (updates.userName) {
                                    setUserName(updates.userName);
                                }
                                if (updates[state.currentStep]) {
                                    // Atualizar respostas
                                    const answers = updates[state.currentStep];
                                    if (Array.isArray(answers)) {
                                        addAnswer(state.currentStep, answers);
                                    }
                                }
                                if (currentStepData.questionText && updates[state.currentStep]) {
                                    // Strategic question
                                    addStrategicAnswer(currentStepData.questionText, updates[state.currentStep]);
                                }
                            }}
                            onNext={() => {
                                // Auto-advance lógica já implementada nos adapters
                                nextStep();
                            }}
                            onPrevious={() => {
                                // Implementar navegação para trás se necessário
                                console.log('Navegar para step anterior');
                            }}
                            className="unified-production-step"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}