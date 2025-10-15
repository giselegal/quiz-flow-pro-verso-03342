import React from 'react';
import { useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { EditorProvider } from '../components/editor/EditorProviderMigrationAdapter';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useFunnelContext } from '@/hooks/useFunnelLoader';
import FunnelFallback from '@/components/editor/FunnelFallback';
import EditorFallback from '@/components/editor/EditorFallback';

/**
 * 🎯 MAIN EDITOR UNIFICADO - VERSÃO SIMPLIFICADA E ROBUSTA
 *
 * Editor principal com foco em estabilidade e prevenção de loading infinito:
 * - Timeout automático de 10 segundos
 * - Fallback robusto para múltiplos editores
 * - Validação de parâmetros
 * - Recovery automático de erros
 * - Logs detalhados para debug
 */
const MainEditorUnified: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const routeParams = useParams<{ funnelId?: string }>();

    // 🔧 CORREÇÃO CRÍTICA: Priorizar funis reais sobre templates
    const realFunnelId = routeParams.funnelId || params.get('funnel');
    const templateId = params.get('template');
    const debugMode = params.get('debug') === 'true';

    // Lógica de prioridade: funil real > template > novo
    const funnelId = realFunnelId || undefined; // Só usar funnelId se for real

    // Log inicial para debug
    console.log('🎯 [MAIN] MainEditorUnified iniciado:', {
        location,
        templateId,
        funnelId,
        debugMode,
        timestamp: new Date().toISOString()
    });

    // Validação de parâmetros
    const sanitizedParams = React.useMemo(() => {
        const cleanTemplateId = templateId?.trim();
        const cleanFunnelId = funnelId?.trim();

        // Validar comprimento dos parâmetros
        if (cleanTemplateId && cleanTemplateId.length > 100) {
            console.warn('⚠️ [MAIN] templateId muito longo, ignorando');
            return { templateId: undefined, funnelId: cleanFunnelId };
        }

        if (cleanFunnelId && cleanFunnelId.length > 100) {
            console.warn('⚠️ [MAIN] funnelId muito longo, ignorando');
            return { templateId: cleanTemplateId, funnelId: undefined };
        }

        return { templateId: cleanTemplateId, funnelId: cleanFunnelId };
    }, [templateId, funnelId]);

    return (
        <ErrorBoundary>
            <FunnelMasterProvider
                funnelId={sanitizedParams.funnelId}
                debugMode={debugMode}
                enableCache={true}
            >
                <EditorProvider
                    enableSupabase={!!realFunnelId} // Ativar Supabase apenas para funis reais
                    funnelId={funnelId}
                    quizId={funnelId || templateId || 'local-funnel'}
                    storageKey={`editor-unified-${funnelId || templateId || 'new'}`}
                >
                    <LegacyCompatibilityWrapper
                        enableWarnings={debugMode}
                        initialContext={FunnelContext.EDITOR}
                    >
                        {sanitizedParams.funnelId ? (
                            <FunnelValidatedEditor
                                templateId={sanitizedParams.templateId}
                                funnelId={sanitizedParams.funnelId}
                                debugMode={debugMode}
                            />
                        ) : (
                            <EditorFallback
                                templateId={sanitizedParams.templateId}
                                funnelId={sanitizedParams.funnelId}
                            />
                        )}
                    </LegacyCompatibilityWrapper>
                </EditorProvider>
            </FunnelMasterProvider>
        </ErrorBoundary>
    );
};

/**
 * 🔐 EDITOR COM VALIDAÇÃO DE FUNIL
 */
const FunnelValidatedEditor: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
}> = ({ templateId, funnelId, debugMode = false }) => {
    const funnelContext = useFunnelContext(funnelId);

    if (debugMode) {
        console.log('🔐 [VALIDATOR] Validação de funil:', {
            funnelId,
            isReady: funnelContext.isReady,
            isLoading: funnelContext.isLoading,
            isError: funnelContext.isError
        });
    }

    // Loading state
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

    // Error state
    if (funnelContext.isError) {
        return (
            <FunnelFallback
                errorType={funnelContext.errorType || 'UNKNOWN'}
                errorMessage={funnelContext.error || 'Erro desconhecido'}
                funnelId={funnelId}
                suggestions={funnelContext.suggestions}
                onRetry={funnelContext.retry}
                onCreateNew={() => {
                    window.location.href = '/admin/funis';
                }}
            />
        );
    }

    // Success - funil validado
    if (funnelContext.isReady) {
        return (
            <EditorFallback
                templateId={templateId}
                funnelId={funnelId}
            />
        );
    }

    // Fallback loading
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

export default MainEditorUnified;
