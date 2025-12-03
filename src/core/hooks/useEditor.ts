/**
 * 🎯 USE EDITOR - Hook Canônico do Editor
 * 
 * Hook principal para acessar o contexto do editor.
 * Re-exporta o hook do EditorStateProvider com compatibilidade legada.
 * 
 * @example
 * ```typescript
 * import { useEditor } from '@/core/hooks';
 * 
 * function Component() {
 *   const editor = useEditor();
 *   
 *   // Acessar estado
 *   const { currentStep, selectedBlockId, blocks } = editor;
 *   
 *   // Ações
 *   editor.setCurrentStep(2);
 *   editor.selectBlock('block-123');
 *   editor.updateBlock(1, 'block-123', { content: { title: 'Novo' } });
 * }
 * ```
 */

export { 
    useEditor,
    useEditorState,
} from '@/core/contexts/EditorContext';

export type {
    EditorContextValue,

} from '@/core/contexts/EditorContext';

// Nota: EditorState é exportado por @/core/contexts/EditorContext diretamente
