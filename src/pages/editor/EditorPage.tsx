/**
 * 🎯 EDITOR PAGE - Página Unificada do Editor (REFATORADO)
 * 
 * ✅ NOVO: Usa ModernQuizEditor com arquitetura limpa
 * - Zustand + Immer para estado
 * - 4 colunas: Steps | Library | Canvas | Properties
 * - Integração com templateService para carregar quiz
 * 
 * FEATURES:
 * - Lazy loading de componentes
 * - Error boundaries integrados
 * - Loading states adequados
 * - ✅ AUDIT: Optimized JSON loading with caching
 * - ✅ AUDIT: Request deduplication for concurrent loads
 * 
 * @example
 * ```typescript
 * // Rotas suportadas:
 * /editor                    → Carrega funnel padrão (quiz21StepsComplete)
 * /editor?funnel=quiz21      → Carregar template específico
 * /editor?funnelId=abc123    → Editar funnel existente
 * /editor/abc123             → Editar funnel por ID (alias)
 * ```
 */

import React, { Suspense, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRoute } from 'wouter';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { PageLoadingFallback } from '@/components/LoadingSpinner';
import { appLogger } from '@/lib/utils/appLogger';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';
import { funnelService } from '@/services/funnel/FunnelService';
import { parseFunnelFromURL } from '@/services/funnel/FunnelResolver';

// ✅ Novo editor moderno com arquitetura limpa
const ModernQuizEditor = React.lazy(() =>
    import('@/components/editor/ModernQuizEditor').then(m => ({ default: m.ModernQuizEditor }))
);

/**
 * Componente principal da página de editor
 */
