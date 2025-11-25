/**
 * @deprecated Este arquivo é LEGADO. Use @core/hooks ao invés.
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo (deprecated)
 * import { useEditor } from '@/hooks/useEditor';
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * ```
 * 
 * Este arquivo será removido em versões futuras.
 * @see @core/hooks/useEditor
 */
import { useEditor as useEditorCanonical } from '@/core/contexts/EditorContext';
import { appLogger } from '@/lib/utils/appLogger';

// Log de deprecação em desenvolvimento
if (import.meta.env.DEV) {
  console.warn(
    '⚠️ DEPRECATED: @/hooks/useEditor está deprecated. Use @/core/hooks/useEditor'
  );
}

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
