import React, { useEffect, useMemo } from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { UnifiedStepRenderer as ModularUnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';
import SharedProgressHeader from '@/components/shared/SharedProgressHeader';
import { EditorProviderUnified, useEditorOptional } from '@/components/editor/EditorProviderUnified';
import { useGlobalUI } from '@/hooks/core/useGlobalState';

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

    // Detecta se já existe um EditorProviderUnified acima
    const maybeEditor = useEditorOptional?.();
    // Debug: status do provider
    try {
        const hasProvider = !!maybeEditor;
        const hasActions = !!maybeEditor?.actions;
        // eslint-disable-next-line no-console
        console.debug('[ModularPreviewContainer] Provider status:', { hasProvider, hasActions });
    } catch {}
    const { ui, togglePropertiesPanel } = useGlobalUI();

    // Sincroniza o provider unificado com a etapa atual do preview e garante que os blocos sejam carregados
    useEffect(() => {
        if (!maybeEditor?.actions) return;
        const current = state.currentStep;
        const numeric = parseInt(current.replace('step-', '')) || 1;
        try {
            maybeEditor.actions.setCurrentStep(numeric);
            // Garante que templates/blocos modulares da etapa sejam carregados no provider
            maybeEditor.actions.ensureStepLoaded(current).catch((e: any) => {
                console.warn('[ModularPreviewContainer] ensureStepLoaded falhou:', e?.message || e);
            });
        } catch (e) {
            console.warn('[ModularPreviewContainer] sync step no provider falhou:', e);
        }
    }, [state.currentStep, maybeEditor?.actions]);

    // Atalho de teclado: tecla "p" abre o painel de propriedades
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Evitar conflitos com inputs
            const target = e.target as HTMLElement;
            const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
            if (isTyping) return;
            if ((e.key === 'p' || e.key === 'P')) {
                try {
                    if (!ui?.propertiesPanelOpen) togglePropertiesPanel();
                    // Se não há seleção ainda, tentar selecionar o primeiro bloco do step atual
                    const stepKey = state.currentStep;
                    const firstBlockId = maybeEditor?.state?.stepBlocks?.[stepKey]?.[0]?.id;
                    if (firstBlockId && maybeEditor?.actions?.setSelectedBlockId) {
                        maybeEditor.actions.setSelectedBlockId(firstBlockId);
                    }
                } catch { /* noop */ }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [ui?.propertiesPanelOpen, togglePropertiesPanel, state.currentStep, maybeEditor?.state?.stepBlocks, maybeEditor?.actions]);

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

    const Content = (
        <div className="min-h-screen bg-[#fefefe] text-[#5b4135]">
            <div className="quiz-container mx-auto">
                {useSharedHeader && (
                    <SharedProgressHeader progress={progress} />
                )}
                <div className={`max-w-6xl mx-auto px-4 ${useSharedHeader ? 'pt-4 pb-8' : 'py-8'}`}>
                    <ModularUnifiedStepRenderer
                        step={currentStepData as any}
                        mode="edit"
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

    // Se não houver provider, encapsula para habilitar seleção de blocos e propriedades
    // Encapsular com provider se não houver provider OU se provider não expõe actions (parcial/legacy)
    if (!maybeEditor || !maybeEditor.actions) {
        return (
            <EditorProviderUnified>
                {Content}
            </EditorProviderUnified>
        );
    }

    return Content;
};

export default ModularPreviewContainer;
