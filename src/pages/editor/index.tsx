/**
 * 🎯 EDITOR ROUTE CONFIGURATION - Arquitetura Unificada
 * 
 * ✅ NOVA ABORDAGEM: Template = Funnel = Resource
 * Não há mais distinção artificial entre template e funnel
 * Tudo é um "EditorResource" com diferentes características
 */

import React, { Suspense, useMemo, useState, useCallback } from 'react';
const QuizModularEditor = React.lazy(() => import('@/components/editor/quiz/QuizModularEditor').then(m => ({ default: m.default })));
import { SuperUnifiedProvider, useSuperUnified } from '@/providers/SuperUnifiedProvider';
import { EditorStartupModal } from '@/components/editor/EditorStartupModal';
import { useEditorResource } from '@/hooks/useEditorResource';
import { detectResourceType } from '@/types/editor-resource';

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
        console.log('🎯 Recurso carregado:', resourceId);
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
        console.log(`🔄 Legacy param detectado: ${legacyId} (tipo: ${type})`);

        // Auto-redirect para formato novo (silencioso, sem reload)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('template');
        newUrl.searchParams.delete('funnelId');
        newUrl.searchParams.delete('funnel');
        newUrl.searchParams.delete('id');
        newUrl.searchParams.set('resource', legacyId);

        window.history.replaceState({}, '', newUrl.toString());
        console.log(`✅ URL atualizada para: ${newUrl.pathname}${newUrl.search}`);

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
        console.info('🛑 Supabase desativado por flag (VITE_DISABLE_SUPABASE). Editor operando 100% offline.');
    }

    // Detectar se deve mostrar modal na montagem inicial
    useMemo(() => {
        if (typeof window === 'undefined') return;

        // Mostrar modal apenas se não tem resource na URL
        if (!resourceId) {
            setShowStartupModal(true);
        }
    }, [resourceId]);

    const handleSelectMode = useCallback((mode: 'blank' | 'template') => {
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

    return (
        <>
            <EditorStartupModal
                open={showStartupModal}
                onSelectMode={handleSelectMode}
            />

            <SuperUnifiedProvider
                funnelId={funnelIdForProvider}
                autoLoad={Boolean(funnelIdForProvider)}
                debugMode={import.meta.env.DEV}
            >
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
        </>
    );
};// ✅ FASE 2: Botão de debug usando SuperUnified
const SaveDebugButton: React.FC = () => {
    const unified = useSuperUnified();
    const canSave = Boolean(unified.state.currentFunnel);
    if (!canSave) return null;

    const onClick = async () => {
        try {
            await unified.saveFunnel();
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={unified.state.ui.isLoading}
            style={{ position: 'fixed', top: 12, right: 12, zIndex: 50 }}
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            title="Salvar no Supabase (debug)"
        >
            {unified.state.ui.isLoading ? 'Salvando…' : 'Salvar (debug)'}
        </button>
    );
};