/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 */

// ============================================================================
// COMPONENTES ORIGINAIS
// ============================================================================

// Principais componentes do editor - APENAS OS ESSENCIAIS
export { default as ComponentList } from './ComponentList';
export { default as QuizEditorSteps } from './QuizEditorSteps';
// ✅ EDITORES PRINCIPAIS UNIFICADOS
/**
 * @deprecated Use o fluxo via ModernUnifiedEditor (wrapper pivot) + QuizFunnelEditor.
 * Este export será removido após remoção do legacy.
 */
export { default as EditorProUnified } from './EditorProUnified';
export { default as PureBuilderProvider } from './PureBuilderProvider';

// Componentes com named exports
export { AddBlockButton } from './AddBlockButton';
// export { ComponentsPanel } from "./ComponentsPanel";
// export { DeleteBlockButton } from "./DeleteBlockButton";
export { default as EditBlockContent } from './EditBlockContent';
// export { EditorBlockItem } from "./EditorBlockItem";
// ✅ EDITORES CONSOLIDADOS - apenas essenciais mantidos
export { StepsPanel } from './StepsPanel';

// 🎯 PAINEL DE PROPRIEDADES RECOMENDADO (use este!)
export { EnhancedUniversalPropertiesPanel } from '../universal/EnhancedUniversalPropertiesPanel';

// ❌ DEPRECIADO: Componentes de propriedades antigos (não usar)
// Para compatibilidade apenas - use EnhancedUniversalPropertiesPanel de ../universal/
export * from './properties';

// ============================================================================
// 🎯 UNIVERSAL STEP EDITOR SYSTEM - NOVO
// ============================================================================

// Componentes principais
export { default as UniversalStepEditorPro } from './universal/UniversalStepEditorPro';

// Universal Editor - Versão Original
export { default as UniversalStepEditor } from './universal/UniversalStepEditor';
export type { UniversalStepEditorProps } from './universal/UniversalStepEditor';

// Demos e exemplos (importações serão adicionadas conforme necessário)
// export { UniversalStepEditorDemo } from '../demos/UniversalStepEditorDemo';

// Integração com sistema modular existente
export {
    HeaderSection,
    UserInfoSection,
    ProgressSection,
    MainImageSection,
    ModularResultEditor,
    ModularResultHeaderBlock
} from './modules';

export type {
    HeaderSectionProps,
    UserInfoSectionProps,
    ProgressSectionProps,
    MainImageSectionProps,
    ModularResultHeaderProps
} from './modules';

// ============================================================================
// HOOKS E UTILITÁRIOS (serão adicionados conforme necessário)
// ============================================================================

// TODO: Adicionar quando hooks estiverem implementados
// export { 
//     useUniversalStepEditor,
//     useSimpleStepEditor 
// } from '../../hooks/useUniversalStepEditor';

// ============================================================================
// ADAPTADORES (serão adicionados conforme necessário)
// ============================================================================

// TODO: Adicionar quando adaptadores estiverem implementados  
// export { 
//     Quiz21StepsToFunnelAdapter,
//     quiz21StepsAdapter,
//     convertStepToFunnelFormat,
//     convertCompleteFunnel
// } from '../../adapters/Quiz21StepsToFunnelAdapter';

// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================

export const UNIVERSAL_STEP_EDITOR_CONFIG = {
    TOTAL_STEPS: 21,
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    DEBOUNCE_DELAY: 2000,      // 2 segundos
    SUPPORTED_STORAGE: ['IndexedDB', 'localStorage', 'Supabase'] as const,
    STEP_TYPES: {
        FORM: 'form',
        QUESTION: 'question',
        TRANSITION: 'transition',
        RESULT: 'result',
        CUSTOM: 'custom'
    } as const
} as const;

// ============================================================================
// FUNÇÕES DE INICIALIZAÇÃO (placeholder)
// ============================================================================

/**
 * Função de conveniência para inicializar o sistema universal
 */
export const initializeUniversalStepEditor = async () => {
    try {
        console.log('🎯 Inicializando Universal Step Editor System...');

        // TODO: Implementar inicialização completa quando todos os módulos estiverem prontos
        return { success: true, totalSteps: 21 };

    } catch (error) {
        console.error('❌ Erro ao inicializar Universal Step Editor:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
};
