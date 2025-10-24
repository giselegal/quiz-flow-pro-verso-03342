/**
 * 🎯 USE CANONICAL EDITOR HOOK
 * 
 * Hook unificado que usa Canonical Services para gerenciamento do editor.
 * 
 * SUBSTITUI:
 * - usePureBuilder (deprecated)
 * - PureBuilderProvider (deprecated)
 * - HybridTemplateService (deprecated)
 * 
 * USA:
 * - EditorService (canonical)
 * - TemplateService (canonical)
 * - CacheService (canonical)
 * 
 * @version 1.0.0
 * @status PRODUCTION-READY
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  EditorService, 
  Block as CanonicalBlock 
} from '@/services/canonical/EditorService';
import { TemplateService, Template } from '@/services/canonical/TemplateService';
import { cacheService } from '@/services/canonical/CacheService';
import type { Block } from '@/types/editor';

/**
 * Convert canonical block to legacy block format
 */
function convertToLegacyBlock(canonicalBlock: CanonicalBlock): Block {
  return {
    id: canonicalBlock.id,
    type: canonicalBlock.type as any,
    order: canonicalBlock.layout?.order ?? 0,
    content: canonicalBlock.content as any,
    properties: {
      ...canonicalBlock.metadata,
      style: canonicalBlock.style
    },
    style: canonicalBlock.style,
    metadata: canonicalBlock.metadata
  };
}

/**
 * Convert legacy block to canonical format
 */
function convertToCanonicalBlock(legacyBlock: Partial<Block>): Omit<CanonicalBlock, 'id'> {
  return {
    type: legacyBlock.type || 'text',
    content: legacyBlock.content || {},
    style: legacyBlock.style,
    layout: {
      order: legacyBlock.order ?? 0,
      parent: undefined,
      colspan: 1
    },
    metadata: legacyBlock.metadata
  };
}

/**
 * Editor state interface
 */
export interface CanonicalEditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  currentStep: number;
  isModified: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Editor actions interface
 */
export interface CanonicalEditorActions {
  // Block operations
  createBlock: (block: Omit<Block, 'id'>) => Promise<Block | null>;
  updateBlock: (id: string, updates: Partial<Block>) => Promise<boolean>;
  deleteBlock: (id: string) => Promise<boolean>;
  duplicateBlock: (id: string) => Promise<Block | null>;
  moveBlock: (id: string, newOrder: number) => Promise<boolean>;
  reorderBlocks: (oldIndex: number, newIndex: number) => Promise<boolean>;
  
  // Selection
  selectBlock: (id: string | null) => void;
  
  // Template operations
  loadTemplate: (id: string) => Promise<boolean>;
  saveTemplate: (template: Template) => Promise<boolean>;
  
  // Step operations
  setCurrentStep: (step: number) => void;
  loadStep: (stepId: string) => Promise<boolean>;
  
  // State management
  resetState: () => void;
  clearError: () => void;
}

/**
 * Hook options
 */
export interface UseCanonicalEditorOptions {
  templateId?: string;
  autoLoad?: boolean;
  autoSave?: boolean;
  autoSaveInterval?: number;
  enableValidation?: boolean;
  enablePersistence?: boolean;
  onError?: (error: Error) => void;
  onChange?: (blocks: Block[]) => void;
}

/**
 * Hook return type
 */
export interface UseCanonicalEditorReturn {
  state: CanonicalEditorState;
  actions: CanonicalEditorActions;
  editorService: EditorService;
  templateService: TemplateService;
}

/**
 * 🎯 USE CANONICAL EDITOR
 * 
 * Hook principal para gerenciamento do editor usando Canonical Services
 */
