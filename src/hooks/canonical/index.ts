/**
 * 📦 CANONICAL HOOKS - Barrel Export
 * 
 * Hooks canônicos consolidados do projeto.
 * Use SEMPRE estes hooks em vez das versões fragmentadas.
 * 
 * @example
 * ```typescript
 * import { useEditorCanonical, useQuizCanonical } from '@/hooks/canonical';
 * ```
 */

// ============================================================================
// EDITOR - Consolida 15+ hooks useEditor*
// ============================================================================
export {
  useEditorCanonical,
  useEditor,
  useEditorOptional,
  type EditorCanonicalState,
  type EditorCanonicalActions,
  type UseEditorCanonicalResult,
  type UseEditorCanonicalOptions,
} from './useEditorCanonical';

// ============================================================================
// QUIZ - Consolida 25+ hooks useQuiz*
// ============================================================================
export {
  useQuizCanonical,
  type UseQuizCanonicalReturn,
  type QuizAnswer,
  type QuizScores,
  type QuizResult,
  type QuizUserProfile,
  type QuizCanonicalConfig,
  type QuizCanonicalState,
} from './useQuizCanonical';

// Re-export do useEditorCore original (para compatibilidade)
export { useEditorCore, type EditorCoreState, type EditorCoreActions } from '../core/useEditorCore';
