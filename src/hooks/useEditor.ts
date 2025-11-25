import { useEditor as useEditorContext, EditorContext } from '@/contexts/editor/EditorContext';
import { appLogger } from '@/lib/utils/appLogger';
import { useContext } from 'react';

interface UseEditorOptions {
  optional?: boolean;
}

// Get the EditorContextType from the context
type EditorContextType = NonNullable<ReturnType<typeof useEditorContext>>;

export function useEditor(options: UseEditorOptions = {}): EditorContextType | null {
  const context = useContext(EditorContext);
  
  if (!context) {
    if (options.optional) {
      appLogger.warn('⚠️ useEditor (optional) chamado fora do contexto. Retornando null.');
      return null;
    }
    // The fallback is returned from useEditorContext when context is null
    return useEditorContext();
  }
  
  return context;
}

/**
 * Hook opcional para acessar o contexto do editor.
 * Retorna null se usado fora do EditorProvider (sem lançar erro).
 */
export function useEditorOptional(): EditorContextType | null {
  return useEditor({ optional: true });
}

export default useEditor;

// Re-export the type for consumers
export type { EditorContextType };
