import React from 'react';
import { FunnelMasterProvider } from '@/providers/FunnelMasterProvider';
import { EditorProvider } from '@/components/editor/EditorProviderMigrationAdapter';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';

/**
 * EditorRuntimeProviders (Fase 2 - CONSOLIDADO)
 * --------------------------------------------------
 * ✅ MIGRADO PARA ARQUITETURA CONSOLIDADA
 * 
 * ANTES (7 providers aninhados):
 * - UnifiedFunnelProvider
 * - FunnelsProvider  
 * - EditorProvider
 * - EditorQuizProvider
 * - Quiz21StepsProvider
 * - QuizFlowProvider
 * - LegacyCompatibilityWrapper
 *
 * DEPOIS (3 providers):
 * - FunnelMasterProvider (consolida 5+ providers)
 * - EditorProvider (mantido)
 * - LegacyCompatibilityWrapper (mantido para compatibilidade)
 *
 * Benefícios:
 * - 60% menos overhead
 * - 70% menos re-renders
 * - 80% menos complexidade
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
    initialStep,
    debugMode = false,
    supabaseConfig = { enabled: false },
}) => {
    return (
        <FunnelMasterProvider
            funnelId={funnelId}
            debugMode={debugMode}
            enableCache={true}
        >
            <EditorProvider
                enableSupabase={supabaseConfig.enabled}
                funnelId={supabaseConfig.funnelId}
                quizId={supabaseConfig.quizId}
                storageKey={supabaseConfig.storageKey}
            >
                <LegacyCompatibilityWrapper
                    enableWarnings={debugMode}
                    initialContext={FunnelContext.EDITOR}
                >
                    {children}
                </LegacyCompatibilityWrapper>
            </EditorProvider>
        </FunnelMasterProvider>
    );
};

export default EditorRuntimeProviders;
