/**
 * 🎯 USE EDITOR HOOK - Simplified Canonical Version
 * 
 * Hook simplificado e canônico para acesso ao editor.
 * Agora usa EditorProviderCanonical consolidado.
 * 
 * CARACTERÍSTICAS:
 * ✅ Interface limpa e direta
 * ✅ Auto-detecção do provider
 * ✅ TypeScript rigoroso
 * ✅ Performance otimizada
 * 
 * USO:
 * ```typescript
 * // Obrigatório (lança erro se não houver provider)
 * const editor = useEditor();
 * 
 * // Opcional (retorna undefined se não houver provider)
 * const editor = useEditor({ optional: true });
 * ```
 */

import { useContext } from 'react';
import { EditorContext, type EditorContextValue } from '@/components/editor/EditorProviderCanonical';

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook principal para acesso ao editor
 */
export function useEditor(): EditorContextValue;
export function useEditor(options: { optional: true }): EditorContextValue | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValue | undefined {
  const context = useContext(EditorContext);

  // Se optional=true, retorna undefined sem erro
  if (options?.optional) {
    return context || undefined;
  }

  // Se obrigatório e não encontrado, lança erro
  if (!context) {
    throw new Error(
      '🚨 useEditor must be used within EditorProviderCanonical\n\n' +
      'Wrap your component with:\n' +
      '<EditorProviderCanonical>\n' +
      '  <YourComponent />\n' +
      '</EditorProviderCanonical>'
    );
  }

  return context;
}

// ============================================================================
// OPTIONAL VARIANT (Convenience)
// ============================================================================

/**
 * Versão opcional que retorna undefined em vez de erro
 * Útil para componentes que podem funcionar sem editor
 */
export function useEditorOptional(): EditorContextValue | undefined {
  return useEditor({ optional: true });
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

/**
 * @deprecated Use useEditor() directly
 */
export const useUnifiedEditor = useEditor;

/**
 * @deprecated Use useEditorOptional() directly
 */
export const useUnifiedEditorOptional = useEditorOptional;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type { EditorContextValue };

// Default export
export default useEditor;
