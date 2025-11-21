/**
 * 🎯 EDITOR ROUTE CONFIGURATION - Arquitetura Unificada
 * 
 * ✅ NOVA ABORDAGEM: Template = Funnel = Resource
 * Não há mais distinção artificial entre template e funnel
 * Tudo é um "EditorResource" com diferentes características
 */

import React, { Suspense, useMemo, useState, useCallback, useEffect } from 'react';
const QuizModularEditor = React.lazy(() => import('@/components/editor/quiz/QuizModularEditor').then(m => ({ default: m.default })));
import { SuperUnifiedProvider } from '@/contexts/providers/SuperUnifiedProviderV2';
import { useEditorState } from '@/contexts/editor/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { UIProvider, useUI } from '@/contexts/providers/UIProvider';
import { PerformanceProvider } from '@/contexts/providers/PerformanceProvider';
import { EditorStartupModal } from '@/components/editor/EditorStartupModal';
import { useEditorResource } from '@/hooks/useEditorResource';
import { detectResourceType } from '@/types/editor-resource';
import { templateService } from '@/services/canonical/TemplateService';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * 🎯 ARQUITETURA UNIFICADA
 * 
 * Extrai resourceId da URL (query param ou path param)
 * Não diferencia entre template/funnel - tudo é "resource"
 * 
 * Suporte para:
 * - ?id=quiz21StepsComplete (legacy)
 * - ?template=quiz21StepsComplete (legacy)
 * - ?funnelId=abc-123 (legacy)
 * - ?resource=xxx (novo, recomendado)
 * - /:resourceId via router (futuro)
 */
function useResourceIdFromLocation(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);

    // Prioridade 1: Novo parâmetro unificado
    const resourceId = params.get('resource');
    if (resourceId) {
        // ✅ G1 FIX: Limpar TODOS os params legados quando resource= está presente
        const legacyParams = ['template', 'funnelId', 'funnel', 'id'];
        const hasLegacyParams = legacyParams.some(key => params.has(key));

        if (hasLegacyParams) {
            const newUrl = new URL(window.location.href);
            legacyParams.forEach(key => newUrl.searchParams.delete(key));
            window.history.replaceState({}, '', newUrl.toString());
            appLogger.info('🧹 [G1] Params legados limpos da URL');
        }

        appLogger.info('🎯 Recurso carregado:', { data: [resourceId] });
        return resourceId;
    }

    // Prioridade 2: Legacy params (backward compatibility + auto-redirect)
    const legacyId =
        params.get('template') ||
        params.get('funnelId') ||
        params.get('funnel') ||
        params.get('id');

    if (legacyId) {
        const type = detectResourceType(legacyId);
        appLogger.info(`🔄 Legacy param detectado: ${legacyId} (tipo: ${type})`);

        // Auto-redirect para formato novo (silencioso, sem reload)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('template');
        newUrl.searchParams.delete('funnelId');
        newUrl.searchParams.delete('funnel');
        newUrl.searchParams.delete('id');
        newUrl.searchParams.set('resource', legacyId);

        window.history.replaceState({}, '', newUrl.toString());
        appLogger.info(`✅ URL atualizada para: ${newUrl.pathname}${newUrl.search}`);

        return legacyId;
    }

    return undefined;
}

export const EditorRoutes: React.FC = () => (
    <EditorRoutesInner />
);

export default EditorRoutes;

