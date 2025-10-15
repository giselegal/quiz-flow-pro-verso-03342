/**
 * 🎯 QUIZ APP CONNECTED - Conectado ao Sistema de Configuração API
 * 
 * Versão do QuizApp que busca todas as configurações via API,
 * permitindo controle total através do /editor
 */

'use client';

import { useQuizState } from '../../hooks/useQuizState';
import { useOptionalQuizRuntimeRegistry } from '@/runtime/quiz/QuizRuntimeRegistry';
import { useComponentConfiguration } from '../../hooks/useComponentConfiguration';
// Componentes originais (ainda usados como fallback para alguns casos especiais)
import IntroStep from './IntroStep';
import QuestionStep from './QuestionStep';
import StrategicQuestionStep from './StrategicQuestionStep';
import TransitionStep from './TransitionStep';
import ResultStep from './ResultStep';
import OfferStep from './OfferStep';
// Sistema unificado de renderização (Fase 3)
import { UnifiedStepRenderer, registerProductionSteps } from '@/components/editor/unified';
import { BlockRegistryProvider, DEFAULT_BLOCK_DEFINITIONS, useBlockRegistry } from '@/runtime/quiz/blocks/BlockRegistry';
import sanitizeHtml from '@/utils/sanitizeHtml';

import { useEffect, useState } from 'react';
import type { QuizConfig } from '@/types/quiz-config';
import { getEffectiveRequiredSelections } from '@/lib/quiz/requiredSelections';
import { loadNormalizedStep } from '@/lib/normalizedLoader';

interface QuizAppConnectedProps {
    funnelId?: string;
    editorMode?: boolean; // Permite visualização no /editor
    initialStepId?: string; // Etapa inicial/ativa quando em modo editor
}

