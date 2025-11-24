import { useEditor as useEditorContext } from '@/contexts/editor/EditorContext';
import { appLogger } from '@/lib/utils/appLogger';

interface UseEditorOptions {
  optional?: boolean;
}

export function useEditor(options: UseEditorOptions = {}) {
  try {
    return useEditorContext();
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
export function useEditorOptional() {
  return useEditor({ optional: true });
}

export default useEditor;
