/**
 * 🎯 UNIFIED STORE HOOKS - Façade para acesso simplificado às stores
 * 
 * Provê uma API unificada para acessar todas as stores Zustand,
 * facilitando a migração dos Context providers antigos.
 * 
 * USO:
 * - import { useEditor, useQuiz, useUI } from '@/hooks/useUnifiedStore'
 * 
 * Substitui: useEditor(), useQuizState(), useUX(), etc.
 */

import { useEditorStore, useCurrentStep, useCurrentStepBlocks, useSelectedBlock, useEditorMode, useEditorDirtyState } from '@/contexts/store/editorStore';
import { useQuizStore, useQuizProgress, useCurrentStepAnswer, useQuizSession, useQuizNavigation } from '@/contexts/store/quizStore';
import { useUIStore, usePanels, useNotifications, useActiveModals, useViewport } from '@/contexts/store/uiStore';

// ============================================================================
// EDITOR HOOKS
// ============================================================================

/**
 * Hook principal do editor - retorna estado e ações
 */
export const useEditor = () => {
  const store = useEditorStore();
  
  return {
    // State
    steps: store.steps,
    currentStepId: store.currentStepId,
    selectedBlockId: store.selectedBlockId,
    isEditMode: store.isEditMode,
    isPreviewMode: store.isPreviewMode,
    isDirty: store.isDirty,
    isSaving: store.isSaving,
    funnelId: store.funnelId,
    funnelName: store.funnelName,
    
    // Step actions
    setSteps: store.setSteps,
    setCurrentStep: store.setCurrentStep,
    addStep: store.addStep,
    removeStep: store.removeStep,
    reorderSteps: store.reorderSteps,
    
    // Block actions
    addBlock: store.addBlock,
    updateBlock: store.updateBlock,
    removeBlock: store.removeBlock,
    reorderBlocks: store.reorderBlocks,
    duplicateBlock: store.duplicateBlock,
    setSelectedBlock: store.setSelectedBlock,
    
    // Mode actions
    setEditMode: store.setEditMode,
    setPreviewMode: store.setPreviewMode,
    
    // State actions
    markDirty: store.markDirty,
    markClean: store.markClean,
    setSaving: store.setSaving,
    setFunnelMetadata: store.setFunnelMetadata,
    
    // History
    undo: store.undo,
    redo: store.redo,
    canUndo: store.canUndo(),
    canRedo: store.canRedo(),
    
    // Reset
    reset: store.reset,
  };
};

/**
 * Hook para seleção otimizada de partes do editor
 */
export const useEditorSelector = {
  currentStep: useCurrentStep,
  currentStepBlocks: useCurrentStepBlocks,
  selectedBlock: useSelectedBlock,
  mode: useEditorMode,
  dirtyState: useEditorDirtyState,
};

// ============================================================================
// QUIZ HOOKS
// ============================================================================

/**
 * Hook principal do quiz - retorna estado e ações
 */
export const useQuiz = () => {
  const store = useQuizStore();
  
  return {
    // State
    currentStep: store.currentStep,
    totalSteps: store.totalSteps,
    progress: store.progress,
    isCompleted: store.isCompleted,
    answers: store.answers,
    session: store.session,
    score: store.score,
    maxScore: store.maxScore,
    resultType: store.resultType,
    resultData: store.resultData,
    isLoading: store.isLoading,
    isTransitioning: store.isTransitioning,
    error: store.error,
    userName: store.userName,
    userEmail: store.userEmail,
    
    // Navigation
    goToStep: store.goToStep,
    nextStep: store.nextStep,
    previousStep: store.previousStep,
    setTotalSteps: store.setTotalSteps,
    
    // Answers
    setAnswer: store.setAnswer,
    clearAnswer: store.clearAnswer,
    clearAllAnswers: store.clearAllAnswers,
    
    // Session
    startSession: store.startSession,
    completeSession: store.completeSession,
    abandonSession: store.abandonSession,
    
    // Result
    setResult: store.setResult,
    clearResult: store.clearResult,
    
    // User
    setUserInfo: store.setUserInfo,
    
    // UI
    setLoading: store.setLoading,
    setTransitioning: store.setTransitioning,
    setError: store.setError,
    
    // Reset
    reset: store.reset,
  };
};

