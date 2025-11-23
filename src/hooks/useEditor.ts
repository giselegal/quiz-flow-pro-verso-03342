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

export default useEditor;
