/**
 * 🔄 PURE BUILDER COMPATIBILITY LAYER - FASE 3
 * 
 * Hook de compatibilidade que expõe a interface do PureBuilderProvider
 * usando o SuperUnifiedProvider como fonte de dados única.
 * 
 * OBJETIVO: Migrar gradualmente componentes de PureBuilderProvider
 * para SuperUnifiedProvider sem quebrar funcionalidades.
 */

import { useSuperUnified } from '@/providers/SuperUnifiedProvider';

export const usePureBuilderCompat = () => {
    const {
        state,
        setCurrentStep,
        setSelectedBlock,
        saveFunnel,
    } = useSuperUnified();

    // Adaptar estado do SuperUnified para interface do PureBuilder
    return {
        // Estado compatível com PureBuilder
        state: {
            currentStep: state.editor.currentStep,
            selectedBlockId: state.editor.selectedBlockId,
            isPreviewMode: state.editor.isPreviewMode,
            stepBlocks: {}, // TODO: mapear de state.currentFunnel.pages
            totalSteps: 21, // Valor fixo por enquanto
            funnelSettings: state.currentFunnel?.settings || {},
            validationErrors: [],
            isDirty: false,
            isLoading: state.ui.isLoading,
            loadedSteps: new Set<number>(),
            templateInfo: null,
            templateLoading: false,
            builderInstance: null,
            funnelConfig: null,
            calculationEngine: null,
            analyticsData: {},
            isSupabaseEnabled: false,
            databaseMode: 'local' as const,
        },

        // Actions compatíveis com PureBuilder
        actions: {
            setCurrentStep,
            setSelectedBlockId: setSelectedBlock,
            
            // Block operations (placeholder)
            addBlock: async (stepKey: string, block: any) => {
                console.log('🔄 usePureBuilderCompat: addBlock', { stepKey, block });
            },
            updateBlock: async (stepKey: string, blockId: string, updates: any) => {
                console.log('🔄 usePureBuilderCompat: updateBlock', { stepKey, blockId, updates });
            },
            removeBlock: async (stepKey: string, blockId: string) => {
                console.log('🔄 usePureBuilderCompat: removeBlock', { stepKey, blockId });
            },
            
            // Step operations
            ensureStepLoaded: async (step: number) => {
                console.log('🔄 usePureBuilderCompat: ensureStepLoaded', step);
            },
            preloadAdjacentSteps: async (currentStep: number) => {
                console.log('🔄 usePureBuilderCompat: preloadAdjacentSteps', currentStep);
            },
            clearUnusedSteps: () => {
                console.log('🔄 usePureBuilderCompat: clearUnusedSteps');
            },
            setStepValid: (step: number, isValid: boolean) => {
                console.log('🔄 usePureBuilderCompat: setStepValid', { step, isValid });
            },
            
            // JSON operations
            exportJSON: () => {
                return JSON.stringify(state.currentFunnel || {});
            },
            importJSON: (json: string) => {
                console.log('🔄 usePureBuilderCompat: importJSON', json);
            },
            
            // Canvas vazio
            createFirstStep: async () => {
                console.log('🔄 usePureBuilderCompat: createFirstStep');
            },
            
            // Builder System specific
            calculateResults: async () => {
                console.log('🔄 usePureBuilderCompat: calculateResults');
                return {};
            },
            optimizeFunnel: async () => {
                console.log('🔄 usePureBuilderCompat: optimizeFunnel');
            },
            generateAnalytics: () => {
                console.log('🔄 usePureBuilderCompat: generateAnalytics');
                return {};
            },
            validateFunnel: async () => {
                console.log('🔄 usePureBuilderCompat: validateFunnel');
                return {};
            },
            
            // Duplication and Templates
            cloneFunnel: (newName?: string, newId?: string) => {
                console.log('🔄 usePureBuilderCompat: cloneFunnel', { newName, newId });
                return {};
            },
            createFromTemplate: async (templateName: string, customName?: string) => {
                console.log('🔄 usePureBuilderCompat: createFromTemplate', { templateName, customName });
                return {};
            },
            
            // EditorProvider compatibility
            canUndo: false,
            canRedo: false,
            undo: () => {
                console.log('🔄 usePureBuilderCompat: undo');
            },
            redo: () => {
                console.log('🔄 usePureBuilderCompat: redo');
            },
            addBlockAtIndex: async (stepKey: string, block: any, index: number) => {
                console.log('🔄 usePureBuilderCompat: addBlockAtIndex', { stepKey, block, index });
            },
            reorderBlocks: async (stepKey: string, oldIndex: number, newIndex: number) => {
                console.log('🔄 usePureBuilderCompat: reorderBlocks', { stepKey, oldIndex, newIndex });
            },
            loadDefaultTemplate: () => {
                console.log('🔄 usePureBuilderCompat: loadDefaultTemplate');
            }
        }
    };
};

// Alias para compatibilidade total
export const usePureBuilder = usePureBuilderCompat;

export default usePureBuilderCompat;
