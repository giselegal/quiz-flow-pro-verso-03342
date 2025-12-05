/**
 * 🔄 EDITOR STATE PROVIDER - FACADE DE COMPATIBILIDADE
 * @deprecated Use imports de '@/core/contexts/EditorContext'
 * 
 * Este arquivo é uma facade que re-exporta do EditorContext canônico.
 * Mantido para compatibilidade com imports existentes.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { EditorStateProvider, useEditorState } from '@/contexts/editor/EditorStateProvider';
 * 
 * // ✅ DEPOIS
 * import { EditorStateProvider, useEditorState } from '@/core/contexts/EditorContext';
 * ```
 */

// Re-export everything from canonical EditorContext
export {
  EditorStateProvider,
  EditorStateProvider as EditorProvider,
  useEditorState,
  useEditor,
  type EditorState,
  type EditorContextValue,
  type ValidationError,
} from '@/core/contexts/EditorContext';

// Log deprecation warning in development
if (import.meta.env.DEV) {
  console.warn(
    '⚠️ [DEPRECATED] Import from "@/contexts/editor/EditorStateProvider" is deprecated.\n' +
    'Use: import { EditorStateProvider } from "@/core/contexts/EditorContext";'
  );
}