export default function QuizAppConnected({ funnelId = 'quiz-estilo-21-steps', editorMode = false, initialStepId }: QuizAppConnectedProps) {
    // 🐛 DEBUG CRÍTICO: Log de props recebidas
    console.log(`🎯 QuizAppConnected RENDERIZADO`, {
        funnelId,
        editorMode,
        initialStepId,
        timestamp: new Date().toISOString()
    });

    // Registrar steps de produção (seguro chamar múltiplas vezes - stepRegistry lida com duplicatas)
    useEffect(() => {
        registerProductionSteps();
    }, []);
    // Overrides de steps vindos do editor (quando provider estiver presente)
    let externalSteps: Record<string, any> | undefined;
    const registry = useOptionalQuizRuntimeRegistry();
    if (registry && registry.steps && Object.keys(registry.steps).length) {
        externalSteps = registry.steps;
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
        autoSave: editorMode,
        editorMode // 🎨 Modo editor: carregamento instantâneo
    });

    // Configurações de tema e visual
    const {
        properties: themeConfig,
        isLoading: themeLoading
    } = useComponentConfiguration({
        componentId: 'quiz-theme-config',
        funnelId,
        realTimeSync: true,
        editorMode // 🎨 Modo editor: carregamento instantâneo
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

    // Renderer mode detection (legacy | unified | auto)
    const [rendererMode, setRendererMode] = useState<'legacy' | 'unified' | 'auto'>('legacy');
    const [normalizedStep, setNormalizedStep] = useState<any | null>(null);
    const [normalizedDebug, setNormalizedDebug] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('renderer');
        const debug = params.get('normalizedDebug');
        if (mode === 'unified' || mode === 'legacy' || mode === 'auto') {
            setRendererMode(mode);
        } else {
            setRendererMode(editorMode ? 'legacy' : 'auto');
        }
        setNormalizedDebug(debug === '1' || debug === 'true');
    }, [editorMode]);

    // Carregar normalized se solicitado e disponível
    useEffect(() => {
        let cancelled = false;
        async function load() {
            if (rendererMode === 'legacy') { setNormalizedStep(null); return; }
            // Normalizar ID: aceitar 'step-1', '1', '01', etc.
            const raw = state.currentStep || '';
            const baseMatch = raw.match(/^(?:step-)?(\d{1,2})$/);
            const numericPart = baseMatch ? baseMatch[1] : raw.replace(/^step-/, '');
            const paddedId = `step-${String(numericPart).padStart(2, '0')}`;
            // Steps piloto expandido (01-05)
            if (!/^step-0[0-5]$/.test(paddedId)) { setNormalizedStep(null); return; }
            try {
                const data = await loadNormalizedStep(paddedId);
                if (!cancelled) setNormalizedStep(data);
            } catch (e) {
                console.warn('[normalized] Falha ao carregar', paddedId, e);
                if (!cancelled) setNormalizedStep(null);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [state.currentStep, rendererMode]);

    // ========================= SINCRONIZAR ETAPA ATIVA NO MODO EDITOR =========================
    // Quando usado dentro do editor, opcionalmente alinhar a etapa atual do runtime com a etapa selecionada no editor
    useEffect(() => {
        if (!editorMode || !initialStepId) return;
        // Normalizar ID recebido (aceita step-1 ou step-01)
        const normalizeIncoming = (id: string) => {
            const numeric = id.replace('step-', '');
            return `step-${numeric.padStart(2, '0')}`;
        };
        const target = normalizeIncoming(initialStepId);
        if (state.currentStep !== target) {
            nextStep(target);
        }
        // deps incluem apenas valores estáveis
    }, [editorMode, initialStepId, state.currentStep, nextStep]);

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
        autoSave: editorMode,
        editorMode // 🎨 Modo editor: carregamento instantâneo
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
                    <p className="text-[#5b4135] font-medium">Carregando configurações...</p>
                    <p className="text-sm text-gray-500 mt-2">Status: {connectionStatus}</p>
                    {editorMode && (
                        <p className="text-xs text-gray-400 mt-2">
                            🎨 Modo Preview - Carregando comportamento de produção
                        </p>
                    )}
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
                <div><strong>Versão:</strong> {(currentStepData as any).templateVersion || (currentStepData as any).metadata?.templateVersion || '—'}</div>
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

    // =========================================================================
    // PREPARAÇÃO PARA UNIFIEDSTEPRENDERER
    // =========================================================================

    // Normalizar currentStep para ID do registry (usa zero padding)
    const getStepIdFromCurrentStep = (currentStep: string): string => {
        const numeric = currentStep.replace('step-', '');
        const padded = `step-${numeric.padStart(2, '0')}`; // step-01
        return padded;
    };
    const currentStepId = getStepIdFromCurrentStep(state.currentStep);

    // Estado unificado consumido pelo UnifiedStepRenderer / adapters
    const unifiedQuizState = {
        currentStep: parseInt(state.currentStep.replace('step-', '')) || 1,
        userName: state.userProfile.userName,
        answers: state.answers,
        strategicAnswers: state.userProfile.strategicAnswers,
        resultStyle: state.userProfile.resultStyle,
        secondaryStyles: state.userProfile.secondaryStyles
    };

    // Calcular requiredSelections efetivo (usa util centralizada)
    const effectiveRequiredSelections = getEffectiveRequiredSelections({ step: currentStepData, mergedConfig, currentStepConfig });

    // stepProps combinando dados locais + overrides API + regra consolidada
    const unifiedStepProps = {
        ...currentStepData,
        ...currentStepConfig,
        requiredSelections: effectiveRequiredSelections
    } as any;

    // Handler de atualização vindo dos adapters via UnifiedStepRenderer
    const handleStepUpdate = (stepId: string, updates: Record<string, any>) => {
        if (!updates) return;
        // Nome do usuário
        if (typeof updates.userName === 'string') {
            setUserName(updates.userName);
        }

        // Respostas (arrays para perguntas normais, string para estratégica)
        Object.entries(updates).forEach(([key, value]) => {
            if (key === 'userName') return;
            // Normalizar key para comparar com step atual (padded vs legacy)
            const normalizedKey = key.replace('step-', (match) => match); // mantém formato
            if (normalizedKey === currentStepId || normalizedKey === state.currentStep) {
                if (Array.isArray(value)) {
                    addAnswer(state.currentStep, value as string[]);
                } else if (typeof value === 'string') {
                    // Pergunta estratégica → manter padrão existente (usa stepId como chave)
                    if (currentStepData.type === 'strategic-question') {
                        addStrategicAnswer(state.currentStep, value);
                    } else {
                        addAnswer(state.currentStep, [value]);
                    }
                }
            }
        });
    };

    // Interceptar avanço para aplicar regra de requiredSelections antes de prosseguir
    const handleNext = () => {
        if (currentStepData.type === 'question') {
            const answers = state.answers[state.currentStep] || [];
            if (answers.length < effectiveRequiredSelections) {
                // Ainda não atingiu limite necessário – bloquear avanço automático do adapter
                return;
            }
        }
        nextStep();
    };

    // Estratégia de renderização híbrida:
    // - Para result/offer com blocks dinâmicos: manter caminho custom
    // - Para transition-result (não registrado): fallback manual
    // - Demais steps: usar UnifiedStepRenderer

    const shouldUseBlocks = (type: string) => ['result', 'offer'].includes(type) && (currentStepData as any).blocks?.length;

    // ============================================================================
    // LEGACY STEP RENDERING (Editor Mode) - Permite visualizar componentes antigos
    // ============================================================================
    const legacyEnabled = rendererMode === 'legacy' || (rendererMode === 'auto' && !normalizedStep);

    const legacyRender = () => {
        const type = currentStepData.type;
        switch (type) {
            case 'intro':
                return (
                    <IntroStep
                        data={currentStepData as any}
                        onNameSubmit={(name: string) => {
                            setUserName(name);
                            nextStep();
                        }}
                    />
                );
            case 'question': {
                const answers = (state.answers[state.currentStep] || []) as string[];
                return (
                    <QuestionStep
                        data={currentStepData as any}
                        currentAnswers={answers}
                        onAnswersChange={(newAnswers) => {
                            // Atualiza respostas e avança se completou requiredSelections
                            addAnswer(state.currentStep, newAnswers);
                            const required = (currentStepData as any).requiredSelections || 1;
                            if (newAnswers.length === required) {
                                // Delay pequeno para feedback visual antes de avançar
                                setTimeout(() => nextStep(), 250);
                            }
                        }}
                    />
                );
            }
            case 'strategic-question': {
                const strategicAnswers: Record<string, string> = (state.userProfile as any).strategicAnswers || {};
                const currentAnswer = strategicAnswers[state.currentStep] || '';
                return (
                    <StrategicQuestionStep
                        data={currentStepData as any}
                        currentAnswer={currentAnswer}
                        onAnswerChange={(answer: string) => {
                            addStrategicAnswer(state.currentStep, answer);
                            // Avança automático após seleção
                            setTimeout(() => nextStep(), 400);
                        }}
                    />
                );
            }
            case 'transition':
            case 'transition-result':
                return (
                    <TransitionStep
                        data={currentStepData as any}
                        onComplete={() => nextStep()}
                    />
                );
            case 'result':
                return (
                    <ResultStep
                        data={currentStepData as any}
                        userProfile={state.userProfile as any}
                        // Tentativa de incluir pontuações se existirem (fallback silencioso)
                        scores={(state as any).scores}
                    />
                );
            default:
                return null;
        }
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

                    {/* Renderização Híbrida: Blocks dinâmicos para result/offer, Unified para demais */}
                    {/* Indicador de modo no editor */}
                    {editorMode && (
                        <div className="max-w-6xl mx-auto px-4 pb-2 text-[10px] uppercase tracking-wide text-gray-500 flex items-center gap-3 flex-wrap">
                            <span>Renderer: {rendererMode}{normalizedStep ? ' (normalized)' : legacyEnabled ? ' (legacy)' : ''}</span>
                            {normalizedStep && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-300 font-semibold">
                                    UNIFIED • {normalizedStep.blocks?.length || 0} blocks
                                </span>
                            )}
                            {normalizedStep && !legacyEnabled && (
                                <span className="text-[9px] text-gray-400">(&normalizedDebug=1 para contornos)</span>
                            )}
                            {/* Toggle buttons */}
                            <div className="flex items-center gap-1">
                                {['legacy', 'unified', 'auto'].map(mode => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => {
                                            const sp = new URLSearchParams(window.location.search);
                                            sp.set('renderer', mode);
                                            const url = `${window.location.pathname}?${sp.toString()}`;
                                            window.history.replaceState({}, '', url);
                                            setRendererMode(mode as any);
                                        }}
                                        className={`px-2 py-0.5 rounded border text-[10px] tracking-normal ${rendererMode === mode ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                                    >{mode}</button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const sp = new URLSearchParams(window.location.search);
                                        const cur = sp.get('normalizedDebug');
                                        const next = (cur === '1' || cur === 'true') ? null : '1';
                                        if (next) sp.set('normalizedDebug', next); else sp.delete('normalizedDebug');
                                        const url = `${window.location.pathname}?${sp.toString()}`;
                                        window.history.replaceState({}, '', url);
                                        setNormalizedDebug(!!next);
                                    }}
                                    className={`ml-1 px-2 py-0.5 rounded border text-[10px] tracking-normal ${normalizedDebug ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50'}`}
                                    title="Toggle normalized debug"
                                >debug</button>
                            </div>
                        </div>
                    )}
                    {legacyEnabled ? (
                        <div className="max-w-6xl mx-auto px-4 py-8">
                            {legacyRender() || (
                                <div className="text-sm text-gray-500 italic">(Sem renderização legacy para este tipo: {currentStepData.type})</div>
                            )}
                        </div>
                    ) : normalizedStep ? (
                        <div className={"max-w-6xl mx-auto px-4 py-8 space-y-8" + (normalizedDebug ? ' normalized-debug-mode' : '')}>
                            {normalizedStep.blocks.map((b: any, idx: number) => {
                                const def = useBlockRegistry().get(b.type);
                                if (!def) return <div key={idx} className="text-xs text-red-600">Bloco não registrado: {b.type}</div>;
                                try {
                                    return (
                                        <div
                                            key={idx}
                                            className={"normalized-block-wrapper" + (normalizedDebug ? ' outline outline-2 outline-emerald-400/70 rounded-sm relative' : '')}
                                            data-block-type={b.type}
                                        >
                                            {normalizedDebug && (
                                                <div className="absolute -top-2 -left-2 bg-emerald-500 text-white text-[10px] px-1 rounded shadow">
                                                    {b.type}
                                                </div>
                                            )}
                                            {def.render({
                                                config: { ...def.defaultConfig, ...b.config },
                                                state: {
                                                    userProfile: state.userProfile,
                                                    onNameSubmit: (name: string) => { setUserName(name); nextStep(); },
                                                    onAnswersChange: (answers: string[]) => { addAnswer(state.currentStep, answers); },
                                                    onComplete: () => nextStep()
                                                }
                                            })}
                                        </div>
                                    );
                                } catch (e: any) {
                                    return <div key={idx} className="text-xs text-red-600">Erro bloco {b.type}: {e.message}</div>;
                                }
                            })}
                        </div>
                    ) : shouldUseBlocks(currentStepData.type) ? (
                        // Caminho dinâmico (result/offer com blocks)
                        currentStepData.type === 'result' ? (
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <BlocksRuntimeRenderer
                                    stepType="result"
                                    blocks={(currentStepData as any).blocks as any}
                                    context={{ userProfile: state.userProfile, step: currentStepData, applyPlaceholders }}
                                />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto px-4 py-8">
                                <BlocksRuntimeRenderer
                                    stepType="offer"
                                    blocks={(currentStepData as any).blocks as any}
                                    context={{ userProfile: state.userProfile, offerKey: getOfferKey(), step: currentStepData, applyPlaceholders }}
                                />
                            </div>
                        )
                    ) : currentStepData.type === 'transition-result' ? (
                        // Fallback para tipo legado ainda não registrado
                        <TransitionStep
                            data={{ ...currentStepData, ...currentStepConfig }}
                            onComplete={() => nextStep()}
                        />
                    ) : (
                        <div className="bg-[#fefefe] text-[#5b4135] min-h-screen">
                            <div className="max-w-6xl mx-auto px-4 py-8">
                                <UnifiedStepRenderer
                                    stepId={currentStepId}
                                    mode="production"
                                    stepProps={unifiedStepProps}
                                    quizState={unifiedQuizState}
                                    onStepUpdate={handleStepUpdate}
                                    onNext={handleNext}
                                    onNameSubmit={(name: string) => {
                                        setUserName(name);
                                        nextStep();
                                    }}
                                    onPrevious={() => {
                                        // (Opcional) implementar voltar no futuro
                                        console.log('Navegar para step anterior (não implementado)');
                                    }}
                                    className="unified-production-step"
                                />
                            </div>
                        </div>
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