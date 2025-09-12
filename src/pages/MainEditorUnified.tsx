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

/**
 * 🎯 MAIN EDITOR UNIFICADO - CONSOLIDADO
 */
const MainEditorUnified: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const routeParams = useParams<{ funnelId?: string }>();

    // Capturar funnelId tanto da rota (/editor/:funnelId) quanto da query (?funnel=id)
    const templateId = params.get('template');
    const funnelId = routeParams.funnelId || params.get('funnel');
    const duplicateId = params.get('duplicate');
    const stepParam = params.get('step');
    const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;

    // Debug mode baseado em parâmetros URL
    const debugMode = params.get('debug') === 'true';

    // Configuração Supabase consolidada
    const supabaseConfig = React.useMemo(() => ({
        enabled: (import.meta as any)?.env?.VITE_ENABLE_SUPABASE === 'true',
        funnelId: funnelId || (import.meta as any)?.env?.VITE_SUPABASE_FUNNEL_ID,
        quizId: (import.meta as any)?.env?.VITE_SUPABASE_QUIZ_ID || funnelId || 'local-funnel',
        storageKey: 'main-editor-unified-state'
    }), [funnelId]);

    // Log para depuração
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

    // Determinar que ID de template usar
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
                <FunnelsProvider debug={debugMode}>
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
                                        <EditorInitializerUnified
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
            </ErrorBoundary>
        </div>
    );
};

/**
 * Editor Initializer Simplificado
 */
const EditorInitializerUnified: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
}> = ({
    templateId,
    funnelId,
    debugMode = false
}) => {
    const [UnifiedEditorComp, setUnifiedEditorComp] = React.useState<React.ComponentType | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Carregamento dinâmico do editor
    React.useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log('🔄 [EDITOR] Carregando EditorPro...');

                // Carregar EditorPro
                const mod = await import('../legacy/editor/EditorPro');
                const Comp = mod.default || mod.EditorPro;

                if (!cancelled && Comp) {
                    setUnifiedEditorComp(() => Comp);
                    console.log('✅ [EDITOR] EditorPro carregado com sucesso');
                }
            } catch (error) {
                console.error('❌ [EDITOR] Falha ao carregar EditorPro:', error);
                if (!cancelled) {
                    setError('Falha ao carregar editor. Tente recarregar a página.');
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
    }, []);

    // Loading template se fornecido
    React.useEffect(() => {
        if (templateId && templateId !== 'default') {
            try {
                const templates = templateLibraryService.listBuiltins();
                const template = templates.find(t => t.id === templateId);
                
                if (template) {
                    console.log('✅ [TEMPLATE] Template encontrado:', template.name || templateId);
                } else {
                    console.warn('⚠️ [TEMPLATE] Template não encontrado, usando padrão');
                }
            } catch (error) {
                console.error('❌ [TEMPLATE] Erro ao carregar template:', error);
            }
        }
    }, [templateId]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Erro no Editor
                        </h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
                    >
                        🔄 Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading || !UnifiedEditorComp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">
                        Carregando editor...
                    </p>
                    {debugMode && (
                        <p className="text-xs text-gray-400 mt-2 font-mono">
                            Template: {templateId || 'padrão'} | Funil: {funnelId || 'local'}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return <UnifiedEditorComp />;
};

export default MainEditorUnified;