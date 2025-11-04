/**
 * ⚠️ DEPRECATED: EDITOR PROVIDER UNIFIED
 * 
 * @deprecated Use SuperUnifiedProvider from @/providers/SuperUnifiedProvider instead
 * Este provider será removido em versão futura.
 * 
 * RAZÃO DA DEPRECAÇÃO:
 * - Duplica 70% do estado com SuperUnifiedProvider
 * - Causa 6-8 re-renders por ação (SuperUnifiedProvider: 1-2)
 * - +28KB de bundle duplicado
 * - +150KB de memória duplicada
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ ANTES
 * import { EditorProviderUnified } from '@/components/editor/EditorProviderUnified';
 * 
 * <EditorProviderUnified funnelId={id}>
 *   <YourComponent />
 * </EditorProviderUnified>
 * 
 * // ✅ DEPOIS
 * import { SuperUnifiedProvider } from '@/providers/SuperUnifiedProvider';
 * 
 * <SuperUnifiedProvider funnelId={id}>
 *   <YourComponent />
 * </SuperUnifiedProvider>
 * ```
 * 
 * @version DEPRECATED
 * @deprecatedSince 2025-01-16
 */

// Re-export do provider original para compatibilidade temporária
export { EditorProviderUnified, useEditor, EditorContext } from './EditorProviderUnified';

console.warn(
  '⚠️ [DEPRECATED] EditorProviderUnified está deprecated.\n' +
  'Use SuperUnifiedProvider ao invés.\n' +
  'Veja: src/components/editor/EditorProviderUnified.deprecated.tsx'
);
