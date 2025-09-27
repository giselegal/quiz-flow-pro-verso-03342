/**
 * 🎨 THEME PROVIDER COMPONENT
 * 
 * Provedor de contexto para aplicar a nova identidade visual
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme, Theme } from '@/styles/themes';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext deve ser usado dentro de ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: 'dark' | 'light';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
    children, 
    defaultTheme = 'dark' 
}) => {
    const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>(defaultTheme);

    const toggleTheme = () => {
        setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

    // Aplicar classes CSS globais baseadas no tema
    useEffect(() => {
        const root = document.documentElement;
        
        // Aplicar variáveis CSS customizadas
        root.style.setProperty('--theme-background', theme.colors.background);
        root.style.setProperty('--theme-text', theme.colors.text);
        root.style.setProperty('--theme-details-minor', theme.colors.detailsMinor);
        root.style.setProperty('--theme-glow-effect', theme.colors.glowEffect);
        root.style.setProperty('--theme-buttons', theme.colors.buttons);
        root.style.setProperty('--theme-accent', theme.colors.accent);

        // Aplicar classe tema no body
        document.body.className = `theme-${currentTheme}`;

        // Aplicar estilos de fundo no body
        document.body.style.backgroundColor = theme.colors.background;
        document.body.style.color = theme.colors.text;
        
    }, [currentTheme, theme]);

    return (
        <ThemeContext.Provider value={{ 
            theme, 
            toggleTheme, 
            isLight: currentTheme === 'light' 
        }}>
            <div className={`theme-${currentTheme} min-h-screen`}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};