/**
 * Hook para seleção otimizada de partes do quiz
 */
export const useQuizSelector = {
  progress: useQuizProgress,
  answer: useCurrentStepAnswer,
  session: useQuizSession,
  navigation: useQuizNavigation,
};

// ============================================================================
// UI HOOKS
// ============================================================================

/**
 * Hook principal de UI - retorna estado e ações
 */
export const useUI = () => {
  const store = useUIStore();
  
  return {
    // Panels state
    isPropertiesPanelOpen: store.isPropertiesPanelOpen,
    isLibraryOpen: store.isLibraryOpen,
    isLayersOpen: store.isLayersOpen,
    isSettingsOpen: store.isSettingsOpen,
    
    // Modals
    activeModals: store.activeModals,
    
    // Notifications
    notifications: store.notifications,
    
    // Viewport
    viewportWidth: store.viewportWidth,
    viewportHeight: store.viewportHeight,
    isMobile: store.isMobile,
    
    // Sidebar
    sidebarCollapsed: store.sidebarCollapsed,
    
    // Loading
    isGlobalLoading: store.isGlobalLoading,
    loadingStates: store.loadingStates,
    
    // Panel actions
    togglePropertiesPanel: store.togglePropertiesPanel,
    setPropertiesPanelOpen: store.setPropertiesPanelOpen,
    toggleLibrary: store.toggleLibrary,
    setLibraryOpen: store.setLibraryOpen,
    toggleLayers: store.toggleLayers,
    setLayersOpen: store.setLayersOpen,
    toggleSettings: store.toggleSettings,
    setSettingsOpen: store.setSettingsOpen,
    
    // Modal actions
    openModal: store.openModal,
    closeModal: store.closeModal,
    closeAllModals: store.closeAllModals,
    
    // Notification actions
    showNotification: store.showNotification,
    dismissNotification: store.dismissNotification,
    clearNotifications: store.clearNotifications,
    
    // Loading actions
    setGlobalLoading: store.setGlobalLoading,
    setLoading: store.setLoading,
    isLoading: store.isLoading,
    
    // Sidebar
    toggleSidebar: store.toggleSidebar,
    setSidebarCollapsed: store.setSidebarCollapsed,
    
    // Viewport
    setViewport: store.setViewport,
    
    // Helpers
    showSuccess: store.showSuccess,
    showError: store.showError,
    showWarning: store.showWarning,
    showInfo: store.showInfo,
  };
};

/**
 * Hook para seleção otimizada de partes da UI
 */
export const useUISelector = {
  panels: usePanels,
  notifications: useNotifications,
  modals: useActiveModals,
  viewport: useViewport,
};

// ============================================================================
// COMBINED HOOKS (para casos especiais)
// ============================================================================

/**
 * Hook que combina estado de editor e quiz para preview
 */
export const usePreviewState = () => {
  const editor = useEditorStore((s) => ({
    steps: s.steps,
    currentStepId: s.currentStepId,
    isPreviewMode: s.isPreviewMode,
  }));
  
  const quiz = useQuizStore((s) => ({
    answers: s.answers,
    currentStep: s.currentStep,
    progress: s.progress,
  }));
  
  return { ...editor, ...quiz };
};

/**
 * Hook para notificações rápidas (atalho)
 */
export const useToast = () => {
  const store = useUIStore();
  
  return {
    success: store.showSuccess,
    error: store.showError,
    warning: store.showWarning,
    info: store.showInfo,
    dismiss: store.dismissNotification,
  };
};
