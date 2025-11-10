import { appLogger } from '@/lib/utils/appLogger';
/**
 * ⚠️ DEPRECATED: useEditorState
 * 
 * @deprecated Use useSuperUnified() from @/hooks/useSuperUnified instead
 * Este hook será removido em versão futura (FASE 3).
 * 
 * RAZÃO DA DEPRECAÇÃO:
 * - Duplica 70% do estado com SuperUnifiedProvider
 * - Causa 6-8 re-renders por ação (SuperUnifiedProvider: 1-2)
 * - +28KB de bundle duplicado
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { useEditorState } from './hooks/useEditorState';
 * const editor = useEditorState();
 * 
 * // ✅ DEPOIS
 * import { useSuperUnified } from '@/hooks/useSuperUnified';
 * const unified = useSuperUnified();
 * const currentStepKey = `step-${String(unified.state.editor.currentStep).padStart(2, '0')}`;
 * ```
 * 
 * @version DEPRECATED
 * @deprecatedSince 2025-11-04
 */

// Re-export para compatibilidade temporária
export { useEditorState } from './useEditorState';

if (process.env.NODE_ENV === 'development') {
  appLogger.warn('⚠️ [DEPRECATED] useEditorState está deprecated.\n' +
        'Use useSuperUnified() ao invés.\n' +
        'Veja: src/components/editor/quiz/QuizModularEditor/hooks/useEditorState.deprecated.ts');
}
