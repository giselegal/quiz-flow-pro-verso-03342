/**
 * 🔄 COMPATIBILITY LAYER - useUnifiedEditor
 * 
 * Re-export do useEditor consolidado.
 * Mantém compatibilidade com código que importa de '@/hooks/useUnifiedEditor'
 */

export { 
  useEditor,
  useEditor as useUnifiedEditor,
  useEditorOptional,
  useEditorOptional as useUnifiedEditorOptional,
  useEditorBlocks,
  useCurrentStep,
  default
} from './useEditor';

export type {
  EditorActions,
  EditorState,
  EditorContextValueMigrated
} from './useEditor';
