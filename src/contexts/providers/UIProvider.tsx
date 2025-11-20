import React, { createContext, useContext, useReducer, useCallback, useMemo, ReactNode } from 'react';
import { generateNotificationId } from '@/lib/utils/idGenerator';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number; // ms, -1 = persistente
}

export interface UIState {
    showSidebar: boolean;
    showPropertiesPanel: boolean;
    activeModal: string | null;
    toasts: ToastMessage[];
    isLoading: boolean;
    loadingMessage: string;
}

const initialUIState: UIState = {
    showSidebar: true,
    showPropertiesPanel: false,
    activeModal: null,
    toasts: [],
    isLoading: false,
    loadingMessage: '',
};

export type UIAction =
    | { type: 'SET_UI_STATE'; payload: Partial<UIState> }
    | { type: 'ADD_TOAST'; payload: ToastMessage }
    | { type: 'REMOVE_TOAST'; payload: string };

function uiReducer(state: UIState, action: UIAction): UIState {
    switch (action.type) {
        case 'SET_UI_STATE':
            return { ...state, ...action.payload };
        case 'ADD_TOAST':
            return { ...state, toasts: [...state.toasts, action.payload] };
        case 'REMOVE_TOAST':
            return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
        default:
            return state;
    }
}

interface UIContextValue {
    state: UIState;
    setUIState: (updates: Partial<UIState>) => void;
    toggleSidebar: () => void;
    togglePropertiesPanel: () => void;
    showModal: (modal: string | null) => void;
    showToast: (toast: Omit<ToastMessage, 'id'>) => void;
    removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(uiReducer, initialUIState);

    const setUIState = useCallback((updates: Partial<UIState>) => {
        dispatch({ type: 'SET_UI_STATE', payload: updates });
    }, []);

    const toggleSidebar = useCallback(() => {
        dispatch({ type: 'SET_UI_STATE', payload: { showSidebar: !state.showSidebar } });
    }, [state.showSidebar]);

    const togglePropertiesPanel = useCallback(() => {
        dispatch({ type: 'SET_UI_STATE', payload: { showPropertiesPanel: !state.showPropertiesPanel } });
    }, [state.showPropertiesPanel]);

    const showModal = useCallback((modal: string | null) => {
        dispatch({ type: 'SET_UI_STATE', payload: { activeModal: modal } });
    }, []);

    const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = generateNotificationId();
        const full: ToastMessage = { ...toast, id };
        dispatch({ type: 'ADD_TOAST', payload: full });
        if (toast.duration !== -1) {
            setTimeout(() => dispatch({ type: 'REMOVE_TOAST', payload: id }), toast.duration || 3000);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
    }, []);

    const value = useMemo(() => ({
        state,
        setUIState,
        toggleSidebar,
        togglePropertiesPanel,
        showModal,
        showToast,
        removeToast,
    }), [state, setUIState, toggleSidebar, togglePropertiesPanel, showModal, showToast, removeToast]);

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export function useUI() {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error('useUI deve ser usado dentro de UIProvider');
    return ctx;
}
