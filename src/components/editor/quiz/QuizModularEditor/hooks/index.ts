/**
 * 🎯 FASE 3.1 - Hooks do QuizModularEditor
 * 
 * Exportação centralizada de todos os hooks customizados
 * Extraídos do componente principal para reduzir complexidade
 * 
 * HOOKS DISPONÍVEIS:
 * - useStepNavigation: Navegação entre steps
 * - useAutoSave: Auto-save com debounce
 * - useEditorMode: Modos de visualização e layout
 * - useEditorState: Estado global do editor (já existente)
 * - useBlockOperations: Operações com blocos (já existente)
 * - useDndSystem: Sistema de drag and drop (já existente)
 * - useEditorPersistence: Persistência de dados (já existente)
 * 
 * @phase FASE 3.1 - Refatoração QuizModularEditor
 */

// ============================================================================
// NOVOS HOOKS - FASE 3.1
// ============================================================================

export {
  useStepNavigation,
  type UseStepNavigationOptions,
  type UseStepNavigationReturn,
} from './useStepNavigation';

export {
  useAutoSave,
  type UseAutoSaveOptions,
  type UseAutoSaveReturn,
} from './useAutoSave';

export {
  useEditorMode,
  type UseEditorModeOptions,
  type UseEditorModeReturn,
  type PreviewMode,
  type EditMode,
  type VisualizationMode,
} from './useEditorMode';

// ============================================================================
// HOOKS EXISTENTES
// ============================================================================

export { useEditorState } from './useEditorState';
export { useBlockOperations } from './useBlockOperations';
export { useDndSystem } from './useDndSystem';
export { useEditorPersistence } from './useEditorPersistence';
