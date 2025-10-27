/**
 * 🎯 EDITOR ROUTE CONFIGURATION
 * 
 * Configuração das rotas do editor visual unificado usando wouter
 */

import React, { Suspense, useMemo } from 'react';
const QuizModularProductionEditor = React.lazy(() => import('@/components/editor/quiz/QuizModularProductionEditor').then(m => ({ default: m.default })));
import { UnifiedCRUDProvider } from '@/contexts';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import EditorProviderUnified, { useEditor } from '@/components/editor/EditorProviderUnified';

function useFunnelIdFromLocation(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    // Prioridade: funnelId → funnel → template → id
    return (
        params.get('funnelId') ||
        params.get('funnel') ||
        params.get('template') ||
        params.get('id') ||
        undefined
    ) || undefined;
}

export const EditorRoutes: React.FC = () => (
    <UnifiedCRUDProvider autoLoad={true} debug={false} context={FunnelContext.EDITOR}>
        <EditorRoutesInner />
    </UnifiedCRUDProvider>
);

export default EditorRoutes;

const EditorRoutesInner: React.FC = () => {
    const funnelId = useFunnelIdFromLocation();
    const enableSupabase = useMemo(() => Boolean(funnelId), [funnelId]);

    return (
        <EditorProviderUnified funnelId={funnelId} enableSupabase={enableSupabase}>
            {import.meta.env.DEV ? <SaveDebugButton /> : null}
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                <QuizModularProductionEditor />
            </Suspense>
        </EditorProviderUnified>
    );
};

// Botão de debug para salvar manualmente no Supabase durante desenvolvimento
const SaveDebugButton: React.FC = () => {
    const editor = useEditor();
    const canSave = Boolean(editor.actions.saveToSupabase);
    if (!canSave) return null;

    const onClick = () => editor.actions.saveToSupabase?.();

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={editor.state.isLoading}
            style={{ position: 'fixed', top: 12, right: 12, zIndex: 50 }}
            className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60"
            title="Salvar no Supabase (debug)"
        >
            {editor.state.isLoading ? 'Salvando…' : 'Salvar (debug)'}
        </button>
    );
};