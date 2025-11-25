/**
 * 📦 EDITOR CONTEXT - Barrel Export
 * 
 * Exportações consolidadas do contexto unificado do editor.
 * Use este arquivo como ponto único de importação.
 * 
 * @example
 * ```typescript
 * // ✅ Recomendado
 * import { useEditor, EditorProvider } from '@/core/contexts/EditorContext';
 * 
 * // ❌ Evitar
 * import { useEditor } from '@/core/contexts/EditorContext/EditorStateProvider';
 * ```
 */

export {
    // Provider principal
    EditorStateProvider,
    EditorStateProvider as EditorProvider, // Alias para compatibilidade
    
    // Hook canônico
    useEditorState,
    useEditor, // Alias recomendado
    
    // Tipos
    type EditorState,
    type EditorContextValue,
    type ValidationError,
} from './EditorStateProvider';

export {
    // Hook com camada de compatibilidade (para código legado)
    useEditorCompat,
    type EditorCompatAPI,
} from './EditorCompatLayer';
