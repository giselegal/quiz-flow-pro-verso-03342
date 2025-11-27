/**
 * 📝 EDITOR STATE TYPES - Tipos Centralizados do Editor
 * 
 * Definição única e normalizada do EditorState usado em todo sistema.
 * Garante consistência de tipos e evita duplicação.
 * 
 * TIPO NORMALIZADO:
 * - stepBlocks: Record<number, Block[]> (SEMPRE number, SEMPRE Block[])
 * - Sem variações (string | number) ou (any[])
 */

import { Block } from '@/types/editor';

/**
 * Erro de validação de bloco
 */
export interface ValidationError {
    blockId: string;
    field: string;
    message: string;
    severity: 'error' | 'warning';
}

/**
 * Estado principal do editor
 * 
 * ⚠️ IMPORTANTE: Este é o tipo canônico - use sempre este
 */
export interface EditorState {
    /** Step atual (1-21) */
    currentStep: number;
    
    /** ID do bloco selecionado */
    selectedBlockId: string | null;
    
    /** Modo preview ativo */
    isPreviewMode: boolean;
    
    /** Modo edição ativo */
    isEditing: boolean;
    
    /** Estado de carregamento */
    isLoading: boolean;
    
    /** Drag & drop habilitado */
    dragEnabled: boolean;
    
    /** Dados na área de transferência */
    clipboardData: Block | null;
    
    /** Blocos por step - SEMPRE Record<number, Block[]> */
    stepBlocks: Record<number, Block[]>;
    
    /** Steps com mudanças não salvas */
    dirtySteps: Record<number, boolean>;
    
    /** Total de steps no quiz */
    totalSteps: number;
    
    /** Erros de validação */
    validationErrors: ValidationError[];
    
    /** Indica se há mudanças não salvas */
    isDirty: boolean;
    
    /** Timestamp do último save */
    lastSaved: number | null;
    
    /** Timestamp da última modificação */
    lastModified: number | null;
    
    /** Steps modificados com timestamp */
    modifiedSteps: Record<string, number>;
}

/**
 * Estado inicial padrão
 */
export const INITIAL_EDITOR_STATE: EditorState = {
    currentStep: 1,
    selectedBlockId: null,
    isPreviewMode: false,
    isEditing: false,
    isLoading: false,
    dragEnabled: true,
    clipboardData: null,
    stepBlocks: {},
    dirtySteps: {},
    totalSteps: 21,
    validationErrors: [],
    isDirty: false,
    lastSaved: null,
    lastModified: null,
    modifiedSteps: {},
};