const EditorRoutesInner: React.FC = () => {
    const resourceId = useResourceIdFromLocation();

    // Estado do modal de startup
    const [showStartupModal, setShowStartupModal] = useState(false);

    // Usar hook unificado para gerenciar o recurso
    // 🔌 Detectar se Supabase está desativado por flags (ambiente + localStorage)
    const supabaseDisabled = (() => {
        try {
            const envFlag = (import.meta as any)?.env?.VITE_DISABLE_SUPABASE === 'true';
            const lsFlag = (typeof window !== 'undefined') && (
                window.localStorage.getItem('VITE_DISABLE_SUPABASE') === 'true' ||
                window.localStorage.getItem('supabase:disableNetwork') === 'true'
            );
            return envFlag || lsFlag;
        } catch { return false; }
    })();

    const editorResource = useEditorResource({
        resourceId,
        autoLoad: Boolean(resourceId),
        hasSupabaseAccess: !supabaseDisabled,
    });

    if (supabaseDisabled) {
        appLogger.info('🛑 Supabase desativado por flag (VITE_DISABLE_SUPABASE). Editor operando 100% offline.');
    }

    // ✅ G4 FIX: prepareTemplate() agora é chamado APENAS em useEditorResource.loadResource()
    // Removido daqui para eliminar preparação duplicada (2/3)

    // Detectar se deve mostrar modal na montagem inicial
    useMemo(() => {
        if (typeof window === 'undefined') return;

        // Verificar se usuário já escolheu não mostrar novamente
        const dontShowAgain = localStorage.getItem('editor:skipStartupModal') === 'true';

        appLogger.info('🔍 VERIFICANDO SE DEVE MOSTRAR MODAL:');
        appLogger.info('  - resourceId:', { data: [resourceId] });
        appLogger.info('  - dontShowAgain:', { data: [dontShowAgain] });
        appLogger.info('  - Vai mostrar?', { data: [!resourceId && !dontShowAgain] });

        // Mostrar modal apenas se não tem resource na URL E usuário não escolheu pular
        if (!resourceId && !dontShowAgain) {
            appLogger.info('✅ ATIVANDO MODAL!');
            setShowStartupModal(true);
        } else {
            appLogger.info('❌ NÃO vai mostrar modal');
        }
    }, [resourceId]); const handleSelectMode = useCallback((mode: 'blank' | 'template') => {
        setShowStartupModal(false);

        if (mode === 'template') {
            // Adicionar ?resource=quiz21StepsComplete na URL
            const url = new URL(window.location.href);
            url.searchParams.set('resource', 'quiz21StepsComplete');
            window.history.pushState({}, '', url);
            window.location.reload(); // Recarregar para aplicar novo resource
        }
        // Modo blank: continuar sem resourceId
    }, []);

    // Determinar funnelId para SuperUnifiedProvider
    // Apenas passar funnelId se for realmente um funnel do Supabase
    const funnelIdForProvider =
        editorResource.resourceType === 'funnel' &&
            editorResource.resource?.source === 'supabase'
            ? resourceId
            : undefined;

    // 🆕 GARGALO #3 FIX: Converter stages → pages (OTIMIZADO)
    const initialFunnelData = React.useMemo(() => {
        const data = editorResource.resource?.data;

        // ✅ CRITICAL FIX: Fallback para modo blank (sem resourceId)
        // Garante que editor sempre tenha dados iniciais válidos
        if (!data && !resourceId) {
            return {
                id: 'blank-funnel',
                name: 'Novo Funil',
                description: 'Funil criado do zero',
                pages: Array.from({ length: 21 }, (_, i) => ({
                    id: `page-${i + 1}`,
                    funnel_id: 'blank-funnel',
                    page_type: 'quiz-step',
                    title: `Etapa ${i + 1}`,
                    page_order: i,
                    blocks: []
                }))
            };
        }

        if (!data) return undefined;

        // Se já tem pages, usar diretamente (sem clone)
        if (data.pages && Array.isArray(data.pages)) {
            return data;
        }

        // Se tem stages (templates), converter para pages (apenas se necessário)
        if (data.stages && Array.isArray(data.stages)) {
            const funnelId = data.id || resourceId || 'local';
            return {
                ...data,
                pages: data.stages.map((stage: any, index: number) => ({
                    id: stage.id || `page-${index + 1}`,
                    funnel_id: funnelId,
                    page_type: 'quiz-step',
                    title: stage.title || stage.name || `Step ${index + 1}`,
                    page_order: index,
                    blocks: stage.blocks || []
                }))
            };
        }

        return data;
    }, [editorResource.resource, resourceId]);

    // ✅ AUDIT FIX-001B: Mostrar loading enquanto template está sendo convertido
    if (editorResource.isLoading && resourceId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Carregando template...</p>
                </div>
            </div>
        );
    }

    // ✅ AUDIT FIX-001C: Mostrar erro se houver problema no carregamento
    if (editorResource.error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center max-w-md">
                    <p className="text-lg font-semibold text-destructive mb-2">Erro ao carregar template</p>
                    <p className="text-sm text-muted-foreground">{editorResource.error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <EditorStartupModal
                open={showStartupModal}
                onSelectMode={handleSelectMode}
            />

            <UIProvider>
                <PerformanceProvider>
                    <SuperUnifiedProvider>
                        {import.meta.env.DEV ? <SaveDebugButton /> : null}
                        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                            {/* ✅ Props unificadas - resourceId substitui templateId/funnelId */}
                            <QuizModularEditor
                                resourceId={resourceId}
                                editorResource={editorResource.resource}
                                isReadOnly={editorResource.isReadOnly}
                            />
                        </Suspense>
                    </SuperUnifiedProvider>
                </PerformanceProvider>
            </UIProvider>
        </>
    );
};// ✅ FASE 2: Botão de debug usando V2
const SaveDebugButton: React.FC = () => {
    const { currentFunnel } = useFunnelData();
    const { state: uiState } = useUI();
    const canSave = Boolean(currentFunnel);
    if (!canSave) return null;

    const onClick = () => {
        appLogger.info('Debug: Current funnel', { data: [currentFunnel] });
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={uiState.isLoading}
            style={{ position: 'fixed', top: 12, right: 12, zIndex: 50 }}
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            title="Salvar no Supabase (debug)"
        >
            {uiState.isLoading ? 'Salvando…' : 'Salvar (debug)'}
        </button>
    );
};