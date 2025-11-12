// TypeScript fixes for EditorProvider setState calls
// This file contains the proper type annotations to fix all setState errors

import type { Block } from '@/types/editor';

// Substitui EditorState legado por estrutura compatível migrada
export interface EditorStateMigratedCompat {
  stepBlocks: Record<string, Block[]>;
  selectedBlockId: string | null;
  currentStep: number;
  isLoading: boolean;
  stepValidation: Record<number, boolean>;
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
}

export const createTypedSetState = (setState: React.Dispatch<React.SetStateAction<EditorStateMigratedCompat>>) => {
  return {
    // Template for proper setState calls - all should follow this pattern:
    // setState((prev: EditorState) => ({ ...prev, ...updates }));

    setLoading: (isLoading: boolean) => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, isLoading }));
    },

    setCurrentStep: (currentStep: number) => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, currentStep }));
    },

    setSelectedBlockId: (selectedBlockId: string | null) => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, selectedBlockId }));
    },

    setStepValidation: (stepValidation: Record<number, boolean>) => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, stepValidation }));
    },

    setStepBlocks: (stepBlocks: Record<string, Block[]>) => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, stepBlocks }));
    },

    setSupabaseMode: (isSupabaseEnabled: boolean, databaseMode: 'local' | 'supabase') => {
      setState((prev: EditorStateMigratedCompat) => ({ ...prev, isSupabaseEnabled, databaseMode }));
    },
  };
};

// Export type-safe updater functions
export const createStateUpdater = <T extends keyof EditorStateMigratedCompat>(
  setState: React.Dispatch<React.SetStateAction<EditorStateMigratedCompat>>,
  key: T,
) => {
  return (value: EditorStateMigratedCompat[T]) => {
    setState((prev: EditorStateMigratedCompat) => ({ ...prev, [key]: value }));
  };
};