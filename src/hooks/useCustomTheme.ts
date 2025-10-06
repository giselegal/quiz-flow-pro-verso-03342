/**
 * 🎨 CUSTOM THEME PROVIDER - Solução para problemas do useTheme do Chakra UI
 * 
 * Fornece uma alternativa estável ao useTheme que não está disponível na versão atual
 */

import React, { createContext, useContext } from 'react';

// 🎨 Tema customizado que substitui o useTheme do Chakra UI
export const customTheme = {
    colors: {
        primary: '#4299e1',
        secondary: '#ed8936',
        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1',
        gray: {
            50: '#f7fafc',
            100: '#edf2f7',
            200: '#e2e8f0',
            300: '#cbd5e0',
            400: '#a0aec0',
            500: '#718096',
            600: '#4a5568',
            700: '#2d3748',
            800: '#1a202c',
            900: '#171923'
        },
        blue: {
            50: '#ebf8ff',
            100: '#bee3f8',
            200: '#90cdf4',
            300: '#63b3ed',
            400: '#4299e1',
            500: '#3182ce',
            600: '#2b77cb',
            700: '#2c5aa0',
            800: '#2a4365',
            900: '#1a365d'
        }
    },
    fonts: {
        heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
        '5xl': '48px',
        '6xl': '64px'
    },
    spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
        32: '128px'
    },
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
    },
    radii: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '50%'
    }
};

// Context para o tema customizado
const CustomThemeContext = createContext(customTheme);

// Provider do tema customizado
export const CustomThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return React.createElement(
        CustomThemeContext.Provider,
        { value: customTheme },
        children
    );
};

// Hook customizado que substitui o useTheme do Chakra UI
export const useCustomTheme = () => {
    const theme = useContext(CustomThemeContext);
    if (!theme) {
        throw new Error('useCustomTheme deve ser usado dentro de CustomThemeProvider');
    }
    return theme;
};

// Hook alias que pode ser usado como drop-in replacement
export const useTheme = useCustomTheme;

export default customTheme;