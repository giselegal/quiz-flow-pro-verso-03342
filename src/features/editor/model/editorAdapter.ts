// src/features/editor/model/editorAdapter.ts
// Adapter de comandos do editor para modo híbrido (legacy vs v4)

import { getFeatureFlag } from '@/core/utils/featureFlags';

export interface LegacyCommands {
  addBlock: (stepId: string, block: any) => Promise<void> | void;
  updateBlock: (stepId: string, blockId: string, patch: any) => Promise<void> | void;
  duplicateFunnel?: (resourceId: string) => Promise<{ success: boolean; clonedFunnel?: any; stats?: any; error?: string }>;
  saveStep?: (stepId: string, data: any) => Promise<void> | void;
}

export interface UnifiedCommands {
  addBlock: (stepId: string, block: any) => Promise<void>;
  updateBlock: (stepId: string, blockId: string, patch: any) => Promise<void>;
  duplicateFunnel?: (resourceId: string) => Promise<{ success: boolean; clonedFunnel?: any; stats?: any; error?: string }>;
  saveStep?: (stepId: string, data: any) => Promise<void>;
}

export type EditorCommands = LegacyCommands | UnifiedCommands;

export function createEditorCommandsAdapter(legacy: LegacyCommands, unified?: UnifiedCommands): EditorCommands {
  const useUnified = getFeatureFlag('useUnifiedEditor');
  if (useUnified && unified) {
    return unified;
  }
  return legacy;
}

export async function duplicateFunnel(resourceId: string): Promise<{ success: boolean; clonedFunnel?: any; stats?: any; error?: string }> {
  const useNewClone = getFeatureFlag('useFunnelCloneService');
  if (useNewClone) {
    const { funnelCloneService } = await import('@/core/funnel/services/FunnelCloneService');
    try {
      const result = await funnelCloneService.clone(resourceId, { asDraft: true });
      return result;
    } catch (e: any) {
      return { success: false, error: e?.message ?? 'clone_error' };
    }
  }
  // Fallback: sem clone legacy disponível
  return { success: false, error: 'legacy_clone_not_available' };
}
