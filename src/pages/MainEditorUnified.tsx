import { QuizFlowProvider } from '@/context/QuizFlowProvider';
import { templateLibraryService } from '@/services/templateLibraryService';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import React from 'react';
import { useLocation } from 'wouter';
import { ErrorBoundary } from '../components/editor/ErrorBoundary';
import { FunnelsProvider } from '@/context/FunnelsContext';
import { EditorQuizProvider } from '@/context/EditorQuizContext';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';

/**
 * 🎯 MAIN EDITOR UNIFICADO
 *
 * Editor principal usando UnifiedContextProvider para gerenciamento de estado centralizado.
 * Mantém compatibilidade com componentes legacy através do LegacyCompatibilityWrapper.
 * 
 * Features:
 * - Context unificado via UnifiedContextProvider
 * - Migração gradual com compatibilidade legacy
 * - Template loading integrado
 * - Estado persistente e contextual
 * - Performance otimizada
 */
const MainEditorUnified: React.FC = () => {
    const [location] = useLocation();
    const params = React.useMemo(() => new URLSearchParams(location.split('?')[1] || ''), [location]);
    const templateId = params.get('template');
    const funnelId = params.get('funnel');
    const stepParam = params.get('step');
    const initialStep = stepParam ? Math.max(1, Math.min(21, parseInt(stepParam))) : undefined;

    // Debug mode baseado em parâmetros
    const debugMode = params.get('debug') === 'true';

    return (
        <div>
            <ErrorBoundary>
                <FunnelsProvider debug={debugMode}>
                    {/* 🎯 UNIFIED CONTEXT PROVIDER - substitui EditorProvider */}
                    <LegacyCompatibilityWrapper
                        enableWarnings={debugMode}
                        initialContext={FunnelContext.EDITOR}
                    >
                        <EditorQuizProvider>
                            <Quiz21StepsProvider debug={debugMode} initialStep={initialStep}>
                                <QuizFlowProvider initialStep={initialStep} totalSteps={21}>
                                    <EditorInitializerUnified
                                        templateId={templateId || undefined}
                                        funnelId={funnelId || undefined}
                                        debugMode={debugMode}
                                    />
                                </QuizFlowProvider>
                            </Quiz21StepsProvider>
                        </EditorQuizProvider>
                    </LegacyCompatibilityWrapper>
                </FunnelsProvider>
            </ErrorBoundary>
        </div>
    );
};

const EditorInitializerUnified: React.FC<{
    templateId?: string;
    funnelId?: string;
    debugMode?: boolean;
}> = ({
    templateId,
    funnelId,
    debugMode = false,
}) => {
        const [UnifiedEditorComp, setUnifiedEditorComp] = React.useState<React.ComponentType | null>(null);

        // Carregamento dinâmico do editor
        React.useEffect(() => {
            let cancelled = false;
            (async () => {
                try {
                    const mod = await import('../components/editor/UnifiedEditor');
                    const Comp = mod.default || mod.UnifiedEditor;
                    if (!cancelled && Comp) {
                        setUnifiedEditorComp(() => Comp);
                        if (debugMode) {
                            console.log('✅ UnifiedEditor carregado com sucesso');
                        }
                    }
                } catch (e) {
                    console.error('❌ Falha ao carregar UnifiedEditor:', e);
                    // Fallback para EditorPro legacy
                    try {
                        const legacyMod = await import('../legacy/editor/EditorPro');
                        const LegacyComp = legacyMod.default || legacyMod.EditorPro;
                        if (!cancelled && LegacyComp) {
                            setUnifiedEditorComp(() => LegacyComp);
                            console.warn('⚠️ Usando fallback EditorPro legacy');
                        }
                    } catch (legacyError) {
                        console.error('❌ Falha ao carregar fallback EditorPro:', legacyError);
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }, [debugMode]);

        // Template loading integrado
        React.useEffect(() => {
            if (!UnifiedEditorComp || !templateId) return;

            try {
                const tpl = templateLibraryService.getById(templateId);
                if (!tpl) {
                    if (debugMode) {
                        console.warn(`⚠️ Template ${templateId} não encontrado`);
                    }
                    return;
                }

                const stepBlocks: any = {};
                // União das chaves: garantir que TODAS as etapas canônicas existam
                const canonicalKeys = Object.keys(QUIZ_STYLE_21_STEPS_TEMPLATE);
                const chosenKeys = Object.keys((tpl as any).steps || {});
                const allKeys = Array.from(new Set([...canonicalKeys, ...chosenKeys]));

                allKeys.forEach((k: string) => {
                    const arr = (tpl as any).steps?.[k];
                    // Fallback: se o template selecionado não trouxe blocos para a etapa,
                    // usar os blocos canônicos do QUIZ_STYLE_21_STEPS_TEMPLATE
                    const fallbackBlocks = (QUIZ_STYLE_21_STEPS_TEMPLATE as any)[k] || [];
                    const sourceArr = (Array.isArray(arr) && arr.length > 0) ? arr : fallbackBlocks;

                    stepBlocks[k] = (sourceArr || []).map((b: any, idx: number) => ({
                        id: b.id || `${k}-${b.type}-${idx}`,
                        type: b.type,
                        order: typeof b.order === 'number' ? b.order : idx,
                        properties: b.properties || {},
                        // CORREÇÃO: usar conteúdo correto (b.content) para preservar options, etc.
                        content: b.content || {},
                    }));
                });

                // Carregar template via evento para compatibilidade
                window.dispatchEvent(new CustomEvent('editor-load-template', {
                    detail: { stepBlocks, templateId, funnelId }
                }));

                if (debugMode) {
                    console.log(`✅ Template ${templateId} carregado:`, {
                        totalSteps: allKeys.length,
                        totalBlocks: Object.values(stepBlocks).flat().length
                    });
                }
            } catch (e) {
                console.warn('❌ Falha ao aplicar template:', e);
            }
        }, [UnifiedEditorComp, templateId, funnelId, debugMode]);

        if (!UnifiedEditorComp) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando editor unificado...</p>
                        {debugMode && (
                            <p className="text-xs text-gray-500 mt-2">
                                Debug mode ativo - UnifiedContextProvider
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        const UnifiedEditor = UnifiedEditorComp as React.ComponentType;
        return <UnifiedEditor />;
    };

export default MainEditorUnified;
