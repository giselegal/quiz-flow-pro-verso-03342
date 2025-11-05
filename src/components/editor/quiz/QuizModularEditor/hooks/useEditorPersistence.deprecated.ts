/**
 * ⚠️ DEPRECATED: useEditorPersistence
 * 
 * @deprecated Use useSuperUnified() from @/hooks/useSuperUnified instead
 * Este hook será removido em versão futura (FASE 3).
 * 
 * RAZÃO DA DEPRECAÇÃO:
 * - SuperUnifiedProvider gerencia persistência automaticamente
 * - Auto-save integrado com debounce inteligente
 * - Cache unificado
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { useEditorPersistence } from './hooks/useEditorPersistence';
 * const persistence = useEditorPersistence({ enableAutoSave: true });
 * 
 * // ✅ DEPOIS
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * const unified = useSuperUnified();
 * // Auto-save já está ativo no SuperUnifiedProvider
 * await unified.saveFunnel();
 * ```
 * 
 * @version DEPRECATED
 * @deprecatedSince 2025-11-04
 */

// Re-export para compatibilidade temporária
export { useEditorPersistence } from './useEditorPersistence';

if (process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ [DEPRECATED] useEditorPersistence está deprecated.\n' +
    'Use useSuperUnified() ao invés.\n' +
    'Veja: src/components/editor/quiz/QuizModularEditor/hooks/useEditorPersistence.deprecated.ts'
  );
}
