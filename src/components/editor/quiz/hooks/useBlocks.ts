import { useCallback } from 'react';
import { v4 as uuid } from 'uuid';

export interface BlockLike {
    id: string;
    type: string;
    order: number;
    parentId?: string | null;
    properties: Record<string, any>;
    content: Record<string, any>;
    [k: string]: any;
}

export interface StepWithBlocks<T extends BlockLike> {
    id: string;
    blocks: T[];
    [k: string]: any;
}

interface UseBlocksOptions<S extends StepWithBlocks<B>, B extends BlockLike> {
    steps: S[];
    setSteps: React.Dispatch<React.SetStateAction<S[]>>;
    pushHistory?: (next: S[]) => void;
    setDirty?: (dirty: boolean) => void;
    getSelectedStepId: () => string | undefined;
}

export function useBlocks<S extends StepWithBlocks<B>, B extends BlockLike>({ steps, setSteps, pushHistory, setDirty, getSelectedStepId }: UseBlocksOptions<S, B>) {
    const findStep = useCallback((id: string) => steps.find(s => s.id === id), [steps]);

    const addBlock = useCallback((stepId: string, partial: Partial<B> & { type: string; parentId?: string | null }) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== stepId) return st;
                const siblings = st.blocks.filter(b => (b.parentId || null) === (partial.parentId || null));
                const block: any = {
                    id: partial.id || `${partial.type}-${uuid()}`,
                    type: partial.type,
                    order: siblings.length,
                    parentId: partial.parentId || null,
                    properties: partial.properties || {},
                    content: partial.content || {}
                };
                return { ...st, blocks: [...st.blocks, block] };
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    const updateBlock = useCallback((stepId: string, blockId: string, patch: { properties?: any; content?: any }) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== stepId) return st;
                return { ...st, blocks: st.blocks.map(b => b.id === blockId ? { ...b, properties: { ...b.properties, ...patch.properties }, content: { ...b.content, ...patch.content } } as B : b) };
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    const deleteBlock = useCallback((stepId: string, blockId: string) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== stepId) return st;
                const toRemove = new Set<string>();
                toRemove.add(blockId);
                // remove recursively children
                let changed = true;
                while (changed) {
                    changed = false;
                    st.blocks.forEach(b => {
                        if (b.parentId && toRemove.has(b.parentId) && !toRemove.has(b.id)) { toRemove.add(b.id); changed = true; }
                    });
                }
                const remaining = st.blocks.filter(b => !toRemove.has(b.id));
                // re-normalize orders per parent
                const byParent: Record<string, B[]> = {} as any;
                remaining.forEach(b => {
                    const pid = (b.parentId || '__root__') as string;
                    (byParent[pid] ||= []).push(b as B);
                });
                Object.values(byParent).forEach(arr => arr.sort((a, b) => a.order - b.order).forEach((b, i) => (b.order = i)));
                return { ...st, blocks: remaining };
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    const reorderOrMove = useCallback((stepId: string, blockId: string, targetParentId: string | null, overBlockId: string | null) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== stepId) return st;
                const blocks = st.blocks.map(b => ({ ...b }));
                const targetParent = targetParentId;
                const active = blocks.find(b => b.id === blockId);
                if (!active) return st;
                let changed = false;
                if (overBlockId) {
                    const overBlock = blocks.find(b => b.id === overBlockId);
                    if (overBlock) {
                        const newParent = targetParent ?? (overBlock.parentId || null);
                        const siblings = (pid: string | null) => blocks.filter(b => (b.parentId || null) === pid).sort((a, b) => a.order - b.order);
                        const fromParent = active.parentId || null;
                        const toParent = newParent;
                        if (fromParent !== toParent) {
                            const oldSibs = siblings(fromParent).filter(b => b.id !== active.id);
                            oldSibs.forEach((b, i) => { b.order = i; });
                            const newSibs = siblings(toParent);
                            active.parentId = toParent || null;
                            active.order = newSibs.length;
                            changed = true;
                        } else {
                            const sibs = siblings(fromParent);
                            const oldIndex = sibs.findIndex(b => b.id === active.id);
                            const newIndex = sibs.findIndex(b => b.id === overBlock.id);
                            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
                                const reordered = [...sibs];
                                const [moved] = reordered.splice(oldIndex, 1);
                                reordered.splice(newIndex, 0, moved);
                                reordered.forEach((b, i) => { b.order = i; });
                                changed = true;
                            }
                        }
                    }
                }
                return changed ? { ...st, blocks } : st;
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    const duplicateBlock = useCallback((sourceStepId: string, blockId: string, targetStepId?: string) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== (targetStepId || sourceStepId)) return st;
                const sourceStep = prev.find(s => s.id === sourceStepId);
                if (!sourceStep) return st;
                const original = sourceStep.blocks.find(b => b.id === blockId);
                if (!original) return st;
                const siblings = st.blocks.filter(b => (b.parentId || null) === (original.parentId || null));
                const clone: any = { ...original, id: original.id + '-dup-' + uuid(), order: siblings.length };
                return { ...st, blocks: [...st.blocks, clone] };
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    const insertSnippetBlocks = useCallback((stepId: string, snippetBlocks: B[]) => {
        setSteps(prev => {
            const next = prev.map(st => {
                if (st.id !== stepId) return st;
                const baseLen = st.blocks.filter(b => !b.parentId).length;
                const timestamp = Date.now();
                const idMap: Record<string, string> = {};
                const cloned = snippetBlocks.map((b: any, idx: number) => { const newId = `${b.id}-snip-${timestamp}-${idx}`; idMap[b.id] = newId; return { ...b, id: newId }; })
                    .map((b: any) => ({ ...b, parentId: b.parentId ? idMap[b.parentId] : null, order: b.parentId ? b.order : baseLen + b.order }));
                return { ...st, blocks: [...st.blocks, ...cloned] };
            }) as S[];
            pushHistory?.(next);
            setDirty?.(true);
            return next;
        });
    }, [setSteps, pushHistory, setDirty]);

    return { addBlock, updateBlock, deleteBlock, reorderOrMove, duplicateBlock, insertSnippetBlocks, findStep };
}
