import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

export interface FunnelStepMeta {
    id: string;
    index: number;
    title?: string;
    slug?: string;
}

export interface FunnelState {
    currentStepId: string | null;
    steps: FunnelStepMeta[];
    isLoading: boolean;
    error: string | null;
}

const initialFunnel: FunnelState = {
    currentStepId: null,
    steps: [],
    isLoading: false,
    error: null,
};

export type FunnelAction =
    | { type: 'SET_CURRENT_STEP'; payload: string | null }
    | { type: 'SET_STEPS'; payload: FunnelStepMeta[] }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

function funnelReducer(state: FunnelState, action: FunnelAction): FunnelState {
    switch (action.type) {
        case 'SET_CURRENT_STEP':
            return { ...state, currentStepId: action.payload };
        case 'SET_STEPS':
            return { ...state, steps: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        default:
            return state;
    }
}

interface FunnelContextValue {
    state: FunnelState;
    setCurrentStep: (id: string | null) => void;
    setSteps: (steps: FunnelStepMeta[]) => void;
    loadInitialSteps: (metas: FunnelStepMeta[]) => void;
}

const FunnelContext = createContext<FunnelContextValue | undefined>(undefined);

export const FunnelProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(funnelReducer, initialFunnel);

    const setCurrentStep = useCallback((id: string | null) => {
        dispatch({ type: 'SET_CURRENT_STEP', payload: id });
    }, []);

    const setSteps = useCallback((steps: FunnelStepMeta[]) => {
        dispatch({ type: 'SET_STEPS', payload: steps });
    }, []);

    const loadInitialSteps = useCallback((metas: FunnelStepMeta[]) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            dispatch({ type: 'SET_STEPS', payload: metas });
            if (metas.length) dispatch({ type: 'SET_CURRENT_STEP', payload: metas[0].id });
        } catch (e: any) {
            appLogger.warn('[FunnelProvider] Falha carregar steps', { data: [{ error: e?.message }] });
            dispatch({ type: 'SET_ERROR', payload: e?.message || 'Erro carregar steps' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const value = useMemo(() => ({ state, setCurrentStep, setSteps, loadInitialSteps }), [state, setCurrentStep, setSteps, loadInitialSteps]);

    return <FunnelContext.Provider value={value}>{children}</FunnelContext.Provider>;
};

export function useFunnel() {
    const ctx = useContext(FunnelContext);
    if (!ctx) throw new Error('useFunnel deve ser usado dentro de FunnelProvider');
    return ctx;
}
