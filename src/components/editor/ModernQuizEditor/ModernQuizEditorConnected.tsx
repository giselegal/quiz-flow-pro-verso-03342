/**
 * 🌉 MODERN QUIZ EDITOR WRAPPER - CONNECTED
 * 
 * Wrapper que conecta o ModernQuizEditor ao sistema legado,
 * integrando com EditorStateProvider e outros providers.
 * 
 * Resolve GARGALO #5: Contextos Desconectados
 * 
 * ARQUITETURA:
 * ```
 * SuperUnifiedProviderV3 (Sistema Legado)
 *     ↓
 * ModernQuizEditorConnected (Bridge)
 *     ↓
 * ModernQuizEditor (Isolado)
 * ```
 * 
 * FUNCIONALIDADES:
 * - Sincronização automática via useBridgeSync
 * - Acesso a contextos legados quando necessário
 * - Modo standalone ou conectado
 * - Performance otimizada
 * 
 * USO:
 * ```tsx
 * // Em QuizAIPage.tsx ou similar
 * <SuperUnifiedProviderV3>
 *   <ModernQuizEditorConnected 
 *     initialQuiz={quiz}
 *     mode="connected"
 *   />
 * </SuperUnifiedProviderV3>
 * ```
 */

import React from 'react';
import { ModernQuizEditor, ModernQuizEditorProps } from './ModernQuizEditor';
import { useBridgeSync } from './hooks/useBridgeSync';
import { useEditorState } from '@/core/contexts/EditorContext/EditorStateProvider';
import { useFunnelData } from '@/contexts/funnel/FunnelDataProvider';
import { appLogger } from '@/lib/utils/logger';
import type { QuizSchema } from '@/schemas/quiz-schema.zod';

export interface ModernQuizEditorConnectedProps extends ModernQuizEditorProps {
    /**
     * Modo de operação:
     * - 'standalone': ModernQuizEditor isolado (padrão)
     * - 'connected': Conectado ao sistema legado via bridge
     * - 'hybrid': Usa ambos os sistemas simultaneamente
     */
    mode?: 'standalone' | 'connected' | 'hybrid';

    /**
     * Ativar sync bidirecional (experimental)
     */
    bidirectionalSync?: boolean;

    /**
     * Verbose logging para debug
     */
    debug?: boolean;
}

/**
 * Wrapper conectado do ModernQuizEditor
 */
export function ModernQuizEditorConnected({
    mode = 'standalone',
    bidirectionalSync = false,
    debug = false,
    onSave,
    ...props
}: ModernQuizEditorConnectedProps) {

    // ============================================================================
    // CONTEXTOS DO SISTEMA LEGADO
    // ============================================================================

    const editorState = mode !== 'standalone' ? useEditorState() : null;
    const funnelContext = mode !== 'standalone' ? useFunnelData() : null;

    // ============================================================================
    // BRIDGE DE SINCRONIZAÇÃO
    // ============================================================================

    const bridgeSync = useBridgeSync({
        enabled: mode === 'connected' || mode === 'hybrid',
        debounceMs: 300,
        verbose: debug,
    });

    // ============================================================================
    // HANDLERS INTEGRADOS
    // ============================================================================

    /**
     * Handler de salvamento que sincroniza com funnel se conectado
     */
    const handleSave = async (quiz: QuizSchema) => {
        try {
            if (debug) {
                appLogger.info('[ModernQuizEditorConnected] Salvando quiz', {
                    mode,
                    funnelId: funnelContext?.currentFunnel?.id,
                });
            }

            // Salvar no ModernQuizEditor
            if (onSave) {
                await onSave(quiz);
            }

            // Sincronizar com funnel do sistema legado (se conectado)
            if (mode !== 'standalone' && funnelContext?.saveFunnel) {
                if (debug) {
                    appLogger.debug('[ModernQuizEditorConnected] Sincronizando com funnel');
                }

                await funnelContext.saveFunnel();
            }

            appLogger.info('✅ [ModernQuizEditorConnected] Quiz salvo com sucesso');

        } catch (error) {
            appLogger.error('❌ [ModernQuizEditorConnected] Erro ao salvar', error);
            throw error;
        }
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <div className="modern-quiz-editor-wrapper" data-mode={mode}>
            {/* Debug Info */}
            {debug && (
                <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs space-y-1 z-50">
                    <div className="font-bold">🌉 Bridge Status</div>
                    <div>Mode: {mode}</div>
                    <div>Sync Enabled: {bridgeSync.isEnabled ? '✅' : '❌'}</div>
                    <div>Has Context: {bridgeSync.hasContext ? '✅' : '❌'}</div>
                    <div>Has Funnel: {funnelContext?.currentFunnel?.id ? '✅' : '❌'}</div>
                </div>
            )}

            {/* ModernQuizEditor */}
            <ModernQuizEditor
                {...props}
                onSave={handleSave}
            />
        </div>
    );
}

/**
 * Alias para compatibilidade com nomes anteriores
 */
export const ModernQuizEditorWrapper = ModernQuizEditorConnected;

/**
 * Hook para usar o wrapper de forma programática
 */
export function useModernQuizEditorConnected() {
    const editorState = useEditorState();
    const funnelContext = useFunnelData();

    return {
        isConnected: !!editorState && !!funnelContext,
        editorState,
        funnelContext,
    };
}
