/**
 * 🎨 THEME PROVIDER - Gerenciamento de Temas
 * 
 * Provider independente para gerenciamento de temas e estilos globais.
 * Extraído do SuperUnifiedProvider para isolamento de responsabilidades.
 * 
 * RESPONSABILIDADES:
 * - Tema (light/dark/system)
 * - Cores primárias e secundárias
 * - Tipografia
 * - Border radius
 * - Persistência de preferências
 * 
 * BENEFÍCIOS:
 * - Re-render apenas quando tema muda
 * - Fácil de customizar
 * - Suporte a temas personalizados
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// TYPES
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    border?: string;
}

export interface ThemeTypography {
    fontFamily: string;
    fontSize?: {
        xs?: string;
        sm?: string;
        base?: string;
        lg?: string;
        xl?: string;
    };
    fontWeight?: {
        normal?: string;
        medium?: string;
        semibold?: string;
        bold?: string;
    };
}

export interface ThemeState {
    mode: ThemeMode;
    colors: ThemeColors;
    typography: ThemeTypography;
    borderRadius: string;
    customCss?: string;
}

export interface ThemeContextValue extends ThemeState {
    theme: ThemeMode; // Compat alias for mode
    setTheme: (mode: ThemeMode) => void;
    setColors: (colors: Partial<ThemeColors>) => void;
    setTypography: (typography: Partial<ThemeTypography>) => void;
    setBorderRadius: (radius: string) => void;
    setCustomCss: (css: string) => void;
    resetTheme: () => void;
    isDarkMode: boolean;
}

// ============================================================================
// DEFAULTS
// ============================================================================

const DEFAULT_THEME: ThemeState = {
    mode: 'system',
    colors: {
        primary: '#432818',
        secondary: '#B89B7A',
        accent: '#E5C9A8',
        background: '#FFFFFF',
        foreground: '#000000',
        muted: '#F5F5F5',
        border: '#E5E5E5',
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
        },
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },
    borderRadius: '0.5rem',
};

const STORAGE_KEY = 'quiz-flow-theme';

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Partial<ThemeState>;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme,
}) => {
    // Inicializar com tema salvo ou padrão
    const [state, setState] = useState<ThemeState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...DEFAULT_THEME, ...parsed, ...defaultTheme };
            }
        } catch (error) {
            appLogger.warn('⚠️ Erro ao carregar tema salvo:', error);
        }
        return { ...DEFAULT_THEME, ...defaultTheme };
    });

    // ============================================================================
    // METHODS
    // ============================================================================

    const setTheme = useCallback((mode: ThemeMode) => {
        setState(prev => ({ ...prev, mode }));
        appLogger.debug(`🎨 Tema alterado para: ${mode}`);
    }, []);

    const setColors = useCallback((colors: Partial<ThemeColors>) => {
        setState(prev => ({
            ...prev,
            colors: { ...prev.colors, ...colors },
        }));
        appLogger.debug('🎨 Cores atualizadas:', colors);
    }, []);

    const setTypography = useCallback((typography: Partial<ThemeTypography>) => {
        setState(prev => ({
            ...prev,
            typography: { ...prev.typography, ...typography },
        }));
        appLogger.debug('🎨 Tipografia atualizada:', typography);
    }, []);

    const setBorderRadius = useCallback((radius: string) => {
        setState(prev => ({ ...prev, borderRadius: radius }));
        appLogger.debug(`🎨 Border radius alterado: ${radius}`);
    }, []);

    const setCustomCss = useCallback((css: string) => {
        setState(prev => ({ ...prev, customCss: css }));
        appLogger.debug('🎨 CSS customizado atualizado');
    }, []);

    const resetTheme = useCallback(() => {
        setState(DEFAULT_THEME);
        localStorage.removeItem(STORAGE_KEY);
        appLogger.info('🎨 Tema resetado para padrão');
    }, []);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Persistir tema no localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            appLogger.warn('⚠️ Erro ao salvar tema:', error);
        }
    }, [state]);

    // Aplicar CSS variables
    useEffect(() => {
        const root = document.documentElement;

        // Aplicar cores
        Object.entries(state.colors).forEach(([key, value]) => {
            if (value) {
                root.style.setProperty(`--color-${key}`, value);
            }
        });

        // Aplicar tipografia
        if (state.typography.fontFamily) {
            root.style.setProperty('--font-family', state.typography.fontFamily);
        }

        // Aplicar border radius
        if (state.borderRadius) {
            root.style.setProperty('--border-radius', state.borderRadius);
        }

        // Aplicar CSS customizado
        if (state.customCss) {
            let styleEl = document.getElementById('custom-theme-css');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'custom-theme-css';
                document.head.appendChild(styleEl);
            }
            styleEl.textContent = state.customCss;
        }
    }, [state]);

    // Detectar preferência de sistema para dark mode
    useEffect(() => {
        if (state.mode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            document.documentElement.classList.toggle('dark', e.matches);
            appLogger.debug(`🎨 Modo sistema detectado: ${e.matches ? 'dark' : 'light'}`);
        };

        // Aplicar tema inicial
        document.documentElement.classList.toggle('dark', mediaQuery.matches);

        // Listener para mudanças
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [state.mode]);

    // Aplicar dark/light mode manual
    useEffect(() => {
        if (state.mode === 'system') return;

        document.documentElement.classList.toggle('dark', state.mode === 'dark');
    }, [state.mode]);

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const isDarkMode = useMemo(() => {
        if (state.mode === 'dark') return true;
        if (state.mode === 'light') return false;

        // System mode
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }, [state.mode]);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<ThemeContextValue>(
        () => ({
            ...state,
            theme: state.mode, // Compat alias
            setTheme,
            setColors,
            setTypography,
            setBorderRadius,
            setCustomCss,
            resetTheme,
            isDarkMode,
        }),
        [state, setTheme, setColors, setTypography, setBorderRadius, setCustomCss, resetTheme, isDarkMode]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useTheme = (): ThemeContextValue => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }

    return context;
};