export default function EditorPage() {
    // Estado para quiz carregado
    const [quiz, setQuiz] = useState<QuizSchema | null>(null);
    const [quizId, setQuizId] = useState<string | undefined>(undefined); // 🆕 DRAFT ID
    const [funnelId, setFunnelId] = useState<string>('quiz21StepsComplete');
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Capturar parâmetros da rota
    const [, paramsWithId] = useRoute<{ funnelId: string }>('/editor/:funnelId');

    // 🆕 USAR FUNNELRESOLVER para parsear URL (memoizado para evitar loops)
    const funnelIdentifier = useMemo(() => {
        const searchParams = new URLSearchParams(window.location.search);
        return parseFunnelFromURL(searchParams);
    }, [window.location.search]);

    // Resolver funnelId final (memoizado)
    const resolvedFunnelId = useMemo(() =>
        paramsWithId?.funnelId ||
        funnelIdentifier.funnelId ||
        'quiz21StepsComplete',
        [paramsWithId?.funnelId, funnelIdentifier.funnelId]
    );

    // Atualizar estado quando resolver mudar
    useEffect(() => {
        setFunnelId(resolvedFunnelId);

        // 🔄 Padronizar URL (normalizar ?template= para ?funnel=)
        const currentParams = new URLSearchParams(window.location.search);
        const hasTemplate = currentParams.has('template');
        const hasFunnel = currentParams.has('funnel') || currentParams.has('funnelId');

        if (hasTemplate && !hasFunnel) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('template');
            newUrl.searchParams.set('funnel', resolvedFunnelId);
            window.history.replaceState({}, '', newUrl.toString());
            appLogger.info('🔄 URL padronizada: ?template= → ?funnel=', {
                funnelId: resolvedFunnelId
            });
        }
    }, [resolvedFunnelId]);

    // 🔄 Carregar funnel quando funnelId mudar
    // 🆕 USAR FUNNELSERVICE (resolve GARGALOS #1, #2, #4)
    useEffect(() => {
        let isMounted = true;

        async function loadFunnel() {
            if (!funnelId) return;

            setIsLoadingQuiz(true);
            setLoadError(null);

            try {
                appLogger.info('🎯 [EditorPage] Carregando funnel via FunnelService:', {
                    funnelId,
                    identifier: funnelIdentifier
                });

                // 🆕 USAR FUNNELSERVICE.LOADFUNNEL
                // Verifica draft no Supabase → carrega draft OU template base
                const result = await funnelService.loadFunnel(funnelIdentifier);

                if (!isMounted) return;

                const { funnel, resolved, source } = result;

                setQuiz(funnel.quiz);
                setQuizId(funnel.draftId); // 🆕 PASSAR DRAFT ID PARA EDITOR

                appLogger.info('✅ [EditorPage] Funnel carregado:', {
                    funnelId: funnel.id,
                    draftId: funnel.draftId,
                    source,
                    isDraft: resolved.isDraft,
                    templatePath: resolved.templatePath,
                    version: funnel.version,
                    steps: funnel.quiz.steps?.length || 0
                });

                console.log('📦 Funnel completo carregado:', {
                    metadata: funnel.quiz.metadata,
                    stepsCount: funnel.quiz.steps?.length,
                    allSteps: funnel.quiz.steps?.map(s => ({
                        id: s.id,
                        title: s.title,
                        blocksCount: s.blocks?.length || 0
                    })),
                    isDraft: resolved.isDraft,
                    draftId: funnel.draftId
                });
            } catch (error) {
                if (isMounted) {
                    const message = error instanceof Error ? error.message : 'Erro desconhecido';
                    appLogger.error('❌ [EditorPage] Erro ao carregar funnel:', {
                        funnelId,
                        error: message
                    });
                    setLoadError(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingQuiz(false);
                }
            }
        }

        loadFunnel();

        return () => {
            isMounted = false;
        };
    }, [funnelId, funnelIdentifier]);

    // 🆕 Handler de salvamento usando FunnelService
    const handleSave = async (savedQuiz: QuizSchema) => {
        try {
            appLogger.info('💾 [EditorPage] Salvando funnel via FunnelService:', {
                funnelId,
                quizId,
                title: savedQuiz.metadata.name
            });

            // 🆕 USAR FUNNELSERVICE.SAVEFUNNEL
            const result = await funnelService.saveFunnel(
                savedQuiz,
                funnelId,
                quizId // Passa quizId para UPDATE ou undefined para INSERT
            );

            if (!result.success) {
                throw new Error(result.error || 'Falha ao salvar funnel');
            }

            // Atualizar quizId se foi criado novo draft
            if (!quizId && result.draftId) {
                setQuizId(result.draftId);
                appLogger.info('🆕 [EditorPage] Novo draft criado:', {
                    draftId: result.draftId
                });
            }

            appLogger.info('✅ [EditorPage] Funnel salvo com sucesso:', {
                draftId: result.draftId,
                version: result.version
            });
        } catch (error) {
            appLogger.error('❌ [EditorPage] Erro ao salvar funnel:', error);
            throw error;
        }
    };

    // Handler de erro
    const handleError = (error: Error) => {
        appLogger.error('❌ Erro no editor moderno:', error);
        setLoadError(error.message);
    };

    appLogger.debug('🎯 EditorPage rendered (Modern)', {
        funnelId,
        isLoadingQuiz,
        hasQuiz: !!quiz,
        loadError,
    });

    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                appLogger.error('🔴 ModernQuizEditor crashed:', {
                    error: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                });
            }}
        >
            <Suspense fallback={<PageLoadingFallback message="Carregando editor moderno..." />}>
                {isLoadingQuiz ? (
                    <PageLoadingFallback message={`Carregando ${funnelId}...`} />
                ) : loadError ? (
                    <div className="h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center max-w-md">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Erro ao carregar quiz
                            </h2>
                            <p className="text-gray-600 mb-4">{loadError}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                ) : quiz ? (
                    <>
                        {console.log('🎯 Renderizando ModernQuizEditor com quiz:', {
                            name: quiz.metadata?.name,
                            steps: quiz.steps?.length,
                            version: quiz.version,
                            quizId // 🆕 PASSAR QUIZ ID
                        })}
                        <ModernQuizEditor
                            initialQuiz={quiz}
                            quizId={quizId} // 🆕 PASSAR QUIZ ID PARA PERSISTÊNCIA
                            onSave={handleSave}
                            onError={handleError}
                        />
                    </>
                ) : (
                    <PageLoadingFallback message="Preparando editor..." />
                )}
            </Suspense>
        </ErrorBoundary>
    );
}
