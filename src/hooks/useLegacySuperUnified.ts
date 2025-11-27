/**
 * 🔄 LEGACY SUPER UNIFIED HOOK
 * 
 * Hook agregador que combina múltiplos contextos modulares
 * em uma interface única para compatibilidade com código legado.
 * 
 * ⚠️ DEPRECATED - Este hook existe apenas para compatibilidade retroativa.
 * Novos componentes devem usar hooks individuais:
 * - useEditor() para estado do editor
 * - useUX() para tema e navegação
 * - useAuth() para autenticação
 * 
 * @version 1.0.0
 * @deprecated Use hooks individuais ao invés deste agregador
 */

import { useMemo } from 'react';
import { useEditor } from '@/core/contexts/EditorContext';
import { useUX } from '@/contexts/consolidated/UXProvider';
import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

/**
 * Interface do contexto legado SuperUnified
 * Combina todas as propriedades dos contextos individuais
 */
export interface LegacySuperUnifiedContext {
    // ===== EDITOR STATE =====
    state: {
        editor: {
            currentStep: number;
            selectedBlockId: string | null;
            isPreviewMode: boolean;
            isEditing: boolean;
            dragEnabled: boolean;
            clipboardData: Block | null;
            stepBlocks: Record<number, Block[]>;
            dirtySteps: Record<number, boolean>;
            totalSteps: number;
            isDirty: boolean;
            lastSaved: number | null;
            lastModified: number | null;
            isLoading?: boolean;
        };
    };

    // ===== EDITOR ACTIONS =====
    setCurrentStep: (step: number) => void;
    selectBlock: (blockId: string | null) => void;
    togglePreview: (enabled?: boolean) => void;
    toggleEditing: (enabled?: boolean) => void;
    updateBlock: (step: number, blockId: string, updates: Partial<Block>) => void;
    addBlock: (step: number, block: Block, index?: number) => void;
    removeBlock: (step: number, blockId: string) => void;
    getStepBlocks: (step: number) => Block[];
    setStepBlocks: (step: number, blocks: Block[]) => void;
    markSaved: () => void;

    // ===== HISTORY/UNDO-REDO =====
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;

    // ===== UX/THEME =====
    theme: {
        mode: 'light' | 'dark';
        colors: {
            primary: string;
            secondary: string;
            accent?: string;
            background?: string;
            foreground?: string;
        };
    };
    toggleTheme: () => void;
    navigate: (url: string) => void;

    // ===== LOADING STATE =====
    isSaving: boolean;
}

/**
 * Hook legado agregador SuperUnified
 * 
 * ⚠️ DEPRECATED - Use hooks individuais:
 * - useEditor() para editor
 * - useUX() para tema/navegação
 * 
 * @returns Interface unificada com todos os contextos
 * 
 * @example
 * ```tsx
 * // ❌ Forma antiga (deprecated)
 * const { state, updateBlock, theme } = useLegacySuperUnified();
 * 
 * // ✅ Forma nova (recomendada)
 * const editor = useEditor();
 * const { theme } = useUX();
 * ```
 */
export function useLegacySuperUnified(): LegacySuperUnifiedContext {
    if (import.meta.env.DEV) {
        appLogger.warn('⚠️ useLegacySuperUnified está deprecated. Use hooks individuais: useEditor(), useUX()');
    }

    const editor = useEditor();
    const ux = useUX();

    // Memoizar o objeto para evitar re-renders desnecessários
    return useMemo(() => {
        // Estado agregado
        const state = {
            editor: {
                currentStep: editor.currentStep,
                selectedBlockId: editor.selectedBlockId,
                isPreviewMode: editor.isPreviewMode,
                isEditing: editor.isEditing,
                dragEnabled: editor.dragEnabled,
                clipboardData: editor.clipboardData,
                stepBlocks: editor.stepBlocks,
                dirtySteps: editor.dirtySteps,
                totalSteps: editor.totalSteps,
                isDirty: editor.isDirty,
                lastSaved: editor.lastSaved,
                lastModified: editor.lastModified,
                isLoading: false, // Default: não está carregando
            },
        };

        // Ações do editor
        const {
            setCurrentStep,
            selectBlock,
            togglePreview,
            toggleEditing,
            updateBlock,
            addBlock,
            removeBlock,
            getStepBlocks,
            setStepBlocks,
            markSaved,
        } = editor;

        // History/Undo-Redo (stub para compatibilidade)
        // TODO: Integrar com useUnifiedHistory quando disponível
        const canUndo = false;
        const canRedo = false;
        const undo = () => appLogger.warn('Undo not implemented in useLegacySuperUnified');
        const redo = () => appLogger.warn('Redo not implemented in useLegacySuperUnified');

        // UX/Theme - construir objeto no formato esperado
        const themeObj = {
            mode: ux.theme as 'light' | 'dark',
            colors: ux.colors,
        };

        // Auto-save status
        const isSaving = editor.isSaving || false;

        return {
            state,
            setCurrentStep,
            selectBlock,
            togglePreview,
            toggleEditing,
            updateBlock,
            addBlock,
            removeBlock,
            getStepBlocks,
            setStepBlocks,
            markSaved,
            canUndo,
            canRedo,
            undo,
            redo,
            theme: themeObj,
            toggleTheme: ux.toggleTheme,
            navigate: ux.navigate,
            isSaving,
        };
    }, [editor, ux]);
}

/**
 * Hooks auxiliares para migração gradual
 * Permitem extrair partes específicas do SuperUnified
 */

export function useMigrateAuth() {
    appLogger.warn('⚠️ useMigrateAuth deprecated - auth não está mais no SuperUnified');
    return { user: null, isAuthenticated: false };
}

export function useMigrateTheme() {
    const { theme, toggleTheme } = useUX();
    return { theme, toggleTheme };
}

export function useMigrateEditor() {
    const editor = useEditor();
    return {
        state: editor,
        actions: {
            updateBlock: editor.updateBlock,
            addBlock: editor.addBlock,
            removeBlock: editor.removeBlock,
            setCurrentStep: editor.setCurrentStep,
        },
    };
}

export default useLegacySuperUnified;
