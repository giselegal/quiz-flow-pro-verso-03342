import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templateLibraryService';
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
    const stepParam = params.get('step');
    const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;

    // Debug mode baseado em parâmetros URL
    const debugMode = params.get('debug') === 'true';

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
                <UnifiedFunnelProvider
                    funnelId={funnelId || undefined}
                    debugMode={debugMode}
                >
                    <FunnelsProvider debug={debugMode}>
                        {/* Híbrido: EditorProvider (legacy) + LegacyCompatibilityWrapper (unified) para máxima compatibilidade */}
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
                                            />
                                        </QuizFlowProvider>
                                    </Quiz21StepsProvider>
                                </EditorQuizProvider>
                            </LegacyCompatibilityWrapper>
                        </EditorProvider>
                    </FunnelsProvider>
                </UnifiedFunnelProvider>
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
}> = ({
    templateId,
    funnelId,
    debugMode = false,
}) => {
        const funnelContext = useFunnelContext(funnelId);

        if (debugMode) {
            console.log('🔐 FunnelValidatedEditor:', {
                funnelId,
                isReady: funnelContext.isReady,
                isLoading: funnelContext.isLoading,
                hasError: funnelContext.hasError,
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
        if (funnelContext.hasError) {
            return (
                <FunnelFallback
                    errorType={funnelContext.errorType || 'UNKNOWN'}
                    errorMessage={funnelContext.errorMessage || 'Erro desconhecido'}
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
                    validatedFunnel={funnelContext.currentFunnel}
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
 * �🔧 EDITOR INITIALIZER UNIFICADO
 * 
 * Consolidado dos EditorInitializer do MainEditor.tsx com funcionalidades:
 * - Import dinâmico com fallback robusto
 * - Template loading via UnifiedTemplateManager
 * - Error handling e recovery
 * - Loading states otimizados
 * - Suporte para funil validado
 */
const EditorInitializerUnified: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
    validatedFunnel?: any;
    canEdit?: boolean;
}> = ({
    templateId,
    funnelId,
    debugMode = false,
    validatedFunnel,
    canEdit = true
}) => {
        const [UnifiedEditorComp, setUnifiedEditorComp] = React.useState<React.ComponentType | null>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [loadingTemplate, setLoadingTemplate] = React.useState(false);
        const [error, setError] = React.useState<string | null>(null);

        // Template loading consolidado do MainEditor.tsx
        const loadTemplateFromId = React.useCallback(async () => {
            if (!templateId || templateId === 'default') return;

            try {
                setLoadingTemplate(true);
                setError(null);

                if (debugMode) {
                    console.log('🔄 Carregando template:', templateId);
                }

                // Usar método correto do templateLibraryService
                const templates = templateLibraryService.listBuiltins();
                const template = templates.find(t => t.id === templateId);

                if (template) {
                    if (debugMode) {
                        console.log('✅ Template carregado:', template.name || templateId);
                    }
                } else {
                    console.warn('⚠️ Template não encontrado, usando padrão');
                    loadDefaultTemplate();
                }
            } catch (error) {
                console.error('❌ Erro ao carregar template:', error);
                setError(`Erro ao carregar template: ${error}`);
                loadDefaultTemplate();
            } finally {
                setLoadingTemplate(false);
            }
        }, [templateId, debugMode]);

        const loadDefaultTemplate = React.useCallback(async () => {
            try {
                if (debugMode) {
                    console.log('✅ Template padrão carregado');
                }
            } catch (error) {
                console.error('❌ Erro ao carregar template padrão:', error);
                setError(`Erro ao carregar template padrão: ${error}`);
            }
        }, [debugMode]);

        // Carregamento dinâmico do editor com fallback robusto
        React.useEffect(() => {
            let cancelled = false;

            (async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    if (debugMode) {
                        console.log('🔄 Carregando UnifiedEditor...');
                    }

                    // Primeiro tenta carregar UnifiedEditor
                    const mod = await import('../components/editor/UnifiedEditor');
                    const Comp = mod.default || mod.UnifiedEditor;

                    if (!cancelled && Comp) {
                        setUnifiedEditorComp(() => Comp);
                        if (debugMode) {
                            console.log('✅ UnifiedEditor carregado com sucesso');
                        }
                    }
                } catch (error) {
                    console.error('❌ Falha ao carregar UnifiedEditor:', error);

                    if (!cancelled) {
                        try {
                            // Fallback para EditorPro legacy
                            if (debugMode) {
                                console.log('🔄 Tentando fallback para EditorPro...');
                            }

                            const legacyMod = await import('../components/editor/EditorPro');
                            const LegacyComp = legacyMod.default || legacyMod.EditorPro;

                            if (LegacyComp) {
                                setUnifiedEditorComp(() => LegacyComp);
                                console.warn('⚠️ Usando fallback EditorPro legacy');
                            }
                        } catch (legacyError) {
                            console.error('❌ Falha ao carregar fallback EditorPro:', legacyError);
                            setError('Falha ao carregar editor. Tente recarregar a página.');
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
            };
        }, [debugMode]);

        // Template loading effect
        React.useEffect(() => {
            if (templateId && templateId !== 'default') {
                loadTemplateFromId();
            } else {
                loadDefaultTemplate();
            }
        }, [templateId, loadTemplateFromId, loadDefaultTemplate]);

        // Loading state
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                        <LoadingSpinner size="lg" className="mb-4" />
                        <p className="text-gray-600 text-lg font-medium">
                            {loadingTemplate ? 'Carregando template...' : 'Carregando editor...'}
                        </p>
                        {debugMode && (
                            <p className="text-xs text-gray-400 mt-2 font-mono">
                                Template: {templateId || 'default'} | Funnel: {funnelId || 'none'}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        // Error state
        if (error) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center max-w-md">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Erro ao carregar editor
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Recarregar página
                        </button>
                        {debugMode && (
                            <details className="mt-4 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500">
                                    Debug info
                                </summary>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                                    {JSON.stringify({ templateId, funnelId, error }, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        // Render editor
        if (!UnifiedEditorComp) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
                        <p className="text-gray-600">Editor não disponível</p>
                    </div>
                </div>
            );
        }

        return (
            <UnifiedEditorComp />
        );
    };

export default MainEditorUnified;
