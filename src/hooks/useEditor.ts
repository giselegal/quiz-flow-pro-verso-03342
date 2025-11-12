/**
 * 🚀 USE EDITOR HOOK (Migrado)
 *
 * Hook unificado para acesso ao estado do editor usando SuperUnifiedProvider.
 * Remove dependência de `EditorProviderCanonical` (deprecated) e expõe
 * uma interface semelhante para minimizar impacto na migração.
 *
 * CARACTERÍSTICAS:
 * ✅ Source of truth via `useSuperUnified`
 * ✅ Compatibilidade parcial com assinatura anterior
 * ✅ Retornos opcionais com fallback
 * ✅ Preparado para remover totalmente o provider canônico
 *
 * USO:
 * ```ts
 * const editor = useEditor(); // lança se provider ausente
 * const editorOpt = useEditor({ optional: true }); // undefined se ausente
 * ```
 */

import { useSuperUnified } from '@/contexts/providers/SuperUnifiedProvider';
import type { Block } from '@/types/editor';

// Interface adaptada (subset do antigo EditorContextValue)
export interface EditorContextValueMigrated {
  currentStep: number;
  selectedBlockId: string | null;
  stepBlocks: Record<number, Block[]>;
  addBlock: (type: string, overrides?: Partial<Block>) => string;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  removeBlock: (blockId: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  setSelectedBlockId: (id: string | null) => void;
  setCurrentStep: (step: number) => void;
  isPreviewMode: boolean;
  togglePreview: (force?: boolean) => void;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook principal para acesso ao editor
 */
export function useEditor(): EditorContextValueMigrated;
export function useEditor(options: { optional: true }): EditorContextValueMigrated | undefined;
export function useEditor(options?: { optional?: boolean }): EditorContextValueMigrated | undefined {
  try {
    const unified = useSuperUnified();

    // Funções adaptadoras
    const addBlock = (type: string, overrides: Partial<Block> = {}): string => {
      const stepIndex = unified.state.editor.currentStep;
      const id = `blk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const block: Block = {
        id,
        type: type as any,
        content: overrides.content || {},
        properties: overrides.properties || {},
        order: unified.state.editor.stepBlocks[stepIndex]?.length || 0,
        ...overrides,
      } as Block;
      unified.addBlock(stepIndex, block);
      return id;
    };

    const updateBlock = (blockId: string, updates: Partial<Block>) => {
      const stepIndex = unified.state.editor.currentStep;
      unified.updateBlock(stepIndex, blockId, updates);
    };

    const removeBlock = (blockId: string) => {
      const stepIndex = unified.state.editor.currentStep;
      unified.removeBlock(stepIndex, blockId);
    };

    const reorderBlocks = (startIndex: number, endIndex: number) => {
      const stepIndex = unified.state.editor.currentStep;
      const blocks = [...(unified.state.editor.stepBlocks[stepIndex] || [])];
      if (startIndex < 0 || endIndex < 0 || startIndex >= blocks.length || endIndex >= blocks.length) {
        return;
      }
      const [moved] = blocks.splice(startIndex, 1);
      blocks.splice(endIndex, 0, moved);
      // Normalizar ordem
      const normalized = blocks.map((b, i) => ({ ...b, order: i }));
      unified.reorderBlocks(stepIndex, normalized);
    };

    const setSelectedBlockId = (id: string | null) => unified.setSelectedBlock(id);
    const setCurrentStep = (step: number) => unified.setCurrentStep(step);
    const togglePreview = (force?: boolean) => {
      unified.state.editor.isPreviewMode = force !== undefined ? force : !unified.state.editor.isPreviewMode;
    };

    const migrated: EditorContextValueMigrated = {
      currentStep: unified.state.editor.currentStep,
      selectedBlockId: unified.state.editor.selectedBlockId,
      stepBlocks: unified.state.editor.stepBlocks as Record<number, Block[]>,
      addBlock,
      updateBlock,
      removeBlock,
      reorderBlocks,
      setSelectedBlockId,
      setCurrentStep,
      isPreviewMode: unified.state.editor.isPreviewMode,
      togglePreview,
    };
    return migrated;
  } catch (err) {
    if (options?.optional) return undefined;
    throw new Error('🚨 useEditor: SuperUnifiedProvider não encontrado. Envolva com <SuperUnifiedProvider>.');
  }
}

// ============================================================================
// OPTIONAL VARIANT (Convenience)
// ============================================================================

/**
 * Versão opcional que retorna undefined em vez de erro
 * Útil para componentes que podem funcionar sem editor
 */
export function useEditorOptional(): EditorContextValueMigrated | undefined {
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

// Tipos já exportados via interface; remover export duplicado que causa conflito

// Default export
export default useEditor;
