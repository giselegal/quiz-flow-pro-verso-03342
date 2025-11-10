/**
 * 🔄 PURE BUILDER COMPATIBILITY LAYER - FASE 3
 * 
 * Hook de compatibilidade que expõe a interface do PureBuilderProvider
 * usando o SuperUnifiedProvider como fonte de dados única.
 * 
 * OBJETIVO: Migrar gradualmente componentes de PureBuilderProvider
 * para SuperUnifiedProvider sem quebrar funcionalidades.
 */

import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import { appLogger } from '@/lib/utils/appLogger';

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
                appLogger.info('🔄 usePureBuilderCompat: addBlock', { data: [{ stepKey, block }] });
            },
            updateBlock: async (stepKey: string, blockId: string, updates: any) => {
                appLogger.info('🔄 usePureBuilderCompat: updateBlock', { data: [{ stepKey, blockId, updates }] });
            },
            removeBlock: async (stepKey: string, blockId: string) => {
                appLogger.info('🔄 usePureBuilderCompat: removeBlock', { data: [{ stepKey, blockId }] });
            },
            
            // Step operations
            ensureStepLoaded: async (step: number) => {
                appLogger.info('🔄 usePureBuilderCompat: ensureStepLoaded', { data: [step] });
            },
            preloadAdjacentSteps: async (currentStep: number) => {
                appLogger.info('🔄 usePureBuilderCompat: preloadAdjacentSteps', { data: [currentStep] });
            },
            clearUnusedSteps: () => {
                appLogger.info('🔄 usePureBuilderCompat: clearUnusedSteps');
            },
            setStepValid: (step: number, isValid: boolean) => {
                appLogger.info('🔄 usePureBuilderCompat: setStepValid', { data: [{ step, isValid }] });
            },
            
            // JSON operations
            exportJSON: () => {
                return JSON.stringify(state.currentFunnel || {});
            },
            importJSON: (json: string) => {
                appLogger.info('🔄 usePureBuilderCompat: importJSON', { data: [json] });
            },
            
            // Canvas vazio
            createFirstStep: async () => {
                appLogger.info('🔄 usePureBuilderCompat: createFirstStep');
            },
            
            // Builder System specific
            calculateResults: async () => {
                appLogger.info('🔄 usePureBuilderCompat: calculateResults');
                return {};
            },
            optimizeFunnel: async () => {
                appLogger.info('🔄 usePureBuilderCompat: optimizeFunnel');
            },
            generateAnalytics: () => {
                appLogger.info('🔄 usePureBuilderCompat: generateAnalytics');
                return {};
            },
            validateFunnel: async () => {
                appLogger.info('🔄 usePureBuilderCompat: validateFunnel');
                return {};
            },
            
            // Duplication and Templates
            cloneFunnel: (newName?: string, newId?: string) => {
                appLogger.info('🔄 usePureBuilderCompat: cloneFunnel', { data: [{ newName, newId }] });
                return {};
            },
            createFromTemplate: async (templateName: string, customName?: string) => {
                appLogger.info('🔄 usePureBuilderCompat: createFromTemplate', { data: [{ templateName, customName }] });
                return {};
            },
            
            // EditorProvider compatibility
            canUndo: false,
            canRedo: false,
            undo: () => {
                appLogger.info('🔄 usePureBuilderCompat: undo');
            },
            redo: () => {
                appLogger.info('🔄 usePureBuilderCompat: redo');
            },
            addBlockAtIndex: async (stepKey: string, block: any, index: number) => {
                appLogger.info('🔄 usePureBuilderCompat: addBlockAtIndex', { data: [{ stepKey, block, index }] });
            },
            reorderBlocks: async (stepKey: string, oldIndex: number, newIndex: number) => {
                appLogger.info('🔄 usePureBuilderCompat: reorderBlocks', { data: [{ stepKey, oldIndex, newIndex }] });
            },
            loadDefaultTemplate: () => {
                appLogger.info('🔄 usePureBuilderCompat: loadDefaultTemplate');
            },
        },
    };
};

// Alias para compatibilidade total
export const usePureBuilder = usePureBuilderCompat;

export default usePureBuilderCompat;
