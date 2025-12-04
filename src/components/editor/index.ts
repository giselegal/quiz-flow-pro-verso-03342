/**
 * Editor Components Index
 * Exportações centralizadas dos componentes do editor
 * 
 * 🎯 FASE 4 - MIGRAÇÃO COMPLETA PARA V4:
 * ✅ SuperUnifiedProviderV4 (OFFICIAL - único provider recomendado)
 * ❌ V2 e V3 - REMOVIDOS
 */

// ============================================================================
// PROVIDER OFICIAL
// ============================================================================

import { appLogger } from '@/lib/utils/appLogger';

// ⚠️ DEPRECATED - Aliases de compatibilidade (serão removidos)
/** @deprecated Use SuperUnifiedProviderV4 from @/contexts/providers/SuperUnifiedProviderV4 */
export { SuperUnifiedProvider as EditorProviderUnified } from '@/contexts/providers/SuperUnifiedProvider';

/** @deprecated Use useEditor from @/core/exports */
// Removido: export { useEditor as useEditorOptional } from '@/hooks/useEditor';
// Use: import { useEditor } from '@/core/exports';

// ============================================================================
// COMPONENTES ORIGINAIS
// ============================================================================

// Principais componentes do editor - APENAS OS ESSENCIAIS
// REMOVIDO: ComponentList, QuizEditorSteps - use ModernQuizEditor

// Componentes com named exports
export { AddBlockButton } from './AddBlockButton';
export { default as EditBlockContent } from './EditBlockContent';
export { StepsPanel } from './StepsPanel';

// 🎯 PAINEL DE PROPRIEDADES RECOMENDADO (use este!)
export { EnhancedUniversalPropertiesPanel } from '@/components/universal';

// ❌ DEPRECIADO: Componentes de propriedades antigos (não usar)
// Para compatibilidade apenas - use EnhancedUniversalPropertiesPanel de @/components/universal
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
