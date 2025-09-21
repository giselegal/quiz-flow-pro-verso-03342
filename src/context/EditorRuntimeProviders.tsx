import React from 'react';
import { UnifiedFunnelProvider } from './UnifiedFunnelContext';
import { FunnelsProvider } from './FunnelsContext';
import { EditorProvider } from '@/components/editor/EditorProvider';
import { LegacyCompatibilityWrapper } from '@/core/contexts/LegacyCompatibilityWrapper';
import { FunnelContext } from '@/core/contexts/FunnelContext';
import { EditorQuizProvider } from './EditorQuizContext';
import { Quiz21StepsProvider } from '@/components/quiz/Quiz21StepsProvider';
import { QuizFlowProvider } from './QuizFlowProvider';

/**
 * EditorRuntimeProviders (Fase 1)
 * --------------------------------------------------
 * Objetivo imediato: encapsular a "árvore de providers" atual em um único
 * componente para facilitar refatorações incrementais e futura redução
 * de profundidade.
 *
 * Roadmap de redução (próximas fases — documentado em docs/EDITOR_PROVIDERS_REFACTOR_PROPOSAL.md):
 *  - Fase 2: Unificar QuizFlowProvider + Quiz21StepsProvider -> CombinedQuizStepsProvider
 *  - Fase 3: Migrar EditorProvider (legacy) para API do UnifiedContextProvider
 *  - Fase 4: Eliminar LegacyCompatibilityWrapper (somente polyfill fino)
 *  - Fase 5: Substituir FunnelsProvider (legacy) por ponte direto para UnifiedFunnelProvider
 */

export interface EditorRuntimeProvidersProps {
    children: React.ReactNode;
    funnelId?: string;
    initialStep?: number;
    totalSteps?: number; // ✅ NOVO: Aceitar totalSteps dinâmico
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
    totalSteps = 21, // ✅ NOVO: Default 21 para compatibilidade, mas aceita dinâmico
    debugMode = false,
    supabaseConfig = { enabled: false },
}) => {
    return (
        <UnifiedFunnelProvider funnelId={funnelId} debugMode={debugMode}>
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
                        {/* Fase 1 mantém providers separadas - comentários indicam fusões futuras */}
                        <EditorQuizProvider>
                            <Quiz21StepsProvider debug={debugMode} initialStep={initialStep}>
                                <QuizFlowProvider initialStep={initialStep} totalSteps={totalSteps}>
                                    {children}
                                </QuizFlowProvider>
                            </Quiz21StepsProvider>
                        </EditorQuizProvider>
                    </LegacyCompatibilityWrapper>
                </EditorProvider>
            </FunnelsProvider>
        </UnifiedFunnelProvider>
    );
};

export default EditorRuntimeProviders;
