'use client';

import { useQuizState } from '../../hooks/useQuizState';

// 🎯 FASE 3: Sistema Unificado de Renderização
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';
import SharedProgressHeader from '@/components/shared/SharedProgressHeader';
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
    externalSteps?: Record<string, any>;
}

export default function QuizApp({ funnelId, externalSteps }: QuizAppProps) {
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
        isLoadingTemplate, // 🎯 FASE 2: Loading de templates JSON
        templateError, // 🎯 FASE 2: Erro ao carregar template
        useJsonTemplates, // 🎯 FASE 2: Flag indicando uso de JSON
    } = useQuizState(funnelId, externalSteps);

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

    // 🎯 FASE 2: Loading State
    if (isLoadingTemplate) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#deac6d] mb-4"></div>
                    <p className="text-[#5b4135] text-lg">Carregando template...</p>
                    {useJsonTemplates && (
                        <p className="text-[#5b4135]/60 text-sm mt-2">Usando Templates JSON</p>
                    )}
                </div>
            </div>
        );
    }

    // 🎯 FASE 2: Error State com Retry
    if (templateError) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-[#5b4135] mb-2">Erro ao Carregar Template</h2>
                    <p className="text-[#5b4135]/70 mb-4">
                        {templateError?.message || String(templateError)}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#deac6d] hover:bg-[#c99a5d] text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                        Tentar Novamente
                    </button>
                    <p className="text-[#5b4135]/50 text-xs mt-4">
                        Etapa: {state.currentStep}
                    </p>
                </div>
            </div>
        );
    }

    if (!currentStepData) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center text-red-500">
                    Etapa não encontrada: {state.currentStep}
                </div>
            </div>
        );
    }

    // Regras header compartilhado:
    // - Intro (step-01) mantém layout próprio
    // - Steps 02-19 usam novo SharedProgressHeader
    // - Steps 20-21 (resultado / oferta) não exibem header compartilhado nem barra antiga
    const numericCurrent = unifiedQuizState.currentStep; // 1..21
    const isIntro = numericCurrent === 1;
    const isResultOrOffer = numericCurrent >= 20; // 20,21
    const useSharedHeader = !isIntro && !isResultOrOffer; // 2..19

    // Barra de progresso antiga agora só aparece se NÃO usamos header compartilhado
    // (mantida apenas para compatibilidade futura se necessário)
    const showLegacyProgressBar = false; // desativada por padrão para evitar duplicação

    return (
        <div className="min-h-screen">
            <div className="quiz-container mx-auto">

                {/* Header Compartilhado (steps 2-19) */}
                {useSharedHeader && (
                    <SharedProgressHeader progress={progress} />
                )}

                {/* (Opcional) Barra de Progresso Legada - atualmente desativada */}
                {showLegacyProgressBar && !useSharedHeader && !isIntro && !isResultOrOffer && (
                    <div className="mb-6 max-w-6xl mx-auto px-4 py-8" data-testid="legacy-progress-bar">
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
                    <div className={`max-w-6xl mx-auto px-4 ${useSharedHeader ? 'pt-4 pb-8' : 'py-8'}`}>
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
                            onNameSubmit={(name: string) => {
                                setUserName(name);
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
