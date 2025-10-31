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

/**
 * 🔧 CORREÇÃO CRÍTICA (Fase 1.1): Template não é Funnel!
 * 
 * ANTES: ?template=quiz21StepsComplete era tratado como funnelId
 * PROBLEMA: Criava "funnel fantasma" que não existe no Supabase
 * 
 * DEPOIS: Separar template mode (local) vs funnel mode (Supabase)
 */
function useFunnelIdFromLocation(): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);

    // ✅ NOVO: Template não é funnel!
    const funnelId = params.get('funnelId') || params.get('funnel');
    const templateId = params.get('template') || params.get('id');

    // Se tem template mas não tem funnelId, forçar modo local
    if (templateId && !funnelId) {
        console.log('🎨 Modo Template Ativado:', templateId, '- Trabalhando 100% local');
        return undefined; // Forçar modo local (sem Supabase)
    }

    // Se tem funnelId explícito, usar modo funnel (com Supabase)
    if (funnelId) {
        console.log('💾 Modo Funnel Ativado:', funnelId, '- Persistência no Supabase');
        return funnelId;
    }

    return undefined;
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