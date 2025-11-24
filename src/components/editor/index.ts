/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 * 
 * 🎯 FASE 2.0 - MIGRAÇÃO PARA SUPERUNIFIEDPROVIDER CONCLUÍDA:
 * ✅ SuperUnifiedProvider (OFFICIAL - único provider recomendado)
 * ❌ EditorProviderCanonical - REMOVIDO (migrado para SuperUnifiedProvider)
 * ❌ OptimizedEditorProvider - REMOVIDO
 * ❌ PureBuilderProvider - REMOVIDO
 */

// ============================================================================
// PROVIDER OFICIAL
// ============================================================================

// ✅ OFFICIAL - Provider único recomendado (use este!)
import {
    HeaderSection,
    UserInfoSection,
    ProgressSection,
    MainImageSection,
    ModularResultHeaderBlock,
    LazyModularResultEditor,
    LazyResponsivePreview,
} from './modules';
import { appLogger } from '@/lib/utils/appLogger';

// ⚠️ DEPRECATED - Aliases de compatibilidade (serão removidos)
/** @deprecated Use SuperUnifiedProvider from @/contexts/providers/SuperUnifiedProviderV2 */
export { SuperUnifiedProvider as EditorProviderUnified } from '@/contexts/providers/SuperUnifiedProviderV2';

/** @deprecated Use useEditor from @/hooks/useEditor */
export { useEditor as useEditorOptional } from '@/hooks/useEditor';

// ❌ REMOVIDO: EditorProviderCanonical - Use SuperUnifiedProvider

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
export { EnhancedUniversalPropertiesPanel } from '../universal';

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
    ModularResultHeaderBlock,
} from './modules';

export type {
    HeaderSectionProps,
    UserInfoSectionProps,
    ProgressSectionProps,
    MainImageSectionProps,
    ModularResultHeaderProps,
} from './modules';

// Reexport helpers para uso lazy (ex: const ModularResultEditor = React.lazy(LazyModularResultEditor))
export { LazyModularResultEditor, LazyResponsivePreview } from './modules';

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
        appLogger.info('🎯 Inicializando Universal Step Editor System...');

        // TODO: Implementar inicialização completa quando todos os módulos estiverem prontos
        return { success: true, totalSteps: 21 };

    } catch (error) {
        appLogger.error('❌ Erro ao inicializar Universal Step Editor:', { data: [error] });
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error),
        };
    }
};
