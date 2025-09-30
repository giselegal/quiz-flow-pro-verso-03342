import { useCallback, useEffect, useRef } from 'react';

interface UseUnifiedAutoSaveOptions<T> {
    data: T;                 // Objeto monitorado (imutável ou com hash externo)
    isDirty: boolean;        // Flag externa de modificação
    onSave: () => Promise<void>;
    debounce?: number;       // ms
    enabled?: boolean;
    onState?: (s: { phase: 'idle' | 'scheduled' | 'saving'; at: number }) => void;
    hashFn?: (d: T) => string; // Para evitar salvar sem mudanças reais
}

/**
 * Hook de auto-save unificado que evita duplicação de timers entre múltiplos módulos.
 */
export function useUnifiedAutoSave<T>({
    data,
    isDirty,
    onSave,
    debounce = 2500,
    enabled = true,
    onState,
    hashFn
}: UseUnifiedAutoSaveOptions<T>) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastHashRef = useRef<string>('');
    const savingRef = useRef<boolean>(false);

    const computeHash = useCallback(() => {
        if (hashFn) return hashFn(data);
        try {
            return JSON.stringify(data);
        } catch {
            return String(Date.now());
        }
    }, [data, hashFn]);

    useEffect(() => {
        if (!enabled) return;
        if (!isDirty) return; // não agenda se não sujo

        const h = computeHash();
        if (h === lastHashRef.current) return; // nada novo

        if (timerRef.current) clearTimeout(timerRef.current);
        onState?.({ phase: 'scheduled', at: Date.now() });

        timerRef.current = setTimeout(async () => {
            if (savingRef.current) return; // evita corrida
            savingRef.current = true;
            onState?.({ phase: 'saving', at: Date.now() });
            try {
                await onSave();
                lastHashRef.current = h;
            } finally {
                savingRef.current = false;
                onState?.({ phase: 'idle', at: Date.now() });
            }
        }, debounce);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [enabled, isDirty, data, debounce, computeHash, onSave, onState]);
}
