import { useEffect, useRef, useState } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

/**
 * Hook responsável por gerenciar edição local (batch) de props de um componente.
 * Extrai a lógica existente do TemplateEngineEditor para reaproveitar no novo layout 4 colunas.
 */
export interface UseComponentEditingStateParams<TPatch extends Record<string, any>> {
    componentId: string | null;
    // Objeto de props atual vindas do servidor (imutável para o hook; useEffect reage a mudanças de referência)
    serverProps: Record<string, any> | undefined;
    // Mutation para aplicar patch de props (assíncrona)
    updateMutation: UseMutationResult<any, any, TPatch, any> | undefined;
    debounceMs?: number;
}

export interface ComponentEditingState<TPatch extends Record<string, any>> {
    localProps: Record<string, any>;
    dirtyKeys: Set<string>;
    isFlushing: boolean;
    lastSavedAt: number | null;
    markChange: (key: string, value: any) => void;
    flush: (now?: boolean) => void;
    revertChanges: () => void;
    buildPatch: () => TPatch;
}

export function useComponentEditingState<TPatch extends Record<string, any> = Record<string, any>>({
    componentId,
    serverProps,
    updateMutation,
    debounceMs = 700
}: UseComponentEditingStateParams<TPatch>): ComponentEditingState<TPatch> {
    const [localProps, setLocalProps] = useState<Record<string, any>>({});
    const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
    const [isFlushing, setIsFlushing] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sincroniza quando muda componente ou serverProps ref
    useEffect(() => {
        if (!componentId) {
            setLocalProps({});
            setDirtyKeys(new Set());
            return;
        }
        setLocalProps({ ...(serverProps || {}) });
        setDirtyKeys(new Set());
    }, [componentId, serverProps]);

    function markChange(key: string, value: any) {
        setLocalProps(prev => ({ ...prev, [key]: value }));
        setDirtyKeys(prev => {
            const next = new Set(prev);
            const serverVal = serverProps ? serverProps[key] : undefined;
            if (JSON.stringify(serverVal) === JSON.stringify(value)) next.delete(key); else next.add(key);
            return next;
        });
    }

    function buildPatch(): TPatch {
        const patch: Record<string, any> = {};
        dirtyKeys.forEach(k => { patch[k] = localProps[k]; });
        return patch as TPatch;
    }

    function flush(now = false) {
        if (!updateMutation || dirtyKeys.size === 0) return;
        const patch = buildPatch();
        if (Object.keys(patch).length === 0) return;
        setIsFlushing(true);
        updateMutation.mutate(patch, {
            onSettled: () => setIsFlushing(false),
            onSuccess: () => {
                setLastSavedAt(Date.now());
                setDirtyKeys(new Set());
            }
        });
        if (now && debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
    }

    // Debounce automático
    useEffect(() => {
        if (dirtyKeys.size === 0) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => flush(), debounceMs);
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [Array.from(dirtyKeys).join('|'), localProps, debounceMs]);

    function revertChanges() {
        if (!componentId) return;
        setLocalProps({ ...(serverProps || {}) });
        setDirtyKeys(new Set());
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
            debounceRef.current = null;
        }
    }

    return {
        localProps,
        dirtyKeys,
        isFlushing,
        lastSavedAt,
        markChange,
        flush,
        revertChanges,
        buildPatch
    };
}
