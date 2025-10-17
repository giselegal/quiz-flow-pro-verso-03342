import React, { useEffect, useMemo, useState } from 'react';
import { useQuizState } from '@/hooks/useQuizState';
import { UnifiedStepRenderer as ModularUnifiedStepRenderer } from '@/components/editor/quiz/components/UnifiedStepRenderer';
import SharedProgressHeader from '@/components/shared/SharedProgressHeader';
import { EditorProviderUnified, useEditorOptional } from '@/components/editor/EditorProviderUnified';
import { useGlobalUI } from '@/hooks/core/useGlobalState';

export interface ModularPreviewContainerProps {
    funnelId?: string;
    externalSteps?: Record<string, any>;
    /**
     * Quando true, renderiza com capacidades de edição (modulares) no próprio preview.
     * Quando false, renderiza em modo "preview" (componentes de produção) sem overlays.
     * Default: true
     */
    editable?: boolean;
    /** Exibe controles de viewport (mobile/tablet/desktop/full). Default: true */
    showViewportControls?: boolean;
    /** Controla o viewport externamente (full|desktop|tablet|mobile). */
    viewport?: 'full' | 'desktop' | 'tablet' | 'mobile';
    /** Callback quando viewport local muda (modo não-controlado). */
    onViewportChange?: (viewport: 'full' | 'desktop' | 'tablet' | 'mobile') => void;
    /** Callback opcional para acompanhar mudanças de sessão (userName/answers/etc.). */
    onSessionChange?: (session: Record<string, any>) => void;
}

/**
 * Preview modular que renderiza as etapas usando o UnifiedStepRenderer (modo "preview").
 * Mantém interatividade real via useQuizState, sem acoplar ao QuizApp completo.
 */
export const ModularPreviewContainer: React.FC<ModularPreviewContainerProps> = ({
    funnelId,
    externalSteps,
    editable = true,
    showViewportControls = true,
    viewport,
    onViewportChange,
    onSessionChange,
}) => {
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
    } catch { }
    const { ui, togglePropertiesPanel } = useGlobalUI();

    // Extrair referências estáveis
    const setCurrentStep = maybeEditor?.actions?.setCurrentStep;
    const ensureStepLoaded = maybeEditor?.actions?.ensureStepLoaded;

    // Sincroniza o provider unificado com a etapa atual do preview e garante que os blocos sejam carregados
    useEffect(() => {
        if (!setCurrentStep || !ensureStepLoaded) return;
        const current = state.currentStep;
        const numeric = parseInt(current.replace('step-', '')) || 1;
        try {
            setCurrentStep(numeric);
            // Garante que templates/blocos modulares da etapa sejam carregados no provider
            ensureStepLoaded(current).catch((e: any) => {
                console.warn('[ModularPreviewContainer] ensureStepLoaded falhou:', e?.message || e);
            });
        } catch (e) {
            console.warn('[ModularPreviewContainer] sync step no provider falhou:', e);
        }
    }, [state.currentStep, setCurrentStep, ensureStepLoaded]);

    // Atalho de teclado: tecla "p" abre o painel de propriedades
    const setSelectedBlockId = maybeEditor?.actions?.setSelectedBlockId;
    const stepBlocks = maybeEditor?.state?.stepBlocks;
    
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
                    const firstBlockId = stepBlocks?.[stepKey]?.[0]?.id;
                    if (firstBlockId && setSelectedBlockId) {
                        setSelectedBlockId(firstBlockId);
                    }
                } catch { /* noop */ }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [ui?.propertiesPanelOpen, togglePropertiesPanel, state.currentStep, stepBlocks, setSelectedBlockId]);

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

    // Expor sessão para consumidores (ex.: integrar com outras UIs no editor)
    useEffect(() => {
        if (onSessionChange) onSessionChange(sessionData);
    }, [sessionData, onSessionChange]);

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

    // VIEWPORT: controlado ou não-controlado
    const [localViewport, setLocalViewport] = useState<'full' | 'desktop' | 'tablet' | 'mobile'>(viewport || 'desktop');
    useEffect(() => {
        if (viewport) setLocalViewport(viewport);
    }, [viewport]);

    const updateViewport = (v: 'full' | 'desktop' | 'tablet' | 'mobile') => {
        if (!viewport) setLocalViewport(v);
        onViewportChange?.(v);
    };

    const maxWidthPx = useMemo(() => {
        switch (localViewport) {
            case 'mobile': return 390; // iPhone 15-ish
            case 'tablet': return 768;
            case 'desktop': return 1024;
            case 'full':
            default: return undefined;
        }
    }, [localViewport]);

    const [isEditLocal, setIsEditLocal] = useState<boolean>(!!editable);
    useEffect(() => { setIsEditLocal(!!editable); }, [editable]);

    const Content = (
        <div className="min-h-screen bg-[#fefefe] text-[#5b4135]">
            {/* Barra de controles do preview modular */}
            {showViewportControls && (
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
                    <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                            <span className="text-[#5b4135]/70 mr-2">Viewport:</span>
                            <button className={`px-2 py-1 rounded ${localViewport === 'mobile' ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`} onClick={() => updateViewport('mobile')}>Mobile</button>
                            <button className={`px-2 py-1 rounded ${localViewport === 'tablet' ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`} onClick={() => updateViewport('tablet')}>Tablet</button>
                            <button className={`px-2 py-1 rounded ${localViewport === 'desktop' ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`} onClick={() => updateViewport('desktop')}>Desktop</button>
                            <button className={`px-2 py-1 rounded ${localViewport === 'full' ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`} onClick={() => updateViewport('full')}>Full</button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#5b4135]/70">Modo:</span>
                            <button
                                className={`px-2 py-1 rounded ${isEditLocal ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`}
                                onClick={() => setIsEditLocal(true)}
                                title="Edição modular (abrir propriedades, reordenar, etc.)"
                            >Editar</button>
                            <button
                                className={`px-2 py-1 rounded ${!isEditLocal ? 'bg-[#B89B7A] text-white' : 'hover:bg-gray-100'}`}
                                onClick={() => setIsEditLocal(false)}
                                title="Preview (componentes de produção)"
                            >Preview</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="quiz-container mx-auto">
                {useSharedHeader && (
                    <SharedProgressHeader progress={progress} />
                )}
                <div className="w-full flex justify-center">
                    <div
                        className={`mx-auto px-4 ${useSharedHeader ? 'pt-4 pb-8' : 'py-8'}`}
                        style={{ width: '100%', maxWidth: maxWidthPx ? `${maxWidthPx}px` : undefined }}
                    >
                        <ModularUnifiedStepRenderer
                            step={currentStepData as any}
                            mode={isEditLocal ? 'edit' : 'preview'}
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
