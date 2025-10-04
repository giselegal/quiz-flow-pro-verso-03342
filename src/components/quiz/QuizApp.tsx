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
        // Mapear steps do quiz para IDs do registry
        const stepMapping: Record<string, string> = {
            'step-1': 'step-01',  // intro
            'step-2': 'step-02',  // question 1
            'step-3': 'step-03',  // question 2
            'step-4': 'step-04',  // question 3
            'step-5': 'step-05',  // question 4
            'step-6': 'step-06',  // question 5
            'step-7': 'step-07',  // question 6
            'step-8': 'step-08',  // question 7
            'step-9': 'step-09',  // question 8
            'step-10': 'step-10', // question 9
            'step-11': 'step-11', // question 10
            'step-12': 'step-12', // strategic question
            'step-13': 'step-13', // transition
            'step-14': 'step-14', // result
            'step-15': 'step-15', // offer
        };
        return stepMapping[currentStep] || 'step-01';
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