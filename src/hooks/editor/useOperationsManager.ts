import { useCallback, useRef, useState } from 'react';
import { editorEvents } from '@/events/editorEvents';

export interface OperationStatus {
    key: string;
    running: boolean;
    startedAt?: number;
    finishedAt?: number;
    error?: Error | null;
    progress?: { value: number; label?: string };
}

export interface RunOperationOptions {
    dedupe?: boolean; // impede execução se já rodando
    onProgress?: (value: number, label?: string) => void;
}

export interface UseOperationsManagerResult {
    statuses: Record<string, OperationStatus>;
    isRunning: (key: string) => boolean;
    runOperation: <T>(key: string, fn: (ctx: { setProgress: (value: number, label?: string) => void }) => Promise<T>, options?: RunOperationOptions) => Promise<T>;
    lastError?: Error | null;
}

/**
 * Gerencia operações assíncronas nomeadas com estado granular e suporte a deduplicação.
 */
export function useOperationsManager(): UseOperationsManagerResult {
    const [statuses, setStatuses] = useState<Record<string, OperationStatus>>({});
    const lastErrorRef = useRef<Error | null>(null);
    // Controle síncrono para dedupe imediato (antes de React aplicar setState)
    const runningRef = useRef<Set<string>>(new Set());

    const isRunning = useCallback((key: string) => runningRef.current.has(key) || !!statuses[key]?.running, [statuses]);

    const runOperation = useCallback(async <T,>(key: string, fn: (ctx: { setProgress: (value: number, label?: string) => void }) => Promise<T>, options?: RunOperationOptions): Promise<T> => {
        if (options?.dedupe && (runningRef.current.has(key) || isRunning(key))) {
            return Promise.reject(new Error(`Operação '${key}' já em execução`));
        }
        const startedAt = performance.now();
        editorEvents.emit('EDITOR_OPERATION_START', { key });
        runningRef.current.add(key);
        setStatuses(prev => ({
            ...prev,
            [key]: { key, running: true, startedAt, error: null, progress: { value: 0 } }
        }));

        const setProgress = (value: number, label?: string) => {
            setStatuses(prev => ({
                ...prev,
                [key]: { ...prev[key], progress: { value: Math.min(100, Math.max(0, value)), label } }
            }));
            options?.onProgress?.(value, label);
        };

        try {
            const result = await fn({ setProgress });
            const finishedAt = performance.now();
            setStatuses(prev => ({
                ...prev,
                [key]: { ...prev[key], running: false, finishedAt, progress: { value: 100, label: prev[key].progress?.label }, error: null }
            }));
            runningRef.current.delete(key);
            editorEvents.emit('EDITOR_OPERATION_END', { key, durationMs: finishedAt - startedAt });
            return result;
        } catch (e: any) {
            const error = e instanceof Error ? e : new Error(String(e));
            lastErrorRef.current = error;
            const finishedAt = performance.now();
            setStatuses(prev => ({
                ...prev,
                [key]: { ...prev[key], running: false, finishedAt, error }
            }));
            runningRef.current.delete(key);
            editorEvents.emit('EDITOR_OPERATION_END', { key, durationMs: finishedAt - startedAt, error: error.message });
            throw error;
        }
    }, [isRunning]);

    return {
        statuses,
        isRunning,
        runOperation,
        lastError: lastErrorRef.current
    };
}

export default useOperationsManager;
