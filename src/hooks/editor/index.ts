/**
 * 📦 EDITOR HOOKS - Barrel Export
 * 
 * ⚠️ IMPORTANTE: Prefira usar o hook canônico:
 * ```typescript
 * import { useEditorCanonical } from '@/hooks/canonical';
 * ```
 * 
 * Os hooks abaixo são mantidos para compatibilidade mas devem ser migrados.
 */

// ============================================================================
// ✅ CANONICAL (RECOMENDADO)
// ============================================================================
export {
  useEditorCanonical,
  useEditor,
  useEditorOptional,
  type EditorCanonicalState,
  type EditorCanonicalActions,
  type UseEditorCanonicalResult,
} from '../canonical';

// ============================================================================
// 🔄 COMPATIBILIDADE (usar canonical quando possível)
// ============================================================================

// useEditorUnified - detecta contexto automaticamente
export { 
  useEditorUnified, 
  useEditorUnifiedOptional,
  type UseEditorUnifiedOptions 
} from './useEditorUnified';

// useEditorCore - state/actions básicas
export { useEditorCore, type EditorCoreState, type EditorCoreActions } from '../core/useEditorCore';

// ============================================================================
// ⚠️ DEPRECATED (migrar para canonical)
// ============================================================================

/**
 * @deprecated Use useEditorCanonical de @/hooks/canonical
 */
export { useEditorAdapter } from './useEditorAdapter';

// Hooks especializados (considerar migração futura)
export { useEditorActions } from './useEditorActions';
export { useEditorAutoSave } from './useEditorAutoSave';
export { useEditorBlocks } from './useEditorBlocks';
export { useEditorBootstrap } from './useEditorBootstrap';
export { useEditorDragAndDrop } from './useEditorDragAndDrop';
export { useEditorHistory } from './useEditorHistory';
export { useEditorPersistence } from './useEditorPersistence';
export { useEditorTemplates } from './useEditorTemplates';
export { useEditorTheme } from './useEditorTheme';
export { useBlockOperations } from './useBlockOperations';
export { useGlobalHotkeys } from './useGlobalHotkeys';
export { useStepBlocksLoader } from './useStepBlocksLoader';
export { useTemplateLoader } from './useTemplateLoader';
export { useTemplateValidation } from './useTemplateValidation';
