/**
 * 🔄 LEGACY EDITOR COMPATIBILITY HOOK - FASE 4.3
 * 
 * Substitui LegacyCompatibilityWrapper com shim pontual
 * Adapta API antiga do EditorProvider → API nova
 * 
 * USO:
 * ```tsx
 * // ANTES
 * <LegacyCompatibilityWrapper>
 *   <ComponenteLegado />
 * </LegacyCompatibilityWrapper>
 * 
 * // DEPOIS
 * function ComponenteLegado() {
 *   const editor = useLegacyEditorCompat();
 *   // API antiga funciona normalmente
 * }
 * ```
 */

import { useEditor } from '@/hooks/useEditor';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES - API antiga do EditorProvider
// ============================================================================

export interface LegacyEditorBlock {
  id: string;
  type: string;
  content: any;
  order?: number;
  properties?: any;
}

export interface LegacyEditorStage {
  id: string;
  name: string;
  description?: string;
  blocks: LegacyEditorBlock[];
}

export interface LegacyEditorAPI {
  // Estado
  stages: LegacyEditorStage[];
  activeStageId: string | null;
  selectedBlockId: string | null;
  
  // Stage operations
  addStage: (name: string) => Promise<string>;
  updateStage: (id: string, updates: Partial<LegacyEditorStage>) => Promise<void>;
  deleteStage: (id: string) => Promise<void>;
  setActiveStage: (id: string) => void;
  
  // Block operations
  addBlock: (stepKey: string, block: Partial<LegacyEditorBlock>) => Promise<string>;
  updateBlock: (id: string, updates: Partial<LegacyEditorBlock>) => Promise<void>;
  deleteBlock: (id: string) => Promise<void>;
  reorderBlocks: (startIndex: number, endIndex: number) => Promise<void>;
  setSelectedBlock: (id: string | null) => void;
  
  // Persistence
  saveFunnel: () => Promise<void>;
  isSaving: boolean;
  
  // UI
  isPreviewing: boolean;
  setIsPreviewing: (value: boolean) => void;
}

// ============================================================================
// HOOK
// ============================================================================

export function useLegacyEditorCompat(): LegacyEditorAPI {
  const editor = useEditor();
  const { state, actions } = editor;

  // Converter stepBlocks (novo) → stages (antigo)
  const stages: LegacyEditorStage[] = Object.entries(state.stepBlocks || {}).map(
    ([stepKey, blocks]) => ({
      id: stepKey,
      name: stepKey.replace('step-', 'Step '),
      blocks: (blocks || []).map((block: any) => ({
        id: block.id || crypto.randomUUID(),
        type: block.type || 'text',
        content: block.content || {},
        order: block.order,
        properties: block.properties || {},
      })),
    })
  );

  const activeStageId = `step-${state.currentStep.toString().padStart(2, '0')}`;

  // Stage operations (simplificadas)
  const addStage = async (name: string): Promise<string> => {
    appLogger.warn('[LegacyEditorCompat] addStage not fully implemented');
    const newStepKey = `step-${(stages.length + 1).toString().padStart(2, '0')}`;
    return newStepKey;
  };

  const updateStage = async (id: string, updates: Partial<LegacyEditorStage>): Promise<void> => {
    appLogger.warn('[LegacyEditorCompat] updateStage not fully implemented', { data: [{ id, updates }] });
  };

  const deleteStage = async (id: string): Promise<void> => {
    appLogger.warn('[LegacyEditorCompat] deleteStage not fully implemented', { data: [{ id }] });
  };

  const setActiveStage = (id: string): void => {
    const stepNum = parseInt(id.replace('step-', ''), 10);
    if (!isNaN(stepNum)) {
      actions.setCurrentStep(stepNum);
    }
  };

  // Block operations (adaptados)
  const addBlock = async (stepKey: string, block: Partial<LegacyEditorBlock>): Promise<string> => {
    const newId = crypto.randomUUID();
    await actions.addBlock(stepKey, {
      id: newId,
      type: (block.type || 'text') as any,
      content: block.content || {},
      properties: block.properties || {},
      order: block.order || 0,
    });
    return newId;
  };

  const updateBlock = async (id: string, updates: Partial<LegacyEditorBlock>): Promise<void> => {
    const stepKey = activeStageId;
    await actions.updateBlock(stepKey, id, {
      type: updates.type as any,
      content: updates.content,
      properties: updates.properties,
    });
  };

  const deleteBlock = async (id: string): Promise<void> => {
    const stepKey = activeStageId;
    await actions.removeBlock(stepKey, id);
  };

  const reorderBlocks = async (startIndex: number, endIndex: number): Promise<void> => {
    const stepKey = activeStageId;
    await actions.reorderBlocks(stepKey, startIndex, endIndex);
  };

  const setSelectedBlock = (id: string | null): void => {
    actions.setSelectedBlockId?.(id);
  };

  // Persistence
  const saveFunnel = async (): Promise<void> => {
    appLogger.warn('[LegacyEditorCompat] saveFunnel not implemented');
  };

  // UI
  const setIsPreviewing = (value: boolean): void => {
    appLogger.warn('[LegacyEditorCompat] setIsPreviewing not implemented', { data: [value] });
  };

  return {
    stages,
    activeStageId,
    selectedBlockId: state.selectedBlockId || null,
    
    addStage,
    updateStage,
    deleteStage,
    setActiveStage,
    
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setSelectedBlock,
    
    saveFunnel,
    isSaving: false,
    
    isPreviewing: false,
    setIsPreviewing,
  };
}

export default useLegacyEditorCompat;
