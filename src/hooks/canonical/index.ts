/**
 * 📦 CANONICAL HOOKS - Barrel Export
 * 
 * Hooks canônicos consolidados do projeto.
 * Use SEMPRE estes hooks em vez das versões fragmentadas.
 * 
 * @example
 * ```typescript
 * import { useEditorCanonical, useEditor } from '@/hooks/canonical';
 * ```
 */

// Editor Hook Canônico
export {
  useEditorCanonical,
  useEditor,
  useEditorOptional,
  type EditorCanonicalState,
  type EditorCanonicalActions,
  type UseEditorCanonicalResult,
  type UseEditorCanonicalOptions,
} from './useEditorCanonical';

// Re-export do useEditorCore original (para compatibilidade)
export { useEditorCore, type EditorCoreState, type EditorCoreActions } from '../core/useEditorCore';
