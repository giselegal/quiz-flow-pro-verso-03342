/**
 * 🏗️ EDITOR ARCHITECTURE - Documentação e Contratos de API
 * 
 * Define interfaces unificadas e contratos de API para todo o sistema de editor.
 * Elimina duplicações e estabelece única fonte da verdade.
 */

import type { Block } from '@/types/editor';

// =====================================================
// 🎯 CORE INTERFACES - ÚNICA FONTE DA VERDADE
// =====================================================

/**
 * Estado principal unificado do editor
 */
export interface EditorCoreState {
  stepBlocks: Record<string, Block[]>;
  currentStep: number;
  selectedBlockId: string | null;
  stepValidation: Record<number, boolean>;
  isSupabaseEnabled: boolean;
  databaseMode: 'local' | 'supabase';
  isLoading: boolean;
}

/**
 * Ações principais unificadas do editor
 */
export interface EditorCoreActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  setSelectedBlockId: (blockId: string | null) => void;
  
  // Validation
  setStepValid: (step: number, isValid: boolean) => void;
  
  // Template management
  loadDefaultTemplate: () => void;
  
  // Block operations
  addBlock: (stepKey: string, block: Block) => Promise<void>;
  addBlockAtIndex: (stepKey: string, block: Block, index: number) => Promise<void>;
  removeBlock: (stepKey: string, blockId: string) => Promise<void>;
  reorderBlocks: (stepKey: string, oldIndex: number, newIndex: number) => Promise<void>;
  updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => Promise<void>;
  
  // Step management
  ensureStepLoaded: (step: number | string) => Promise<void>;
  
  // History operations
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Import/Export
  exportJSON: () => string;
  importJSON: (json: string) => void;
  
  // Supabase operations
  loadSupabaseComponents?: () => Promise<void>;
}

/**
 * Context principal unificado
 */
export interface EditorCoreContext {
  state: EditorCoreState;
  actions: EditorCoreActions;
}

// =====================================================
// 🔧 CONFIGURATION INTERFACES
// =====================================================

/**
 * Configuração do provider principal
 */
export interface EditorProviderConfig {
  children: React.ReactNode;
  initial?: Partial<EditorCoreState>;
  storageKey?: string;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
}

/**
 * Configuração de componentes do editor
 */
export interface EditorComponentConfig {
  className?: string;
  funnelId?: string;
  quizId?: string;
  enableSupabase?: boolean;
  debugMode?: boolean;
  stepNumber?: number;
}

// =====================================================
// 🎨 COMPONENT INTERFACES
// =====================================================

/**
 * Props padrão para componentes de bloco
 */
export interface BlockComponentProps {
  block?: Block;
  isSelected?: boolean;
  onPropertyChange?: (key: string, value: any) => void;
  className?: string;
}

/**
 * Props para sidebars
 */
export interface SidebarComponentProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * Props para painéis de propriedades
 */
export interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (blockId: string, updates: Record<string, any>) => void;
  className?: string;
}

// =====================================================
// 🚀 PERFORMANCE INTERFACES
// =====================================================

/**
 * Configuração de performance
 */
export interface PerformanceConfig {
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableMemoization: boolean;
  enableVirtualization: boolean;
  chunkSize: number;
  maxHistorySize: number;
}

/**
 * Métricas de performance
 */
export interface PerformanceMetrics {
  renderTime: number;
  blocksCount: number;
  memoryUsage: number;
  lastUpdate: Date;
}

// =====================================================
// 🛡️ ERROR HANDLING INTERFACES
// =====================================================

/**
 * Interface para error boundary
 */
export interface ErrorBoundaryConfig {
  fallbackComponent?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  maxRetries?: number;
  enableAutoRetry?: boolean;
}

/**
 * Estado de erro
 */
export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

// =====================================================
// 📊 VALIDATION INTERFACES
// =====================================================

/**
 * Resultado de validação
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  warnings?: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

/**
 * Configuração de validação
 */
export interface ValidationConfig {
  enabled: boolean;
  validateOnChange: boolean;
  validateOnSubmit: boolean;
  showInlineErrors: boolean;
  showWarnings: boolean;
}

// =====================================================
// 🎯 CONSTANTS
// =====================================================

/**
 * Constantes principais do editor
 */
export const EDITOR_CONSTANTS = {
  // Steps
  MIN_STEP: 1,
  MAX_STEP: 21,
  DEFAULT_STEP: 1,
  
  // Performance
  DEFAULT_CHUNK_SIZE: 20,
  MAX_HISTORY_SIZE: 50,
  DEBOUNCE_DELAY: 250,
  
  // Storage
  STORAGE_PREFIX: 'editor',
  STORAGE_VERSION: '2.0',
  
  // Editor modes
  MODES: {
    LOCAL: 'local' as const,
    SUPABASE: 'supabase' as const,
  },
  
  // Events
  EVENTS: {
    BLOCK_ADDED: 'block:added',
    BLOCK_UPDATED: 'block:updated',
    BLOCK_DELETED: 'block:deleted',
    STEP_CHANGED: 'step:changed',
    VALIDATION_CHANGED: 'validation:changed',
  },
} as const;

// =====================================================
// 🔨 UTILITY TYPES
// =====================================================

/**
 * Tipo para componentes que podem ser lazy loaded
 */
export type LazyComponent<P = {}> = React.LazyExoticComponent<React.ComponentType<P>>;

/**
 * Tipo para refs de components
 */
export type ComponentRef<T = HTMLElement> = React.RefObject<T>;

/**
 * Tipo para handlers de eventos
 */
export type EventHandler<T = Event> = (event: T) => void;

/**
 * Tipo para promises que podem ser canceladas
 */
export type CancelablePromise<T> = Promise<T> & {
  cancel: () => void;
};