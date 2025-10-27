/**
 * 🎯 EDITOR ROUTE CONFIGURATION
 * 
 * Configuração das rotas do editor visual unificado usando wouter
 */

import React, { Suspense, useMemo } from 'react';
const QuizModularProductionEditor = React.lazy(() => import('@/components/editor/quiz/QuizModularProductionEditor').then(m => ({ default: m.default })));
import { UnifiedCRUDProvider } from '@/contexts';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import EditorProviderUnified from '@/components/editor/EditorProviderUnified';

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
            <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
                <QuizModularProductionEditor />
            </Suspense>
        </EditorProviderUnified>
    );
};