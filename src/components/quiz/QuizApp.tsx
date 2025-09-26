'use client';

import { useQuizState } from '../../hooks/useQuizState';
import IntroStep from './IntroStep';
import QuestionStep from './QuestionStep';
import StrategicQuestionStep from './StrategicQuestionStep';
import TransitionStep from './TransitionStep';
import ResultStep from './ResultStep';
import OfferStep from './OfferStep';

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
        <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
            <div className="quiz-container max-w-6xl mx-auto px-4 py-8">

                {/* Barra de Progresso */}
                {showProgress && (
                    <div className="mb-6">
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
                )}

                {currentStepData.type === 'strategic-question' && (
                    <StrategicQuestionStep
                        data={currentStepData}
                        currentAnswer={state.answers[state.currentStep]?.[0] || ''}
                        onAnswerChange={(answer: string) => {
                            addAnswer(state.currentStep, [answer]);
                            addStrategicAnswer(currentStepData.questionText!, answer);
                            setTimeout(() => nextStep(), 500);
                        }}
                    />
                )}

                {(currentStepData.type === 'transition' || currentStepData.type === 'transition-result') && (
                    <TransitionStep
                        data={currentStepData}
                        onComplete={() => nextStep()}
                    />
                )}

                {currentStepData.type === 'result' && (
                    <ResultStep
                        data={currentStepData}
                        userProfile={state.userProfile}
                        scores={state.scores}
                        onContinue={() => nextStep()}
                    />
                )}

                {currentStepData.type === 'offer' && (
                    <OfferStep
                        data={currentStepData}
                        userProfile={state.userProfile}
                        offerKey={getOfferKey()}
                    />
                )}
            </div>
        </div>
    );
}