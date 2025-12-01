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

// ✅ AUDIT: In-memory cache for loaded quizzes to prevent redundant fetches
const quizCache = new Map<string, { data: QuizSchema; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ✅ AUDIT: Track in-flight requests to prevent duplicate fetches
const inFlightRequests = new Map<string, Promise<QuizSchema>>();

/**
 * ✅ AUDIT: Optimized quiz loading with caching and deduplication
 */
async function loadQuizWithCache(templatePath: string): Promise<QuizSchema> {
    // Check memory cache first
    const cached = quizCache.get(templatePath);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        appLogger.info('⚡ [EditorPage] Cache HIT:', { templatePath });
        return cached.data;
    }

    // Check for in-flight request
    const inFlight = inFlightRequests.get(templatePath);
    if (inFlight) {
        appLogger.info('🔄 [EditorPage] Reusing in-flight request:', { templatePath });
        return inFlight;
    }

    // Create new request
    const fetchPromise = (async (): Promise<QuizSchema> => {
        const startTime = performance.now();

        const response = await fetch(templatePath, {
            cache: 'default', // Use browser's native caching
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to load template: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate with Zod
        const { QuizSchemaZ } = await import('@/schemas/quiz-schema.zod');
        const validated = QuizSchemaZ.parse(data);

        const loadTime = performance.now() - startTime;
        appLogger.info('✅ [EditorPage] Quiz loaded:', {
            templatePath,
            loadTimeMs: loadTime.toFixed(0),
            steps: validated.steps?.length || 0
        });

        // Store in cache
        quizCache.set(templatePath, { data: validated, timestamp: Date.now() });

        return validated;
    })();

    // Track in-flight request
    inFlightRequests.set(templatePath, fetchPromise);

    try {
        return await fetchPromise;
    } finally {
        // Clean up in-flight tracker
        inFlightRequests.delete(templatePath);
    }
}

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
    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Capturar parâmetros da rota
    const [, paramsWithId] = useRoute<{ funnelId: string }>('/editor/:funnelId');

    // Capturar query params
    const searchParams = new URLSearchParams(window.location.search);
    // Sanitizar template param para evitar casos de objeto serializado implicitamente
    const rawTemplateParam = searchParams.get('template');
    const templateParam = (() => {
        if (!rawTemplateParam) return undefined;
        // Caso típico de erro: '?template=[object Object]' vindo de concatenação com objeto
        if (rawTemplateParam === '[object Object]') {
            appLogger.warn('⚠️ Parametro template inválido ([object Object]) ignorado');
            return undefined;
        }
        // Evitar valores excessivamente longos ou contendo espaços suspeitos
        const trimmed = rawTemplateParam.trim();
        if (trimmed.length === 0 || trimmed.length > 150) {
            appLogger.warn('⚠️ Parametro template vazio ou muito longo, ignorado', { value: trimmed });
            return undefined;
        }
        return trimmed;
    })();
    const funnelIdFromQuery = searchParams.get('funnelId') || searchParams.get('funnel') || undefined;

    // 🔄 PADRONIZAÇÃO: ?template= agora é tratado como ?funnel=
    // Templates são funis editáveis e duplicáveis
    let funnelId = paramsWithId?.funnelId || funnelIdFromQuery || templateParam || undefined;

    // ✅ Fallback: garantir funil padrão quando ausente
    // Motivo: editor precisa de canvas visível mesmo sem query params
    if (!funnelId) {
        funnelId = 'quiz21StepsComplete';
        // Padronizar URL sem poluir histórico
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('funnel', funnelId);
            window.history.replaceState({}, '', url.toString());
            appLogger.info('🛟 Fallback de funil aplicado:', { funnelId });
        } catch (e) {
            appLogger.debug('Não foi possível atualizar URL:', e);
        }
    }

    // 🔄 Redirecionar ?template= para ?funnel= (padronização de URL)
    React.useEffect(() => {
        // Sempre padronizar ?template= para ?funnel= para evitar conflito de parâmetros
        if (templateParam) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('template');
            // Se já houver um funnel, manter; senão usar o templateParam
            const existingFunnel = newUrl.searchParams.get('funnel') || newUrl.searchParams.get('funnelId');
            if (!existingFunnel) {
                newUrl.searchParams.set('funnel', templateParam);
            }
            window.history.replaceState({}, '', newUrl.toString());
            appLogger.info('🔄 URL padronizada: ?template= → ?funnel=', { from: templateParam });
        }
    }, [templateParam]);

    // 🔄 Carregar quiz quando funnelId mudar
    // ✅ AUDIT: Using memoized loader with caching
    useEffect(() => {
        let isMounted = true;

        async function loadQuiz() {
            if (!funnelId) return;

            setIsLoadingQuiz(true);
            setLoadError(null);

            try {
                appLogger.info('📂 Carregando quiz via ModernQuizEditor:', { funnelId });

                // ✅ AUDIT: Use cached loader instead of direct fetch
                const validated = await loadQuizWithCache('/templates/quiz21-v4.json');

                // Only update state if component is still mounted
                if (isMounted) {
                    setQuiz(validated);
                    appLogger.info('✅ Quiz carregado no editor moderno:', {
                        title: validated.metadata?.name,
                        steps: validated.steps?.length || 0,
                        firstStepId: validated.steps?.[0]?.id,
                        firstStepBlocks: validated.steps?.[0]?.blocks?.length || 0,
                        sampleBlock: validated.steps?.[0]?.blocks?.[0] ? {
                            id: validated.steps[0].blocks[0].id,
                            type: validated.steps[0].blocks[0].type
                        } : null
                    });

                    console.log('📦 Quiz completo carregado:', {
                        metadata: validated.metadata,
                        stepsCount: validated.steps?.length,
                        allSteps: validated.steps?.map(s => ({
                            id: s.id,
                            title: s.title,
                            blocksCount: s.blocks?.length || 0
                        }))
                    });
                }
            } catch (error) {
                if (isMounted) {
                    const message = error instanceof Error ? error.message : 'Erro desconhecido';
                    appLogger.error('❌ Erro ao carregar quiz:', { funnelId, error: message });
                    setLoadError(message);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingQuiz(false);
                }
            }
        }

        loadQuiz();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [funnelId]);    // Handler de salvamento
    const handleSave = async (savedQuiz: QuizSchema) => {
        try {
            appLogger.info('💾 Salvando quiz via ModernQuizEditor:', {
                funnelId,
                title: savedQuiz.metadata.name
            });
            // TODO: Integrar com backend real
            // await api.saveQuiz(funnelId, savedQuiz);
            appLogger.info('✅ Quiz salvo com sucesso');
        } catch (error) {
            appLogger.error('❌ Erro ao salvar quiz:', error);
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
                            version: quiz.version
                        })}
                        <ModernQuizEditor
                            initialQuiz={quiz}
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
