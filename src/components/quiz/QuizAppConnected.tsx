/**
 * 🎯 QUIZ APP CONNECTED - Conectado ao Sistema de Configuração API
 * 
 * Versão do QuizApp que busca todas as configurações via API,
 * permitindo controle total através do /editor
 */

'use client';

import { useQuizState } from '../../hooks/useQuizState';
import { useQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { useComponentConfiguration } from '../../hooks/useComponentConfiguration';
import IntroStep from './IntroStep';
import QuestionStep from './QuestionStep';
import StrategicQuestionStep from './StrategicQuestionStep';
import TransitionStep from './TransitionStep';
import ResultStep from './ResultStep';
import OfferStep from './OfferStep';
import { BlockRegistryProvider, DEFAULT_BLOCK_DEFINITIONS, useBlockRegistry } from '@/runtime/quiz/blocks/BlockRegistry';
import sanitizeHtml from '@/utils/sanitizeHtml';
import { useEffect, useState } from 'react';
import type { QuizConfig } from '@/types/quiz-config';

// ============================================================================
// UTIL: Cálculo consistente de requiredSelections (prioridade clara)
// 1. Config específica da etapa vinda da API (currentStepConfig.requiredSelections)
// 2. Definição estática original da etapa (currentStepData.requiredSelections)
// 3. Regras globais (mergedConfig.steps2to11 / steps13to18)
// 4. Fallback por tipo: question=3, strategic-question=1, outro=1
// ============================================================================
function getEffectiveRequiredSelections(step: any, mergedConfig: any, currentStepConfig: any): number {
    // API específica da etapa tem precedência
    if (typeof currentStepConfig?.requiredSelections === 'number') return currentStepConfig.requiredSelections;
    // Definição original da etapa
    if (typeof step?.requiredSelections === 'number') return step.requiredSelections;
    // Regras agregadas (templates globais)
    if (step?.type === 'question' && mergedConfig?.steps2to11?.requiredSelections)
        return mergedConfig.steps2to11.requiredSelections;
    if (step?.type === 'strategic-question' && mergedConfig?.steps13to18?.requiredSelections)
        return mergedConfig.steps13to18.requiredSelections;
    // Fallback por tipo
    if (step?.type === 'question') return 3;
    if (step?.type === 'strategic-question') return 1;
    return 1;
}

interface QuizAppConnectedProps {
    funnelId?: string;
    editorMode?: boolean; // Permite visualização no /editor
}

export default function QuizAppConnected({ funnelId = 'quiz-estilo-21-steps', editorMode = false }: QuizAppConnectedProps) {
    // Overrides de steps vindos do editor (quando provider estiver presente)
    let externalSteps: Record<string, any> | undefined;
    try {
        const registry = useQuizRuntimeRegistry();
        // Se houver steps no registry usamos como override runtime sem depender de salvar o funil
        if (registry.steps && Object.keys(registry.steps).length) {
            externalSteps = registry.steps;
        }
    } catch (_e) {
        // Provider não presente: ignora silenciosamente
    }

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
    } = useQuizState(funnelId, externalSteps);

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

    const mergedConfig: QuizConfig = {
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

    // Util de placeholders (result/offer blocks)
    const applyPlaceholders = (value: any): any => {
        if (value == null) return value;
        if (typeof value === 'string') {
            const userName = state.userProfile?.userName || 'Usuária';
            const primary = state.userProfile?.resultStyle || 'estilo';
            const secondary = (state.userProfile?.secondaryStyles || []).join(', ');
            return value
                .replace(/\{userName\}/g, userName)
                .replace(/\{primaryStyle\}/g, primary)
                .replace(/\{secondaryStyles\}/g, secondary);
        }
        if (Array.isArray(value)) return value.map(v => applyPlaceholders(v));
        if (typeof value === 'object') {
            const out: Record<string, any> = {};
            Object.keys(value).forEach(k => { out[k] = applyPlaceholders(value[k]); });
            return out;
        }
        return value;
    };

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

    // ================= BLOCO RUNTIME RENDERER =================
    const BlocksRuntimeRenderer: React.FC<{ blocks: any[]; context: any; stepType: string }> = ({ blocks, context, stepType }) => {
        const registry = useBlockRegistry();
        if (!blocks || !blocks.length) return null;
        return (
            <div className="space-y-6">
                {blocks.map(b => {
                    const def = registry.get(b.type);
                    if (!def) {
                        return <div key={b.id} className="text-xs text-red-600 border border-red-300 rounded p-2 bg-red-50">Bloco não encontrado: <strong>{b.type}</strong></div>;
                    }
                    let rendered: any;
                    try {
                        const processedConfig = applyPlaceholders(b.config || def.defaultConfig);
                        rendered = def.render({ config: processedConfig, state: { ...context, applyPlaceholders } });
                    } catch (e: any) {
                        return <div key={b.id} className="text-xs text-red-600 border border-red-300 rounded p-2 bg-red-50">Erro ao renderizar bloco {b.type}: {e.message}</div>;
                    }
                    return <div key={b.id} data-block-id={b.id} data-block-type={b.type} className="runtime-block-wrapper">{rendered}</div>;
                })}
            </div>
        );
    };

    return (
        <BlockRegistryProvider definitions={DEFAULT_BLOCK_DEFINITIONS}>
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
                            onNameSubmit={(name: string) => {
                                setUserName(name);
                                nextStep();
                            }}
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
                                    currentAnswers={state.answers[state.currentStep] || []}
                                    onAnswersChange={(answers: string[]) => {
                                        addAnswer(state.currentStep, answers);
                                        const requiredSelections = getEffectiveRequiredSelections(currentStepData, mergedConfig, currentStepConfig);
                                        const autoCfg = (mergedConfig.autoAdvance as any) || {};
                                        const autoAdvanceEnabled = typeof autoCfg === 'object'
                                            ? (autoCfg.enabled !== false)
                                            : mergedConfig.autoAdvance !== false;
                                        const autoAdvanceDelay = typeof autoCfg === 'object'
                                            ? (autoCfg.delay ?? 1000)
                                            : (mergedConfig.autoAdvanceDelay ?? 1000);

                                        // Avançar apenas quando atingir exatamente o número exigido
                                        if (autoAdvanceEnabled && answers.length === requiredSelections) {
                                            setTimeout(() => nextStep(), Number(autoAdvanceDelay) || 1000);
                                        }
                                    }}
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
                                    currentAnswer={state.answers[state.currentStep]?.[0] || ''}
                                    onAnswerChange={(answer: string) => {
                                        addStrategicAnswer(state.currentStep, answer);

                                        // Strategic questions não têm auto-advance por padrão
                                        const strategicAutoAdvance = (mergedConfig as any).strategicAutoAdvance === true;
                                        if (strategicAutoAdvance) {
                                            setTimeout(() => nextStep(), Number((mergedConfig as any).strategicAutoAdvanceDelay) || 2000);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {currentStepData.type === 'transition' && (
                        <TransitionStep
                            data={{ ...currentStepData, ...currentStepConfig }}
                            onComplete={() => nextStep()}
                        />
                    )}

                    {currentStepData.type === 'transition-result' && (
                        <TransitionStep
                            data={{ ...currentStepData, ...currentStepConfig }}
                            onComplete={() => nextStep()}
                        />
                    )}

                    {currentStepData.type === 'result' && (
                        currentStepData.blocks?.length ? (
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <BlocksRuntimeRenderer
                                    stepType="result"
                                    blocks={currentStepData.blocks as any}
                                    context={{ userProfile: state.userProfile, step: currentStepData }}
                                />
                            </div>
                        ) : (
                            <ResultStep
                                data={{ ...currentStepData, ...currentStepConfig }}
                                userProfile={state.userProfile}
                            />
                        )
                    )}

                    {currentStepData.type === 'offer' && (
                        currentStepData.blocks?.length ? (
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <BlocksRuntimeRenderer
                                    stepType="offer"
                                    blocks={currentStepData.blocks as any}
                                    context={{ userProfile: state.userProfile, offerKey: getOfferKey(), step: currentStepData }}
                                />
                            </div>
                        ) : (
                            (() => {
                                const offerKey = getOfferKey();
                                const cloned: any = { ...currentStepData };
                                if (cloned.offerMap && offerKey && cloned.offerMap[offerKey]) {
                                    cloned.offerMap = { ...cloned.offerMap };
                                    cloned.offerMap[offerKey] = applyPlaceholders(cloned.offerMap[offerKey]);
                                }
                                return <OfferStep data={{ ...cloned, ...currentStepConfig }} userProfile={state.userProfile} offerKey={offerKey} />;
                            })()
                        )
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
        </BlockRegistryProvider>
    );
}