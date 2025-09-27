/**
 * 🎯 QUIZ APP CONNECTED - Conectado ao Sistema de Configuração API
 * 
 * Versão do QuizApp que busca todas as configurações via API,
 * permitindo controle total através do /editor
 */

'use client';

import { useQuizState } from '../../hooks/useQuizState';
import { useComponentConfiguration } from '../../hooks/useComponentConfiguration';
import IntroStep from './IntroStep';
import QuestionStep from './QuestionStep';
import StrategicQuestionStep from './StrategicQuestionStep';
import TransitionStep from './TransitionStep';
import ResultStep from './ResultStep';
import OfferStep from './OfferStep';
import { useEffect, useState } from 'react';

interface QuizAppConnectedProps {
    funnelId?: string;
    editorMode?: boolean; // Permite visualização no /editor
}

export default function QuizAppConnected({ funnelId = 'quiz-estilo-21-steps', editorMode = false }: QuizAppConnectedProps) {

    // ============================================================================
    // CONFIGURATION HOOKS - Conecta com API
    // ============================================================================

    // Configuração global do quiz
    const {
        properties: globalConfig,
        isLoading: globalLoading,
        error: globalError,
        connectionStatus
    } = useComponentConfiguration({
        componentId: 'quiz-global-config',
        funnelId,
        realTimeSync: true,
        autoSave: editorMode
    });

    // Configurações de tema e visual
    const {
        properties: themeConfig,
        isLoading: themeLoading
    } = useComponentConfiguration({
        componentId: 'quiz-theme-config',
        funnelId,
        realTimeSync: true
    });

    // ============================================================================
    // QUIZ STATE - Lógica original mantida
    // ============================================================================

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

    // ============================================================================
    // DYNAMIC STEP CONFIGURATION
    // ============================================================================

    const [stepConfigurations, setStepConfigurations] = useState<Record<string, any>>({});

    // Carregar configurações específicas da etapa atual
    const currentStepNumber = parseInt(state.currentStep.replace('step-', ''), 10) || 1;
    const {
        properties: currentStepConfig,
        isLoading: stepLoading,
        updateProperty: updateStepProperty
    } = useComponentConfiguration({
        componentId: `quiz-step-${currentStepNumber}`,
        funnelId,
        realTimeSync: true,
        autoSave: editorMode
    });

    // ============================================================================
    // LOADING AND ERROR STATES
    // ============================================================================

    const isLoading = globalLoading || themeLoading || stepLoading;
    const hasError = globalError;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
                    <p className="text-[#5b4135]">Carregando configurações...</p>
                    <p className="text-sm text-gray-500">Status: {connectionStatus}</p>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center text-red-500 max-w-md">
                    <h2 className="text-xl font-bold mb-2">Erro na Configuração</h2>
                    <p className="mb-4">{hasError}</p>
                    {editorMode && (
                        <p className="text-sm text-gray-500">
                            Certifique-se de que o componente está registrado no /editor
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================================
    // CONFIGURATION MERGER - Combina todas as configurações
    // ============================================================================

    const mergedConfig = {
        // Configurações globais
        ...globalConfig,
        // Configurações de tema
        ...themeConfig,
        // Configurações específicas da etapa
        ...currentStepConfig,
        // Override para modo editor
        ...(editorMode && {
            showDebugInfo: true,
            allowRealTimeEditing: true
        })
    };

    // ============================================================================
    // CURRENT STEP DATA WITH API CONFIG
    // ============================================================================

    if (!currentStepData) {
        return (
            <div className="min-h-screen bg-[#fefefe] flex items-center justify-center">
                <div className="text-center text-red-500">
                    <p>Etapa não encontrada: {state.currentStep}</p>
                    {editorMode && (
                        <p className="text-sm mt-2">
                            Configure esta etapa no /editor para vê-la aqui
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ============================================================================
    // DYNAMIC STYLING - Baseado na configuração da API
    // ============================================================================

    const dynamicStyles = {
        '--primary-color': mergedConfig.primaryColor || '#B89B7A',
        '--secondary-color': mergedConfig.secondaryColor || '#432818',
        '--background-color': mergedConfig.backgroundColor || '#fefefe',
        '--text-color': mergedConfig.textColor || '#5b4135',
        '--progress-color': mergedConfig.progressColor || '#deac6d',
        '--border-radius': `${mergedConfig.borderRadius || 8}px`,
        '--spacing-unit': `${mergedConfig.spacingUnit || 8}px`,
        '--font-family': mergedConfig.fontFamily || 'Inter, sans-serif',
    } as React.CSSProperties;

    // ============================================================================
    // PROGRESS BAR CONFIGURATION
    // ============================================================================

    const showProgress = mergedConfig.showProgress !== false &&
        !['intro', 'transition', 'transition-result'].includes(currentStepData.type);

    const progressConfig = {
        showPercentage: mergedConfig.showProgressPercentage !== false,
        showStepInfo: mergedConfig.showProgressStepInfo === true,
        animationDuration: mergedConfig.progressAnimationDuration || 500,
        height: mergedConfig.progressBarHeight || '2.5',
        backgroundColor: mergedConfig.progressBackgroundColor || 'gray-200',
    };

    // ============================================================================
    // EDITOR OVERLAY (apenas no modo editor)
    // ============================================================================

    const EditorOverlay = editorMode ? () => (
        <div className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg max-w-xs">
            <div className="text-xs font-mono space-y-1">
                <div><strong>Etapa:</strong> {currentStepNumber}/21</div>
                <div><strong>Componente:</strong> {currentStepData.type}</div>
                <div><strong>API Status:</strong>
                    <span className={`ml-1 ${connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
                        {connectionStatus}
                    </span>
                </div>
                <div><strong>Configurações:</strong> {Object.keys(mergedConfig).length}</div>
                <div className="pt-2 border-t border-gray-200">
                    <div className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => console.log('Config:', mergedConfig)}>
                        Ver Configuração →
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    // ============================================================================
    // RENDER WITH API-DRIVEN CONFIGURATION
    // ============================================================================

    return (
        <div className="min-h-screen" style={dynamicStyles}>
            <div className="quiz-container mx-auto">

                {/* Editor Overlay */}
                {EditorOverlay && <EditorOverlay />}

                {/* Progress Bar Configurável */}
                {showProgress && (
                    <div className="mb-6 max-w-6xl mx-auto px-4 py-8">
                        <div
                            className={`w-full bg-${progressConfig.backgroundColor} rounded-full mb-4`}
                            style={{ height: `${progressConfig.height}px` }}
                        >
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: 'var(--progress-color)',
                                    transitionDuration: `${progressConfig.animationDuration}ms`
                                }}
                            ></div>
                        </div>

                        {progressConfig.showPercentage && (
                            <p className="text-sm text-center mb-4">
                                Progresso: {progress}%
                            </p>
                        )}

                        {progressConfig.showStepInfo && (
                            <p className="text-xs text-center text-gray-500">
                                Etapa {currentStepNumber} de 21 • {currentStepData.type}
                            </p>
                        )}
                    </div>
                )}

                {/* Renderização da Etapa Atual com Configurações API */}
                {currentStepData.type === 'intro' && (
                    <IntroStep
                        data={{ ...currentStepData, ...currentStepConfig }}
                        config={mergedConfig}
                        onNameSubmit={(name: string) => {
                            setUserName(name);
                            nextStep();
                        }}
                        editorMode={editorMode}
                    />
                )}

                {currentStepData.type === 'question' && (
                    <div
                        className="min-h-screen"
                        style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                    >
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <QuestionStep
                                data={{ ...currentStepData, ...currentStepConfig }}
                                config={mergedConfig}
                                currentAnswers={state.answers[state.currentStep] || []}
                                onAnswersChange={(answers: string[]) => {
                                    addAnswer(state.currentStep, answers);

                                    // Configuração dinâmica de auto-advance
                                    const autoAdvanceEnabled = mergedConfig.autoAdvance !== false;
                                    const autoAdvanceDelay = mergedConfig.autoAdvanceDelay || 1000;
                                    const requiredSelections = mergedConfig.requiredSelections || currentStepData.requiredSelections || 3;

                                    if (autoAdvanceEnabled && answers.length === requiredSelections) {
                                        setTimeout(() => nextStep(), autoAdvanceDelay);
                                    }
                                }}
                                editorMode={editorMode}
                                onConfigUpdate={editorMode ? updateStepProperty : undefined}
                            />
                        </div>
                    </div>
                )}

                {currentStepData.type === 'strategic-question' && (
                    <div
                        className="min-h-screen"
                        style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
                    >
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            <StrategicQuestionStep
                                data={{ ...currentStepData, ...currentStepConfig }}
                                config={mergedConfig}
                                currentAnswer={state.answers[state.currentStep]?.[0] || ''}
                                onAnswerChange={(answer: string) => {
                                    addStrategicAnswer(state.currentStep, answer);

                                    // Strategic questions não têm auto-advance por padrão
                                    const strategicAutoAdvance = mergedConfig.strategicAutoAdvance === true;
                                    if (strategicAutoAdvance) {
                                        setTimeout(() => nextStep(), mergedConfig.strategicAutoAdvanceDelay || 2000);
                                    }
                                }}
                                editorMode={editorMode}
                                onConfigUpdate={editorMode ? updateStepProperty : undefined}
                            />
                        </div>
                    </div>
                )}

                {currentStepData.type === 'transition' && (
                    <TransitionStep
                        data={{ ...currentStepData, ...currentStepConfig }}
                        config={mergedConfig}
                        onContinue={() => nextStep()}
                        editorMode={editorMode}
                    />
                )}

                {currentStepData.type === 'transition-result' && (
                    <TransitionStep
                        data={{ ...currentStepData, ...currentStepConfig }}
                        config={mergedConfig}
                        onContinue={() => nextStep()}
                        editorMode={editorMode}
                    />
                )}

                {currentStepData.type === 'result' && (
                    <ResultStep
                        data={{ ...currentStepData, ...currentStepConfig }}
                        config={mergedConfig}
                        userProfile={state.userProfile}
                        onContinue={() => nextStep()}
                        editorMode={editorMode}
                        onConfigUpdate={editorMode ? updateStepProperty : undefined}
                    />
                )}

                {currentStepData.type === 'offer' && (
                    <OfferStep
                        data={{ ...currentStepData, ...currentStepConfig }}
                        config={mergedConfig}
                        userProfile={state.userProfile}
                        offerKey={getOfferKey()}
                        editorMode={editorMode}
                        onConfigUpdate={editorMode ? updateStepProperty : undefined}
                    />
                )}

                {/* Debug Info (modo editor) */}
                {editorMode && (
                    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg font-mono text-xs max-w-md">
                        <div className="space-y-1">
                            <div>🔧 <strong>Editor Mode Active</strong></div>
                            <div>📡 API: {connectionStatus}</div>
                            <div>⚡ Real-time: {mergedConfig.realTimeSync ? 'ON' : 'OFF'}</div>
                            <div>💾 Auto-save: {mergedConfig.autoSave ? 'ON' : 'OFF'}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}