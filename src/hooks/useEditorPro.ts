import { useState, useCallback, useEffect } from 'react';

/**
 * 🚀 useEditorPro - Hook para gerenciar funcionalidades avançadas do Editor IA Pro
 * 
 * Controla:
 * - Templates IA sidebar
 * - Brand Kit sidebar  
 * - Analytics dashboard
 * - Estados de loading/erro
 * - Persistência de preferências
 */

interface UseEditorProState {
    isTemplatesIAOpen: boolean;
    isBrandKitOpen: boolean;
    isAnalyticsOpen: boolean;
    isLoading: boolean;
    error: string | null;
}

interface UseEditorProActions {
    toggleTemplatesIA: () => void;
    toggleBrandKit: () => void;
    toggleAnalytics: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

type UseEditorPro = UseEditorProState & UseEditorProActions;

const STORAGE_KEY = 'editor-pro-preferences';

export const useEditorPro = (): UseEditorPro => {
    // 🎯 Estado principal
    const [state, setState] = useState<UseEditorProState>(() => {
        // Restaurar preferências do localStorage
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    isTemplatesIAOpen: parsed.isTemplatesIAOpen || false,
                    isBrandKitOpen: parsed.isBrandKitOpen || false,
                    isAnalyticsOpen: parsed.isAnalyticsOpen || false,
                    isLoading: false,
                    error: null
                };
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar preferências do Editor Pro:', error);
        }

        // Estado padrão
        return {
            isTemplatesIAOpen: false,
            isBrandKitOpen: false,
            isAnalyticsOpen: false,
            isLoading: false,
            error: null
        };
    });

    // 📝 Persistir preferências quando mudarem
    useEffect(() => {
        try {
            const preferences = {
                isTemplatesIAOpen: state.isTemplatesIAOpen,
                isBrandKitOpen: state.isBrandKitOpen,
                isAnalyticsOpen: state.isAnalyticsOpen
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.warn('⚠️ Erro ao salvar preferências do Editor Pro:', error);
        }
    }, [state.isTemplatesIAOpen, state.isBrandKitOpen, state.isAnalyticsOpen]);

    // 🤖 Toggle Templates IA
    const toggleTemplatesIA = useCallback(() => {
        setState(prev => ({
            ...prev,
            isTemplatesIAOpen: !prev.isTemplatesIAOpen,
            // Fechar outros painéis se necessário (opcional)
            // isBrandKitOpen: false,
            // isAnalyticsOpen: false
        }));
    }, []);

    // 🎨 Toggle Brand Kit
    const toggleBrandKit = useCallback(() => {
        setState(prev => ({
            ...prev,
            isBrandKitOpen: !prev.isBrandKitOpen,
            // Fechar outros painéis se necessário (opcional)
            // isTemplatesIAOpen: false,
            // isAnalyticsOpen: false
        }));
    }, []);

    // 📊 Toggle Analytics
    const toggleAnalytics = useCallback(() => {
        setState(prev => ({
            ...prev,
            isAnalyticsOpen: !prev.isAnalyticsOpen
        }));
    }, []);

    // 🔄 Set Loading
    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({
            ...prev,
            isLoading: loading
        }));
    }, []);

    // ⚠️ Set Error
    const setError = useCallback((error: string | null) => {
        setState(prev => ({
            ...prev,
            error,
            isLoading: false
        }));
    }, []);

    // 🎯 Shortcuts de teclado (opcional)
    useEffect(() => {
        const handleKeyboard = (event: KeyboardEvent) => {
            // Ctrl/Cmd + Shift + T = Templates IA
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
                event.preventDefault();
                toggleTemplatesIA();
            }

            // Ctrl/Cmd + Shift + B = Brand Kit
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'B') {
                event.preventDefault();
                toggleBrandKit();
            }

            // Ctrl/Cmd + Shift + A = Analytics
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
                event.preventDefault();
                toggleAnalytics();
            }
        };

        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [toggleTemplatesIA, toggleBrandKit, toggleAnalytics]);

    return {
        ...state,
        toggleTemplatesIA,
        toggleBrandKit,
        toggleAnalytics,
        setLoading,
        setError
    };
};