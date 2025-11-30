/**
 * 🎯 Types do Modern Quiz Editor
 * 
 * Types compartilhados entre stores e componentes
 */

// Reutilizar types existentes do sistema
export type { QuizSchema, QuizStep, QuizBlock } from '@/schemas/quiz-schema.zod';
export type { QuizResult, StyleResult } from '@/types/quiz';

/**
 * Histórico de mudanças para Undo/Redo
 */
export interface HistoryEntry {
  quiz: any; // QuizSchema completo
  timestamp: number;
  action: string;
}

/**
 * Estado de seleção do editor
 */
export interface EditorSelection {
  stepId: string | null;
  blockId: string | null;
}

/**
 * Metadados de alterações
 */
export interface EditorMetadata {
  isDirty: boolean;
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
}
