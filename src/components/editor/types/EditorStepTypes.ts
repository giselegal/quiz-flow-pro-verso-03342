/**
 * 🗂️ EDITOR STEP TYPES
 * 
 * Tipos abstratos dedicados para o editor, separados dos tipos de produção.
 * Resolve GARGALO #4: Falta de abstração de tipos
 */

import type { QuizStep } from '@/data/quizSteps';

// 🎯 Meta-informações específicas do editor
export interface EditorStepMeta {
  isLocked: boolean;
  isVisible: boolean;
  isCollapsed: boolean;
  validationState: 'valid' | 'invalid' | 'warning' | 'pending';
  validationErrors: string[];
  lastModified: number;
  hasUnsavedChanges: boolean;
}

// 🧩 Tipo principal do editor - abstração sobre produção
export interface EditorStep {
  id: string;
  order: number;
  type: string;
  data: QuizStep; // Dados de produção encapsulados
  meta: EditorStepMeta;
}

// 🔧 Interface para operações do store
export interface StepsStoreActions {
  addStep: (step: Omit<EditorStep, 'id' | 'order'>) => EditorStep;
  updateStep: (id: string, patch: Partial<EditorStep>) => void;
  updateStepData: (id: string, dataPatch: Partial<QuizStep>) => void;
  updateStepMeta: (id: string, metaPatch: Partial<EditorStepMeta>) => void;
  deleteStep: (id: string) => void;
  reorderStep: (fromId: string, toId: string) => void;
  getStep: (id: string) => EditorStep | undefined;
  getAllSteps: () => EditorStep[];
  getStepsByOrder: () => EditorStep[];
  duplicateStep: (id: string) => EditorStep;
  resetStep: (id: string) => void;
}

// 📊 Interface para métricas de performance
export interface StepsStoreMetrics {
  totalSteps: number;
  validSteps: number;
  invalidSteps: number;
  unsavedChanges: number;
  lastUpdateTime: number;
  renderCount: number;
}

// 🎭 Interface completa do store
export interface StepsStore extends StepsStoreActions {
  steps: Map<string, EditorStep>;
  stepOrder: string[];
  selectedStepId: string | null;
  metrics: StepsStoreMetrics;
}

// 🔄 Estados de carregamento
export type StepsLoadingState = 'idle' | 'loading' | 'saving' | 'error';

// 🎯 Configuração do store
export interface StepsStoreConfig {
  enableValidation: boolean;
  enableAutoSave: boolean;
  autoSaveInterval: number;
  maxUndoHistory: number;
  enableMetrics: boolean;
}

// 🌟 Valores padrão para meta-informações
export const DEFAULT_STEP_META: EditorStepMeta = {
  isLocked: false,
  isVisible: true,
  isCollapsed: false,
  validationState: 'pending',
  validationErrors: [],
  lastModified: Date.now(),
  hasUnsavedChanges: false,
};

// 🎨 Tipos de etapas suportadas
export const SUPPORTED_STEP_TYPES = [
  'intro',
  'question', 
  'result',
  'transition',
  'offer',
  'strategic_question',
  'email_capture',
  'thank_you'
] as const;

export type SupportedStepType = typeof SUPPORTED_STEP_TYPES[number];

// 🔍 Utilitários de tipo
export function isValidStepType(type: string): type is SupportedStepType {
  return SUPPORTED_STEP_TYPES.includes(type as SupportedStepType);
}

export function createDefaultEditorStep(
  type: SupportedStepType,
  data: QuizStep,
  order: number = 0
): Omit<EditorStep, 'id'> {
  return {
    order,
    type,
    data,
    meta: { ...DEFAULT_STEP_META }
  };
}