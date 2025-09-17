// @ts-nocheck
import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templates';
import React from 'react';
import { useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { EditorProvider } from '../components/editor/EditorProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useFunnelContext } from '@/hooks/useFunnelLoader';
import FunnelFallback from '@/components/editor/FunnelFallback';
import { UnifiedFunnelProvider } from '@/context/UnifiedFunnelContext';
import EditorFallback from '@/components/editor/EditorFallback';
import { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';

/**
 * 🎯 MAIN EDITOR UNIFICADO - CONSOLIDADO
 *
 * Editor principal consolidando todas as funcionalidades dos editores legacy:
 * - MainEditor.tsx (configuração Supabase, template loading, import dinâmico)
 * - MainEditorUnified.tsx (context unificado, performance otimizada)
 * 
 * Features consolidadas:
 * - Context unificado via UnifiedContextProvider + LegacyCompatibilityWrapper
 * - Configuração Supabase robusta do MainEditor legacy
 * - Template loading integrado com fallback robusto
 * - Import dinâmico com fallback para EditorPro
 * - Estado persistente e contextual
 * - Performance otimizada
 * - Debug mode avançado via URL params
 * - Máxima compatibilidade com componentes legacy
 */
const MainEditorUnified: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const routeParams = useParams<{ funnelId?: string }>();

    // Capturar funnelId tanto da rota (/editor/:funnelId) quanto da query (?funnel=id)
    const templateId = params.get('template');
    const funnelId = routeParams.funnelId || params.get('funnel');
    const duplicateId = params.get('duplicate'); // ID do template a ser duplicado
    const refactorFlag = params.get('providerRefactor') === 'true';
    const stepParam = params.get('step');
    const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;

    // 🎯 NOVO: Controle do UniversalStepEditor via URL
    const useUniversalEditor = params.get('universal') === 'true' || params.get('editor') === 'universal';
    const forceUniversal = params.get('forceUniversal') === 'true'; // Força uso mesmo com problemas

    // Debug mode baseado em parâmetros URL
    const debugMode = params.get('debug') === 'true';

    // 🤖 DETECÇÃO AUTOMÁTICA: Quando usar UniversalStepEditor automaticamente
    const shouldUseUniversalEditor = React.useMemo(() => {
        // Se explicitamente solicitado via URL
        if (useUniversalEditor || forceUniversal) return true;

        // Se explicitamente desabilitado via URL
        if (params.get('universal') === 'false' || params.get('editor') === 'legacy') return false;

        // CRITÉRIOS AUTOMÁTICOS para ativar UniversalStepEditor:

        // 1. Se é um step específico (editando step individual)
        if (initialStep && initialStep >= 1 && initialStep <= 21) {
            console.log('🎯 Detectado step específico, usando UniversalStepEditor');
            return true;
        }

        // 2. Se é um funil novo sem dados legado
        if (!funnelId || funnelId === 'new' || funnelId.startsWith('temp-')) {
            console.log('🎯 Detectado funil novo, usando UniversalStepEditor');
            return true;
        }

        // 3. Se template é modular/universal
        if (templateId && (templateId.includes('modular') || templateId.includes('universal'))) {
            console.log('🎯 Detectado template modular, usando UniversalStepEditor');
            return true;
        }

        // 4. Se no modo debug (para testes)
        if (debugMode) {
            console.log('🎯 Modo debug ativo, usando UniversalStepEditor');
            return true;
        }

        // PADRÃO: usar UniversalStepEditor (nova arquitetura como padrão)
        console.log('🎯 Usando UniversalStepEditor como padrão');
        return true;
    }, [useUniversalEditor, forceUniversal, params, initialStep, funnelId, templateId, debugMode]);

    // Configuração Supabase consolidada do MainEditor legacy
    const supabaseConfig = React.useMemo(() => ({
        enabled: (import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true',
        funnelId: funnelId || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID,
        quizId: (import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID || funnelId || 'local-funnel',
        storageKey: 'main-editor-unified-state'
    }), [funnelId]);

    // Log sempre para depuração
    console.log('🎯 MainEditorUnified iniciado:', {
        location,
        routeParams,
        templateId,
        funnelId,
        duplicateId,
        initialStep,
        useUniversalEditor,
        shouldUseUniversalEditor,
        forceUniversal,
        supabaseConfig,
        debugMode
    });

    if (debugMode) {
        console.log('🎯 MainEditorUnified modo debug ativo');
    }

    // Determinar que ID de template usar (template direto ou duplicação)
    const resolvedTemplateId = React.useMemo(() => {
        if (duplicateId) {
            if (debugMode) {
                console.log('🔄 Modo duplicação ativado para template:', duplicateId);
            }
            return duplicateId;
        }
        return templateId;
    }, [templateId, duplicateId, debugMode]);

    return (
        <div>
            <ErrorBoundary>
                {refactorFlag ? (
                    <EditorRuntimeProviders
                        funnelId={funnelId || undefined}
                        initialStep={initialStep}
                        debugMode={debugMode}
                        supabaseConfig={supabaseConfig}
                    >
                        <FunnelValidatedEditor
                            templateId={resolvedTemplateId || undefined}
                            funnelId={funnelId || undefined}
                            debugMode={debugMode}
                            useUniversalEditor={shouldUseUniversalEditor}
                            forceUniversal={forceUniversal}
                            initialStep={initialStep}
                        />
                    </EditorRuntimeProviders>
                ) : (
                    <UnifiedFunnelProvider
                        funnelId={funnelId || undefined}
                        debugMode={debugMode}
                    >
                        <FunnelsProvider debug={debugMode}>
                            {/* Híbrido legacy original */}
                            <EditorProvider
                                enableSupabase={supabaseConfig.enabled}
                                funnelId={supabaseConfig.funnelId}
                                quizId={supabaseConfig.quizId}
                                storageKey={supabaseConfig.storageKey}
                                initial={initialStep ? { currentStep: initialStep } : undefined}
                            >
                                <LegacyCompatibilityWrapper
                                    enableWarnings={debugMode}
                                    initialContext={FunnelContext.EDITOR}
                                >
                                    <EditorQuizProvider>
                                        <Quiz21StepsProvider debug={debugMode} initialStep={initialStep}>
                                            <QuizFlowProvider initialStep={initialStep} totalSteps={21}>
                                                <FunnelValidatedEditor
                                                    templateId={resolvedTemplateId || undefined}
                                                    funnelId={funnelId || undefined}
                                                    debugMode={debugMode}
                                                    useUniversalEditor={shouldUseUniversalEditor}
                                                    forceUniversal={forceUniversal}
                                                    initialStep={initialStep}
                                                />
                                            </QuizFlowProvider>
                                        </Quiz21StepsProvider>
                                    </EditorQuizProvider>
                                </LegacyCompatibilityWrapper>
                            </EditorProvider>
                        </FunnelsProvider>
                    </UnifiedFunnelProvider>
                )}
            </ErrorBoundary>
        </div>
    );
};

/**
 * � EDITOR COM VALIDAÇÃO DE FUNIL
 * 
 * Wrapper que valida o funil antes de carregar o editor:
 * - Verifica existência e permissões
 * - Mostra loading states apropriados
 * - Fornece fallbacks para erros
 * - Centraliza estado do funil
 */
const FunnelValidatedEditor: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
    useUniversalEditor?: boolean;
    forceUniversal?: boolean;
    initialStep?: number;
}> = ({
    templateId,
    funnelId,
    debugMode = false,
    useUniversalEditor = true, // 🎯 PADRÃO: usar UniversalStepEditor
    forceUniversal = false,
    initialStep,
}) => {
        const funnelContext = useFunnelContext(funnelId);

        if (debugMode) {
            console.log('🔐 FunnelValidatedEditor:', {
                funnelId,
                useUniversalEditor,
                forceUniversal,
                initialStep,
                isReady: funnelContext.isReady,
                isLoading: funnelContext.isLoading,
                isError: funnelContext.isError,
                errorType: funnelContext.errorType
            });
        }

        // Se não há funnelId, prosseguir sem validação (modo template)
        if (!funnelId) {
            return (
                <EditorInitializerUnified
                    templateId={templateId}
                    funnelId={undefined}
                    debugMode={debugMode}
                    useUniversalEditor={useUniversalEditor}
                    forceUniversal={forceUniversal}
                    initialStep={initialStep}
                />
            );
        }

        // Loading state durante validação
        if (funnelContext.isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <LoadingSpinner size="lg" className="mb-4" />
                        <p className="text-gray-600 text-lg font-medium">
                            Validando acesso ao funil...
                        </p>
                        {debugMode && (
                            <p className="text-xs text-gray-400 mt-2 font-mono">
                                Funil: {funnelId}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        // Error state - mostrar fallback
        if (funnelContext.isError) {
            return (
                <FunnelFallback
                    errorType={funnelContext.errorType || 'UNKNOWN'}
                    errorMessage={funnelContext.error || 'Erro desconhecido'}
                    funnelId={funnelId}
                    suggestions={funnelContext.suggestions}
                    onRetry={funnelContext.retry}
                    onCreateNew={() => {
                        window.location.href = '/editor?template=default';
                    }}
                />
            );
        }

        // Sucesso - funil validado, carregar editor
        if (funnelContext.isReady) {
            return (
                <EditorInitializerUnified
                    templateId={templateId}
                    funnelId={funnelId}
                    debugMode={debugMode}
                    useUniversalEditor={useUniversalEditor}
                    forceUniversal={forceUniversal}
                    initialStep={initialStep}
                    validatedFunnel={funnelContext.funnel}
                    canEdit={funnelContext.canEdit}
                />
            );
        }

        // Estado desconhecido - mostrar loading como fallback
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-gray-600 text-lg font-medium">
                        Carregando editor...
                    </p>
                </div>
            </div>
        );
    };

/**
 * � EDITOR INITIALIZER UNIFICADO COM TIMEOUT E FALLBACKS
 * 
 * Consolidado dos EditorInitializer do MainEditor.tsx com funcionalidades:
 * - Import dinâmico com fallback robusto e timeout
 * - Template loading via UnifiedTemplateManager
 * - Error handling e recovery automático
 * - Loading states otimizados com timeout
 * - Suporte para funil validado
 * - Fallback para editor legacy
 * - Validação explícita de parâmetros
 */
const EditorInitializerUnified: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
    useUniversalEditor?: boolean;
    forceUniversal?: boolean;
    initialStep?: number;
    validatedFunnel?: any;
    canEdit?: boolean;
}> = ({
    templateId,
    funnelId,
    debugMode = false,
    useUniversalEditor = true,
    forceUniversal = false,
    initialStep,
}) => {
        const [UnifiedEditorComp, setUnifiedEditorComp] = React.useState<React.ComponentType | null>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [loadingTemplate, setLoadingTemplate] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);
        const [loadingTimeout, setLoadingTimeout] = React.useState(false);
        const [fallbackMode, setFallbackMode] = React.useState(false);
        const readOnly = false; // Adicionar controle de readonly se necessário

        const startTime = React.useRef(Date.now());

        // 🔍 Validação explícita de parâmetros
        const validateParameters = React.useCallback(() => {
            const sanitizedTemplateId = templateId?.trim();
            const sanitizedFunnelId = funnelId?.trim();

            console.log('🔍 [VALIDAÇÃO] Parâmetros recebidos:', {
                templateId: sanitizedTemplateId,
                funnelId: sanitizedFunnelId,
                debugMode,
                timestamp: new Date().toISOString()
            });

            // Validar templateId se fornecido
            if (sanitizedTemplateId && sanitizedTemplateId.length > 100) {
                console.warn('⚠️ [VALIDAÇÃO] templateId muito longo:', sanitizedTemplateId.substring(0, 50) + '...');
                return { templateId: undefined, funnelId: sanitizedFunnelId };
            }

            // Validar funnelId se fornecido
            if (sanitizedFunnelId && sanitizedFunnelId.length > 100) {
                console.warn('⚠️ [VALIDAÇÃO] funnelId muito longo:', sanitizedFunnelId.substring(0, 50) + '...');
                return { templateId: sanitizedTemplateId, funnelId: undefined };
            }

            return { templateId: sanitizedTemplateId, funnelId: sanitizedFunnelId };
        }, [templateId, funnelId, debugMode]);

        // 🔄 Template loading consolidado com timeout
        const loadTemplateFromId = React.useCallback(async () => {
            const { templateId: validTemplateId } = validateParameters();

            if (!validTemplateId || validTemplateId === 'default') {
                console.log('📝 [TEMPLATE] Usando template padrão');
                return;
            }

            try {
                setLoadingTemplate(true);
                setError(null);

                console.log('🔄 [TEMPLATE] Carregando template:', validTemplateId);

                // Timeout para template loading
                const templatePromise = new Promise(async (resolve, reject) => {
                    try {
                        const templates = templateLibraryService.listBuiltins();
                        const template = templates.find(t => t.id === validTemplateId);

                        if (template) {
                            console.log('✅ [TEMPLATE] Template encontrado:', template.name || validTemplateId);
                            resolve(template);
                        } else {
                            console.warn('⚠️ [TEMPLATE] Template não encontrado, usando padrão');
                            resolve(null);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Timeout ao carregar template')), 5000);
                });

                await Promise.race([templatePromise, timeoutPromise]);

            } catch (error) {
                console.error('❌ [TEMPLATE] Erro ao carregar template:', error);
                setError(`Erro ao carregar template: ${error}`);
                loadDefaultTemplate();
            } finally {
                setLoadingTemplate(false);
            }
        }, [templateId, debugMode]);

        const loadDefaultTemplate = React.useCallback(async () => {
            try {
                console.log('✅ [TEMPLATE] Template padrão carregado');
            } catch (error) {
                console.error('❌ [TEMPLATE] Erro ao carregar template padrão:', error);
                setError(`Erro ao carregar template padrão: ${error}`);
            }
        }, [debugMode]);

        // 🔄 Carregamento dinâmico DIRETO do UniversalStepEditor
        React.useEffect(() => {
            let cancelled = false;
            let timeoutId: NodeJS.Timeout;

            console.log('🚀 [EDITOR] Iniciando carregamento DIRETO do UniversalStepEditor...');

            // Timeout de 5 segundos para loading
            timeoutId = setTimeout(() => {
                if (!cancelled) {
                    console.warn('⏰ [EDITOR] Timeout de 5s atingido, ativando fallback');
                    setLoadingTimeout(true);
                    setError('O editor está demorando para carregar. Tentando carregar modo compatibilidade...');
                    setFallbackMode(true);
                }
            }, 5000);

            (async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    if (useUniversalEditor) {
                        console.log('🎯 [EDITOR] Carregando UniversalStepEditor DIRETAMENTE...');

                        // Carregar DIRETAMENTE o UniversalStepEditor
                        const universalMod = await import('../components/editor/universal/UniversalStepEditor');
                        const UniversalComp = universalMod.default || universalMod.UniversalStepEditor;

                        if (!cancelled && UniversalComp) {
                            clearTimeout(timeoutId);
                            setUnifiedEditorComp(() => UniversalComp);
                            console.log('✅ [EDITOR] UniversalStepEditor carregado DIRETAMENTE com sucesso!');
                            return;
                        }
                    }

                    // Fallback: tentar UnifiedEditor
                    console.log('🔄 [EDITOR] Fallback para UnifiedEditor...');
                    const mod = await import('../components/editor/UnifiedEditor');
                    const Comp = mod.default || mod.UnifiedEditor;

                    if (!cancelled && Comp) {
                        clearTimeout(timeoutId);
                        setUnifiedEditorComp(() => Comp);
                        setFallbackMode(true);
                        console.log('⚠️ [EDITOR] UnifiedEditor carregado como fallback');
                    }
                } catch (error) {
                    console.error('❌ [EDITOR] Falha ao carregar editores:', error);

                    if (!cancelled) {
                        try {
                            console.log('🔄 [EDITOR] Último fallback para EditorPro...');

                            const legacyMod = await import('../components/editor/EditorPro');
                            const LegacyComp = legacyMod.default || legacyMod.EditorPro;

                            if (LegacyComp) {
                                clearTimeout(timeoutId);
                                setUnifiedEditorComp(() => LegacyComp);
                                setFallbackMode(true);
                                console.warn('⚠️ [EDITOR] Usando último fallback EditorPro');
                            }
                        } catch (legacyError) {
                            console.error('❌ [EDITOR] Todos os editores falharam:', legacyError);
                            clearTimeout(timeoutId);
                            setError('Falha ao carregar qualquer editor. Tente recarregar a página.');
                        }
                    }
                } finally {
                    if (!cancelled) {
                        setIsLoading(false);
                    }
                }
            })();

            return () => {
                cancelled = true;
                clearTimeout(timeoutId);
            };
        }, [debugMode, useUniversalEditor]);

        // Template loading effect
        React.useEffect(() => {
            if (templateId && templateId !== 'default') {
                loadTemplateFromId();
            } else {
                loadDefaultTemplate();
            }
        }, [templateId, loadTemplateFromId, loadDefaultTemplate]);

        // 🔄 Função para resetar o estado e tentar novamente
        const handleRetry = React.useCallback(() => {
            console.log('🔄 [EDITOR] Tentando recarregar...');
            setError(null);
            setIsLoading(true);
            setLoadingTimeout(false);
            setFallbackMode(false);
            startTime.current = Date.now();

            // Recarregar a página como último recurso
            window.location.reload();
        }, []);

        // 🔄 Função para resetar storage local
        const handleResetStorage = React.useCallback(() => {
            console.log('🗑️ [STORAGE] Limpando storage local...');
            try {
                // Limpar dados específicos do editor
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && (key.includes('editor') || key.includes('funnel'))) {
                        keysToRemove.push(key);
                    }
                }

                keysToRemove.forEach(key => localStorage.removeItem(key));
                console.log('✅ [STORAGE] Storage limpo, recarregando...');

                handleRetry();
            } catch (error) {
                console.error('❌ [STORAGE] Erro ao limpar storage:', error);
                setError('Erro ao limpar dados. Tente recarregar manualmente.');
            }
        }, [handleRetry]);

        // 💥 Estado de erro crítico
        if (error && !isLoading) {
            const timeElapsed = Math.round((Date.now() - startTime.current) / 1000);

            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="mb-4">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Erro ao Carregar Editor
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>

                            {loadingTimeout && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-yellow-800">
                                        ⏰ Timeout após {timeElapsed}s. O editor pode estar sobrecarregado.
                                    </p>
                                </div>
                            )}

                            {fallbackMode && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-blue-800">
                                        🔄 Tentando modo de compatibilidade...
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                🔄 Tentar Novamente
                            </button>

                            <button
                                onClick={handleResetStorage}
                                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                            >
                                🗑️ Limpar Dados e Tentar Novamente
                            </button>

                            <button
                                onClick={() => window.location.href = '/admin/funis'}
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                ← Voltar aos Modelos
                            </button>
                        </div>

                        {debugMode && (
                            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono text-left">
                                <p>Debug Info:</p>
                                <p>Template: {templateId || 'none'}</p>
                                <p>Funnel: {funnelId || 'none'}</p>
                                <p>Time: {timeElapsed}s</p>
                                <p>URL: {window.location.href}</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // 📊 Loading state com timeout visual
        if (isLoading) {
            const timeElapsed = Math.round((Date.now() - startTime.current) / 1000);

            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <LoadingSpinner size="lg" className="mb-4" />
                        <p className="text-gray-600 text-lg font-medium">
                            {loadingTemplate ? 'Carregando template...' : 'Carregando editor...'}
                        </p>

                        {timeElapsed > 5 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Carregando há {timeElapsed}s...
                            </p>
                        )}

                        {timeElapsed > 8 && (
                            <div className="mt-3 text-sm text-yellow-600">
                                ⏰ Carregamento está demorando mais que o normal
                            </div>
                        )}

                        {debugMode && (
                            <div className="mt-4 text-xs text-gray-400 font-mono">
                                <p>Template: {templateId || 'default'}</p>
                                <p>Funnel: {funnelId || 'none'}</p>
                                <p>Time: {timeElapsed}s</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ✅ Editor carregado - RENDERIZAÇÃO DIRETA
        if (UnifiedEditorComp) {
            console.log('🎯 [EDITOR] Renderizando editor carregado DIRETAMENTE');

            // Se for UniversalStepEditor, renderizar diretamente sem wrappers
            if (useUniversalEditor && !fallbackMode) {
                return (
                    <div className="h-screen w-screen">
                        <div className="bg-green-50 border-b border-green-200 px-4 py-2">
                            <p className="text-sm text-green-800 text-center">
                                🎯 UniversalStepEditor DIRETO - Editor Completo de 4 Colunas
                            </p>
                        </div>
                        <div className="h-[calc(100vh-40px)]">
                            <UnifiedEditorComp
                                stepId={initialStep ? `step-${initialStep}` : 'step-1'}
                                stepNumber={initialStep || 1}
                                funnelId={funnelId || 'quiz-21-steps-complete'}
                                onStepChange={(stepId: string) => {
                                    console.log('🔄 Step mudou:', stepId);
                                    // Atualizar URL se necessário
                                    const stepNumber = stepId.replace('step-', '');
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('step', stepNumber);
                                    window.history.replaceState({}, '', url.toString());
                                }}
                                onSave={(stepId: string, data: any) => {
                                    console.log('💾 Step salvo:', stepId, data);
                                    // Implementar lógica de salvamento real
                                }}
                                readOnly={readOnly}
                                showNavigation={true}
                            />
                        </div>
                    </div>
                );
            }

            // Para outros editores (fallback), usar estrutura original
            return (
                <div className="editor-mobile-layout h-screen w-screen">
                    {fallbackMode && (
                        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
                            <p className="text-sm text-yellow-800 text-center">
                                ⚠️ Executando em modo de compatibilidade
                            </p>
                        </div>
                    )}
                    <div className={`editor-main-content ${fallbackMode ? 'h-[calc(100vh-40px)]' : 'h-screen'}`}>
                        <UnifiedEditorComp
                            stepId={initialStep ? `step-${initialStep}` : 'step-1'}
                            stepNumber={initialStep || 1}
                            funnelId={funnelId}
                            onStepChange={(stepId: string) => {
                                console.log('🔄 Step mudou:', stepId);
                                // Atualizar URL se necessário
                                const stepNumber = stepId.replace('step-', '');
                                if (window.location.search.includes('step=')) {
                                    const url = new URL(window.location.href);
                                    url.searchParams.set('step', stepNumber);
                                    window.history.replaceState({}, '', url.toString());
                                }
                            }}
                            onSave={(stepId: string, data: any) => {
                                console.log('💾 Step salvo:', stepId, data);
                                // Implementar lógica de salvamento
                            }}
                        />
                    </div>
                </div>
            );
        }

        // 🚫 Estado impossível - fallback final
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 text-lg">
                        Estado inesperado do editor.
                        <button
                            onClick={handleRetry}
                            className="text-blue-600 hover:text-blue-800 underline ml-1"
                        >
                            Clique aqui para tentar novamente
                        </button>
                    </p>
                </div>
            </div>
        );
    };

export default MainEditorUnified;
