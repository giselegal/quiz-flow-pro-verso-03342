/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 * 
 * 🎯 FASE 5 - ARQUITETURA LIMPA (DEPRECATED REMOVIDO):
 * ✅ EditorProviderUnified (único provider recomendado)
 * ✅ useEditor unificado (@/hooks/useUnifiedEditor)
 * ❌ OptimizedEditorProvider - REMOVIDO (usar EditorProviderUnified)
 * ❌ PureBuilderProvider - REMOVIDO (usar EditorProviderUnified)
 */

// ============================================================================
// FASE 5 - PROVIDER ÚNICO CANÔNICO
// ============================================================================

// ✅ Provider único recomendado (use este!)
export {
    EditorProviderUnified,
    EditorProviderUnified as EditorProvider,
    useEditor,
    useEditorOptional
} from './EditorProviderUnified';

// 🧩 Provider canônico (alias explícito)
export { EditorProviderCanonical } from './EditorProviderCanonical';

// Alias para compatibilidade
export { useEditorOptional as useUnifiedEditorOptional } from './EditorProviderUnified';

// Adapter para migração (mantido temporariamente)
export { MigrationEditorProvider } from './EditorProviderMigrationAdapter';

// 🆕 FASE 3: Compatibility hooks
export { usePureBuilder, usePureBuilderCompat } from '@/hooks/usePureBuilderCompat';

// ============================================================================
// COMPONENTES ORIGINAIS
// ============================================================================

// Principais componentes do editor - APENAS OS ESSENCIAIS
export { default as ComponentList } from './ComponentList';
export { default as QuizEditorSteps } from './QuizEditorSteps';

// Componentes com named exports
export { AddBlockButton } from './AddBlockButton';
export { default as EditBlockContent } from './EditBlockContent';
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

// Integração com sistema modular existente
export {
    HeaderSection,
    UserInfoSection,
    ProgressSection,
    MainImageSection,
    ModularResultEditor,
    ModularResultHeaderBlock,
} from './modules';

export type {
    HeaderSectionProps,
    UserInfoSectionProps,
    ProgressSectionProps,
    MainImageSectionProps,
    ModularResultHeaderProps,
} from './modules';

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
        CUSTOM: 'custom',
    } as const,
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
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
