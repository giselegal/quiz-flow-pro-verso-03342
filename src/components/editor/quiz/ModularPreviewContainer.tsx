import React, { useMemo } from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { UnifiedStepRenderer as ModularUnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';
import SharedProgressHeader from '@/components/shared/SharedProgressHeader';

export interface ModularPreviewContainerProps {
    funnelId?: string;
    externalSteps?: Record<string, any>;
}

/**
 * Preview modular que renderiza as etapas usando o UnifiedStepRenderer (modo "preview").
 * Mantém interatividade real via useQuizState, sem acoplar ao QuizApp completo.
 */
export const ModularPreviewContainer: React.FC<ModularPreviewContainerProps> = ({ funnelId, externalSteps }) => {
    const {
        state,
        currentStepData,
        progress,
        nextStep,
        previousStep,
        setUserName,
        addAnswer,
        addStrategicAnswer,
    } = useQuizState(funnelId, externalSteps);

    const sessionData = useMemo(() => {
        const map: Record<string, any> = {
            userName: state.userProfile.userName,
            resultStyle: state.userProfile.resultStyle,
            secondaryStyles: state.userProfile.secondaryStyles,
        };
        Object.entries(state.answers).forEach(([stepId, answers]) => {
            map[`answers_${stepId}`] = answers;
        });
        return map;
    }, [state.userProfile.userName, state.userProfile.resultStyle, state.userProfile.secondaryStyles, state.answers]);

    const onUpdateSessionData = (key: string, value: any) => {
        if (key === 'userName') {
            setUserName(String(value || ''));
            return;
        }
        if (key.startsWith('answers_')) {
            const stepId = key.replace(/^answers_/, '');
            if (Array.isArray(value)) {
                addAnswer(stepId, value as string[]);
            }
            return;
        }
        if (key.startsWith('answer_')) {
            // Estratégica: usar o texto da questão atual para mapear
            const stepId = key.replace(/^answer_/, '');
            if (stepId === state.currentStep && currentStepData?.questionText) {
                addStrategicAnswer(currentStepData.questionText, String(value || ''));
            }
            return;
        }
    };

    if (!currentStepData) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-500">
                Etapa não encontrada: {state.currentStep}
            </div>
        );
    }

    const numeric = parseInt(state.currentStep.replace('step-', '')) || 1;
    const useSharedHeader = numeric > 1 && numeric < 20; // 2..19

    return (
        <div className="min-h-screen bg-[#fefefe] text-[#5b4135]">
            <div className="quiz-container mx-auto">
                {useSharedHeader && (
                    <SharedProgressHeader progress={progress} />
                )}
                <div className={`max-w-6xl mx-auto px-4 ${useSharedHeader ? 'pt-4 pb-8' : 'py-8'}`}>
                    <ModularUnifiedStepRenderer
                        step={currentStepData as any}
                        mode="preview"
                        sessionData={sessionData}
                        onUpdateSessionData={onUpdateSessionData}
                    />
                    {/* Navegação básica para facilitar o preview */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => previousStep()}
                            className="text-sm text-[#5b4135]/70 hover:text-[#5b4135]"
                        >
                            ← Anterior
                        </button>
                        <button
                            onClick={() => nextStep()}
                            className="text-sm text-[#5b4135]/70 hover:text-[#5b4135]"
                        >
                            Próximo →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModularPreviewContainer;
