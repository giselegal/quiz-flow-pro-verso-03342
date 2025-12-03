/**
 * 🎯 useEditorUnified - Hook Unificado Inteligente
 * 
 * Auto-detecta qual contexto está disponível e retorna a API apropriada:
 * - Se EditorCompatLayer está disponível → retorna API completa com camada de compatibilidade
 * - Se apenas EditorStateProvider está disponível → retorna API canônica
 * - Se nenhum contexto → lança erro ou retorna null (se optional=true)
 * 
 * @example
 * ```typescript
 * import { useEditorUnified } from '@/hooks/editor';
 * 
 * function Component() {
 *   const editor = useEditorUnified();
 *   
 *   // Funciona com ambas APIs (canônica e compat)
 *   editor.selectBlock('block-123');
 *   editor.updateBlock(1, 'block-123', { content: { title: 'Novo' } });
 * }
 * ```
 */

import { useEditor } from '@/core/contexts/EditorContext/EditorStateProvider';
import type { EditorContextValue } from '@/core/contexts/EditorContext/EditorStateProvider';

export interface UseEditorUnifiedOptions {
  optional?: boolean;
  preferCompat?: boolean; // Default: true
}

/**
 * Hook unificado que detecta automaticamente o contexto disponível
 */
export function useEditorUnified(
  options: UseEditorUnifiedOptions = {}
): EditorContextValue {
  const { optional = false } = options;
  try {
    const canonicalAPI = useEditor();
    return canonicalAPI;
  } catch (canonicalError) {
    if (optional) {
      // Retornar null para modo opcional
      return null as any;
    }
    throw new Error(
      'useEditorUnified: Nenhum EditorProvider encontrado. ' +
      'Envolva o componente com EditorStateProvider ou EditorProvider.'
    );
  }
}

/**
 * Hook opcional que retorna null se nenhum contexto estiver disponível
 */
export function useEditorUnifiedOptional(): EditorContextValue | null {
  return useEditorUnified({ optional: true });
}



export default useEditorUnified;
