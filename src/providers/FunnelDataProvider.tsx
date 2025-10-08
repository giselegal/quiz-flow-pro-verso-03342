/**
 * 🔗 FUNNEL DATA PROVIDER
 * 
 * Conecta a BlockPropertiesAPI aos dados reais do funil
 * - Integração com EditorProvider
 * - Integração com FunnelsContext
 * - Sincronização bidirecional
 * - Dados em tempo real
 */

import React, { useEffect } from 'react';
import { useEditor } from '@/components/editor/EditorProviderMigrationAdapter';
import { useFunnels } from '@/context/FunnelsContext';
import { blockPropertiesAPI, type FunnelDataProvider } from '@/api/internal/BlockPropertiesAPI';

function detectSupabaseEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    // Heurística: presença de objeto global ou env (injetar via build se necessário)
    const hasClient = !!(window as any).supabase;
    const hasEnv = !!(import.meta as any).env?.VITE_SUPABASE_URL;
    return hasClient || hasEnv;
}

interface FunnelDataProviderWrapperProps {
    children: React.ReactNode;
}

export const FunnelDataProviderWrapper: React.FC<FunnelDataProviderWrapperProps> = ({
    children
}) => {
    const { state, actions } = useEditor();
    const funnelsContext = useFunnels();

    // 🔍 DEBUG: Log do estado do FunnelDataProvider
    useEffect(() => {
        console.log('🔗 FunnelDataProvider - Estado inicial:', {
            editorState: {
                currentStep: state.currentStep,
                stepBlocks: Object.keys(state.stepBlocks),
                stepBlocksCounts: Object.entries(state.stepBlocks).map(([key, blocks]) => ({ [key]: (blocks as any[]).length })),
                selectedBlockId: state.selectedBlockId,
                isLoading: state.isLoading
            },
            funnelsContext: {
                hasContext: !!funnelsContext,
                currentFunnelId: funnelsContext?.currentFunnelId
            }
        });
    }, [state, funnelsContext]);

    useEffect(() => {
        // Create the funnel data provider implementation
        const funnelDataProvider: FunnelDataProvider = {
            getCurrentStep: () => {
                return state.currentStep;
            },

            getStepBlocks: (step: number) => {
                const stepKey = `step-${step}`;
                return state.stepBlocks[stepKey] || [];
            },

            getBlockById: (blockId: string) => {
                // 🌐 GENÉRICO: Procurar o bloco em TODAS as etapas disponíveis
                const allStepKeys = Object.keys(state.stepBlocks);

                for (const stepKey of allStepKeys) {
                    const stepBlocks = state.stepBlocks[stepKey];
                    const foundBlock = stepBlocks.find((block: any) => block.id === blockId);
                    if (foundBlock) {
                        console.log(`🔍 Bloco ${blockId} encontrado em ${stepKey}:`, foundBlock);
                        return foundBlock;
                    }
                }
                console.warn(`⚠️ Bloco ${blockId} não encontrado em nenhuma das ${allStepKeys.length} etapas disponíveis`);
                return null;
            },

            updateBlockProperties: (blockId: string, properties: Record<string, any>) => {
                console.log(`🔄 Atualizando propriedades do bloco ${blockId}:`, properties);

                // 🌐 GENÉRICO: Encontrar a etapa que contém o bloco (sem assumir estrutura)
                const allStepKeys = Object.keys(state.stepBlocks);

                for (const stepKey of allStepKeys) {
                    const stepBlocks = state.stepBlocks[stepKey];
                    const blockIndex = stepBlocks.findIndex((block: any) => block.id === blockId);

                    if (blockIndex !== -1) {
                        // Usar a action apropriada para atualizar
                        actions.updateBlock(stepKey, blockId, {
                            properties: {
                                ...stepBlocks[blockIndex].properties,
                                ...properties
                            }
                        });

                        console.log(`✅ Bloco ${blockId} atualizado em ${stepKey} via EditorProvider`);
                        return;
                    }
                }

                console.error(`❌ Não foi possível atualizar bloco ${blockId} - não encontrado em nenhuma das ${allStepKeys.length} etapas`);
            }, getFunnelId: () => {
                return funnelsContext?.currentFunnelId || 'local-funnel';
            },

            isSupabaseEnabled: () => detectSupabaseEnabled()
        };

        // 🔗 Connect the API to real funnel data
        blockPropertiesAPI.connectToFunnelData(funnelDataProvider);

        console.log('🔗 FunnelDataProvider conectado com sucesso!', {
            currentStep: state.currentStep,
            funnelId: funnelsContext?.currentFunnelId,
            stepsWithBlocks: Object.keys(state.stepBlocks).length,
            isSupabaseEnabled: detectSupabaseEnabled()
        });

        // Cleanup function
        return () => {
            console.log('🔌 FunnelDataProvider desconectado');
        };
    }, [
        state.currentStep,
        state.stepBlocks,
        funnelsContext?.currentFunnelId,
        actions
    ]);

    return <>{children}</>;
};

export default FunnelDataProviderWrapper;