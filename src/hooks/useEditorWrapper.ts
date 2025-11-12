/**
 * ⚠️ DEPRECATED: EDITOR WRAPPER
 * 
 * @deprecated Use @/hooks/useEditor directly
 * Este arquivo será removido em versão futura.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { useEditor } from '@/hooks/useEditorWrapper';
 * 
 * // ✅ DEPOIS
 * import { useEditor } from '@/hooks/useEditor';
 * ```
 */

import { useEditor as useCanonicalEditor, useEditorOptional as useCanonicalEditorOptional } from '@/hooks/useEditor';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// WRAPPER HOOKS WITH LOGGING
// ============================================================================

/**
 * @deprecated Use @/hooks/useEditor directly
 */
export const useEditor = () => {
    if (process.env.NODE_ENV === 'development') {
        appLogger.warn('⚠️ [DEPRECATED] useEditorWrapper is deprecated. Use @/hooks/useEditor directly');
    }

    return useCanonicalEditor();
};

/**
 * @deprecated Use @/hooks/useEditor with { optional: true }
 */
export const useEditorOptional = () => {
    if (process.env.NODE_ENV === 'development') {
        appLogger.warn('⚠️ [DEPRECATED] useEditorWrapper is deprecated. Use @/hooks/useEditor directly');
    }

    return useCanonicalEditorOptional();
};

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// Para compatibilidade com EditorProvider original
// Migrado: usar tipos do hook unificado
export type { EditorContextValueMigrated as EditorContextValue } from '@/hooks/useEditor';

// Para compatibilidade com EditorProviderMigrationAdapter
export type { UnifiedEditorContext } from '@/hooks/useUnifiedEditor';

// Default export para conveniência
export default useEditor;