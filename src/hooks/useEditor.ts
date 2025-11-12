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
  /** Estado básico (API nova) */
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
  /** Campos legados adicionais para compatibilidade */
  activeStageId?: string; // Convertido de currentStep
  /** 🔄 Compatibilidade legada: espelha estrutura antiga */
  state: {
    stepBlocks: Record<string, Block[]>; // antigo formato 'step-01'
    selectedBlockId: string | null;
    currentStep: number;
    isLoading: boolean;
    stepValidation: Record<number, boolean>;
    isSupabaseEnabled: boolean;
    databaseMode: 'local' | 'supabase';
  };
  actions: {
    setCurrentStep: (step: number) => void;
    setSelectedBlockId: (id: string | null) => void;
    // Assinaturas legadas compatíveis com componentes existentes
    addBlock: (stepKey: string, block: Block) => Promise<void>;
    addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
    removeBlock: (stepKey: string, blockId: string) => Promise<void>;
    reorderBlocks: (stepKey: string, fromIndex: number, toIndex: number) => Promise<void>;
    updateBlock: (stepKey: string, blockId: string, updates: Partial<Block>) => Promise<void>;
    deleteBlock: (id: string) => void; // alias simples, sem stepKey
    ensureStepLoaded: (stepKey: string) => Promise<void>;
    // Métodos legados para undo/redo/export/import
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    exportJSON: () => string;
    importJSON: (json: string) => void;
  };
  computed: {
    currentBlocks: Block[];
  };
  blockActions: EditorContextValueMigrated['actions'];
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

    // Compatibilidade legada: construir mapa string 'step-01'
    const legacyStepBlocks: Record<string, Block[]> = {};
    Object.entries(unified.state.editor.stepBlocks).forEach(([idx, blocks]) => {
      const numeric = Number(idx);
      const key = `step-${String(numeric).padStart(2, '0')}`;
      legacyStepBlocks[key] = blocks as Block[];
    });

    const stepKeyToIndex = (key: string): number => {
      const m = key.match(/step[-_ ]?(\d+)/i);
      const n = m ? parseInt(m[1], 10) : Number(key);
      return Number.isFinite(n) && n > 0 ? n : unified.state.editor.currentStep;
    };

    const migrated: EditorContextValueMigrated = {
      currentStep: unified.state.editor.currentStep,
      selectedBlockId: unified.state.editor.selectedBlockId,
      stepBlocks: unified.state.editor.stepBlocks as Record<number, Block[]>,
      activeStageId: `step-${String(unified.state.editor.currentStep).padStart(2, '0')}`, // Compat: activeStageId
      addBlock,
      updateBlock,
      removeBlock,
      reorderBlocks,
      setSelectedBlockId,
      setCurrentStep,
      isPreviewMode: unified.state.editor.isPreviewMode,
      togglePreview,
      state: {
        stepBlocks: legacyStepBlocks,
        selectedBlockId: unified.state.editor.selectedBlockId,
        currentStep: unified.state.editor.currentStep,
        isLoading: false,
        stepValidation: {},
        isSupabaseEnabled: true,
        databaseMode: 'supabase',
      },
      actions: {
        setCurrentStep,
        setSelectedBlockId,
        addBlock: async (stepKey: string, block: Block) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.addBlock(stepIndex, block);
        },
        addBlockAtIndex: async (stepKey: string, block: Block, index: number) => {
          const stepIndex = stepKeyToIndex(stepKey);
          const blocks = [...(unified.state.editor.stepBlocks[stepIndex] || [])];
          const clamped = Math.max(0, Math.min(index, blocks.length));
          blocks.splice(clamped, 0, block);
          const normalized = blocks.map((b, i) => ({ ...b, order: i }));
          unified.reorderBlocks(stepIndex, normalized);
        },
        removeBlock: async (stepKey: string, blockId: string) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.removeBlock(stepIndex, blockId);
        },
        reorderBlocks: async (stepKey: string, fromIndex: number, toIndex: number) => {
          const stepIndex = stepKeyToIndex(stepKey);
          const blocks = [...(unified.state.editor.stepBlocks[stepIndex] || [])];
          if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) return;
          const [moved] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, moved);
          const normalized = blocks.map((b, i) => ({ ...b, order: i }));
          unified.reorderBlocks(stepIndex, normalized);
        },
        updateBlock: async (stepKey: string, blockId: string, updates: Partial<Block>) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.updateBlock(stepIndex, blockId, updates);
        },
        deleteBlock: (id: string) => removeBlock(id),
        ensureStepLoaded: async () => { /* noop - carregamento já integrado no SuperUnifiedProvider */ },
        // Métodos legados para undo/redo/export/import
        undo: () => unified.undo(),
        redo: () => unified.redo(),
        canUndo: unified.canUndo,
        canRedo: unified.canRedo,
        exportJSON: () => JSON.stringify(unified.state.editor.stepBlocks),
        importJSON: (json: string) => { 
          try { 
            const parsed = JSON.parse(json);
            // Reconstruir stepBlocks a partir do JSON
            if (parsed.stepBlocks) {
              Object.entries(parsed.stepBlocks).forEach(([stepKey, blocks]) => {
                const stepIndex = typeof stepKey === 'number' ? stepKey : stepKeyToIndex(stepKey);
                unified.reorderBlocks(stepIndex, blocks as Block[]);
              });
            }
          } catch(e) { /* noop */ } 
        },
      },
      computed: {
        currentBlocks: (unified.state.editor.stepBlocks[unified.state.editor.currentStep] || []) as Block[],
      },
      blockActions: {
        setCurrentStep,
        setSelectedBlockId,
        addBlock: async (stepKey: string, block: Block) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.addBlock(stepIndex, block);
        },
        addBlockAtIndex: async (stepKey: string, block: Block, index: number) => {
          const stepIndex = stepKeyToIndex(stepKey);
          const blocks = [...(unified.state.editor.stepBlocks[stepIndex] || [])];
          const clamped = Math.max(0, Math.min(index, blocks.length));
          blocks.splice(clamped, 0, block);
          const normalized = blocks.map((b, i) => ({ ...b, order: i }));
          unified.reorderBlocks(stepIndex, normalized);
        },
        removeBlock: async (stepKey: string, blockId: string) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.removeBlock(stepIndex, blockId);
        },
        reorderBlocks: async (stepKey: string, fromIndex: number, toIndex: number) => {
          const stepIndex = stepKeyToIndex(stepKey);
          const blocks = [...(unified.state.editor.stepBlocks[stepIndex] || [])];
          if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length || toIndex >= blocks.length) return;
          const [moved] = blocks.splice(fromIndex, 1);
          blocks.splice(toIndex, 0, moved);
          const normalized = blocks.map((b, i) => ({ ...b, order: i }));
          unified.reorderBlocks(stepIndex, normalized);
        },
        updateBlock: async (stepKey: string, blockId: string, updates: Partial<Block>) => {
          const stepIndex = stepKeyToIndex(stepKey);
          unified.updateBlock(stepIndex, blockId, updates);
        },
        deleteBlock: (id: string) => removeBlock(id),
        ensureStepLoaded: async () => { /* noop */ },
        // Undo/redo e export/import também em blockActions para compatibilidade total
        undo: () => unified.undo(),
        redo: () => unified.redo(),
        canUndo: unified.canUndo,
        canRedo: unified.canRedo,
        exportJSON: () => JSON.stringify(unified.state.editor.stepBlocks),
        importJSON: (json: string) => { 
          try { 
            const parsed = JSON.parse(json);
            if (parsed.stepBlocks) {
              Object.entries(parsed.stepBlocks).forEach(([stepKey, blocks]) => {
                const stepIndex = typeof stepKey === 'number' ? stepKey : stepKeyToIndex(stepKey);
                unified.reorderBlocks(stepIndex, blocks as Block[]);
              });
            }
          } catch(e) { /* noop */ } 
        },
      },
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
