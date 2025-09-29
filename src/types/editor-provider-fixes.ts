// TypeScript fixes for EditorProvider setState calls
// This file contains the proper type annotations to fix all setState errors

import { EditorState } from '@/components/editor/EditorProvider';

export const createTypedSetState = (setState: React.Dispatch<React.SetStateAction<EditorState>>) => {
  return {
    // Template for proper setState calls - all should follow this pattern:
    // setState((prev: EditorState) => ({ ...prev, ...updates }));
    
    setLoading: (isLoading: boolean) => {
      setState((prev: EditorState) => ({ ...prev, isLoading }));
    },
    
    setCurrentStep: (currentStep: number) => {
      setState((prev: EditorState) => ({ ...prev, currentStep }));
    },
    
    setSelectedBlockId: (selectedBlockId: string | null) => {
      setState((prev: EditorState) => ({ ...prev, selectedBlockId }));
    },
    
    setStepValidation: (stepValidation: Record<number, boolean>) => {
      setState((prev: EditorState) => ({ ...prev, stepValidation }));
    },
    
    setStepBlocks: (stepBlocks: Record<string, any[]>) => {
      setState((prev: EditorState) => ({ ...prev, stepBlocks }));
    },
    
    setSupabaseMode: (isSupabaseEnabled: boolean, databaseMode: 'local' | 'supabase') => {
      setState((prev: EditorState) => ({ ...prev, isSupabaseEnabled, databaseMode }));
    }
  };
};

// Export type-safe updater functions
export const createStateUpdater = <T extends keyof EditorState>(
  setState: React.Dispatch<React.SetStateAction<EditorState>>,
  key: T
) => {
  return (value: EditorState[T]) => {
    setState((prev: EditorState) => ({ ...prev, [key]: value }));
  };
};