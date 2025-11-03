/**
 * 🎯 USE EDITOR HOOK - Simplified Canonical Version
 * 
 * Hook simplificado e canônico para acesso ao editor.
 * Substitui useUnifiedEditor complexo (274 linhas).
 * 
 * CARACTERÍSTICAS:
 * ✅ Interface limpa e direta
 * ✅ Auto-detecção do provider
 * ✅ TypeScript rigoroso
 * ✅ Performance otimizada
 * 
 * SUBSTITUI:
 * ❌ useUnifiedEditor (274 linhas, muito complexo)
 * ❌ useEditorWrapper (duplicação)
 * ❌ Múltiplas implementações espalhadas
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
import { EditorContext, type EditorContextValue } from '@/components/editor/EditorProviderUnified';

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
      '🚨 useEditor must be used within EditorProviderUnified\n\n' +
      'Wrap your component with:\n' +
      '<EditorProviderUnified>\n' +
      '  <YourComponent />\n' +
      '</EditorProviderUnified>'
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
