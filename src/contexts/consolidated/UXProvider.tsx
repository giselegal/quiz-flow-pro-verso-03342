/**
 * 🎨🧭 UX PROVIDER - FASE 3 CONSOLIDAÇÃO
 * 
 * Provider consolidado que unifica UIProvider + ThemeProvider + NavigationProvider
 * para gerenciamento integrado da experiência do usuário.
 * 
 * RESPONSABILIDADES UNIFICADAS:
 * - Tema (light/dark/system)
 * - UI state (sidebar, modals, toasts)
 * - Navegação e routing
 * - Responsive breakpoints
 * - Acessibilidade (a11y)
 * 
 * BENEFÍCIOS DA CONSOLIDAÇÃO:
 * - Redução de providers: 3 → 1
 * - Gestão holística da UX
 * - Estado UI unificado
 * - Menos re-renders
 * 
 * @version 3.0.0
 * @phase FASE-3
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { appLogger } from '@/lib/utils/appLogger';
import { useNavigate as useNavigateRouter, useLocation as useLocationRouter } from 'react-router-dom';

// Hook seguro que funciona com ou sem Router
const useSafeNavigate = () => {
    try {
        return useNavigateRouter();
    } catch {
        // Fallback quando Router não está disponível
        return (path: string) => {
            appLogger.warn('[UXProvider] navigate chamado sem Router, usando window.location');
            window.location.href = path;
        };
    }
};

const useSafeLocation = () => {
    try {
        return useLocationRouter();
    } catch {
        // Fallback quando Router não está disponível
        return { pathname: window.location.pathname, search: window.location.search };
    }
};

// ============================================================================
// TYPES - THEME
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    primary: string;
    secondary: string;
    accent?: string;
    background?: string;
    foreground?: string;
}

// ============================================================================
// TYPES - UI
// ============================================================================

export interface UIState {
    showSidebar: boolean;
    sidebarCollapsed: boolean;
    activeModal: string | null;
    breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isTouch: boolean;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

// ============================================================================
// TYPES - NAVIGATION
// ============================================================================

export interface NavigationItem {
    path: string;
    label: string;
    icon?: string;
    badge?: string | number;
}

export interface BreadcrumbItem {
    label: string;
    path?: string;
}

// ============================================================================
// UNIFIED CONTEXT VALUE
// ============================================================================

export interface UXContextValue {
    // Theme
    theme: ThemeMode;
    mode: ThemeMode; // Alias
    colors: ThemeColors;
    isDarkMode: boolean;
    setTheme: (mode: ThemeMode) => void;
    setColors: (colors: Partial<ThemeColors>) => void;
    toggleTheme: () => void;

    // UI State
    showSidebar: boolean;
    sidebarCollapsed: boolean;
    activeModal: string | null;
    breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isTouch: boolean;
    toasts: Toast[];

    // UI Actions
    toggleSidebar: () => void;
    collapseSidebar: (collapsed: boolean) => void;
    openModal: (modalId: string) => void;
    closeModal: () => void;
    showToast: (message: string, type?: Toast['type'], duration?: number) => void;
    dismissToast: (id: string) => void;

    // Navigation
    currentPath: string;
    navigate: (path: string) => void;
    goBack: () => void;
    goForward: () => void;
    breadcrumbs: BreadcrumbItem[];
    setBreadcrumbs: (items: BreadcrumbItem[]) => void;

    // Responsive
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;

    // Accessibility
    reducedMotion: boolean;
    highContrast: boolean;
    setReducedMotion: (enabled: boolean) => void;
    setHighContrast: (enabled: boolean) => void;
}

// ============================================================================
// CONTEXT
// ============================================================================

const UXContext = createContext<UXContextValue | null>(null);

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_COLORS: ThemeColors = {
    primary: '#432818',
    secondary: '#B89B7A',
    accent: '#E5C9A8',
    background: '#FFFFFF',
    foreground: '#000000',
};

// ============================================================================
// PROVIDER
// ============================================================================

interface UXProviderProps {
    children: ReactNode;
}

export const UXProvider: React.FC<UXProviderProps> = ({ children }) => {
    // Theme state
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('quiz-flow:theme');
        return (saved as ThemeMode) || 'system';
    });
    const [colors, setColorsState] = useState<ThemeColors>(DEFAULT_COLORS);

    // UI state
    const [uiState, setUIState] = useState<UIState>({
        showSidebar: true,
        sidebarCollapsed: false,
        activeModal: null,
        breakpoint: 'lg',
        isTouch: 'ontouchstart' in window,
    });
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

    // Accessibility state
    const [reducedMotion, setReducedMotion] = useState(false);
    const [highContrast, setHighContrast] = useState(false);

    // Navigation - usar hooks seguros
    const navigateHook = useSafeNavigate();
    const location = useSafeLocation();

    // ============================================================================
    // THEME METHODS
    // ============================================================================

    const setTheme = useCallback((mode: ThemeMode) => {
        setThemeState(mode);
        localStorage.setItem('quiz-flow:theme', mode);
        appLogger.info(`🎨 [UX] Tema alterado para: ${mode}`);
    }, []);

    const setColors = useCallback((newColors: Partial<ThemeColors>) => {
        setColorsState(prev => ({ ...prev, ...newColors }));
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }, [theme, setTheme]);

    // ============================================================================
    // UI METHODS
    // ============================================================================

    const toggleSidebar = useCallback(() => {
        setUIState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
    }, []);

    const collapseSidebar = useCallback((collapsed: boolean) => {
        setUIState(prev => ({ ...prev, sidebarCollapsed: collapsed }));
    }, []);

    const openModal = useCallback((modalId: string) => {
        setUIState(prev => ({ ...prev, activeModal: modalId }));
    }, []);

    const closeModal = useCallback(() => {
        setUIState(prev => ({ ...prev, activeModal: null }));
    }, []);

    const showToast = useCallback((
        message: string,
        type: Toast['type'] = 'info',
        duration: number = 3000
    ) => {
        const id = `toast-${Date.now()}`;
        const toast: Toast = { id, message, type, duration };

        setToasts(prev => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // ============================================================================
    // NAVIGATION METHODS
    // ============================================================================

    const navigate = useCallback((path: string) => {
        navigateHook(path);
    }, [navigateHook]);

    const goBack = useCallback(() => {
        navigateHook(-1);
    }, [navigateHook]);

    const goForward = useCallback(() => {
        navigateHook(1);
    }, [navigateHook]);

    // ============================================================================
    // COMPUTED VALUES
    // ============================================================================

    const isDarkMode = useMemo(() => {
        if (theme === 'dark') return true;
        if (theme === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }, [theme]);

    const isMobile = useMemo(() => {
        return ['xs', 'sm'].includes(uiState.breakpoint);
    }, [uiState.breakpoint]);

    const isTablet = useMemo(() => {
        return uiState.breakpoint === 'md';
    }, [uiState.breakpoint]);

    const isDesktop = useMemo(() => {
        return ['lg', 'xl'].includes(uiState.breakpoint);
    }, [uiState.breakpoint]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Apply theme to document
    useEffect(() => {
        const applyTheme = () => {
            const root = document.documentElement;

            if (theme === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.toggle('dark', prefersDark);
            } else {
                root.classList.toggle('dark', theme === 'dark');
            }

            // Apply colors
            Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
        };

        applyTheme();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', applyTheme);
            return () => mediaQuery.removeEventListener('change', applyTheme);
        }
    }, [theme, colors]);

    // Detect breakpoint changes
    useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let breakpoint: UIState['breakpoint'] = 'xs';

            if (width >= 1280) breakpoint = 'xl';
            else if (width >= 1024) breakpoint = 'lg';
            else if (width >= 768) breakpoint = 'md';
            else if (width >= 640) breakpoint = 'sm';

            setUIState(prev => ({ ...prev, breakpoint }));
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    // Detect reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const contextValue = useMemo<UXContextValue>(
        () => ({
            // Theme
            theme,
            mode: theme, // Alias
            colors,
            isDarkMode,
            setTheme,
            setColors,
            toggleTheme,

            // UI State
            showSidebar: uiState.showSidebar,
            sidebarCollapsed: uiState.sidebarCollapsed,
            activeModal: uiState.activeModal,
            breakpoint: uiState.breakpoint,
            isTouch: uiState.isTouch,
            toasts,

            // UI Actions
            toggleSidebar,
            collapseSidebar,
            openModal,
            closeModal,
            showToast,
            dismissToast,

            // Navigation
            currentPath: location.pathname,
            navigate,
            goBack,
            goForward,
            breadcrumbs,
            setBreadcrumbs,

            // Responsive
            isMobile,
            isTablet,
            isDesktop,

            // Accessibility
            reducedMotion,
            highContrast,
            setReducedMotion,
            setHighContrast,
        }),
        [
            theme,
            colors,
            isDarkMode,
            setTheme,
            setColors,
            toggleTheme,
            uiState,
            toasts,
            toggleSidebar,
            collapseSidebar,
            openModal,
            closeModal,
            showToast,
            dismissToast,
            location.pathname,
            navigate,
            goBack,
            goForward,
            breadcrumbs,
            isMobile,
            isTablet,
            isDesktop,
            reducedMotion,
            highContrast,
        ]
    );

    return (
        <UXContext.Provider value={contextValue}>
            {children}
        </UXContext.Provider>
    );
};

// ============================================================================
// HOOK
// ============================================================================

export const useUX = (): UXContextValue => {
    const context = useContext(UXContext);

    if (!context) {
        throw new Error('useUX deve ser usado dentro de UXProvider');
    }

    return context;
};

// Aliases for backward compatibility
export const useTheme = useUX;
export const useUI = useUX;
export const useNavigation = useUX;
