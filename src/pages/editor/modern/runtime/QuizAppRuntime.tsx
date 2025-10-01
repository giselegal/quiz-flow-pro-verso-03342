import React, { forwardRef, useImperativeHandle } from 'react';
import type { QuizStep } from '@/data/quizSteps';
import { useInjectedQuizRuntime } from './useInjectedQuizRuntime';
import IntroStep from '@/components/quiz/IntroStep';
import QuestionStep from '@/components/quiz/QuestionStep';
import StrategicQuestionStep from '@/components/quiz/StrategicQuestionStep';
import TransitionStep from '@/components/quiz/TransitionStep';
import ResultStep from '@/components/quiz/ResultStep';
import OfferStep from '@/components/quiz/OfferStep';

export interface QuizAppRuntimeHandle {
    reset(): void;
}

interface QuizAppRuntimeProps {
    steps: QuizStep[];
    autoAdvance?: boolean;
    questionDelay?: number;
    strategicDelay?: number;
    hideDebug?: boolean;
}

/**
 * Versão runtime injetável do QuizApp consumindo steps passadas via prop.
 * Limitações: não calcula scores/offer complexos (TODO Fase futura).
 */
const QuizAppRuntime = forwardRef<QuizAppRuntimeHandle, QuizAppRuntimeProps>(({ steps, autoAdvance = true, questionDelay, strategicDelay, hideDebug }, ref) => {
    const runtime = useInjectedQuizRuntime(steps, {
        autoAdvance,
        questionDelay: questionDelay ?? 1000,
        strategicDelay: strategicDelay ?? 500
    });

    const { currentStep, progress, answerQuestion, answerStrategic, next, setUserName, reset } = runtime;

    useImperativeHandle(ref, () => ({
        reset
    }), [reset]);

    if (!currentStep) {
        return <div className="p-6 text-sm text-red-500">Nenhuma etapa disponível (preview). Adicione steps para visualizar.</div>;
    }

    const showProgress = !['intro', 'transition', 'transition-result'].includes(currentStep.type);

    return (
        <div className="min-h-screen">
            <div className="quiz-container mx-auto">
                {showProgress && (
                    <div className="mb-6 max-w-6xl mx-auto px-4 py-8">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                            <div className="bg-[#deac6d] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-sm text-center mb-4">Progresso: {progress}%</p>
                    </div>
                )}

                {currentStep.type === 'intro' && (
                    <IntroStep
                        data={currentStep}
                        hideDebug={hideDebug}
                        onNameSubmit={(n: string) => { setUserName(n); next(); }}
                    />
                )}

                {currentStep.type === 'question' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <QuestionStep
                                data={currentStep as any}
                                currentAnswers={[]}
                                onAnswersChange={(answers: string[]) => {
                                    answerQuestion(answers);
                                }}
                            />
                        </div>
                    </div>
                )}

                {currentStep.type === 'strategic-question' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <StrategicQuestionStep
                                data={currentStep as any}
                                currentAnswer={''}
                                onAnswerChange={(ans: string) => {
                                    answerStrategic(ans);
                                }}
                            />
                        </div>
                    </div>
                )}

                {(currentStep.type === 'transition' || currentStep.type === 'transition-result') && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <TransitionStep data={currentStep as any} onComplete={() => next()} />
                        </div>
                    </div>
                )}

                {currentStep.type === 'result' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <ResultStep
                                data={currentStep as any}
                                userProfile={undefined as any}
                                scores={{
                                    natural: 0,
                                    classico: 0,
                                    contemporaneo: 0,
                                    elegante: 0,
                                    romantico: 0,
                                    sexy: 0,
                                    dramatico: 0,
                                    criativo: 0
                                }}
                            />
                            <div className="mt-4 text-xs text-center opacity-60">(Preview simplificado - cálculos completos indisponíveis)
                                {/* TODO: Implementar cálculo de scores real baseado nas respostas e regras do funil */}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep.type === 'offer' && (
                    <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <OfferStep data={currentStep as any} userProfile={undefined as any} offerKey={''} />
                            <div className="mt-4 text-xs text-center opacity-60">(Preview oferta - lógica final de oferta não aplicada)
                                {/* TODO: Implementar seleção de oferta real baseada em segmentação / scores */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

QuizAppRuntime.displayName = 'QuizAppRuntime';

export default QuizAppRuntime;
