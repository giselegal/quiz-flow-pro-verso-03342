/**
 * 🔄 TEMPORARY MIGRATION WRAPPER - FASE 4
 * 
 * Wrapper temporário para facilitar migração gradual.
 * Este arquivo será removido após migração completa.
 * 
 * FORNECE:
 * ✅ Compatibilidade com código existente
 * ✅ Logging de uso para identificar pendências
 * ✅ Redirecionamento inteligente
 * ✅ Debugging e monitoramento
 */

import { useEditor as useUnifiedEditor, useEditorOptional as useUnifiedEditorOptional } from '@/hooks/useUnifiedEditor';

// ============================================================================
// WRAPPER HOOKS WITH LOGGING
// ============================================================================

/**
 * Wrapper temporário para useEditor que adiciona logging
 */
export const useEditor = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [MIGRATION] useEditor called - consider updating to direct import from @/hooks/useUnifiedEditor');
  }
  
  return useUnifiedEditor();
};

/**
 * Wrapper temporário para useEditorOptional
 */
export const useEditorOptional = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 [MIGRATION] useEditorOptional called - consider updating to direct import from @/hooks/useUnifiedEditor');
  }
  
  return useUnifiedEditorOptional();
};

// ============================================================================
// LEGACY COMPATIBILITY EXPORTS
// ============================================================================

// Para compatibilidade com EditorProvider original
export type { EditorContextValue } from '@/components/editor/OptimizedEditorProvider';

// Para compatibilidade com EditorProviderMigrationAdapter
export type { UnifiedEditorContext } from '@/hooks/useUnifiedEditor';

// Default export para conveniência
export default useEditor;