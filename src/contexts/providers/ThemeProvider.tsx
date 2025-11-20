import React, { createContext, useContext, useReducer, ReactNode, useCallback, useMemo } from 'react';

export interface ThemeState {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
}

const initialTheme: ThemeState = {
    theme: 'light',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '8px',
};

export type ThemeAction =
    | { type: 'SET_THEME'; payload: Partial<ThemeState> }
    | { type: 'TOGGLE_MODE' };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, ...action.payload };
        case 'TOGGLE_MODE':
            return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
        default:
            return state;
    }
}

interface ThemeContextValue {
    state: ThemeState;
    setTheme: (updates: Partial<ThemeState>) => void;
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(themeReducer, initialTheme);

    const setTheme = useCallback((updates: Partial<ThemeState>) => {
        dispatch({ type: 'SET_THEME', payload: updates });
    }, []);

    const toggleMode = useCallback(() => dispatch({ type: 'TOGGLE_MODE' }), []);

    const value = useMemo(() => ({ state, setTheme, toggleMode }), [state, setTheme, toggleMode]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    return ctx;
}
