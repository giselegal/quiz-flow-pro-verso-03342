'use client';

import { useQuizState } from '@/hooks/useQuizState';
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Save, Settings } from 'lucide-react';

/**
 * 🎯 COMPONENTE PRINCIPAL DO QUIZ - GISELE GALVÃO
 * 
 * Este é o componente principal que gerencia todo o fluxo do quiz:
 * - Renderiza a etapa atual baseada no estado
 * - Coordena a navegação entre as 21 etapas
 * - Aplica o design e funcionalidades do HTML original
 * - Suporte a templates personalizados via funnelId
 * - 🆕 Modo de edição integrado
 * - 🆕 Preview em tempo real
 * - 🆕 Sistema de versionamento
 */

interface QuizAppProps {
    funnelId?: string;
    editMode?: boolean;
    onEditModeChange?: (editMode: boolean) => void;
    onSave?: (steps: any[]) => void;
    onLoad?: () => Promise<any[]>;
}

export default function QuizApp({
    funnelId,
    editMode = false,
    onEditModeChange,
    onSave,
    onLoad
}: QuizAppProps) {
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

    // Hooks de edição
    const [showEditControls, setShowEditControls] = useState(false);

    // Detectar modo de edição
    useEffect(() => {
        const isEditMode = window.location.pathname.includes('/editor/') || editMode;
        setShowEditControls(isEditMode);
        onEditModeChange?.(isEditMode);
    }, [editMode, onEditModeChange]);

    // Resultado já é calculado automaticamente durante as questões estratégicas
    // O cálculo ocorre em tempo real conforme o usuário responde

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
            {/* Controles de edição */}
            {showEditControls && (
                <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
                    {/* Placeholder para futura integração de edição persistente */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowEditControls(false)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Sair do Editor
                    </Button>
                </div>
            )}

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

                {/* Renderização da Etapa Atual */}
                {currentStepData.type === 'intro' && (
                    <IntroStep
                        data={currentStepData}
                        onNameSubmit={(name: string) => {
                            setUserName(name);
                            nextStep();
                        }}
                    />
                )}

                {currentStepData.type === 'question' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <QuestionStep
                                data={currentStepData}
                                currentAnswers={state.answers[state.currentStep] || []}
                                onAnswersChange={(answers: string[]) => {
                                    addAnswer(state.currentStep, answers);
                                    // Avanço automático após 1 segundo quando completo
                                    if (answers.length === currentStepData.requiredSelections) {
                                        setTimeout(() => nextStep(), 1000);
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {currentStepData.type === 'strategic-question' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <StrategicQuestionStep
                                data={currentStepData}
                                currentAnswer={state.answers[state.currentStep]?.[0] || ''}
                                onAnswerChange={(answer: string) => {
                                    addAnswer(state.currentStep, [answer]);
                                    addStrategicAnswer(currentStepData.questionText!, answer);
                                    // Removido auto-avanço - usuário deve clicar no botão manualmente
                                }}
                                onNext={() => nextStep()}
                            />
                        </div>
                    </div>
                )}

                {(currentStepData.type === 'transition' || currentStepData.type === 'transition-result') && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <TransitionStep
                                data={currentStepData}
                                onComplete={() => nextStep()}
                            />
                        </div>
                    </div>
                )}

                {currentStepData.type === 'result' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <ResultStep
                                data={currentStepData}
                                userProfile={state.userProfile}
                                scores={state.scores}
                            />
                        </div>
                    </div>
                )}

                {currentStepData.type === 'offer' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <OfferStep
                                data={currentStepData}
                                userProfile={state.userProfile}
                                offerKey={getOfferKey()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}