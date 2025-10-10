import { FunnelContext } from '@/core/contexts/FunnelContext';

/**
 * Utilitários seguros para armazenamento com namespace por contexto.
 * Chave final: `${context}:${key}`
 */
export const getContextualKey = (key: string, context: FunnelContext = FunnelContext.EDITOR) => `${context}:${key}`;

export const safeSetItem = (key: string, value: string, context: FunnelContext = FunnelContext.EDITOR) => {
    try {
        if (typeof window !== 'undefined' && window?.localStorage) {
            window.localStorage.setItem(getContextualKey(key, context), value);
        }
    } catch (e) {
        try {
            if ((import.meta as any)?.env?.DEV) {
                console.warn('localStorage.setItem falhou:', key, (e as any)?.message || e);
            }
        } catch { }
    }
};

export const safeGetItem = (key: string, context: FunnelContext = FunnelContext.EDITOR): string | null => {
    try {
        if (typeof window !== 'undefined' && window?.localStorage) {
            return window.localStorage.getItem(getContextualKey(key, context));
        }
    } catch (e) {
        try {
            if ((import.meta as any)?.env?.DEV) {
                console.warn('localStorage.getItem falhou:', key, (e as any)?.message || e);
            }
        } catch { }
    }
    return null;
};

export const safeRemoveItem = (key: string, context: FunnelContext = FunnelContext.EDITOR) => {
    try {
        if (typeof window !== 'undefined' && window?.localStorage) {
            window.localStorage.removeItem(getContextualKey(key, context));
        }
    } catch { }
};
