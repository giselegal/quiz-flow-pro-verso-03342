/**
 * @deprecated Este arquivo é legado. Use diretamente useEditor de EditorStateProvider.
 * @see src/contexts/editor/EditorStateProvider.tsx
 */
import { useEditor as useEditorCanonical } from '@/contexts/editor/EditorStateProvider';
import { appLogger } from '@/lib/utils/appLogger';

interface UseEditorOptions {
  optional?: boolean;
}

// Get the EditorContextType from the canonical provider
type EditorContextType = ReturnType<typeof useEditorCanonical>;

export function useEditor(options: UseEditorOptions = {}): EditorContextType | null {
  try {
    return useEditorCanonical();
  } catch (error) {
    if (options.optional) {
      appLogger.warn('⚠️ useEditor (optional) chamado fora do contexto. Retornando null.');
      return null;
    }
    throw error;
  }
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
