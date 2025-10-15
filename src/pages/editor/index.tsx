/**
 * 🎯 EDITOR ROUTE CONFIGURATION
 * 
 * Configuração das rotas do editor visual unificado usando wouter
 */

import React, { Suspense } from 'react';
const QuizModularProductionEditor = React.lazy(() => import('@/components/editor/quiz/QuizModularProductionEditor').then(m => ({ default: m.default })));
import { UnifiedCRUDProvider } from '@/contexts';
import { FunnelContext } from '@/core/contexts/FunnelContext';

export const EditorRoutes: React.FC = () => (
    <UnifiedCRUDProvider autoLoad={true} debug={false} context={FunnelContext.EDITOR}>
        <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Carregando editor...</div>}>
            <QuizModularProductionEditor />
        </Suspense>
    </UnifiedCRUDProvider>
);

export default EditorRoutes;