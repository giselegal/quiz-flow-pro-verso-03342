/**
 * 🎯 FASE 3.1 - Hook de Modo do Editor
 * 
 * Gerencia modos de visualização e interação do editor
 * 
 * RESPONSABILIDADES:
 * - Preview mode (desktop, mobile, tablet)
 * - Edit mode (design, json, split)
 * - Visualization mode (blocks, canvas, full)
 * - Layout preferences
 * 
 * @phase FASE 3.1 - Refatoração QuizModularEditor
 */

import { useState, useCallback, useMemo } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export type PreviewMode = 'desktop' | 'mobile' | 'tablet';
export type EditMode = 'design' | 'json' | 'split';
export type VisualizationMode = 'blocks' | 'canvas' | 'full';

export interface UseEditorModeOptions {
  initialPreviewMode?: PreviewMode;
  initialEditMode?: EditMode;
  initialVisualizationMode?: VisualizationMode;
  initialShowComponentLibrary?: boolean;
  initialShowProperties?: boolean;
  initialShowPreview?: boolean;
}

export interface UseEditorModeReturn {
  // Preview mode
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  isDesktopMode: boolean;
  isMobileMode: boolean;
  isTabletMode: boolean;
  
  // Edit mode
  editMode: EditMode;
  setEditMode: (mode: EditMode) => void;
  isDesignMode: boolean;
  isJsonMode: boolean;
  isSplitMode: boolean;
  
  // Visualization mode
  visualizationMode: VisualizationMode;
  setVisualizationMode: (mode: VisualizationMode) => void;
  isBlocksMode: boolean;
  isCanvasMode: boolean;
  isFullMode: boolean;
  
  // Panel visibility
  showComponentLibrary: boolean;
  setShowComponentLibrary: (show: boolean) => void;
  toggleComponentLibrary: () => void;
  
  showProperties: boolean;
  setShowProperties: (show: boolean) => void;
  toggleProperties: () => void;
  
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  togglePreview: () => void;
  
  // Computed
  visiblePanelsCount: number;
  isCompactLayout: boolean;
}

/**
 * Hook para gerenciar modos do editor
 */
export function useEditorMode({
  initialPreviewMode = 'desktop',
  initialEditMode = 'design',
  initialVisualizationMode = 'blocks',
  initialShowComponentLibrary = true,
  initialShowProperties = true,
  initialShowPreview = false,
}: UseEditorModeOptions = {}): UseEditorModeReturn {
  
  // Preview mode
  const [previewMode, setPreviewModeState] = useState<PreviewMode>(initialPreviewMode);
  
  const setPreviewMode = useCallback((mode: PreviewMode) => {
    appLogger.info(`🖥️ [useEditorMode] Preview mode alterado: ${previewMode} → ${mode}`);
    setPreviewModeState(mode);
  }, [previewMode]);
  
  // Edit mode
  const [editMode, setEditModeState] = useState<EditMode>(initialEditMode);
  
  const setEditMode = useCallback((mode: EditMode) => {
    appLogger.info(`✏️ [useEditorMode] Edit mode alterado: ${editMode} → ${mode}`);
    setEditModeState(mode);
  }, [editMode]);
  
  // Visualization mode
  const [visualizationMode, setVisualizationModeState] = useState<VisualizationMode>(initialVisualizationMode);
  
  const setVisualizationMode = useCallback((mode: VisualizationMode) => {
    appLogger.info(`👁️ [useEditorMode] Visualization mode alterado: ${visualizationMode} → ${mode}`);
    setVisualizationModeState(mode);
  }, [visualizationMode]);
  
  // Panel visibility
  const [showComponentLibrary, setShowComponentLibrary] = useState(initialShowComponentLibrary);
  const [showProperties, setShowProperties] = useState(initialShowProperties);
  const [showPreview, setShowPreview] = useState(initialShowPreview);
  
  const toggleComponentLibrary = useCallback(() => {
    setShowComponentLibrary(prev => {
      appLogger.info(`📚 [useEditorMode] Component Library: ${prev ? 'ocultar' : 'mostrar'}`);
      return !prev;
    });
  }, []);
  
  const toggleProperties = useCallback(() => {
    setShowProperties(prev => {
      appLogger.info(`⚙️ [useEditorMode] Properties Panel: ${prev ? 'ocultar' : 'mostrar'}`);
      return !prev;
    });
  }, []);
  
  const togglePreview = useCallback(() => {
    setShowPreview(prev => {
      appLogger.info(`👁️ [useEditorMode] Preview Panel: ${prev ? 'ocultar' : 'mostrar'}`);
      return !prev;
    });
  }, []);
  
  // Computed values
  const isDesktopMode = previewMode === 'desktop';
  const isMobileMode = previewMode === 'mobile';
  const isTabletMode = previewMode === 'tablet';
  
  const isDesignMode = editMode === 'design';
  const isJsonMode = editMode === 'json';
  const isSplitMode = editMode === 'split';
  
  const isBlocksMode = visualizationMode === 'blocks';
  const isCanvasMode = visualizationMode === 'canvas';
  const isFullMode = visualizationMode === 'full';
  
  const visiblePanelsCount = useMemo(() => {
    let count = 1; // Canvas sempre visível
    if (showComponentLibrary) count++;
    if (showProperties) count++;
    if (showPreview) count++;
    return count;
  }, [showComponentLibrary, showProperties, showPreview]);
  
  const isCompactLayout = visiblePanelsCount >= 3;
  
  return {
    // Preview mode
    previewMode,
    setPreviewMode,
    isDesktopMode,
    isMobileMode,
    isTabletMode,
    
    // Edit mode
    editMode,
    setEditMode,
    isDesignMode,
    isJsonMode,
    isSplitMode,
    
    // Visualization mode
    visualizationMode,
    setVisualizationMode,
    isBlocksMode,
    isCanvasMode,
    isFullMode,
    
    // Panel visibility
    showComponentLibrary,
    setShowComponentLibrary,
    toggleComponentLibrary,
    
    showProperties,
    setShowProperties,
    toggleProperties,
    
    showPreview,
    setShowPreview,
    togglePreview,
    
    // Computed
    visiblePanelsCount,
    isCompactLayout,
  };
}

export default useEditorMode;
