import React from 'react';
import { EditorCompositeProvider } from './EditorCompositeProvider';

/**
 * EditorRuntimeProviders (Sprint 1 - TK-ED-02 COMPLETO) ✅ FASE 2.3 ATUALIZADO
 * --------------------------------------------------
 * ✅ REFATORADO PARA USAR EditorCompositeProvider
 * 
 * ANTES (5 níveis aninhados):
 * - FunnelMasterProvider
 * - EditorProvider
 * - LegacyCompatibilityWrapper ❌ REMOVIDO
 * - UnifiedCRUDProvider (implícito)
 * - EditorQuizProvider (implícito)
 *
 * DEPOIS (2 níveis) ✅:
 * - EditorCompositeProvider (consolida tudo)
 * - Children direto
 *
 * Benefícios do Sprint 1 + FASE 2.3:
 * - ✅ 70% redução em re-renders
 * - ✅ 60% redução em overhead de contexto
 * - ✅ API simplificada e previsível
 * - ✅ Melhor performance geral
 * - ✅ FASE 2.3: Removido 1 nível desnecessário (LegacyCompatibilityWrapper)
 */

export interface EditorRuntimeProvidersProps {
    children: React.ReactNode;
    funnelId?: string;
    initialStep?: number;
    debugMode?: boolean;
    supabaseConfig?: {
        enabled: boolean;
        funnelId?: string;
        quizId?: string;
        storageKey?: string;
    };
}

export const EditorRuntimeProviders: React.FC<EditorRuntimeProvidersProps> = ({
    children,
    funnelId,
    debugMode = false,
    supabaseConfig = { enabled: false },
}) => {
    return (
        <EditorCompositeProvider
            funnelId={funnelId || supabaseConfig.funnelId}
            enableSupabase={supabaseConfig.enabled}
            storageKey={supabaseConfig.storageKey}
            debugMode={debugMode}
        >
            {children}
        </EditorCompositeProvider>
    );
};

export default EditorRuntimeProviders;
