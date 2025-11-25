/**
 * 🎯 EDITOR PAGE - Página Unificada do Editor
 * 
 * Página consolidada que usa a nova arquitetura core.
 * Substitui múltiplas implementações de editor (EditorV4, QuizBuilder, etc).
 * 
 * FEATURES:
 * - Usa @core/contexts para estado
 * - Lazy loading de componentes
 * - Error boundaries integrados
 * - Feature flags para rollout gradual
 * 
 * @example
 * ```typescript
 * // Rotas suportadas:
 * /editor                    → Novo editor vazio
 * /editor?template=quiz21    → Carregar template
 * /editor?funnelId=abc123    → Editar funnel existente
 * /editor/abc123             → Editar funnel por ID (alias)
 * ```
 */

import React, { Suspense } from 'react';
import { useRoute } from 'wouter';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { PageLoadingFallback } from '@/components/LoadingSpinner';
import { useFeatureFlag } from '@/core/utils/featureFlags';
import { EditorProvider } from '@/core/contexts/EditorContext';
import { appLogger } from '@/lib/utils/appLogger';

// Lazy load do editor modular (componente principal)
const QuizModularEditor = React.lazy(() =>
    import('@/components/editor/quiz/QuizModularEditor')
);

/**
 * Componente principal da página de editor
 */
export default function EditorPage() {
    // Capturar parâmetros da rota
    const [matchDirect] = useRoute('/editor');
    const [matchWithId, paramsWithId] = useRoute<{ funnelId: string }>('/editor/:funnelId');

    // Capturar query params
    const searchParams = new URLSearchParams(window.location.search);
    const templateId = searchParams.get('template') || undefined;
    const funnelIdFromQuery = searchParams.get('funnelId') || searchParams.get('funnel') || undefined;

    // Determinar funnelId (prioritário: URL params > query string)
    const funnelId = paramsWithId?.funnelId || funnelIdFromQuery;

    // Feature flag para usar editor unificado
    const useUnifiedEditor = useFeatureFlag('useUnifiedEditor');

    appLogger.info('🎯 EditorPage rendered', {
        templateId,
        funnelId,
        useUnifiedEditor,
    });

    return (
        <ErrorBoundary
            onError={(error, errorInfo) => {
                appLogger.error('🔴 Editor crashed:', {
                    error: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                });
            }}
        >
            <EditorProvider>
                <Suspense fallback={
                    <PageLoadingFallback
                        message={funnelId ? 'Carregando editor...' : 'Preparando editor...'}
                    />
                }>
                    <QuizModularEditor
                        templateId={templateId}
                        funnelId={funnelId}
                    />
                </Suspense>
            </EditorProvider>
        </ErrorBoundary>
    );
}
