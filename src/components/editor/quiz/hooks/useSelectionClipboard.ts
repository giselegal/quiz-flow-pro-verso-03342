import { useCallback, useEffect, useRef, useState } from 'react';

// Definições locais mínimas para evitar dependência externa não existente
export interface BlockComponent { id: string; type: string; order: number; parentId?: string | null; properties: Record<string, any>; content: Record<string, any>; }
export interface EditableQuizStep { id: string; type: string; order: number; blocks: BlockComponent[]; }

export interface UseSelectionClipboardOptions {
    steps: EditableQuizStep[];
    selectedStepId: string | null;
    setSteps: React.Dispatch<React.SetStateAction<EditableQuizStep[]>>;
    pushHistory: (next: EditableQuizStep[]) => void;
    onDirty?: () => void;
}

export interface UseSelectionClipboardApi {
    selectedBlockId: string;
    setSelectedBlockId: (id: string) => void;
    multiSelectedIds: string[];
    isSelected: (id: string) => boolean;
    isMultiSelected: (id: string) => boolean;
    handleBlockClick: (e: React.MouseEvent, block: BlockComponent, orderedBlocks: BlockComponent[]) => void;
    clearSelection: () => void;
    copy: (ids?: string[]) => void;
    paste: (stepId?: string) => void;
    removeSelected: () => void;
    clipboard: BlockComponent[] | null;
}

/**
 * Gerencia seleção simples, multi-seleção com Shift/Ctrl, clipboard (copy/paste) e remoção em lote.
 * Mantém histórico centralizado via pushHistory.
 */
export function useSelectionClipboard(opts: UseSelectionClipboardOptions): UseSelectionClipboardApi {
    const { steps, selectedStepId, setSteps, pushHistory, onDirty } = opts;
    const [selectedBlockId, setSelectedBlockId] = useState('');
    const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);
    const [clipboard, setClipboard] = useState<BlockComponent[] | null>(null);
    const lastStepRef = useRef<string | null>(null);

    // Limpa seleção ao trocar de step
    useEffect(() => {
        if (selectedStepId && lastStepRef.current && selectedStepId !== lastStepRef.current) {
            setSelectedBlockId('');
            setMultiSelectedIds([]);
        }
        lastStepRef.current = selectedStepId;
    }, [selectedStepId]);

    const isSelected = useCallback((id: string) => selectedBlockId === id, [selectedBlockId]);
    const isMultiSelected = useCallback((id: string) => multiSelectedIds.includes(id), [multiSelectedIds]);
    const clearSelection = useCallback(() => { setSelectedBlockId(''); setMultiSelectedIds([]); }, []);

    const handleBlockClick = useCallback((e: React.MouseEvent, block: BlockComponent, orderedBlocks: BlockComponent[]) => {
        e.stopPropagation();
        const isShift = e.shiftKey;
        const isMeta = e.metaKey || (e as any).ctrlKey;
        if (!isShift && !isMeta) {
            setSelectedBlockId(block.id);
            setMultiSelectedIds([]);
            return;
        }
        if (isShift) {
            const last = multiSelectedIds.length ? multiSelectedIds[multiSelectedIds.length - 1] : (selectedBlockId || block.id);
            const startIndex = orderedBlocks.findIndex(b => b.id === last);
            const endIndex = orderedBlocks.findIndex(b => b.id === block.id);
            if (startIndex === -1 || endIndex === -1) return;
            const [from, to] = startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
            const range = orderedBlocks.slice(from, to + 1).map(b => b.id);
            setMultiSelectedIds(prev => Array.from(new Set([...prev, ...range])));
            setSelectedBlockId(block.id);
            return;
        }
        if (isMeta) {
            setSelectedBlockId(block.id);
            setMultiSelectedIds(prev => prev.includes(block.id) ? prev.filter(id => id !== block.id) : [...prev, block.id]);
        }
    }, [multiSelectedIds, selectedBlockId]);

    const copy = useCallback((ids?: string[]) => {
        const step = steps.find(s => s.id === selectedStepId);
        if (!step) return;
        const sourceIds = ids?.length ? ids : (multiSelectedIds.length ? multiSelectedIds : (selectedBlockId ? [selectedBlockId] : []));
        if (!sourceIds.length) return;
        const blocks = step.blocks.filter((b: BlockComponent) => sourceIds.includes(b.id));
        setClipboard(blocks.map((b: BlockComponent) => JSON.parse(JSON.stringify(b))));
    }, [steps, selectedStepId, multiSelectedIds, selectedBlockId]);

    const paste = useCallback((stepId?: string) => {
        const targetStepId = stepId || selectedStepId;
        if (!clipboard || !clipboard.length || !targetStepId) return;
        setSteps(prev => {
            const next = prev.map(s => {
                if (s.id !== targetStepId) return s;
                const baseLen = s.blocks.length;
                const clones = clipboard.map((b, i) => ({
                    ...b,
                    id: `${b.id}-paste-${Date.now()}-${i}`,
                    order: baseLen + i
                }));
                return { ...s, blocks: [...s.blocks, ...clones] };
            });
            pushHistory(next);
            onDirty?.();
            return next;
        });
    }, [clipboard, selectedStepId, setSteps, pushHistory, onDirty]);

    const removeSelected = useCallback(() => {
        const step = steps.find(s => s.id === selectedStepId);
        const ids = multiSelectedIds.length ? multiSelectedIds : (selectedBlockId ? [selectedBlockId] : []);
        if (!step || !ids.length) return;
        setSteps(prev => {
            const next = prev.map(s => s.id === step.id ? { ...s, blocks: s.blocks.filter((b: BlockComponent) => !ids.includes(b.id)) } : s);
            pushHistory(next);
            onDirty?.();
            return next;
        });
        setMultiSelectedIds([]);
        if (ids.includes(selectedBlockId)) setSelectedBlockId('');
    }, [steps, selectedStepId, multiSelectedIds, selectedBlockId, setSteps, pushHistory, onDirty]);

    return {
        selectedBlockId,
        setSelectedBlockId,
        multiSelectedIds,
        isSelected,
        isMultiSelected,
        handleBlockClick,
        clearSelection,
        copy,
        paste,
        removeSelected,
        clipboard
    };
}
