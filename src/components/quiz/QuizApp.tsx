'use client';

import { useQuizState } from '../../hooks/useQuizState';

// 🎯 FASE 3: Sistema Unificado de Renderização
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/core/unified';
import SharedProgressHeader from '@/components/shared/SharedProgressHeader';
import React, { useEffect } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

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

    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const handler = (ev: MessageEvent) => {
            const data: any = ev.data;
            if (!data || typeof data !== 'object') return;
            try {
                switch (data.type) {
                    case 'selection': {
                        const bid = typeof data.blockId === 'string' ? data.blockId : null;
                        setSelectedBlockId(bid);
                        break;
                    }
                    case 'step-change': {
                        const sid = typeof data.stepId === 'string' ? data.stepId : undefined;
                        if (sid) nextStep(sid);
                        break;
                    }
                    case 'answers': {
                        const sid = String(data.stepId || '').trim();
                        const sels = Array.isArray(data.selections) ? data.selections.filter(Boolean) : [];
                        if (sid && sels.length) addAnswer(sid, sels);
                        break;
                    }
                    case 'strategic-answer': {
                        const q = String(data.question || '').trim();
                        const a = String(data.answer || '').trim();
                        if (q && a) addStrategicAnswer(q, a);
                        break;
                    }
                    case 'user-name': {
                        const name = String(data.userName || '').trim();
                        if (name) setUserName(name);
                        break;
                    }
                    case 'navigate': {
                        const dir = String(data.direction || '').toLowerCase();
                        if (dir === 'next') nextStep();
                        else if (dir === 'to' && typeof data.stepId === 'string') nextStep(data.stepId);
                        break;
                    }
                    case 'force-recalc': {
                        try { (window as any).dispatchEvent(new Event('quiz-force-recalc')); } catch { }
                        break;
                    }
                    default:
                        break;
                }
            } catch { /* noop */ }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [nextStep, addAnswer, addStrategicAnswer, setUserName]);

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

    // 🔍 DEBUG: Verificar stepId
    appLogger.info('🎯 [QuizApp] currentStepId:', { data: [currentStepId, '| state.currentStep:', state.currentStep] });

    // Preparar quiz state para UnifiedStepRenderer
    const unifiedQuizState = {
        currentStep: parseInt(state.currentStep.replace('step-', '')) || 1,
        userName: state.userProfile.userName,
        answers: state.answers,
        strategicAnswers: state.userProfile.strategicAnswers,
        resultStyle: state.userProfile.resultStyle,
        secondaryStyles: state.userProfile.secondaryStyles,
    };

    // 🎯 FASE 2: Loading State
    if (isLoadingTemplate) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center px-4">
                    {/* Heading presente durante o loading para estabilizar E2E que aguarda um <h1> */}
                    <h1 className="text-2xl font-semibold text-[#432818] mb-3">Carregando quiz…</h1>
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#deac6d] mb-4" aria-label="Carregando" />
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

    return (
        <div className="min-h-screen">
            <div className="quiz-container mx-auto">

                {/* Header Compartilhado (steps 2-19) */}
                {useSharedHeader && (
                    <SharedProgressHeader progress={progress} />
                )}

                {/* 🎯 FASE 3: Renderização Unificada */}
                <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                    <div className={`max-w-6xl mx-auto px-4 ${useSharedHeader ? 'pt-4 pb-8' : 'py-8'}`}>
                        <UnifiedStepRenderer
                            stepId={currentStepId}
                            mode="preview"
                            stepProps={{
                                blocks: (currentStepData as any).blocks || [],
                                ...currentStepData
                            }}
                            quizState={{
                                currentStep: unifiedQuizState.currentStep,
                                userName: unifiedQuizState.userName,
                                answers: unifiedQuizState.answers,
                                strategicAnswers: {},
                            }}
                            onStepUpdate={(stepId: string, updates: Record<string, any>) => {
                                if (updates.userName && typeof updates.userName === 'string') setUserName(updates.userName);
                                Object.entries(updates).forEach(([key, value]) => {
                                    if (key.startsWith('answer_') && Array.isArray(value)) {
                                        const sid = key.replace('answer_', '');
                                        addAnswer(sid, value);
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
