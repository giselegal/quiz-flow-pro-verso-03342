import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useEditor } from '@/components/editor/provider-alias';

/**
 * EditorCoreProvider (V2 - Placeholder Fase 1)
 * ------------------------------------------
 * Objetivo: Centralizar futuramente stepBlocks, currentStep, seleção e operações.
 * Nesta fase inicial, apenas expõe shape mínimo para permitir migração incremental
 * sem quebrar a cadeia de composição do editor existente.
 */

export interface EditorCoreState {
    version: string;
    initialized: boolean;
    createdAt: number;
    // Espelhados (read-only nesta fase) do EditorProvider
    currentStep: number;
    totalSteps: number;
    stepKeys: string[];
    stepBlocksHash: string; // Hash leve para detectar mudanças
    selectedBlockId?: string | null;
}

interface EditorCoreContextValue {
    state: EditorCoreState;
    markInitialized(): void;
    coreActions: {
        addBlock(stepKey: string, block: any): void;
        updateBlock(stepKey: string, blockId: string, updates: Record<string, any>): void;
        removeBlock(stepKey: string, blockId: string): void;
        reorderBlocks(stepKey: string, sourceIndex: number, targetIndex: number): void;
    };
}

const EditorCoreContext = createContext<EditorCoreContextValue | null>(null);

export const EditorCoreProvider: React.FC<{ children: React.ReactNode; funnelId?: string }> = ({ children }) => {
    const { state: editorState, actions: editorActions } = useEditor();
    const [initialized, setInitialized] = useState(false);
    const [hash, setHash] = useState('');

    // Hash leve (não criptográfico) baseado em tamanhos e tipos — evita custo de JSON completo aqui.
    useEffect(() => {
        const keys = Object.keys(editorState.stepBlocks || {});
        const sig = keys
            .sort()
            .map(k => {
                const arr = (editorState.stepBlocks as any)[k] || [];
                return `${k}:${arr.length}:${arr.map((b: any) => b.type).join(',')}`;
            })
            .join('|');
        // Fowler–Noll–Vo hash (FNV-1a) simples
        let h = 2166136261;
        for (let i = 0; i < sig.length; i++) {
            h ^= sig.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        setHash((h >>> 0).toString(16));
    }, [editorState.stepBlocks]);

    const value = useMemo<EditorCoreContextValue>(() => {
        const stepKeys = Object.keys(editorState.stepBlocks || {}).sort();
        return {
            state: {
                version: 'core-v2-alpha',
                initialized,
                createdAt: Date.now(),
                currentStep: editorState.currentStep || 1,
                totalSteps: stepKeys.length,
                stepKeys,
                stepBlocksHash: hash,
                selectedBlockId: editorState.selectedBlockId || null
            },
            markInitialized: () => setInitialized(true),
            coreActions: {
                addBlock: (stepKey: string, block: any) => editorActions?.addBlock?.(stepKey, block),
                updateBlock: (stepKey: string, blockId: string, updates: Record<string, any>) => editorActions?.updateBlock?.(stepKey, blockId, updates),
                removeBlock: (stepKey: string, blockId: string) => editorActions?.removeBlock?.(stepKey, blockId),
                reorderBlocks: (stepKey: string, sourceIndex: number, targetIndex: number) => editorActions?.reorderBlocks?.(stepKey, sourceIndex, targetIndex)
            }
        };
    }, [initialized, editorState.currentStep, editorState.stepBlocks, editorState.selectedBlockId, hash, editorActions]);

    return (
        <EditorCoreContext.Provider value={value}>
            {/**
             * TODO (Fase 3): Substituir delegações em coreActions por implementação nativa
             * após migração completa do estado para EditorCoreProvider.
             * Segurança: chamadas são no-op se editorActions não expuser método.
             */}
            {children}
        </EditorCoreContext.Provider>
    );
};

export function useEditorCore(): EditorCoreContextValue {
    const ctx = useContext(EditorCoreContext);
    if (!ctx) throw new Error('useEditorCore deve ser usado dentro de <EditorCoreProvider>');
    return ctx;
}