export function useCanonicalEditor(
  options: UseCanonicalEditorOptions = {}
): UseCanonicalEditorReturn {
  const {
    templateId,
    autoLoad = true,
    autoSave = true,
    autoSaveInterval = 30000,
    enableValidation = true,
    enablePersistence = true,
    onError,
    onChange
  } = options;

  // ============================================================================
  // SERVICES INITIALIZATION
  // ============================================================================

  const editorService = useMemo(() => {
    return EditorService.getInstance({
      autoSave: {
        enabled: autoSave,
        interval: autoSaveInterval,
        debounce: 2000
      },
      persistState: enablePersistence,
      validateOnChange: enableValidation,
      maxBlocks: 1000,
      enableCollaboration: false,
      storageKey: `qfp_editor_${templateId || 'default'}`
    });
  }, [autoSave, autoSaveInterval, enableValidation, enablePersistence, templateId]);

  const templateService = useMemo(() => {
    return TemplateService.getInstance();
  }, []);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [state, setState] = useState<CanonicalEditorState>({
    blocks: [],
    selectedBlockId: null,
    currentStep: 1,
    isModified: false,
    isLoading: false,
    error: null
  });

  // ============================================================================
  // INTERNAL HELPERS
  // ============================================================================

  const updateBlocks = useCallback(() => {
    const result = editorService.getAllBlocks();
    if (result.success && result.data) {
      const legacyBlocks = result.data.map(convertToLegacyBlock);
      setState(prev => ({ ...prev, blocks: legacyBlocks }));
      onChange?.(legacyBlocks);
    }
  }, [editorService, onChange]);

  const handleError = useCallback((error: Error | string) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    setState(prev => ({ ...prev, error: errorMessage }));
    if (typeof error !== 'string') {
      onError?.(error);
    }
    console.error('[useCanonicalEditor] Error:', errorMessage);
  }, [onError]);

  // ============================================================================
  // BLOCK OPERATIONS
  // ============================================================================

  const createBlock = useCallback(async (block: Omit<Block, 'id'>): Promise<Block | null> => {
    try {
      const canonicalBlock = convertToCanonicalBlock(block);
      const result = editorService.createBlock(canonicalBlock);
      
      if (result.success && result.data) {
        updateBlocks();
        setState(prev => ({ ...prev, isModified: true }));
        console.log('✅ [useCanonicalEditor] Block created:', result.data.id);
        return convertToLegacyBlock(result.data);
      } else {
        const error = !result.success && 'error' in result ? result.error : new Error('Failed to create block');
        handleError(error);
        return null;
      }
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [editorService, updateBlocks, handleError]);

  const updateBlock = useCallback(async (id: string, updates: Partial<Block>): Promise<boolean> => {
    try {
      const result = editorService.updateBlock(id, updates);
      
      if (result.success) {
        updateBlocks();
        setState(prev => ({ ...prev, isModified: true }));
        console.log('✅ [useCanonicalEditor] Block updated:', id);
        return true;
      } else {
        handleError(result.error || new Error('Failed to update block'));
        return false;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [editorService, updateBlocks, handleError]);

  const deleteBlock = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = editorService.deleteBlock(id);
      
      if (result.success) {
        updateBlocks();
        setState(prev => ({ 
          ...prev, 
          isModified: true,
          selectedBlockId: prev.selectedBlockId === id ? null : prev.selectedBlockId
        }));
        console.log('✅ [useCanonicalEditor] Block deleted:', id);
        return true;
      } else {
        handleError(result.error || new Error('Failed to delete block'));
        return false;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [editorService, updateBlocks, handleError]);

  const duplicateBlock = useCallback(async (id: string): Promise<Block | null> => {
    try {
      const result = editorService.duplicateBlock(id);
      
      if (result.success && result.data) {
        updateBlocks();
        setState(prev => ({ ...prev, isModified: true }));
        console.log('✅ [useCanonicalEditor] Block duplicated:', result.data.id);
        return convertToLegacyBlock(result.data);
      } else {
        const error = !result.success && 'error' in result ? result.error : new Error('Failed to duplicate block');
        handleError(error);
        return null;
      }
    } catch (error) {
      handleError(error as Error);
      return null;
    }
  }, [editorService, updateBlocks, handleError]);

  const moveBlock = useCallback(async (id: string, newOrder: number): Promise<boolean> => {
    try {
      const result = editorService.moveBlock(id, newOrder);
      
      if (result.success) {
        updateBlocks();
        setState(prev => ({ ...prev, isModified: true }));
        console.log('✅ [useCanonicalEditor] Block moved:', id, 'to', newOrder);
        return true;
      } else {
        handleError(result.error || new Error('Failed to move block'));
        return false;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [editorService, updateBlocks, handleError]);

  const reorderBlocks = useCallback(async (oldIndex: number, newIndex: number): Promise<boolean> => {
    try {
      const blocksResult = editorService.getAllBlocks();
      if (!blocksResult.success || !blocksResult.data) {
        throw new Error('Failed to get blocks');
      }

      const blocks = blocksResult.data;
      if (oldIndex < 0 || oldIndex >= blocks.length || newIndex < 0 || newIndex >= blocks.length) {
        throw new Error('Invalid block indices');
      }

      const block = blocks[oldIndex];
      const result = editorService.moveBlock(block.id, newIndex);
      
      if (result.success) {
        updateBlocks();
        setState(prev => ({ ...prev, isModified: true }));
        console.log('✅ [useCanonicalEditor] Blocks reordered:', oldIndex, '→', newIndex);
        return true;
      } else {
        handleError(result.error || new Error('Failed to reorder blocks'));
        return false;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [editorService, updateBlocks, handleError]);

  // ============================================================================
  // SELECTION
  // ============================================================================

  const selectBlock = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedBlockId: id }));
    console.log('🎯 [useCanonicalEditor] Block selected:', id);
  }, []);

  // ============================================================================
  // TEMPLATE OPERATIONS
  // ============================================================================

  const loadTemplate = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      console.log('📥 [useCanonicalEditor] Loading template:', id);
      
      // 🎯 SPECIAL CASE: quiz21StepsComplete - load from generated file
      if (id === 'quiz21StepsComplete') {
        try {
          const response = await fetch('/src/data/generated-quiz-steps.json');
          if (response.ok) {
            const generatedData = await response.json();
            console.log('✅ Loading from generated file:', generatedData.totalBlocks, 'blocks');
            
            // Clear existing blocks
            const existingBlocks = editorService.getAllBlocks();
            if (existingBlocks.success && existingBlocks.data) {
              for (const block of existingBlocks.data) {
                editorService.deleteBlock(block.id);
              }
            }
            
            // Load generated blocks
            for (const block of generatedData.blocks) {
              editorService.createBlock(block);
            }
            
            updateBlocks();
            setState(prev => ({ 
              ...prev, 
              isLoading: false, 
              isModified: false 
            }));
            console.log('✅ [useCanonicalEditor] Generated template loaded:', generatedData.totalBlocks, 'blocks');
            return true;
          }
        } catch (e) {
          console.warn('⚠️ Failed to load generated file, falling back to template service:', e);
        }
      }
      
      // Default: load from template service
      const result = await templateService.getTemplate(id);
      
      if (result.success && result.data) {
        // Clear existing blocks
        const existingBlocks = editorService.getAllBlocks();
        if (existingBlocks.success && existingBlocks.data) {
          for (const block of existingBlocks.data) {
            editorService.deleteBlock(block.id);
          }
        }
        
        // Load new blocks
        for (const block of result.data.blocks) {
          editorService.createBlock(block as any);
        }
        
        updateBlocks();
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          isModified: false 
        }));
        console.log('✅ [useCanonicalEditor] Template loaded:', id, result.data.blocks.length, 'blocks');
        return true;
      } else {
        const error = !result.success && 'error' in result ? result.error : new Error('Failed to load template');
        throw error;
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      handleError(error as Error);
      return false;
    }
  }, [templateService, editorService, updateBlocks, handleError]);

  const saveTemplate = useCallback(async (template: Template): Promise<boolean> => {
    try {
      console.log('💾 [useCanonicalEditor] Saving template:', template.id);
      
      // Get current blocks
      const blocksResult = editorService.getAllBlocks();
      if (!blocksResult.success) {
        throw new Error('Failed to get blocks for save');
      }
      
      // Update template with current blocks
      const updatedTemplate: Template = {
        ...template,
        blocks: blocksResult.data.map(convertToLegacyBlock as any) || [],
        updatedAt: new Date().toISOString()
      };
      
      const result = await templateService.saveTemplate(updatedTemplate);
      
      if (result.success) {
        setState(prev => ({ ...prev, isModified: false }));
        console.log('✅ [useCanonicalEditor] Template saved:', template.id);
        return true;
      } else {
        const error = !result.success && 'error' in result ? result.error : new Error('Failed to save template');
        throw error;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [editorService, templateService, handleError]);

  // ============================================================================
  // STEP OPERATIONS
  // ============================================================================

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
    console.log('📍 [useCanonicalEditor] Current step:', step);
  }, []);

  const loadStep = useCallback(async (stepId: string): Promise<boolean> => {
    try {
      console.log('📥 [useCanonicalEditor] Loading step:', stepId);
      
      const result = await templateService.getStep(stepId);
      
      if (result.success && result.data) {
        // Clear existing blocks
        const existingBlocks = editorService.getAllBlocks();
        if (existingBlocks.success && existingBlocks.data) {
          for (const block of existingBlocks.data) {
            editorService.deleteBlock(block.id);
          }
        }
        
        // Load step blocks
        for (const block of result.data) {
          editorService.createBlock(block as any);
        }
        
        updateBlocks();
        console.log('✅ [useCanonicalEditor] Step loaded:', stepId, result.data.length, 'blocks');
        return true;
      } else {
        const error = !result.success && 'error' in result ? result.error : new Error('Failed to load step');
        throw error;
      }
    } catch (error) {
      handleError(error as Error);
      return false;
    }
  }, [templateService, editorService, updateBlocks, handleError]);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const resetState = useCallback(() => {
    // Clear all blocks
    const blocksResult = editorService.getAllBlocks();
    if (blocksResult.success && blocksResult.data) {
      for (const block of blocksResult.data) {
        editorService.deleteBlock(block.id);
      }
    }
    
    setState({
      blocks: [],
      selectedBlockId: null,
      currentStep: 1,
      isModified: false,
      isLoading: false,
      error: null
    });
    
    console.log('🔄 [useCanonicalEditor] State reset');
  }, [editorService]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Auto-load template on mount
  useEffect(() => {
    if (autoLoad && templateId) {
      loadTemplate(templateId);
    }
  }, []); // Apenas no mount

  // Listen to editor changes
  useEffect(() => {
    const unsubscribe = editorService.onChange((event) => {
      console.log('🔔 [useCanonicalEditor] Editor change:', event.type, event.blockId);
      updateBlocks();
    });

    return () => {
      unsubscribe();
    };
  }, [editorService, updateBlocks]);

  // ============================================================================
  // RETURN
  // ============================================================================

  const actions: CanonicalEditorActions = useMemo(() => ({
    createBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    selectBlock,
    loadTemplate,
    saveTemplate,
    setCurrentStep,
    loadStep,
    resetState,
    clearError
  }), [
    createBlock,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    moveBlock,
    reorderBlocks,
    selectBlock,
    loadTemplate,
    saveTemplate,
    setCurrentStep,
    loadStep,
    resetState,
    clearError
  ]);

  return {
    state,
    actions,
    editorService,
    templateService
  };
}

export default useCanonicalEditor;
