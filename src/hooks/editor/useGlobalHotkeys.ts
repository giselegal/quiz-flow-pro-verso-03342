import { useEffect } from 'react';

export interface HotkeyHandler {
    (e: KeyboardEvent): void;
}

/**
 * Registra um listener global de teclado com cleanup automático.
 * Usa capture=true para precedência quando necessário.
 */
export function useGlobalHotkeys(handler: HotkeyHandler, deps: unknown[] = [], options: AddEventListenerOptions = { capture: true }) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const fn = (e: KeyboardEvent) => handler(e);
        window.addEventListener('keydown', fn, options);
        return () => window.removeEventListener('keydown', fn, options as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

export default useGlobalHotkeys;
