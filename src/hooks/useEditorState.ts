import { useState, useCallback, useEffect } from 'react';
import { useTemplateCache } from './useTemplateCache';
import { useBlockManager } from './useBlockManager';
import type { Block } from '@/types/editor';

interface UseEditorStateReturn {
  // Step management
  selectedStep: string;
  setSelectedStep: (step: string) => void;

  // Block management
  blocks: Block[];
  selectedBlock: string | null;
  selectBlock: (blockId: string | null) => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  addBlock: (block: Omit<Block, 'id' | 'position'>) => void;
  duplicateBlock: (blockId: string) => void;
  getSelectedBlockData: () => Block | undefined;

  // UI States
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  isDragOver: boolean;
  setIsDragOver: (isDragOver: boolean) => void;

  // User interactions
  userResponses: Record<string, any>;
  setUserResponses: (responses: Record<string, any>) => void;

  // Loading & Error states
  isLoading: boolean;
  error: string | null;

  // Actions
  loadStep: (stepId: string) => void;
  clearCache: () => void;
}

/**
 * 🚀 HOOK CENTRAL: Estado do Editor
 *
 * Centraliza todo o estado do editor em um hook reutilizável
 * Otimizações aplicadas:
 * ✅ Composição de hooks especializados
 * ✅ Carregamento otimizado de templates
 * ✅ Estados de UI centralizados
 * ✅ Callbacks memoizados
 */
export const useEditorState = (): UseEditorStateReturn => {
  // Estados de UI
  const [selectedStep, setSelectedStep] = useState<string>('step-1');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});

  // Hooks especializados
  const { getTemplate, isLoading, error, clearCache } = useTemplateCache();
  const {
    blocks,
    selectedBlock,
    setBlocks,
    selectBlock,
    updateBlock,
    deleteBlock,
    addBlock,
    duplicateBlock,
    getSelectedBlockData,
  } = useBlockManager();

  // Carregamento otimizado de steps
  const loadStep = useCallback(
    (stepId: string) => {
      const stepNumber = parseInt(stepId.replace('step-', ''));

      if (stepNumber && stepNumber >= 1 && stepNumber <= 21) {
        const templateBlocks = getTemplate(stepNumber);
        setBlocks(templateBlocks);
        console.log(`✅ Step ${stepNumber} carregado com ${templateBlocks.length} blocos`);
      }
    },
    [getTemplate, setBlocks]
  );

  // Auto-carregamento quando step muda
  useEffect(() => {
    loadStep(selectedStep);
  }, [selectedStep, loadStep]);

  // Callback otimizado para mudança de step
  const handleSetSelectedStep = useCallback(
    (step: string) => {
      setSelectedStep(step);
      selectBlock(null); // Desseleciona bloco ao mudar step
    },
    [selectBlock]
  );

  // Callback otimizado para preview mode
  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
    selectBlock(null); // Desseleciona no preview
  }, [selectBlock]);

  return {
    // Step management
    selectedStep,
    setSelectedStep: handleSetSelectedStep,

    // Block management
    blocks,
    selectedBlock,
    selectBlock,
    updateBlock,
    deleteBlock,
    addBlock,
    duplicateBlock,
    getSelectedBlockData,

    // UI States
    isPreviewMode,
    togglePreviewMode,
    isDragOver,
    setIsDragOver,

    // User interactions
    userResponses,
    setUserResponses,

    // Loading & Error states
    isLoading,
    error,

    // Actions
    loadStep,
    clearCache,
  };
};
